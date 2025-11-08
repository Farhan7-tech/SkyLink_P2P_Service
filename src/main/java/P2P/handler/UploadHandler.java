package P2P.handler;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


import P2P.Service.FileSharer;
import P2P.Utils.MultiParser;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class UploadHandler implements HttpHandler {
    private final String uploadDir;
    private final FileSharer fileSharer;
    // Maximum file size: 500MB, that's the max users can upload
    private static final long MAX_FILE_SIZE = 500L * 1024 * 1024; // 500MB in bytes

    private static final int MAX_UPLOADS_PER_MINUTE = 10; // Maximum uploads allowed per minute, user can only upload 10 files per minutes.
    private static final long ONE_MINUTE_MS = 60_000; // One minute in milliseconds

    // Allowed file extensions
    private static final String[] ALLOWED_EXTENSIONS = {
            ".txt", ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".zip", ".doc", ".docx", ".csv"
    };
    //Allowed MIME (Multipurpose Internet Mail Extensions) types (security whitelist)
    private static final String[] ALLOWED_MIME_TYPES = {
            "text/plain", "application/pdf", "image/jpeg", "image/png", "image/gif",
            "application/zip", "application/x-zip-compressed", "application/x-zip", "application/octet-stream",
            "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/csv"
    };

    // This class stores info about uploads for one IP
    private static class UploadInfo {
        long minuteWindowStart; // When the current minute started
        int uploadCount;        // How many uploads so far in this minute
        UploadInfo(long minuteWindowStart) {
            this.minuteWindowStart = minuteWindowStart;
            this.uploadCount = 1;
        }
    }

    // This map keeps track of each IP's upload info
    // Key: IP address, Value: UploadInfo object
    private static final ConcurrentHashMap<String, UploadInfo> uploadTracker = new ConcurrentHashMap<>();

   // initializing the uploadDir and fileSharer , whatever it passed from file controller.
    public UploadHandler(String uploadDir, FileSharer fileSharer) {
        this.uploadDir = uploadDir;
        this.fileSharer = fileSharer;
    }

    // Helper method to check if file extension is allowed
    private boolean isAllowedExtension(String filename) {
        if (filename == null) return false;
        String lower = filename.toLowerCase();
        for (String extention : ALLOWED_EXTENSIONS) {
            if (lower.endsWith(extention)) {
                return true;
            }
        }
        return false;
    }

    // Helper method to check if MIME type is allowed
    private boolean isAllowedMimeType(String mimeType) {
        if (mimeType == null) return false;
        for (String allowed : ALLOWED_MIME_TYPES) {
            if (mimeType.toLowerCase().startsWith(allowed.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*"); //This allows any website (any origin) to make requests to your server.
        headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS"); //This tells browsers which HTTP methods are allowed for cross-origin requests
        headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization"); // This tells browsers which custom headers the frontend is allowed to send in the actual request.

        // Handle CORS preflight for this route
        /* Without this, the browser would block your frontend’s request because it didn’t get permission from the backend.
           So, this snippet is essential for enabling CORS in my file-sharing app.
           Browsers send a preflight OPTIONS request when the main request is considered “non-simple. like here because we are
           sharing something”*/
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) { /* This line checks what type of request it is.
          It means: “Is this an HTTP OPTIONS request?” The browser automatically sends an OPTIONS request before certain types of
          requests (like a POST with a file upload). This pre-check request is called a CORS Preflight Request.
          This request does not contain any actual data, just a permission check.*/
            exchange.sendResponseHeaders(204, -1); /* It means: “Request handled successfully, but no response body.”
            This tells the server not to send any kind of body with the response.
            Stops further code execution — because we only wanted to answer the preflight check.*/
            return;
        }

        /*because we are dealing with upload , which should be a post request, so we are checking for POST method,
          if the request we received at /upload with GET method , we are not allowed that request to pass through*/
        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            String response = "Method Not Allowed";
            // first setting up the response headers
            exchange.sendResponseHeaders(405, response.getBytes().length);
            //then setting up the response body.
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }

            return;
        }

        // Get the user's IP address
        String userIp = exchange.getRemoteAddress().getAddress().getHostAddress();
        long currentTime = System.currentTimeMillis();

        // Look up this IP in our tracker map
        UploadInfo info = uploadTracker.get(userIp);

        if (info == null) {
            // First upload from this IP, start a new minute window
            info = new UploadInfo(currentTime);
            uploadTracker.put(userIp, info);
        } else if (currentTime - info.minuteWindowStart > ONE_MINUTE_MS) {
            // It's a new minute, reset the counter
            info.minuteWindowStart = currentTime;
            info.uploadCount = 1;
        } else {
            // Still in the same minute, increase the count
            info.uploadCount++;
            if (info.uploadCount > MAX_UPLOADS_PER_MINUTE) {
                // Too many uploads! Block this request , Rate limiting happens here
                String response = "Rate limit exceeded: Max " + MAX_UPLOADS_PER_MINUTE + " uploads per minute you can do.";
                exchange.sendResponseHeaders(429, response.getBytes().length); // 429 Too Many Requests
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
        }

        // fetching out the value of content type from request body
        Headers requestHeaders = exchange.getRequestHeaders();
        String contentType = null;
        for (String key : requestHeaders.keySet()) {
            if (key != null && key.equalsIgnoreCase("Content-Type")) {
                contentType = requestHeaders.getFirst(key);
                break;
            }
        }

        //validating the value of content type , it should be multipart/form-data
        if (contentType == null || !contentType.startsWith("multipart/form-data")) {
            String response = "Bad Request: Content-Type must be multipart/form-data";
            exchange.sendResponseHeaders(400, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
            return;
        }

        // first line of defense , if Content-Length header is available , we read that length , if grater than max , we reject
        String contentLength = exchange.getRequestHeaders().getFirst("Content-Length");
        if (contentLength != null) {
            long len = Long.parseLong(contentLength);
            if (len > MAX_FILE_SIZE) {
                // Reject immediately without reading
                String response = "File too large: Maximum file size is " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB";
                exchange.sendResponseHeaders(413, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
        }

        try {
            // Boundary extraction from Content-Type
            int bIdx = contentType.toLowerCase().indexOf("boundary=");
            if (bIdx == -1) {
                String response = "Bad Request: boundary missing in Content-Type";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
            String boundary = contentType.substring(bIdx + 9).trim();
            int scIdx = boundary.indexOf(';');
            if (scIdx != -1) boundary = boundary.substring(0, scIdx).trim();
            if (boundary.startsWith("\"") && boundary.endsWith("\"")) {
                boundary = boundary.substring(1, boundary.length() - 1);
            }

            // Check 2: Read request body with size limit (second line of defense)
            ByteArrayOutputStream baos = new ByteArrayOutputStream(); // array of bytes which can be acted as a stream, you can apply streams operation like reading.
            byte[] buffer = new byte[8192];
            int bytesRead;
            long totalBytesRead = 0;

            while ((bytesRead = exchange.getRequestBody().read(buffer)) != -1) {
                totalBytesRead += bytesRead;
                if (totalBytesRead > MAX_FILE_SIZE) {
                    String response = "File too large: Maximum file size is " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB";
                    exchange.sendResponseHeaders(413, response.getBytes().length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                    return;
                }
                baos.write(buffer, 0, bytesRead);
            }
            byte[] requestData = baos.toByteArray();

            MultiParser multiParser = new MultiParser(requestData, boundary);
            MultiParser.ParseResult result = multiParser.parse();

            if (result == null) {
                String response = "Bad request: Could not parse file content";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            // Check 3: Validate actual file content size (third line of defense)
            if (result.fileContent != null && result.fileContent.length > MAX_FILE_SIZE) {
                String response = "File too large: Maximum file size is " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB";
                exchange.sendResponseHeaders(413, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            String filename = result.fileName;
            if (filename == null || filename.trim().isEmpty()) {
                filename = "deafult.txt";
            }

            // Check 4: Validate file extension (block executables and malicious files)
            if (!isAllowedExtension(filename)) {
                String response = "File type not allowed. Allowed extensions: .txt, .pdf, .jpg, .jpeg, .png, .gif, .zip, .doc, .docx, .csv Only";
                exchange.sendResponseHeaders(415, response.getBytes().length); // 415 Unsupported Media Type
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            // Check 5: Validate MIME type from multipart Content-Type (extra safety layer)
            String fileMimeType = result.contentType;
            if (!isAllowedMimeType(fileMimeType)) {
                String response = "MIME type not allowed. Allowed types: text/plain, application/pdf, image/jpeg, image/png, image/gif, application/zip, application/octet-stream, application/msword, text/csv";
                exchange.sendResponseHeaders(415, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            String uniqueFileName = UUID.randomUUID() + "_" + new File(filename).getName();
            String filePath = uploadDir + File.separator + uniqueFileName;

            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                fos.write(result.fileContent);
            }

            int port = fileSharer.offerFile(filePath , userIp);
            String token = fileSharer.getToken(port); // Get the access token
            new Thread(() -> fileSharer.startFileServer(port)).start();

            // Return both port and token in JSON response. because you must tell the frontend (or client) how to access that file.
            //That’s what this jsonResponse block does — it sends information back to the client in a structured JSON format.
            // because both port and token is required by the frontend to download the file.
            String jsonResponse = "{\"port\": " + port + ", \"token\": \"" + token + "\"}";
            headers.add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(jsonResponse.getBytes());
            }
        } catch (IOException ex) {
            System.err.println("Error processing file upload: " + ex.getMessage());
            String response = "Server error: " + ex.getMessage();
            exchange.sendResponseHeaders(500, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }
}
