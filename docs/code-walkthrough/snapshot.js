window.SKYLINK_CODE = {
  "files": [
    {
      "name": "App.java",
      "path": "App.java",
      "purpose": "Start the Java HTTP service and connect startup to shutdown.",
      "caller": "The JVM calls main when you run the jar.",
      "analogy": "The person opening and closing the transfer counter.",
      "checks": [
        [
          "Does new FileController(port) begin accepting requests?",
          "It constructs/binds/configures the server; start() begins HTTP processing."
        ],
        [
          "What is the type before and after parseInt?",
          "getOrDefault returns a String such as \"8081\"; parseInt returns primitive int 8081."
        ],
        [
          "Which thread does line 31 wait for?",
          "The main thread waits for itself indefinitely, not for a file-sender thread."
        ]
      ],
      "id": "app",
      "hash": "4bf0f1ddda802c879ec264255d9d1220471874816cd41aca432c3edeb2e5d3cc",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P;",
          "code": "package P2P;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "import java.io.IOException;",
          "code": "import java.io.IOException;",
          "kind": "import",
          "what": "Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.",
          "why": "Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.IOException where IOException is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 4,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 5,
          "raw": "import P2P.Controller.FileController;",
          "code": "import P2P.Controller.FileController;",
          "kind": "import",
          "what": "Make the type P2P.Controller.FileController available by its short name FileController. Your project's class that constructs and manages the API server.",
          "why": "App needs to construct it and call its lifecycle methods. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.Controller.FileController where FileController is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 6,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 7,
          "raw": "public class App",
          "code": "public class App",
          "kind": "code",
          "what": "Declare the publicly accessible App class. A class defines a named type and groups related code.",
          "why": "The JVM needs a class containing the entry-point method. App is startup coordination; it is not an upload handler.",
          "example": "public permits access outside this package; App matches App.java.",
          "caution": "",
          "syntax": [
            "public",
            "class"
          ]
        },
        {
          "line": 8,
          "raw": "{",
          "code": "{",
          "kind": "code",
          "what": "Open the body of class App.",
          "why": "The following fields/methods belong to App until its matching final closing brace.",
          "example": "The matching class-closing brace is line 46.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 9,
          "raw": "    public static void main( String[] args )",
          "code": "public static void main( String[] args )",
          "kind": "code",
          "what": "Declare the program entry point: a public, static method named main, returning no value, with an array of String arguments.",
          "why": "The Java launcher looks for this conventional signature. static means it can call main without first constructing an App object. void means there is no return value.",
          "example": "In java -jar app.jar hello, args[0] would be \"hello\"; this program does not use args.",
          "caution": "",
          "syntax": [
            "public",
            "static",
            "void",
            "String",
            "()",
            "[]"
          ]
        },
        {
          "line": 10,
          "raw": "    {",
          "code": "{",
          "kind": "code",
          "what": "Open main's method body.",
          "why": "Startup statements are executed in this method, rather than at class declaration time.",
          "example": "",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 11,
          "raw": "        try {",
          "code": "try {",
          "kind": "code",
          "what": "Begin a try block around startup and the indefinite wait.",
          "why": "The catch clauses below handle checked I/O and interruption failures thrown by operations in this block.",
          "example": "An IOException from constructing the HTTP server reaches line 33.",
          "caution": "This does not catch every exception: invalid PORT can throw NumberFormatException.",
          "syntax": [
            "try",
            "{}"
          ]
        },
        {
          "line": 12,
          "raw": "            // Get port dynamically (Render provides PORT env var). if we in render or any VPS does not set a port on env , it used the",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 14: Read environment variable PORT as text, default to \"8081\" if absent, convert it to an int, and store it in local variable port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 13,
          "raw": "            // default port which is  8081.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 14: Read environment variable PORT as text, default to \"8081\" if absent, convert it to an int, and store it in local variable port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 14,
          "raw": "            int port = Integer.parseInt(System.getenv().getOrDefault(\"PORT\", \"8081\"));",
          "code": "int port = Integer.parseInt(System.getenv().getOrDefault(\"PORT\", \"8081\"));",
          "kind": "code",
          "what": "Read environment variable PORT as text, default to \"8081\" if absent, convert it to an int, and store it in local variable port.",
          "why": "Hosting platforms choose an API port through environment configuration; the local default lets the application start without that setting.",
          "example": "PORT=\"9000\" -> getOrDefault gives \"9000\" -> parseInt gives 9000 -> int port is 9000.",
          "caution": "Empty or nonnumeric PORT does not use the default; parseInt fails.",
          "syntax": [
            "int",
            "Integer",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 15,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 16,
          "raw": "            // Start the API server",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 17: Construct a FileController object using port, then store a reference to it in variable fileController.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 17,
          "raw": "            FileController fileController = new FileController(port);",
          "code": "FileController fileController = new FileController(port);",
          "kind": "code",
          "what": "Construct a FileController object using port, then store a reference to it in variable fileController.",
          "why": "The controller owns the HTTP server, common FileSharer, handlers and executor. This creates the dependencies that the rest of startup needs.",
          "example": "Left FileController is the variable type; lowercase fileController is the variable name; new invokes its constructor.",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 18,
          "raw": "            fileController.start();",
          "code": "fileController.start();",
          "kind": "code",
          "what": "Call start() on the controller object created on line 17.",
          "why": "Construction configured the server; this separate call starts processing HTTP exchanges.",
          "example": "Execution enters FileController.start(), which calls httpServer.start().",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 19,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 20,
          "raw": "            System.out.println(\"SkyLink server started on port \" + port);",
          "code": "System.out.println(\"SkyLink server started on port \" + port);",
          "kind": "code",
          "what": "Print a startup message with the configured port appended.",
          "why": "A log lets you see which API port this process intended to use. + concatenates text and the number.",
          "example": "If port is 8081, output is SkyLink server started on port 8081.",
          "caution": "If port 0 were supplied, the OS-selected port is reported accurately by the controller log, not this configured-value log.",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 21,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 22,
          "raw": "            // Handle shutdown properly. (this thread runs when jvm is shutting down).",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 23: Ask the current JVM Runtime to register a new Thread whose task is the lambda () -> { ... }.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 23,
          "raw": "            Runtime.getRuntime().addShutdownHook(new Thread(() -> {",
          "code": "Runtime.getRuntime().addShutdownHook(new Thread(() -> {",
          "kind": "code",
          "what": "Ask the current JVM Runtime to register a new Thread whose task is the lambda () -> { ... }.",
          "why": "The shutdown hook gives the application a chance to stop its server when the JVM shuts down normally. The lambda contains deferred actions: these lines do not run during registration.",
          "example": "() says the lambda has no parameters; -> introduces its body; new Thread wraps the task.",
          "caution": "Shutdown hooks are not guaranteed on forced termination or a machine crash.",
          "syntax": [
            "new",
            "()",
            "{}",
            ".",
            "->"
          ]
        },
        {
          "line": 24,
          "raw": "                System.out.println(\"Shutting down server...\");",
          "code": "System.out.println(\"Shutting down server...\");",
          "kind": "code",
          "what": "Print a message when the shutdown-hook thread executes.",
          "why": "It marks the beginning of shutdown; unlike the earlier startup log, this is inside the deferred lambda.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 25,
          "raw": "                fileController.stop();",
          "code": "fileController.stop();",
          "kind": "code",
          "what": "Call stop() on the same controller captured by the lambda.",
          "why": "The hook needs access to the existing HTTP server and executor to close them. It must not construct a new controller.",
          "example": "The local reference fileController is effectively final: it is not reassigned, so the lambda may capture it.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 26,
          "raw": "            }));",
          "code": "}));",
          "kind": "code",
          "what": "Close the lambda body, the Thread constructor call and the addShutdownHook call; finish the statement.",
          "why": "The braces and parentheses have different jobs: } ends the task, the first ) ends new Thread(...), the second ) ends registration, and ; ends the statement.",
          "example": "Read it as addShutdownHook( new Thread( task ) );",
          "caution": "",
          "syntax": [
            "()",
            "{}",
            ";"
          ]
        },
        {
          "line": 27,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 28,
          "raw": "            // Keep the server running indefinitely,",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Obtain the currently executing thread and call join() on that same thread.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 29,
          "raw": "            // basically it waits for itself to finish,",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Obtain the currently executing thread and call join() on that same thread.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 30,
          "raw": "            // which will never gonna happen. that blocks the thread indefinitely.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Obtain the currently executing thread and call join() on that same thread.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 31,
          "raw": "            Thread.currentThread().join();",
          "code": "Thread.currentThread().join();",
          "kind": "code",
          "what": "Obtain the currently executing thread and call join() on that same thread.",
          "why": "join waits for the target thread to terminate. Here the main thread targets itself, so it waits indefinitely unless interrupted; this is the program's keep-running mechanism.",
          "example": "This is self-join, not joining the shutdown hook or a worker.",
          "caution": "An explicit lifecycle latch would express the intent more clearly.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 32,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 33,
          "raw": "        } catch (IOException e) {",
          "code": "} catch (IOException e) {",
          "kind": "code",
          "what": "End the try block and start an IOException catch block; name the caught exception e.",
          "why": "Server creation and other I/O can fail. This branch handles those failures instead of continuing startup.",
          "example": "IOException is the exception type; e is the reference to the particular failure.",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 34,
          "raw": "            System.err.println(\"Error starting server: \" + e.getMessage());",
          "code": "System.err.println(\"Error starting server: \" + e.getMessage());",
          "kind": "code",
          "what": "Print the I/O failure message to standard error.",
          "why": "Standard error is used for diagnostics rather than ordinary output. getMessage extracts the failure's description.",
          "example": "A bind failure may identify a port already in use.",
          "caution": "Only the message is logged, not a complete stack trace.",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 35,
          "raw": "            System.exit(1);   /* so basically, when exception occurred, System.exit(1) is",
          "code": "System.exit(1);",
          "kind": "code",
          "what": "Terminate the JVM with exit status 1; the following /* starts a nonexecuting block comment.",
          "why": "A nonzero status tells the launcher/host that startup failed. Registered shutdown hooks normally run during System.exit.",
          "example": "1 conventionally signals failure; 0 conventionally signals success.",
          "caution": "The hook exists only if execution previously reached its registration; the comment does not create a hook. System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 36,
          "raw": "            telling jvm to stop the program immediately , and we know .addShutdownHook(Thread t)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Start a separate catch for InterruptedException from join().",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.",
          "syntax": []
        },
        {
          "line": 37,
          "raw": "            This method registers a thread that will run automatically when the JVM is shutting down.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Start a separate catch for InterruptedException from join().",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.",
          "syntax": []
        },
        {
          "line": 38,
          "raw": "            so flow of program reach to  runtime.getruntime() method , which gracefully stops the app*/",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Start a separate catch for InterruptedException from join().",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.",
          "syntax": []
        },
        {
          "line": 39,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 40,
          "raw": "        } catch (InterruptedException e) {",
          "code": "} catch (InterruptedException e) {",
          "kind": "code",
          "what": "Start a separate catch for InterruptedException from join().",
          "why": "Interruption wakes the main thread from its wait; the program chooses to treat it as a failure and exit.",
          "example": "",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 41,
          "raw": "            System.err.println(\"Server interrupted: \" + e.getMessage());",
          "code": "System.err.println(\"Server interrupted: \" + e.getMessage());",
          "kind": "code",
          "what": "Print the interruption description to standard error.",
          "why": "This distinguishes an interrupted wait from a server I/O startup failure.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 42,
          "raw": "            System.exit(1);",
          "code": "System.exit(1);",
          "kind": "code",
          "what": "Exit the JVM with failure status after interruption.",
          "why": "The program does not attempt to resume its indefinite wait.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 43,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 40: } catch (InterruptedException e) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 40's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 44,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 45,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 10: {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 10's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 46,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 8: {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 8's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        }
      ]
    },
    {
      "name": "FileController.java",
      "path": "Controller/FileController.java",
      "purpose": "Create and wire the HTTP server, shared state, routes and request worker pool.",
      "caller": "App.main constructs it and calls start(); the shutdown hook calls stop().",
      "analogy": "The counter manager: assigns desks, workers and a common notebook.",
      "checks": [
        [
          "Why do upload and download need the same FileSharer?",
          "Otherwise one notebook receives the upload but the downloader searches another empty notebook."
        ],
        [
          "Does new File(uploadDir) create a folder?",
          "No. It creates a path object; mkdirs performs directory creation."
        ],
        [
          "Are all service threads limited to ten?",
          "No. Ten executing HTTP workers are bounded; separate listener/sender threads and the HTTP task queue are not bounded by that number."
        ]
      ],
      "id": "filecontroller",
      "hash": "d2c85e1bfd0e0d6ff15839657e39964d6328541221d78231af27b95466e3972f",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P.Controller;",
          "code": "package P2P.Controller;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P.Controller package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Controller.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "import java.io.File;",
          "code": "import java.io.File;",
          "kind": "import",
          "what": "Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.",
          "why": "Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.File where File is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 4,
          "raw": "import java.io.IOException;",
          "code": "import java.io.IOException;",
          "kind": "import",
          "what": "Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.",
          "why": "Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.IOException where IOException is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 5,
          "raw": "import java.net.InetSocketAddress;",
          "code": "import java.net.InetSocketAddress;",
          "kind": "import",
          "what": "Make the type java.net.InetSocketAddress available by its short name InetSocketAddress. A host/port socket address value.",
          "why": "HttpServer.create needs the API address to bind. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.net.InetSocketAddress where InetSocketAddress is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 6,
          "raw": "import java.util.concurrent.ExecutorService;",
          "code": "import java.util.concurrent.ExecutorService;",
          "kind": "import",
          "what": "Make the type java.util.concurrent.ExecutorService available by its short name ExecutorService. An interface for scheduling tasks and controlling executor shutdown.",
          "why": "The controller stores its worker pool through this abstraction. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.concurrent.ExecutorService where ExecutorService is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 7,
          "raw": "import java.util.concurrent.Executors;",
          "code": "import java.util.concurrent.Executors;",
          "kind": "import",
          "what": "Make the type java.util.concurrent.Executors available by its short name Executors. A factory class for standard executor configurations.",
          "why": "newFixedThreadPool(10) creates the HTTP request scheduler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.concurrent.Executors where Executors is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 8,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 9,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 10,
          "raw": "import P2P.Service.FileSharer;",
          "code": "import P2P.Service.FileSharer;",
          "kind": "import",
          "what": "Make the type P2P.Service.FileSharer available by its short name FileSharer. Your shared pending-file/PIN registry and local TCP service.",
          "why": "Handlers coordinate through one FileSharer object; importing the name does not construct it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.Service.FileSharer where FileSharer is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 11,
          "raw": "import P2P.handler.CORSHandler;",
          "code": "import P2P.handler.CORSHandler;",
          "kind": "import",
          "what": "Make the type P2P.handler.CORSHandler available by its short name CORSHandler. Your root-context HTTP handler.",
          "why": "The controller constructs it for preflight/404 fallback. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.handler.CORSHandler where CORSHandler is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 12,
          "raw": "import P2P.handler.DownloadHandler;",
          "code": "import P2P.handler.DownloadHandler;",
          "kind": "import",
          "what": "Make the type P2P.handler.DownloadHandler available by its short name DownloadHandler. Your PIN-to-HTTP attachment handler.",
          "why": "The controller constructs and registers it at /download. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.handler.DownloadHandler where DownloadHandler is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 13,
          "raw": "import P2P.handler.UploadHandler;",
          "code": "import P2P.handler.UploadHandler;",
          "kind": "import",
          "what": "Make the type P2P.handler.UploadHandler available by its short name UploadHandler. Your upload validator/parser/storage handler.",
          "why": "The controller constructs it for /upload with its required dependencies. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.handler.UploadHandler where UploadHandler is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 14,
          "raw": "import com.sun.net.httpserver.HttpServer;",
          "code": "import com.sun.net.httpserver.HttpServer;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.HttpServer available by its short name HttpServer. The HTTP server implementation provided in the JDK jdk.httpserver module.",
          "why": "It binds the API endpoint and invokes registered handlers without Spring/Tomcat. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.HttpServer where HttpServer is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 15,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 16,
          "raw": "// fileController doesn’t do the actual file sharing itself but coordinates everything:",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The controller stops HTTP/executor resources; it does not clean every pending file/listener.",
          "syntax": []
        },
        {
          "line": 17,
          "raw": "//Creates and starts the HTTP server",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The controller stops HTTP/executor resources; it does not clean every pending file/listener.",
          "syntax": []
        },
        {
          "line": 18,
          "raw": "//Registers endpoints (/upload, /download)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The controller stops HTTP/executor resources; it does not clean every pending file/listener.",
          "syntax": []
        },
        {
          "line": 19,
          "raw": "// Directory where uploaded files are temporarily stored",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The controller stops HTTP/executor resources; it does not clean every pending file/listener.",
          "syntax": []
        },
        {
          "line": 20,
          "raw": "//Manages threads and cleanup",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The controller stops HTTP/executor resources; it does not clean every pending file/listener.",
          "syntax": []
        },
        {
          "line": 21,
          "raw": "public class FileController {",
          "code": "public class FileController {",
          "kind": "code",
          "what": "Declare FileController and open its class body.",
          "why": "This type encapsulates the resources needed for the API lifecycle.",
          "example": "The name Controller is a folder/package convention; no Spring annotation or dependency injection framework is used.",
          "caution": "",
          "syntax": [
            "public",
            "class",
            "{}"
          ]
        },
        {
          "line": 22,
          "raw": "    private final FileSharer fileSharer;",
          "code": "private final FileSharer fileSharer;",
          "kind": "code",
          "what": "Declare a private field holding a FileSharer reference that can be assigned once.",
          "why": "Both HTTP handlers need one shared registry of pending file paths and PINs. private hides the field; final prevents reference reassignment.",
          "example": "final does not freeze the FileSharer maps; entries may still change.",
          "caution": "",
          "syntax": [
            "private",
            "final",
            ";"
          ]
        },
        {
          "line": 23,
          "raw": "    private final HttpServer httpServer;",
          "code": "private final HttpServer httpServer;",
          "kind": "code",
          "what": "Declare a private final reference to the JDK HttpServer.",
          "why": "start and stop must operate on the same configured server object.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            ";"
          ]
        },
        {
          "line": 24,
          "raw": "    private final String uploadDir;",
          "code": "private final String uploadDir;",
          "kind": "code",
          "what": "Declare a private final String holding the upload-directory path.",
          "why": "The controller computes the destination once and passes it to UploadHandler.",
          "example": "This is a path string, not the actual file bytes.",
          "caution": "",
          "syntax": [
            "private",
            "final",
            "String",
            ";"
          ]
        },
        {
          "line": 25,
          "raw": "    private final ExecutorService executorService;",
          "code": "private final ExecutorService executorService;",
          "kind": "code",
          "what": "Declare the private final ExecutorService reference.",
          "why": "The executor owns worker scheduling and must also be available during shutdown.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            ";"
          ]
        },
        {
          "line": 26,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 27,
          "raw": "    public FileController(int port) throws IOException {",
          "code": "public FileController(int port) throws IOException {",
          "kind": "code",
          "what": "Declare a public constructor receiving an integer port; allow IOException to propagate.",
          "why": "new FileController(port) calls this once to build the object. Server creation may throw checked I/O errors, which App catches.",
          "example": "A constructor has the same name as its class and no return type.",
          "caution": "",
          "syntax": [
            "public",
            "int",
            "throws",
            "()",
            "{}"
          ]
        },
        {
          "line": 28,
          "raw": "        this.fileSharer = new FileSharer();",
          "code": "this.fileSharer = new FileSharer();",
          "kind": "code",
          "what": "Construct an empty FileSharer and assign it to this object's field.",
          "why": "This is the shared notebook subsequently passed to both handlers.",
          "example": "this identifies the FileController being constructed.",
          "caution": "",
          "syntax": [
            "new",
            "this",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 29,
          "raw": "        this.httpServer = HttpServer.create(new InetSocketAddress(port), 0); /* a lightweight HTTP server built into",
          "code": "this.httpServer = HttpServer.create(new InetSocketAddress(port), 0);",
          "kind": "code",
          "what": "Create an HttpServer bound to the supplied InetSocketAddress; pass backlog 0 for the system default.",
          "why": "The server needs an address and port before it can accept HTTP connections. InetSocketAddress(port) uses a wildcard local address.",
          "example": "port 8081 creates the API endpoint; port 0 requests an OS-selected port.",
          "caution": "The second argument is connection backlog, not worker count. create binds/configures; start begins processing.",
          "syntax": [
            "new",
            "this",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 30,
          "raw": "         Java SE (no need for Spring Boot or Tomcat). Handles HTTP requests/responses */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Build a directory string from the JVM's temp path, the platform separator and SkyLink-uploads.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 31,
          "raw": "        this.uploadDir = System.getProperty(\"java.io.tmpdir\") + File.separator + \"SkyLink-uploads\"; /* 1. java.io.tmpdir → OS temporary directory",
          "code": "this.uploadDir = System.getProperty(\"java.io.tmpdir\") + File.separator + \"SkyLink-uploads\";",
          "kind": "code",
          "what": "Build a directory string from the JVM's temp path, the platform separator and SkyLink-uploads.",
          "why": "Temporary uploads need a predictable managed subdirectory rather than storage in the repository.",
          "example": "On Windows this could be C:\\...\\Temp\\SkyLink-uploads; File.separator is \\ there.",
          "caution": "java.io.tmpdir is a JVM property and can be overridden; temporary location does not guarantee automatic deletion.",
          "syntax": [
            "this",
            "()",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 32,
          "raw": "        2. File.separator → ensures correct / or \\ depending on OS */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 33: Create an ExecutorService with a fixed pool of ten request worker threads.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 33,
          "raw": "        this.executorService = Executors.newFixedThreadPool(10); /* Creates 10 threads to handle multiple HTTP requests at the same time.",
          "code": "this.executorService = Executors.newFixedThreadPool(10);",
          "kind": "code",
          "what": "Create an ExecutorService with a fixed pool of ten request worker threads.",
          "why": "A blocking handler can occupy a worker while other requests use the remaining workers.",
          "example": "Up to ten HTTP tasks execute concurrently.",
          "caution": "The task queue is unbounded; this does not prevent overload and does not govern raw new Thread calls elsewhere. Ten HTTP workers can improve concurrency but do not guarantee overload protection; the queue and independent file threads remain unbounded.",
          "syntax": [
            "this",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 34,
          "raw": "         Prevents the server from freezing under load. */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 37: Construct a File object describing the upload directory path.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Ten HTTP workers can improve concurrency but do not guarantee overload protection; the queue and independent file threads remain unbounded.",
          "syntax": []
        },
        {
          "line": 35,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 36,
          "raw": "        // if the directory is not available , we are creating a directory to store file temporary",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 37: Construct a File object describing the upload directory path.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 37,
          "raw": "        File uploadDirs = new File(uploadDir);",
          "code": "File uploadDirs = new File(uploadDir);",
          "kind": "code",
          "what": "Construct a File object describing the upload directory path.",
          "why": "File supplies exists/mkdirs methods used by the following setup code.",
          "example": "new File(path) represents a path; it does not create anything on disk.",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 38,
          "raw": "        if (!uploadDirs.exists()) {",
          "code": "if (!uploadDirs.exists()) {",
          "kind": "code",
          "what": "Check whether that path currently does not exist.",
          "why": "Only missing paths trigger the directory-creation branch. ! negates the boolean exists result.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            ".",
            "!"
          ]
        },
        {
          "line": 39,
          "raw": "            uploadDirs.mkdirs();",
          "code": "uploadDirs.mkdirs();",
          "kind": "code",
          "what": "Attempt to create the directory and any missing parent directories.",
          "why": "FileOutputStream cannot save uploads into a nonexistent parent folder.",
          "example": "mkdirs differs from mkdir by also attempting parent directories.",
          "caution": "The boolean return is ignored; existing nondirectory paths and creation failure are not checked here.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 40,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 38: if (!uploadDirs.exists()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 38's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 41,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 42,
          "raw": "        // here we are setting up the routes",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 43: Register the /upload context with a new UploadHandler receiving the directory and shared FileSharer.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 43,
          "raw": "        httpServer.createContext(\"/upload\", new UploadHandler(uploadDir, fileSharer)); // Handles file uploads and saves them to uploadDir/",
          "code": "httpServer.createContext(\"/upload\", new UploadHandler(uploadDir, fileSharer));",
          "kind": "code",
          "what": "Register the /upload context with a new UploadHandler receiving the directory and shared FileSharer.",
          "why": "HttpServer must know which object handles upload exchanges and that object needs its storage/state dependencies.",
          "example": "createContext is path-prefix registration; it is not a Spring controller mapping.",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 44,
          "raw": "        httpServer.createContext(\"/download\", new DownloadHandler(fileSharer)); // serving the files",
          "code": "httpServer.createContext(\"/download\", new DownloadHandler(fileSharer));",
          "kind": "code",
          "what": "Register /download with a DownloadHandler receiving the same FileSharer object.",
          "why": "Downloads must see the PIN/file associations created by uploads.",
          "example": "Two handlers, one common registry.",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 45,
          "raw": "        httpServer.createContext(\"/\", new CORSHandler()); /* manages CORS headers (allowing requests from browsers) */",
          "code": "httpServer.createContext(\"/\", new CORSHandler());",
          "kind": "code",
          "what": "Register / with a CORSHandler fallback.",
          "why": "Unmatched ordinary paths receive 404, and root preflight requests can receive the CORS response.",
          "example": "More-specific upload/download contexts take precedence.",
          "caution": "This root handler does not perform file transfer or provide a readiness check.",
          "syntax": [
            "new",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 46,
          "raw": "        httpServer.setExecutor(executorService); /* Assigns your thread pool to process requests concurrently.",
          "code": "httpServer.setExecutor(executorService);",
          "kind": "code",
          "what": "Assign the ten-worker executor to the HTTP server.",
          "why": "Creating an executor is not enough; this connects request dispatch to that scheduler.",
          "example": "Calls to the handlers' handle method are scheduled by this executor.",
          "caution": "The cap concerns concurrently executing HTTP tasks, not total submitted requests or all service threads.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 47,
          "raw": "        basically telling the server , hey we can take at most 10 request at a time. */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare the public start method with no return value.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The cap concerns concurrently executing HTTP tasks, not total submitted requests or all service threads.",
          "syntax": []
        },
        {
          "line": 48,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 49,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 27: public FileController(int port) throws IOException {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 27's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 50,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 51,
          "raw": "    public void start() {",
          "code": "public void start() {",
          "kind": "code",
          "what": "Declare the public start method with no return value.",
          "why": "App uses this lifecycle method after construction.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "()",
            "{}"
          ]
        },
        {
          "line": 52,
          "raw": "        httpServer.start(); // httpServer.start() → begins listening for HTTP requests.",
          "code": "httpServer.start();",
          "kind": "code",
          "what": "Start HTTP server processing.",
          "why": "The configured contexts/executor now service requests.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 53,
          "raw": "        System.out.println(\"API server started on port \" + httpServer.getAddress().getPort());",
          "code": "System.out.println(\"API server started on port \" + httpServer.getAddress().getPort());",
          "kind": "code",
          "what": "Print the server's actual bound port.",
          "why": "getAddress().getPort() also works when port 0 was used and the OS picked a port.",
          "example": "This log reports the bound endpoint, not merely the constructor input.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 54,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 51: public void start() {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 51's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 55,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 56,
          "raw": "    public void stop() {",
          "code": "public void stop() {",
          "kind": "code",
          "what": "Declare the public stop method.",
          "why": "The shutdown hook needs a place to stop the owned HTTP resources.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "()",
            "{}"
          ]
        },
        {
          "line": 57,
          "raw": "        //httpServer.stop(0) → stops the server immediately (no delay).",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 58: Stop the HTTP server with a zero-second delay.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 58,
          "raw": "        httpServer.stop(0);",
          "code": "httpServer.stop(0);",
          "kind": "code",
          "what": "Stop the HTTP server with a zero-second delay.",
          "why": "The service stops accepting exchanges and closes according to this immediate shutdown request.",
          "example": "0 here is a stop delay; it has a different meaning from create's backlog 0.",
          "caution": "This does not close all independent per-file ServerSockets or delete all pending files.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 59,
          "raw": "        //executorService.shutdown() → gracefully shuts down the worker threads.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 60: Request orderly shutdown of the executor.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 60,
          "raw": "        executorService.shutdown();",
          "code": "executorService.shutdown();",
          "kind": "code",
          "what": "Request orderly shutdown of the executor.",
          "why": "It rejects new submitted work but permits previously submitted tasks to finish.",
          "example": "shutdown is not shutdownNow and does not itself wait for all tasks to terminate.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 61,
          "raw": "        // just printing the confirmation statement that server is shut down.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 62: Print the API shutdown message.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 62,
          "raw": "        System.out.println(\"API Server stopped\");",
          "code": "System.out.println(\"API Server stopped\");",
          "kind": "code",
          "what": "Print the API shutdown message.",
          "why": "This is lifecycle feedback; it is not proof every file thread finished or every file was deleted.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 63,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 56: public void stop() {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 56's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 64,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 21: public class FileController {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 21's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        }
      ]
    },
    {
      "name": "UploadUtils.java",
      "path": "Utils/UploadUtils.java",
      "purpose": "Generate a random candidate port number in the dynamic/private range.",
      "caller": "FileSharer.offerFile calls generatePort during candidate selection.",
      "analogy": "Picking a numbered desk before checking whether anyone occupies it.",
      "checks": [
        [
          "Why is +1 present in the range calculation?",
          "nextInt excludes its upper bound, so 16384 choices are needed to include both 49152 and 65535."
        ],
        [
          "Does generatePort reserve the result?",
          "No. It returns a number; ServerSocket binding later performs OS reservation."
        ],
        [
          "Is the binary-search overflow comment applicable?",
          "No. These small fixed bounds cannot overflow int; the +1 makes the range inclusive."
        ]
      ],
      "id": "uploadutils",
      "hash": "ded71f343fcd640a1b635c9b1c86fdb09d5e36c0a7d1dcb345d181dde9ef293d",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P.Utils;",
          "code": "package P2P.Utils;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P.Utils package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Utils.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "import java.util.Random;",
          "code": "import java.util.Random;",
          "kind": "import",
          "what": "Make the type java.util.Random available by its short name Random. A pseudorandom number generator with bounded integer selection.",
          "why": "Used for candidate ports and six-digit PINs; it is not a cryptographic access-secret generator. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.Random where Random is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 4,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 5,
          "raw": "public class UploadUtils {",
          "code": "public class UploadUtils {",
          "kind": "code",
          "what": "Declare the utility class UploadUtils.",
          "why": "Other classes need a named place to call the port-candidate helper.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "class",
            "{}"
          ]
        },
        {
          "line": 6,
          "raw": "    public static int generatePort(){",
          "code": "public static int generatePort(){",
          "kind": "code",
          "what": "Declare a public static method returning an int, with no parameters.",
          "why": "static allows FileSharer to call UploadUtils.generatePort() without constructing UploadUtils.",
          "example": "int is the returned port number; there is no network operation in the signature.",
          "caution": "",
          "syntax": [
            "public",
            "static",
            "int",
            "()",
            "{}"
          ]
        },
        {
          "line": 7,
          "raw": "        // these are basically unreserved ports, that are not taken by any application",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 8: Store 49152 as the first possible candidate.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Dynamic/private range does not mean unused. This helper does not inspect or reserve OS ports.",
          "syntax": []
        },
        {
          "line": 8,
          "raw": "        int DYNAMIC_STARTING_PORT = 49152;",
          "code": "int DYNAMIC_STARTING_PORT = 49152;",
          "kind": "code",
          "what": "Store 49152 as the first possible candidate.",
          "why": "This is the lower bound chosen for the dynamic/private port range.",
          "example": "The uppercase name is a naming convention; without final the local variable is not a Java constant.",
          "caution": "",
          "syntax": [
            "int",
            ";",
            "="
          ]
        },
        {
          "line": 9,
          "raw": "        int DYNAMIC_ENDING_PORT = 65535;",
          "code": "int DYNAMIC_ENDING_PORT = 65535;",
          "kind": "code",
          "what": "Store 65535 as the last possible candidate.",
          "why": "The helper should include this upper port value.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            ";",
            "="
          ]
        },
        {
          "line": 10,
          "raw": "        int range = (DYNAMIC_ENDING_PORT - DYNAMIC_STARTING_PORT) + 1; // inclusive",
          "code": "int range = (DYNAMIC_ENDING_PORT - DYNAMIC_STARTING_PORT) + 1;",
          "kind": "code",
          "what": "Compute the number of candidate integers: 65535 - 49152 + 1 = 16384.",
          "why": "The interval includes both endpoints; nextInt takes a count and excludes that count itself.",
          "example": "There are three integers in [5,7]: 7 - 5 + 1 = 3.",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 11,
          "raw": "        Random random = new Random();",
          "code": "Random random = new Random();",
          "kind": "code",
          "what": "Construct a pseudorandom number generator.",
          "why": "nextInt needs a generator instance to select an offset.",
          "example": "Random is suitable for demonstration candidate selection, not secret-token security.",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 12,
          "raw": "        // Doing this to prevent overflow, like we do in binary search",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 13: Pick an offset from 0 through 16383, add 49152, and return the candidate.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The +1 makes the range inclusive. This fixed calculation is not a binary-search overflow prevention technique.",
          "syntax": []
        },
        {
          "line": 13,
          "raw": "        return DYNAMIC_STARTING_PORT + random.nextInt(range);",
          "code": "return DYNAMIC_STARTING_PORT + random.nextInt(range);",
          "kind": "code",
          "what": "Pick an offset from 0 through 16383, add 49152, and return the candidate.",
          "why": "Adding the offset shifts a zero-based choice into the desired port interval.",
          "example": "offset 0 -> 49152; offset 16383 -> 65535.",
          "caution": "These ports are not guaranteed unused by another process. The comment about overflow does not explain this calculation. The +1 makes the range inclusive. This fixed calculation is not a binary-search overflow prevention technique.",
          "syntax": [
            "return",
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 14,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 6: public static int generatePort(){",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 6's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 15,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 5: public class UploadUtils {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 5's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        }
      ]
    },
    {
      "name": "MultiParser.java",
      "path": "Utils/MultiParser.java",
      "purpose": "Extract a filename, claimed MIME type and payload bytes from a narrow single-file multipart envelope.",
      "caller": "UploadHandler constructs MultiParser after buffering the request and calls parse().",
      "analogy": "Opening a labeled package and separating its label from its contents.",
      "checks": [
        [
          "Why use byte comparison for the ending boundary?",
          "File payload may contain arbitrary bytes, so the copy must come from the original byte array."
        ],
        [
          "What does -1 mean for indexOf/findSequence?",
          "No matching marker was found; it is a sentinel, not a valid array index."
        ],
        [
          "Is a String index always a byte offset?",
          "No. Non-ASCII headers can make character positions differ from byte positions; this parser mixes them."
        ]
      ],
      "id": "multiparser",
      "hash": "22ec62c9905cbbb70233d7227e181f201409b4a184412c182cb41f44430208f8",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P.Utils;",
          "code": "package P2P.Utils;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P.Utils package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Utils.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "public class MultiParser {",
          "code": "public class MultiParser {",
          "kind": "code",
          "what": "Declare MultiParser and open its body.",
          "why": "It groups the input, result type and parsing helpers into one object.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "class",
            "{}"
          ]
        },
        {
          "line": 4,
          "raw": "    private final byte[] data;",
          "code": "private final byte[] data;",
          "kind": "code",
          "what": "Declare a private final byte-array reference for the full request.",
          "why": "The parser needs the original bytes to copy binary file contents without rewriting them through text.",
          "example": "byte[] is an array of raw 8-bit values; final fixes the reference, not every element.",
          "caution": "",
          "syntax": [
            "private",
            "final",
            "byte",
            "[]",
            ";"
          ]
        },
        {
          "line": 5,
          "raw": "    private final String boundary;",
          "code": "private final String boundary;",
          "kind": "code",
          "what": "Declare the stored multipart boundary string.",
          "why": "Payload ending markers must use the exact boundary supplied in the HTTP Content-Type.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            "String",
            ";"
          ]
        },
        {
          "line": 6,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 7,
          "raw": "    public MultiParser(byte[] data, String boundary) {",
          "code": "public MultiParser(byte[] data, String boundary) {",
          "kind": "code",
          "what": "Declare the constructor with request bytes and boundary parameters.",
          "why": "The handler supplies the data/context that parse will later examine.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "byte",
            "String",
            "()",
            "{}",
            "[]"
          ]
        },
        {
          "line": 8,
          "raw": "        this.data = data;",
          "code": "this.data = data;",
          "kind": "code",
          "what": "Store the parameter data in the object's data field.",
          "why": "this.data disambiguates the field from the identically named argument.",
          "example": "It stores the reference; it does not clone the byte array.",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 9,
          "raw": "        this.boundary = boundary;",
          "code": "this.boundary = boundary;",
          "kind": "code",
          "what": "Store the boundary argument in the field.",
          "why": "The later parse operation can access it without another method parameter.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 10,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 7: public MultiParser(byte[] data, String boundary) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 7's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 11,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 12,
          "raw": "    public static class ParseResult {",
          "code": "public static class ParseResult {",
          "kind": "code",
          "what": "Declare a public static nested result class.",
          "why": "One parse needs to return three related values as one object. static means no enclosing MultiParser instance is required to construct the result.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "static",
            "class",
            "{}"
          ]
        },
        {
          "line": 13,
          "raw": "        public final String fileName;",
          "code": "public final String fileName;",
          "kind": "code",
          "what": "Declare a public final String field for the extracted filename.",
          "why": "UploadHandler reads result.fileName directly when selecting a stored name.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "final",
            "String",
            ";"
          ]
        },
        {
          "line": 14,
          "raw": "        public final byte[] fileContent;",
          "code": "public final byte[] fileContent;",
          "kind": "code",
          "what": "Declare a public final byte-array field for the payload.",
          "why": "UploadHandler needs actual bytes to check size and write disk.",
          "example": "The array reference is final; its contents are still mutable.",
          "caution": "",
          "syntax": [
            "public",
            "final",
            "byte",
            "[]",
            ";"
          ]
        },
        {
          "line": 15,
          "raw": "        public final String contentType;",
          "code": "public final String contentType;",
          "kind": "code",
          "what": "Declare a public final String for the part's claimed MIME type.",
          "why": "UploadHandler compares it with the MIME allowlist.",
          "example": "This is the file-part Content-Type, not the entire request's multipart Content-Type.",
          "caution": "",
          "syntax": [
            "public",
            "final",
            "String",
            ";"
          ]
        },
        {
          "line": 16,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 17,
          "raw": "        public ParseResult(String fileName, byte[] fileContent, String contentType) {",
          "code": "public ParseResult(String fileName, byte[] fileContent, String contentType) {",
          "kind": "code",
          "what": "Declare a constructor accepting the three result values.",
          "why": "parse creates a result after it has located and copied payload bytes.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "byte",
            "String",
            "()",
            "{}",
            "[]"
          ]
        },
        {
          "line": 18,
          "raw": "            this.fileName = fileName;",
          "code": "this.fileName = fileName;",
          "kind": "code",
          "what": "Assign the filename argument to this result object.",
          "why": "Keeps extracted name and payload together.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 19,
          "raw": "            this.fileContent = fileContent;",
          "code": "this.fileContent = fileContent;",
          "kind": "code",
          "what": "Assign the supplied payload array reference.",
          "why": "The caller can read the binary content through result.fileContent.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 20,
          "raw": "            this.contentType = contentType;",
          "code": "this.contentType = contentType;",
          "kind": "code",
          "what": "Assign the MIME argument.",
          "why": "The caller can validate the claimed type independently of extension.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 21,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 17: public ParseResult(String fileName, byte[] fileContent, String contentType) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 17's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 22,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 12: public static class ParseResult {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 12's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 23,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 24,
          "raw": "    private static int findSequence(byte[] data, byte[] sequence, int startPosition) {",
          "code": "private static int findSequence(byte[] data, byte[] sequence, int startPosition) {",
          "kind": "code",
          "what": "Declare a private static search helper returning the first index of a byte sequence at or after startPosition.",
          "why": "String searches are inappropriate for arbitrary binary payload boundaries. static is possible because the helper uses parameters rather than instance fields.",
          "example": "data=[1,2,3,4], sequence=[3,4], startPosition=0 -> 2.",
          "caution": "",
          "syntax": [
            "private",
            "static",
            "int",
            "byte",
            "()",
            "{}",
            "[]"
          ]
        },
        {
          "line": 25,
          "raw": "        // Loop through 'data' starting from startPosition",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 26: For each candidate position, increment i until a full sequence could no longer fit.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 26,
          "raw": "        for (int i = startPosition; i <= data.length - sequence.length; i++) {",
          "code": "for (int i = startPosition; i <= data.length - sequence.length; i++) {",
          "kind": "code",
          "what": "For each candidate position, increment i until a full sequence could no longer fit.",
          "why": "data.length - sequence.length prevents accessing beyond the final byte while comparing a candidate.",
          "example": "With n=10 and marker length 3, last possible start is 7, so <= includes 7.",
          "caution": "Nested comparisons have worst-case O(n*m) time, not automatically linear.",
          "syntax": [
            "int",
            "for",
            "()",
            "{}",
            ".",
            ";",
            "=",
            "++ / +=",
            "+"
          ]
        },
        {
          "line": 27,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 28,
          "raw": "            boolean match = true; // Assume it's a match",
          "code": "boolean match = true;",
          "kind": "code",
          "what": "Set match=true for this candidate before comparing any bytes.",
          "why": "Each candidate gets a fresh assumption; a prior mismatch must not carry over to the next position.",
          "example": "",
          "caution": "",
          "syntax": [
            "boolean",
            ";",
            "="
          ]
        },
        {
          "line": 29,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 30,
          "raw": "            // Check if sequence matches starting from position i",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Loop j from 0 through sequence.length-1.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 31,
          "raw": "            for (int j = 0; j < sequence.length; j++) {",
          "code": "for (int j = 0; j < sequence.length; j++) {",
          "kind": "code",
          "what": "Loop j from 0 through sequence.length-1.",
          "why": "Every byte in the marker must match, in order, at this candidate position.",
          "example": "j++ moves to the next marker byte; i stays at the candidate start.",
          "caution": "",
          "syntax": [
            "int",
            "for",
            "()",
            "{}",
            ".",
            ";",
            "=",
            "++ / +=",
            "+"
          ]
        },
        {
          "line": 32,
          "raw": "                if (data[i + j] != sequence[j]) {",
          "code": "if (data[i + j] != sequence[j]) {",
          "kind": "code",
          "what": "Compare data byte at candidate offset i+j with marker byte j.",
          "why": "A marker match requires equality of every corresponding byte.",
          "example": "If i=7 and j=2, compare data[9] with sequence[2].",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "[]",
            "== / !=",
            "+"
          ]
        },
        {
          "line": 33,
          "raw": "                    match = false; // Found a mismatch",
          "code": "match = false;",
          "kind": "code",
          "what": "Set match to false after a mismatch.",
          "why": "The later if(match) must not report this candidate as found.",
          "example": "",
          "caution": "",
          "syntax": [
            ";",
            "="
          ]
        },
        {
          "line": 34,
          "raw": "                    break;         // Stop checking further for this i",
          "code": "break;",
          "kind": "code",
          "what": "Break out of the inner comparison loop.",
          "why": "Once one byte differs, comparing the remaining marker bytes cannot rescue that candidate; the outer loop will try the next i.",
          "example": "break exits the nearest loop, not the whole method.",
          "caution": "",
          "syntax": [
            "break",
            ";"
          ]
        },
        {
          "line": 35,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 32: if (data[i + j] != sequence[j]) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 32's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 36,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 31: for (int j = 0; j < sequence.length; j++) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 31's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 37,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 38,
          "raw": "            // If all bytes matched, return the index where it starts",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 39: Check whether all marker bytes matched at the candidate.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 39,
          "raw": "            if (match) {",
          "code": "if (match) {",
          "kind": "code",
          "what": "Check whether all marker bytes matched at the candidate.",
          "why": "Only a still-true flag indicates a complete marker.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}"
          ]
        },
        {
          "line": 40,
          "raw": "                return i;",
          "code": "return i;",
          "kind": "code",
          "what": "Return candidate index i immediately.",
          "why": "The caller needs the first matching boundary position; later candidates need not be searched.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 41,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 39: if (match) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 39's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 42,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 26: for (int i = startPosition; i <= data.length - sequence.length; i++) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 26's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 43,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 44,
          "raw": "        // If sequence not found anywhere, return -1",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 45: Return -1 after every candidate failed.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 45,
          "raw": "        return -1;",
          "code": "return -1;",
          "kind": "code",
          "what": "Return -1 after every candidate failed.",
          "why": "The caller can distinguish no boundary from a boundary at index 0.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 46,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 24: private static int findSequence(byte[] data, byte[] sequence, int startPosition) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 24's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 47,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 48,
          "raw": "    public ParseResult parse() {",
          "code": "public ParseResult parse() {",
          "kind": "code",
          "what": "Declare parse(), returning ParseResult or null.",
          "why": "UploadHandler calls this after construction to attempt extraction.",
          "example": "The return type is a reference type; null can signal failure.",
          "caution": "",
          "syntax": [
            "public",
            "()",
            "{}"
          ]
        },
        {
          "line": 49,
          "raw": "        try {",
          "code": "try {",
          "kind": "code",
          "what": "Begin a catch-protected parsing block.",
          "why": "Many malformed inputs or array/string errors are converted into the parser's null failure convention.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "{}"
          ]
        },
        {
          "line": 50,
          "raw": "            String dataAsString = new String(data);",
          "code": "String dataAsString = new String(data);",
          "kind": "code",
          "what": "Decode the entire request byte array into a String using the JVM default charset.",
          "why": "The author uses String.indexOf to find textual header markers.",
          "example": "This also decodes binary payload that does not need text conversion.",
          "caution": "It creates extra memory pressure and character positions may not equal byte offsets.",
          "syntax": [
            "new",
            "String",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 51,
          "raw": "            String fileNameMarker = \"filename=\\\"\";",
          "code": "String fileNameMarker = \"filename=\\\"\";",
          "kind": "code",
          "what": "Create the marker text filename=\".",
          "why": "The parser searches for that literal multipart attribute before reading a name.",
          "example": "The backslash in \" is Java escaping: it puts a quote character inside the string.",
          "caution": "",
          "syntax": [
            "String",
            ";",
            "=",
            "escapes"
          ]
        },
        {
          "line": 52,
          "raw": "            int fileNameStart = dataAsString.indexOf(fileNameMarker);",
          "code": "int fileNameStart = dataAsString.indexOf(fileNameMarker);",
          "kind": "code",
          "what": "Find the first filename marker position in the decoded request.",
          "why": "The returned character index tells the parser where the attribute begins.",
          "example": "No occurrence -> -1.",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 53,
          "raw": "            if (fileNameStart == -1) return null;",
          "code": "if (fileNameStart == -1) return null;",
          "kind": "code",
          "what": "Immediately return null if the filename marker is absent.",
          "why": "Without a filename attribute the narrow parser cannot identify its expected file part.",
          "example": "This one-line if has no braces; only return null belongs to the condition.",
          "caution": "",
          "syntax": [
            "null",
            "return",
            "if",
            "()",
            ";",
            "== / !="
          ]
        },
        {
          "line": 54,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 55,
          "raw": "            fileNameStart += fileNameMarker.length();",
          "code": "fileNameStart += fileNameMarker.length();",
          "kind": "code",
          "what": "Advance fileNameStart past the marker itself.",
          "why": "The extracted name should start after filename=\" rather than include it.",
          "example": "+= means fileNameStart = fileNameStart + fileNameMarker.length().",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "=",
            "++ / +=",
            "+"
          ]
        },
        {
          "line": 56,
          "raw": "            int fileNameEnd = dataAsString.indexOf(\"\\\"\", fileNameStart);",
          "code": "int fileNameEnd = dataAsString.indexOf(\"\\\"\", fileNameStart);",
          "kind": "code",
          "what": "Find the next quote starting at fileNameStart.",
          "why": "That closing quote marks the end of the filename value.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "=",
            "escapes"
          ]
        },
        {
          "line": 57,
          "raw": "            if (fileNameEnd == -1) return null;",
          "code": "if (fileNameEnd == -1) return null;",
          "kind": "code",
          "what": "Return null if there is no closing quote.",
          "why": "A missing closing delimiter makes the filename slice invalid.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "return",
            "if",
            "()",
            ";",
            "== / !="
          ]
        },
        {
          "line": 58,
          "raw": "            String filename = dataAsString.substring(fileNameStart, fileNameEnd);",
          "code": "String filename = dataAsString.substring(fileNameStart, fileNameEnd);",
          "kind": "code",
          "what": "Extract characters from start inclusive to end exclusive into filename.",
          "why": "substring returns the attribute value without surrounding quotes.",
          "example": "filename=\"notes.txt\" -> notes.txt.",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 59,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 60,
          "raw": "            String contentTypeMaker = \"Content-Type: \";",
          "code": "String contentTypeMaker = \"Content-Type: \";",
          "kind": "code",
          "what": "Define the literal part-header marker Content-Type: followed by a space.",
          "why": "The parser uses it to locate the file's claimed MIME type.",
          "example": "The variable is spelled Maker, but it represents a marker string.",
          "caution": "Exact case and spacing are assumed here.",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 61,
          "raw": "            int contentTypeStart = dataAsString.indexOf(contentTypeMaker, fileNameEnd);",
          "code": "int contentTypeStart = dataAsString.indexOf(contentTypeMaker, fileNameEnd);",
          "kind": "code",
          "what": "Search for Content-Type after the filename attribute.",
          "why": "It intends to find the file part's type rather than an earlier envelope header.",
          "example": "The starting search index is fileNameEnd.",
          "caution": "In a general multipart body a later unrelated part might satisfy this search.",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 62,
          "raw": "            String contentType = \"application/octet-stream\";",
          "code": "String contentType = \"application/octet-stream\";",
          "kind": "code",
          "what": "Initialize a fallback MIME type application/octet-stream.",
          "why": "A part without an explicit Content-Type still has a generic binary type in the result.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 63,
          "raw": "            if (contentTypeStart != -1) {",
          "code": "if (contentTypeStart != -1) {",
          "kind": "code",
          "what": "Only parse a MIME value if the marker search succeeded.",
          "why": "The fallback survives when there is no matching marker.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 64,
          "raw": "                contentTypeStart += contentTypeMaker.length();",
          "code": "contentTypeStart += contentTypeMaker.length();",
          "kind": "code",
          "what": "Advance the index beyond Content-Type: .",
          "why": "The MIME value starts after the marker text.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "=",
            "++ / +=",
            "+"
          ]
        },
        {
          "line": 65,
          "raw": "                int contentTypeEnd = dataAsString.indexOf(\"\\r\\n\", contentTypeStart);",
          "code": "int contentTypeEnd = dataAsString.indexOf(\"\\r\\n\", contentTypeStart);",
          "kind": "code",
          "what": "Find the carriage-return/newline ending this header line.",
          "why": "MIME extraction must stop at the header's line boundary.",
          "example": "\\r is carriage return; \\n is newline; the two together represent HTTP-style line endings.",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "=",
            "escapes"
          ]
        },
        {
          "line": 66,
          "raw": "                if (contentTypeEnd > contentTypeStart) {",
          "code": "if (contentTypeEnd > contentTypeStart) {",
          "kind": "code",
          "what": "Check that the line terminator is located after the MIME value starts.",
          "why": "A missing marker (-1) or empty malformed value should not produce an invalid slice.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}"
          ]
        },
        {
          "line": 67,
          "raw": "                    contentType = dataAsString.substring(contentTypeStart, contentTypeEnd);",
          "code": "contentType = dataAsString.substring(contentTypeStart, contentTypeEnd);",
          "kind": "code",
          "what": "Extract the header value as the claimed MIME type.",
          "why": "The result replaces the generic fallback only when the boundaries are usable.",
          "example": "Content-Type: text/plain\\r\\n -> text/plain.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 68,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 66: if (contentTypeEnd > contentTypeStart) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 66's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 69,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 63: if (contentTypeStart != -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 63's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 70,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 71,
          "raw": "            String headerEndMarker = \"\\r\\n\\r\\n\";",
          "code": "String headerEndMarker = \"\\r\\n\\r\\n\";",
          "kind": "code",
          "what": "Create the marker for a blank line: CRLF CRLF.",
          "why": "In a multipart part, a blank line separates part headers from payload bytes.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            ";",
            "=",
            "escapes"
          ]
        },
        {
          "line": 72,
          "raw": "            int headerEnd = dataAsString.indexOf(headerEndMarker);",
          "code": "int headerEnd = dataAsString.indexOf(headerEndMarker);",
          "kind": "code",
          "what": "Find the first header/body separator in the decoded request.",
          "why": "The parser needs a start point for the payload.",
          "example": "The first occurrence in a multi-part request may belong to another part.",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 73,
          "raw": "            if (headerEnd == -1) return null;",
          "code": "if (headerEnd == -1) return null;",
          "kind": "code",
          "what": "Return null if that separator is missing.",
          "why": "The expected file-part structure is incomplete.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "return",
            "if",
            "()",
            ";",
            "== / !="
          ]
        },
        {
          "line": 74,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 75,
          "raw": "            int contentStart = headerEnd + headerEndMarker.length();",
          "code": "int contentStart = headerEnd + headerEndMarker.length();",
          "kind": "code",
          "what": "Move four characters past the separator to identify payload start.",
          "why": "The blank line itself must not be copied into the file.",
          "example": "A four-character separator at character index 120 gives contentStart=124.",
          "caution": "The code later treats this character index as a byte index, which is not safe for all encodings.",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 76,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 77,
          "raw": "            byte[] boundaryBytes = (\"\\r\\n--\" + boundary + \"--\").getBytes();",
          "code": "byte[] boundaryBytes = (\"\\r\\n--\" + boundary + \"--\").getBytes();",
          "kind": "code",
          "what": "Build the ending marker CRLF--boundary-- and encode it as bytes.",
          "why": "The final multipart delimiter includes two additional trailing hyphens. Byte search preserves original payload bytes.",
          "example": "boundary=abc -> marker bytes for \\r\\n--abc--.",
          "caution": "getBytes uses default charset; protocol delimiters should use a deliberate compatible encoding.",
          "syntax": [
            "byte",
            "()",
            "[]",
            ".",
            ";",
            "=",
            "+",
            "escapes"
          ]
        },
        {
          "line": 78,
          "raw": "            int contentEnd = findSequence(data, boundaryBytes, contentStart);",
          "code": "int contentEnd = findSequence(data, boundaryBytes, contentStart);",
          "kind": "code",
          "what": "Search the original request bytes for that final delimiter after contentStart.",
          "why": "The delimiter location identifies the exclusive end of the payload.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 79,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 80,
          "raw": "            if (contentEnd == -1) {",
          "code": "if (contentEnd == -1) {",
          "kind": "code",
          "what": "If the final delimiter was not found, try a nonfinal boundary marker.",
          "why": "The fallback allows the parser to stop at a regular separator too.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 81,
          "raw": "                boundaryBytes = (\"\\r\\n--\" + boundary).getBytes();",
          "code": "boundaryBytes = (\"\\r\\n--\" + boundary).getBytes();",
          "kind": "code",
          "what": "Build CRLF--boundary without the final trailing hyphens.",
          "why": "A multipart body may contain another part after this one.",
          "example": "This fallback alone does not make the parser fully multipart-aware.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "=",
            "+",
            "escapes"
          ]
        },
        {
          "line": 82,
          "raw": "                contentEnd = findSequence(data, boundaryBytes, contentStart);",
          "code": "contentEnd = findSequence(data, boundaryBytes, contentStart);",
          "kind": "code",
          "what": "Repeat the byte search with the alternate delimiter.",
          "why": "A nonfinal matching boundary supplies contentEnd.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 83,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 80: if (contentEnd == -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 80's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 84,
          "raw": "            if (contentEnd == -1 || contentEnd <= contentStart) {",
          "code": "if (contentEnd == -1 || contentEnd <= contentStart) {",
          "kind": "code",
          "what": "Reject when no boundary exists or the end is at/before the start.",
          "why": "A negative length cannot be copied; equal start/end is treated as invalid.",
          "example": "|| is logical OR; either bad condition rejects.",
          "caution": "An empty file is rejected by contentEnd <= contentStart.",
          "syntax": [
            "if",
            "()",
            "{}",
            "== / !=",
            "&& / ||"
          ]
        },
        {
          "line": 85,
          "raw": "                return null;",
          "code": "return null;",
          "kind": "code",
          "what": "Return null for those invalid payload bounds.",
          "why": "UploadHandler maps a null result to a 400 upload response.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "return",
            ";"
          ]
        },
        {
          "line": 86,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 84: if (contentEnd == -1 || contentEnd <= contentStart) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 84's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 87,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 88,
          "raw": "            byte[] fileContent = new byte[contentEnd - contentStart];",
          "code": "byte[] fileContent = new byte[contentEnd - contentStart];",
          "kind": "code",
          "what": "Allocate a new byte array sized exactly to the payload interval.",
          "why": "The extracted file should exclude envelope headers and the ending delimiter.",
          "example": "contentStart=124 and contentEnd=129 -> new byte[5].",
          "caution": "",
          "syntax": [
            "new",
            "byte",
            "[]",
            ";",
            "="
          ]
        },
        {
          "line": 89,
          "raw": "            System.arraycopy(data, contentStart, fileContent, 0, fileContent.length);",
          "code": "System.arraycopy(data, contentStart, fileContent, 0, fileContent.length);",
          "kind": "code",
          "what": "Copy fileContent.length bytes from data at contentStart into the new array beginning at 0.",
          "why": "This is the key binary-preserving copy: file bytes come from the original byte array, not from re-encoding a String.",
          "example": "Arguments are source array, source offset, destination array, destination offset, count.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 90,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 91,
          "raw": "            return new ParseResult(filename, fileContent, contentType);",
          "code": "return new ParseResult(filename, fileContent, contentType);",
          "kind": "code",
          "what": "Create and return one ParseResult containing name, payload array and MIME.",
          "why": "The handler needs these three results together for validation and storage.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "return",
            "()",
            ";"
          ]
        },
        {
          "line": 92,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 93,
          "raw": "        } catch (Exception ex) {",
          "code": "} catch (Exception ex) {",
          "kind": "code",
          "what": "Catch any Exception thrown inside the parsing try block.",
          "why": "This catches more than IOException, including many bad indexing errors, and converts them to a null result.",
          "example": "It does not catch Error such as OutOfMemoryError.",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 94,
          "raw": "            System.err.println(\"Error parsing multipart data \" + ex.getMessage());",
          "code": "System.err.println(\"Error parsing multipart data \" + ex.getMessage());",
          "kind": "code",
          "what": "Log the parsing exception message.",
          "why": "This gives a limited clue to why extraction failed.",
          "example": "Full input is not printed.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 95,
          "raw": "            return null;",
          "code": "return null;",
          "kind": "code",
          "what": "Return null after a caught failure.",
          "why": "The caller uses the same failure convention as missing markers.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "return",
            ";"
          ]
        },
        {
          "line": 96,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 93: } catch (Exception ex) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 93's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 97,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 48: public ParseResult parse() {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 48's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 98,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 3: public class MultiParser {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 3's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 99,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        }
      ]
    },
    {
      "name": "UploadHandler.java",
      "path": "handler/UploadHandler.java",
      "purpose": "Validate one multipart upload, buffer/parse it, save it and return a registered share PIN.",
      "caller": "HttpServer calls handle for /upload; it delegates parsing to MultiParser and sharing state to FileSharer.",
      "analogy": "The receiving clerk: checks the package, stores it and writes its collection code.",
      "checks": [
        [
          "What happens after a rejected branch's return?",
          "handle finishes; the later disk write and share registration do not execute for that request."
        ],
        [
          "What is the distinction between request Content-Type and result.contentType?",
          "The first describes the multipart envelope; the second is the file part's claimed MIME."
        ],
        [
          "Which value is shared between upload and download handlers?",
          "The same FileSharer object passed by FileController, not the local variables of one handle call."
        ]
      ],
      "id": "uploadhandler",
      "hash": "ab9f41c963a080dd25607818072a266da9f2a9fcba0b91c6050a220528082513",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P.handler;",
          "code": "package P2P.handler;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P.handler package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.handler.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "import java.io.ByteArrayOutputStream;",
          "code": "import java.io.ByteArrayOutputStream;",
          "kind": "import",
          "what": "Make the type java.io.ByteArrayOutputStream available by its short name ByteArrayOutputStream. An expandable in-memory byte accumulator.",
          "why": "Upload uses it for the whole envelope; download uses it for the filename header. Memory grows with accumulated bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.ByteArrayOutputStream where ByteArrayOutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 4,
          "raw": "import java.io.File;",
          "code": "import java.io.File;",
          "kind": "import",
          "what": "Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.",
          "why": "Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.File where File is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 5,
          "raw": "import java.io.FileOutputStream;",
          "code": "import java.io.FileOutputStream;",
          "kind": "import",
          "what": "Make the type java.io.FileOutputStream available by its short name FileOutputStream. An OutputStream that writes to a disk file.",
          "why": "Uploads and download staging need real disk persistence. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.FileOutputStream where FileOutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 6,
          "raw": "import java.io.IOException;",
          "code": "import java.io.IOException;",
          "kind": "import",
          "what": "Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.",
          "why": "Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.IOException where IOException is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 7,
          "raw": "import java.io.OutputStream;",
          "code": "import java.io.OutputStream;",
          "kind": "import",
          "what": "Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.",
          "why": "HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 8,
          "raw": "import java.util.UUID;",
          "code": "import java.util.UUID;",
          "kind": "import",
          "what": "Make the type java.util.UUID available by its short name UUID. A type/factory for widely unique identifiers.",
          "why": "UUID.randomUUID prefixes stored names to reduce overwrite collisions. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.UUID where UUID is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 9,
          "raw": "import java.util.concurrent.ConcurrentHashMap;",
          "code": "import java.util.concurrent.ConcurrentHashMap;",
          "kind": "import",
          "what": "Make the type java.util.concurrent.ConcurrentHashMap available by its short name ConcurrentHashMap. A map supporting safe individual concurrent operations.",
          "why": "Several threads access registry/limiter maps; compound workflows and mutable values still require coordination. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.concurrent.ConcurrentHashMap where ConcurrentHashMap is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 10,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 11,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 12,
          "raw": "import P2P.Service.FileSharer;",
          "code": "import P2P.Service.FileSharer;",
          "kind": "import",
          "what": "Make the type P2P.Service.FileSharer available by its short name FileSharer. Your shared pending-file/PIN registry and local TCP service.",
          "why": "Handlers coordinate through one FileSharer object; importing the name does not construct it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.Service.FileSharer where FileSharer is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 13,
          "raw": "import P2P.Utils.MultiParser;",
          "code": "import P2P.Utils.MultiParser;",
          "kind": "import",
          "what": "Make the type P2P.Utils.MultiParser available by its short name MultiParser. Your narrow multipart parser class.",
          "why": "UploadHandler delegates name/type/payload extraction to it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.Utils.MultiParser where MultiParser is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 14,
          "raw": "import com.sun.net.httpserver.Headers;",
          "code": "import com.sun.net.httpserver.Headers;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.Headers available by its short name Headers. The HTTP header collection type from the JDK server API.",
          "why": "Handlers read incoming metadata or add/set outgoing metadata. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.Headers where Headers is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 15,
          "raw": "import com.sun.net.httpserver.HttpExchange;",
          "code": "import com.sun.net.httpserver.HttpExchange;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.HttpExchange available by its short name HttpExchange. One HTTP request and its response channel.",
          "why": "handle receives this object to inspect method/URI/headers and access body streams. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.HttpExchange where HttpExchange is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 16,
          "raw": "import com.sun.net.httpserver.HttpHandler;",
          "code": "import com.sun.net.httpserver.HttpHandler;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.HttpHandler available by its short name HttpHandler. The interface with handle(HttpExchange).",
          "why": "implements HttpHandler allows a class to be registered as a server context handler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.HttpHandler where HttpHandler is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 17,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 18,
          "raw": "public class UploadHandler implements HttpHandler {",
          "code": "public class UploadHandler implements HttpHandler {",
          "kind": "code",
          "what": "Declare UploadHandler implementing HttpHandler.",
          "why": "The HTTP server needs the handle(HttpExchange) entry point to dispatch uploads.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "class",
            "implements",
            "{}"
          ]
        },
        {
          "line": 19,
          "raw": "    private final String uploadDir;",
          "code": "private final String uploadDir;",
          "kind": "code",
          "what": "Declare a private final field for the upload-directory String.",
          "why": "Every request handled by this object uses the configured temp directory.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            "String",
            ";"
          ]
        },
        {
          "line": 20,
          "raw": "    private final FileSharer fileSharer;",
          "code": "private final FileSharer fileSharer;",
          "kind": "code",
          "what": "Declare the private final shared FileSharer reference.",
          "why": "After saving disk bytes, this handler must register shares in the same service the downloader searches.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            ";"
          ]
        },
        {
          "line": 21,
          "raw": "    // Maximum file size: 500MB, that's the max users can upload",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 22: Define a class-wide constant long equal to 500 * 1024 * 1024 = 524288000 bytes.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The binary unit is 500 MiB; request-envelope checks include overhead.",
          "syntax": []
        },
        {
          "line": 22,
          "raw": "    private static final long MAX_FILE_SIZE = 500L * 1024 * 1024; // 500MB in bytes",
          "code": "private static final long MAX_FILE_SIZE = 500L * 1024 * 1024;",
          "kind": "code",
          "what": "Define a class-wide constant long equal to 500 * 1024 * 1024 = 524288000 bytes.",
          "why": "Size checks should use one consistent maximum, and long handles byte counts without relying on narrower arithmetic.",
          "example": "500L makes multiplication use long arithmetic. Technically the value is 500 MiB.",
          "caution": "Request-envelope checks include multipart overhead, so the maximum accepted payload can be slightly smaller. The binary unit is 500 MiB; request-envelope checks include overhead.",
          "syntax": [
            "private",
            "static",
            "final",
            "long",
            ";",
            "="
          ]
        },
        {
          "line": 23,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 24,
          "raw": "    private static final int MAX_UPLOADS_PER_MINUTE = 10; // Maximum uploads allowed per minute, user can only upload 10 files per minutes.",
          "code": "private static final int MAX_UPLOADS_PER_MINUTE = 10;",
          "kind": "code",
          "what": "Define the upload-attempt threshold as 10.",
          "why": "All limiter branches compare against a shared policy value.",
          "example": "private limits access; static shares the value across instances; final prevents reassignment.",
          "caution": "This limiter counts qualifying POST attempts before later validation, not just saved files.",
          "syntax": [
            "private",
            "static",
            "final",
            "int",
            ";",
            "="
          ]
        },
        {
          "line": 25,
          "raw": "    private static final long ONE_MINUTE_MS = 60_000; // One minute in milliseconds",
          "code": "private static final long ONE_MINUTE_MS = 60_000;",
          "kind": "code",
          "what": "Define one minute as 60000 milliseconds in a long constant.",
          "why": "The limiter compares timestamps measured in milliseconds.",
          "example": "60_000 is Java's readable numeric literal; underscore is not part of the value.",
          "caution": "",
          "syntax": [
            "private",
            "static",
            "final",
            "long",
            ";",
            "="
          ]
        },
        {
          "line": 26,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 27,
          "raw": "    // Allowed file extensions",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 28: Begin an array of allowed filename suffix Strings.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 28,
          "raw": "    private static final String[] ALLOWED_EXTENSIONS = {",
          "code": "private static final String[] ALLOWED_EXTENSIONS = {",
          "kind": "code",
          "what": "Begin an array of allowed filename suffix Strings.",
          "why": "The extension helper loops over this list rather than spelling a separate condition for every suffix.",
          "example": "String[] is the array type; { starts its initializer.",
          "caution": "final protects the array reference, not its elements.",
          "syntax": [
            "private",
            "static",
            "final",
            "String",
            "{}",
            "[]",
            "="
          ]
        },
        {
          "line": 29,
          "raw": "            \".txt\", \".pdf\", \".jpg\", \".jpeg\", \".png\", \".gif\", \".zip\", \".doc\", \".docx\", \".csv\"",
          "code": "\".txt\", \".pdf\", \".jpg\", \".jpeg\", \".png\", \".gif\", \".zip\", \".doc\", \".docx\", \".csv\"",
          "kind": "code",
          "what": "Populate the extension array with ten permitted suffixes.",
          "why": "It establishes which names can pass the helper: text, PDF, common images, ZIP, Office documents and CSV.",
          "example": "Each quoted value is a String; commas separate array items.",
          "caution": "",
          "syntax": [
            "."
          ]
        },
        {
          "line": 30,
          "raw": "    };",
          "code": "};",
          "kind": "code",
          "what": "Close the extension array initializer and finish its field declaration.",
          "why": "}; completes the list expression and the declaration; it does not close the class.",
          "example": "",
          "caution": "",
          "syntax": [
            "{}",
            ";"
          ]
        },
        {
          "line": 31,
          "raw": "    //Allowed MIME (Multipurpose Internet Mail Extensions) types (security whitelist)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 32: Begin the allowed MIME-type array initializer.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 32,
          "raw": "    private static final String[] ALLOWED_MIME_TYPES = {",
          "code": "private static final String[] ALLOWED_MIME_TYPES = {",
          "kind": "code",
          "what": "Begin the allowed MIME-type array initializer.",
          "why": "The part-type helper needs a separate whitelist from filename suffixes.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "static",
            "final",
            "String",
            "{}",
            "[]",
            "="
          ]
        },
        {
          "line": 33,
          "raw": "            \"text/plain\", \"application/pdf\", \"image/jpeg\", \"image/png\", \"image/gif\",",
          "code": "\"text/plain\", \"application/pdf\", \"image/jpeg\", \"image/png\", \"image/gif\",",
          "kind": "code",
          "what": "Add MIME labels for plain text, PDF, JPEG, PNG and GIF.",
          "why": "A .pdf extension and claimed application/pdf type are checked separately.",
          "example": "",
          "caution": "",
          "syntax": []
        },
        {
          "line": 34,
          "raw": "            \"application/zip\", \"application/x-zip-compressed\", \"application/x-zip\", \"application/octet-stream\",",
          "code": "\"application/zip\", \"application/x-zip-compressed\", \"application/x-zip\", \"application/octet-stream\",",
          "kind": "code",
          "what": "Add ZIP MIME variants and generic octet-stream.",
          "why": "Different clients can label ZIPs differently; octet-stream also supports an unspecified binary type.",
          "example": "Allowing generic binary weakens any implication that this list validates contents.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 35,
          "raw": "            \"application/msword\", \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\",",
          "code": "\"application/msword\", \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\",",
          "kind": "code",
          "what": "Add Word and OOXML Word MIME labels.",
          "why": "The .doc/.docx extensions have corresponding common metadata types.",
          "example": "",
          "caution": "",
          "syntax": [
            "."
          ]
        },
        {
          "line": 36,
          "raw": "            \"text/csv\"",
          "code": "\"text/csv\"",
          "kind": "code",
          "what": "Add text/csv as the final MIME item.",
          "why": "CSV uploads need a matching permitted type.",
          "example": "",
          "caution": "",
          "syntax": []
        },
        {
          "line": 37,
          "raw": "    };",
          "code": "};",
          "kind": "code",
          "what": "Finish the MIME array declaration.",
          "why": "The initializer is complete and the following nested class is a separate declaration.",
          "example": "",
          "caution": "",
          "syntax": [
            "{}",
            ";"
          ]
        },
        {
          "line": 38,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 39,
          "raw": "    // This class stores info about uploads for one IP",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Declare a private static nested UploadInfo class.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 40,
          "raw": "    private static class UploadInfo {",
          "code": "private static class UploadInfo {",
          "kind": "code",
          "what": "Declare a private static nested UploadInfo class.",
          "why": "The per-IP map value needs a window-start timestamp and attempt counter together.",
          "example": "static avoids an implicit UploadHandler owner reference.",
          "caution": "",
          "syntax": [
            "private",
            "static",
            "class",
            "{}"
          ]
        },
        {
          "line": 41,
          "raw": "        long minuteWindowStart; // When the current minute started",
          "code": "long minuteWindowStart;",
          "kind": "code",
          "what": "Declare a mutable long holding the start timestamp of the active window.",
          "why": "The limiter decides whether a minute has elapsed using this field.",
          "example": "It is neither final nor an atomic/volatile variable.",
          "caution": "",
          "syntax": [
            "long",
            ";"
          ]
        },
        {
          "line": 42,
          "raw": "        int uploadCount;        // How many uploads so far in this minute",
          "code": "int uploadCount;",
          "kind": "code",
          "what": "Declare a mutable integer attempt count.",
          "why": "The limiter increments this number and compares it to 10.",
          "example": "Safe map storage does not make ++ on this field atomic.",
          "caution": "",
          "syntax": [
            "int",
            ";"
          ]
        },
        {
          "line": 43,
          "raw": "        UploadInfo(long minuteWindowStart) {",
          "code": "UploadInfo(long minuteWindowStart) {",
          "kind": "code",
          "what": "Declare UploadInfo's constructor with a timestamp argument.",
          "why": "The first attempt creates a record whose window begins now.",
          "example": "",
          "caution": "",
          "syntax": [
            "long",
            "()",
            "{}"
          ]
        },
        {
          "line": 44,
          "raw": "            this.minuteWindowStart = minuteWindowStart;",
          "code": "this.minuteWindowStart = minuteWindowStart;",
          "kind": "code",
          "what": "Store the timestamp in this record's field.",
          "why": "Later attempts compare their current time against it.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 45,
          "raw": "            this.uploadCount = 1;",
          "code": "this.uploadCount = 1;",
          "kind": "code",
          "what": "Initialize the counter to one, counting the first attempt.",
          "why": "The request creating this record must be included, rather than starting at zero and forgetting it.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 46,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 43: UploadInfo(long minuteWindowStart) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 43's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 47,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 40: private static class UploadInfo {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 40's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 48,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 49,
          "raw": "    // This map keeps track of each IP's upload info",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Create a static final ConcurrentHashMap from IP Strings to UploadInfo objects.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 50,
          "raw": "    // Key: IP address, Value: UploadInfo object",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Create a static final ConcurrentHashMap from IP Strings to UploadInfo objects.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 51,
          "raw": "    private static final ConcurrentHashMap<String, UploadInfo> uploadTracker = new ConcurrentHashMap<>();",
          "code": "private static final ConcurrentHashMap<String, UploadInfo> uploadTracker = new ConcurrentHashMap<>();",
          "kind": "code",
          "what": "Create a static final ConcurrentHashMap from IP Strings to UploadInfo objects.",
          "why": "Different requests/handler instances share limiter records. ConcurrentHashMap protects individual map operations.",
          "example": "\"127.0.0.1\" -> UploadInfo(windowStart, count).",
          "caution": "It does not protect fields inside UploadInfo, atomically combine get/put, or evict unused IPs.",
          "syntax": [
            "private",
            "static",
            "final",
            "new",
            "String",
            "()",
            ";",
            "=",
            "<>"
          ]
        },
        {
          "line": 52,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 53,
          "raw": "   // initializing the uploadDir and fileSharer , whatever it passed from file controller.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 54: Declare the handler constructor taking storage directory and common FileSharer.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 54,
          "raw": "    public UploadHandler(String uploadDir, FileSharer fileSharer) {",
          "code": "public UploadHandler(String uploadDir, FileSharer fileSharer) {",
          "kind": "code",
          "what": "Declare the handler constructor taking storage directory and common FileSharer.",
          "why": "FileController manually supplies dependencies when it builds the upload context.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 55,
          "raw": "        this.uploadDir = uploadDir;",
          "code": "this.uploadDir = uploadDir;",
          "kind": "code",
          "what": "Store the directory argument in the handler field.",
          "why": "Local constructor parameters disappear when construction returns; the field retains configuration.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 56,
          "raw": "        this.fileSharer = fileSharer;",
          "code": "this.fileSharer = fileSharer;",
          "kind": "code",
          "what": "Store the shared service object reference.",
          "why": "Each future handle invocation needs registration and listener methods.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 57,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 54: public UploadHandler(String uploadDir, FileSharer fileSharer) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 54's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 58,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 59,
          "raw": "    // Helper method to check if file extension is allowed",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 60: Declare a private boolean filename-extension checker.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 60,
          "raw": "    private boolean isAllowedExtension(String filename) {",
          "code": "private boolean isAllowedExtension(String filename) {",
          "kind": "code",
          "what": "Declare a private boolean filename-extension checker.",
          "why": "The main handler delegates suffix policy to a small reusable helper.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "boolean",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 61,
          "raw": "        if (filename == null) return false;",
          "code": "if (filename == null) return false;",
          "kind": "code",
          "what": "Return false when filename is null.",
          "why": "The next toLowerCase call would otherwise dereference null.",
          "example": "A one-line if controls only the return statement.",
          "caution": "",
          "syntax": [
            "null",
            "return",
            "if",
            "()",
            ";",
            "== / !="
          ]
        },
        {
          "line": 62,
          "raw": "        String lower = filename.toLowerCase();",
          "code": "String lower = filename.toLowerCase();",
          "kind": "code",
          "what": "Convert filename to lowercase and store the returned String.",
          "why": "Case-insensitive suffix matching should accept names such as PHOTO.JPG.",
          "example": "Strings are immutable; this creates/returns a normalized string rather than changing filename in place.",
          "caution": "The default locale is used; a deliberate locale is preferable for protocol-like checks.",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 63,
          "raw": "        for (String extention : ALLOWED_EXTENSIONS) {",
          "code": "for (String extention : ALLOWED_EXTENSIONS) {",
          "kind": "code",
          "what": "Loop through each allowed suffix, naming the current String extention.",
          "why": "The misspelled variable name has no functional effect; its value is a suffix from the array.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "for",
            "()",
            "{}"
          ]
        },
        {
          "line": 64,
          "raw": "            if (lower.endsWith(extention)) {",
          "code": "if (lower.endsWith(extention)) {",
          "kind": "code",
          "what": "Check whether the normalized filename ends with the current suffix.",
          "why": "Only suffix matching is intended; a .txt in the middle of a name should not suffice.",
          "example": "notes.txt.exe does not end with .txt.",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 65,
          "raw": "                return true;",
          "code": "return true;",
          "kind": "code",
          "what": "Return true immediately after any suffix matches.",
          "why": "One allowed extension is enough; remaining list items need not be searched.",
          "example": "This returns from isAllowedExtension, not from the upload handler.",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 66,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 64: if (lower.endsWith(extention)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 64's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 67,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 63: for (String extention : ALLOWED_EXTENSIONS) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 63's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 68,
          "raw": "        return false;",
          "code": "return false;",
          "kind": "code",
          "what": "Return false after no suffix matched.",
          "why": "The caller can reject the file as unsupported.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 69,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 60: private boolean isAllowedExtension(String filename) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 60's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 70,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 71,
          "raw": "    // Helper method to check if MIME type is allowed",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 72: Declare a private boolean MIME-type checker.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 72,
          "raw": "    private boolean isAllowedMimeType(String mimeType) {",
          "code": "private boolean isAllowedMimeType(String mimeType) {",
          "kind": "code",
          "what": "Declare a private boolean MIME-type checker.",
          "why": "It encapsulates the claimed part-header allowlist independently of extension checks.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "boolean",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 73,
          "raw": "        if (mimeType == null) return false;",
          "code": "if (mimeType == null) return false;",
          "kind": "code",
          "what": "Return false for a null claimed MIME.",
          "why": "This guards later string operations.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "return",
            "if",
            "()",
            ";",
            "== / !="
          ]
        },
        {
          "line": 74,
          "raw": "        for (String allowed : ALLOWED_MIME_TYPES) {",
          "code": "for (String allowed : ALLOWED_MIME_TYPES) {",
          "kind": "code",
          "what": "Loop over each allowed MIME String.",
          "why": "The helper compares the incoming claim with every permitted label.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "for",
            "()",
            "{}"
          ]
        },
        {
          "line": 75,
          "raw": "            if (mimeType.toLowerCase().startsWith(allowed.toLowerCase())) {",
          "code": "if (mimeType.toLowerCase().startsWith(allowed.toLowerCase())) {",
          "kind": "code",
          "what": "Lowercase both Strings and compare using startsWith.",
          "why": "It makes matching case-insensitive and accepts prefixes such as an allowed type plus parameters.",
          "example": "text/plain; charset=utf-8 starts with text/plain.",
          "caution": "Prefix matching also admits malformed extensions of a type name; this is not exact MIME parsing or content inspection.",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 76,
          "raw": "                return true;",
          "code": "return true;",
          "kind": "code",
          "what": "Return true when any MIME prefix matches.",
          "why": "A matching claim passes this helper.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 77,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 75: if (mimeType.toLowerCase().startsWith(allowed.toLowerCase())) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 75's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 78,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 74: for (String allowed : ALLOWED_MIME_TYPES) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 74's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 79,
          "raw": "        return false;",
          "code": "return false;",
          "kind": "code",
          "what": "Return false when all comparisons fail.",
          "why": "The main handler will send 415 for an unaccepted claimed MIME.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 80,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 72: private boolean isAllowedMimeType(String mimeType) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 72's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 81,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 82,
          "raw": "    @Override",
          "code": "@Override",
          "kind": "code",
          "what": "Mark handle as the HttpHandler implementation.",
          "why": "The compiler checks that the method fulfills the interface.",
          "example": "",
          "caution": "",
          "syntax": [
            "Override"
          ]
        },
        {
          "line": 83,
          "raw": "    public void handle(HttpExchange exchange) throws IOException {",
          "code": "public void handle(HttpExchange exchange) throws IOException {",
          "kind": "code",
          "what": "Declare handle for one exchange, allowing IOException to propagate.",
          "why": "This is the callback the HTTP server invokes; request variables below are local to that invocation.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "throws",
            "()",
            "{}"
          ]
        },
        {
          "line": 84,
          "raw": "        Headers headers = exchange.getResponseHeaders();",
          "code": "Headers headers = exchange.getResponseHeaders();",
          "kind": "code",
          "what": "Get the response header collection.",
          "why": "CORS/JSON metadata belongs on the outgoing response, not in the request body.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 85,
          "raw": "        headers.add(\"Access-Control-Allow-Origin\", \"*\"); //This allows any website (any origin) to make requests to your server.",
          "code": "headers.add(\"Access-Control-Allow-Origin\", \"*\");",
          "kind": "code",
          "what": "Add wildcard Access-Control-Allow-Origin.",
          "why": "The separate frontend needs permission to read a cross-origin response.",
          "example": "This does not authorize a particular user or block nonbrowser clients.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 86,
          "raw": "        headers.add(\"Access-Control-Allow-Methods\", \"GET,POST,OPTIONS\"); //This tells browsers which HTTP methods are allowed for cross-origin requests",
          "code": "headers.add(\"Access-Control-Allow-Methods\", \"GET,POST,OPTIONS\");",
          "kind": "code",
          "what": "Advertise GET,POST,OPTIONS for CORS permission checks.",
          "why": "A browser preflight can inspect permitted cross-origin methods.",
          "example": "The actual upload branch below still requires POST.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 87,
          "raw": "        headers.add(\"Access-Control-Allow-Headers\", \"Content-Type,Authorization\"); // This tells browsers which custom headers the frontend is allowed to send in the actual request.",
          "code": "headers.add(\"Access-Control-Allow-Headers\", \"Content-Type,Authorization\");",
          "kind": "code",
          "what": "Permit Content-Type and Authorization header names in preflight.",
          "why": "Browsers may ask permission to send those headers.",
          "example": "Authorization is not parsed or verified by this upload handler.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 88,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 89,
          "raw": "        // Handle CORS preflight for this route",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 90,
          "raw": "        /* Without this, the browser would block your frontend’s request because it didn’t get permission from the backend.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 91,
          "raw": "           So, this snippet is essential for enabling CORS in my file-sharing app.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 92,
          "raw": "           Browsers send a preflight OPTIONS request when the main request is considered “non-simple. like here because we are",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 93,
          "raw": "           sharing something”*/",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 94,
          "raw": "        if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) { /* This line checks what type of request it is.",
          "code": "if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "kind": "code",
          "what": "Check whether this request is OPTIONS.",
          "why": "A browser preflight asks about permission rather than uploading payload.",
          "example": "Not every file upload requires preflight; request method, content type and headers determine that.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 95,
          "raw": "          It means: “Is this an HTTP OPTIONS request?” The browser automatically sends an OPTIONS request before certain types of",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 98: Send 204 with response length -1 for no body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 96,
          "raw": "          requests (like a POST with a file upload). This pre-check request is called a CORS Preflight Request.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 98: Send 204 with response length -1 for no body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 97,
          "raw": "          This request does not contain any actual data, just a permission check.*/",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 98: Send 204 with response length -1 for no body.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.",
          "syntax": []
        },
        {
          "line": 98,
          "raw": "            exchange.sendResponseHeaders(204, -1); /* It means: “Request handled successfully, but no response body.”",
          "code": "exchange.sendResponseHeaders(204, -1);",
          "kind": "code",
          "what": "Send 204 with response length -1 for no body.",
          "why": "The preflight needs CORS headers, not a file/text response.",
          "example": "Sending this status does not itself exit the method; line 101 performs the return.",
          "caution": "sendResponseHeaders does not stop execution. The subsequent return exits handle.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 99,
          "raw": "            This tells the server not to send any kind of body with the response.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 101: Return immediately after the OPTIONS response.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "sendResponseHeaders does not stop execution. The subsequent return exits handle.",
          "syntax": []
        },
        {
          "line": 100,
          "raw": "            Stops further code execution — because we only wanted to answer the preflight check.*/",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 101: Return immediately after the OPTIONS response.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "sendResponseHeaders does not stop execution. The subsequent return exits handle.",
          "syntax": []
        },
        {
          "line": 101,
          "raw": "            return;",
          "code": "return;",
          "kind": "code",
          "what": "Return immediately after the OPTIONS response.",
          "why": "It prevents counting/validating/storing a preflight as a file upload.",
          "example": "",
          "caution": "sendResponseHeaders does not stop execution. The subsequent return exits handle.",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 102,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 94: if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 94's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 103,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 104,
          "raw": "        /*because we are dealing with upload , which should be a post request, so we are checking for POST method,",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 106: Reject a method that is not POST after OPTIONS was handled.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 105,
          "raw": "          if the request we received at /upload with GET method , we are not allowed that request to pass through*/",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 106: Reject a method that is not POST after OPTIONS was handled.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 106,
          "raw": "        if (!exchange.getRequestMethod().equalsIgnoreCase(\"POST\")) {",
          "code": "if (!exchange.getRequestMethod().equalsIgnoreCase(\"POST\")) {",
          "kind": "code",
          "what": "Reject a method that is not POST after OPTIONS was handled.",
          "why": "An upload changes server state and expects a request body; unrelated methods must not enter that workflow.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            ".",
            "!"
          ]
        },
        {
          "line": 107,
          "raw": "            String response = \"Method Not Allowed\";",
          "code": "String response = \"Method Not Allowed\";",
          "kind": "code",
          "what": "Store the Method Not Allowed message in a local String named response.",
          "why": "This branch was selected because the incoming method is not POST; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 108,
          "raw": "            // first setting up the response headers",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 109: Send HTTP 405 with response.getBytes().length as the body byte count.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 109,
          "raw": "            exchange.sendResponseHeaders(405, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(405, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 405 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 110,
          "raw": "            //then setting up the response body.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 111: Acquire this error response's OutputStream in try-with-resources.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 111,
          "raw": "            try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 112,
          "raw": "                os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 113,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 111: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 111's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 114,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 115,
          "raw": "            return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the incoming method is not POST, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 116,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 106: if (!exchange.getRequestMethod().equalsIgnoreCase(\"POST\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 106's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 117,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 118,
          "raw": "        // Get the user's IP address",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 119: Read the exchange's remote socket address, then its InetAddress, then its textual IP.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 119,
          "raw": "        String userIp = exchange.getRemoteAddress().getAddress().getHostAddress();",
          "code": "String userIp = exchange.getRemoteAddress().getAddress().getHostAddress();",
          "kind": "code",
          "what": "Read the exchange's remote socket address, then its InetAddress, then its textual IP.",
          "why": "The per-IP limiter needs a map key associated with the network peer.",
          "example": "The chained dots call methods on each returned object.",
          "caution": "Behind a proxy this may be the proxy IP, not the original user's public IP.",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 120,
          "raw": "        long currentTime = System.currentTimeMillis();",
          "code": "long currentTime = System.currentTimeMillis();",
          "kind": "code",
          "what": "Capture the current wall-clock time in milliseconds.",
          "why": "The limiter compares elapsed window time using numeric timestamps.",
          "example": "A long accommodates epoch-millisecond values too large for an int.",
          "caution": "Wall-clock time can change; this is a simple window counter, not a full robust rate-limit service.",
          "syntax": [
            "long",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 121,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 122,
          "raw": "        // Look up this IP in our tracker map",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 123: Look up this IP's UploadInfo in the static map.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 123,
          "raw": "        UploadInfo info = uploadTracker.get(userIp);",
          "code": "UploadInfo info = uploadTracker.get(userIp);",
          "kind": "code",
          "what": "Look up this IP's UploadInfo in the static map.",
          "why": "A null result signals no previous record; a present record supports window/count logic.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 124,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 125,
          "raw": "        if (info == null) {",
          "code": "if (info == null) {",
          "kind": "code",
          "what": "Choose the first-attempt branch when no record was found.",
          "why": "An unseen IP needs both a start time and an initial count.",
          "example": "The get and later put are separate operations, so concurrent first attempts can race.",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 126,
          "raw": "            // First upload from this IP, start a new minute window",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 127: Create a new UploadInfo starting at currentTime with count one.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 127,
          "raw": "            info = new UploadInfo(currentTime);",
          "code": "info = new UploadInfo(currentTime);",
          "kind": "code",
          "what": "Create a new UploadInfo starting at currentTime with count one.",
          "why": "It records this first attempt.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 128,
          "raw": "            uploadTracker.put(userIp, info);",
          "code": "uploadTracker.put(userIp, info);",
          "kind": "code",
          "what": "Store that record under userIp.",
          "why": "Future requests from the same visible IP can find it.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 129,
          "raw": "        } else if (currentTime - info.minuteWindowStart > ONE_MINUTE_MS) {",
          "code": "} else if (currentTime - info.minuteWindowStart > ONE_MINUTE_MS) {",
          "kind": "code",
          "what": "If a record exists, check whether more than 60000 ms have elapsed since its start.",
          "why": "Expired windows should reset instead of accumulating counts forever.",
          "example": "Exactly 60000 is not > 60000, so this condition resets only after that point.",
          "caution": "",
          "syntax": [
            "if",
            "else",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 130,
          "raw": "            // It's a new minute, reset the counter",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 131: Replace the expired window start with the current timestamp.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 131,
          "raw": "            info.minuteWindowStart = currentTime;",
          "code": "info.minuteWindowStart = currentTime;",
          "kind": "code",
          "what": "Replace the expired window start with the current timestamp.",
          "why": "The new window is measured from this attempt.",
          "example": "",
          "caution": "",
          "syntax": [
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 132,
          "raw": "            info.uploadCount = 1;",
          "code": "info.uploadCount = 1;",
          "kind": "code",
          "what": "Reset count to one for the current request.",
          "why": "The first request in the refreshed window counts.",
          "example": "",
          "caution": "",
          "syntax": [
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 133,
          "raw": "        } else {",
          "code": "} else {",
          "kind": "code",
          "what": "Begin the alternative branch for an existing, unexpired window.",
          "why": "Requests in the current minute increment the existing count instead of resetting it.",
          "example": "",
          "caution": "",
          "syntax": [
            "else",
            "{}"
          ]
        },
        {
          "line": 134,
          "raw": "            // Still in the same minute, increase the count",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 135: Increment uploadCount by one.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 135,
          "raw": "            info.uploadCount++;",
          "code": "info.uploadCount++;",
          "kind": "code",
          "what": "Increment uploadCount by one.",
          "why": "Each attempt consumes one slot in the current window.",
          "example": "x++ here updates x to x+1; it is a compound read/modify/write.",
          "caution": "Concurrent increments of this mutable field can be lost.",
          "syntax": [
            ".",
            ";",
            "++ / +=",
            "+"
          ]
        },
        {
          "line": 136,
          "raw": "            if (info.uploadCount > MAX_UPLOADS_PER_MINUTE) {",
          "code": "if (info.uploadCount > MAX_UPLOADS_PER_MINUTE) {",
          "kind": "code",
          "what": "Check whether the updated count exceeds ten.",
          "why": "The eleventh counted attempt in a sequential window is rejected; the first ten pass this gate.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 137,
          "raw": "                // Too many uploads! Block this request , Rate limiting happens here",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 138: Store the Rate limit exceeded message in a local String named response.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 138,
          "raw": "                String response = \"Rate limit exceeded: Max \" + MAX_UPLOADS_PER_MINUTE + \" uploads per minute you can do.\";",
          "code": "String response = \"Rate limit exceeded: Max \" + MAX_UPLOADS_PER_MINUTE + \" uploads per minute you can do.\";",
          "kind": "code",
          "what": "Store the Rate limit exceeded message in a local String named response.",
          "why": "This branch was selected because the active window count is above MAX_UPLOADS_PER_MINUTE; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 139,
          "raw": "                exchange.sendResponseHeaders(429, response.getBytes().length); // 429 Too Many Requests",
          "code": "exchange.sendResponseHeaders(429, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 429 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 140,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 141,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 142,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 140: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 140's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 143,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the active window count is above MAX_UPLOADS_PER_MINUTE, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 144,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 136: if (info.uploadCount > MAX_UPLOADS_PER_MINUTE) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 136's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 145,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 133: } else {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 133's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 146,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 147,
          "raw": "        // fetching out the value of content type from request body",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 148: Get incoming request headers, distinct from outgoing headers on line 84.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Content-Type is read from request headers, not extracted from the body at this point.",
          "syntax": []
        },
        {
          "line": 148,
          "raw": "        Headers requestHeaders = exchange.getRequestHeaders();",
          "code": "Headers requestHeaders = exchange.getRequestHeaders();",
          "kind": "code",
          "what": "Get incoming request headers, distinct from outgoing headers on line 84.",
          "why": "Content-Type and Content-Length describe the uploaded envelope.",
          "example": "The earlier comment saying body is inaccurate: this reads the header collection.",
          "caution": "Content-Type is read from request headers, not extracted from the body at this point.",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 149,
          "raw": "        String contentType = null;",
          "code": "String contentType = null;",
          "kind": "code",
          "what": "Initialize request contentType to null.",
          "why": "It remains missing unless header scanning finds Content-Type.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "null",
            ";",
            "="
          ]
        },
        {
          "line": 150,
          "raw": "        for (String key : requestHeaders.keySet()) {",
          "code": "for (String key : requestHeaders.keySet()) {",
          "kind": "code",
          "what": "Loop over every request header name.",
          "why": "The author explicitly searches for the Content-Type key instead of a direct getFirst call.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "for",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 151,
          "raw": "            if (key != null && key.equalsIgnoreCase(\"Content-Type\")) {",
          "code": "if (key != null && key.equalsIgnoreCase(\"Content-Type\")) {",
          "kind": "code",
          "what": "Ignore null keys and compare the header name case-insensitively.",
          "why": "HTTP header names are not case-sensitive. && short-circuits the comparison when key is null.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            ".",
            "== / !=",
            "&& / ||"
          ]
        },
        {
          "line": 152,
          "raw": "                contentType = requestHeaders.getFirst(key);",
          "code": "contentType = requestHeaders.getFirst(key);",
          "kind": "code",
          "what": "Read the first value of the matched header into contentType.",
          "why": "Header collections can have multiple values, but this code uses the first one.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 153,
          "raw": "                break;",
          "code": "break;",
          "kind": "code",
          "what": "Break out of the header-name loop after finding the type.",
          "why": "Further key scanning is unnecessary once contentType has been assigned.",
          "example": "",
          "caution": "",
          "syntax": [
            "break",
            ";"
          ]
        },
        {
          "line": 154,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 151: if (key != null && key.equalsIgnoreCase(\"Content-Type\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 151's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 155,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 150: for (String key : requestHeaders.keySet()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 150's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 156,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 157,
          "raw": "        //validating the value of content type , it should be multipart/form-data",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 158: Reject a missing Content-Type or one not starting with multipart/form-data.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 158,
          "raw": "        if (contentType == null || !contentType.startsWith(\"multipart/form-data\")) {",
          "code": "if (contentType == null || !contentType.startsWith(\"multipart/form-data\")) {",
          "kind": "code",
          "what": "Reject a missing Content-Type or one not starting with multipart/form-data.",
          "why": "The parser expects a multipart envelope, not arbitrary JSON/plain text.",
          "example": "|| short-circuit avoids calling startsWith on null.",
          "caution": "This literal startsWith check is case-sensitive even though some later searches lowercase the value.",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            ".",
            "== / !=",
            "!",
            "&& / ||"
          ]
        },
        {
          "line": 159,
          "raw": "            String response = \"Bad Request: Content-Type must be multipart/form-data\";",
          "code": "String response = \"Bad Request: Content-Type must be multipart/form-data\";",
          "kind": "code",
          "what": "Store the Content-Type must be multipart/form-data message in a local String named response.",
          "why": "This branch was selected because the expected multipart envelope type is absent; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 160,
          "raw": "            exchange.sendResponseHeaders(400, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(400, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 400 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 161,
          "raw": "            try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 162,
          "raw": "                os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 163,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 161: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 161's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 164,
          "raw": "            return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the expected multipart envelope type is absent, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 165,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 158: if (contentType == null || !contentType.startsWith(\"multipart/form-data\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 158's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 166,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 167,
          "raw": "        // first line of defense , if Content-Length header is available , we read that length , if grater than max , we reject",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 168: Read the first Content-Length request-header value as a String.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 168,
          "raw": "        String contentLength = exchange.getRequestHeaders().getFirst(\"Content-Length\");",
          "code": "String contentLength = exchange.getRequestHeaders().getFirst(\"Content-Length\");",
          "kind": "code",
          "what": "Read the first Content-Length request-header value as a String.",
          "why": "If supplied, it permits an early size check before buffering the request.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 169,
          "raw": "        if (contentLength != null) {",
          "code": "if (contentLength != null) {",
          "kind": "code",
          "what": "Only parse the length when the header exists.",
          "why": "A chunked or otherwise lengthless request can still be checked during the later read loop.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 170,
          "raw": "            long len = Long.parseLong(contentLength);",
          "code": "long len = Long.parseLong(contentLength);",
          "kind": "code",
          "what": "Convert the decimal length String into a long.",
          "why": "Size comparisons require a number rather than text.",
          "example": "\"524288001\" -> long 524288001.",
          "caution": "A malformed numeric value throws unchecked NumberFormatException here, outside the later IOException catch.",
          "syntax": [
            "long",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 171,
          "raw": "            if (len > MAX_FILE_SIZE) {",
          "code": "if (len > MAX_FILE_SIZE) {",
          "kind": "code",
          "what": "Reject if the declared request length exceeds the configured byte limit.",
          "why": "This avoids unnecessarily reading an already-declared oversized request.",
          "example": "The declared length includes multipart overhead, not just extracted file bytes.",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}"
          ]
        },
        {
          "line": 172,
          "raw": "                // Reject immediately without reading",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 173: Store the maximum file size message in a local String named response.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 173,
          "raw": "                String response = \"File too large: Maximum file size is \" + (MAX_FILE_SIZE / (1024 * 1024)) + \"MB\";",
          "code": "String response = \"File too large: Maximum file size is \" + (MAX_FILE_SIZE / (1024 * 1024)) + \"MB\";",
          "kind": "code",
          "what": "Store the maximum file size message in a local String named response.",
          "why": "This branch was selected because the declared request byte length is over MAX_FILE_SIZE; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            "()",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 174,
          "raw": "                exchange.sendResponseHeaders(413, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(413, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 413 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 175,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 176,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 177,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 175: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 175's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 178,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the declared request byte length is over MAX_FILE_SIZE, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 179,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 171: if (len > MAX_FILE_SIZE) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 171's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 180,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 169: if (contentLength != null) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 169's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 181,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 182,
          "raw": "        try {",
          "code": "try {",
          "kind": "code",
          "what": "Begin the upload-processing try that catches IOException at line 288.",
          "why": "Request reading, disk writing and response writing may fail.",
          "example": "Earlier method/type/rate/header-length operations are outside this try.",
          "caution": "",
          "syntax": [
            "try",
            "{}"
          ]
        },
        {
          "line": 183,
          "raw": "            // Boundary extraction from Content-Type",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 184: Lowercase the request Content-Type and locate boundary=.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 184,
          "raw": "            int bIdx = contentType.toLowerCase().indexOf(\"boundary=\");",
          "code": "int bIdx = contentType.toLowerCase().indexOf(\"boundary=\");",
          "kind": "code",
          "what": "Lowercase the request Content-Type and locate boundary=.",
          "why": "The parser needs the delimiter text after that parameter name.",
          "example": "indexOf returns a character index or -1.",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 185,
          "raw": "            if (bIdx == -1) {",
          "code": "if (bIdx == -1) {",
          "kind": "code",
          "what": "Reject when boundary= was not found.",
          "why": "A multipart type alone is insufficient without the delimiter used in the body.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 186,
          "raw": "                String response = \"Bad Request: boundary missing in Content-Type\";",
          "code": "String response = \"Bad Request: boundary missing in Content-Type\";",
          "kind": "code",
          "what": "Store the boundary missing message in a local String named response.",
          "why": "This branch was selected because no boundary parameter was found in the envelope Content-Type; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 187,
          "raw": "                exchange.sendResponseHeaders(400, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(400, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 400 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 188,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 189,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 190,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 188: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 188's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 191,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because no boundary parameter was found in the envelope Content-Type, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 192,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 185: if (bIdx == -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 185's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 193,
          "raw": "            String boundary = contentType.substring(bIdx + 9).trim();",
          "code": "String boundary = contentType.substring(bIdx + 9).trim();",
          "kind": "code",
          "what": "Take the substring after the nine characters boundary= and trim surrounding whitespace.",
          "why": "The header parameter label is not part of the delimiter value.",
          "example": "multipart/form-data; boundary=abc -> abc.",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 194,
          "raw": "            int scIdx = boundary.indexOf(';');",
          "code": "int scIdx = boundary.indexOf(';');",
          "kind": "code",
          "what": "Find a semicolon within the remaining boundary text.",
          "why": "Another Content-Type parameter may follow the boundary.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 195,
          "raw": "            if (scIdx != -1) boundary = boundary.substring(0, scIdx).trim();",
          "code": "if (scIdx != -1) boundary = boundary.substring(0, scIdx).trim();",
          "kind": "code",
          "what": "If that semicolon exists, keep only the preceding trimmed text.",
          "why": "A later parameter must not become part of the delimiter.",
          "example": "abc; charset=utf-8 -> abc.",
          "caution": "This is a simple parser and does not account for every quoted parameter case.",
          "syntax": [
            "if",
            "()",
            ".",
            ";",
            "=",
            "== / !="
          ]
        },
        {
          "line": 196,
          "raw": "            if (boundary.startsWith(\"\\\"\") && boundary.endsWith(\"\\\"\")) {",
          "code": "if (boundary.startsWith(\"\\\"\") && boundary.endsWith(\"\\\"\")) {",
          "kind": "code",
          "what": "Check whether the value has a quote at both ends.",
          "why": "HTTP parameters may quote their value; those outer quotes are envelope syntax, not delimiter bytes.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            ".",
            "&& / ||",
            "escapes"
          ]
        },
        {
          "line": 197,
          "raw": "                boundary = boundary.substring(1, boundary.length() - 1);",
          "code": "boundary = boundary.substring(1, boundary.length() - 1);",
          "kind": "code",
          "what": "Remove the first and last quote characters by substring.",
          "why": "The body delimiter should match the unquoted boundary value.",
          "example": "\"abc\" -> abc; the Java escaped quote literal tests one quote character.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 198,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 196: if (boundary.startsWith(\"\\\"\") && boundary.endsWith(\"\\\"\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 196's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 199,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 200,
          "raw": "            // Check 2: Read request body with size limit (second line of defense)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 201: Create a ByteArrayOutputStream named baos that accumulates request bytes in heap memory.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 201,
          "raw": "            ByteArrayOutputStream baos = new ByteArrayOutputStream(); // array of bytes which can be acted as a stream, you can apply streams operation like reading.",
          "code": "ByteArrayOutputStream baos = new ByteArrayOutputStream();",
          "kind": "code",
          "what": "Create a ByteArrayOutputStream named baos that accumulates request bytes in heap memory.",
          "why": "The custom parser accepts a complete byte array, so the handler collects the whole request first.",
          "example": "It is an expandable in-memory output accumulator, not a network input stream.",
          "caution": "Memory grows with the request; later copies add to peak heap use.",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 202,
          "raw": "            byte[] buffer = new byte[8192];",
          "code": "byte[] buffer = new byte[8192];",
          "kind": "code",
          "what": "Allocate a reusable 8192-byte request-read buffer.",
          "why": "The handler reads the network stream in chunks rather than one byte per call.",
          "example": "8192 bytes = 8 KiB; baos still retains all accepted chunks.",
          "caution": "",
          "syntax": [
            "new",
            "byte",
            "[]",
            ";",
            "="
          ]
        },
        {
          "line": 203,
          "raw": "            int bytesRead;",
          "code": "int bytesRead;",
          "kind": "code",
          "what": "Declare the actual byte count returned by each request read.",
          "why": "The last chunk can be smaller than buffer capacity.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            ";"
          ]
        },
        {
          "line": 204,
          "raw": "            long totalBytesRead = 0;",
          "code": "long totalBytesRead = 0;",
          "kind": "code",
          "what": "Initialize a long totalBytesRead counter to zero.",
          "why": "The stream limit must work even when Content-Length was absent or untrustworthy.",
          "example": "",
          "caution": "",
          "syntax": [
            "long",
            ";",
            "="
          ]
        },
        {
          "line": 205,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 206,
          "raw": "            while ((bytesRead = exchange.getRequestBody().read(buffer)) != -1) {",
          "code": "while ((bytesRead = exchange.getRequestBody().read(buffer)) != -1) {",
          "kind": "code",
          "what": "Read a request-body chunk into buffer, assign bytesRead and loop until read returns -1.",
          "why": "exchange.getRequestBody() is the incoming upload stream; -1 means EOF.",
          "example": "A read count of 3000 means only the first 3000 buffer bytes are valid for this iteration.",
          "caution": "",
          "syntax": [
            "while",
            "()",
            "{}",
            ".",
            "=",
            "== / !="
          ]
        },
        {
          "line": 207,
          "raw": "                totalBytesRead += bytesRead;",
          "code": "totalBytesRead += bytesRead;",
          "kind": "code",
          "what": "Add the latest actual read count to the running total.",
          "why": "Cumulative size, not just chunk capacity, determines whether the request is too large.",
          "example": "+= is add then assign.",
          "caution": "",
          "syntax": [
            ";",
            "=",
            "++ / +=",
            "+"
          ]
        },
        {
          "line": 208,
          "raw": "                if (totalBytesRead > MAX_FILE_SIZE) {",
          "code": "if (totalBytesRead > MAX_FILE_SIZE) {",
          "kind": "code",
          "what": "Reject when cumulative request bytes exceed the limit.",
          "why": "A stream without an oversized declaration must still be bounded.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}"
          ]
        },
        {
          "line": 209,
          "raw": "                    String response = \"File too large: Maximum file size is \" + (MAX_FILE_SIZE / (1024 * 1024)) + \"MB\";",
          "code": "String response = \"File too large: Maximum file size is \" + (MAX_FILE_SIZE / (1024 * 1024)) + \"MB\";",
          "kind": "code",
          "what": "Store the maximum file size message in a local String named response.",
          "why": "This branch was selected because the bytes actually read exceed the request-size cap; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            "()",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 210,
          "raw": "                    exchange.sendResponseHeaders(413, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(413, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 413 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 211,
          "raw": "                    try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 212,
          "raw": "                        os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 213,
          "raw": "                    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 211: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 211's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 214,
          "raw": "                    return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the bytes actually read exceed the request-size cap, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 215,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 208: if (totalBytesRead > MAX_FILE_SIZE) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 208's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 216,
          "raw": "                baos.write(buffer, 0, bytesRead);",
          "code": "baos.write(buffer, 0, bytesRead);",
          "kind": "code",
          "what": "Append bytesRead valid bytes from buffer offset zero into baos.",
          "why": "The parser needs every accepted envelope byte without stale bytes from short reads.",
          "example": "This increases the accumulator's size; it does not write the file to disk yet.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 217,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 206: while ((bytesRead = exchange.getRequestBody().read(buffer)) != -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 206's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 218,
          "raw": "            byte[] requestData = baos.toByteArray();",
          "code": "byte[] requestData = baos.toByteArray();",
          "kind": "code",
          "what": "Copy accumulated request bytes into a new byte array requestData.",
          "why": "MultiParser's constructor takes byte[] rather than an InputStream.",
          "example": "toByteArray returns a copy, so the accumulator and returned array can coexist in memory.",
          "caution": "",
          "syntax": [
            "byte",
            "()",
            "[]",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 219,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 220,
          "raw": "            MultiParser multiParser = new MultiParser(requestData, boundary);",
          "code": "MultiParser multiParser = new MultiParser(requestData, boundary);",
          "kind": "code",
          "what": "Construct a MultiParser for this complete requestData and extracted boundary.",
          "why": "The handler delegates envelope decoding/extraction to a separate class.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 221,
          "raw": "            MultiParser.ParseResult result = multiParser.parse();",
          "code": "MultiParser.ParseResult result = multiParser.parse();",
          "kind": "code",
          "what": "Call parse() and store its nullable nested ParseResult.",
          "why": "The result carries the filename, payload array and claimed MIME; null means extraction failed.",
          "example": "MultiParser.ParseResult names the nested type.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 222,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 223,
          "raw": "            if (result == null) {",
          "code": "if (result == null) {",
          "kind": "code",
          "what": "Check whether parsing returned null.",
          "why": "Later field reads would dereference null, and malformed envelope data should not be stored.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 224,
          "raw": "                String response = \"Bad request: Could not parse file content\";",
          "code": "String response = \"Bad request: Could not parse file content\";",
          "kind": "code",
          "what": "Store the Could not parse file content message in a local String named response.",
          "why": "This branch was selected because the multipart parser could not extract a usable file result; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 225,
          "raw": "                exchange.sendResponseHeaders(400, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(400, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 400 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 226,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 227,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 228,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 226: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 226's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 229,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the multipart parser could not extract a usable file result, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 230,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 223: if (result == null) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 223's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 231,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 232,
          "raw": "            // Check 3: Validate actual file content size (third line of defense)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 233: If fileContent exists, reject when its extracted length exceeds the cap.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 233,
          "raw": "            if (result.fileContent != null && result.fileContent.length > MAX_FILE_SIZE) {",
          "code": "if (result.fileContent != null && result.fileContent.length > MAX_FILE_SIZE) {",
          "kind": "code",
          "what": "If fileContent exists, reject when its extracted length exceeds the cap.",
          "why": "This is a defensive payload-size check after the earlier envelope-size checks.",
          "example": "&& avoids accessing .length when fileContent is null.",
          "caution": "It does not explicitly reject a null payload; the current parser normally returns a nonnull array on success.",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            ".",
            "== / !=",
            "&& / ||"
          ]
        },
        {
          "line": 234,
          "raw": "                String response = \"File too large: Maximum file size is \" + (MAX_FILE_SIZE / (1024 * 1024)) + \"MB\";",
          "code": "String response = \"File too large: Maximum file size is \" + (MAX_FILE_SIZE / (1024 * 1024)) + \"MB\";",
          "kind": "code",
          "what": "Store the maximum file size message in a local String named response.",
          "why": "This branch was selected because the extracted file payload exceeds MAX_FILE_SIZE; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            "()",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 235,
          "raw": "                exchange.sendResponseHeaders(413, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(413, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 413 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 236,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 237,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 238,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 236: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 236's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 239,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the extracted file payload exceeds MAX_FILE_SIZE, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 240,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 233: if (result.fileContent != null && result.fileContent.length > MAX_FILE_SIZE) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 233's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 241,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 242,
          "raw": "            String filename = result.fileName;",
          "code": "String filename = result.fileName;",
          "kind": "code",
          "what": "Read the result's filename into a local String.",
          "why": "Naming and extension validation follow parsing.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 243,
          "raw": "            if (filename == null || filename.trim().isEmpty()) {",
          "code": "if (filename == null || filename.trim().isEmpty()) {",
          "kind": "code",
          "what": "Check whether the name is null or becomes empty after trimming.",
          "why": "An absent/blank client filename needs a fallback before name-based checks.",
          "example": "|| short-circuits to avoid trim on null.",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            ".",
            "== / !=",
            "&& / ||"
          ]
        },
        {
          "line": 244,
          "raw": "                filename = \"deafult.txt\";",
          "code": "filename = \"deafult.txt\";",
          "kind": "code",
          "what": "Use the literal fallback deafult.txt.",
          "why": "It supplies a .txt name when the extracted one is missing/blank.",
          "example": "The misspelling is in the actual stored fallback string; it has no special Java meaning.",
          "caution": "",
          "syntax": [
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 245,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 243: if (filename == null || filename.trim().isEmpty()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 243's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 246,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 247,
          "raw": "            // Check 4: Validate file extension (block executables and malicious files)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 248: Reject if the filename does not match an allowed extension.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Suffix validation cannot prove that a permitted-named file is not malicious.",
          "syntax": []
        },
        {
          "line": 248,
          "raw": "            if (!isAllowedExtension(filename)) {",
          "code": "if (!isAllowedExtension(filename)) {",
          "kind": "code",
          "what": "Reject if the filename does not match an allowed extension.",
          "why": "Executables/other unlisted suffixes should not pass the naming policy.",
          "example": "! flips the helper's boolean.",
          "caution": "This cannot establish that an allowed-named payload is harmless. Suffix validation cannot prove that a permitted-named file is not malicious.",
          "syntax": [
            "if",
            "()",
            "{}",
            "!"
          ]
        },
        {
          "line": 249,
          "raw": "                String response = \"File type not allowed. Allowed extensions: .txt, .pdf, .jpg, .jpeg, .png, .gif, .zip, .doc, .docx, .csv Only\";",
          "code": "String response = \"File type not allowed. Allowed extensions: .txt, .pdf, .jpg, .jpeg, .png, .gif, .zip, .doc, .docx, .csv Only\";",
          "kind": "code",
          "what": "Store the allowed file extensions message in a local String named response.",
          "why": "This branch was selected because the filename suffix is not on ALLOWED_EXTENSIONS; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 250,
          "raw": "                exchange.sendResponseHeaders(415, response.getBytes().length); // 415 Unsupported Media Type",
          "code": "exchange.sendResponseHeaders(415, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 415 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 251,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 252,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 253,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 251: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 251's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 254,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the filename suffix is not on ALLOWED_EXTENSIONS, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 255,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 248: if (!isAllowedExtension(filename)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 248's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 256,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 257,
          "raw": "            // Check 5: Validate MIME type from multipart Content-Type (extra safety layer)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 258: Copy the claimed file-part MIME type from the parser result.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 258,
          "raw": "            String fileMimeType = result.contentType;",
          "code": "String fileMimeType = result.contentType;",
          "kind": "code",
          "what": "Copy the claimed file-part MIME type from the parser result.",
          "why": "This is different from the multipart envelope type checked before parsing.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 259,
          "raw": "            if (!isAllowedMimeType(fileMimeType)) {",
          "code": "if (!isAllowedMimeType(fileMimeType)) {",
          "kind": "code",
          "what": "Reject if that claim fails the MIME helper.",
          "why": "The application applies both extension and MIME policy before writing disk.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "!"
          ]
        },
        {
          "line": 260,
          "raw": "                String response = \"MIME type not allowed. Allowed types: text/plain, application/pdf, image/jpeg, image/png, image/gif, application/zip, application/octet-stream, application/msword, text/csv\";",
          "code": "String response = \"MIME type not allowed. Allowed types: text/plain, application/pdf, image/jpeg, image/png, image/gif, application/zip, application/octet-stream, application/msword, text/csv\";",
          "kind": "code",
          "what": "Store the allowed MIME types message in a local String named response.",
          "why": "This branch was selected because the claimed part Content-Type is not accepted by ALLOWED_MIME_TYPES; the next lines send that one error body.",
          "example": "",
          "caution": "A local response declared inside this branch is different from response variables in other branches.",
          "syntax": [
            "String",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 261,
          "raw": "                exchange.sendResponseHeaders(415, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(415, response.getBytes().length);",
          "kind": "code",
          "what": "Send HTTP 415 with response.getBytes().length as the body byte count.",
          "why": "The client needs the error status and encoded body length before the body is written.",
          "example": "getBytes encodes text; .length is the resulting byte-array length.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 262,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire this error response's OutputStream in try-with-resources.",
          "why": "The handler must write the body and close its stream even if writing fails.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 263,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode the response String and write those bytes to the error body.",
          "why": "Headers alone do not send the promised error text.",
          "example": "The same default charset is used for the length and body conversion.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 264,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 262: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 262's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 265,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after sending this rejection.",
          "why": "Because the claimed part Content-Type is not accepted by ALLOWED_MIME_TYPES, this request must not reach subsequent parsing, disk storage or share registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 266,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 259: if (!isAllowedMimeType(fileMimeType)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 259's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 267,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 268,
          "raw": "            String uniqueFileName = UUID.randomUUID() + \"_\" + new File(filename).getName();",
          "code": "String uniqueFileName = UUID.randomUUID() + \"_\" + new File(filename).getName();",
          "kind": "code",
          "what": "Build a stored basename by concatenating a random UUID, underscore and the host-platform basename of filename.",
          "why": "Different uploads of notes.txt should not overwrite each other, and normal directory components should not become the storage path.",
          "example": "An example is 550e8400-..._notes.txt; new File(filename).getName() extracts a basename.",
          "caution": "This is not full portable untrusted-name/header validation. The sender later exposes this UUID prefix.",
          "syntax": [
            "new",
            "String",
            "()",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 269,
          "raw": "            String filePath = uploadDir + File.separator + uniqueFileName;",
          "code": "String filePath = uploadDir + File.separator + uniqueFileName;",
          "kind": "code",
          "what": "Join the configured upload directory, platform separator and generated basename.",
          "why": "The disk writer needs the full destination path.",
          "example": "uploadDir + File.separator + uniqueFileName.",
          "caution": "",
          "syntax": [
            "String",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 270,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 271,
          "raw": "            try (FileOutputStream fos = new FileOutputStream(filePath)) {",
          "code": "try (FileOutputStream fos = new FileOutputStream(filePath)) {",
          "kind": "code",
          "what": "Open a FileOutputStream to the chosen destination in try-with-resources.",
          "why": "The accepted payload must be persisted before a file listener can serve it; the stream closes automatically.",
          "example": "Opening creates the file, or normally truncates it if already present.",
          "caution": "",
          "syntax": [
            "new",
            "try",
            "()",
            "{}",
            "="
          ]
        },
        {
          "line": 272,
          "raw": "                fos.write(result.fileContent);",
          "code": "fos.write(result.fileContent);",
          "kind": "code",
          "what": "Write the complete extracted payload array to the disk stream.",
          "why": "This is where the actual file bytes move from parser heap memory to the upload directory.",
          "example": "Unlike chunked disk streaming, this write receives the entire in-memory payload array.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 273,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 271: try (FileOutputStream fos = new FileOutputStream(filePath)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 271's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 274,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 275,
          "raw": "            int port = fileSharer.offerFile(filePath , userIp);",
          "code": "int port = fileSharer.offerFile(filePath , userIp);",
          "kind": "code",
          "what": "Register the saved path and visible uploader IP, receiving the chosen port.",
          "why": "FileSharer needs to associate its pending share with a disk location before listener startup.",
          "example": "offerFile does not bind or validate OS availability.",
          "caution": "",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 276,
          "raw": "            String token = fileSharer.getToken(port); // Get the access token",
          "code": "String token = fileSharer.getToken(port);",
          "kind": "code",
          "what": "Retrieve the token stored under the returned port.",
          "why": "The HTTP response must give the uploader a collection code.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 277,
          "raw": "            new Thread(() -> fileSharer.startFileServer(port)).start();",
          "code": "new Thread(() -> fileSharer.startFileServer(port)).start();",
          "kind": "code",
          "what": "Wrap a no-argument lambda calling startFileServer(port) in a new Thread, then start it.",
          "why": "The listener blocks on accept; running it separately lets the upload handler return its HTTP response.",
          "example": "port is effectively final in this scope and can be captured by the lambda.",
          "caution": "There is no readiness signal: JSON can be returned before the listener binds, and listener failure does not undo this upload here.",
          "syntax": [
            "new",
            "()",
            ".",
            ";",
            "->"
          ]
        },
        {
          "line": 278,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 279,
          "raw": "            // Return both port and token in JSON response. because you must tell the frontend (or client) how to access that file.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 282: Construct JSON text containing a numeric port and quoted String token.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.",
          "syntax": []
        },
        {
          "line": 280,
          "raw": "            //That’s what this jsonResponse block does — it sends information back to the client in a structured JSON format.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 282: Construct JSON text containing a numeric port and quoted String token.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.",
          "syntax": []
        },
        {
          "line": 281,
          "raw": "            // because both port and token is required by the frontend to download the file.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 282: Construct JSON text containing a numeric port and quoted String token.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.",
          "syntax": []
        },
        {
          "line": 282,
          "raw": "            String jsonResponse = \"{\\\"port\\\": \" + port + \", \\\"token\\\": \\\"\" + token + \"\\\"}\";",
          "code": "String jsonResponse = \"{\\\"port\\\": \" + port + \", \\\"token\\\": \\\"\" + token + \"\\\"}\";",
          "kind": "code",
          "what": "Construct JSON text containing a numeric port and quoted String token.",
          "why": "The browser expects structured response.data.port and response.data.token fields.",
          "example": "With example values: {\"port\": 53817, \"token\": \"482915\"}. Backslashes escape quote characters in Java source.",
          "caution": "The current browser only needs the PIN to download; its path port is dummy 0. The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.",
          "syntax": [
            "String",
            "{}",
            ";",
            "=",
            "+",
            "escapes"
          ]
        },
        {
          "line": 283,
          "raw": "            headers.add(\"Content-Type\", \"application/json\");",
          "code": "headers.add(\"Content-Type\", \"application/json\");",
          "kind": "code",
          "what": "Set response Content-Type to application/json.",
          "why": "The browser/client should interpret the success body as JSON rather than a text error.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 284,
          "raw": "            exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);",
          "code": "exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);",
          "kind": "code",
          "what": "Send success status 200 and the encoded JSON byte count.",
          "why": "Response headers/status must precede the actual JSON body.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 285,
          "raw": "            try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Obtain the success response stream with automatic closure.",
          "why": "The body containing the returned share data needs to be written and completed.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 286,
          "raw": "                os.write(jsonResponse.getBytes());",
          "code": "os.write(jsonResponse.getBytes());",
          "kind": "code",
          "what": "Write the JSON response bytes.",
          "why": "This delivers the port and token to Share.jsx after the server-side upload setup.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 287,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 285: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 285's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 288,
          "raw": "        } catch (IOException ex) {",
          "code": "} catch (IOException ex) {",
          "kind": "code",
          "what": "Catch IOException thrown inside the upload-processing try.",
          "why": "Request reads, file creation/write and HTTP response writes can fail.",
          "example": "This catch does not handle all unchecked exceptions and does not catch exceptions inside the separate listener thread.",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 289,
          "raw": "            System.err.println(\"Error processing file upload: \" + ex.getMessage());",
          "code": "System.err.println(\"Error processing file upload: \" + ex.getMessage());",
          "kind": "code",
          "what": "Log the upload I/O failure description.",
          "why": "It supplies a diagnostic for failed processing.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 290,
          "raw": "            String response = \"Server error: \" + ex.getMessage();",
          "code": "String response = \"Server error: \" + ex.getMessage();",
          "kind": "code",
          "what": "Construct a server-error String including the exception message.",
          "why": "The author provides a caller-visible I/O failure response.",
          "example": "Raw internal messages may reveal filesystem/network details.",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 291,
          "raw": "            exchange.sendResponseHeaders(500, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(500, response.getBytes().length);",
          "kind": "code",
          "what": "Attempt a 500 response with its text byte length.",
          "why": "Failures before success headers can be reported as server errors.",
          "example": "If 200 has already been committed, a second status cannot reliably replace it.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 292,
          "raw": "            try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire the attempted error response stream.",
          "why": "The failure body needs the same resource-closure discipline as success.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 293,
          "raw": "                os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Write the error text bytes.",
          "why": "The caller sees the message if the response remains writable.",
          "example": "This error path does not compensate for a saved original file or registered share.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 294,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 292: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 292's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 295,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 288: } catch (IOException ex) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 288's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 296,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 83: public void handle(HttpExchange exchange) throws IOException {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 83's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 297,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 18: public class UploadHandler implements HttpHandler {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 18's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        }
      ]
    },
    {
      "name": "FileSharer.java",
      "path": "Service/FileSharer.java",
      "purpose": "Own pending transfer metadata/PINs, start a per-file listener, send disk bytes and clean a consumed share.",
      "caller": "UploadHandler calls offerFile/getToken/startFileServer; DownloadHandler calls reverse lookup/cleanup.",
      "analogy": "A shared notebook plus a one-connection file-serving desk.",
      "checks": [
        [
          "What does Integer mean in the map declaration?",
          "The boxed object form of int; Java generics require reference types, and map calls box/unbox port values."
        ],
        [
          "What has closed after accept returns and the listener try block ends?",
          "The listening ServerSocket closes; the accepted client Socket is a separate connection used by FileSenderHandler."
        ],
        [
          "Does Socket.setSoTimeout(30000) force writes to finish within 30 seconds?",
          "No. It controls socket reads; this sender mostly writes."
        ]
      ],
      "id": "filesharer",
      "hash": "eef825eeb6111d0133e19d473a2ec3fdd5168b903dc97426971b4d8fc8eabdef",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P.Service;",
          "code": "package P2P.Service;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P.Service package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Service.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "import P2P.Utils.UploadUtils;",
          "code": "import P2P.Utils.UploadUtils;",
          "kind": "import",
          "what": "Make the type P2P.Utils.UploadUtils available by its short name UploadUtils. Your static port-candidate helper.",
          "why": "FileSharer calls generatePort while looking for a registry key. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.Utils.UploadUtils where UploadUtils is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 4,
          "raw": "import java.io.File;",
          "code": "import java.io.File;",
          "kind": "import",
          "what": "Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.",
          "why": "Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.File where File is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 5,
          "raw": "import java.io.FileInputStream;",
          "code": "import java.io.FileInputStream;",
          "kind": "import",
          "what": "Make the type java.io.FileInputStream available by its short name FileInputStream. An InputStream that reads from a disk file.",
          "why": "The TCP sender and staged HTTP copy need the original file bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.FileInputStream where FileInputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 6,
          "raw": "import java.io.IOException;",
          "code": "import java.io.IOException;",
          "kind": "import",
          "what": "Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.",
          "why": "Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.IOException where IOException is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 7,
          "raw": "import java.io.OutputStream;",
          "code": "import java.io.OutputStream;",
          "kind": "import",
          "what": "Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.",
          "why": "HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 8,
          "raw": "import java.net.ServerSocket;",
          "code": "import java.net.ServerSocket;",
          "kind": "import",
          "what": "Make the type java.net.ServerSocket available by its short name ServerSocket. A listening TCP endpoint that binds a port and accepts connections.",
          "why": "Each pending file creates one temporary listener. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.net.ServerSocket where ServerSocket is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 9,
          "raw": "import java.net.Socket;",
          "code": "import java.net.Socket;",
          "kind": "import",
          "what": "Make the type java.net.Socket available by its short name Socket. A connected TCP endpoint with input/output streams.",
          "why": "The download handler connects; the file listener accepts a connected Socket. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.net.Socket where Socket is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 10,
          "raw": "import java.util.Map;",
          "code": "import java.util.Map;",
          "kind": "import",
          "what": "Make the type java.util.Map available by its short name Map. The general key/value map interface, including Map.Entry.",
          "why": "FileSharer uses Map.Entry to loop over token-map entries during reverse lookup. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.Map where Map is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 11,
          "raw": "import java.util.Random;",
          "code": "import java.util.Random;",
          "kind": "import",
          "what": "Make the type java.util.Random available by its short name Random. A pseudorandom number generator with bounded integer selection.",
          "why": "Used for candidate ports and six-digit PINs; it is not a cryptographic access-secret generator. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.Random where Random is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 12,
          "raw": "import java.util.concurrent.ConcurrentHashMap;",
          "code": "import java.util.concurrent.ConcurrentHashMap;",
          "kind": "import",
          "what": "Make the type java.util.concurrent.ConcurrentHashMap available by its short name ConcurrentHashMap. A map supporting safe individual concurrent operations.",
          "why": "Several threads access registry/limiter maps; compound workflows and mutable values still require coordination. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.util.concurrent.ConcurrentHashMap where ConcurrentHashMap is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 13,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 14,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 15,
          "raw": "/* FileSharer is a service class that:",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.",
          "syntax": []
        },
        {
          "line": 16,
          "raw": "Keeps track of which files are available for sharing.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.",
          "syntax": []
        },
        {
          "line": 17,
          "raw": "Assigns a unique port and access token for each file.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.",
          "syntax": []
        },
        {
          "line": 18,
          "raw": "Handles the logic for sending a file to a client using a temporary socket server.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.",
          "syntax": []
        },
        {
          "line": 19,
          "raw": "Cleans up once a file has been sent.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.",
          "syntax": []
        },
        {
          "line": 20,
          "raw": "It’s essentially managing a small, temporary file-serving network node. */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.",
          "syntax": []
        },
        {
          "line": 21,
          "raw": "public class FileSharer {",
          "code": "public class FileSharer {",
          "kind": "code",
          "what": "Declare the public FileSharer class.",
          "why": "Both HTTP handlers need to call this common state/service object.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "class",
            "{}"
          ]
        },
        {
          "line": 22,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 23,
          "raw": "    //basically it is file metadata, that give info about the single file.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 24: Declare a private static nested class FileInfo.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 24,
          "raw": "    private static class FileInfo {",
          "code": "private static class FileInfo {",
          "kind": "code",
          "what": "Declare a private static nested class FileInfo.",
          "why": "The port registry needs to keep disk path and uploader host together. private hides this internal representation; static avoids an implicit reference to an enclosing FileSharer.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "static",
            "class",
            "{}"
          ]
        },
        {
          "line": 25,
          "raw": "        String filePath; // filePath: where the file is located on disk.",
          "code": "String filePath;",
          "kind": "code",
          "what": "Declare a String field holding the uploaded file's full disk path.",
          "why": "The socket sender must open the exact stored file later.",
          "example": "The value is a path such as C:\\Temp\\SkyLink-uploads\\UUID_notes.txt, not the payload itself.",
          "caution": "",
          "syntax": [
            "String",
            ";"
          ]
        },
        {
          "line": 26,
          "raw": "        String host;    //host: who uploaded it (IP address or hostname).",
          "code": "String host;",
          "kind": "code",
          "what": "Declare a String holding the uploader's IP address/host.",
          "why": "offerFile records who sent the HTTP upload.",
          "example": "This is metadata; the current DownloadHandler does not use it to locate the listener.",
          "caution": "The listener is on the server, not on this client host.",
          "syntax": [
            "String",
            ";"
          ]
        },
        {
          "line": 27,
          "raw": "        FileInfo(String filePath, String host) {",
          "code": "FileInfo(String filePath, String host) {",
          "kind": "code",
          "what": "Declare FileInfo's constructor with path and host parameters.",
          "why": "A new registry record can be created with both values in one operation.",
          "example": "The constructor is package-accessible within this private nested class, not declared public.",
          "caution": "",
          "syntax": [
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 28,
          "raw": "            this.filePath = filePath;",
          "code": "this.filePath = filePath;",
          "kind": "code",
          "what": "Assign the path parameter to this FileInfo's filePath field.",
          "why": "Retains the disk location after the constructor returns.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 29,
          "raw": "            this.host = host;",
          "code": "this.host = host;",
          "kind": "code",
          "what": "Assign the host parameter to the host field.",
          "why": "Retains the uploader address as part of the metadata.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 30,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 27: FileInfo(String filePath, String host) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 27's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 31,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 24: private static class FileInfo {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 24's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 32,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 33,
          "raw": "    /* availableFiles: Maps a port to a FileInfo (file + host info).",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 35: Declare a private final ConcurrentHashMap whose keys are Integer ports and values are FileInfo records.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 34,
          "raw": "    → This tells the server: “On port 5050, serve file xyz.txt.”*/",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 35: Declare a private final ConcurrentHashMap whose keys are Integer ports and values are FileInfo records.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 35,
          "raw": "    private final ConcurrentHashMap<Integer, FileInfo> availableFiles;",
          "code": "private final ConcurrentHashMap<Integer, FileInfo> availableFiles;",
          "kind": "code",
          "what": "Declare a private final ConcurrentHashMap whose keys are Integer ports and values are FileInfo records.",
          "why": "Concurrent HTTP/file threads need safe individual lookup/insertion/removal operations.",
          "example": "availableFiles.get(53817) could return FileInfo(path, \"10.0.0.5\").",
          "caution": "final fixes the map reference; it does not freeze entries or make multi-operation algorithms atomic.",
          "syntax": [
            "private",
            "final",
            "Integer",
            ";",
            "<>"
          ]
        },
        {
          "line": 36,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 37,
          "raw": "    /* accessTokens: Maps a port to a secure token (like a password).",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 39: Declare another ConcurrentHashMap mapping Integer ports to String PINs.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The PIN is generated with Random and lacks uniqueness/guess-attempt enforcement; secure is an overstatement. The raw socket does not verify a PIN.",
          "syntax": []
        },
        {
          "line": 38,
          "raw": "    → Prevents unauthorized downloads. */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 39: Declare another ConcurrentHashMap mapping Integer ports to String PINs.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "The PIN is generated with Random and lacks uniqueness/guess-attempt enforcement; secure is an overstatement. The raw socket does not verify a PIN.",
          "syntax": []
        },
        {
          "line": 39,
          "raw": "    private final ConcurrentHashMap<Integer, String> accessTokens;",
          "code": "private final ConcurrentHashMap<Integer, String> accessTokens;",
          "kind": "code",
          "what": "Declare another ConcurrentHashMap mapping Integer ports to String PINs.",
          "why": "The service associates an access code with each registered candidate port.",
          "example": "accessTokens.get(53817) -> \"482915\".",
          "caution": "Two maps require coordination; individually safe puts do not guarantee a consistent record/PIN pair.",
          "syntax": [
            "private",
            "final",
            "String",
            "Integer",
            ";",
            "<>"
          ]
        },
        {
          "line": 40,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 41,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 42,
          "raw": "    // constructor used to initialize a maps",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 43: Declare the public no-argument FileSharer constructor.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 43,
          "raw": "    public FileSharer() {",
          "code": "public FileSharer() {",
          "kind": "code",
          "what": "Declare the public no-argument FileSharer constructor.",
          "why": "The controller needs to create an initially empty registry without any external configuration.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "()",
            "{}"
          ]
        },
        {
          "line": 44,
          "raw": "        availableFiles = new ConcurrentHashMap<>();",
          "code": "availableFiles = new ConcurrentHashMap<>();",
          "kind": "code",
          "what": "Create and assign the empty port-to-FileInfo map.",
          "why": "A declared field alone contains no constructed map; offerFile/get calls need an actual object.",
          "example": "<> is the diamond operator: Java infers the generic types from the field declaration.",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "=",
            "<>"
          ]
        },
        {
          "line": 45,
          "raw": "        accessTokens = new ConcurrentHashMap<>();",
          "code": "accessTokens = new ConcurrentHashMap<>();",
          "kind": "code",
          "what": "Create and assign the empty port-to-PIN map.",
          "why": "Token operations need their own initialized lookup table.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "=",
            "<>"
          ]
        },
        {
          "line": 46,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 43: public FileSharer() {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 43's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 47,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 48,
          "raw": "    /* Generates a 6-digit random token, e.g. \"834192\".",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare a private method that generates and returns a String PIN.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Six digits describe its format, not uniqueness or verified user identity.",
          "syntax": []
        },
        {
          "line": 49,
          "raw": "       Used for file download authentication.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare a private method that generates and returns a String PIN.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Six digits describe its format, not uniqueness or verified user identity.",
          "syntax": []
        },
        {
          "line": 50,
          "raw": "       So when someone uploads a file, they get a unique token that must be shared with the downloader. */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare a private method that generates and returns a String PIN.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Six digits describe its format, not uniqueness or verified user identity.",
          "syntax": []
        },
        {
          "line": 51,
          "raw": "    private String generateAccessToken() {",
          "code": "private String generateAccessToken() {",
          "kind": "code",
          "what": "Declare a private method that generates and returns a String PIN.",
          "why": "PIN creation is an implementation detail called by offerFile.",
          "example": "String preserves a token's representation rather than treating it as arithmetic input.",
          "caution": "",
          "syntax": [
            "private",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 52,
          "raw": "        Random random = new Random();",
          "code": "Random random = new Random();",
          "kind": "code",
          "what": "Construct java.util.Random.",
          "why": "The next line uses nextInt to choose a six-digit number.",
          "example": "Random is pseudorandom, not a cryptographic secret generator.",
          "caution": "SecureRandom and uniqueness checking would be stronger for access secrets.",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 53,
          "raw": "        int pin = 100000 + random.nextInt(900000);",
          "code": "int pin = 100000 + random.nextInt(900000);",
          "kind": "code",
          "what": "Choose a value from 0 through 899999, add 100000, and store the six-digit result in pin.",
          "why": "The offset produces numbers 100000 through 999999 without leading zeros.",
          "example": "offset 382915 -> pin 482915; there are 900000 possible codes.",
          "caution": "Randomness does not guarantee that another live transfer has a different PIN.",
          "syntax": [
            "int",
            "()",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 54,
          "raw": "        return String.valueOf(pin);",
          "code": "return String.valueOf(pin);",
          "kind": "code",
          "what": "Convert the int PIN into a String and return it.",
          "why": "accessTokens stores String values and the JSON/frontend share codes as text.",
          "example": "String.valueOf(482915) -> \"482915\".",
          "caution": "",
          "syntax": [
            "String",
            "return",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 55,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 51: private String generateAccessToken() {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 51's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 56,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 57,
          "raw": "    /* This method is called when someone offers (uploads) a file.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 58,
          "raw": "    It: Generates a random port number (via UploadUtils.generatePort()).",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 59,
          "raw": "    Checks if that port is free (not already in use).",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 60,
          "raw": "    If free: Stores the file info in availableFiles.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 61,
          "raw": "    Creates and stores a token in accessTokens.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 62,
          "raw": "    Returns that port",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 63,
          "raw": "    So each uploaded file gets:",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 64,
          "raw": "      1. A unique port",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 65,
          "raw": "      2. A unique access token  */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.",
          "syntax": []
        },
        {
          "line": 66,
          "raw": "    public int offerFile(String filePath, String uploaderHost) {",
          "code": "public int offerFile(String filePath, String uploaderHost) {",
          "kind": "code",
          "what": "Declare offerFile(path, uploaderHost), returning an int port.",
          "why": "UploadHandler needs to register a stored file and learn the chosen per-file port.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "int",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 67,
          "raw": "        int port;",
          "code": "int port;",
          "kind": "code",
          "what": "Declare a local int port without assigning a value yet.",
          "why": "Every loop iteration overwrites it with a new candidate before use.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            ";"
          ]
        },
        {
          "line": 68,
          "raw": "        while (true) {",
          "code": "while (true) {",
          "kind": "code",
          "what": "Begin a loop whose condition is always true.",
          "why": "Selection retries until a candidate passes the registry check; a return inside the loop ends the method.",
          "example": "There is no iteration limit or exhaustion policy.",
          "caution": "",
          "syntax": [
            "while",
            "()",
            "{}"
          ]
        },
        {
          "line": 69,
          "raw": "            port = UploadUtils.generatePort();   // call this method , until we get the free port",
          "code": "port = UploadUtils.generatePort();",
          "kind": "code",
          "what": "Generate and assign a random candidate port.",
          "why": "Repeated candidates let the method try another registry slot when one is occupied.",
          "example": "This calls the helper explained in UploadUtils.java.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 70,
          "raw": "            if (!availableFiles.containsKey(port)) {",
          "code": "if (!availableFiles.containsKey(port)) {",
          "kind": "code",
          "what": "Check that the candidate key is absent from availableFiles.",
          "why": "The author attempts to avoid overwriting an already registered share.",
          "example": "! reverses containsKey's boolean.",
          "caution": "This does not check the OS socket table, and another thread can insert between check and put.",
          "syntax": [
            "if",
            "()",
            "{}",
            ".",
            "!"
          ]
        },
        {
          "line": 71,
          "raw": "                availableFiles.put(port, new FileInfo(filePath, uploaderHost));",
          "code": "availableFiles.put(port, new FileInfo(filePath, uploaderHost));",
          "kind": "code",
          "what": "Insert a new FileInfo under the selected port.",
          "why": "Later lookup and file-server creation need the path associated with this candidate.",
          "example": "put(53817, new FileInfo(path, host)) stores a key/value association.",
          "caution": "put replaces an existing value; a concurrent check-then-put race can overwrite another upload.",
          "syntax": [
            "new",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 72,
          "raw": "                String token = generateAccessToken();",
          "code": "String token = generateAccessToken();",
          "kind": "code",
          "what": "Call generateAccessToken and store the returned String in a local variable.",
          "why": "The next map insertion needs the access code assigned to this offer.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 73,
          "raw": "                accessTokens.put(port, token);",
          "code": "accessTokens.put(port, token);",
          "kind": "code",
          "what": "Insert the PIN under the same port in accessTokens.",
          "why": "The upload response can retrieve it and downloads can reverse-search it.",
          "example": "The file metadata insertion and this insertion are separate operations.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 74,
          "raw": "                return port;",
          "code": "return port;",
          "kind": "code",
          "what": "Return the selected port and exit the method/loop.",
          "why": "UploadHandler needs the number for getToken and listener startup.",
          "example": "This does not bind the port; startFileServer performs that later.",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 75,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 70: if (!availableFiles.containsKey(port)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 70's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 76,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 68: while (true) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 68's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 77,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 66: public int offerFile(String filePath, String uploaderHost) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 66's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 78,
          "raw": "    // isPortAvailable: Checks if a file exists on that port.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Declare a public boolean helper named isPortOccupied.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "This method checks the registry key, not disk existence or a listening socket.",
          "syntax": []
        },
        {
          "line": 79,
          "raw": "    public boolean isPortOccupied(int port) {",
          "code": "public boolean isPortOccupied(int port) {",
          "kind": "code",
          "what": "Declare a public boolean helper named isPortOccupied.",
          "why": "Tests/callers can ask whether a port key is already present in this registry.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "int",
            "boolean",
            "()",
            "{}"
          ]
        },
        {
          "line": 80,
          "raw": "        return availableFiles.containsKey(port);",
          "code": "return availableFiles.containsKey(port);",
          "kind": "code",
          "what": "Return whether availableFiles contains the port key.",
          "why": "This answers registry occupancy.",
          "example": "A true result does not prove a socket is listening or that the disk file still exists.",
          "caution": "",
          "syntax": [
            "return",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 81,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 79: public boolean isPortOccupied(int port) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 79's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 82,
          "raw": "    // validateToken: Ensures the provided token matches the one assigned to that port.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 83: Declare a boolean token-validation method taking a port and token.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 83,
          "raw": "    public boolean validateToken(int port, String token) {",
          "code": "public boolean validateToken(int port, String token) {",
          "kind": "code",
          "what": "Declare a boolean token-validation method taking a port and token.",
          "why": "It provides exact token checking for an already-known port.",
          "example": "The current HTTP DownloadHandler uses getPortByToken instead; this helper is exercised in unit tests.",
          "caution": "",
          "syntax": [
            "public",
            "int",
            "boolean",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 84,
          "raw": "        if (token == null || !accessTokens.containsKey(port)) {",
          "code": "if (token == null || !accessTokens.containsKey(port)) {",
          "kind": "code",
          "what": "Reject when token is null or the port has no token entry.",
          "why": "The check avoids normal null/missing-entry comparisons; || short-circuits after a true left operand.",
          "example": "If token is null, containsKey need not run.",
          "caution": "An entry can still disappear after this check under concurrent cleanup.",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            ".",
            "== / !=",
            "!",
            "&& / ||"
          ]
        },
        {
          "line": 85,
          "raw": "            return false;",
          "code": "return false;",
          "kind": "code",
          "what": "Return false for missing token/entry.",
          "why": "The caller receives a clear invalid result.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 86,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 84: if (token == null || !accessTokens.containsKey(port)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 84's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 87,
          "raw": "        return accessTokens.get(port).equals(token);",
          "code": "return accessTokens.get(port).equals(token);",
          "kind": "code",
          "what": "Get the stored String token and compare its contents with the supplied token.",
          "why": "String.equals compares text; == would compare reference identity.",
          "example": "Stored \"482915\" equals another String containing \"482915\".",
          "caution": "If cleanup removes the entry between the earlier check and get, get can return null and this line can throw.",
          "syntax": [
            "return",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 88,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 83: public boolean validateToken(int port, String token) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 83's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 89,
          "raw": "    //getToken: Fetches the token for a given port.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 90: Declare getToken(port), returning a String.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 90,
          "raw": "    public String getToken(int port) {",
          "code": "public String getToken(int port) {",
          "kind": "code",
          "what": "Declare getToken(port), returning a String.",
          "why": "UploadHandler needs the token after offerFile chooses a port.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "int",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 91,
          "raw": "        return accessTokens.get(port);",
          "code": "return accessTokens.get(port);",
          "kind": "code",
          "what": "Return the token map value for the port, or null if absent.",
          "why": "This exposes the generated code without exposing the map itself.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 92,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 90: public String getToken(int port) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 90's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 93,
          "raw": "    //getPortByToken: Reverse lookup (find port using token).",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Declare reverse lookup taking a String token and returning nullable Integer.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 94,
          "raw": "    public Integer getPortByToken(String token) {",
          "code": "public Integer getPortByToken(String token) {",
          "kind": "code",
          "what": "Declare reverse lookup taking a String token and returning nullable Integer.",
          "why": "The downloader knows the PIN, not the actual listener port. Integer can express no match with null; primitive int cannot.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "String",
            "Integer",
            "()",
            "{}"
          ]
        },
        {
          "line": 95,
          "raw": "        for (Map.Entry<Integer , String> entry : accessTokens.entrySet()) {",
          "code": "for (Map.Entry<Integer , String> entry : accessTokens.entrySet()) {",
          "kind": "code",
          "what": "Iterate over every port/token key-value pair in the concurrent map.",
          "why": "The map is indexed by port, so lookup by token requires examining values.",
          "example": "Map.Entry<Integer,String> is one pair; entrySet() gives the entries; : introduces an enhanced for loop.",
          "caution": "Lookup is O(number of pending shares); iteration is weakly consistent under concurrent changes.",
          "syntax": [
            "String",
            "Integer",
            "for",
            "()",
            "{}",
            ".",
            "<>"
          ]
        },
        {
          "line": 96,
          "raw": "            if (entry.getValue().equals(token)) {",
          "code": "if (entry.getValue().equals(token)) {",
          "kind": "code",
          "what": "Compare this entry's token value with the requested token.",
          "why": "Only the matching code should select a port.",
          "example": "String.equals(null) is false for a nonnull stored value.",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 97,
          "raw": "                return entry.getKey();",
          "code": "return entry.getKey();",
          "kind": "code",
          "what": "Return the matching entry's Integer key.",
          "why": "DownloadHandler uses this key as the per-file socket port.",
          "example": "If duplicate tokens exist, the first encountered match wins; order is not a user-facing guarantee.",
          "caution": "",
          "syntax": [
            "return",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 98,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 96: if (entry.getValue().equals(token)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 96's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 99,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 95: for (Map.Entry<Integer , String> entry : accessTokens.entrySet()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 95's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 100,
          "raw": "        return null;",
          "code": "return null;",
          "kind": "code",
          "what": "Return null if iteration found no matching token.",
          "why": "DownloadHandler detects null and replies with 403.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "return",
            ";"
          ]
        },
        {
          "line": 101,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 94: public Integer getPortByToken(String token) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 94's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 102,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 103,
          "raw": "    // Get file host (needed in DownloadHandler)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 105: Declare a public getter for recorded uploader host.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Recorded uploader host is not needed by the current DownloadHandler, which connects to localhost.",
          "syntax": []
        },
        {
          "line": 104,
          "raw": "    // getHostByPort: Gets uploader host info.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 105: Declare a public getter for recorded uploader host.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Recorded uploader host is not needed by the current DownloadHandler, which connects to localhost.",
          "syntax": []
        },
        {
          "line": 105,
          "raw": "    public String getHostByPort(int port) {",
          "code": "public String getHostByPort(int port) {",
          "kind": "code",
          "what": "Declare a public getter for recorded uploader host.",
          "why": "This exposes one metadata field without exposing FileInfo itself.",
          "example": "The merged DownloadHandler no longer calls it.",
          "caution": "",
          "syntax": [
            "public",
            "int",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 106,
          "raw": "        FileInfo info = availableFiles.get(port);",
          "code": "FileInfo info = availableFiles.get(port);",
          "kind": "code",
          "what": "Look up the FileInfo for the given port.",
          "why": "Access to host requires first finding the metadata record.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 107,
          "raw": "        return (info != null) ? info.host : null;",
          "code": "return (info != null) ? info.host : null;",
          "kind": "code",
          "what": "Use a conditional expression: return info.host when info exists, otherwise null.",
          "why": "The null guard prevents dereferencing an absent record.",
          "example": "condition ? valueIfTrue : valueIfFalse is the ternary operator.",
          "caution": "",
          "syntax": [
            "null",
            "return",
            "()",
            ".",
            ";",
            "== / !=",
            "? :"
          ]
        },
        {
          "line": 108,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 105: public String getHostByPort(int port) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 105's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 109,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 110,
          "raw": "    //getFilePath: Returns the actual file path stored for that port.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 111: Declare the path getter for a registered port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 111,
          "raw": "    public String getFilePath(int port) {",
          "code": "public String getFilePath(int port) {",
          "kind": "code",
          "what": "Declare the path getter for a registered port.",
          "why": "Tests or other service code can inspect the associated disk path.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "int",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 112,
          "raw": "        FileInfo info = availableFiles.get(port);",
          "code": "FileInfo info = availableFiles.get(port);",
          "kind": "code",
          "what": "Look up the metadata record by port.",
          "why": "The path belongs to that FileInfo.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 113,
          "raw": "        return (info != null) ? info.filePath : null;",
          "code": "return (info != null) ? info.filePath : null;",
          "kind": "code",
          "what": "Return its filePath if the record exists; otherwise return null.",
          "why": "Missing state is signaled without calling a method/field on null.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "return",
            "()",
            ".",
            ";",
            "== / !=",
            "? :"
          ]
        },
        {
          "line": 114,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 111: public String getFilePath(int port) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 111's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 115,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 116,
          "raw": "    /* Once a file is downloaded: It deletes the file (if needed). Removes its entry from both availableFiles and accessTokens.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 118: Declare the cleanup method for one port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 117,
          "raw": "       This prevents old ports/tokens creating problem for us later , when app grows — good for security and memory.   */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 118: Declare the cleanup method for one port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 118,
          "raw": "    public void cleanupAfterDownload(int port) {",
          "code": "public void cleanupAfterDownload(int port) {",
          "kind": "code",
          "what": "Declare the cleanup method for one port.",
          "why": "The HTTP download happy path calls this after finishing its response copy.",
          "example": "void means it reports no structured success/failure to the caller.",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "int",
            "()",
            "{}"
          ]
        },
        {
          "line": 119,
          "raw": "        FileInfo info = availableFiles.get(port);",
          "code": "FileInfo info = availableFiles.get(port);",
          "kind": "code",
          "what": "Fetch the record to learn which original disk file must be removed.",
          "why": "The map holds the location used during upload.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 120,
          "raw": "        if (info != null) {",
          "code": "if (info != null) {",
          "kind": "code",
          "what": "Only perform cleanup when a FileInfo currently exists.",
          "why": "Without metadata the method does not know the original file path.",
          "example": "If only a stray token entry existed, this branch would not remove it.",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 121,
          "raw": "            File file = new File(info.filePath);",
          "code": "File file = new File(info.filePath);",
          "kind": "code",
          "what": "Create a File path object from the stored path.",
          "why": "The following exists/delete/name methods act on this file.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 122,
          "raw": "            if (file.exists()) {",
          "code": "if (file.exists()) {",
          "kind": "code",
          "what": "Check whether the original file currently exists.",
          "why": "Deletion/logging is attempted only for an existing path.",
          "example": "This check can race another delete; it is not a lock.",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 123,
          "raw": "                if (file.delete()) {",
          "code": "if (file.delete()) {",
          "kind": "code",
          "what": "Call delete() and branch according to its boolean result.",
          "why": "Removal can fail, and the method logs the outcome rather than assuming success.",
          "example": "The if condition itself performs the deletion attempt.",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 124,
          "raw": "                    System.out.println(\"File deleted after download: \" + file.getName());",
          "code": "System.out.println(\"File deleted after download: \" + file.getName());",
          "kind": "code",
          "what": "Log successful original-file deletion.",
          "why": "The basename identifies which managed upload was removed.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 125,
          "raw": "                } else {",
          "code": "} else {",
          "kind": "code",
          "what": "End the deletion-success branch and begin the failure branch.",
          "why": "The following log is chosen when File.delete returns false.",
          "example": "",
          "caution": "",
          "syntax": [
            "else",
            "{}"
          ]
        },
        {
          "line": 126,
          "raw": "                    System.err.println(\"Failed to delete file: \" + file.getName());",
          "code": "System.err.println(\"Failed to delete file: \" + file.getName());",
          "kind": "code",
          "what": "Log failed deletion to standard error.",
          "why": "Disk permission/open-handle problems should be visible.",
          "example": "No retry is scheduled in this code.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 127,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 125: } else {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 125's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 128,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 122: if (file.exists()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 122's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 129,
          "raw": "            availableFiles.remove(port);",
          "code": "availableFiles.remove(port);",
          "kind": "code",
          "what": "Remove the port's metadata entry.",
          "why": "Future lookups should not find the consumed share.",
          "example": "This runs even after a failed delete, leaving a possible orphan file.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 130,
          "raw": "            accessTokens.remove(port);",
          "code": "accessTokens.remove(port);",
          "kind": "code",
          "what": "Remove the port's token entry.",
          "why": "Sequential requests using the old PIN should fail reverse lookup.",
          "example": "Removal of the two entries is not one atomic operation.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 131,
          "raw": "            System.out.println(\"Cleaned up port \" + port + \" and associated token with that port\");",
          "code": "System.out.println(\"Cleaned up port \" + port + \" and associated token with that port\");",
          "kind": "code",
          "what": "Log registry/PIN cleanup.",
          "why": "It marks that the method reached the map-removal path.",
          "example": "It does not prove disk deletion succeeded.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 132,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 120: if (info != null) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 120's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 133,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 118: public void cleanupAfterDownload(int port) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 118's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 134,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 135,
          "raw": "    // This is the temporary mini-server that actually sends the file.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 136: Declare the method that starts one file's temporary TCP listener.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 136,
          "raw": "    public void startFileServer(int port) {",
          "code": "public void startFileServer(int port) {",
          "kind": "code",
          "what": "Declare the method that starts one file's temporary TCP listener.",
          "why": "UploadHandler launches this method on a separate thread after registration.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "int",
            "()",
            "{}"
          ]
        },
        {
          "line": 137,
          "raw": "        FileInfo info = availableFiles.get(port);",
          "code": "FileInfo info = availableFiles.get(port);",
          "kind": "code",
          "what": "Fetch FileInfo for the selected port.",
          "why": "Listener startup needs the uploaded file's path.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 138,
          "raw": "        if (info == null) {",
          "code": "if (info == null) {",
          "kind": "code",
          "what": "Check whether metadata is absent.",
          "why": "Starting a file listener makes no sense without a file association.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 139,
          "raw": "            System.out.println(\"No file is available with this port: \" + port);",
          "code": "System.out.println(\"No file is available with this port: \" + port);",
          "kind": "code",
          "what": "Log that the requested port has no registered file.",
          "why": "It helps distinguish missing-state startup from a bind error.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 140,
          "raw": "            return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from startFileServer without opening a socket.",
          "why": "The absent-metadata branch must stop before dereferencing info.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 141,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 138: if (info == null) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 138's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 142,
          "raw": "        String filePath = info.filePath;",
          "code": "String filePath = info.filePath;",
          "kind": "code",
          "what": "Copy the path field into a local variable.",
          "why": "The sender task later needs a stable path reference.",
          "example": "String content is immutable, but this does not lock the file or protect it from deletion.",
          "caution": "",
          "syntax": [
            "String",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 143,
          "raw": "        // ServerSocket is a Java class that listens for incoming TCP connections on a port.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 144: Create and bind a ServerSocket(port) inside try-with-resources.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 144,
          "raw": "        try (ServerSocket serverSocket = new ServerSocket(port)) { /* When you create new ServerSocket(port)",
          "code": "try (ServerSocket serverSocket = new ServerSocket(port)) {",
          "kind": "code",
          "what": "Create and bind a ServerSocket(port) inside try-with-resources.",
          "why": "This is the actual OS port reservation and listener resource; it closes when the try block exits.",
          "example": "Unlike a map insertion, construction can fail if the port is occupied.",
          "caution": "The bind is wildcard by default. A reachable direct socket client gets no PIN challenge in the sender protocol.",
          "syntax": [
            "new",
            "try",
            "()",
            "{}",
            "="
          ]
        },
        {
          "line": 145,
          "raw": "            ,the OS binds that process to the network port. If the port is already in use, this throws IOException. */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 146: Set the ServerSocket accept timeout to 50000 milliseconds.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 146,
          "raw": "            serverSocket.setSoTimeout(50000);  /* Sets a timeout (in milliseconds) for blocking operations on the ServerSocket.",
          "code": "serverSocket.setSoTimeout(50000);",
          "kind": "code",
          "what": "Set the ServerSocket accept timeout to 50000 milliseconds.",
          "why": "A waiting listener should eventually stop if nobody connects.",
          "example": "50000 ms = 50 s.",
          "caution": "This timeout controls accept, not automatic original-file/PIN expiry or total file-transfer time.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 147,
          "raw": "            Specifically, accept() will wait up to 50,000 ms (50 seconds);",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 150: Log the stored filename and chosen listener port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 148,
          "raw": "            if no client connects in that time, accept() throws a SocketTimeoutException.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 150: Log the stored filename and chosen listener port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 149,
          "raw": "            This prevents the server from waiting forever and helps the method eventually return if nobody connects.*/",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 150: Log the stored filename and chosen listener port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 150,
          "raw": "            System.out.println(\"Serving File \" + new File(filePath).getName() + \" on port \" + port);",
          "code": "System.out.println(\"Serving File \" + new File(filePath).getName() + \" on port \" + port);",
          "kind": "code",
          "what": "Log the stored filename and chosen listener port.",
          "why": "It indicates that bind succeeded and the thread reached the waiting path.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 151,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 152,
          "raw": "            Socket clientSocket = serverSocket.accept(); /*  accept() blocks the current thread until a client connects",
          "code": "Socket clientSocket = serverSocket.accept();",
          "kind": "code",
          "what": "Block in accept() until one client connection arrives or the timeout expires; store the accepted Socket.",
          "why": "The listener needs a connected stream endpoint before it can send bytes.",
          "example": "ServerSocket is the listening resource; clientSocket is the accepted connection.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 153,
          "raw": "             (or the timeout triggers).When a client connects, accept() returns a Socket object (clientSocket) representing",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 156: Set a 50-second read timeout on the accepted Socket.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 154,
          "raw": "              that specific connection. The returned Socket has input/output streams for sending/receiving data across the",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 156: Set a 50-second read timeout on the accepted Socket.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 155,
          "raw": "              TCP connection. */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 156: Set a 50-second read timeout on the accepted Socket.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 156,
          "raw": "            clientSocket.setSoTimeout(50000); /* Sets a read timeout for the client socket’s InputStream/OutputStream operations.",
          "code": "clientSocket.setSoTimeout(50000);",
          "kind": "code",
          "what": "Set a 50-second read timeout on the accepted Socket.",
          "why": "This would limit blocking reads from its input stream.",
          "example": "The sender later changes the same socket read timeout to 30 seconds.",
          "caution": "The comment implying InputStream/OutputStream or whole-transfer timeout is incorrect: SO_TIMEOUT does not bound writes. Socket SO_TIMEOUT limits reads, not writes or total transfer duration. The sender later replaces it with 30000 ms.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 157,
          "raw": "             basically when connection is established, we only waits for 50 sec for file transfer , if it takes more than",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 159: Log the accepted client's InetAddress.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Socket SO_TIMEOUT limits reads, not writes or total transfer duration. The sender later replaces it with 30000 ms.",
          "syntax": []
        },
        {
          "line": 158,
          "raw": "             50 sec , we have thrown the exception. (This helps avoid hung transfers.) */",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 159: Log the accepted client's InetAddress.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "Socket SO_TIMEOUT limits reads, not writes or total transfer duration. The sender later replaces it with 30000 ms.",
          "syntax": []
        },
        {
          "line": 159,
          "raw": "            System.out.println(\"Client connection: \" + clientSocket.getInetAddress());",
          "code": "System.out.println(\"Client connection: \" + clientSocket.getInetAddress());",
          "kind": "code",
          "what": "Log the accepted client's InetAddress.",
          "why": "It shows the network endpoint that connected to this listener.",
          "example": "Through the intended DownloadHandler path, it is normally the server's loopback client, not the recipient browser directly.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 160,
          "raw": "            new Thread(new FileSenderHandler(clientSocket, filePath)).start();",
          "code": "new Thread(new FileSenderHandler(clientSocket, filePath)).start();",
          "kind": "code",
          "what": "Create a FileSenderHandler task with accepted socket/path, wrap it in a Thread, and start it.",
          "why": "The sender performs the disk-to-socket copy separately. Passing the accepted Socket lets it keep using the connection after the listening socket closes.",
          "example": "new Runnable task is not execution; Thread.start schedules run on a new thread.",
          "caution": "These per-file threads are outside the controller's ten-worker executor.",
          "syntax": [
            "new",
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 161,
          "raw": "        } catch (IOException e) {",
          "code": "} catch (IOException e) {",
          "kind": "code",
          "what": "Close the listener try block and catch IOException from binding, accepting or related operations.",
          "why": "A timeout is also an IOException subtype and reaches this catch.",
          "example": "Try-with-resources closes the ServerSocket before catch handles the failure.",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 162,
          "raw": "            System.err.println(\"Error handling file server on port: \" + port);",
          "code": "System.err.println(\"Error handling file server on port: \" + port);",
          "kind": "code",
          "what": "Log the file-server port on error.",
          "why": "There is some failure visibility, but little detail.",
          "example": "The exception e is available but its message is not printed.",
          "caution": "This catch does not remove maps/delete the original, leaving stale shares after timeout/bind failure.",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 163,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 161: } catch (IOException e) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 161's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 164,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 136: public void startFileServer(int port) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 136's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 165,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 166,
          "raw": "    private static class FileSenderHandler implements Runnable {",
          "code": "private static class FileSenderHandler implements Runnable {",
          "kind": "code",
          "what": "Declare a private static nested task class implementing Runnable.",
          "why": "Thread accepts a Runnable whose run method describes the sender's work; the class stores task-specific dependencies.",
          "example": "static avoids needing a hidden FileSharer instance reference.",
          "caution": "",
          "syntax": [
            "private",
            "static",
            "class",
            "implements",
            "{}"
          ]
        },
        {
          "line": 167,
          "raw": "        private final Socket clientSocket;",
          "code": "private final Socket clientSocket;",
          "kind": "code",
          "what": "Declare a final Socket reference for the accepted connection.",
          "why": "The sender must write to and eventually close that exact connection.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            ";"
          ]
        },
        {
          "line": 168,
          "raw": "        private final String filePath;",
          "code": "private final String filePath;",
          "kind": "code",
          "what": "Declare a final String for the original stored-file path.",
          "why": "The sender needs a disk location to open when its thread runs.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            "String",
            ";"
          ]
        },
        {
          "line": 169,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 170,
          "raw": "        public FileSenderHandler(Socket clientSocket, String filePath) {",
          "code": "public FileSenderHandler(Socket clientSocket, String filePath) {",
          "kind": "code",
          "what": "Declare a constructor receiving socket and path.",
          "why": "startFileServer packages the connection/file into a task before launching it.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "String",
            "()",
            "{}"
          ]
        },
        {
          "line": 171,
          "raw": "            this.clientSocket = clientSocket;",
          "code": "this.clientSocket = clientSocket;",
          "kind": "code",
          "what": "Store the Socket argument in the sender field.",
          "why": "run and finally both require it.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 172,
          "raw": "            this.filePath = filePath;",
          "code": "this.filePath = filePath;",
          "kind": "code",
          "what": "Store the disk path argument.",
          "why": "run opens that file without needing another map lookup.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 173,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 170: public FileSenderHandler(Socket clientSocket, String filePath) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 170's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 174,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 175,
          "raw": "        @Override",
          "code": "@Override",
          "kind": "code",
          "what": "Mark run as an implementation of Runnable.run.",
          "why": "The compiler verifies the method really matches the interface contract.",
          "example": "The annotation does not create a thread by itself.",
          "caution": "",
          "syntax": [
            "Override"
          ]
        },
        {
          "line": 176,
          "raw": "        public void run() {",
          "code": "public void run() {",
          "kind": "code",
          "what": "Declare the public, no-result run method.",
          "why": "Thread.start executes this task body on the new sender thread.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "()",
            "{}"
          ]
        },
        {
          "line": 177,
          "raw": "            try {",
          "code": "try {",
          "kind": "code",
          "what": "Begin the try/catch/finally around sending.",
          "why": "I/O failures are logged and socket closure is attempted on either path.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "{}"
          ]
        },
        {
          "line": 178,
          "raw": "                clientSocket.setSoTimeout(30000);",
          "code": "clientSocket.setSoTimeout(30000);",
          "kind": "code",
          "what": "Set the socket's read timeout to 30000 ms, replacing its earlier 50000 ms setting.",
          "why": "The author intends stall protection, but this particular property applies only to reads.",
          "example": "This run method writes payload and does not read from the socket.",
          "caution": "It therefore does not establish a 30-second file-send deadline.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 179,
          "raw": "                try (FileInputStream fis = new FileInputStream(filePath)) {",
          "code": "try (FileInputStream fis = new FileInputStream(filePath)) {",
          "kind": "code",
          "what": "Open a FileInputStream for filePath in try-with-resources.",
          "why": "The task needs to read the uploaded bytes; automatic closure releases its file handle even on error.",
          "example": "Opening a nonexistent/deleted path throws IOException.",
          "caution": "",
          "syntax": [
            "new",
            "try",
            "()",
            "{}",
            "="
          ]
        },
        {
          "line": 180,
          "raw": "                    OutputStream oos = clientSocket.getOutputStream();",
          "code": "OutputStream oos = clientSocket.getOutputStream();",
          "kind": "code",
          "what": "Get the connected socket's output stream.",
          "why": "The next writes send bytes to DownloadHandler's socket input stream.",
          "example": "The variable name oos is just a name; this is OutputStream, not ObjectOutputStream serialization.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 181,
          "raw": "                    String fileName = new File(filePath).getName();",
          "code": "String fileName = new File(filePath).getName();",
          "kind": "code",
          "what": "Get the stored path's basename.",
          "why": "The wire header needs a filename rather than exposing the full server disk path.",
          "example": "The stored UUID prefix stays in this name.",
          "caution": "",
          "syntax": [
            "new",
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 182,
          "raw": "                    String header = \"Filename: \" + fileName + \"\\n\";",
          "code": "String header = \"Filename: \" + fileName + \"\\n\";",
          "kind": "code",
          "what": "Construct Filename: <stored-name> followed by a newline.",
          "why": "A newline-terminated header frames metadata before raw payload in the simple TCP protocol.",
          "example": "Filename: UUID_notes.txt\\n.",
          "caution": "There is no expected byte count/checksum/PIN in this header.",
          "syntax": [
            "String",
            ";",
            "=",
            "+",
            "escapes"
          ]
        },
        {
          "line": 183,
          "raw": "                    oos.write(header.getBytes());",
          "code": "oos.write(header.getBytes());",
          "kind": "code",
          "what": "Encode the header with the default charset and write those bytes to the socket.",
          "why": "The receiver must encounter the metadata line before any file bytes.",
          "example": "getBytes converts text to bytes; write sends those bytes in order.",
          "caution": "Network peers should agree on an explicit header encoding.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 184,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 185,
          "raw": "                    byte[] buffer = new byte[4096];",
          "code": "byte[] buffer = new byte[4096];",
          "kind": "code",
          "what": "Allocate a reusable 4096-byte chunk buffer.",
          "why": "Chunked disk reads/socket writes avoid loading a second full file into this sender's heap.",
          "example": "This does not make the earlier upload path streaming.",
          "caution": "",
          "syntax": [
            "new",
            "byte",
            "[]",
            ";",
            "="
          ]
        },
        {
          "line": 186,
          "raw": "                    int byteRead;",
          "code": "int byteRead;",
          "kind": "code",
          "what": "Declare the count of bytes returned by each file read.",
          "why": "The final read often fills only part of the buffer, so writing the count is necessary.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            ";"
          ]
        },
        {
          "line": 187,
          "raw": "                    while ((byteRead = fis.read(buffer)) != -1) {",
          "code": "while ((byteRead = fis.read(buffer)) != -1) {",
          "kind": "code",
          "what": "Read a chunk into buffer, assign the count and continue while it is not -1.",
          "why": "The loop repeats until file EOF. Assignment occurs before the comparison.",
          "example": "A 5000-byte file can yield counts 4096 then 904 then -1.",
          "caution": "",
          "syntax": [
            "while",
            "()",
            "{}",
            ".",
            "=",
            "== / !="
          ]
        },
        {
          "line": 188,
          "raw": "                        oos.write(buffer, 0, byteRead);",
          "code": "oos.write(buffer, 0, byteRead);",
          "kind": "code",
          "what": "Write exactly byteRead bytes starting at buffer offset 0 to the socket.",
          "why": "Writing the full buffer on a short final read would add stale/padding bytes and corrupt the file.",
          "example": "For the last 904-byte chunk, only positions 0..903 are written.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 189,
          "raw": "                    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 187: while ((byteRead = fis.read(buffer)) != -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 187's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 190,
          "raw": "                    System.out.println(\"File \" + fileName + \" sent to \" + clientSocket.getInetAddress());",
          "code": "System.out.println(\"File \" + fileName + \" sent to \" + clientSocket.getInetAddress());",
          "kind": "code",
          "what": "Log that the disk-to-socket loop finished.",
          "why": "It marks server-side sending progress.",
          "example": "It does not prove that DownloadHandler received a complete expected file or that a human saved the HTTP attachment.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 191,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 179: try (FileInputStream fis = new FileInputStream(filePath)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 179's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 192,
          "raw": "            } catch (IOException ex) {",
          "code": "} catch (IOException ex) {",
          "kind": "code",
          "what": "Catch IOException from the send block.",
          "why": "Disk/socket failures should not skip the final socket closure.",
          "example": "",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 193,
          "raw": "                System.err.println(\"Error sending file to client: \" + ex.getMessage());",
          "code": "System.err.println(\"Error sending file to client: \" + ex.getMessage());",
          "kind": "code",
          "what": "Log the send failure description.",
          "why": "It helps inspect a failed transfer.",
          "example": "Closing after partial output looks like EOF to the receiver; no protocol integrity marker detects truncation.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 194,
          "raw": "            } finally {",
          "code": "} finally {",
          "kind": "code",
          "what": "Begin finally after success or caught failure.",
          "why": "The accepted Socket must not be left open when task work finishes.",
          "example": "",
          "caution": "",
          "syntax": [
            "finally",
            "{}"
          ]
        },
        {
          "line": 195,
          "raw": "                try {",
          "code": "try {",
          "kind": "code",
          "what": "Begin a nested try around socket.close.",
          "why": "Even cleanup can throw IOException and needs its own handling.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "{}"
          ]
        },
        {
          "line": 196,
          "raw": "                    clientSocket.close();",
          "code": "clientSocket.close();",
          "kind": "code",
          "what": "Close the accepted connection.",
          "why": "This releases the socket and causes the receiving side to encounter EOF after buffered bytes are consumed.",
          "example": "It does not delete the original file; DownloadHandler calls registry cleanup separately.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 197,
          "raw": "                } catch (IOException e) {",
          "code": "} catch (IOException e) {",
          "kind": "code",
          "what": "Catch an IOException raised while closing the socket.",
          "why": "A cleanup failure must not bypass the following diagnostic.",
          "example": "",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 198,
          "raw": "                    System.err.println(\"Error closing socket: \" + e.getMessage());",
          "code": "System.err.println(\"Error closing socket: \" + e.getMessage());",
          "kind": "code",
          "what": "Log the close failure.",
          "why": "This makes resource-release problems visible instead of silently ignoring them.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 199,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 197: } catch (IOException e) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 197's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 200,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 194: } finally {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 194's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 201,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 176: public void run() {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 176's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 202,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 166: private static class FileSenderHandler implements Runnable {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 166's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 203,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 21: public class FileSharer {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 21's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 204,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 205,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        }
      ]
    },
    {
      "name": "DownloadHandler.java",
      "path": "handler/DownloadHandler.java",
      "purpose": "Turn a PIN-authorized HTTP request into a local socket read, then an HTTP attachment and successful-path cleanup.",
      "caller": "HttpServer invokes handle for the /download context, including /download/0.",
      "analogy": "The collection clerk: checks the code, collects bytes locally and hands them to the recipient.",
      "checks": [
        [
          "Why connect to localhost?",
          "The FileSharer listener runs on the Java server host; the uploader browser does not run that listener."
        ],
        [
          "Why save the TCP bytes before sending HTTP?",
          "The staging file gives a known response length, at the cost of extra disk I/O and latency."
        ],
        [
          "Does finally guarantee that tempFile.delete succeeded?",
          "No. It guarantees execution reaches cleanup under normal Java unwinding; delete returns a boolean that this code ignores."
        ]
      ],
      "id": "downloadhandler",
      "hash": "490371bc4dbf0ffca7dc40d0316b8887bc84645331f8e6c7b413e1af9b43ded6",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P.handler;",
          "code": "package P2P.handler;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P.handler package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.handler.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "import java.io.ByteArrayOutputStream;",
          "code": "import java.io.ByteArrayOutputStream;",
          "kind": "import",
          "what": "Make the type java.io.ByteArrayOutputStream available by its short name ByteArrayOutputStream. An expandable in-memory byte accumulator.",
          "why": "Upload uses it for the whole envelope; download uses it for the filename header. Memory grows with accumulated bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.ByteArrayOutputStream where ByteArrayOutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 4,
          "raw": "import java.io.File;",
          "code": "import java.io.File;",
          "kind": "import",
          "what": "Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.",
          "why": "Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.File where File is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 5,
          "raw": "import java.io.FileInputStream;",
          "code": "import java.io.FileInputStream;",
          "kind": "import",
          "what": "Make the type java.io.FileInputStream available by its short name FileInputStream. An InputStream that reads from a disk file.",
          "why": "The TCP sender and staged HTTP copy need the original file bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.FileInputStream where FileInputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 6,
          "raw": "import java.io.FileOutputStream;",
          "code": "import java.io.FileOutputStream;",
          "kind": "import",
          "what": "Make the type java.io.FileOutputStream available by its short name FileOutputStream. An OutputStream that writes to a disk file.",
          "why": "Uploads and download staging need real disk persistence. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.FileOutputStream where FileOutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 7,
          "raw": "import java.io.IOException;",
          "code": "import java.io.IOException;",
          "kind": "import",
          "what": "Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.",
          "why": "Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.IOException where IOException is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 8,
          "raw": "import java.io.InputStream;",
          "code": "import java.io.InputStream;",
          "kind": "import",
          "what": "Make the type java.io.InputStream available by its short name InputStream. A base class for reading bytes from a source.",
          "why": "The download handler reads from the connected socket and detects EOF with -1. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.InputStream where InputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 9,
          "raw": "import java.io.OutputStream;",
          "code": "import java.io.OutputStream;",
          "kind": "import",
          "what": "Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.",
          "why": "HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 10,
          "raw": "import java.net.Socket;",
          "code": "import java.net.Socket;",
          "kind": "import",
          "what": "Make the type java.net.Socket available by its short name Socket. A connected TCP endpoint with input/output streams.",
          "why": "The download handler connects; the file listener accepts a connected Socket. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.net.Socket where Socket is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 11,
          "raw": "import java.nio.file.Files;",
          "code": "import java.nio.file.Files;",
          "kind": "import",
          "what": "Make the type java.nio.file.Files available by its short name Files. A utility class with filesystem operations and file-type detection.",
          "why": "Download uses Files.probeContentType for a response MIME guess. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.nio.file.Files where Files is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 12,
          "raw": "import java.nio.file.Path;",
          "code": "import java.nio.file.Path;",
          "kind": "import",
          "what": "Make the type java.nio.file.Path available by its short name Path. A typed filesystem path representation.",
          "why": "Path.of(fileName) supplies the name to the file-type detector; it does not open the file. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.nio.file.Path where Path is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 13,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 14,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 15,
          "raw": "import P2P.Service.FileSharer;",
          "code": "import P2P.Service.FileSharer;",
          "kind": "import",
          "what": "Make the type P2P.Service.FileSharer available by its short name FileSharer. Your shared pending-file/PIN registry and local TCP service.",
          "why": "Handlers coordinate through one FileSharer object; importing the name does not construct it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name P2P.Service.FileSharer where FileSharer is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 16,
          "raw": "import com.sun.net.httpserver.Headers;",
          "code": "import com.sun.net.httpserver.Headers;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.Headers available by its short name Headers. The HTTP header collection type from the JDK server API.",
          "why": "Handlers read incoming metadata or add/set outgoing metadata. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.Headers where Headers is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 17,
          "raw": "import com.sun.net.httpserver.HttpExchange;",
          "code": "import com.sun.net.httpserver.HttpExchange;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.HttpExchange available by its short name HttpExchange. One HTTP request and its response channel.",
          "why": "handle receives this object to inspect method/URI/headers and access body streams. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.HttpExchange where HttpExchange is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 18,
          "raw": "import com.sun.net.httpserver.HttpHandler;",
          "code": "import com.sun.net.httpserver.HttpHandler;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.HttpHandler available by its short name HttpHandler. The interface with handle(HttpExchange).",
          "why": "implements HttpHandler allows a class to be registered as a server context handler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.HttpHandler where HttpHandler is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 19,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 20,
          "raw": "public class DownloadHandler implements HttpHandler {",
          "code": "public class DownloadHandler implements HttpHandler {",
          "kind": "code",
          "what": "Declare DownloadHandler implementing the HttpHandler contract.",
          "why": "The registered context requires handle(HttpExchange) for incoming download requests.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "class",
            "implements",
            "{}"
          ]
        },
        {
          "line": 21,
          "raw": "    private final FileSharer fileSharer;",
          "code": "private final FileSharer fileSharer;",
          "kind": "code",
          "what": "Declare a private final reference to the shared FileSharer.",
          "why": "Token lookup and original cleanup must use the same state written by uploads.",
          "example": "",
          "caution": "",
          "syntax": [
            "private",
            "final",
            ";"
          ]
        },
        {
          "line": 22,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 23,
          "raw": "    public DownloadHandler(FileSharer fileSharer) {",
          "code": "public DownloadHandler(FileSharer fileSharer) {",
          "kind": "code",
          "what": "Declare the constructor taking the shared service object.",
          "why": "FileController manually supplies the dependency when registering the handler.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "()",
            "{}"
          ]
        },
        {
          "line": 24,
          "raw": "        this.fileSharer = fileSharer;",
          "code": "this.fileSharer = fileSharer;",
          "kind": "code",
          "what": "Store that argument in this handler's field.",
          "why": "Each later request can access it after construction ends.",
          "example": "",
          "caution": "",
          "syntax": [
            "this",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 25,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 23: public DownloadHandler(FileSharer fileSharer) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 23's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 26,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 27,
          "raw": "    @Override",
          "code": "@Override",
          "kind": "code",
          "what": "Mark handle as an interface-method implementation.",
          "why": "The compiler checks the declared contract.",
          "example": "",
          "caution": "",
          "syntax": [
            "Override"
          ]
        },
        {
          "line": 28,
          "raw": "    public void handle(HttpExchange exchange) throws IOException {",
          "code": "public void handle(HttpExchange exchange) throws IOException {",
          "kind": "code",
          "what": "Declare the per-request handler with an exchange and possible IOException.",
          "why": "HTTP request parsing and response/socket I/O happen inside this entry point.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "throws",
            "()",
            "{}"
          ]
        },
        {
          "line": 29,
          "raw": "        Headers headers = exchange.getResponseHeaders();",
          "code": "Headers headers = exchange.getResponseHeaders();",
          "kind": "code",
          "what": "Get the outgoing header map.",
          "why": "CORS and attachment metadata must be set before sendResponseHeaders.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 30,
          "raw": "        headers.add(\"Access-Control-Allow-Origin\", \"*\");",
          "code": "headers.add(\"Access-Control-Allow-Origin\", \"*\");",
          "kind": "code",
          "what": "Allow wildcard origins in browser CORS.",
          "why": "The separate frontend origin needs permission to read responses.",
          "example": "It is not a resource-authorization check.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 31,
          "raw": "        headers.add(\"Access-Control-Allow-Methods\", \"GET,POST,OPTIONS\");",
          "code": "headers.add(\"Access-Control-Allow-Methods\", \"GET,POST,OPTIONS\");",
          "kind": "code",
          "what": "Advertise GET, POST, OPTIONS for cross-origin permission checks.",
          "why": "A browser can inspect advertised methods.",
          "example": "The actual download method check below accepts only GET (plus early OPTIONS).",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 32,
          "raw": "        headers.add(\"Access-Control-Allow-Headers\", \"Content-Type,Authorization\");",
          "code": "headers.add(\"Access-Control-Allow-Headers\", \"Content-Type,Authorization\");",
          "kind": "code",
          "what": "Permit Content-Type and Authorization header names.",
          "why": "Cross-origin request headers may be preflighted.",
          "example": "This service does not authenticate a JWT just because the name is allowed.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 33,
          "raw": "        headers.add(\"Access-Control-Expose-Headers\", \"Content-Disposition\");",
          "code": "headers.add(\"Access-Control-Expose-Headers\", \"Content-Disposition\");",
          "kind": "code",
          "what": "Expose Content-Disposition to browser JavaScript.",
          "why": "Share.jsx reads this response header to choose the browser download filename.",
          "example": "Without exposure, a cross-origin response can exist while JS cannot access this non-safelisted header.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 34,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 35,
          "raw": "        // Handle CORS preflight for this route",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 36: Select the OPTIONS preflight branch.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 36,
          "raw": "        if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "code": "if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "kind": "code",
          "what": "Select the OPTIONS preflight branch.",
          "why": "Permission checks should be answered without looking up a PIN or retrieving a file.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 37,
          "raw": "            exchange.sendResponseHeaders(204, -1);",
          "code": "exchange.sendResponseHeaders(204, -1);",
          "kind": "code",
          "what": "Respond 204 with no body.",
          "why": "Only CORS permission metadata is needed for this branch.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 38,
          "raw": "            return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle after preflight.",
          "why": "It prevents executing the download path on this exchange.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 39,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 36: if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 36's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 40,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 41,
          "raw": "        //checking for method allowance",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 42: Reject when the method is not GET.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 42,
          "raw": "        if (!exchange.getRequestMethod().equalsIgnoreCase(\"GET\")) {",
          "code": "if (!exchange.getRequestMethod().equalsIgnoreCase(\"GET\")) {",
          "kind": "code",
          "what": "Reject when the method is not GET.",
          "why": "Download is a read endpoint; POST or DELETE should not consume the file through this path.",
          "example": "! negates the equalsIgnoreCase result.",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            ".",
            "!"
          ]
        },
        {
          "line": 43,
          "raw": "            String response = \"Method Not Allowed\";",
          "code": "String response = \"Method Not Allowed\";",
          "kind": "code",
          "what": "Store the method-error text.",
          "why": "The following response length and body use one consistent message.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 44,
          "raw": "            exchange.sendResponseHeaders(405, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(405, response.getBytes().length);",
          "kind": "code",
          "what": "Send status 405 with the encoded message's byte length.",
          "why": "The caller receives Method Not Allowed rather than a file.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 45,
          "raw": "            try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Open/own the response OutputStream in a try-with-resources block.",
          "why": "The error body must be written and the stream closed.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 46,
          "raw": "                os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Write the error-message bytes.",
          "why": "Headers do not themselves deliver the text.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 47,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 45: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 45's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 48,
          "raw": "            return;",
          "code": "return;",
          "kind": "code",
          "what": "Return after rejecting the method.",
          "why": "Rejected requests must not proceed to token/socket work.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 49,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 42: if (!exchange.getRequestMethod().equalsIgnoreCase(\"GET\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 42's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 50,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 51,
          "raw": "        // Get token from query parameter",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 52: Read the query portion of the URI into query.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 52,
          "raw": "        String query = exchange.getRequestURI().getQuery();",
          "code": "String query = exchange.getRequestURI().getQuery();",
          "kind": "code",
          "what": "Read the query portion of the URI into query.",
          "why": "The PIN appears after ? in the URL, separately from the /download/0 path.",
          "example": "/download/0?token=482915 -> query is token=482915; missing query -> null.",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 53,
          "raw": "        String token = null;",
          "code": "String token = null;",
          "kind": "code",
          "what": "Initialize token to null.",
          "why": "The handler needs an explicit missing-token value if parsing finds nothing.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "null",
            ";",
            "="
          ]
        },
        {
          "line": 54,
          "raw": "        if (query != null) {",
          "code": "if (query != null) {",
          "kind": "code",
          "what": "Parse query only when a query string exists.",
          "why": "Calling split on null would throw.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 55,
          "raw": "            String[] params = query.split(\"&\");",
          "code": "String[] params = query.split(\"&\");",
          "kind": "code",
          "what": "Split query at each & into a String array of parameter fragments.",
          "why": "A URL may contain several name=value pairs.",
          "example": "x=1&token=482915 -> [\"x=1\", \"token=482915\"].",
          "caution": "This is simple query parsing, not a complete URL/form decoding implementation.",
          "syntax": [
            "String",
            "()",
            "[]",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 56,
          "raw": "            for (String param : params) {",
          "code": "for (String param : params) {",
          "kind": "code",
          "what": "Iterate over every parameter fragment.",
          "why": "The token may not be the first query parameter.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            "for",
            "()",
            "{}"
          ]
        },
        {
          "line": 57,
          "raw": "                if (param.startsWith(\"token=\")) {",
          "code": "if (param.startsWith(\"token=\")) {",
          "kind": "code",
          "what": "Look for a fragment beginning with the literal token=.",
          "why": "It recognizes the expected parameter name without accepting another prefix.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 58,
          "raw": "                    token = param.substring(6);",
          "code": "token = param.substring(6);",
          "kind": "code",
          "what": "Keep the substring after the six characters token=.",
          "why": "The service needs the value rather than the parameter name.",
          "example": "substring(6) on token=482915 gives 482915.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 59,
          "raw": "                    break;",
          "code": "break;",
          "kind": "code",
          "what": "Break from the parameter loop after the first token match.",
          "why": "Later parameters need not be scanned and a second token will not overwrite this one.",
          "example": "",
          "caution": "",
          "syntax": [
            "break",
            ";"
          ]
        },
        {
          "line": 60,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 57: if (param.startsWith(\"token=\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 57's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 61,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 56: for (String param : params) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 56's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 62,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 54: if (query != null) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 54's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 63,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 64,
          "raw": "        try {",
          "code": "try {",
          "kind": "code",
          "what": "Begin try around registry lookup and file/socket response work.",
          "why": "IOException from the nested operations is handled by the catch at line 136.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "{}"
          ]
        },
        {
          "line": 65,
          "raw": "            // Ignore port in path, use only token for lookup",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Reverse-look up the PIN and store a nullable Integer port.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 66,
          "raw": "            Integer port = fileSharer.getPortByToken(token);",
          "code": "Integer port = fileSharer.getPortByToken(token);",
          "kind": "code",
          "what": "Reverse-look up the PIN and store a nullable Integer port.",
          "why": "Current browser requests pass dummy path port 0; actual listener selection comes from server state.",
          "example": "token 482915 -> Integer 53817, or null if no share matches.",
          "caution": "",
          "syntax": [
            "Integer",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 67,
          "raw": "            if (port == null) {",
          "code": "if (port == null) {",
          "kind": "code",
          "what": "Check for no matching port.",
          "why": "Missing/invalid/consumed PIN must be rejected before opening a socket.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 68,
          "raw": "                String response = \"Access denied: Invalid or missing token\";",
          "code": "String response = \"Access denied: Invalid or missing token\";",
          "kind": "code",
          "what": "Create the access-denied text.",
          "why": "The caller gets one controlled failure message for missing/invalid lookup.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 69,
          "raw": "                headers.add(\"Content-Type\", \"text/plain\");",
          "code": "headers.add(\"Content-Type\", \"text/plain\");",
          "kind": "code",
          "what": "Set this response's MIME type to text/plain.",
          "why": "The body is an error message, not a file or JSON.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 70,
          "raw": "                exchange.sendResponseHeaders(403, response.getBytes().length); // 403 Forbidden",
          "code": "exchange.sendResponseHeaders(403, response.getBytes().length);",
          "kind": "code",
          "what": "Send 403 and the message's encoded byte length.",
          "why": "Forbidden signals that this request lacks a usable access PIN.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 71,
          "raw": "                try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Obtain the error-response stream with automatic closure.",
          "why": "The denied response still needs a properly written/closed body.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 72,
          "raw": "                    os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Write the denied message to the HTTP body.",
          "why": "The browser/client can display the reason.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 73,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 71: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 71's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 74,
          "raw": "                return;",
          "code": "return;",
          "kind": "code",
          "what": "Return after denial.",
          "why": "There must be no socket read or file consumption on this branch.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 75,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 67: if (port == null) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 67's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 76,
          "raw": "            // The per-file socket server always runs inside this same JVM (started by",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 77,
          "raw": "            // UploadHandler on this host), so it must be reached via loopback rather than",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 78,
          "raw": "            // the uploader's client IP, which is unreachable from here in a real deployment.",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 79,
          "raw": "            try (Socket socket = new Socket(\"localhost\", port)) {",
          "code": "try (Socket socket = new Socket(\"localhost\", port)) {",
          "kind": "code",
          "what": "Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.",
          "why": "The per-file listener and stored file live on this same server host. Using the uploader IP would target the wrong machine.",
          "example": "Integer port is automatically unboxed to an int for the constructor.",
          "caution": "No explicit connect/read deadline is configured here; listener startup can also race this connection.",
          "syntax": [
            "new",
            "try",
            "()",
            "{}",
            "="
          ]
        },
        {
          "line": 80,
          "raw": "                InputStream socketInput = socket.getInputStream();",
          "code": "InputStream socketInput = socket.getInputStream();",
          "kind": "code",
          "what": "Get the socket's input stream.",
          "why": "FileSenderHandler writes to its socket output; this side must read those ordered bytes.",
          "example": "The browser is not this TCP client; DownloadHandler is.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 81,
          "raw": "                File tempFile = File.createTempFile(\"download-\", \".tmp\");",
          "code": "File tempFile = File.createTempFile(\"download-\", \".tmp\");",
          "kind": "code",
          "what": "Create an actual new uniquely named temporary file with prefix download- and suffix .tmp.",
          "why": "It stages the received payload before an HTTP length is known.",
          "example": "Unlike new File(path), File.createTempFile creates a file on disk.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 82,
          "raw": "                tempFile.deleteOnExit(); // Extra safety: delete if JVM exits",
          "code": "tempFile.deleteOnExit();",
          "kind": "code",
          "what": "Register the staging path for deletion during normal JVM termination.",
          "why": "This is a backup if an ordinary cleanup path leaves the staging file.",
          "example": "Normal finally deletion remains the immediate cleanup attempt.",
          "caution": "deleteOnExit is not crash cleanup or a prompt expiry mechanism; registrations can accumulate until exit.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 83,
          "raw": "                String fileName = \"downloaded-file\";",
          "code": "String fileName = \"downloaded-file\";",
          "kind": "code",
          "what": "Choose downloaded-file as a fallback filename.",
          "why": "If the internal header does not contain Filename:, the response still needs a name.",
          "example": "The current code does not reject an absent or malformed filename header.",
          "caution": "",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 84,
          "raw": "                try {",
          "code": "try {",
          "kind": "code",
          "what": "Begin try paired with the staging-file finally cleanup.",
          "why": "Once staging exists, the handler wants to attempt deletion after normal or exceptional transfer completion.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "{}"
          ]
        },
        {
          "line": 85,
          "raw": "                    try (FileOutputStream fileOutputStream = new FileOutputStream(tempFile)) {",
          "code": "try (FileOutputStream fileOutputStream = new FileOutputStream(tempFile)) {",
          "kind": "code",
          "what": "Open a FileOutputStream on the staging file with automatic closure.",
          "why": "TCP payload bytes must be written to disk and the file handle released before HTTP reads.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "try",
            "()",
            "{}",
            "="
          ]
        },
        {
          "line": 86,
          "raw": "                        byte[] buffer = new byte[4096];",
          "code": "byte[] buffer = new byte[4096];",
          "kind": "code",
          "what": "Allocate a 4096-byte payload-read buffer.",
          "why": "Each socket read may return a chunk smaller than this capacity.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "byte",
            "[]",
            ";",
            "="
          ]
        },
        {
          "line": 87,
          "raw": "                        int byteRead;",
          "code": "int byteRead;",
          "kind": "code",
          "what": "Declare the count variable for subsequent buffered reads.",
          "why": "Writing only the actual count prevents stale bytes in the file.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            ";"
          ]
        },
        {
          "line": 88,
          "raw": "                        ByteArrayOutputStream headerBaos = new ByteArrayOutputStream();",
          "code": "ByteArrayOutputStream headerBaos = new ByteArrayOutputStream();",
          "kind": "code",
          "what": "Create an in-memory ByteArrayOutputStream for header bytes only.",
          "why": "The protocol begins with a short filename line before the binary file.",
          "example": "The current loop does not cap this header's length.",
          "caution": "",
          "syntax": [
            "new",
            "()",
            ";",
            "="
          ]
        },
        {
          "line": 89,
          "raw": "                        int b;",
          "code": "int b;",
          "kind": "code",
          "what": "Declare an int holding one byte-read result.",
          "why": "InputStream.read() returns 0..255 for a byte or -1 for EOF, so int is needed to represent both.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            ";"
          ]
        },
        {
          "line": 90,
          "raw": "                        while ((b = socketInput.read()) != -1) {",
          "code": "while ((b = socketInput.read()) != -1) {",
          "kind": "code",
          "what": "Read one socket byte at a time until EOF, assigning the result to b.",
          "why": "The handler needs to stop at the exact newline rather than accidentally mixing header and payload.",
          "example": "Parentheses make the assignment happen before comparison with -1.",
          "caution": "",
          "syntax": [
            "while",
            "()",
            "{}",
            ".",
            "=",
            "== / !="
          ]
        },
        {
          "line": 91,
          "raw": "                            if (b == '\\n') break;",
          "code": "if (b == '\\n') break;",
          "kind": "code",
          "what": "If that byte is newline, break from the header-read loop.",
          "why": "The sender's newline ends the Filename metadata and separates payload.",
          "example": "break stops only this loop; execution continues at header decoding.",
          "caution": "",
          "syntax": [
            "if",
            "break",
            "()",
            ";",
            "== / !=",
            "escapes"
          ]
        },
        {
          "line": 92,
          "raw": "                            headerBaos.write(b);",
          "code": "headerBaos.write(b);",
          "kind": "code",
          "what": "Append a non-newline header byte to headerBaos.",
          "why": "The collected bytes can later be decoded as metadata text.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 93,
          "raw": "                        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 90: while ((b = socketInput.read()) != -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 90's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 94,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 95,
          "raw": "                        String header = headerBaos.toString().trim();",
          "code": "String header = headerBaos.toString().trim();",
          "kind": "code",
          "what": "Decode the header bytes using the default charset and trim surrounding whitespace.",
          "why": "The next prefix test operates on a String.",
          "example": "trim can also remove whitespace around the filename, altering some legitimate names.",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 96,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 97,
          "raw": "                        if (header.startsWith(\"Filename: \")) {",
          "code": "if (header.startsWith(\"Filename: \")) {",
          "kind": "code",
          "what": "Check whether the decoded header begins with Filename: plus a space.",
          "why": "The sender and receiver must agree on this metadata prefix.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 98,
          "raw": "                            fileName = header.substring(\"Filename: \".length());",
          "code": "fileName = header.substring(\"Filename: \".length());",
          "kind": "code",
          "what": "Remove the prefix and keep the rest as fileName.",
          "why": "The HTTP attachment needs the stored basename, not the protocol label.",
          "example": "\"Filename: \".length() is 10.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 99,
          "raw": "                        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 97: if (header.startsWith(\"Filename: \")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 97's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 100,
          "raw": "                        while ((byteRead = socketInput.read(buffer)) != -1) {",
          "code": "while ((byteRead = socketInput.read(buffer)) != -1) {",
          "kind": "code",
          "what": "Read remaining socket bytes in chunks until EOF.",
          "why": "Everything after the metadata newline is treated as payload.",
          "example": "TCP read chunks need not equal the sender's write chunks.",
          "caution": "EOF does not prove expected total length: the protocol supplies no size/checksum.",
          "syntax": [
            "while",
            "()",
            "{}",
            ".",
            "=",
            "== / !="
          ]
        },
        {
          "line": 101,
          "raw": "                            fileOutputStream.write(buffer, 0, byteRead);",
          "code": "fileOutputStream.write(buffer, 0, byteRead);",
          "kind": "code",
          "what": "Write only byteRead bytes from buffer offset 0 to the staging file.",
          "why": "Short reads must not append stale buffer contents.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 102,
          "raw": "                        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 100: while ((byteRead = socketInput.read(buffer)) != -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 100's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 103,
          "raw": "                    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 85: try (FileOutputStream fileOutputStream = new FileOutputStream(tempFile)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 85's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 104,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 105,
          "raw": "                    // Detect file type (e.g., pdf, jpg, png, etc.)",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 106: Create a Path from the reported filename and ask installed file-type detectors for its MIME type.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "This probes a Path made from the reported filename; it is not content scanning of the staging file.",
          "syntax": []
        },
        {
          "line": 106,
          "raw": "                    String contentType = Files.probeContentType(Path.of(fileName));",
          "code": "String contentType = Files.probeContentType(Path.of(fileName));",
          "kind": "code",
          "what": "Create a Path from the reported filename and ask installed file-type detectors for its MIME type.",
          "why": "The HTTP response needs a reasonable Content-Type.",
          "example": "Path.of(fileName) describes the name; it is not reading the staging file's contents here.",
          "caution": "Detection is platform-dependent and not payload integrity or malware validation. This probes a Path made from the reported filename; it is not content scanning of the staging file.",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 107,
          "raw": "                    if (contentType == null) {",
          "code": "if (contentType == null) {",
          "kind": "code",
          "what": "Check whether the type detector returned no type.",
          "why": "A fallback is needed for unknown extensions/detectors.",
          "example": "",
          "caution": "",
          "syntax": [
            "null",
            "if",
            "()",
            "{}",
            "== / !="
          ]
        },
        {
          "line": 108,
          "raw": "                        contentType = \"application/octet-stream\";",
          "code": "contentType = \"application/octet-stream\";",
          "kind": "code",
          "what": "Choose generic application/octet-stream.",
          "why": "The receiver can still treat unknown content as downloadable binary data.",
          "example": "",
          "caution": "",
          "syntax": [
            ";",
            "="
          ]
        },
        {
          "line": 109,
          "raw": "                    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 107: if (contentType == null) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 107's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 110,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 111,
          "raw": "                    // Send the file to the client",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 112: Log that HTTP response metadata is about to be set/sent.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 112,
          "raw": "                    System.out.println(\"Sending file with headers:\");",
          "code": "System.out.println(\"Sending file with headers:\");",
          "kind": "code",
          "what": "Log that HTTP response metadata is about to be set/sent.",
          "why": "It gives a diagnostic marker between socket staging and browser delivery.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 113,
          "raw": "                    headers.add(\"Access-Control-Expose-Headers\", \"Content-Disposition\");",
          "code": "headers.add(\"Access-Control-Expose-Headers\", \"Content-Disposition\");",
          "kind": "code",
          "what": "Add Content-Disposition to exposed CORS response headers again.",
          "why": "The intended purpose is browser access to the filename.",
          "example": "The same header was already added at line 33; this addition is redundant.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 114,
          "raw": "                    headers.set(\"Content-Disposition\", \"attachment; filename=\\\"\" + fileName + \"\\\"\");",
          "code": "headers.set(\"Content-Disposition\", \"attachment; filename=\\\"\" + fileName + \"\\\"\");",
          "kind": "code",
          "what": "Set Content-Disposition to attachment with the fileName enclosed in quotes.",
          "why": "attachment requests download behavior; filename gives the browser a suggested name.",
          "example": "The Java \" sequences add literal quotes around UUID_notes.txt.",
          "caution": "A robust implementation must safely encode/validate untrusted names for headers; this line concatenates directly.",
          "syntax": [
            "()",
            ".",
            ";",
            "=",
            "+",
            "escapes"
          ]
        },
        {
          "line": 115,
          "raw": "                    headers.set(\"Content-Type\", contentType);",
          "code": "headers.set(\"Content-Type\", contentType);",
          "kind": "code",
          "what": "Set the HTTP MIME type to the detected/fallback contentType.",
          "why": "The response describes its file payload rather than the prior text/JSON error formats.",
          "example": "set replaces values for the name, whereas add appends another header value.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 116,
          "raw": "                    System.out.println(\"File length: \" + tempFile.length());",
          "code": "System.out.println(\"File length: \" + tempFile.length());",
          "kind": "code",
          "what": "Log the staging-file size in bytes.",
          "why": "This is the actual number of staged bytes, not necessarily proof the sender delivered the original complete file.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 117,
          "raw": "                    exchange.sendResponseHeaders(200, tempFile.length());",
          "code": "exchange.sendResponseHeaders(200, tempFile.length());",
          "kind": "code",
          "what": "Send 200 with the staging file's length as response length.",
          "why": "The staged file supplies a known count for the HTTP body.",
          "example": "sendResponseHeaders happens before body writes.",
          "caution": "For a zero-length file, this HttpServer API treats length 0 as chunked encoding; the code does not special-case that.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 118,
          "raw": "                    try (OutputStream os = exchange.getResponseBody();",
          "code": "try (OutputStream os = exchange.getResponseBody();",
          "kind": "code",
          "what": "Begin a multi-resource try by acquiring the HTTP response OutputStream.",
          "why": "The HTTP body needs a writer and that resource should close on exit.",
          "example": "The semicolon inside the parentheses separates resource declarations, not normal statements.",
          "caution": "",
          "syntax": [
            "try",
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 119,
          "raw": "                         FileInputStream fis = new FileInputStream(tempFile)) {",
          "code": "FileInputStream fis = new FileInputStream(tempFile)) {",
          "kind": "code",
          "what": "Add a FileInputStream reading staging to the same try-with-resources block.",
          "why": "The handler copies from staged disk to HTTP. Both streams are owned and close in reverse declaration order.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "()",
            "{}",
            "="
          ]
        },
        {
          "line": 120,
          "raw": "                        byte[] buffer = new byte[4096];",
          "code": "byte[] buffer = new byte[4096];",
          "kind": "code",
          "what": "Allocate a new 4096-byte buffer for the disk-to-HTTP copy.",
          "why": "This buffer belongs to a different scope/copy stage than line 86's buffer.",
          "example": "",
          "caution": "",
          "syntax": [
            "new",
            "byte",
            "[]",
            ";",
            "="
          ]
        },
        {
          "line": 121,
          "raw": "                        int bytesRead;",
          "code": "int bytesRead;",
          "kind": "code",
          "what": "Declare the count returned by staging-file reads.",
          "why": "The response must receive exactly the bytes read per iteration.",
          "example": "",
          "caution": "",
          "syntax": [
            "int",
            ";"
          ]
        },
        {
          "line": 122,
          "raw": "                        while ((bytesRead = fis.read(buffer)) != -1) {",
          "code": "while ((bytesRead = fis.read(buffer)) != -1) {",
          "kind": "code",
          "what": "Read staging chunks until file EOF.",
          "why": "All staged bytes must be copied to the HTTP response.",
          "example": "",
          "caution": "",
          "syntax": [
            "while",
            "()",
            "{}",
            ".",
            "=",
            "== / !="
          ]
        },
        {
          "line": 123,
          "raw": "                            os.write(buffer, 0, bytesRead);",
          "code": "os.write(buffer, 0, bytesRead);",
          "kind": "code",
          "what": "Write exactly bytesRead bytes to HTTP output.",
          "why": "Using the count preserves the file when the final chunk is short.",
          "example": "This is the transfer from server to recipient HTTP client.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 124,
          "raw": "                        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 122: while ((bytesRead = fis.read(buffer)) != -1) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 122's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 125,
          "raw": "                    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 119: FileInputStream fis = new FileInputStream(tempFile)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 119's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 126,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 127,
          "raw": "                    fileSharer.cleanupAfterDownload(port);",
          "code": "fileSharer.cleanupAfterDownload(port);",
          "kind": "code",
          "what": "Ask FileSharer to remove the original file and registry entries for port.",
          "why": "The happy path should invalidate the consumed PIN and remove its original temporary copy.",
          "example": "This runs only after the HTTP-copy try finishes successfully.",
          "caution": "An HTTP write failure jumps to cleanup/catch before this call; original/maps can remain.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 128,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 129,
          "raw": "                } finally {",
          "code": "} finally {",
          "kind": "code",
          "what": "Begin the finally block for the staging-file try.",
          "why": "It attempts local staging cleanup whether sending succeeds or throws.",
          "example": "",
          "caution": "",
          "syntax": [
            "finally",
            "{}"
          ]
        },
        {
          "line": 130,
          "raw": "                    // Always delete temp file",
          "code": "",
          "kind": "comment",
          "what": "This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 131: Check whether staging still exists.",
          "why": "Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.",
          "caution": "finally attempts deletion; File.delete can fail and its result is ignored.",
          "syntax": []
        },
        {
          "line": 131,
          "raw": "                    if (tempFile.exists()) {",
          "code": "if (tempFile.exists()) {",
          "kind": "code",
          "what": "Check whether staging still exists.",
          "why": "Deletion is attempted only for a currently present path.",
          "example": "",
          "caution": "finally attempts deletion; File.delete can fail and its result is ignored.",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 132,
          "raw": "                        tempFile.delete();",
          "code": "tempFile.delete();",
          "kind": "code",
          "what": "Attempt to delete the staging file.",
          "why": "Staging is no longer needed once this handler leaves its transfer attempt.",
          "example": "File.delete returns boolean, ignored here.",
          "caution": "The earlier comment \"Always delete\" means always attempt on this cleanup path, not guaranteed success. finally attempts deletion; File.delete can fail and its result is ignored.",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 133,
          "raw": "                    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 131: if (tempFile.exists()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 131's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 134,
          "raw": "                }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 129: } finally {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 129's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 135,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 79: try (Socket socket = new Socket(\"localhost\", port)) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 79's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 136,
          "raw": "        } catch (IOException e) {",
          "code": "} catch (IOException e) {",
          "kind": "code",
          "what": "Catch IOException from the download try after owned resources are unwound.",
          "why": "Socket, file and HTTP I/O can fail independently.",
          "example": "",
          "caution": "",
          "syntax": [
            "catch",
            "()",
            "{}"
          ]
        },
        {
          "line": 137,
          "raw": "            System.err.println(\"Error downloading file from peer: \" + e.getMessage());",
          "code": "System.err.println(\"Error downloading file from peer: \" + e.getMessage());",
          "kind": "code",
          "what": "Log the failure description to standard error.",
          "why": "The phrase peer is a log label; the intended socket is local server-to-server-component communication.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "+"
          ]
        },
        {
          "line": 138,
          "raw": "            String response = \"Error downloading file: \" + e.getMessage();",
          "code": "String response = \"Error downloading file: \" + e.getMessage();",
          "kind": "code",
          "what": "Build a text error message containing the exception description.",
          "why": "The author sends a caller-visible reason for failed I/O.",
          "example": "Raw exception messages can reveal implementation details.",
          "caution": "",
          "syntax": [
            "String",
            "()",
            ".",
            ";",
            "=",
            "+"
          ]
        },
        {
          "line": 139,
          "raw": "            headers.add(\"Content-Type\", \"text/plain\");",
          "code": "headers.add(\"Content-Type\", \"text/plain\");",
          "kind": "code",
          "what": "Add text/plain as an error MIME type.",
          "why": "The intended new body is a text error, not file bytes.",
          "example": "If attachment headers already exist, add does not remove them.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 140,
          "raw": "            exchange.sendResponseHeaders(500, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(500, response.getBytes().length);",
          "kind": "code",
          "what": "Attempt to send 500 and the error text length.",
          "why": "A pre-response socket/file failure can be reported as a server error.",
          "example": "If 200 headers were already sent, a second status cannot reliably replace them and this call may itself fail.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 141,
          "raw": "            try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Acquire the error response stream in try-with-resources.",
          "why": "The error body must also close its output resource.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 142,
          "raw": "                os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Write the error message bytes.",
          "why": "It completes the attempted error response when headers/body are still writable.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 143,
          "raw": "            }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 141: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 141's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 144,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 136: } catch (IOException e) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 136's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 145,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 28: public void handle(HttpExchange exchange) throws IOException {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 28's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 146,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 20: public class DownloadHandler implements HttpHandler {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 20's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        }
      ]
    },
    {
      "name": "CORSHandler.java",
      "path": "handler/CORSHandler.java",
      "purpose": "Respond to root-context preflight and give unmatched ordinary requests a 404.",
      "caller": "HttpServer invokes handle for its / fallback context.",
      "analogy": "A reception desk that answers browser permission checks or says the route does not exist.",
      "checks": [
        [
          "Does allowing Authorization verify a JWT?",
          "No. It only allows the browser to send that header; no token verification is performed by this handler."
        ],
        [
          "Why return after the 204?",
          "Without it, execution would attempt to send the unrelated 404 response on the same exchange."
        ],
        [
          "What does try-with-resources close here?",
          "The HTTP response OutputStream, not all server resources."
        ]
      ],
      "id": "corshandler",
      "hash": "b21d2eae660baf22ff2864becf8a05b6c6a2b875c16c8731226f2743ca904a4a",
      "rows": [
        {
          "line": 1,
          "raw": "package P2P.handler;",
          "code": "package P2P.handler;",
          "kind": "package",
          "what": "Declare that this file's types belong to the P2P.handler package.",
          "why": "Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.",
          "example": "The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.handler.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 2,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 3,
          "raw": "import java.io.IOException;",
          "code": "import java.io.IOException;",
          "kind": "import",
          "what": "Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.",
          "why": "Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.IOException where IOException is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 4,
          "raw": "import java.io.OutputStream;",
          "code": "import java.io.OutputStream;",
          "kind": "import",
          "what": "Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.",
          "why": "HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 5,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 6,
          "raw": "import com.sun.net.httpserver.Headers;",
          "code": "import com.sun.net.httpserver.Headers;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.Headers available by its short name Headers. The HTTP header collection type from the JDK server API.",
          "why": "Handlers read incoming metadata or add/set outgoing metadata. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.Headers where Headers is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 7,
          "raw": "import com.sun.net.httpserver.HttpExchange;",
          "code": "import com.sun.net.httpserver.HttpExchange;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.HttpExchange available by its short name HttpExchange. One HTTP request and its response channel.",
          "why": "handle receives this object to inspect method/URI/headers and access body streams. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.HttpExchange where HttpExchange is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 8,
          "raw": "import com.sun.net.httpserver.HttpHandler;",
          "code": "import com.sun.net.httpserver.HttpHandler;",
          "kind": "import",
          "what": "Make the type com.sun.net.httpserver.HttpHandler available by its short name HttpHandler. The interface with handle(HttpExchange).",
          "why": "implements HttpHandler allows a class to be registered as a server context handler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.",
          "example": "Without this import you could write the fully qualified name com.sun.net.httpserver.HttpHandler where HttpHandler is used.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 9,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 10,
          "raw": "public class CORSHandler implements HttpHandler {",
          "code": "public class CORSHandler implements HttpHandler {",
          "kind": "code",
          "what": "Declare CORSHandler as a class implementing HttpHandler.",
          "why": "HttpServer contexts expect an object with the handle(HttpExchange) contract.",
          "example": "implements is interface conformance; it does not mean this class inherits a concrete implementation.",
          "caution": "",
          "syntax": [
            "public",
            "class",
            "implements",
            "{}"
          ]
        },
        {
          "line": 11,
          "raw": "    @Override",
          "code": "@Override",
          "kind": "code",
          "what": "Use @Override to tell the compiler that handle implements an existing contract.",
          "why": "It catches signature mistakes when writing the handler.",
          "example": "",
          "caution": "",
          "syntax": [
            "Override"
          ]
        },
        {
          "line": 12,
          "raw": "    public void handle(HttpExchange exchange) throws IOException {",
          "code": "public void handle(HttpExchange exchange) throws IOException {",
          "kind": "code",
          "what": "Declare handle with one exchange object representing this request/response, and allow IOException.",
          "why": "The server invokes this method per request; exchange supplies method, headers and response body.",
          "example": "",
          "caution": "",
          "syntax": [
            "public",
            "void",
            "throws",
            "()",
            "{}"
          ]
        },
        {
          "line": 13,
          "raw": "        Headers headers = exchange.getResponseHeaders();",
          "code": "Headers headers = exchange.getResponseHeaders();",
          "kind": "code",
          "what": "Get the mutable response-header collection into headers.",
          "why": "The following additions describe the response sent to the browser.",
          "example": "These are not the incoming request headers.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";",
            "="
          ]
        },
        {
          "line": 14,
          "raw": "        headers.add(\"Access-Control-Allow-Origin\", \"*\");",
          "code": "headers.add(\"Access-Control-Allow-Origin\", \"*\");",
          "kind": "code",
          "what": "Add Access-Control-Allow-Origin with wildcard *.",
          "why": "A cross-origin browser can read eligible responses under wildcard CORS rules.",
          "example": "This is browser policy, not authentication or a restriction on curl callers.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 15,
          "raw": "        headers.add(\"Access-Control-Allow-Methods\", \"GET,POST,OPTIONS\");",
          "code": "headers.add(\"Access-Control-Allow-Methods\", \"GET,POST,OPTIONS\");",
          "kind": "code",
          "what": "Advertise GET, POST and OPTIONS as permitted cross-origin methods.",
          "why": "A browser preflight can see which methods the API allows.",
          "example": "This header does not implement those routes or override later method checks.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 16,
          "raw": "        headers.add(\"Access-Control-Allow-Headers\", \"Content-Type,Authorization\");",
          "code": "headers.add(\"Access-Control-Allow-Headers\", \"Content-Type,Authorization\");",
          "kind": "code",
          "what": "Allow Content-Type and Authorization as requested cross-origin headers.",
          "why": "A preflight can permit these header names on the actual request.",
          "example": "Allowing Authorization does not parse/verify credentials.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 17,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 18,
          "raw": "        if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "code": "if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "kind": "code",
          "what": "Check case-insensitively whether the incoming request method is OPTIONS.",
          "why": "This selects the browser-permission-check response branch.",
          "example": "",
          "caution": "",
          "syntax": [
            "if",
            "()",
            "{}",
            "."
          ]
        },
        {
          "line": 19,
          "raw": "            exchange.sendResponseHeaders(204, -1);",
          "code": "exchange.sendResponseHeaders(204, -1);",
          "kind": "code",
          "what": "Send status 204 and response length -1, meaning no response body.",
          "why": "A preflight reply can provide permission headers without file bytes or a text payload.",
          "example": "204 is No Content; -1 is this API's no-body signal, not chunked length 0.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 20,
          "raw": "            return;",
          "code": "return;",
          "kind": "code",
          "what": "Return from handle immediately.",
          "why": "The same exchange must not fall through to send a 404 as a second response.",
          "example": "",
          "caution": "",
          "syntax": [
            "return",
            ";"
          ]
        },
        {
          "line": 21,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 18: if (exchange.getRequestMethod().equalsIgnoreCase(\"OPTIONS\")) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 18's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 22,
          "raw": "",
          "code": "",
          "kind": "blank",
          "what": "A blank line; it performs no operation.",
          "why": "Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.",
          "caution": "",
          "syntax": []
        },
        {
          "line": 23,
          "raw": "        String response = \"NOT FOUND\";",
          "code": "String response = \"NOT FOUND\";",
          "kind": "code",
          "what": "Create the fallback text NOT FOUND.",
          "why": "Ordinary unmatched requests need a clear error body.",
          "example": "",
          "caution": "",
          "syntax": [
            "String",
            ";",
            "="
          ]
        },
        {
          "line": 24,
          "raw": "        exchange.sendResponseHeaders(404, response.getBytes().length);",
          "code": "exchange.sendResponseHeaders(404, response.getBytes().length);",
          "kind": "code",
          "what": "Send a 404 status and the byte length of that text.",
          "why": "The receiver must know the status and expected body length before reading.",
          "example": "The size is encoded bytes, not merely Java String character count.",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 25,
          "raw": "        try (OutputStream os = exchange.getResponseBody()) {",
          "code": "try (OutputStream os = exchange.getResponseBody()) {",
          "kind": "code",
          "what": "Get the HTTP response OutputStream inside try-with-resources.",
          "why": "The handler needs a stream for the body; closing it releases/completes the response stream even on write failure.",
          "example": "",
          "caution": "",
          "syntax": [
            "try",
            "()",
            "{}",
            ".",
            "="
          ]
        },
        {
          "line": 26,
          "raw": "            os.write(response.getBytes());",
          "code": "os.write(response.getBytes());",
          "kind": "code",
          "what": "Encode NOT FOUND and write the bytes to the response body.",
          "why": "Sending headers alone would not send the text payload promised by the response length.",
          "example": "",
          "caution": "",
          "syntax": [
            "()",
            ".",
            ";"
          ]
        },
        {
          "line": 27,
          "raw": "        }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 25: try (OutputStream os = exchange.getResponseBody()) {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 25's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 28,
          "raw": "    }",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 12: public void handle(HttpExchange exchange) throws IOException {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 12's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        },
        {
          "line": 29,
          "raw": "}",
          "code": "}",
          "kind": "brace",
          "what": "Close the block opened on line 10: public class CORSHandler implements HttpHandler {",
          "why": "Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.",
          "example": "Match this } back to line 10's { before deciding which method, loop, condition or resource lifetime has ended.",
          "caution": "",
          "syntax": [
            "{}"
          ]
        }
      ]
    }
  ],
  "glossary": {
    "public": "Visibility: code outside this package can access the member/type when its containing type permits it.",
    "private": "Visibility: implementation details are confined to the containing class (including permitted nested-class access).",
    "static": "Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference.",
    "final": "This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable.",
    "class": "Defines a named type and its members. A class declaration does not construct an instance.",
    "new": "Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task.",
    "this": "The current object. this.field distinguishes an instance field from a same-named parameter.",
    "void": "This method returns no value. return; exits it without a result.",
    "int": "A primitive signed 32-bit integer, used here for ports, indexes and byte counts.",
    "long": "A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes.",
    "boolean": "A primitive true/false value used by conditions and validation flags.",
    "byte": "A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1.",
    "String": "An immutable text object. String comparisons use equals for contents, not == for object identity.",
    "Integer": "The reference/object form of int. It can be null and can be used as a generic map key/value.",
    "null": "No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal.",
    "return": "Exit the current method now. In a helper it exits that helper; in handle it ends that request callback.",
    "if": "Run the controlled statement/block only when its condition is true.",
    "else": "The alternative branch when the preceding if condition is false.",
    "for": "Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop.",
    "while": "Repeat while a condition is true; test it before each iteration.",
    "break": "Exit the nearest enclosing loop/switch. Execution continues after it; this is not a method return.",
    "try": "Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources.",
    "catch": "Handle a matching exception thrown from the associated try; it does not catch failures in another thread.",
    "finally": "Run cleanup when control leaves its associated try under normal Java unwinding, including return/exception paths; forced termination can prevent it.",
    "throws": "Declare that a checked exception may propagate to the caller. This is not an exception handler.",
    "implements": "Declare conformance to an interface contract such as HttpHandler or Runnable.",
    "Override": "Compiler-checked annotation for a method overriding/implementing an inherited contract. It does not invoke the method.",
    "()": "Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax.",
    "{}": "Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.",
    "[]": "An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based.",
    ".": "Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.",
    ";": "End a Java statement/declaration; also separate for-loop clauses or try resource declarations.",
    "=": "Assign the right-side value to the left variable. It is not equality comparison.",
    "== / !=": "Equality/inequality. == null tests missing reference; String content should use equals.",
    "!": "Logical NOT: true becomes false and false becomes true.",
    "&& / ||": "Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.",
    "++ / +=": "Increment, or add then assign. A compound update is not automatically atomic between threads.",
    "+": "Numeric addition for numbers; text concatenation when a String operand is involved.",
    "<>": "Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.",
    "->": "Lambda arrow: arguments on the left, deferred task expression/body on the right.",
    "? :": "Conditional expression: condition ? resultIfTrue : resultIfFalse.",
    "escapes": "Inside strings, \\\" is a quote, \\\\ a backslash, \\r carriage return and \\n newline. These characters differ from their written escape notation."
  },
  "totals": {
    "files": 8,
    "lines": 901,
    "authoredStatements": 470
  }
};
