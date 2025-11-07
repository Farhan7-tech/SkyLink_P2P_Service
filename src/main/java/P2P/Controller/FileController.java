package P2P.Controller;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


import P2P.Service.FileSharer;
import P2P.handler.CORSHandler;
import P2P.handler.DownloadHandler;
import P2P.handler.UploadHandler;
import com.sun.net.httpserver.HttpServer;

// fileController doesn’t do the actual file sharing itself but coordinates everything:
//Creates and starts the HTTP server
//Registers endpoints (/upload, /download)
// Directory where uploaded files are temporarily stored
//Manages threads and cleanup
public class FileController {
    private final FileSharer fileSharer;
    private final HttpServer httpServer;
    private final String uploadDir;
    private final ExecutorService executorService;

    public FileController(int port) throws IOException {
        this.fileSharer = new FileSharer();
        this.httpServer = HttpServer.create(new InetSocketAddress(port), 0); /* a lightweight HTTP server built into
         Java SE (no need for Spring Boot or Tomcat). Handles HTTP requests/responses */
        this.uploadDir = System.getProperty("java.io.tmpdir") + File.separator + "SkyLink-uploads"; /* 1. java.io.tmpdir → OS temporary directory
        2. File.separator → ensures correct / or \ depending on OS */
        this.executorService = Executors.newFixedThreadPool(10); /* Creates 10 threads to handle multiple HTTP requests at the same time.
         Prevents the server from freezing under load. */

        // if the directory is not available , we are creating a directory to store file temporary
        File uploadDirs = new File(uploadDir);
        if (!uploadDirs.exists()) {
            uploadDirs.mkdirs();
        }

        // here we are setting up the routes
        httpServer.createContext("/upload", new UploadHandler(uploadDir, fileSharer)); // Handles file uploads and saves them to uploadDir/
        httpServer.createContext("/download", new DownloadHandler(fileSharer)); // serving the files
        httpServer.createContext("/", new CORSHandler()); /* manages CORS headers (allowing requests from browsers) */
        httpServer.setExecutor(executorService); /* Assigns your thread pool to process requests concurrently.
        basically telling the server , hey we can take at most 10 request at a time. */

    }

    public void start() {
        httpServer.start(); // httpServer.start() → begins listening for HTTP requests.
        System.out.println("API server started on port " + httpServer.getAddress().getPort());
    }

    public void stop() {
        //httpServer.stop(0) → stops the server immediately (no delay).
        httpServer.stop(0);
        //executorService.shutdown() → gracefully shuts down the worker threads.
        executorService.shutdown();
        // just printing the confirmation statement that server is shut down.
        System.out.println("API Server stopped");
    }
}
