package P2P;

import java.io.IOException;

import P2P.Controller.FileController;

public class App
{
    public static void main( String[] args )
    {
        try {
            // Get port dynamically (Render provides PORT env var)
            int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8081"));

            // Start the API server
            FileController fileController = new FileController(port);
            fileController.start();

            System.out.println("SkyLink server started on port " + port);

            // Handle shutdown properly
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Shutting down server...");
                fileController.stop();
            }));

            // Keep the server running indefinitely
            Thread.currentThread().join();

        } catch (IOException e) {
            System.err.println("Error starting server: " + e.getMessage());
            System.exit(1);
        } catch (InterruptedException e) {
            System.err.println("Server interrupted: " + e.getMessage());
            System.exit(1);
        }

    }
}
