package P2P.Service;

import P2P.Utils.UploadUtils;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;


/* FileSharer is a service class that:
Keeps track of which files are available for sharing.
Assigns a unique port and access token for each file.
Handles the logic for sending a file to a client using a temporary socket server.
Cleans up once a file has been sent.
It’s essentially managing a small, temporary file-serving network node. */
public class FileSharer {

    //basically it is file metadata, that give info about the single file.
    private static class FileInfo {
        String filePath; // filePath: where the file is located on disk.
        String host;    //host: who uploaded it (IP address or hostname).
        FileInfo(String filePath, String host) {
            this.filePath = filePath;
            this.host = host;
        }
    }

    /* availableFiles: Maps a port to a FileInfo (file + host info).
    → This tells the server: “On port 5050, serve file xyz.txt.”*/
    private final ConcurrentHashMap<Integer, FileInfo> availableFiles;

    /* accessTokens: Maps a port to a secure token (like a password).
    → Prevents unauthorized downloads. */
    private final ConcurrentHashMap<Integer, String> accessTokens;


    // constructor used to initialize a maps
    public FileSharer() {
        availableFiles = new ConcurrentHashMap<>();
        accessTokens = new ConcurrentHashMap<>();
    }

    /* Generates a 6-digit random token, e.g. "834192".
       Used for file download authentication.
       So when someone uploads a file, they get a unique token that must be shared with the downloader. */
    private String generateAccessToken() {
        Random random = new Random();
        int pin = 100000 + random.nextInt(900000);
        return String.valueOf(pin);
    }

    /* This method is called when someone offers (uploads) a file.
    It: Generates a random port number (via UploadUtils.generatePort()).
    Checks if that port is free (not already in use).
    If free: Stores the file info in availableFiles.
    Creates and stores a token in accessTokens.
    Returns that port
    So each uploaded file gets:
      1. A unique port
      2. A unique access token  */
    public int offerFile(String filePath, String uploaderHost) {
        int port;
        while (true) {
            port = UploadUtils.generatePort();   // call this method , until we get the free port
            if (!availableFiles.containsKey(port)) {
                availableFiles.put(port, new FileInfo(filePath, uploaderHost));
                String token = generateAccessToken();
                accessTokens.put(port, token);
                return port;
            }
        }
    }
    // isPortAvailable: Checks if a file exists on that port.
    public boolean isPortOccupied(int port) {
        return availableFiles.containsKey(port);
    }
    // validateToken: Ensures the provided token matches the one assigned to that port.
    public boolean validateToken(int port, String token) {
        if (token == null || !accessTokens.containsKey(port)) {
            return false;
        }
        return accessTokens.get(port).equals(token);
    }
    //getToken: Fetches the token for a given port.
    public String getToken(int port) {
        return accessTokens.get(port);
    }
    //getPortByToken: Reverse lookup (find port using token).
    public Integer getPortByToken(String token) {
        for (Map.Entry<Integer , String> entry : accessTokens.entrySet()) {
            if (entry.getValue().equals(token)) {
                return entry.getKey();
            }
        }
        return null;
    }

    // Get file host (needed in DownloadHandler)
    // getHostByPort: Gets uploader host info.
    public String getHostByPort(int port) {
        FileInfo info = availableFiles.get(port);
        return (info != null) ? info.host : null;
    }

    //getFilePath: Returns the actual file path stored for that port.
    public String getFilePath(int port) {
        FileInfo info = availableFiles.get(port);
        return (info != null) ? info.filePath : null;
    }

    /* Once a file is downloaded: It deletes the file (if needed). Removes its entry from both availableFiles and accessTokens.
       This prevents old ports/tokens creating problem for us later , when app grows — good for security and memory.   */
    public void cleanupAfterDownload(int port) {
        FileInfo info = availableFiles.get(port);
        if (info != null) {
            File file = new File(info.filePath);
            if (file.exists()) {
                if (file.delete()) {
                    System.out.println("File deleted after download: " + file.getName());
                } else {
                    System.err.println("Failed to delete file: " + file.getName());
                }
            }
            availableFiles.remove(port);
            accessTokens.remove(port);
            System.out.println("Cleaned up port " + port + " and associated token with that port");
        }
    }

    // This is the temporary mini-server that actually sends the file.
    public void startFileServer(int port) {
        FileInfo info = availableFiles.get(port);
        if (info == null) {
            System.out.println("No file is available with this port: " + port);
            return;
        }
        String filePath = info.filePath;
        // ServerSocket is a Java class that listens for incoming TCP connections on a port.
        try (ServerSocket serverSocket = new ServerSocket(port)) { /* When you create new ServerSocket(port)
            ,the OS binds that process to the network port. If the port is already in use, this throws IOException. */
            serverSocket.setSoTimeout(50000);  /* Sets a timeout (in milliseconds) for blocking operations on the ServerSocket.
            Specifically, accept() will wait up to 50,000 ms (50 seconds);
            if no client connects in that time, accept() throws a SocketTimeoutException.
            This prevents the server from waiting forever and helps the method eventually return if nobody connects.*/
            System.out.println("Serving File " + new File(filePath).getName() + " on port " + port);

            Socket clientSocket = serverSocket.accept(); /*  accept() blocks the current thread until a client connects
             (or the timeout triggers).When a client connects, accept() returns a Socket object (clientSocket) representing
              that specific connection. The returned Socket has input/output streams for sending/receiving data across the
              TCP connection. */
            clientSocket.setSoTimeout(50000); /* Sets a read timeout for the client socket’s InputStream/OutputStream operations.
             basically when connection is established, we only waits for 50 sec for file transfer , if it takes more than
             50 sec , we have thrown the exception. (This helps avoid hung transfers.) */
            System.out.println("Client connection: " + clientSocket.getInetAddress());
            new Thread(new FileSenderHandler(clientSocket, filePath)).start();
        } catch (IOException e) {
            System.err.println("Error handling file server on port: " + port);
        }
    }

    private static class FileSenderHandler implements Runnable {
        private final Socket clientSocket;
        private final String filePath;

        public FileSenderHandler(Socket clientSocket, String filePath) {
            this.clientSocket = clientSocket;
            this.filePath = filePath;
        }

        @Override
        public void run() {
            try {
                clientSocket.setSoTimeout(30000);
                try (FileInputStream fis = new FileInputStream(filePath)) {
                    OutputStream oos = clientSocket.getOutputStream();
                    String fileName = new File(filePath).getName();
                    String header = "Filename: " + fileName + "\n";
                    oos.write(header.getBytes());

                    byte[] buffer = new byte[4096];
                    int byteRead;
                    while ((byteRead = fis.read(buffer)) != -1) {
                        oos.write(buffer, 0, byteRead);
                    }
                    System.out.println("File " + fileName + " sent to " + clientSocket.getInetAddress());
                }
            } catch (IOException ex) {
                System.err.println("Error sending file to client: " + ex.getMessage());
            } finally {
                try {
                    clientSocket.close();
                } catch (IOException e) {
                    System.err.println("Error closing socket: " + e.getMessage());
                }
            }
        }
    }
}


