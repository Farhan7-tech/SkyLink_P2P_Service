package P2P;

import java.io.IOException;

import P2P.Controller.FileController;

public class App
{
    public static void main( String[] args )
    {
        try {
            // Get port dynamically (Render provides PORT env var). if we in render or any VPS does not set a port on env , it used the
            // default port which is  8081.
            int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8081"));

            // Start the API server
            FileController fileController = new FileController(port);
            fileController.start();

            System.out.println("SkyLink server started on port " + port);

            // Handle shutdown properly. (this thread runs when jvm is shutting down).
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Shutting down server...");
                fileController.stop();
            }));

            // Keep the server running indefinitely,
            // basically it waits for itself to finish,
            // which will never gonna happen. that blocks the thread indefinitely.
            Thread.currentThread().join();

        } catch (IOException e) {
            System.err.println("Error starting server: " + e.getMessage());
            System.exit(1);   /* so basically, when exception occurred, System.exit(1) is
            telling jvm to stop the program immediately , and we know .addShutdownHook(Thread t)
            This method registers a thread that will run automatically when the JVM is shutting down.
            so flow of program reach to  runtime.getruntime() method , which gracefully stops the app*/

        } catch (InterruptedException e) {
            System.err.println("Server interrupted: " + e.getMessage());
            System.exit(1);
        }

    }
}
