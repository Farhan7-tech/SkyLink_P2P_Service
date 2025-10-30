package P2P.Service;

import P2P.Utils.UploadUtils;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

public class FileSharer {
    private static class FileInfo {
        String filePath;
        String host;
        FileInfo(String filePath, String host) {
            this.filePath = filePath;
            this.host = host;
        }
    }

    private final ConcurrentHashMap<Integer, FileInfo> availableFiles;
    private final ConcurrentHashMap<Integer, String> accessTokens;

    public FileSharer() {
        availableFiles = new ConcurrentHashMap<>();
        accessTokens = new ConcurrentHashMap<>();
    }

    private String generateAccessToken() {
        Random random = new Random();
        int pin = 100000 + random.nextInt(900000);
        return String.valueOf(pin);
    }

    // Updated to include uploader host
    public int offerFile(String filePath, String uploaderHost) {
        int port;
        while (true) {
            port = UploadUtils.generatePort();
            if (!availableFiles.containsKey(port)) {
                availableFiles.put(port, new FileInfo(filePath, uploaderHost));
                String token = generateAccessToken();
                accessTokens.put(port, token);
                return port;
            }
        }
    }

    public boolean isPortAvailable(int port) {
        return availableFiles.containsKey(port);
    }

    public boolean validateToken(int port, String token) {
        if (token == null || !accessTokens.containsKey(port)) {
            return false;
        }
        return accessTokens.get(port).equals(token);
    }

    public String getToken(int port) {
        return accessTokens.get(port);
    }

    public Integer getPortByToken(String token) {
        for (var entry : accessTokens.entrySet()) {
            if (entry.getValue().equals(token)) {
                return entry.getKey();
            }
        }
        return null;
    }

    // ✅ Added: Get file host (needed in DownloadHandler)
    public String getHostByPort(int port) {
        FileInfo info = availableFiles.get(port);
        return (info != null) ? info.host : null;
    }

    public String getFilePath(int port) {
        FileInfo info = availableFiles.get(port);
        return (info != null) ? info.filePath : null;
    }

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
            System.out.println("Cleaned up port " + port + " and associated token");
        }
    }

    public void startFileServer(int port) {
        FileInfo info = availableFiles.get(port);
        if (info == null) {
            System.out.println("No file associated with port: " + port);
            return;
        }
        String filePath = info.filePath;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            serverSocket.setSoTimeout(50000);
            System.out.println("Serving File " + new File(filePath).getName() + " on port " + port);
            Socket clientSocket = serverSocket.accept();
            clientSocket.setSoTimeout(50000);
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


