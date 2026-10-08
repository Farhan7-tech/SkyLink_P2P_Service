# Every Line of SkyLink P2P, Explained

Written for a beginner returning to this project. Covers all eight production Java files in the screenshot, with their original line numbers and original text. Snapshot: 8 October 2026. This is a code-teaching guide, not a claim that reading it alone establishes interview mastery.

[Open the interactive line reader](code-walkthrough/index.html). [Overall flow and interview plan](../INTERVIEW_PREP.md). [Run a local transfer](HOW_TO_RUN.md).

## Before Reading Any Code

A class is a blueprint; an object is one instance constructed with new. A variable is a named slot holding a primitive value or an object reference. A method is a named operation; declaring it does not call it. A constructor initializes an object. A parameter is input to a call; a return value is its output. Fields remain with an object/class, while local variables belong to an invocation/scope. Two variables can refer to the same mutable object.

The operating system runs your Java process. The JVM executes your code. This process hosts an HTTP API and also per-file TCP listeners. Both browsers call the HTTP API; they do not host your ServerSocket. localhost inside DownloadHandler means this server host. Uploaded plaintext first accumulates in heap, then goes to temporary disk. The internal socket sends it to DownloadHandler, which stages it to a second file before returning HTTP.

Read in the order below. Do not attempt all 901 physical lines in one sitting. For a small block, explain what exists before it, what changes, where the next call goes, and which branch can return early. The reader lets you select every line, including comments/blank lines; program statements have individually authored explanations.

## Read a Statement Token by Token

`FileController fileController = new FileController(port);` reads as: the variable type is FileController; its name is fileController; = assigns the constructor result; new creates an object; (port) passes the numeric port; ; ends the statement. The constructor initializes fields and routes. The separate `fileController.start();` call starts HTTP processing. Uppercase/lowercase names are conventions, not hidden Java behavior.

`while ((bytesRead = stream.read(buffer)) != -1)` reads as: call read to fill up to the buffer capacity; save its actual count in bytesRead; compare with EOF -1; run the body if not EOF; repeat. A 5000-byte file might read 4096, then 904, then -1. Write only the actual count, not the whole buffer.

## Read These Chapters in Order


1. [App.java](#app): Start the Java HTTP service and connect startup to shutdown.
2. [FileController.java](#filecontroller): Create and wire the HTTP server, shared state, routes and request worker pool.
3. [UploadUtils.java](#uploadutils): Generate a random candidate port number in the dynamic/private range.
4. [MultiParser.java](#multiparser): Extract a filename, claimed MIME type and payload bytes from a narrow single-file multipart envelope.
5. [UploadHandler.java](#uploadhandler): Validate one multipart upload, buffer/parse it, save it and return a registered share PIN.
6. [FileSharer.java](#filesharer): Own pending transfer metadata/PINs, start a per-file listener, send disk bytes and clean a consumed share.
7. [DownloadHandler.java](#downloadhandler): Turn a PIN-authorized HTTP request into a local socket read, then an HTTP attachment and successful-path cleanup.
8. [CORSHandler.java](#corshandler): Respond to root-context preflight and give unmatched ordinary requests a 404.

## Syntax Dictionary

- **public:** Visibility: code outside this package can access the member/type when its containing type permits it.
- **private:** Visibility: implementation details are confined to the containing class (including permitted nested-class access).
- **static:** Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference.
- **final:** This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable.
- **class:** Defines a named type and its members. A class declaration does not construct an instance.
- **new:** Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task.
- **this:** The current object. this.field distinguishes an instance field from a same-named parameter.
- **void:** This method returns no value. return; exits it without a result.
- **int:** A primitive signed 32-bit integer, used here for ports, indexes and byte counts.
- **long:** A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes.
- **boolean:** A primitive true/false value used by conditions and validation flags.
- **byte:** A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1.
- **String:** An immutable text object. String comparisons use equals for contents, not == for object identity.
- **Integer:** The reference/object form of int. It can be null and can be used as a generic map key/value.
- **null:** No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal.
- **return:** Exit the current method now. In a helper it exits that helper; in handle it ends that request callback.
- **if:** Run the controlled statement/block only when its condition is true.
- **else:** The alternative branch when the preceding if condition is false.
- **for:** Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop.
- **while:** Repeat while a condition is true; test it before each iteration.
- **break:** Exit the nearest enclosing loop/switch. Execution continues after it; this is not a method return.
- **try:** Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources.
- **catch:** Handle a matching exception thrown from the associated try; it does not catch failures in another thread.
- **finally:** Run cleanup when control leaves its associated try under normal Java unwinding, including return/exception paths; forced termination can prevent it.
- **throws:** Declare that a checked exception may propagate to the caller. This is not an exception handler.
- **implements:** Declare conformance to an interface contract such as HttpHandler or Runnable.
- **Override:** Compiler-checked annotation for a method overriding/implementing an inherited contract. It does not invoke the method.
- **():** Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax.
- **{}:** Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.
- **[]:** An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based.
- **.:** Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.
- **;:** End a Java statement/declaration; also separate for-loop clauses or try resource declarations.
- **=:** Assign the right-side value to the left variable. It is not equality comparison.
- **== / !=:** Equality/inequality. == null tests missing reference; String content should use equals.
- **!:** Logical NOT: true becomes false and false becomes true.
- **&& / ||:** Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.
- **++ / +=:** Increment, or add then assign. A compound update is not automatically atomic between threads.
- **+:** Numeric addition for numbers; text concatenation when a String operand is involved.
- **<>:** Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.
- **->:** Lambda arrow: arguments on the left, deferred task expression/body on the right.
- **? ::** Conditional expression: condition ? resultIfTrue : resultIfFalse.
- **escapes:** Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

## Source Coverage

All 8 files / 901 physical lines / 470 individually annotated code lines. Package/import declarations, comments, blank lines and closing braces are also explained. Source files are unchanged. The generator rejects any executable line without an authored explanation.

<a id="app"></a>

## App.java

**Source:** [App.java](../src/main/java/P2P/App.java)

**Purpose:** Start the Java HTTP service and connect startup to shutdown.

**Who calls it:** The JVM calls main when you run the jar.

**Picture it:** The person opening and closing the transfer counter.

**Snapshot SHA-256:** `4bf0f1ddda802c879ec264255d9d1220471874816cd41aca432c3edeb2e5d3cc`

<a id="app-l1"></a>

### Line 1 (package)

```java
package P2P;
```

**What it does:** Declare that this file's types belong to the P2P package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.

<a id="app-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l3"></a>

### Line 3 (import)

```java
import java.io.IOException;
```

**What it does:** Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.

**Why it is here:** Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.IOException where IOException is used.

<a id="app-l4"></a>

### Line 4 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l5"></a>

### Line 5 (import)

```java
import P2P.Controller.FileController;
```

**What it does:** Make the type P2P.Controller.FileController available by its short name FileController. Your project's class that constructs and manages the API server.

**Why it is here:** App needs to construct it and call its lifecycle methods. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.Controller.FileController where FileController is used.

<a id="app-l6"></a>

### Line 6 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l7"></a>

### Line 7 (code)

```java
public class App
```

**What it does:** Declare the publicly accessible App class. A class defines a named type and groups related code.

**Why it is here:** The JVM needs a class containing the entry-point method. App is startup coordination; it is not an upload handler.

**Example / read it aloud:** public permits access outside this package; App matches App.java.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance.

<a id="app-l8"></a>

### Line 8 (code)

```java
{
```

**What it does:** Open the body of class App.

**Why it is here:** The following fields/methods belong to App until its matching final closing brace.

**Example / read it aloud:** The matching class-closing brace is line 46.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="app-l9"></a>

### Line 9 (code)

```java
    public static void main( String[] args )
```

**What it does:** Declare the program entry point: a public, static method named main, returning no value, with an array of String arguments.

**Why it is here:** The Java launcher looks for this conventional signature. static means it can call main without first constructing an App object. void means there is no return value.

**Example / read it aloud:** In java -jar app.jar hello, args[0] would be "hello"; this program does not use args.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. void: This method returns no value. return; exits it without a result. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based.

<a id="app-l10"></a>

### Line 10 (code)

```java
    {
```

**What it does:** Open main's method body.

**Why it is here:** Startup statements are executed in this method, rather than at class declaration time.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="app-l11"></a>

### Line 11 (code)

```java
        try {
```

**What it does:** Begin a try block around startup and the indefinite wait.

**Why it is here:** The catch clauses below handle checked I/O and interruption failures thrown by operations in this block.

**Example / read it aloud:** An IOException from constructing the HTTP server reaches line 33.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

**Actual behavior / caution:** This does not catch every exception: invalid PORT can throw NumberFormatException.

<a id="app-l12"></a>

### Line 12 (comment)

```java
            // Get port dynamically (Render provides PORT env var). if we in render or any VPS does not set a port on env , it used the
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 14: Read environment variable PORT as text, default to "8081" if absent, convert it to an int, and store it in local variable port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="app-l13"></a>

### Line 13 (comment)

```java
            // default port which is  8081.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 14: Read environment variable PORT as text, default to "8081" if absent, convert it to an int, and store it in local variable port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="app-l14"></a>

### Line 14 (code)

```java
            int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8081"));
```

**What it does:** Read environment variable PORT as text, default to "8081" if absent, convert it to an int, and store it in local variable port.

**Why it is here:** Hosting platforms choose an API port through environment configuration; the local default lets the application start without that setting.

**Example / read it aloud:** PORT="9000" -> getOrDefault gives "9000" -> parseInt gives 9000 -> int port is 9000.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. Integer: The reference/object form of int. It can be null and can be used as a generic map key/value. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Empty or nonnumeric PORT does not use the default; parseInt fails.

<a id="app-l15"></a>

### Line 15 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l16"></a>

### Line 16 (comment)

```java
            // Start the API server
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 17: Construct a FileController object using port, then store a reference to it in variable fileController.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="app-l17"></a>

### Line 17 (code)

```java
            FileController fileController = new FileController(port);
```

**What it does:** Construct a FileController object using port, then store a reference to it in variable fileController.

**Why it is here:** The controller owns the HTTP server, common FileSharer, handlers and executor. This creates the dependencies that the rest of startup needs.

**Example / read it aloud:** Left FileController is the variable type; lowercase fileController is the variable name; new invokes its constructor.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="app-l18"></a>

### Line 18 (code)

```java
            fileController.start();
```

**What it does:** Call start() on the controller object created on line 17.

**Why it is here:** Construction configured the server; this separate call starts processing HTTP exchanges.

**Example / read it aloud:** Execution enters FileController.start(), which calls httpServer.start().

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="app-l19"></a>

### Line 19 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l20"></a>

### Line 20 (code)

```java
            System.out.println("SkyLink server started on port " + port);
```

**What it does:** Print a startup message with the configured port appended.

**Why it is here:** A log lets you see which API port this process intended to use. + concatenates text and the number.

**Example / read it aloud:** If port is 8081, output is SkyLink server started on port 8081.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** If port 0 were supplied, the OS-selected port is reported accurately by the controller log, not this configured-value log.

<a id="app-l21"></a>

### Line 21 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l22"></a>

### Line 22 (comment)

```java
            // Handle shutdown properly. (this thread runs when jvm is shutting down).
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 23: Ask the current JVM Runtime to register a new Thread whose task is the lambda () -> { ... }.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="app-l23"></a>

### Line 23 (code)

```java
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
```

**What it does:** Ask the current JVM Runtime to register a new Thread whose task is the lambda () -> { ... }.

**Why it is here:** The shutdown hook gives the application a chance to stop its server when the JVM shuts down normally. The lambda contains deferred actions: these lines do not run during registration.

**Example / read it aloud:** () says the lambda has no parameters; -> introduces its body; new Thread wraps the task.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ->: Lambda arrow: arguments on the left, deferred task expression/body on the right.

**Actual behavior / caution:** Shutdown hooks are not guaranteed on forced termination or a machine crash.

<a id="app-l24"></a>

### Line 24 (code)

```java
                System.out.println("Shutting down server...");
```

**What it does:** Print a message when the shutdown-hook thread executes.

**Why it is here:** It marks the beginning of shutdown; unlike the earlier startup log, this is inside the deferred lambda.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="app-l25"></a>

### Line 25 (code)

```java
                fileController.stop();
```

**What it does:** Call stop() on the same controller captured by the lambda.

**Why it is here:** The hook needs access to the existing HTTP server and executor to close them. It must not construct a new controller.

**Example / read it aloud:** The local reference fileController is effectively final: it is not reassigned, so the lambda may capture it.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="app-l26"></a>

### Line 26 (code)

```java
            }));
```

**What it does:** Close the lambda body, the Thread constructor call and the addShutdownHook call; finish the statement.

**Why it is here:** The braces and parentheses have different jobs: } ends the task, the first ) ends new Thread(...), the second ) ends registration, and ; ends the statement.

**Example / read it aloud:** Read it as addShutdownHook( new Thread( task ) );

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="app-l27"></a>

### Line 27 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l28"></a>

### Line 28 (comment)

```java
            // Keep the server running indefinitely,
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Obtain the currently executing thread and call join() on that same thread.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="app-l29"></a>

### Line 29 (comment)

```java
            // basically it waits for itself to finish,
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Obtain the currently executing thread and call join() on that same thread.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="app-l30"></a>

### Line 30 (comment)

```java
            // which will never gonna happen. that blocks the thread indefinitely.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Obtain the currently executing thread and call join() on that same thread.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="app-l31"></a>

### Line 31 (code)

```java
            Thread.currentThread().join();
```

**What it does:** Obtain the currently executing thread and call join() on that same thread.

**Why it is here:** join waits for the target thread to terminate. Here the main thread targets itself, so it waits indefinitely unless interrupted; this is the program's keep-running mechanism.

**Example / read it aloud:** This is self-join, not joining the shutdown hook or a worker.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** An explicit lifecycle latch would express the intent more clearly.

<a id="app-l32"></a>

### Line 32 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l33"></a>

### Line 33 (code)

```java
        } catch (IOException e) {
```

**What it does:** End the try block and start an IOException catch block; name the caught exception e.

**Why it is here:** Server creation and other I/O can fail. This branch handles those failures instead of continuing startup.

**Example / read it aloud:** IOException is the exception type; e is the reference to the particular failure.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="app-l34"></a>

### Line 34 (code)

```java
            System.err.println("Error starting server: " + e.getMessage());
```

**What it does:** Print the I/O failure message to standard error.

**Why it is here:** Standard error is used for diagnostics rather than ordinary output. getMessage extracts the failure's description.

**Example / read it aloud:** A bind failure may identify a port already in use.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** Only the message is logged, not a complete stack trace.

<a id="app-l35"></a>

### Line 35 (code)

```java
            System.exit(1);   /* so basically, when exception occurred, System.exit(1) is
```

**What it does:** Terminate the JVM with exit status 1; the following /* starts a nonexecuting block comment.

**Why it is here:** A nonzero status tells the launcher/host that startup failed. Registered shutdown hooks normally run during System.exit.

**Example / read it aloud:** 1 conventionally signals failure; 0 conventionally signals success.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** The hook exists only if execution previously reached its registration; the comment does not create a hook. System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.

<a id="app-l36"></a>

### Line 36 (comment)

```java
            telling jvm to stop the program immediately , and we know .addShutdownHook(Thread t)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Start a separate catch for InterruptedException from join().

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.

<a id="app-l37"></a>

### Line 37 (comment)

```java
            This method registers a thread that will run automatically when the JVM is shutting down.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Start a separate catch for InterruptedException from join().

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.

<a id="app-l38"></a>

### Line 38 (comment)

```java
            so flow of program reach to  runtime.getruntime() method , which gracefully stops the app*/
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Start a separate catch for InterruptedException from join().

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.

<a id="app-l39"></a>

### Line 39 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l40"></a>

### Line 40 (code)

```java
        } catch (InterruptedException e) {
```

**What it does:** Start a separate catch for InterruptedException from join().

**Why it is here:** Interruption wakes the main thread from its wait; the program chooses to treat it as a failure and exit.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="app-l41"></a>

### Line 41 (code)

```java
            System.err.println("Server interrupted: " + e.getMessage());
```

**What it does:** Print the interruption description to standard error.

**Why it is here:** This distinguishes an interrupted wait from a server I/O startup failure.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="app-l42"></a>

### Line 42 (code)

```java
            System.exit(1);
```

**What it does:** Exit the JVM with failure status after interruption.

**Why it is here:** The program does not attempt to resume its indefinite wait.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="app-l43"></a>

### Line 43 (brace)

```java
        }
```

**What it does:** Close the block opened on line 40: } catch (InterruptedException e) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 40's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="app-l44"></a>

### Line 44 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="app-l45"></a>

### Line 45 (brace)

```java
    }
```

**What it does:** Close the block opened on line 10: {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 10's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="app-l46"></a>

### Line 46 (brace)

```java
}
```

**What it does:** Close the block opened on line 8: {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 8's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

### Pause and Check Your Understanding

**Question:** Does new FileController(port) begin accepting requests?

**Answer:** It constructs/binds/configures the server; start() begins HTTP processing.

**Question:** What is the type before and after parseInt?

**Answer:** getOrDefault returns a String such as "8081"; parseInt returns primitive int 8081.

**Question:** Which thread does line 31 wait for?

**Answer:** The main thread waits for itself indefinitely, not for a file-sender thread.

<a id="filecontroller"></a>

## FileController.java

**Source:** [Controller/FileController.java](../src/main/java/P2P/Controller/FileController.java)

**Purpose:** Create and wire the HTTP server, shared state, routes and request worker pool.

**Who calls it:** App.main constructs it and calls start(); the shutdown hook calls stop().

**Picture it:** The counter manager: assigns desks, workers and a common notebook.

**Snapshot SHA-256:** `d2c85e1bfd0e0d6ff15839657e39964d6328541221d78231af27b95466e3972f`

<a id="filecontroller-l1"></a>

### Line 1 (package)

```java
package P2P.Controller;
```

**What it does:** Declare that this file's types belong to the P2P.Controller package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Controller.

<a id="filecontroller-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l3"></a>

### Line 3 (import)

```java
import java.io.File;
```

**What it does:** Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.

**Why it is here:** Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.File where File is used.

<a id="filecontroller-l4"></a>

### Line 4 (import)

```java
import java.io.IOException;
```

**What it does:** Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.

**Why it is here:** Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.IOException where IOException is used.

<a id="filecontroller-l5"></a>

### Line 5 (import)

```java
import java.net.InetSocketAddress;
```

**What it does:** Make the type java.net.InetSocketAddress available by its short name InetSocketAddress. A host/port socket address value.

**Why it is here:** HttpServer.create needs the API address to bind. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.net.InetSocketAddress where InetSocketAddress is used.

<a id="filecontroller-l6"></a>

### Line 6 (import)

```java
import java.util.concurrent.ExecutorService;
```

**What it does:** Make the type java.util.concurrent.ExecutorService available by its short name ExecutorService. An interface for scheduling tasks and controlling executor shutdown.

**Why it is here:** The controller stores its worker pool through this abstraction. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.concurrent.ExecutorService where ExecutorService is used.

<a id="filecontroller-l7"></a>

### Line 7 (import)

```java
import java.util.concurrent.Executors;
```

**What it does:** Make the type java.util.concurrent.Executors available by its short name Executors. A factory class for standard executor configurations.

**Why it is here:** newFixedThreadPool(10) creates the HTTP request scheduler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.concurrent.Executors where Executors is used.

<a id="filecontroller-l8"></a>

### Line 8 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l9"></a>

### Line 9 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l10"></a>

### Line 10 (import)

```java
import P2P.Service.FileSharer;
```

**What it does:** Make the type P2P.Service.FileSharer available by its short name FileSharer. Your shared pending-file/PIN registry and local TCP service.

**Why it is here:** Handlers coordinate through one FileSharer object; importing the name does not construct it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.Service.FileSharer where FileSharer is used.

<a id="filecontroller-l11"></a>

### Line 11 (import)

```java
import P2P.handler.CORSHandler;
```

**What it does:** Make the type P2P.handler.CORSHandler available by its short name CORSHandler. Your root-context HTTP handler.

**Why it is here:** The controller constructs it for preflight/404 fallback. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.handler.CORSHandler where CORSHandler is used.

<a id="filecontroller-l12"></a>

### Line 12 (import)

```java
import P2P.handler.DownloadHandler;
```

**What it does:** Make the type P2P.handler.DownloadHandler available by its short name DownloadHandler. Your PIN-to-HTTP attachment handler.

**Why it is here:** The controller constructs and registers it at /download. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.handler.DownloadHandler where DownloadHandler is used.

<a id="filecontroller-l13"></a>

### Line 13 (import)

```java
import P2P.handler.UploadHandler;
```

**What it does:** Make the type P2P.handler.UploadHandler available by its short name UploadHandler. Your upload validator/parser/storage handler.

**Why it is here:** The controller constructs it for /upload with its required dependencies. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.handler.UploadHandler where UploadHandler is used.

<a id="filecontroller-l14"></a>

### Line 14 (import)

```java
import com.sun.net.httpserver.HttpServer;
```

**What it does:** Make the type com.sun.net.httpserver.HttpServer available by its short name HttpServer. The HTTP server implementation provided in the JDK jdk.httpserver module.

**Why it is here:** It binds the API endpoint and invokes registered handlers without Spring/Tomcat. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.HttpServer where HttpServer is used.

<a id="filecontroller-l15"></a>

### Line 15 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l16"></a>

### Line 16 (comment)

```java
// fileController doesn’t do the actual file sharing itself but coordinates everything:
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The controller stops HTTP/executor resources; it does not clean every pending file/listener.

<a id="filecontroller-l17"></a>

### Line 17 (comment)

```java
//Creates and starts the HTTP server
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The controller stops HTTP/executor resources; it does not clean every pending file/listener.

<a id="filecontroller-l18"></a>

### Line 18 (comment)

```java
//Registers endpoints (/upload, /download)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The controller stops HTTP/executor resources; it does not clean every pending file/listener.

<a id="filecontroller-l19"></a>

### Line 19 (comment)

```java
// Directory where uploaded files are temporarily stored
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The controller stops HTTP/executor resources; it does not clean every pending file/listener.

<a id="filecontroller-l20"></a>

### Line 20 (comment)

```java
//Manages threads and cleanup
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare FileController and open its class body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The controller stops HTTP/executor resources; it does not clean every pending file/listener.

<a id="filecontroller-l21"></a>

### Line 21 (code)

```java
public class FileController {
```

**What it does:** Declare FileController and open its class body.

**Why it is here:** This type encapsulates the resources needed for the API lifecycle.

**Example / read it aloud:** The name Controller is a folder/package convention; no Spring annotation or dependency injection framework is used.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l22"></a>

### Line 22 (code)

```java
    private final FileSharer fileSharer;
```

**What it does:** Declare a private field holding a FileSharer reference that can be assigned once.

**Why it is here:** Both HTTP handlers need one shared registry of pending file paths and PINs. private hides the field; final prevents reference reassignment.

**Example / read it aloud:** final does not freeze the FileSharer maps; entries may still change.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l23"></a>

### Line 23 (code)

```java
    private final HttpServer httpServer;
```

**What it does:** Declare a private final reference to the JDK HttpServer.

**Why it is here:** start and stop must operate on the same configured server object.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l24"></a>

### Line 24 (code)

```java
    private final String uploadDir;
```

**What it does:** Declare a private final String holding the upload-directory path.

**Why it is here:** The controller computes the destination once and passes it to UploadHandler.

**Example / read it aloud:** This is a path string, not the actual file bytes.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l25"></a>

### Line 25 (code)

```java
    private final ExecutorService executorService;
```

**What it does:** Declare the private final ExecutorService reference.

**Why it is here:** The executor owns worker scheduling and must also be available during shutdown.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l26"></a>

### Line 26 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l27"></a>

### Line 27 (code)

```java
    public FileController(int port) throws IOException {
```

**What it does:** Declare a public constructor receiving an integer port; allow IOException to propagate.

**Why it is here:** new FileController(port) calls this once to build the object. Server creation may throw checked I/O errors, which App catches.

**Example / read it aloud:** A constructor has the same name as its class and no return type.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. throws: Declare that a checked exception may propagate to the caller. This is not an exception handler. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l28"></a>

### Line 28 (code)

```java
        this.fileSharer = new FileSharer();
```

**What it does:** Construct an empty FileSharer and assign it to this object's field.

**Why it is here:** This is the shared notebook subsequently passed to both handlers.

**Example / read it aloud:** this identifies the FileController being constructed.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. this: The current object. this.field distinguishes an instance field from a same-named parameter. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filecontroller-l29"></a>

### Line 29 (code)

```java
        this.httpServer = HttpServer.create(new InetSocketAddress(port), 0); /* a lightweight HTTP server built into
```

**What it does:** Create an HttpServer bound to the supplied InetSocketAddress; pass backlog 0 for the system default.

**Why it is here:** The server needs an address and port before it can accept HTTP connections. InetSocketAddress(port) uses a wildcard local address.

**Example / read it aloud:** port 8081 creates the API endpoint; port 0 requests an OS-selected port.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. this: The current object. this.field distinguishes an instance field from a same-named parameter. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** The second argument is connection backlog, not worker count. create binds/configures; start begins processing.

<a id="filecontroller-l30"></a>

### Line 30 (comment)

```java
         Java SE (no need for Spring Boot or Tomcat). Handles HTTP requests/responses */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Build a directory string from the JVM's temp path, the platform separator and SkyLink-uploads.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filecontroller-l31"></a>

### Line 31 (code)

```java
        this.uploadDir = System.getProperty("java.io.tmpdir") + File.separator + "SkyLink-uploads"; /* 1. java.io.tmpdir → OS temporary directory
```

**What it does:** Build a directory string from the JVM's temp path, the platform separator and SkyLink-uploads.

**Why it is here:** Temporary uploads need a predictable managed subdirectory rather than storage in the repository.

**Example / read it aloud:** On Windows this could be C:\...\Temp\SkyLink-uploads; File.separator is \ there.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** java.io.tmpdir is a JVM property and can be overridden; temporary location does not guarantee automatic deletion.

<a id="filecontroller-l32"></a>

### Line 32 (comment)

```java
        2. File.separator → ensures correct / or \ depending on OS */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 33: Create an ExecutorService with a fixed pool of ten request worker threads.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filecontroller-l33"></a>

### Line 33 (code)

```java
        this.executorService = Executors.newFixedThreadPool(10); /* Creates 10 threads to handle multiple HTTP requests at the same time.
```

**What it does:** Create an ExecutorService with a fixed pool of ten request worker threads.

**Why it is here:** A blocking handler can occupy a worker while other requests use the remaining workers.

**Example / read it aloud:** Up to ten HTTP tasks execute concurrently.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** The task queue is unbounded; this does not prevent overload and does not govern raw new Thread calls elsewhere. Ten HTTP workers can improve concurrency but do not guarantee overload protection; the queue and independent file threads remain unbounded.

<a id="filecontroller-l34"></a>

### Line 34 (comment)

```java
         Prevents the server from freezing under load. */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 37: Construct a File object describing the upload directory path.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Ten HTTP workers can improve concurrency but do not guarantee overload protection; the queue and independent file threads remain unbounded.

<a id="filecontroller-l35"></a>

### Line 35 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l36"></a>

### Line 36 (comment)

```java
        // if the directory is not available , we are creating a directory to store file temporary
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 37: Construct a File object describing the upload directory path.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filecontroller-l37"></a>

### Line 37 (code)

```java
        File uploadDirs = new File(uploadDir);
```

**What it does:** Construct a File object describing the upload directory path.

**Why it is here:** File supplies exists/mkdirs methods used by the following setup code.

**Example / read it aloud:** new File(path) represents a path; it does not create anything on disk.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filecontroller-l38"></a>

### Line 38 (code)

```java
        if (!uploadDirs.exists()) {
```

**What it does:** Check whether that path currently does not exist.

**Why it is here:** Only missing paths trigger the directory-creation branch. ! negates the boolean exists result.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. !: Logical NOT: true becomes false and false becomes true.

<a id="filecontroller-l39"></a>

### Line 39 (code)

```java
            uploadDirs.mkdirs();
```

**What it does:** Attempt to create the directory and any missing parent directories.

**Why it is here:** FileOutputStream cannot save uploads into a nonexistent parent folder.

**Example / read it aloud:** mkdirs differs from mkdir by also attempting parent directories.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** The boolean return is ignored; existing nondirectory paths and creation failure are not checked here.

<a id="filecontroller-l40"></a>

### Line 40 (brace)

```java
        }
```

**What it does:** Close the block opened on line 38: if (!uploadDirs.exists()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 38's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l41"></a>

### Line 41 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l42"></a>

### Line 42 (comment)

```java
        // here we are setting up the routes
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 43: Register the /upload context with a new UploadHandler receiving the directory and shared FileSharer.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filecontroller-l43"></a>

### Line 43 (code)

```java
        httpServer.createContext("/upload", new UploadHandler(uploadDir, fileSharer)); // Handles file uploads and saves them to uploadDir/
```

**What it does:** Register the /upload context with a new UploadHandler receiving the directory and shared FileSharer.

**Why it is here:** HttpServer must know which object handles upload exchanges and that object needs its storage/state dependencies.

**Example / read it aloud:** createContext is path-prefix registration; it is not a Spring controller mapping.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l44"></a>

### Line 44 (code)

```java
        httpServer.createContext("/download", new DownloadHandler(fileSharer)); // serving the files
```

**What it does:** Register /download with a DownloadHandler receiving the same FileSharer object.

**Why it is here:** Downloads must see the PIN/file associations created by uploads.

**Example / read it aloud:** Two handlers, one common registry.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l45"></a>

### Line 45 (code)

```java
        httpServer.createContext("/", new CORSHandler()); /* manages CORS headers (allowing requests from browsers) */
```

**What it does:** Register / with a CORSHandler fallback.

**Why it is here:** Unmatched ordinary paths receive 404, and root preflight requests can receive the CORS response.

**Example / read it aloud:** More-specific upload/download contexts take precedence.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** This root handler does not perform file transfer or provide a readiness check.

<a id="filecontroller-l46"></a>

### Line 46 (code)

```java
        httpServer.setExecutor(executorService); /* Assigns your thread pool to process requests concurrently.
```

**What it does:** Assign the ten-worker executor to the HTTP server.

**Why it is here:** Creating an executor is not enough; this connects request dispatch to that scheduler.

**Example / read it aloud:** Calls to the handlers' handle method are scheduled by this executor.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** The cap concerns concurrently executing HTTP tasks, not total submitted requests or all service threads.

<a id="filecontroller-l47"></a>

### Line 47 (comment)

```java
        basically telling the server , hey we can take at most 10 request at a time. */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare the public start method with no return value.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The cap concerns concurrently executing HTTP tasks, not total submitted requests or all service threads.

<a id="filecontroller-l48"></a>

### Line 48 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l49"></a>

### Line 49 (brace)

```java
    }
```

**What it does:** Close the block opened on line 27: public FileController(int port) throws IOException {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 27's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l50"></a>

### Line 50 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l51"></a>

### Line 51 (code)

```java
    public void start() {
```

**What it does:** Declare the public start method with no return value.

**Why it is here:** App uses this lifecycle method after construction.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l52"></a>

### Line 52 (code)

```java
        httpServer.start(); // httpServer.start() → begins listening for HTTP requests.
```

**What it does:** Start HTTP server processing.

**Why it is here:** The configured contexts/executor now service requests.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l53"></a>

### Line 53 (code)

```java
        System.out.println("API server started on port " + httpServer.getAddress().getPort());
```

**What it does:** Print the server's actual bound port.

**Why it is here:** getAddress().getPort() also works when port 0 was used and the OS picked a port.

**Example / read it aloud:** This log reports the bound endpoint, not merely the constructor input.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filecontroller-l54"></a>

### Line 54 (brace)

```java
    }
```

**What it does:** Close the block opened on line 51: public void start() {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 51's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l55"></a>

### Line 55 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filecontroller-l56"></a>

### Line 56 (code)

```java
    public void stop() {
```

**What it does:** Declare the public stop method.

**Why it is here:** The shutdown hook needs a place to stop the owned HTTP resources.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l57"></a>

### Line 57 (comment)

```java
        //httpServer.stop(0) → stops the server immediately (no delay).
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 58: Stop the HTTP server with a zero-second delay.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filecontroller-l58"></a>

### Line 58 (code)

```java
        httpServer.stop(0);
```

**What it does:** Stop the HTTP server with a zero-second delay.

**Why it is here:** The service stops accepting exchanges and closes according to this immediate shutdown request.

**Example / read it aloud:** 0 here is a stop delay; it has a different meaning from create's backlog 0.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** This does not close all independent per-file ServerSockets or delete all pending files.

<a id="filecontroller-l59"></a>

### Line 59 (comment)

```java
        //executorService.shutdown() → gracefully shuts down the worker threads.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 60: Request orderly shutdown of the executor.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filecontroller-l60"></a>

### Line 60 (code)

```java
        executorService.shutdown();
```

**What it does:** Request orderly shutdown of the executor.

**Why it is here:** It rejects new submitted work but permits previously submitted tasks to finish.

**Example / read it aloud:** shutdown is not shutdownNow and does not itself wait for all tasks to terminate.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l61"></a>

### Line 61 (comment)

```java
        // just printing the confirmation statement that server is shut down.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 62: Print the API shutdown message.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filecontroller-l62"></a>

### Line 62 (code)

```java
        System.out.println("API Server stopped");
```

**What it does:** Print the API shutdown message.

**Why it is here:** This is lifecycle feedback; it is not proof every file thread finished or every file was deleted.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filecontroller-l63"></a>

### Line 63 (brace)

```java
    }
```

**What it does:** Close the block opened on line 56: public void stop() {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 56's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filecontroller-l64"></a>

### Line 64 (brace)

```java
}
```

**What it does:** Close the block opened on line 21: public class FileController {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 21's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

### Pause and Check Your Understanding

**Question:** Why do upload and download need the same FileSharer?

**Answer:** Otherwise one notebook receives the upload but the downloader searches another empty notebook.

**Question:** Does new File(uploadDir) create a folder?

**Answer:** No. It creates a path object; mkdirs performs directory creation.

**Question:** Are all service threads limited to ten?

**Answer:** No. Ten executing HTTP workers are bounded; separate listener/sender threads and the HTTP task queue are not bounded by that number.

<a id="uploadutils"></a>

## UploadUtils.java

**Source:** [Utils/UploadUtils.java](../src/main/java/P2P/Utils/UploadUtils.java)

**Purpose:** Generate a random candidate port number in the dynamic/private range.

**Who calls it:** FileSharer.offerFile calls generatePort during candidate selection.

**Picture it:** Picking a numbered desk before checking whether anyone occupies it.

**Snapshot SHA-256:** `ded71f343fcd640a1b635c9b1c86fdb09d5e36c0a7d1dcb345d181dde9ef293d`

<a id="uploadutils-l1"></a>

### Line 1 (package)

```java
package P2P.Utils;
```

**What it does:** Declare that this file's types belong to the P2P.Utils package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Utils.

<a id="uploadutils-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadutils-l3"></a>

### Line 3 (import)

```java
import java.util.Random;
```

**What it does:** Make the type java.util.Random available by its short name Random. A pseudorandom number generator with bounded integer selection.

**Why it is here:** Used for candidate ports and six-digit PINs; it is not a cryptographic access-secret generator. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.Random where Random is used.

<a id="uploadutils-l4"></a>

### Line 4 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadutils-l5"></a>

### Line 5 (code)

```java
public class UploadUtils {
```

**What it does:** Declare the utility class UploadUtils.

**Why it is here:** Other classes need a named place to call the port-candidate helper.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadutils-l6"></a>

### Line 6 (code)

```java
    public static int generatePort(){
```

**What it does:** Declare a public static method returning an int, with no parameters.

**Why it is here:** static allows FileSharer to call UploadUtils.generatePort() without constructing UploadUtils.

**Example / read it aloud:** int is the returned port number; there is no network operation in the signature.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadutils-l7"></a>

### Line 7 (comment)

```java
        // these are basically unreserved ports, that are not taken by any application
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 8: Store 49152 as the first possible candidate.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Dynamic/private range does not mean unused. This helper does not inspect or reserve OS ports.

<a id="uploadutils-l8"></a>

### Line 8 (code)

```java
        int DYNAMIC_STARTING_PORT = 49152;
```

**What it does:** Store 49152 as the first possible candidate.

**Why it is here:** This is the lower bound chosen for the dynamic/private port range.

**Example / read it aloud:** The uppercase name is a naming convention; without final the local variable is not a Java constant.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadutils-l9"></a>

### Line 9 (code)

```java
        int DYNAMIC_ENDING_PORT = 65535;
```

**What it does:** Store 65535 as the last possible candidate.

**Why it is here:** The helper should include this upper port value.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadutils-l10"></a>

### Line 10 (code)

```java
        int range = (DYNAMIC_ENDING_PORT - DYNAMIC_STARTING_PORT) + 1; // inclusive
```

**What it does:** Compute the number of candidate integers: 65535 - 49152 + 1 = 16384.

**Why it is here:** The interval includes both endpoints; nextInt takes a count and excludes that count itself.

**Example / read it aloud:** There are three integers in [5,7]: 7 - 5 + 1 = 3.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="uploadutils-l11"></a>

### Line 11 (code)

```java
        Random random = new Random();
```

**What it does:** Construct a pseudorandom number generator.

**Why it is here:** nextInt needs a generator instance to select an offset.

**Example / read it aloud:** Random is suitable for demonstration candidate selection, not secret-token security.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadutils-l12"></a>

### Line 12 (comment)

```java
        // Doing this to prevent overflow, like we do in binary search
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 13: Pick an offset from 0 through 16383, add 49152, and return the candidate.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The +1 makes the range inclusive. This fixed calculation is not a binary-search overflow prevention technique.

<a id="uploadutils-l13"></a>

### Line 13 (code)

```java
        return DYNAMIC_STARTING_PORT + random.nextInt(range);
```

**What it does:** Pick an offset from 0 through 16383, add 49152, and return the candidate.

**Why it is here:** Adding the offset shifts a zero-based choice into the desired port interval.

**Example / read it aloud:** offset 0 -> 49152; offset 16383 -> 65535.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** These ports are not guaranteed unused by another process. The comment about overflow does not explain this calculation. The +1 makes the range inclusive. This fixed calculation is not a binary-search overflow prevention technique.

<a id="uploadutils-l14"></a>

### Line 14 (brace)

```java
    }
```

**What it does:** Close the block opened on line 6: public static int generatePort(){

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 6's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadutils-l15"></a>

### Line 15 (brace)

```java
}
```

**What it does:** Close the block opened on line 5: public class UploadUtils {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 5's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

### Pause and Check Your Understanding

**Question:** Why is +1 present in the range calculation?

**Answer:** nextInt excludes its upper bound, so 16384 choices are needed to include both 49152 and 65535.

**Question:** Does generatePort reserve the result?

**Answer:** No. It returns a number; ServerSocket binding later performs OS reservation.

**Question:** Is the binary-search overflow comment applicable?

**Answer:** No. These small fixed bounds cannot overflow int; the +1 makes the range inclusive.

<a id="multiparser"></a>

## MultiParser.java

**Source:** [Utils/MultiParser.java](../src/main/java/P2P/Utils/MultiParser.java)

**Purpose:** Extract a filename, claimed MIME type and payload bytes from a narrow single-file multipart envelope.

**Who calls it:** UploadHandler constructs MultiParser after buffering the request and calls parse().

**Picture it:** Opening a labeled package and separating its label from its contents.

**Snapshot SHA-256:** `22ec62c9905cbbb70233d7227e181f201409b4a184412c182cb41f44430208f8`

<a id="multiparser-l1"></a>

### Line 1 (package)

```java
package P2P.Utils;
```

**What it does:** Declare that this file's types belong to the P2P.Utils package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Utils.

<a id="multiparser-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l3"></a>

### Line 3 (code)

```java
public class MultiParser {
```

**What it does:** Declare MultiParser and open its body.

**Why it is here:** It groups the input, result type and parsing helpers into one object.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l4"></a>

### Line 4 (code)

```java
    private final byte[] data;
```

**What it does:** Declare a private final byte-array reference for the full request.

**Why it is here:** The parser needs the original bytes to copy binary file contents without rewriting them through text.

**Example / read it aloud:** byte[] is an array of raw 8-bit values; final fixes the reference, not every element.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l5"></a>

### Line 5 (code)

```java
    private final String boundary;
```

**What it does:** Declare the stored multipart boundary string.

**Why it is here:** Payload ending markers must use the exact boundary supplied in the HTTP Content-Type.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l6"></a>

### Line 6 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l7"></a>

### Line 7 (code)

```java
    public MultiParser(byte[] data, String boundary) {
```

**What it does:** Declare the constructor with request bytes and boundary parameters.

**Why it is here:** The handler supplies the data/context that parse will later examine.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based.

<a id="multiparser-l8"></a>

### Line 8 (code)

```java
        this.data = data;
```

**What it does:** Store the parameter data in the object's data field.

**Why it is here:** this.data disambiguates the field from the identically named argument.

**Example / read it aloud:** It stores the reference; it does not clone the byte array.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l9"></a>

### Line 9 (code)

```java
        this.boundary = boundary;
```

**What it does:** Store the boundary argument in the field.

**Why it is here:** The later parse operation can access it without another method parameter.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l10"></a>

### Line 10 (brace)

```java
    }
```

**What it does:** Close the block opened on line 7: public MultiParser(byte[] data, String boundary) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 7's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l11"></a>

### Line 11 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l12"></a>

### Line 12 (code)

```java
    public static class ParseResult {
```

**What it does:** Declare a public static nested result class.

**Why it is here:** One parse needs to return three related values as one object. static means no enclosing MultiParser instance is required to construct the result.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. class: Defines a named type and its members. A class declaration does not construct an instance. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l13"></a>

### Line 13 (code)

```java
        public final String fileName;
```

**What it does:** Declare a public final String field for the extracted filename.

**Why it is here:** UploadHandler reads result.fileName directly when selecting a stored name.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l14"></a>

### Line 14 (code)

```java
        public final byte[] fileContent;
```

**What it does:** Declare a public final byte-array field for the payload.

**Why it is here:** UploadHandler needs actual bytes to check size and write disk.

**Example / read it aloud:** The array reference is final; its contents are still mutable.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l15"></a>

### Line 15 (code)

```java
        public final String contentType;
```

**What it does:** Declare a public final String for the part's claimed MIME type.

**Why it is here:** UploadHandler compares it with the MIME allowlist.

**Example / read it aloud:** This is the file-part Content-Type, not the entire request's multipart Content-Type.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l16"></a>

### Line 16 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l17"></a>

### Line 17 (code)

```java
        public ParseResult(String fileName, byte[] fileContent, String contentType) {
```

**What it does:** Declare a constructor accepting the three result values.

**Why it is here:** parse creates a result after it has located and copied payload bytes.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based.

<a id="multiparser-l18"></a>

### Line 18 (code)

```java
            this.fileName = fileName;
```

**What it does:** Assign the filename argument to this result object.

**Why it is here:** Keeps extracted name and payload together.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l19"></a>

### Line 19 (code)

```java
            this.fileContent = fileContent;
```

**What it does:** Assign the supplied payload array reference.

**Why it is here:** The caller can read the binary content through result.fileContent.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l20"></a>

### Line 20 (code)

```java
            this.contentType = contentType;
```

**What it does:** Assign the MIME argument.

**Why it is here:** The caller can validate the claimed type independently of extension.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l21"></a>

### Line 21 (brace)

```java
        }
```

**What it does:** Close the block opened on line 17: public ParseResult(String fileName, byte[] fileContent, String contentType) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 17's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l22"></a>

### Line 22 (brace)

```java
    }
```

**What it does:** Close the block opened on line 12: public static class ParseResult {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 12's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l23"></a>

### Line 23 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l24"></a>

### Line 24 (code)

```java
    private static int findSequence(byte[] data, byte[] sequence, int startPosition) {
```

**What it does:** Declare a private static search helper returning the first index of a byte sequence at or after startPosition.

**Why it is here:** String searches are inappropriate for arbitrary binary payload boundaries. static is possible because the helper uses parameters rather than instance fields.

**Example / read it aloud:** data=[1,2,3,4], sequence=[3,4], startPosition=0 -> 2.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based.

<a id="multiparser-l25"></a>

### Line 25 (comment)

```java
        // Loop through 'data' starting from startPosition
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 26: For each candidate position, increment i until a full sequence could no longer fit.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="multiparser-l26"></a>

### Line 26 (code)

```java
        for (int i = startPosition; i <= data.length - sequence.length; i++) {
```

**What it does:** For each candidate position, increment i until a full sequence could no longer fit.

**Why it is here:** data.length - sequence.length prevents accessing beyond the final byte while comparing a candidate.

**Example / read it aloud:** With n=10 and marker length 3, last possible start is 7, so <= includes 7.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. for: Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. ++ / +=: Increment, or add then assign. A compound update is not automatically atomic between threads. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** Nested comparisons have worst-case O(n*m) time, not automatically linear.

<a id="multiparser-l27"></a>

### Line 27 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l28"></a>

### Line 28 (code)

```java
            boolean match = true; // Assume it's a match
```

**What it does:** Set match=true for this candidate before comparing any bytes.

**Why it is here:** Each candidate gets a fresh assumption; a prior mismatch must not carry over to the next position.

**Syntax on this line:** boolean: A primitive true/false value used by conditions and validation flags. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l29"></a>

### Line 29 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l30"></a>

### Line 30 (comment)

```java
            // Check if sequence matches starting from position i
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 31: Loop j from 0 through sequence.length-1.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="multiparser-l31"></a>

### Line 31 (code)

```java
            for (int j = 0; j < sequence.length; j++) {
```

**What it does:** Loop j from 0 through sequence.length-1.

**Why it is here:** Every byte in the marker must match, in order, at this candidate position.

**Example / read it aloud:** j++ moves to the next marker byte; i stays at the candidate start.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. for: Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. ++ / +=: Increment, or add then assign. A compound update is not automatically atomic between threads. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="multiparser-l32"></a>

### Line 32 (code)

```java
                if (data[i + j] != sequence[j]) {
```

**What it does:** Compare data byte at candidate offset i+j with marker byte j.

**Why it is here:** A marker match requires equality of every corresponding byte.

**Example / read it aloud:** If i=7 and j=2, compare data[9] with sequence[2].

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="multiparser-l33"></a>

### Line 33 (code)

```java
                    match = false; // Found a mismatch
```

**What it does:** Set match to false after a mismatch.

**Why it is here:** The later if(match) must not report this candidate as found.

**Syntax on this line:** ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l34"></a>

### Line 34 (code)

```java
                    break;         // Stop checking further for this i
```

**What it does:** Break out of the inner comparison loop.

**Why it is here:** Once one byte differs, comparing the remaining marker bytes cannot rescue that candidate; the outer loop will try the next i.

**Example / read it aloud:** break exits the nearest loop, not the whole method.

**Syntax on this line:** break: Exit the nearest enclosing loop/switch. Execution continues after it; this is not a method return. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l35"></a>

### Line 35 (brace)

```java
                }
```

**What it does:** Close the block opened on line 32: if (data[i + j] != sequence[j]) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 32's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l36"></a>

### Line 36 (brace)

```java
            }
```

**What it does:** Close the block opened on line 31: for (int j = 0; j < sequence.length; j++) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 31's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l37"></a>

### Line 37 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l38"></a>

### Line 38 (comment)

```java
            // If all bytes matched, return the index where it starts
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 39: Check whether all marker bytes matched at the candidate.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="multiparser-l39"></a>

### Line 39 (code)

```java
            if (match) {
```

**What it does:** Check whether all marker bytes matched at the candidate.

**Why it is here:** Only a still-true flag indicates a complete marker.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l40"></a>

### Line 40 (code)

```java
                return i;
```

**What it does:** Return candidate index i immediately.

**Why it is here:** The caller needs the first matching boundary position; later candidates need not be searched.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l41"></a>

### Line 41 (brace)

```java
            }
```

**What it does:** Close the block opened on line 39: if (match) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 39's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l42"></a>

### Line 42 (brace)

```java
        }
```

**What it does:** Close the block opened on line 26: for (int i = startPosition; i <= data.length - sequence.length; i++) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 26's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l43"></a>

### Line 43 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l44"></a>

### Line 44 (comment)

```java
        // If sequence not found anywhere, return -1
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 45: Return -1 after every candidate failed.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="multiparser-l45"></a>

### Line 45 (code)

```java
        return -1;
```

**What it does:** Return -1 after every candidate failed.

**Why it is here:** The caller can distinguish no boundary from a boundary at index 0.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l46"></a>

### Line 46 (brace)

```java
    }
```

**What it does:** Close the block opened on line 24: private static int findSequence(byte[] data, byte[] sequence, int startPosition) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 24's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l47"></a>

### Line 47 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l48"></a>

### Line 48 (code)

```java
    public ParseResult parse() {
```

**What it does:** Declare parse(), returning ParseResult or null.

**Why it is here:** UploadHandler calls this after construction to attempt extraction.

**Example / read it aloud:** The return type is a reference type; null can signal failure.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l49"></a>

### Line 49 (code)

```java
        try {
```

**What it does:** Begin a catch-protected parsing block.

**Why it is here:** Many malformed inputs or array/string errors are converted into the parser's null failure convention.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l50"></a>

### Line 50 (code)

```java
            String dataAsString = new String(data);
```

**What it does:** Decode the entire request byte array into a String using the JVM default charset.

**Why it is here:** The author uses String.indexOf to find textual header markers.

**Example / read it aloud:** This also decodes binary payload that does not need text conversion.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** It creates extra memory pressure and character positions may not equal byte offsets.

<a id="multiparser-l51"></a>

### Line 51 (code)

```java
            String fileNameMarker = "filename=\"";
```

**What it does:** Create the marker text filename=".

**Why it is here:** The parser searches for that literal multipart attribute before reading a name.

**Example / read it aloud:** The backslash in " is Java escaping: it puts a quote character inside the string.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

<a id="multiparser-l52"></a>

### Line 52 (code)

```java
            int fileNameStart = dataAsString.indexOf(fileNameMarker);
```

**What it does:** Find the first filename marker position in the decoded request.

**Why it is here:** The returned character index tells the parser where the attribute begins.

**Example / read it aloud:** No occurrence -> -1.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l53"></a>

### Line 53 (code)

```java
            if (fileNameStart == -1) return null;
```

**What it does:** Immediately return null if the filename marker is absent.

**Why it is here:** Without a filename attribute the narrow parser cannot identify its expected file part.

**Example / read it aloud:** This one-line if has no braces; only return null belongs to the condition.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="multiparser-l54"></a>

### Line 54 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l55"></a>

### Line 55 (code)

```java
            fileNameStart += fileNameMarker.length();
```

**What it does:** Advance fileNameStart past the marker itself.

**Why it is here:** The extracted name should start after filename=" rather than include it.

**Example / read it aloud:** += means fileNameStart = fileNameStart + fileNameMarker.length().

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. ++ / +=: Increment, or add then assign. A compound update is not automatically atomic between threads. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="multiparser-l56"></a>

### Line 56 (code)

```java
            int fileNameEnd = dataAsString.indexOf("\"", fileNameStart);
```

**What it does:** Find the next quote starting at fileNameStart.

**Why it is here:** That closing quote marks the end of the filename value.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

<a id="multiparser-l57"></a>

### Line 57 (code)

```java
            if (fileNameEnd == -1) return null;
```

**What it does:** Return null if there is no closing quote.

**Why it is here:** A missing closing delimiter makes the filename slice invalid.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="multiparser-l58"></a>

### Line 58 (code)

```java
            String filename = dataAsString.substring(fileNameStart, fileNameEnd);
```

**What it does:** Extract characters from start inclusive to end exclusive into filename.

**Why it is here:** substring returns the attribute value without surrounding quotes.

**Example / read it aloud:** filename="notes.txt" -> notes.txt.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l59"></a>

### Line 59 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l60"></a>

### Line 60 (code)

```java
            String contentTypeMaker = "Content-Type: ";
```

**What it does:** Define the literal part-header marker Content-Type: followed by a space.

**Why it is here:** The parser uses it to locate the file's claimed MIME type.

**Example / read it aloud:** The variable is spelled Maker, but it represents a marker string.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Exact case and spacing are assumed here.

<a id="multiparser-l61"></a>

### Line 61 (code)

```java
            int contentTypeStart = dataAsString.indexOf(contentTypeMaker, fileNameEnd);
```

**What it does:** Search for Content-Type after the filename attribute.

**Why it is here:** It intends to find the file part's type rather than an earlier envelope header.

**Example / read it aloud:** The starting search index is fileNameEnd.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** In a general multipart body a later unrelated part might satisfy this search.

<a id="multiparser-l62"></a>

### Line 62 (code)

```java
            String contentType = "application/octet-stream";
```

**What it does:** Initialize a fallback MIME type application/octet-stream.

**Why it is here:** A part without an explicit Content-Type still has a generic binary type in the result.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l63"></a>

### Line 63 (code)

```java
            if (contentTypeStart != -1) {
```

**What it does:** Only parse a MIME value if the marker search succeeded.

**Why it is here:** The fallback survives when there is no matching marker.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="multiparser-l64"></a>

### Line 64 (code)

```java
                contentTypeStart += contentTypeMaker.length();
```

**What it does:** Advance the index beyond Content-Type: .

**Why it is here:** The MIME value starts after the marker text.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. ++ / +=: Increment, or add then assign. A compound update is not automatically atomic between threads. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="multiparser-l65"></a>

### Line 65 (code)

```java
                int contentTypeEnd = dataAsString.indexOf("\r\n", contentTypeStart);
```

**What it does:** Find the carriage-return/newline ending this header line.

**Why it is here:** MIME extraction must stop at the header's line boundary.

**Example / read it aloud:** \r is carriage return; \n is newline; the two together represent HTTP-style line endings.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

<a id="multiparser-l66"></a>

### Line 66 (code)

```java
                if (contentTypeEnd > contentTypeStart) {
```

**What it does:** Check that the line terminator is located after the MIME value starts.

**Why it is here:** A missing marker (-1) or empty malformed value should not produce an invalid slice.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l67"></a>

### Line 67 (code)

```java
                    contentType = dataAsString.substring(contentTypeStart, contentTypeEnd);
```

**What it does:** Extract the header value as the claimed MIME type.

**Why it is here:** The result replaces the generic fallback only when the boundaries are usable.

**Example / read it aloud:** Content-Type: text/plain\r\n -> text/plain.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l68"></a>

### Line 68 (brace)

```java
                }
```

**What it does:** Close the block opened on line 66: if (contentTypeEnd > contentTypeStart) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 66's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l69"></a>

### Line 69 (brace)

```java
            }
```

**What it does:** Close the block opened on line 63: if (contentTypeStart != -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 63's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l70"></a>

### Line 70 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l71"></a>

### Line 71 (code)

```java
            String headerEndMarker = "\r\n\r\n";
```

**What it does:** Create the marker for a blank line: CRLF CRLF.

**Why it is here:** In a multipart part, a blank line separates part headers from payload bytes.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

<a id="multiparser-l72"></a>

### Line 72 (code)

```java
            int headerEnd = dataAsString.indexOf(headerEndMarker);
```

**What it does:** Find the first header/body separator in the decoded request.

**Why it is here:** The parser needs a start point for the payload.

**Example / read it aloud:** The first occurrence in a multi-part request may belong to another part.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l73"></a>

### Line 73 (code)

```java
            if (headerEnd == -1) return null;
```

**What it does:** Return null if that separator is missing.

**Why it is here:** The expected file-part structure is incomplete.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="multiparser-l74"></a>

### Line 74 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l75"></a>

### Line 75 (code)

```java
            int contentStart = headerEnd + headerEndMarker.length();
```

**What it does:** Move four characters past the separator to identify payload start.

**Why it is here:** The blank line itself must not be copied into the file.

**Example / read it aloud:** A four-character separator at character index 120 gives contentStart=124.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** The code later treats this character index as a byte index, which is not safe for all encodings.

<a id="multiparser-l76"></a>

### Line 76 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l77"></a>

### Line 77 (code)

```java
            byte[] boundaryBytes = ("\r\n--" + boundary + "--").getBytes();
```

**What it does:** Build the ending marker CRLF--boundary-- and encode it as bytes.

**Why it is here:** The final multipart delimiter includes two additional trailing hyphens. Byte search preserves original payload bytes.

**Example / read it aloud:** boundary=abc -> marker bytes for \r\n--abc--.

**Syntax on this line:** byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

**Actual behavior / caution:** getBytes uses default charset; protocol delimiters should use a deliberate compatible encoding.

<a id="multiparser-l78"></a>

### Line 78 (code)

```java
            int contentEnd = findSequence(data, boundaryBytes, contentStart);
```

**What it does:** Search the original request bytes for that final delimiter after contentStart.

**Why it is here:** The delimiter location identifies the exclusive end of the payload.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l79"></a>

### Line 79 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l80"></a>

### Line 80 (code)

```java
            if (contentEnd == -1) {
```

**What it does:** If the final delimiter was not found, try a nonfinal boundary marker.

**Why it is here:** The fallback allows the parser to stop at a regular separator too.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="multiparser-l81"></a>

### Line 81 (code)

```java
                boundaryBytes = ("\r\n--" + boundary).getBytes();
```

**What it does:** Build CRLF--boundary without the final trailing hyphens.

**Why it is here:** A multipart body may contain another part after this one.

**Example / read it aloud:** This fallback alone does not make the parser fully multipart-aware.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

<a id="multiparser-l82"></a>

### Line 82 (code)

```java
                contentEnd = findSequence(data, boundaryBytes, contentStart);
```

**What it does:** Repeat the byte search with the alternate delimiter.

**Why it is here:** A nonfinal matching boundary supplies contentEnd.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l83"></a>

### Line 83 (brace)

```java
            }
```

**What it does:** Close the block opened on line 80: if (contentEnd == -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 80's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l84"></a>

### Line 84 (code)

```java
            if (contentEnd == -1 || contentEnd <= contentStart) {
```

**What it does:** Reject when no boundary exists or the end is at/before the start.

**Why it is here:** A negative length cannot be copied; equal start/end is treated as invalid.

**Example / read it aloud:** || is logical OR; either bad condition rejects.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. && / ||: Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.

**Actual behavior / caution:** An empty file is rejected by contentEnd <= contentStart.

<a id="multiparser-l85"></a>

### Line 85 (code)

```java
                return null;
```

**What it does:** Return null for those invalid payload bounds.

**Why it is here:** UploadHandler maps a null result to a 400 upload response.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l86"></a>

### Line 86 (brace)

```java
            }
```

**What it does:** Close the block opened on line 84: if (contentEnd == -1 || contentEnd <= contentStart) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 84's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l87"></a>

### Line 87 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l88"></a>

### Line 88 (code)

```java
            byte[] fileContent = new byte[contentEnd - contentStart];
```

**What it does:** Allocate a new byte array sized exactly to the payload interval.

**Why it is here:** The extracted file should exclude envelope headers and the ending delimiter.

**Example / read it aloud:** contentStart=124 and contentEnd=129 -> new byte[5].

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="multiparser-l89"></a>

### Line 89 (code)

```java
            System.arraycopy(data, contentStart, fileContent, 0, fileContent.length);
```

**What it does:** Copy fileContent.length bytes from data at contentStart into the new array beginning at 0.

**Why it is here:** This is the key binary-preserving copy: file bytes come from the original byte array, not from re-encoding a String.

**Example / read it aloud:** Arguments are source array, source offset, destination array, destination offset, count.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l90"></a>

### Line 90 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l91"></a>

### Line 91 (code)

```java
            return new ParseResult(filename, fileContent, contentType);
```

**What it does:** Create and return one ParseResult containing name, payload array and MIME.

**Why it is here:** The handler needs these three results together for validation and storage.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l92"></a>

### Line 92 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="multiparser-l93"></a>

### Line 93 (code)

```java
        } catch (Exception ex) {
```

**What it does:** Catch any Exception thrown inside the parsing try block.

**Why it is here:** This catches more than IOException, including many bad indexing errors, and converts them to a null result.

**Example / read it aloud:** It does not catch Error such as OutOfMemoryError.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l94"></a>

### Line 94 (code)

```java
            System.err.println("Error parsing multipart data " + ex.getMessage());
```

**What it does:** Log the parsing exception message.

**Why it is here:** This gives a limited clue to why extraction failed.

**Example / read it aloud:** Full input is not printed.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="multiparser-l95"></a>

### Line 95 (code)

```java
            return null;
```

**What it does:** Return null after a caught failure.

**Why it is here:** The caller uses the same failure convention as missing markers.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="multiparser-l96"></a>

### Line 96 (brace)

```java
        }
```

**What it does:** Close the block opened on line 93: } catch (Exception ex) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 93's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l97"></a>

### Line 97 (brace)

```java
    }
```

**What it does:** Close the block opened on line 48: public ParseResult parse() {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 48's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l98"></a>

### Line 98 (brace)

```java
}
```

**What it does:** Close the block opened on line 3: public class MultiParser {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 3's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="multiparser-l99"></a>

### Line 99 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

### Pause and Check Your Understanding

**Question:** Why use byte comparison for the ending boundary?

**Answer:** File payload may contain arbitrary bytes, so the copy must come from the original byte array.

**Question:** What does -1 mean for indexOf/findSequence?

**Answer:** No matching marker was found; it is a sentinel, not a valid array index.

**Question:** Is a String index always a byte offset?

**Answer:** No. Non-ASCII headers can make character positions differ from byte positions; this parser mixes them.

<a id="uploadhandler"></a>

## UploadHandler.java

**Source:** [handler/UploadHandler.java](../src/main/java/P2P/handler/UploadHandler.java)

**Purpose:** Validate one multipart upload, buffer/parse it, save it and return a registered share PIN.

**Who calls it:** HttpServer calls handle for /upload; it delegates parsing to MultiParser and sharing state to FileSharer.

**Picture it:** The receiving clerk: checks the package, stores it and writes its collection code.

**Snapshot SHA-256:** `ab9f41c963a080dd25607818072a266da9f2a9fcba0b91c6050a220528082513`

<a id="uploadhandler-l1"></a>

### Line 1 (package)

```java
package P2P.handler;
```

**What it does:** Declare that this file's types belong to the P2P.handler package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.handler.

<a id="uploadhandler-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l3"></a>

### Line 3 (import)

```java
import java.io.ByteArrayOutputStream;
```

**What it does:** Make the type java.io.ByteArrayOutputStream available by its short name ByteArrayOutputStream. An expandable in-memory byte accumulator.

**Why it is here:** Upload uses it for the whole envelope; download uses it for the filename header. Memory grows with accumulated bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.ByteArrayOutputStream where ByteArrayOutputStream is used.

<a id="uploadhandler-l4"></a>

### Line 4 (import)

```java
import java.io.File;
```

**What it does:** Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.

**Why it is here:** Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.File where File is used.

<a id="uploadhandler-l5"></a>

### Line 5 (import)

```java
import java.io.FileOutputStream;
```

**What it does:** Make the type java.io.FileOutputStream available by its short name FileOutputStream. An OutputStream that writes to a disk file.

**Why it is here:** Uploads and download staging need real disk persistence. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.FileOutputStream where FileOutputStream is used.

<a id="uploadhandler-l6"></a>

### Line 6 (import)

```java
import java.io.IOException;
```

**What it does:** Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.

**Why it is here:** Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.IOException where IOException is used.

<a id="uploadhandler-l7"></a>

### Line 7 (import)

```java
import java.io.OutputStream;
```

**What it does:** Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.

**Why it is here:** HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.

<a id="uploadhandler-l8"></a>

### Line 8 (import)

```java
import java.util.UUID;
```

**What it does:** Make the type java.util.UUID available by its short name UUID. A type/factory for widely unique identifiers.

**Why it is here:** UUID.randomUUID prefixes stored names to reduce overwrite collisions. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.UUID where UUID is used.

<a id="uploadhandler-l9"></a>

### Line 9 (import)

```java
import java.util.concurrent.ConcurrentHashMap;
```

**What it does:** Make the type java.util.concurrent.ConcurrentHashMap available by its short name ConcurrentHashMap. A map supporting safe individual concurrent operations.

**Why it is here:** Several threads access registry/limiter maps; compound workflows and mutable values still require coordination. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.concurrent.ConcurrentHashMap where ConcurrentHashMap is used.

<a id="uploadhandler-l10"></a>

### Line 10 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l11"></a>

### Line 11 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l12"></a>

### Line 12 (import)

```java
import P2P.Service.FileSharer;
```

**What it does:** Make the type P2P.Service.FileSharer available by its short name FileSharer. Your shared pending-file/PIN registry and local TCP service.

**Why it is here:** Handlers coordinate through one FileSharer object; importing the name does not construct it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.Service.FileSharer where FileSharer is used.

<a id="uploadhandler-l13"></a>

### Line 13 (import)

```java
import P2P.Utils.MultiParser;
```

**What it does:** Make the type P2P.Utils.MultiParser available by its short name MultiParser. Your narrow multipart parser class.

**Why it is here:** UploadHandler delegates name/type/payload extraction to it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.Utils.MultiParser where MultiParser is used.

<a id="uploadhandler-l14"></a>

### Line 14 (import)

```java
import com.sun.net.httpserver.Headers;
```

**What it does:** Make the type com.sun.net.httpserver.Headers available by its short name Headers. The HTTP header collection type from the JDK server API.

**Why it is here:** Handlers read incoming metadata or add/set outgoing metadata. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.Headers where Headers is used.

<a id="uploadhandler-l15"></a>

### Line 15 (import)

```java
import com.sun.net.httpserver.HttpExchange;
```

**What it does:** Make the type com.sun.net.httpserver.HttpExchange available by its short name HttpExchange. One HTTP request and its response channel.

**Why it is here:** handle receives this object to inspect method/URI/headers and access body streams. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.HttpExchange where HttpExchange is used.

<a id="uploadhandler-l16"></a>

### Line 16 (import)

```java
import com.sun.net.httpserver.HttpHandler;
```

**What it does:** Make the type com.sun.net.httpserver.HttpHandler available by its short name HttpHandler. The interface with handle(HttpExchange).

**Why it is here:** implements HttpHandler allows a class to be registered as a server context handler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.HttpHandler where HttpHandler is used.

<a id="uploadhandler-l17"></a>

### Line 17 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l18"></a>

### Line 18 (code)

```java
public class UploadHandler implements HttpHandler {
```

**What it does:** Declare UploadHandler implementing HttpHandler.

**Why it is here:** The HTTP server needs the handle(HttpExchange) entry point to dispatch uploads.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance. implements: Declare conformance to an interface contract such as HttpHandler or Runnable. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l19"></a>

### Line 19 (code)

```java
    private final String uploadDir;
```

**What it does:** Declare a private final field for the upload-directory String.

**Why it is here:** Every request handled by this object uses the configured temp directory.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l20"></a>

### Line 20 (code)

```java
    private final FileSharer fileSharer;
```

**What it does:** Declare the private final shared FileSharer reference.

**Why it is here:** After saving disk bytes, this handler must register shares in the same service the downloader searches.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l21"></a>

### Line 21 (comment)

```java
    // Maximum file size: 500MB, that's the max users can upload
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 22: Define a class-wide constant long equal to 500 * 1024 * 1024 = 524288000 bytes.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The binary unit is 500 MiB; request-envelope checks include overhead.

<a id="uploadhandler-l22"></a>

### Line 22 (code)

```java
    private static final long MAX_FILE_SIZE = 500L * 1024 * 1024; // 500MB in bytes
```

**What it does:** Define a class-wide constant long equal to 500 * 1024 * 1024 = 524288000 bytes.

**Why it is here:** Size checks should use one consistent maximum, and long handles byte counts without relying on narrower arithmetic.

**Example / read it aloud:** 500L makes multiplication use long arithmetic. Technically the value is 500 MiB.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. long: A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Request-envelope checks include multipart overhead, so the maximum accepted payload can be slightly smaller. The binary unit is 500 MiB; request-envelope checks include overhead.

<a id="uploadhandler-l23"></a>

### Line 23 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l24"></a>

### Line 24 (code)

```java
    private static final int MAX_UPLOADS_PER_MINUTE = 10; // Maximum uploads allowed per minute, user can only upload 10 files per minutes.
```

**What it does:** Define the upload-attempt threshold as 10.

**Why it is here:** All limiter branches compare against a shared policy value.

**Example / read it aloud:** private limits access; static shares the value across instances; final prevents reassignment.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** This limiter counts qualifying POST attempts before later validation, not just saved files.

<a id="uploadhandler-l25"></a>

### Line 25 (code)

```java
    private static final long ONE_MINUTE_MS = 60_000; // One minute in milliseconds
```

**What it does:** Define one minute as 60000 milliseconds in a long constant.

**Why it is here:** The limiter compares timestamps measured in milliseconds.

**Example / read it aloud:** 60_000 is Java's readable numeric literal; underscore is not part of the value.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. long: A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l26"></a>

### Line 26 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l27"></a>

### Line 27 (comment)

```java
    // Allowed file extensions
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 28: Begin an array of allowed filename suffix Strings.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l28"></a>

### Line 28 (code)

```java
    private static final String[] ALLOWED_EXTENSIONS = {
```

**What it does:** Begin an array of allowed filename suffix Strings.

**Why it is here:** The extension helper loops over this list rather than spelling a separate condition for every suffix.

**Example / read it aloud:** String[] is the array type; { starts its initializer.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** final protects the array reference, not its elements.

<a id="uploadhandler-l29"></a>

### Line 29 (code)

```java
            ".txt", ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".zip", ".doc", ".docx", ".csv"
```

**What it does:** Populate the extension array with ten permitted suffixes.

**Why it is here:** It establishes which names can pass the helper: text, PDF, common images, ZIP, Office documents and CSV.

**Example / read it aloud:** Each quoted value is a String; commas separate array items.

**Syntax on this line:** .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="uploadhandler-l30"></a>

### Line 30 (code)

```java
    };
```

**What it does:** Close the extension array initializer and finish its field declaration.

**Why it is here:** }; completes the list expression and the declaration; it does not close the class.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l31"></a>

### Line 31 (comment)

```java
    //Allowed MIME (Multipurpose Internet Mail Extensions) types (security whitelist)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 32: Begin the allowed MIME-type array initializer.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l32"></a>

### Line 32 (code)

```java
    private static final String[] ALLOWED_MIME_TYPES = {
```

**What it does:** Begin the allowed MIME-type array initializer.

**Why it is here:** The part-type helper needs a separate whitelist from filename suffixes.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l33"></a>

### Line 33 (code)

```java
            "text/plain", "application/pdf", "image/jpeg", "image/png", "image/gif",
```

**What it does:** Add MIME labels for plain text, PDF, JPEG, PNG and GIF.

**Why it is here:** A .pdf extension and claimed application/pdf type are checked separately.

<a id="uploadhandler-l34"></a>

### Line 34 (code)

```java
            "application/zip", "application/x-zip-compressed", "application/x-zip", "application/octet-stream",
```

**What it does:** Add ZIP MIME variants and generic octet-stream.

**Why it is here:** Different clients can label ZIPs differently; octet-stream also supports an unspecified binary type.

**Example / read it aloud:** Allowing generic binary weakens any implication that this list validates contents.

<a id="uploadhandler-l35"></a>

### Line 35 (code)

```java
            "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
```

**What it does:** Add Word and OOXML Word MIME labels.

**Why it is here:** The .doc/.docx extensions have corresponding common metadata types.

**Syntax on this line:** .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="uploadhandler-l36"></a>

### Line 36 (code)

```java
            "text/csv"
```

**What it does:** Add text/csv as the final MIME item.

**Why it is here:** CSV uploads need a matching permitted type.

<a id="uploadhandler-l37"></a>

### Line 37 (code)

```java
    };
```

**What it does:** Finish the MIME array declaration.

**Why it is here:** The initializer is complete and the following nested class is a separate declaration.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l38"></a>

### Line 38 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l39"></a>

### Line 39 (comment)

```java
    // This class stores info about uploads for one IP
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 40: Declare a private static nested UploadInfo class.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l40"></a>

### Line 40 (code)

```java
    private static class UploadInfo {
```

**What it does:** Declare a private static nested UploadInfo class.

**Why it is here:** The per-IP map value needs a window-start timestamp and attempt counter together.

**Example / read it aloud:** static avoids an implicit UploadHandler owner reference.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. class: Defines a named type and its members. A class declaration does not construct an instance. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l41"></a>

### Line 41 (code)

```java
        long minuteWindowStart; // When the current minute started
```

**What it does:** Declare a mutable long holding the start timestamp of the active window.

**Why it is here:** The limiter decides whether a minute has elapsed using this field.

**Example / read it aloud:** It is neither final nor an atomic/volatile variable.

**Syntax on this line:** long: A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l42"></a>

### Line 42 (code)

```java
        int uploadCount;        // How many uploads so far in this minute
```

**What it does:** Declare a mutable integer attempt count.

**Why it is here:** The limiter increments this number and compares it to 10.

**Example / read it aloud:** Safe map storage does not make ++ on this field atomic.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l43"></a>

### Line 43 (code)

```java
        UploadInfo(long minuteWindowStart) {
```

**What it does:** Declare UploadInfo's constructor with a timestamp argument.

**Why it is here:** The first attempt creates a record whose window begins now.

**Syntax on this line:** long: A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l44"></a>

### Line 44 (code)

```java
            this.minuteWindowStart = minuteWindowStart;
```

**What it does:** Store the timestamp in this record's field.

**Why it is here:** Later attempts compare their current time against it.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l45"></a>

### Line 45 (code)

```java
            this.uploadCount = 1;
```

**What it does:** Initialize the counter to one, counting the first attempt.

**Why it is here:** The request creating this record must be included, rather than starting at zero and forgetting it.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l46"></a>

### Line 46 (brace)

```java
        }
```

**What it does:** Close the block opened on line 43: UploadInfo(long minuteWindowStart) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 43's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l47"></a>

### Line 47 (brace)

```java
    }
```

**What it does:** Close the block opened on line 40: private static class UploadInfo {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 40's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l48"></a>

### Line 48 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l49"></a>

### Line 49 (comment)

```java
    // This map keeps track of each IP's upload info
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Create a static final ConcurrentHashMap from IP Strings to UploadInfo objects.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l50"></a>

### Line 50 (comment)

```java
    // Key: IP address, Value: UploadInfo object
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Create a static final ConcurrentHashMap from IP Strings to UploadInfo objects.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l51"></a>

### Line 51 (code)

```java
    private static final ConcurrentHashMap<String, UploadInfo> uploadTracker = new ConcurrentHashMap<>();
```

**What it does:** Create a static final ConcurrentHashMap from IP Strings to UploadInfo objects.

**Why it is here:** Different requests/handler instances share limiter records. ConcurrentHashMap protects individual map operations.

**Example / read it aloud:** "127.0.0.1" -> UploadInfo(windowStart, count).

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. <>: Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.

**Actual behavior / caution:** It does not protect fields inside UploadInfo, atomically combine get/put, or evict unused IPs.

<a id="uploadhandler-l52"></a>

### Line 52 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l53"></a>

### Line 53 (comment)

```java
   // initializing the uploadDir and fileSharer , whatever it passed from file controller.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 54: Declare the handler constructor taking storage directory and common FileSharer.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l54"></a>

### Line 54 (code)

```java
    public UploadHandler(String uploadDir, FileSharer fileSharer) {
```

**What it does:** Declare the handler constructor taking storage directory and common FileSharer.

**Why it is here:** FileController manually supplies dependencies when it builds the upload context.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l55"></a>

### Line 55 (code)

```java
        this.uploadDir = uploadDir;
```

**What it does:** Store the directory argument in the handler field.

**Why it is here:** Local constructor parameters disappear when construction returns; the field retains configuration.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l56"></a>

### Line 56 (code)

```java
        this.fileSharer = fileSharer;
```

**What it does:** Store the shared service object reference.

**Why it is here:** Each future handle invocation needs registration and listener methods.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l57"></a>

### Line 57 (brace)

```java
    }
```

**What it does:** Close the block opened on line 54: public UploadHandler(String uploadDir, FileSharer fileSharer) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 54's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l58"></a>

### Line 58 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l59"></a>

### Line 59 (comment)

```java
    // Helper method to check if file extension is allowed
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 60: Declare a private boolean filename-extension checker.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l60"></a>

### Line 60 (code)

```java
    private boolean isAllowedExtension(String filename) {
```

**What it does:** Declare a private boolean filename-extension checker.

**Why it is here:** The main handler delegates suffix policy to a small reusable helper.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). boolean: A primitive true/false value used by conditions and validation flags. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l61"></a>

### Line 61 (code)

```java
        if (filename == null) return false;
```

**What it does:** Return false when filename is null.

**Why it is here:** The next toLowerCase call would otherwise dereference null.

**Example / read it aloud:** A one-line if controls only the return statement.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="uploadhandler-l62"></a>

### Line 62 (code)

```java
        String lower = filename.toLowerCase();
```

**What it does:** Convert filename to lowercase and store the returned String.

**Why it is here:** Case-insensitive suffix matching should accept names such as PHOTO.JPG.

**Example / read it aloud:** Strings are immutable; this creates/returns a normalized string rather than changing filename in place.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** The default locale is used; a deliberate locale is preferable for protocol-like checks.

<a id="uploadhandler-l63"></a>

### Line 63 (code)

```java
        for (String extention : ALLOWED_EXTENSIONS) {
```

**What it does:** Loop through each allowed suffix, naming the current String extention.

**Why it is here:** The misspelled variable name has no functional effect; its value is a suffix from the array.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. for: Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l64"></a>

### Line 64 (code)

```java
            if (lower.endsWith(extention)) {
```

**What it does:** Check whether the normalized filename ends with the current suffix.

**Why it is here:** Only suffix matching is intended; a .txt in the middle of a name should not suffice.

**Example / read it aloud:** notes.txt.exe does not end with .txt.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="uploadhandler-l65"></a>

### Line 65 (code)

```java
                return true;
```

**What it does:** Return true immediately after any suffix matches.

**Why it is here:** One allowed extension is enough; remaining list items need not be searched.

**Example / read it aloud:** This returns from isAllowedExtension, not from the upload handler.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l66"></a>

### Line 66 (brace)

```java
            }
```

**What it does:** Close the block opened on line 64: if (lower.endsWith(extention)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 64's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l67"></a>

### Line 67 (brace)

```java
        }
```

**What it does:** Close the block opened on line 63: for (String extention : ALLOWED_EXTENSIONS) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 63's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l68"></a>

### Line 68 (code)

```java
        return false;
```

**What it does:** Return false after no suffix matched.

**Why it is here:** The caller can reject the file as unsupported.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l69"></a>

### Line 69 (brace)

```java
    }
```

**What it does:** Close the block opened on line 60: private boolean isAllowedExtension(String filename) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 60's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l70"></a>

### Line 70 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l71"></a>

### Line 71 (comment)

```java
    // Helper method to check if MIME type is allowed
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 72: Declare a private boolean MIME-type checker.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l72"></a>

### Line 72 (code)

```java
    private boolean isAllowedMimeType(String mimeType) {
```

**What it does:** Declare a private boolean MIME-type checker.

**Why it is here:** It encapsulates the claimed part-header allowlist independently of extension checks.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). boolean: A primitive true/false value used by conditions and validation flags. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l73"></a>

### Line 73 (code)

```java
        if (mimeType == null) return false;
```

**What it does:** Return false for a null claimed MIME.

**Why it is here:** This guards later string operations.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="uploadhandler-l74"></a>

### Line 74 (code)

```java
        for (String allowed : ALLOWED_MIME_TYPES) {
```

**What it does:** Loop over each allowed MIME String.

**Why it is here:** The helper compares the incoming claim with every permitted label.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. for: Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l75"></a>

### Line 75 (code)

```java
            if (mimeType.toLowerCase().startsWith(allowed.toLowerCase())) {
```

**What it does:** Lowercase both Strings and compare using startsWith.

**Why it is here:** It makes matching case-insensitive and accepts prefixes such as an allowed type plus parameters.

**Example / read it aloud:** text/plain; charset=utf-8 starts with text/plain.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

**Actual behavior / caution:** Prefix matching also admits malformed extensions of a type name; this is not exact MIME parsing or content inspection.

<a id="uploadhandler-l76"></a>

### Line 76 (code)

```java
                return true;
```

**What it does:** Return true when any MIME prefix matches.

**Why it is here:** A matching claim passes this helper.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l77"></a>

### Line 77 (brace)

```java
            }
```

**What it does:** Close the block opened on line 75: if (mimeType.toLowerCase().startsWith(allowed.toLowerCase())) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 75's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l78"></a>

### Line 78 (brace)

```java
        }
```

**What it does:** Close the block opened on line 74: for (String allowed : ALLOWED_MIME_TYPES) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 74's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l79"></a>

### Line 79 (code)

```java
        return false;
```

**What it does:** Return false when all comparisons fail.

**Why it is here:** The main handler will send 415 for an unaccepted claimed MIME.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l80"></a>

### Line 80 (brace)

```java
    }
```

**What it does:** Close the block opened on line 72: private boolean isAllowedMimeType(String mimeType) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 72's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l81"></a>

### Line 81 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l82"></a>

### Line 82 (code)

```java
    @Override
```

**What it does:** Mark handle as the HttpHandler implementation.

**Why it is here:** The compiler checks that the method fulfills the interface.

**Syntax on this line:** Override: Compiler-checked annotation for a method overriding/implementing an inherited contract. It does not invoke the method.

<a id="uploadhandler-l83"></a>

### Line 83 (code)

```java
    public void handle(HttpExchange exchange) throws IOException {
```

**What it does:** Declare handle for one exchange, allowing IOException to propagate.

**Why it is here:** This is the callback the HTTP server invokes; request variables below are local to that invocation.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. throws: Declare that a checked exception may propagate to the caller. This is not an exception handler. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l84"></a>

### Line 84 (code)

```java
        Headers headers = exchange.getResponseHeaders();
```

**What it does:** Get the response header collection.

**Why it is here:** CORS/JSON metadata belongs on the outgoing response, not in the request body.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l85"></a>

### Line 85 (code)

```java
        headers.add("Access-Control-Allow-Origin", "*"); //This allows any website (any origin) to make requests to your server.
```

**What it does:** Add wildcard Access-Control-Allow-Origin.

**Why it is here:** The separate frontend needs permission to read a cross-origin response.

**Example / read it aloud:** This does not authorize a particular user or block nonbrowser clients.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l86"></a>

### Line 86 (code)

```java
        headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS"); //This tells browsers which HTTP methods are allowed for cross-origin requests
```

**What it does:** Advertise GET,POST,OPTIONS for CORS permission checks.

**Why it is here:** A browser preflight can inspect permitted cross-origin methods.

**Example / read it aloud:** The actual upload branch below still requires POST.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l87"></a>

### Line 87 (code)

```java
        headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization"); // This tells browsers which custom headers the frontend is allowed to send in the actual request.
```

**What it does:** Permit Content-Type and Authorization header names in preflight.

**Why it is here:** Browsers may ask permission to send those headers.

**Example / read it aloud:** Authorization is not parsed or verified by this upload handler.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l88"></a>

### Line 88 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l89"></a>

### Line 89 (comment)

```java
        // Handle CORS preflight for this route
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l90"></a>

### Line 90 (comment)

```java
        /* Without this, the browser would block your frontend’s request because it didn’t get permission from the backend.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l91"></a>

### Line 91 (comment)

```java
           So, this snippet is essential for enabling CORS in my file-sharing app.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l92"></a>

### Line 92 (comment)

```java
           Browsers send a preflight OPTIONS request when the main request is considered “non-simple. like here because we are
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l93"></a>

### Line 93 (comment)

```java
           sharing something”*/
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Check whether this request is OPTIONS.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l94"></a>

### Line 94 (code)

```java
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) { /* This line checks what type of request it is.
```

**What it does:** Check whether this request is OPTIONS.

**Why it is here:** A browser preflight asks about permission rather than uploading payload.

**Example / read it aloud:** Not every file upload requires preflight; request method, content type and headers determine that.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l95"></a>

### Line 95 (comment)

```java
          It means: “Is this an HTTP OPTIONS request?” The browser automatically sends an OPTIONS request before certain types of
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 98: Send 204 with response length -1 for no body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l96"></a>

### Line 96 (comment)

```java
          requests (like a POST with a file upload). This pre-check request is called a CORS Preflight Request.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 98: Send 204 with response length -1 for no body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l97"></a>

### Line 97 (comment)

```java
          This request does not contain any actual data, just a permission check.*/
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 98: Send 204 with response length -1 for no body.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.

<a id="uploadhandler-l98"></a>

### Line 98 (code)

```java
            exchange.sendResponseHeaders(204, -1); /* It means: “Request handled successfully, but no response body.”
```

**What it does:** Send 204 with response length -1 for no body.

**Why it is here:** The preflight needs CORS headers, not a file/text response.

**Example / read it aloud:** Sending this status does not itself exit the method; line 101 performs the return.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** sendResponseHeaders does not stop execution. The subsequent return exits handle.

<a id="uploadhandler-l99"></a>

### Line 99 (comment)

```java
            This tells the server not to send any kind of body with the response.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 101: Return immediately after the OPTIONS response.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** sendResponseHeaders does not stop execution. The subsequent return exits handle.

<a id="uploadhandler-l100"></a>

### Line 100 (comment)

```java
            Stops further code execution — because we only wanted to answer the preflight check.*/
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 101: Return immediately after the OPTIONS response.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** sendResponseHeaders does not stop execution. The subsequent return exits handle.

<a id="uploadhandler-l101"></a>

### Line 101 (code)

```java
            return;
```

**What it does:** Return immediately after the OPTIONS response.

**Why it is here:** It prevents counting/validating/storing a preflight as a file upload.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** sendResponseHeaders does not stop execution. The subsequent return exits handle.

<a id="uploadhandler-l102"></a>

### Line 102 (brace)

```java
        }
```

**What it does:** Close the block opened on line 94: if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 94's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l103"></a>

### Line 103 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l104"></a>

### Line 104 (comment)

```java
        /*because we are dealing with upload , which should be a post request, so we are checking for POST method,
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 106: Reject a method that is not POST after OPTIONS was handled.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l105"></a>

### Line 105 (comment)

```java
          if the request we received at /upload with GET method , we are not allowed that request to pass through*/
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 106: Reject a method that is not POST after OPTIONS was handled.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l106"></a>

### Line 106 (code)

```java
        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
```

**What it does:** Reject a method that is not POST after OPTIONS was handled.

**Why it is here:** An upload changes server state and expects a request body; unrelated methods must not enter that workflow.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. !: Logical NOT: true becomes false and false becomes true.

<a id="uploadhandler-l107"></a>

### Line 107 (code)

```java
            String response = "Method Not Allowed";
```

**What it does:** Store the Method Not Allowed message in a local String named response.

**Why it is here:** This branch was selected because the incoming method is not POST; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l108"></a>

### Line 108 (comment)

```java
            // first setting up the response headers
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 109: Send HTTP 405 with response.getBytes().length as the body byte count.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l109"></a>

### Line 109 (code)

```java
            exchange.sendResponseHeaders(405, response.getBytes().length);
```

**What it does:** Send HTTP 405 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l110"></a>

### Line 110 (comment)

```java
            //then setting up the response body.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 111: Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l111"></a>

### Line 111 (code)

```java
            try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l112"></a>

### Line 112 (code)

```java
                os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l113"></a>

### Line 113 (brace)

```java
            }
```

**What it does:** Close the block opened on line 111: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 111's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l114"></a>

### Line 114 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l115"></a>

### Line 115 (code)

```java
            return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the incoming method is not POST, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l116"></a>

### Line 116 (brace)

```java
        }
```

**What it does:** Close the block opened on line 106: if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 106's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l117"></a>

### Line 117 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l118"></a>

### Line 118 (comment)

```java
        // Get the user's IP address
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 119: Read the exchange's remote socket address, then its InetAddress, then its textual IP.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l119"></a>

### Line 119 (code)

```java
        String userIp = exchange.getRemoteAddress().getAddress().getHostAddress();
```

**What it does:** Read the exchange's remote socket address, then its InetAddress, then its textual IP.

**Why it is here:** The per-IP limiter needs a map key associated with the network peer.

**Example / read it aloud:** The chained dots call methods on each returned object.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Behind a proxy this may be the proxy IP, not the original user's public IP.

<a id="uploadhandler-l120"></a>

### Line 120 (code)

```java
        long currentTime = System.currentTimeMillis();
```

**What it does:** Capture the current wall-clock time in milliseconds.

**Why it is here:** The limiter compares elapsed window time using numeric timestamps.

**Example / read it aloud:** A long accommodates epoch-millisecond values too large for an int.

**Syntax on this line:** long: A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Wall-clock time can change; this is a simple window counter, not a full robust rate-limit service.

<a id="uploadhandler-l121"></a>

### Line 121 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l122"></a>

### Line 122 (comment)

```java
        // Look up this IP in our tracker map
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 123: Look up this IP's UploadInfo in the static map.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l123"></a>

### Line 123 (code)

```java
        UploadInfo info = uploadTracker.get(userIp);
```

**What it does:** Look up this IP's UploadInfo in the static map.

**Why it is here:** A null result signals no previous record; a present record supports window/count logic.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l124"></a>

### Line 124 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l125"></a>

### Line 125 (code)

```java
        if (info == null) {
```

**What it does:** Choose the first-attempt branch when no record was found.

**Why it is here:** An unseen IP needs both a start time and an initial count.

**Example / read it aloud:** The get and later put are separate operations, so concurrent first attempts can race.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="uploadhandler-l126"></a>

### Line 126 (comment)

```java
            // First upload from this IP, start a new minute window
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 127: Create a new UploadInfo starting at currentTime with count one.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l127"></a>

### Line 127 (code)

```java
            info = new UploadInfo(currentTime);
```

**What it does:** Create a new UploadInfo starting at currentTime with count one.

**Why it is here:** It records this first attempt.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l128"></a>

### Line 128 (code)

```java
            uploadTracker.put(userIp, info);
```

**What it does:** Store that record under userIp.

**Why it is here:** Future requests from the same visible IP can find it.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l129"></a>

### Line 129 (code)

```java
        } else if (currentTime - info.minuteWindowStart > ONE_MINUTE_MS) {
```

**What it does:** If a record exists, check whether more than 60000 ms have elapsed since its start.

**Why it is here:** Expired windows should reset instead of accumulating counts forever.

**Example / read it aloud:** Exactly 60000 is not > 60000, so this condition resets only after that point.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. else: The alternative branch when the preceding if condition is false. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="uploadhandler-l130"></a>

### Line 130 (comment)

```java
            // It's a new minute, reset the counter
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 131: Replace the expired window start with the current timestamp.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l131"></a>

### Line 131 (code)

```java
            info.minuteWindowStart = currentTime;
```

**What it does:** Replace the expired window start with the current timestamp.

**Why it is here:** The new window is measured from this attempt.

**Syntax on this line:** .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l132"></a>

### Line 132 (code)

```java
            info.uploadCount = 1;
```

**What it does:** Reset count to one for the current request.

**Why it is here:** The first request in the refreshed window counts.

**Syntax on this line:** .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l133"></a>

### Line 133 (code)

```java
        } else {
```

**What it does:** Begin the alternative branch for an existing, unexpired window.

**Why it is here:** Requests in the current minute increment the existing count instead of resetting it.

**Syntax on this line:** else: The alternative branch when the preceding if condition is false. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l134"></a>

### Line 134 (comment)

```java
            // Still in the same minute, increase the count
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 135: Increment uploadCount by one.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l135"></a>

### Line 135 (code)

```java
            info.uploadCount++;
```

**What it does:** Increment uploadCount by one.

**Why it is here:** Each attempt consumes one slot in the current window.

**Example / read it aloud:** x++ here updates x to x+1; it is a compound read/modify/write.

**Syntax on this line:** .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. ++ / +=: Increment, or add then assign. A compound update is not automatically atomic between threads. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** Concurrent increments of this mutable field can be lost.

<a id="uploadhandler-l136"></a>

### Line 136 (code)

```java
            if (info.uploadCount > MAX_UPLOADS_PER_MINUTE) {
```

**What it does:** Check whether the updated count exceeds ten.

**Why it is here:** The eleventh counted attempt in a sequential window is rejected; the first ten pass this gate.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="uploadhandler-l137"></a>

### Line 137 (comment)

```java
                // Too many uploads! Block this request , Rate limiting happens here
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 138: Store the Rate limit exceeded message in a local String named response.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l138"></a>

### Line 138 (code)

```java
                String response = "Rate limit exceeded: Max " + MAX_UPLOADS_PER_MINUTE + " uploads per minute you can do.";
```

**What it does:** Store the Rate limit exceeded message in a local String named response.

**Why it is here:** This branch was selected because the active window count is above MAX_UPLOADS_PER_MINUTE; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l139"></a>

### Line 139 (code)

```java
                exchange.sendResponseHeaders(429, response.getBytes().length); // 429 Too Many Requests
```

**What it does:** Send HTTP 429 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l140"></a>

### Line 140 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l141"></a>

### Line 141 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l142"></a>

### Line 142 (brace)

```java
                }
```

**What it does:** Close the block opened on line 140: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 140's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l143"></a>

### Line 143 (code)

```java
                return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the active window count is above MAX_UPLOADS_PER_MINUTE, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l144"></a>

### Line 144 (brace)

```java
            }
```

**What it does:** Close the block opened on line 136: if (info.uploadCount > MAX_UPLOADS_PER_MINUTE) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 136's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l145"></a>

### Line 145 (brace)

```java
        }
```

**What it does:** Close the block opened on line 133: } else {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 133's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l146"></a>

### Line 146 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l147"></a>

### Line 147 (comment)

```java
        // fetching out the value of content type from request body
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 148: Get incoming request headers, distinct from outgoing headers on line 84.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Content-Type is read from request headers, not extracted from the body at this point.

<a id="uploadhandler-l148"></a>

### Line 148 (code)

```java
        Headers requestHeaders = exchange.getRequestHeaders();
```

**What it does:** Get incoming request headers, distinct from outgoing headers on line 84.

**Why it is here:** Content-Type and Content-Length describe the uploaded envelope.

**Example / read it aloud:** The earlier comment saying body is inaccurate: this reads the header collection.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Content-Type is read from request headers, not extracted from the body at this point.

<a id="uploadhandler-l149"></a>

### Line 149 (code)

```java
        String contentType = null;
```

**What it does:** Initialize request contentType to null.

**Why it is here:** It remains missing unless header scanning finds Content-Type.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l150"></a>

### Line 150 (code)

```java
        for (String key : requestHeaders.keySet()) {
```

**What it does:** Loop over every request header name.

**Why it is here:** The author explicitly searches for the Content-Type key instead of a direct getFirst call.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. for: Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="uploadhandler-l151"></a>

### Line 151 (code)

```java
            if (key != null && key.equalsIgnoreCase("Content-Type")) {
```

**What it does:** Ignore null keys and compare the header name case-insensitively.

**Why it is here:** HTTP header names are not case-sensitive. && short-circuits the comparison when key is null.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. && / ||: Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.

<a id="uploadhandler-l152"></a>

### Line 152 (code)

```java
                contentType = requestHeaders.getFirst(key);
```

**What it does:** Read the first value of the matched header into contentType.

**Why it is here:** Header collections can have multiple values, but this code uses the first one.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l153"></a>

### Line 153 (code)

```java
                break;
```

**What it does:** Break out of the header-name loop after finding the type.

**Why it is here:** Further key scanning is unnecessary once contentType has been assigned.

**Syntax on this line:** break: Exit the nearest enclosing loop/switch. Execution continues after it; this is not a method return. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l154"></a>

### Line 154 (brace)

```java
            }
```

**What it does:** Close the block opened on line 151: if (key != null && key.equalsIgnoreCase("Content-Type")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 151's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l155"></a>

### Line 155 (brace)

```java
        }
```

**What it does:** Close the block opened on line 150: for (String key : requestHeaders.keySet()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 150's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l156"></a>

### Line 156 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l157"></a>

### Line 157 (comment)

```java
        //validating the value of content type , it should be multipart/form-data
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 158: Reject a missing Content-Type or one not starting with multipart/form-data.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l158"></a>

### Line 158 (code)

```java
        if (contentType == null || !contentType.startsWith("multipart/form-data")) {
```

**What it does:** Reject a missing Content-Type or one not starting with multipart/form-data.

**Why it is here:** The parser expects a multipart envelope, not arbitrary JSON/plain text.

**Example / read it aloud:** || short-circuit avoids calling startsWith on null.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. !: Logical NOT: true becomes false and false becomes true. && / ||: Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.

**Actual behavior / caution:** This literal startsWith check is case-sensitive even though some later searches lowercase the value.

<a id="uploadhandler-l159"></a>

### Line 159 (code)

```java
            String response = "Bad Request: Content-Type must be multipart/form-data";
```

**What it does:** Store the Content-Type must be multipart/form-data message in a local String named response.

**Why it is here:** This branch was selected because the expected multipart envelope type is absent; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l160"></a>

### Line 160 (code)

```java
            exchange.sendResponseHeaders(400, response.getBytes().length);
```

**What it does:** Send HTTP 400 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l161"></a>

### Line 161 (code)

```java
            try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l162"></a>

### Line 162 (code)

```java
                os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l163"></a>

### Line 163 (brace)

```java
            }
```

**What it does:** Close the block opened on line 161: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 161's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l164"></a>

### Line 164 (code)

```java
            return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the expected multipart envelope type is absent, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l165"></a>

### Line 165 (brace)

```java
        }
```

**What it does:** Close the block opened on line 158: if (contentType == null || !contentType.startsWith("multipart/form-data")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 158's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l166"></a>

### Line 166 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l167"></a>

### Line 167 (comment)

```java
        // first line of defense , if Content-Length header is available , we read that length , if grater than max , we reject
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 168: Read the first Content-Length request-header value as a String.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l168"></a>

### Line 168 (code)

```java
        String contentLength = exchange.getRequestHeaders().getFirst("Content-Length");
```

**What it does:** Read the first Content-Length request-header value as a String.

**Why it is here:** If supplied, it permits an early size check before buffering the request.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l169"></a>

### Line 169 (code)

```java
        if (contentLength != null) {
```

**What it does:** Only parse the length when the header exists.

**Why it is here:** A chunked or otherwise lengthless request can still be checked during the later read loop.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="uploadhandler-l170"></a>

### Line 170 (code)

```java
            long len = Long.parseLong(contentLength);
```

**What it does:** Convert the decimal length String into a long.

**Why it is here:** Size comparisons require a number rather than text.

**Example / read it aloud:** "524288001" -> long 524288001.

**Syntax on this line:** long: A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** A malformed numeric value throws unchecked NumberFormatException here, outside the later IOException catch.

<a id="uploadhandler-l171"></a>

### Line 171 (code)

```java
            if (len > MAX_FILE_SIZE) {
```

**What it does:** Reject if the declared request length exceeds the configured byte limit.

**Why it is here:** This avoids unnecessarily reading an already-declared oversized request.

**Example / read it aloud:** The declared length includes multipart overhead, not just extracted file bytes.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l172"></a>

### Line 172 (comment)

```java
                // Reject immediately without reading
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 173: Store the maximum file size message in a local String named response.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l173"></a>

### Line 173 (code)

```java
                String response = "File too large: Maximum file size is " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB";
```

**What it does:** Store the maximum file size message in a local String named response.

**Why it is here:** This branch was selected because the declared request byte length is over MAX_FILE_SIZE; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l174"></a>

### Line 174 (code)

```java
                exchange.sendResponseHeaders(413, response.getBytes().length);
```

**What it does:** Send HTTP 413 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l175"></a>

### Line 175 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l176"></a>

### Line 176 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l177"></a>

### Line 177 (brace)

```java
                }
```

**What it does:** Close the block opened on line 175: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 175's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l178"></a>

### Line 178 (code)

```java
                return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the declared request byte length is over MAX_FILE_SIZE, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l179"></a>

### Line 179 (brace)

```java
            }
```

**What it does:** Close the block opened on line 171: if (len > MAX_FILE_SIZE) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 171's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l180"></a>

### Line 180 (brace)

```java
        }
```

**What it does:** Close the block opened on line 169: if (contentLength != null) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 169's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l181"></a>

### Line 181 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l182"></a>

### Line 182 (code)

```java
        try {
```

**What it does:** Begin the upload-processing try that catches IOException at line 288.

**Why it is here:** Request reading, disk writing and response writing may fail.

**Example / read it aloud:** Earlier method/type/rate/header-length operations are outside this try.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l183"></a>

### Line 183 (comment)

```java
            // Boundary extraction from Content-Type
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 184: Lowercase the request Content-Type and locate boundary=.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l184"></a>

### Line 184 (code)

```java
            int bIdx = contentType.toLowerCase().indexOf("boundary=");
```

**What it does:** Lowercase the request Content-Type and locate boundary=.

**Why it is here:** The parser needs the delimiter text after that parameter name.

**Example / read it aloud:** indexOf returns a character index or -1.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l185"></a>

### Line 185 (code)

```java
            if (bIdx == -1) {
```

**What it does:** Reject when boundary= was not found.

**Why it is here:** A multipart type alone is insufficient without the delimiter used in the body.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="uploadhandler-l186"></a>

### Line 186 (code)

```java
                String response = "Bad Request: boundary missing in Content-Type";
```

**What it does:** Store the boundary missing message in a local String named response.

**Why it is here:** This branch was selected because no boundary parameter was found in the envelope Content-Type; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l187"></a>

### Line 187 (code)

```java
                exchange.sendResponseHeaders(400, response.getBytes().length);
```

**What it does:** Send HTTP 400 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l188"></a>

### Line 188 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l189"></a>

### Line 189 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l190"></a>

### Line 190 (brace)

```java
                }
```

**What it does:** Close the block opened on line 188: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 188's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l191"></a>

### Line 191 (code)

```java
                return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because no boundary parameter was found in the envelope Content-Type, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l192"></a>

### Line 192 (brace)

```java
            }
```

**What it does:** Close the block opened on line 185: if (bIdx == -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 185's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l193"></a>

### Line 193 (code)

```java
            String boundary = contentType.substring(bIdx + 9).trim();
```

**What it does:** Take the substring after the nine characters boundary= and trim surrounding whitespace.

**Why it is here:** The header parameter label is not part of the delimiter value.

**Example / read it aloud:** multipart/form-data; boundary=abc -> abc.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="uploadhandler-l194"></a>

### Line 194 (code)

```java
            int scIdx = boundary.indexOf(';');
```

**What it does:** Find a semicolon within the remaining boundary text.

**Why it is here:** Another Content-Type parameter may follow the boundary.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l195"></a>

### Line 195 (code)

```java
            if (scIdx != -1) boundary = boundary.substring(0, scIdx).trim();
```

**What it does:** If that semicolon exists, keep only the preceding trimmed text.

**Why it is here:** A later parameter must not become part of the delimiter.

**Example / read it aloud:** abc; charset=utf-8 -> abc.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

**Actual behavior / caution:** This is a simple parser and does not account for every quoted parameter case.

<a id="uploadhandler-l196"></a>

### Line 196 (code)

```java
            if (boundary.startsWith("\"") && boundary.endsWith("\"")) {
```

**What it does:** Check whether the value has a quote at both ends.

**Why it is here:** HTTP parameters may quote their value; those outer quotes are envelope syntax, not delimiter bytes.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. && / ||: Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

<a id="uploadhandler-l197"></a>

### Line 197 (code)

```java
                boundary = boundary.substring(1, boundary.length() - 1);
```

**What it does:** Remove the first and last quote characters by substring.

**Why it is here:** The body delimiter should match the unquoted boundary value.

**Example / read it aloud:** "abc" -> abc; the Java escaped quote literal tests one quote character.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l198"></a>

### Line 198 (brace)

```java
            }
```

**What it does:** Close the block opened on line 196: if (boundary.startsWith("\"") && boundary.endsWith("\"")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 196's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l199"></a>

### Line 199 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l200"></a>

### Line 200 (comment)

```java
            // Check 2: Read request body with size limit (second line of defense)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 201: Create a ByteArrayOutputStream named baos that accumulates request bytes in heap memory.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l201"></a>

### Line 201 (code)

```java
            ByteArrayOutputStream baos = new ByteArrayOutputStream(); // array of bytes which can be acted as a stream, you can apply streams operation like reading.
```

**What it does:** Create a ByteArrayOutputStream named baos that accumulates request bytes in heap memory.

**Why it is here:** The custom parser accepts a complete byte array, so the handler collects the whole request first.

**Example / read it aloud:** It is an expandable in-memory output accumulator, not a network input stream.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Memory grows with the request; later copies add to peak heap use.

<a id="uploadhandler-l202"></a>

### Line 202 (code)

```java
            byte[] buffer = new byte[8192];
```

**What it does:** Allocate a reusable 8192-byte request-read buffer.

**Why it is here:** The handler reads the network stream in chunks rather than one byte per call.

**Example / read it aloud:** 8192 bytes = 8 KiB; baos still retains all accepted chunks.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l203"></a>

### Line 203 (code)

```java
            int bytesRead;
```

**What it does:** Declare the actual byte count returned by each request read.

**Why it is here:** The last chunk can be smaller than buffer capacity.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l204"></a>

### Line 204 (code)

```java
            long totalBytesRead = 0;
```

**What it does:** Initialize a long totalBytesRead counter to zero.

**Why it is here:** The stream limit must work even when Content-Length was absent or untrustworthy.

**Syntax on this line:** long: A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l205"></a>

### Line 205 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l206"></a>

### Line 206 (code)

```java
            while ((bytesRead = exchange.getRequestBody().read(buffer)) != -1) {
```

**What it does:** Read a request-body chunk into buffer, assign bytesRead and loop until read returns -1.

**Why it is here:** exchange.getRequestBody() is the incoming upload stream; -1 means EOF.

**Example / read it aloud:** A read count of 3000 means only the first 3000 buffer bytes are valid for this iteration.

**Syntax on this line:** while: Repeat while a condition is true; test it before each iteration. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="uploadhandler-l207"></a>

### Line 207 (code)

```java
                totalBytesRead += bytesRead;
```

**What it does:** Add the latest actual read count to the running total.

**Why it is here:** Cumulative size, not just chunk capacity, determines whether the request is too large.

**Example / read it aloud:** += is add then assign.

**Syntax on this line:** ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. ++ / +=: Increment, or add then assign. A compound update is not automatically atomic between threads. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="uploadhandler-l208"></a>

### Line 208 (code)

```java
                if (totalBytesRead > MAX_FILE_SIZE) {
```

**What it does:** Reject when cumulative request bytes exceed the limit.

**Why it is here:** A stream without an oversized declaration must still be bounded.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l209"></a>

### Line 209 (code)

```java
                    String response = "File too large: Maximum file size is " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB";
```

**What it does:** Store the maximum file size message in a local String named response.

**Why it is here:** This branch was selected because the bytes actually read exceed the request-size cap; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l210"></a>

### Line 210 (code)

```java
                    exchange.sendResponseHeaders(413, response.getBytes().length);
```

**What it does:** Send HTTP 413 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l211"></a>

### Line 211 (code)

```java
                    try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l212"></a>

### Line 212 (code)

```java
                        os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l213"></a>

### Line 213 (brace)

```java
                    }
```

**What it does:** Close the block opened on line 211: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 211's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l214"></a>

### Line 214 (code)

```java
                    return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the bytes actually read exceed the request-size cap, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l215"></a>

### Line 215 (brace)

```java
                }
```

**What it does:** Close the block opened on line 208: if (totalBytesRead > MAX_FILE_SIZE) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 208's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l216"></a>

### Line 216 (code)

```java
                baos.write(buffer, 0, bytesRead);
```

**What it does:** Append bytesRead valid bytes from buffer offset zero into baos.

**Why it is here:** The parser needs every accepted envelope byte without stale bytes from short reads.

**Example / read it aloud:** This increases the accumulator's size; it does not write the file to disk yet.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l217"></a>

### Line 217 (brace)

```java
            }
```

**What it does:** Close the block opened on line 206: while ((bytesRead = exchange.getRequestBody().read(buffer)) != -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 206's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l218"></a>

### Line 218 (code)

```java
            byte[] requestData = baos.toByteArray();
```

**What it does:** Copy accumulated request bytes into a new byte array requestData.

**Why it is here:** MultiParser's constructor takes byte[] rather than an InputStream.

**Example / read it aloud:** toByteArray returns a copy, so the accumulator and returned array can coexist in memory.

**Syntax on this line:** byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l219"></a>

### Line 219 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l220"></a>

### Line 220 (code)

```java
            MultiParser multiParser = new MultiParser(requestData, boundary);
```

**What it does:** Construct a MultiParser for this complete requestData and extracted boundary.

**Why it is here:** The handler delegates envelope decoding/extraction to a separate class.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l221"></a>

### Line 221 (code)

```java
            MultiParser.ParseResult result = multiParser.parse();
```

**What it does:** Call parse() and store its nullable nested ParseResult.

**Why it is here:** The result carries the filename, payload array and claimed MIME; null means extraction failed.

**Example / read it aloud:** MultiParser.ParseResult names the nested type.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l222"></a>

### Line 222 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l223"></a>

### Line 223 (code)

```java
            if (result == null) {
```

**What it does:** Check whether parsing returned null.

**Why it is here:** Later field reads would dereference null, and malformed envelope data should not be stored.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="uploadhandler-l224"></a>

### Line 224 (code)

```java
                String response = "Bad request: Could not parse file content";
```

**What it does:** Store the Could not parse file content message in a local String named response.

**Why it is here:** This branch was selected because the multipart parser could not extract a usable file result; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l225"></a>

### Line 225 (code)

```java
                exchange.sendResponseHeaders(400, response.getBytes().length);
```

**What it does:** Send HTTP 400 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l226"></a>

### Line 226 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l227"></a>

### Line 227 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l228"></a>

### Line 228 (brace)

```java
                }
```

**What it does:** Close the block opened on line 226: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 226's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l229"></a>

### Line 229 (code)

```java
                return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the multipart parser could not extract a usable file result, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l230"></a>

### Line 230 (brace)

```java
            }
```

**What it does:** Close the block opened on line 223: if (result == null) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 223's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l231"></a>

### Line 231 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l232"></a>

### Line 232 (comment)

```java
            // Check 3: Validate actual file content size (third line of defense)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 233: If fileContent exists, reject when its extracted length exceeds the cap.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l233"></a>

### Line 233 (code)

```java
            if (result.fileContent != null && result.fileContent.length > MAX_FILE_SIZE) {
```

**What it does:** If fileContent exists, reject when its extracted length exceeds the cap.

**Why it is here:** This is a defensive payload-size check after the earlier envelope-size checks.

**Example / read it aloud:** && avoids accessing .length when fileContent is null.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. && / ||: Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.

**Actual behavior / caution:** It does not explicitly reject a null payload; the current parser normally returns a nonnull array on success.

<a id="uploadhandler-l234"></a>

### Line 234 (code)

```java
                String response = "File too large: Maximum file size is " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB";
```

**What it does:** Store the maximum file size message in a local String named response.

**Why it is here:** This branch was selected because the extracted file payload exceeds MAX_FILE_SIZE; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l235"></a>

### Line 235 (code)

```java
                exchange.sendResponseHeaders(413, response.getBytes().length);
```

**What it does:** Send HTTP 413 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l236"></a>

### Line 236 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l237"></a>

### Line 237 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l238"></a>

### Line 238 (brace)

```java
                }
```

**What it does:** Close the block opened on line 236: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 236's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l239"></a>

### Line 239 (code)

```java
                return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the extracted file payload exceeds MAX_FILE_SIZE, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l240"></a>

### Line 240 (brace)

```java
            }
```

**What it does:** Close the block opened on line 233: if (result.fileContent != null && result.fileContent.length > MAX_FILE_SIZE) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 233's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l241"></a>

### Line 241 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l242"></a>

### Line 242 (code)

```java
            String filename = result.fileName;
```

**What it does:** Read the result's filename into a local String.

**Why it is here:** Naming and extension validation follow parsing.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l243"></a>

### Line 243 (code)

```java
            if (filename == null || filename.trim().isEmpty()) {
```

**What it does:** Check whether the name is null or becomes empty after trimming.

**Why it is here:** An absent/blank client filename needs a fallback before name-based checks.

**Example / read it aloud:** || short-circuits to avoid trim on null.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. && / ||: Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.

<a id="uploadhandler-l244"></a>

### Line 244 (code)

```java
                filename = "deafult.txt";
```

**What it does:** Use the literal fallback deafult.txt.

**Why it is here:** It supplies a .txt name when the extracted one is missing/blank.

**Example / read it aloud:** The misspelling is in the actual stored fallback string; it has no special Java meaning.

**Syntax on this line:** .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l245"></a>

### Line 245 (brace)

```java
            }
```

**What it does:** Close the block opened on line 243: if (filename == null || filename.trim().isEmpty()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 243's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l246"></a>

### Line 246 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l247"></a>

### Line 247 (comment)

```java
            // Check 4: Validate file extension (block executables and malicious files)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 248: Reject if the filename does not match an allowed extension.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Suffix validation cannot prove that a permitted-named file is not malicious.

<a id="uploadhandler-l248"></a>

### Line 248 (code)

```java
            if (!isAllowedExtension(filename)) {
```

**What it does:** Reject if the filename does not match an allowed extension.

**Why it is here:** Executables/other unlisted suffixes should not pass the naming policy.

**Example / read it aloud:** ! flips the helper's boolean.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. !: Logical NOT: true becomes false and false becomes true.

**Actual behavior / caution:** This cannot establish that an allowed-named payload is harmless. Suffix validation cannot prove that a permitted-named file is not malicious.

<a id="uploadhandler-l249"></a>

### Line 249 (code)

```java
                String response = "File type not allowed. Allowed extensions: .txt, .pdf, .jpg, .jpeg, .png, .gif, .zip, .doc, .docx, .csv Only";
```

**What it does:** Store the allowed file extensions message in a local String named response.

**Why it is here:** This branch was selected because the filename suffix is not on ALLOWED_EXTENSIONS; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l250"></a>

### Line 250 (code)

```java
                exchange.sendResponseHeaders(415, response.getBytes().length); // 415 Unsupported Media Type
```

**What it does:** Send HTTP 415 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l251"></a>

### Line 251 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l252"></a>

### Line 252 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l253"></a>

### Line 253 (brace)

```java
                }
```

**What it does:** Close the block opened on line 251: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 251's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l254"></a>

### Line 254 (code)

```java
                return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the filename suffix is not on ALLOWED_EXTENSIONS, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l255"></a>

### Line 255 (brace)

```java
            }
```

**What it does:** Close the block opened on line 248: if (!isAllowedExtension(filename)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 248's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l256"></a>

### Line 256 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l257"></a>

### Line 257 (comment)

```java
            // Check 5: Validate MIME type from multipart Content-Type (extra safety layer)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 258: Copy the claimed file-part MIME type from the parser result.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="uploadhandler-l258"></a>

### Line 258 (code)

```java
            String fileMimeType = result.contentType;
```

**What it does:** Copy the claimed file-part MIME type from the parser result.

**Why it is here:** This is different from the multipart envelope type checked before parsing.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l259"></a>

### Line 259 (code)

```java
            if (!isAllowedMimeType(fileMimeType)) {
```

**What it does:** Reject if that claim fails the MIME helper.

**Why it is here:** The application applies both extension and MIME policy before writing disk.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. !: Logical NOT: true becomes false and false becomes true.

<a id="uploadhandler-l260"></a>

### Line 260 (code)

```java
                String response = "MIME type not allowed. Allowed types: text/plain, application/pdf, image/jpeg, image/png, image/gif, application/zip, application/octet-stream, application/msword, text/csv";
```

**What it does:** Store the allowed MIME types message in a local String named response.

**Why it is here:** This branch was selected because the claimed part Content-Type is not accepted by ALLOWED_MIME_TYPES; the next lines send that one error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** A local response declared inside this branch is different from response variables in other branches.

<a id="uploadhandler-l261"></a>

### Line 261 (code)

```java
                exchange.sendResponseHeaders(415, response.getBytes().length);
```

**What it does:** Send HTTP 415 with response.getBytes().length as the body byte count.

**Why it is here:** The client needs the error status and encoded body length before the body is written.

**Example / read it aloud:** getBytes encodes text; .length is the resulting byte-array length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l262"></a>

### Line 262 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire this error response's OutputStream in try-with-resources.

**Why it is here:** The handler must write the body and close its stream even if writing fails.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l263"></a>

### Line 263 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Encode the response String and write those bytes to the error body.

**Why it is here:** Headers alone do not send the promised error text.

**Example / read it aloud:** The same default charset is used for the length and body conversion.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l264"></a>

### Line 264 (brace)

```java
                }
```

**What it does:** Close the block opened on line 262: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 262's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l265"></a>

### Line 265 (code)

```java
                return;
```

**What it does:** Return from handle after sending this rejection.

**Why it is here:** Because the claimed part Content-Type is not accepted by ALLOWED_MIME_TYPES, this request must not reach subsequent parsing, disk storage or share registration.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l266"></a>

### Line 266 (brace)

```java
            }
```

**What it does:** Close the block opened on line 259: if (!isAllowedMimeType(fileMimeType)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 259's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l267"></a>

### Line 267 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l268"></a>

### Line 268 (code)

```java
            String uniqueFileName = UUID.randomUUID() + "_" + new File(filename).getName();
```

**What it does:** Build a stored basename by concatenating a random UUID, underscore and the host-platform basename of filename.

**Why it is here:** Different uploads of notes.txt should not overwrite each other, and normal directory components should not become the storage path.

**Example / read it aloud:** An example is 550e8400-..._notes.txt; new File(filename).getName() extracts a basename.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** This is not full portable untrusted-name/header validation. The sender later exposes this UUID prefix.

<a id="uploadhandler-l269"></a>

### Line 269 (code)

```java
            String filePath = uploadDir + File.separator + uniqueFileName;
```

**What it does:** Join the configured upload directory, platform separator and generated basename.

**Why it is here:** The disk writer needs the full destination path.

**Example / read it aloud:** uploadDir + File.separator + uniqueFileName.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="uploadhandler-l270"></a>

### Line 270 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l271"></a>

### Line 271 (code)

```java
            try (FileOutputStream fos = new FileOutputStream(filePath)) {
```

**What it does:** Open a FileOutputStream to the chosen destination in try-with-resources.

**Why it is here:** The accepted payload must be persisted before a file listener can serve it; the stream closes automatically.

**Example / read it aloud:** Opening creates the file, or normally truncates it if already present.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l272"></a>

### Line 272 (code)

```java
                fos.write(result.fileContent);
```

**What it does:** Write the complete extracted payload array to the disk stream.

**Why it is here:** This is where the actual file bytes move from parser heap memory to the upload directory.

**Example / read it aloud:** Unlike chunked disk streaming, this write receives the entire in-memory payload array.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l273"></a>

### Line 273 (brace)

```java
            }
```

**What it does:** Close the block opened on line 271: try (FileOutputStream fos = new FileOutputStream(filePath)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 271's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l274"></a>

### Line 274 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l275"></a>

### Line 275 (code)

```java
            int port = fileSharer.offerFile(filePath , userIp);
```

**What it does:** Register the saved path and visible uploader IP, receiving the chosen port.

**Why it is here:** FileSharer needs to associate its pending share with a disk location before listener startup.

**Example / read it aloud:** offerFile does not bind or validate OS availability.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l276"></a>

### Line 276 (code)

```java
            String token = fileSharer.getToken(port); // Get the access token
```

**What it does:** Retrieve the token stored under the returned port.

**Why it is here:** The HTTP response must give the uploader a collection code.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l277"></a>

### Line 277 (code)

```java
            new Thread(() -> fileSharer.startFileServer(port)).start();
```

**What it does:** Wrap a no-argument lambda calling startFileServer(port) in a new Thread, then start it.

**Why it is here:** The listener blocks on accept; running it separately lets the upload handler return its HTTP response.

**Example / read it aloud:** port is effectively final in this scope and can be captured by the lambda.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. ->: Lambda arrow: arguments on the left, deferred task expression/body on the right.

**Actual behavior / caution:** There is no readiness signal: JSON can be returned before the listener binds, and listener failure does not undo this upload here.

<a id="uploadhandler-l278"></a>

### Line 278 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="uploadhandler-l279"></a>

### Line 279 (comment)

```java
            // Return both port and token in JSON response. because you must tell the frontend (or client) how to access that file.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 282: Construct JSON text containing a numeric port and quoted String token.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.

<a id="uploadhandler-l280"></a>

### Line 280 (comment)

```java
            //That’s what this jsonResponse block does — it sends information back to the client in a structured JSON format.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 282: Construct JSON text containing a numeric port and quoted String token.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.

<a id="uploadhandler-l281"></a>

### Line 281 (comment)

```java
            // because both port and token is required by the frontend to download the file.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 282: Construct JSON text containing a numeric port and quoted String token.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.

<a id="uploadhandler-l282"></a>

### Line 282 (code)

```java
            String jsonResponse = "{\"port\": " + port + ", \"token\": \"" + token + "\"}";
```

**What it does:** Construct JSON text containing a numeric port and quoted String token.

**Why it is here:** The browser expects structured response.data.port and response.data.token fields.

**Example / read it aloud:** With example values: {"port": 53817, "token": "482915"}. Backslashes escape quote characters in Java source.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

**Actual behavior / caution:** The current browser only needs the PIN to download; its path port is dummy 0. The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.

<a id="uploadhandler-l283"></a>

### Line 283 (code)

```java
            headers.add("Content-Type", "application/json");
```

**What it does:** Set response Content-Type to application/json.

**Why it is here:** The browser/client should interpret the success body as JSON rather than a text error.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l284"></a>

### Line 284 (code)

```java
            exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
```

**What it does:** Send success status 200 and the encoded JSON byte count.

**Why it is here:** Response headers/status must precede the actual JSON body.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l285"></a>

### Line 285 (code)

```java
            try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Obtain the success response stream with automatic closure.

**Why it is here:** The body containing the returned share data needs to be written and completed.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l286"></a>

### Line 286 (code)

```java
                os.write(jsonResponse.getBytes());
```

**What it does:** Write the JSON response bytes.

**Why it is here:** This delivers the port and token to Share.jsx after the server-side upload setup.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l287"></a>

### Line 287 (brace)

```java
            }
```

**What it does:** Close the block opened on line 285: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 285's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l288"></a>

### Line 288 (code)

```java
        } catch (IOException ex) {
```

**What it does:** Catch IOException thrown inside the upload-processing try.

**Why it is here:** Request reads, file creation/write and HTTP response writes can fail.

**Example / read it aloud:** This catch does not handle all unchecked exceptions and does not catch exceptions inside the separate listener thread.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l289"></a>

### Line 289 (code)

```java
            System.err.println("Error processing file upload: " + ex.getMessage());
```

**What it does:** Log the upload I/O failure description.

**Why it is here:** It supplies a diagnostic for failed processing.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="uploadhandler-l290"></a>

### Line 290 (code)

```java
            String response = "Server error: " + ex.getMessage();
```

**What it does:** Construct a server-error String including the exception message.

**Why it is here:** The author provides a caller-visible I/O failure response.

**Example / read it aloud:** Raw internal messages may reveal filesystem/network details.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="uploadhandler-l291"></a>

### Line 291 (code)

```java
            exchange.sendResponseHeaders(500, response.getBytes().length);
```

**What it does:** Attempt a 500 response with its text byte length.

**Why it is here:** Failures before success headers can be reported as server errors.

**Example / read it aloud:** If 200 has already been committed, a second status cannot reliably replace it.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l292"></a>

### Line 292 (code)

```java
            try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire the attempted error response stream.

**Why it is here:** The failure body needs the same resource-closure discipline as success.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="uploadhandler-l293"></a>

### Line 293 (code)

```java
                os.write(response.getBytes());
```

**What it does:** Write the error text bytes.

**Why it is here:** The caller sees the message if the response remains writable.

**Example / read it aloud:** This error path does not compensate for a saved original file or registered share.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="uploadhandler-l294"></a>

### Line 294 (brace)

```java
            }
```

**What it does:** Close the block opened on line 292: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 292's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l295"></a>

### Line 295 (brace)

```java
        }
```

**What it does:** Close the block opened on line 288: } catch (IOException ex) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 288's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l296"></a>

### Line 296 (brace)

```java
    }
```

**What it does:** Close the block opened on line 83: public void handle(HttpExchange exchange) throws IOException {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 83's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="uploadhandler-l297"></a>

### Line 297 (brace)

```java
}
```

**What it does:** Close the block opened on line 18: public class UploadHandler implements HttpHandler {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 18's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

### Pause and Check Your Understanding

**Question:** What happens after a rejected branch's return?

**Answer:** handle finishes; the later disk write and share registration do not execute for that request.

**Question:** What is the distinction between request Content-Type and result.contentType?

**Answer:** The first describes the multipart envelope; the second is the file part's claimed MIME.

**Question:** Which value is shared between upload and download handlers?

**Answer:** The same FileSharer object passed by FileController, not the local variables of one handle call.

<a id="filesharer"></a>

## FileSharer.java

**Source:** [Service/FileSharer.java](../src/main/java/P2P/Service/FileSharer.java)

**Purpose:** Own pending transfer metadata/PINs, start a per-file listener, send disk bytes and clean a consumed share.

**Who calls it:** UploadHandler calls offerFile/getToken/startFileServer; DownloadHandler calls reverse lookup/cleanup.

**Picture it:** A shared notebook plus a one-connection file-serving desk.

**Snapshot SHA-256:** `eef825eeb6111d0133e19d473a2ec3fdd5168b903dc97426971b4d8fc8eabdef`

<a id="filesharer-l1"></a>

### Line 1 (package)

```java
package P2P.Service;
```

**What it does:** Declare that this file's types belong to the P2P.Service package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.Service.

<a id="filesharer-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l3"></a>

### Line 3 (import)

```java
import P2P.Utils.UploadUtils;
```

**What it does:** Make the type P2P.Utils.UploadUtils available by its short name UploadUtils. Your static port-candidate helper.

**Why it is here:** FileSharer calls generatePort while looking for a registry key. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.Utils.UploadUtils where UploadUtils is used.

<a id="filesharer-l4"></a>

### Line 4 (import)

```java
import java.io.File;
```

**What it does:** Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.

**Why it is here:** Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.File where File is used.

<a id="filesharer-l5"></a>

### Line 5 (import)

```java
import java.io.FileInputStream;
```

**What it does:** Make the type java.io.FileInputStream available by its short name FileInputStream. An InputStream that reads from a disk file.

**Why it is here:** The TCP sender and staged HTTP copy need the original file bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.FileInputStream where FileInputStream is used.

<a id="filesharer-l6"></a>

### Line 6 (import)

```java
import java.io.IOException;
```

**What it does:** Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.

**Why it is here:** Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.IOException where IOException is used.

<a id="filesharer-l7"></a>

### Line 7 (import)

```java
import java.io.OutputStream;
```

**What it does:** Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.

**Why it is here:** HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.

<a id="filesharer-l8"></a>

### Line 8 (import)

```java
import java.net.ServerSocket;
```

**What it does:** Make the type java.net.ServerSocket available by its short name ServerSocket. A listening TCP endpoint that binds a port and accepts connections.

**Why it is here:** Each pending file creates one temporary listener. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.net.ServerSocket where ServerSocket is used.

<a id="filesharer-l9"></a>

### Line 9 (import)

```java
import java.net.Socket;
```

**What it does:** Make the type java.net.Socket available by its short name Socket. A connected TCP endpoint with input/output streams.

**Why it is here:** The download handler connects; the file listener accepts a connected Socket. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.net.Socket where Socket is used.

<a id="filesharer-l10"></a>

### Line 10 (import)

```java
import java.util.Map;
```

**What it does:** Make the type java.util.Map available by its short name Map. The general key/value map interface, including Map.Entry.

**Why it is here:** FileSharer uses Map.Entry to loop over token-map entries during reverse lookup. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.Map where Map is used.

<a id="filesharer-l11"></a>

### Line 11 (import)

```java
import java.util.Random;
```

**What it does:** Make the type java.util.Random available by its short name Random. A pseudorandom number generator with bounded integer selection.

**Why it is here:** Used for candidate ports and six-digit PINs; it is not a cryptographic access-secret generator. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.Random where Random is used.

<a id="filesharer-l12"></a>

### Line 12 (import)

```java
import java.util.concurrent.ConcurrentHashMap;
```

**What it does:** Make the type java.util.concurrent.ConcurrentHashMap available by its short name ConcurrentHashMap. A map supporting safe individual concurrent operations.

**Why it is here:** Several threads access registry/limiter maps; compound workflows and mutable values still require coordination. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.util.concurrent.ConcurrentHashMap where ConcurrentHashMap is used.

<a id="filesharer-l13"></a>

### Line 13 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l14"></a>

### Line 14 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l15"></a>

### Line 15 (comment)

```java
/* FileSharer is a service class that:
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.

<a id="filesharer-l16"></a>

### Line 16 (comment)

```java
Keeps track of which files are available for sharing.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.

<a id="filesharer-l17"></a>

### Line 17 (comment)

```java
Assigns a unique port and access token for each file.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.

<a id="filesharer-l18"></a>

### Line 18 (comment)

```java
Handles the logic for sending a file to a client using a temporary socket server.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.

<a id="filesharer-l19"></a>

### Line 19 (comment)

```java
Cleans up once a file has been sent.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.

<a id="filesharer-l20"></a>

### Line 20 (comment)

```java
It’s essentially managing a small, temporary file-serving network node. */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 21: Declare the public FileSharer class.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.

<a id="filesharer-l21"></a>

### Line 21 (code)

```java
public class FileSharer {
```

**What it does:** Declare the public FileSharer class.

**Why it is here:** Both HTTP handlers need to call this common state/service object.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l22"></a>

### Line 22 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l23"></a>

### Line 23 (comment)

```java
    //basically it is file metadata, that give info about the single file.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 24: Declare a private static nested class FileInfo.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l24"></a>

### Line 24 (code)

```java
    private static class FileInfo {
```

**What it does:** Declare a private static nested class FileInfo.

**Why it is here:** The port registry needs to keep disk path and uploader host together. private hides this internal representation; static avoids an implicit reference to an enclosing FileSharer.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. class: Defines a named type and its members. A class declaration does not construct an instance. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l25"></a>

### Line 25 (code)

```java
        String filePath; // filePath: where the file is located on disk.
```

**What it does:** Declare a String field holding the uploaded file's full disk path.

**Why it is here:** The socket sender must open the exact stored file later.

**Example / read it aloud:** The value is a path such as C:\Temp\SkyLink-uploads\UUID_notes.txt, not the payload itself.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l26"></a>

### Line 26 (code)

```java
        String host;    //host: who uploaded it (IP address or hostname).
```

**What it does:** Declare a String holding the uploader's IP address/host.

**Why it is here:** offerFile records who sent the HTTP upload.

**Example / read it aloud:** This is metadata; the current DownloadHandler does not use it to locate the listener.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** The listener is on the server, not on this client host.

<a id="filesharer-l27"></a>

### Line 27 (code)

```java
        FileInfo(String filePath, String host) {
```

**What it does:** Declare FileInfo's constructor with path and host parameters.

**Why it is here:** A new registry record can be created with both values in one operation.

**Example / read it aloud:** The constructor is package-accessible within this private nested class, not declared public.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l28"></a>

### Line 28 (code)

```java
            this.filePath = filePath;
```

**What it does:** Assign the path parameter to this FileInfo's filePath field.

**Why it is here:** Retains the disk location after the constructor returns.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l29"></a>

### Line 29 (code)

```java
            this.host = host;
```

**What it does:** Assign the host parameter to the host field.

**Why it is here:** Retains the uploader address as part of the metadata.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l30"></a>

### Line 30 (brace)

```java
        }
```

**What it does:** Close the block opened on line 27: FileInfo(String filePath, String host) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 27's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l31"></a>

### Line 31 (brace)

```java
    }
```

**What it does:** Close the block opened on line 24: private static class FileInfo {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 24's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l32"></a>

### Line 32 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l33"></a>

### Line 33 (comment)

```java
    /* availableFiles: Maps a port to a FileInfo (file + host info).
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 35: Declare a private final ConcurrentHashMap whose keys are Integer ports and values are FileInfo records.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l34"></a>

### Line 34 (comment)

```java
    → This tells the server: “On port 5050, serve file xyz.txt.”*/
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 35: Declare a private final ConcurrentHashMap whose keys are Integer ports and values are FileInfo records.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l35"></a>

### Line 35 (code)

```java
    private final ConcurrentHashMap<Integer, FileInfo> availableFiles;
```

**What it does:** Declare a private final ConcurrentHashMap whose keys are Integer ports and values are FileInfo records.

**Why it is here:** Concurrent HTTP/file threads need safe individual lookup/insertion/removal operations.

**Example / read it aloud:** availableFiles.get(53817) could return FileInfo(path, "10.0.0.5").

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. Integer: The reference/object form of int. It can be null and can be used as a generic map key/value. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. <>: Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.

**Actual behavior / caution:** final fixes the map reference; it does not freeze entries or make multi-operation algorithms atomic.

<a id="filesharer-l36"></a>

### Line 36 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l37"></a>

### Line 37 (comment)

```java
    /* accessTokens: Maps a port to a secure token (like a password).
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 39: Declare another ConcurrentHashMap mapping Integer ports to String PINs.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The PIN is generated with Random and lacks uniqueness/guess-attempt enforcement; secure is an overstatement. The raw socket does not verify a PIN.

<a id="filesharer-l38"></a>

### Line 38 (comment)

```java
    → Prevents unauthorized downloads. */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 39: Declare another ConcurrentHashMap mapping Integer ports to String PINs.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** The PIN is generated with Random and lacks uniqueness/guess-attempt enforcement; secure is an overstatement. The raw socket does not verify a PIN.

<a id="filesharer-l39"></a>

### Line 39 (code)

```java
    private final ConcurrentHashMap<Integer, String> accessTokens;
```

**What it does:** Declare another ConcurrentHashMap mapping Integer ports to String PINs.

**Why it is here:** The service associates an access code with each registered candidate port.

**Example / read it aloud:** accessTokens.get(53817) -> "482915".

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. Integer: The reference/object form of int. It can be null and can be used as a generic map key/value. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. <>: Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.

**Actual behavior / caution:** Two maps require coordination; individually safe puts do not guarantee a consistent record/PIN pair.

<a id="filesharer-l40"></a>

### Line 40 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l41"></a>

### Line 41 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l42"></a>

### Line 42 (comment)

```java
    // constructor used to initialize a maps
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 43: Declare the public no-argument FileSharer constructor.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l43"></a>

### Line 43 (code)

```java
    public FileSharer() {
```

**What it does:** Declare the public no-argument FileSharer constructor.

**Why it is here:** The controller needs to create an initially empty registry without any external configuration.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l44"></a>

### Line 44 (code)

```java
        availableFiles = new ConcurrentHashMap<>();
```

**What it does:** Create and assign the empty port-to-FileInfo map.

**Why it is here:** A declared field alone contains no constructed map; offerFile/get calls need an actual object.

**Example / read it aloud:** <> is the diamond operator: Java infers the generic types from the field declaration.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. <>: Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.

<a id="filesharer-l45"></a>

### Line 45 (code)

```java
        accessTokens = new ConcurrentHashMap<>();
```

**What it does:** Create and assign the empty port-to-PIN map.

**Why it is here:** Token operations need their own initialized lookup table.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. <>: Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.

<a id="filesharer-l46"></a>

### Line 46 (brace)

```java
    }
```

**What it does:** Close the block opened on line 43: public FileSharer() {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 43's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l47"></a>

### Line 47 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l48"></a>

### Line 48 (comment)

```java
    /* Generates a 6-digit random token, e.g. "834192".
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare a private method that generates and returns a String PIN.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Six digits describe its format, not uniqueness or verified user identity.

<a id="filesharer-l49"></a>

### Line 49 (comment)

```java
       Used for file download authentication.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare a private method that generates and returns a String PIN.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Six digits describe its format, not uniqueness or verified user identity.

<a id="filesharer-l50"></a>

### Line 50 (comment)

```java
       So when someone uploads a file, they get a unique token that must be shared with the downloader. */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 51: Declare a private method that generates and returns a String PIN.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Six digits describe its format, not uniqueness or verified user identity.

<a id="filesharer-l51"></a>

### Line 51 (code)

```java
    private String generateAccessToken() {
```

**What it does:** Declare a private method that generates and returns a String PIN.

**Why it is here:** PIN creation is an implementation detail called by offerFile.

**Example / read it aloud:** String preserves a token's representation rather than treating it as arithmetic input.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l52"></a>

### Line 52 (code)

```java
        Random random = new Random();
```

**What it does:** Construct java.util.Random.

**Why it is here:** The next line uses nextInt to choose a six-digit number.

**Example / read it aloud:** Random is pseudorandom, not a cryptographic secret generator.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** SecureRandom and uniqueness checking would be stronger for access secrets.

<a id="filesharer-l53"></a>

### Line 53 (code)

```java
        int pin = 100000 + random.nextInt(900000);
```

**What it does:** Choose a value from 0 through 899999, add 100000, and store the six-digit result in pin.

**Why it is here:** The offset produces numbers 100000 through 999999 without leading zeros.

**Example / read it aloud:** offset 382915 -> pin 482915; there are 900000 possible codes.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** Randomness does not guarantee that another live transfer has a different PIN.

<a id="filesharer-l54"></a>

### Line 54 (code)

```java
        return String.valueOf(pin);
```

**What it does:** Convert the int PIN into a String and return it.

**Why it is here:** accessTokens stores String values and the JSON/frontend share codes as text.

**Example / read it aloud:** String.valueOf(482915) -> "482915".

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l55"></a>

### Line 55 (brace)

```java
    }
```

**What it does:** Close the block opened on line 51: private String generateAccessToken() {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 51's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l56"></a>

### Line 56 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l57"></a>

### Line 57 (comment)

```java
    /* This method is called when someone offers (uploads) a file.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l58"></a>

### Line 58 (comment)

```java
    It: Generates a random port number (via UploadUtils.generatePort()).
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l59"></a>

### Line 59 (comment)

```java
    Checks if that port is free (not already in use).
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l60"></a>

### Line 60 (comment)

```java
    If free: Stores the file info in availableFiles.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l61"></a>

### Line 61 (comment)

```java
    Creates and stores a token in accessTokens.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l62"></a>

### Line 62 (comment)

```java
    Returns that port
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l63"></a>

### Line 63 (comment)

```java
    So each uploaded file gets:
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l64"></a>

### Line 64 (comment)

```java
      1. A unique port
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l65"></a>

### Line 65 (comment)

```java
      2. A unique access token  */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.

<a id="filesharer-l66"></a>

### Line 66 (code)

```java
    public int offerFile(String filePath, String uploaderHost) {
```

**What it does:** Declare offerFile(path, uploaderHost), returning an int port.

**Why it is here:** UploadHandler needs to register a stored file and learn the chosen per-file port.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l67"></a>

### Line 67 (code)

```java
        int port;
```

**What it does:** Declare a local int port without assigning a value yet.

**Why it is here:** Every loop iteration overwrites it with a new candidate before use.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l68"></a>

### Line 68 (code)

```java
        while (true) {
```

**What it does:** Begin a loop whose condition is always true.

**Why it is here:** Selection retries until a candidate passes the registry check; a return inside the loop ends the method.

**Example / read it aloud:** There is no iteration limit or exhaustion policy.

**Syntax on this line:** while: Repeat while a condition is true; test it before each iteration. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l69"></a>

### Line 69 (code)

```java
            port = UploadUtils.generatePort();   // call this method , until we get the free port
```

**What it does:** Generate and assign a random candidate port.

**Why it is here:** Repeated candidates let the method try another registry slot when one is occupied.

**Example / read it aloud:** This calls the helper explained in UploadUtils.java.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l70"></a>

### Line 70 (code)

```java
            if (!availableFiles.containsKey(port)) {
```

**What it does:** Check that the candidate key is absent from availableFiles.

**Why it is here:** The author attempts to avoid overwriting an already registered share.

**Example / read it aloud:** ! reverses containsKey's boolean.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. !: Logical NOT: true becomes false and false becomes true.

**Actual behavior / caution:** This does not check the OS socket table, and another thread can insert between check and put.

<a id="filesharer-l71"></a>

### Line 71 (code)

```java
                availableFiles.put(port, new FileInfo(filePath, uploaderHost));
```

**What it does:** Insert a new FileInfo under the selected port.

**Why it is here:** Later lookup and file-server creation need the path associated with this candidate.

**Example / read it aloud:** put(53817, new FileInfo(path, host)) stores a key/value association.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** put replaces an existing value; a concurrent check-then-put race can overwrite another upload.

<a id="filesharer-l72"></a>

### Line 72 (code)

```java
                String token = generateAccessToken();
```

**What it does:** Call generateAccessToken and store the returned String in a local variable.

**Why it is here:** The next map insertion needs the access code assigned to this offer.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l73"></a>

### Line 73 (code)

```java
                accessTokens.put(port, token);
```

**What it does:** Insert the PIN under the same port in accessTokens.

**Why it is here:** The upload response can retrieve it and downloads can reverse-search it.

**Example / read it aloud:** The file metadata insertion and this insertion are separate operations.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l74"></a>

### Line 74 (code)

```java
                return port;
```

**What it does:** Return the selected port and exit the method/loop.

**Why it is here:** UploadHandler needs the number for getToken and listener startup.

**Example / read it aloud:** This does not bind the port; startFileServer performs that later.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l75"></a>

### Line 75 (brace)

```java
            }
```

**What it does:** Close the block opened on line 70: if (!availableFiles.containsKey(port)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 70's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l76"></a>

### Line 76 (brace)

```java
        }
```

**What it does:** Close the block opened on line 68: while (true) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 68's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l77"></a>

### Line 77 (brace)

```java
    }
```

**What it does:** Close the block opened on line 66: public int offerFile(String filePath, String uploaderHost) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 66's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l78"></a>

### Line 78 (comment)

```java
    // isPortAvailable: Checks if a file exists on that port.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Declare a public boolean helper named isPortOccupied.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** This method checks the registry key, not disk existence or a listening socket.

<a id="filesharer-l79"></a>

### Line 79 (code)

```java
    public boolean isPortOccupied(int port) {
```

**What it does:** Declare a public boolean helper named isPortOccupied.

**Why it is here:** Tests/callers can ask whether a port key is already present in this registry.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. boolean: A primitive true/false value used by conditions and validation flags. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l80"></a>

### Line 80 (code)

```java
        return availableFiles.containsKey(port);
```

**What it does:** Return whether availableFiles contains the port key.

**Why it is here:** This answers registry occupancy.

**Example / read it aloud:** A true result does not prove a socket is listening or that the disk file still exists.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l81"></a>

### Line 81 (brace)

```java
    }
```

**What it does:** Close the block opened on line 79: public boolean isPortOccupied(int port) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 79's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l82"></a>

### Line 82 (comment)

```java
    // validateToken: Ensures the provided token matches the one assigned to that port.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 83: Declare a boolean token-validation method taking a port and token.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l83"></a>

### Line 83 (code)

```java
    public boolean validateToken(int port, String token) {
```

**What it does:** Declare a boolean token-validation method taking a port and token.

**Why it is here:** It provides exact token checking for an already-known port.

**Example / read it aloud:** The current HTTP DownloadHandler uses getPortByToken instead; this helper is exercised in unit tests.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. boolean: A primitive true/false value used by conditions and validation flags. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l84"></a>

### Line 84 (code)

```java
        if (token == null || !accessTokens.containsKey(port)) {
```

**What it does:** Reject when token is null or the port has no token entry.

**Why it is here:** The check avoids normal null/missing-entry comparisons; || short-circuits after a true left operand.

**Example / read it aloud:** If token is null, containsKey need not run.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. !: Logical NOT: true becomes false and false becomes true. && / ||: Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.

**Actual behavior / caution:** An entry can still disappear after this check under concurrent cleanup.

<a id="filesharer-l85"></a>

### Line 85 (code)

```java
            return false;
```

**What it does:** Return false for missing token/entry.

**Why it is here:** The caller receives a clear invalid result.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l86"></a>

### Line 86 (brace)

```java
        }
```

**What it does:** Close the block opened on line 84: if (token == null || !accessTokens.containsKey(port)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 84's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l87"></a>

### Line 87 (code)

```java
        return accessTokens.get(port).equals(token);
```

**What it does:** Get the stored String token and compare its contents with the supplied token.

**Why it is here:** String.equals compares text; == would compare reference identity.

**Example / read it aloud:** Stored "482915" equals another String containing "482915".

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** If cleanup removes the entry between the earlier check and get, get can return null and this line can throw.

<a id="filesharer-l88"></a>

### Line 88 (brace)

```java
    }
```

**What it does:** Close the block opened on line 83: public boolean validateToken(int port, String token) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 83's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l89"></a>

### Line 89 (comment)

```java
    //getToken: Fetches the token for a given port.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 90: Declare getToken(port), returning a String.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l90"></a>

### Line 90 (code)

```java
    public String getToken(int port) {
```

**What it does:** Declare getToken(port), returning a String.

**Why it is here:** UploadHandler needs the token after offerFile chooses a port.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l91"></a>

### Line 91 (code)

```java
        return accessTokens.get(port);
```

**What it does:** Return the token map value for the port, or null if absent.

**Why it is here:** This exposes the generated code without exposing the map itself.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l92"></a>

### Line 92 (brace)

```java
    }
```

**What it does:** Close the block opened on line 90: public String getToken(int port) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 90's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l93"></a>

### Line 93 (comment)

```java
    //getPortByToken: Reverse lookup (find port using token).
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 94: Declare reverse lookup taking a String token and returning nullable Integer.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l94"></a>

### Line 94 (code)

```java
    public Integer getPortByToken(String token) {
```

**What it does:** Declare reverse lookup taking a String token and returning nullable Integer.

**Why it is here:** The downloader knows the PIN, not the actual listener port. Integer can express no match with null; primitive int cannot.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. String: An immutable text object. String comparisons use equals for contents, not == for object identity. Integer: The reference/object form of int. It can be null and can be used as a generic map key/value. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l95"></a>

### Line 95 (code)

```java
        for (Map.Entry<Integer , String> entry : accessTokens.entrySet()) {
```

**What it does:** Iterate over every port/token key-value pair in the concurrent map.

**Why it is here:** The map is indexed by port, so lookup by token requires examining values.

**Example / read it aloud:** Map.Entry<Integer,String> is one pair; entrySet() gives the entries; : introduces an enhanced for loop.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. Integer: The reference/object form of int. It can be null and can be used as a generic map key/value. for: Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. <>: Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.

**Actual behavior / caution:** Lookup is O(number of pending shares); iteration is weakly consistent under concurrent changes.

<a id="filesharer-l96"></a>

### Line 96 (code)

```java
            if (entry.getValue().equals(token)) {
```

**What it does:** Compare this entry's token value with the requested token.

**Why it is here:** Only the matching code should select a port.

**Example / read it aloud:** String.equals(null) is false for a nonnull stored value.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="filesharer-l97"></a>

### Line 97 (code)

```java
                return entry.getKey();
```

**What it does:** Return the matching entry's Integer key.

**Why it is here:** DownloadHandler uses this key as the per-file socket port.

**Example / read it aloud:** If duplicate tokens exist, the first encountered match wins; order is not a user-facing guarantee.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l98"></a>

### Line 98 (brace)

```java
            }
```

**What it does:** Close the block opened on line 96: if (entry.getValue().equals(token)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 96's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l99"></a>

### Line 99 (brace)

```java
        }
```

**What it does:** Close the block opened on line 95: for (Map.Entry<Integer , String> entry : accessTokens.entrySet()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 95's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l100"></a>

### Line 100 (code)

```java
        return null;
```

**What it does:** Return null if iteration found no matching token.

**Why it is here:** DownloadHandler detects null and replies with 403.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l101"></a>

### Line 101 (brace)

```java
    }
```

**What it does:** Close the block opened on line 94: public Integer getPortByToken(String token) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 94's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l102"></a>

### Line 102 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l103"></a>

### Line 103 (comment)

```java
    // Get file host (needed in DownloadHandler)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 105: Declare a public getter for recorded uploader host.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Recorded uploader host is not needed by the current DownloadHandler, which connects to localhost.

<a id="filesharer-l104"></a>

### Line 104 (comment)

```java
    // getHostByPort: Gets uploader host info.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 105: Declare a public getter for recorded uploader host.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Recorded uploader host is not needed by the current DownloadHandler, which connects to localhost.

<a id="filesharer-l105"></a>

### Line 105 (code)

```java
    public String getHostByPort(int port) {
```

**What it does:** Declare a public getter for recorded uploader host.

**Why it is here:** This exposes one metadata field without exposing FileInfo itself.

**Example / read it aloud:** The merged DownloadHandler no longer calls it.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l106"></a>

### Line 106 (code)

```java
        FileInfo info = availableFiles.get(port);
```

**What it does:** Look up the FileInfo for the given port.

**Why it is here:** Access to host requires first finding the metadata record.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l107"></a>

### Line 107 (code)

```java
        return (info != null) ? info.host : null;
```

**What it does:** Use a conditional expression: return info.host when info exists, otherwise null.

**Why it is here:** The null guard prevents dereferencing an absent record.

**Example / read it aloud:** condition ? valueIfTrue : valueIfFalse is the ternary operator.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. ? :: Conditional expression: condition ? resultIfTrue : resultIfFalse.

<a id="filesharer-l108"></a>

### Line 108 (brace)

```java
    }
```

**What it does:** Close the block opened on line 105: public String getHostByPort(int port) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 105's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l109"></a>

### Line 109 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l110"></a>

### Line 110 (comment)

```java
    //getFilePath: Returns the actual file path stored for that port.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 111: Declare the path getter for a registered port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l111"></a>

### Line 111 (code)

```java
    public String getFilePath(int port) {
```

**What it does:** Declare the path getter for a registered port.

**Why it is here:** Tests or other service code can inspect the associated disk path.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l112"></a>

### Line 112 (code)

```java
        FileInfo info = availableFiles.get(port);
```

**What it does:** Look up the metadata record by port.

**Why it is here:** The path belongs to that FileInfo.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l113"></a>

### Line 113 (code)

```java
        return (info != null) ? info.filePath : null;
```

**What it does:** Return its filePath if the record exists; otherwise return null.

**Why it is here:** Missing state is signaled without calling a method/field on null.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. ? :: Conditional expression: condition ? resultIfTrue : resultIfFalse.

<a id="filesharer-l114"></a>

### Line 114 (brace)

```java
    }
```

**What it does:** Close the block opened on line 111: public String getFilePath(int port) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 111's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l115"></a>

### Line 115 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l116"></a>

### Line 116 (comment)

```java
    /* Once a file is downloaded: It deletes the file (if needed). Removes its entry from both availableFiles and accessTokens.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 118: Declare the cleanup method for one port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l117"></a>

### Line 117 (comment)

```java
       This prevents old ports/tokens creating problem for us later , when app grows — good for security and memory.   */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 118: Declare the cleanup method for one port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l118"></a>

### Line 118 (code)

```java
    public void cleanupAfterDownload(int port) {
```

**What it does:** Declare the cleanup method for one port.

**Why it is here:** The HTTP download happy path calls this after finishing its response copy.

**Example / read it aloud:** void means it reports no structured success/failure to the caller.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l119"></a>

### Line 119 (code)

```java
        FileInfo info = availableFiles.get(port);
```

**What it does:** Fetch the record to learn which original disk file must be removed.

**Why it is here:** The map holds the location used during upload.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l120"></a>

### Line 120 (code)

```java
        if (info != null) {
```

**What it does:** Only perform cleanup when a FileInfo currently exists.

**Why it is here:** Without metadata the method does not know the original file path.

**Example / read it aloud:** If only a stray token entry existed, this branch would not remove it.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="filesharer-l121"></a>

### Line 121 (code)

```java
            File file = new File(info.filePath);
```

**What it does:** Create a File path object from the stored path.

**Why it is here:** The following exists/delete/name methods act on this file.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l122"></a>

### Line 122 (code)

```java
            if (file.exists()) {
```

**What it does:** Check whether the original file currently exists.

**Why it is here:** Deletion/logging is attempted only for an existing path.

**Example / read it aloud:** This check can race another delete; it is not a lock.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="filesharer-l123"></a>

### Line 123 (code)

```java
                if (file.delete()) {
```

**What it does:** Call delete() and branch according to its boolean result.

**Why it is here:** Removal can fail, and the method logs the outcome rather than assuming success.

**Example / read it aloud:** The if condition itself performs the deletion attempt.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="filesharer-l124"></a>

### Line 124 (code)

```java
                    System.out.println("File deleted after download: " + file.getName());
```

**What it does:** Log successful original-file deletion.

**Why it is here:** The basename identifies which managed upload was removed.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l125"></a>

### Line 125 (code)

```java
                } else {
```

**What it does:** End the deletion-success branch and begin the failure branch.

**Why it is here:** The following log is chosen when File.delete returns false.

**Syntax on this line:** else: The alternative branch when the preceding if condition is false. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l126"></a>

### Line 126 (code)

```java
                    System.err.println("Failed to delete file: " + file.getName());
```

**What it does:** Log failed deletion to standard error.

**Why it is here:** Disk permission/open-handle problems should be visible.

**Example / read it aloud:** No retry is scheduled in this code.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l127"></a>

### Line 127 (brace)

```java
                }
```

**What it does:** Close the block opened on line 125: } else {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 125's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l128"></a>

### Line 128 (brace)

```java
            }
```

**What it does:** Close the block opened on line 122: if (file.exists()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 122's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l129"></a>

### Line 129 (code)

```java
            availableFiles.remove(port);
```

**What it does:** Remove the port's metadata entry.

**Why it is here:** Future lookups should not find the consumed share.

**Example / read it aloud:** This runs even after a failed delete, leaving a possible orphan file.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l130"></a>

### Line 130 (code)

```java
            accessTokens.remove(port);
```

**What it does:** Remove the port's token entry.

**Why it is here:** Sequential requests using the old PIN should fail reverse lookup.

**Example / read it aloud:** Removal of the two entries is not one atomic operation.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l131"></a>

### Line 131 (code)

```java
            System.out.println("Cleaned up port " + port + " and associated token with that port");
```

**What it does:** Log registry/PIN cleanup.

**Why it is here:** It marks that the method reached the map-removal path.

**Example / read it aloud:** It does not prove disk deletion succeeded.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l132"></a>

### Line 132 (brace)

```java
        }
```

**What it does:** Close the block opened on line 120: if (info != null) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 120's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l133"></a>

### Line 133 (brace)

```java
    }
```

**What it does:** Close the block opened on line 118: public void cleanupAfterDownload(int port) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 118's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l134"></a>

### Line 134 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l135"></a>

### Line 135 (comment)

```java
    // This is the temporary mini-server that actually sends the file.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 136: Declare the method that starts one file's temporary TCP listener.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l136"></a>

### Line 136 (code)

```java
    public void startFileServer(int port) {
```

**What it does:** Declare the method that starts one file's temporary TCP listener.

**Why it is here:** UploadHandler launches this method on a separate thread after registration.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l137"></a>

### Line 137 (code)

```java
        FileInfo info = availableFiles.get(port);
```

**What it does:** Fetch FileInfo for the selected port.

**Why it is here:** Listener startup needs the uploaded file's path.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l138"></a>

### Line 138 (code)

```java
        if (info == null) {
```

**What it does:** Check whether metadata is absent.

**Why it is here:** Starting a file listener makes no sense without a file association.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="filesharer-l139"></a>

### Line 139 (code)

```java
            System.out.println("No file is available with this port: " + port);
```

**What it does:** Log that the requested port has no registered file.

**Why it is here:** It helps distinguish missing-state startup from a bind error.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l140"></a>

### Line 140 (code)

```java
            return;
```

**What it does:** Return from startFileServer without opening a socket.

**Why it is here:** The absent-metadata branch must stop before dereferencing info.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l141"></a>

### Line 141 (brace)

```java
        }
```

**What it does:** Close the block opened on line 138: if (info == null) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 138's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l142"></a>

### Line 142 (code)

```java
        String filePath = info.filePath;
```

**What it does:** Copy the path field into a local variable.

**Why it is here:** The sender task later needs a stable path reference.

**Example / read it aloud:** String content is immutable, but this does not lock the file or protect it from deletion.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l143"></a>

### Line 143 (comment)

```java
        // ServerSocket is a Java class that listens for incoming TCP connections on a port.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 144: Create and bind a ServerSocket(port) inside try-with-resources.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l144"></a>

### Line 144 (code)

```java
        try (ServerSocket serverSocket = new ServerSocket(port)) { /* When you create new ServerSocket(port)
```

**What it does:** Create and bind a ServerSocket(port) inside try-with-resources.

**Why it is here:** This is the actual OS port reservation and listener resource; it closes when the try block exits.

**Example / read it aloud:** Unlike a map insertion, construction can fail if the port is occupied.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** The bind is wildcard by default. A reachable direct socket client gets no PIN challenge in the sender protocol.

<a id="filesharer-l145"></a>

### Line 145 (comment)

```java
            ,the OS binds that process to the network port. If the port is already in use, this throws IOException. */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 146: Set the ServerSocket accept timeout to 50000 milliseconds.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l146"></a>

### Line 146 (code)

```java
            serverSocket.setSoTimeout(50000);  /* Sets a timeout (in milliseconds) for blocking operations on the ServerSocket.
```

**What it does:** Set the ServerSocket accept timeout to 50000 milliseconds.

**Why it is here:** A waiting listener should eventually stop if nobody connects.

**Example / read it aloud:** 50000 ms = 50 s.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** This timeout controls accept, not automatic original-file/PIN expiry or total file-transfer time.

<a id="filesharer-l147"></a>

### Line 147 (comment)

```java
            Specifically, accept() will wait up to 50,000 ms (50 seconds);
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 150: Log the stored filename and chosen listener port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l148"></a>

### Line 148 (comment)

```java
            if no client connects in that time, accept() throws a SocketTimeoutException.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 150: Log the stored filename and chosen listener port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l149"></a>

### Line 149 (comment)

```java
            This prevents the server from waiting forever and helps the method eventually return if nobody connects.*/
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 150: Log the stored filename and chosen listener port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l150"></a>

### Line 150 (code)

```java
            System.out.println("Serving File " + new File(filePath).getName() + " on port " + port);
```

**What it does:** Log the stored filename and chosen listener port.

**Why it is here:** It indicates that bind succeeded and the thread reached the waiting path.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l151"></a>

### Line 151 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l152"></a>

### Line 152 (code)

```java
            Socket clientSocket = serverSocket.accept(); /*  accept() blocks the current thread until a client connects
```

**What it does:** Block in accept() until one client connection arrives or the timeout expires; store the accepted Socket.

**Why it is here:** The listener needs a connected stream endpoint before it can send bytes.

**Example / read it aloud:** ServerSocket is the listening resource; clientSocket is the accepted connection.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l153"></a>

### Line 153 (comment)

```java
             (or the timeout triggers).When a client connects, accept() returns a Socket object (clientSocket) representing
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 156: Set a 50-second read timeout on the accepted Socket.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l154"></a>

### Line 154 (comment)

```java
              that specific connection. The returned Socket has input/output streams for sending/receiving data across the
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 156: Set a 50-second read timeout on the accepted Socket.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l155"></a>

### Line 155 (comment)

```java
              TCP connection. */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 156: Set a 50-second read timeout on the accepted Socket.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="filesharer-l156"></a>

### Line 156 (code)

```java
            clientSocket.setSoTimeout(50000); /* Sets a read timeout for the client socket’s InputStream/OutputStream operations.
```

**What it does:** Set a 50-second read timeout on the accepted Socket.

**Why it is here:** This would limit blocking reads from its input stream.

**Example / read it aloud:** The sender later changes the same socket read timeout to 30 seconds.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** The comment implying InputStream/OutputStream or whole-transfer timeout is incorrect: SO_TIMEOUT does not bound writes. Socket SO_TIMEOUT limits reads, not writes or total transfer duration. The sender later replaces it with 30000 ms.

<a id="filesharer-l157"></a>

### Line 157 (comment)

```java
             basically when connection is established, we only waits for 50 sec for file transfer , if it takes more than
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 159: Log the accepted client's InetAddress.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Socket SO_TIMEOUT limits reads, not writes or total transfer duration. The sender later replaces it with 30000 ms.

<a id="filesharer-l158"></a>

### Line 158 (comment)

```java
             50 sec , we have thrown the exception. (This helps avoid hung transfers.) */
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 159: Log the accepted client's InetAddress.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** Socket SO_TIMEOUT limits reads, not writes or total transfer duration. The sender later replaces it with 30000 ms.

<a id="filesharer-l159"></a>

### Line 159 (code)

```java
            System.out.println("Client connection: " + clientSocket.getInetAddress());
```

**What it does:** Log the accepted client's InetAddress.

**Why it is here:** It shows the network endpoint that connected to this listener.

**Example / read it aloud:** Through the intended DownloadHandler path, it is normally the server's loopback client, not the recipient browser directly.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l160"></a>

### Line 160 (code)

```java
            new Thread(new FileSenderHandler(clientSocket, filePath)).start();
```

**What it does:** Create a FileSenderHandler task with accepted socket/path, wrap it in a Thread, and start it.

**Why it is here:** The sender performs the disk-to-socket copy separately. Passing the accepted Socket lets it keep using the connection after the listening socket closes.

**Example / read it aloud:** new Runnable task is not execution; Thread.start schedules run on a new thread.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** These per-file threads are outside the controller's ten-worker executor.

<a id="filesharer-l161"></a>

### Line 161 (code)

```java
        } catch (IOException e) {
```

**What it does:** Close the listener try block and catch IOException from binding, accepting or related operations.

**Why it is here:** A timeout is also an IOException subtype and reaches this catch.

**Example / read it aloud:** Try-with-resources closes the ServerSocket before catch handles the failure.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l162"></a>

### Line 162 (code)

```java
            System.err.println("Error handling file server on port: " + port);
```

**What it does:** Log the file-server port on error.

**Why it is here:** There is some failure visibility, but little detail.

**Example / read it aloud:** The exception e is available but its message is not printed.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

**Actual behavior / caution:** This catch does not remove maps/delete the original, leaving stale shares after timeout/bind failure.

<a id="filesharer-l163"></a>

### Line 163 (brace)

```java
        }
```

**What it does:** Close the block opened on line 161: } catch (IOException e) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 161's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l164"></a>

### Line 164 (brace)

```java
    }
```

**What it does:** Close the block opened on line 136: public void startFileServer(int port) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 136's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l165"></a>

### Line 165 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l166"></a>

### Line 166 (code)

```java
    private static class FileSenderHandler implements Runnable {
```

**What it does:** Declare a private static nested task class implementing Runnable.

**Why it is here:** Thread accepts a Runnable whose run method describes the sender's work; the class stores task-specific dependencies.

**Example / read it aloud:** static avoids needing a hidden FileSharer instance reference.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). static: Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference. class: Defines a named type and its members. A class declaration does not construct an instance. implements: Declare conformance to an interface contract such as HttpHandler or Runnable. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l167"></a>

### Line 167 (code)

```java
        private final Socket clientSocket;
```

**What it does:** Declare a final Socket reference for the accepted connection.

**Why it is here:** The sender must write to and eventually close that exact connection.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l168"></a>

### Line 168 (code)

```java
        private final String filePath;
```

**What it does:** Declare a final String for the original stored-file path.

**Why it is here:** The sender needs a disk location to open when its thread runs.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l169"></a>

### Line 169 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l170"></a>

### Line 170 (code)

```java
        public FileSenderHandler(Socket clientSocket, String filePath) {
```

**What it does:** Declare a constructor receiving socket and path.

**Why it is here:** startFileServer packages the connection/file into a task before launching it.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l171"></a>

### Line 171 (code)

```java
            this.clientSocket = clientSocket;
```

**What it does:** Store the Socket argument in the sender field.

**Why it is here:** run and finally both require it.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l172"></a>

### Line 172 (code)

```java
            this.filePath = filePath;
```

**What it does:** Store the disk path argument.

**Why it is here:** run opens that file without needing another map lookup.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l173"></a>

### Line 173 (brace)

```java
        }
```

**What it does:** Close the block opened on line 170: public FileSenderHandler(Socket clientSocket, String filePath) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 170's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l174"></a>

### Line 174 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l175"></a>

### Line 175 (code)

```java
        @Override
```

**What it does:** Mark run as an implementation of Runnable.run.

**Why it is here:** The compiler verifies the method really matches the interface contract.

**Example / read it aloud:** The annotation does not create a thread by itself.

**Syntax on this line:** Override: Compiler-checked annotation for a method overriding/implementing an inherited contract. It does not invoke the method.

<a id="filesharer-l176"></a>

### Line 176 (code)

```java
        public void run() {
```

**What it does:** Declare the public, no-result run method.

**Why it is here:** Thread.start executes this task body on the new sender thread.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l177"></a>

### Line 177 (code)

```java
            try {
```

**What it does:** Begin the try/catch/finally around sending.

**Why it is here:** I/O failures are logged and socket closure is attempted on either path.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l178"></a>

### Line 178 (code)

```java
                clientSocket.setSoTimeout(30000);
```

**What it does:** Set the socket's read timeout to 30000 ms, replacing its earlier 50000 ms setting.

**Why it is here:** The author intends stall protection, but this particular property applies only to reads.

**Example / read it aloud:** This run method writes payload and does not read from the socket.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** It therefore does not establish a 30-second file-send deadline.

<a id="filesharer-l179"></a>

### Line 179 (code)

```java
                try (FileInputStream fis = new FileInputStream(filePath)) {
```

**What it does:** Open a FileInputStream for filePath in try-with-resources.

**Why it is here:** The task needs to read the uploaded bytes; automatic closure releases its file handle even on error.

**Example / read it aloud:** Opening a nonexistent/deleted path throws IOException.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l180"></a>

### Line 180 (code)

```java
                    OutputStream oos = clientSocket.getOutputStream();
```

**What it does:** Get the connected socket's output stream.

**Why it is here:** The next writes send bytes to DownloadHandler's socket input stream.

**Example / read it aloud:** The variable name oos is just a name; this is OutputStream, not ObjectOutputStream serialization.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l181"></a>

### Line 181 (code)

```java
                    String fileName = new File(filePath).getName();
```

**What it does:** Get the stored path's basename.

**Why it is here:** The wire header needs a filename rather than exposing the full server disk path.

**Example / read it aloud:** The stored UUID prefix stays in this name.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l182"></a>

### Line 182 (code)

```java
                    String header = "Filename: " + fileName + "\n";
```

**What it does:** Construct Filename: <stored-name> followed by a newline.

**Why it is here:** A newline-terminated header frames metadata before raw payload in the simple TCP protocol.

**Example / read it aloud:** Filename: UUID_notes.txt\n.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

**Actual behavior / caution:** There is no expected byte count/checksum/PIN in this header.

<a id="filesharer-l183"></a>

### Line 183 (code)

```java
                    oos.write(header.getBytes());
```

**What it does:** Encode the header with the default charset and write those bytes to the socket.

**Why it is here:** The receiver must encounter the metadata line before any file bytes.

**Example / read it aloud:** getBytes converts text to bytes; write sends those bytes in order.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** Network peers should agree on an explicit header encoding.

<a id="filesharer-l184"></a>

### Line 184 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l185"></a>

### Line 185 (code)

```java
                    byte[] buffer = new byte[4096];
```

**What it does:** Allocate a reusable 4096-byte chunk buffer.

**Why it is here:** Chunked disk reads/socket writes avoid loading a second full file into this sender's heap.

**Example / read it aloud:** This does not make the earlier upload path streaming.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="filesharer-l186"></a>

### Line 186 (code)

```java
                    int byteRead;
```

**What it does:** Declare the count of bytes returned by each file read.

**Why it is here:** The final read often fills only part of the buffer, so writing the count is necessary.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l187"></a>

### Line 187 (code)

```java
                    while ((byteRead = fis.read(buffer)) != -1) {
```

**What it does:** Read a chunk into buffer, assign the count and continue while it is not -1.

**Why it is here:** The loop repeats until file EOF. Assignment occurs before the comparison.

**Example / read it aloud:** A 5000-byte file can yield counts 4096 then 904 then -1.

**Syntax on this line:** while: Repeat while a condition is true; test it before each iteration. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="filesharer-l188"></a>

### Line 188 (code)

```java
                        oos.write(buffer, 0, byteRead);
```

**What it does:** Write exactly byteRead bytes starting at buffer offset 0 to the socket.

**Why it is here:** Writing the full buffer on a short final read would add stale/padding bytes and corrupt the file.

**Example / read it aloud:** For the last 904-byte chunk, only positions 0..903 are written.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l189"></a>

### Line 189 (brace)

```java
                    }
```

**What it does:** Close the block opened on line 187: while ((byteRead = fis.read(buffer)) != -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 187's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l190"></a>

### Line 190 (code)

```java
                    System.out.println("File " + fileName + " sent to " + clientSocket.getInetAddress());
```

**What it does:** Log that the disk-to-socket loop finished.

**Why it is here:** It marks server-side sending progress.

**Example / read it aloud:** It does not prove that DownloadHandler received a complete expected file or that a human saved the HTTP attachment.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l191"></a>

### Line 191 (brace)

```java
                }
```

**What it does:** Close the block opened on line 179: try (FileInputStream fis = new FileInputStream(filePath)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 179's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l192"></a>

### Line 192 (code)

```java
            } catch (IOException ex) {
```

**What it does:** Catch IOException from the send block.

**Why it is here:** Disk/socket failures should not skip the final socket closure.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l193"></a>

### Line 193 (code)

```java
                System.err.println("Error sending file to client: " + ex.getMessage());
```

**What it does:** Log the send failure description.

**Why it is here:** It helps inspect a failed transfer.

**Example / read it aloud:** Closing after partial output looks like EOF to the receiver; no protocol integrity marker detects truncation.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l194"></a>

### Line 194 (code)

```java
            } finally {
```

**What it does:** Begin finally after success or caught failure.

**Why it is here:** The accepted Socket must not be left open when task work finishes.

**Syntax on this line:** finally: Run cleanup when control leaves its associated try under normal Java unwinding, including return/exception paths; forced termination can prevent it. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l195"></a>

### Line 195 (code)

```java
                try {
```

**What it does:** Begin a nested try around socket.close.

**Why it is here:** Even cleanup can throw IOException and needs its own handling.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l196"></a>

### Line 196 (code)

```java
                    clientSocket.close();
```

**What it does:** Close the accepted connection.

**Why it is here:** This releases the socket and causes the receiving side to encounter EOF after buffered bytes are consumed.

**Example / read it aloud:** It does not delete the original file; DownloadHandler calls registry cleanup separately.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="filesharer-l197"></a>

### Line 197 (code)

```java
                } catch (IOException e) {
```

**What it does:** Catch an IOException raised while closing the socket.

**Why it is here:** A cleanup failure must not bypass the following diagnostic.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l198"></a>

### Line 198 (code)

```java
                    System.err.println("Error closing socket: " + e.getMessage());
```

**What it does:** Log the close failure.

**Why it is here:** This makes resource-release problems visible instead of silently ignoring them.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="filesharer-l199"></a>

### Line 199 (brace)

```java
                }
```

**What it does:** Close the block opened on line 197: } catch (IOException e) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 197's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l200"></a>

### Line 200 (brace)

```java
            }
```

**What it does:** Close the block opened on line 194: } finally {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 194's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l201"></a>

### Line 201 (brace)

```java
        }
```

**What it does:** Close the block opened on line 176: public void run() {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 176's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l202"></a>

### Line 202 (brace)

```java
    }
```

**What it does:** Close the block opened on line 166: private static class FileSenderHandler implements Runnable {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 166's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l203"></a>

### Line 203 (brace)

```java
}
```

**What it does:** Close the block opened on line 21: public class FileSharer {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 21's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="filesharer-l204"></a>

### Line 204 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="filesharer-l205"></a>

### Line 205 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

### Pause and Check Your Understanding

**Question:** What does Integer mean in the map declaration?

**Answer:** The boxed object form of int; Java generics require reference types, and map calls box/unbox port values.

**Question:** What has closed after accept returns and the listener try block ends?

**Answer:** The listening ServerSocket closes; the accepted client Socket is a separate connection used by FileSenderHandler.

**Question:** Does Socket.setSoTimeout(30000) force writes to finish within 30 seconds?

**Answer:** No. It controls socket reads; this sender mostly writes.

<a id="downloadhandler"></a>

## DownloadHandler.java

**Source:** [handler/DownloadHandler.java](../src/main/java/P2P/handler/DownloadHandler.java)

**Purpose:** Turn a PIN-authorized HTTP request into a local socket read, then an HTTP attachment and successful-path cleanup.

**Who calls it:** HttpServer invokes handle for the /download context, including /download/0.

**Picture it:** The collection clerk: checks the code, collects bytes locally and hands them to the recipient.

**Snapshot SHA-256:** `490371bc4dbf0ffca7dc40d0316b8887bc84645331f8e6c7b413e1af9b43ded6`

<a id="downloadhandler-l1"></a>

### Line 1 (package)

```java
package P2P.handler;
```

**What it does:** Declare that this file's types belong to the P2P.handler package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.handler.

<a id="downloadhandler-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l3"></a>

### Line 3 (import)

```java
import java.io.ByteArrayOutputStream;
```

**What it does:** Make the type java.io.ByteArrayOutputStream available by its short name ByteArrayOutputStream. An expandable in-memory byte accumulator.

**Why it is here:** Upload uses it for the whole envelope; download uses it for the filename header. Memory grows with accumulated bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.ByteArrayOutputStream where ByteArrayOutputStream is used.

<a id="downloadhandler-l4"></a>

### Line 4 (import)

```java
import java.io.File;
```

**What it does:** Make the type java.io.File available by its short name File. A path representation with helpers such as exists, getName, delete and mkdirs.

**Why it is here:** Used to describe storage paths; construction alone does not create/read file contents. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.File where File is used.

<a id="downloadhandler-l5"></a>

### Line 5 (import)

```java
import java.io.FileInputStream;
```

**What it does:** Make the type java.io.FileInputStream available by its short name FileInputStream. An InputStream that reads from a disk file.

**Why it is here:** The TCP sender and staged HTTP copy need the original file bytes. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.FileInputStream where FileInputStream is used.

<a id="downloadhandler-l6"></a>

### Line 6 (import)

```java
import java.io.FileOutputStream;
```

**What it does:** Make the type java.io.FileOutputStream available by its short name FileOutputStream. An OutputStream that writes to a disk file.

**Why it is here:** Uploads and download staging need real disk persistence. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.FileOutputStream where FileOutputStream is used.

<a id="downloadhandler-l7"></a>

### Line 7 (import)

```java
import java.io.IOException;
```

**What it does:** Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.

**Why it is here:** Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.IOException where IOException is used.

<a id="downloadhandler-l8"></a>

### Line 8 (import)

```java
import java.io.InputStream;
```

**What it does:** Make the type java.io.InputStream available by its short name InputStream. A base class for reading bytes from a source.

**Why it is here:** The download handler reads from the connected socket and detects EOF with -1. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.InputStream where InputStream is used.

<a id="downloadhandler-l9"></a>

### Line 9 (import)

```java
import java.io.OutputStream;
```

**What it does:** Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.

**Why it is here:** HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.

<a id="downloadhandler-l10"></a>

### Line 10 (import)

```java
import java.net.Socket;
```

**What it does:** Make the type java.net.Socket available by its short name Socket. A connected TCP endpoint with input/output streams.

**Why it is here:** The download handler connects; the file listener accepts a connected Socket. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.net.Socket where Socket is used.

<a id="downloadhandler-l11"></a>

### Line 11 (import)

```java
import java.nio.file.Files;
```

**What it does:** Make the type java.nio.file.Files available by its short name Files. A utility class with filesystem operations and file-type detection.

**Why it is here:** Download uses Files.probeContentType for a response MIME guess. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.nio.file.Files where Files is used.

<a id="downloadhandler-l12"></a>

### Line 12 (import)

```java
import java.nio.file.Path;
```

**What it does:** Make the type java.nio.file.Path available by its short name Path. A typed filesystem path representation.

**Why it is here:** Path.of(fileName) supplies the name to the file-type detector; it does not open the file. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.nio.file.Path where Path is used.

<a id="downloadhandler-l13"></a>

### Line 13 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l14"></a>

### Line 14 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l15"></a>

### Line 15 (import)

```java
import P2P.Service.FileSharer;
```

**What it does:** Make the type P2P.Service.FileSharer available by its short name FileSharer. Your shared pending-file/PIN registry and local TCP service.

**Why it is here:** Handlers coordinate through one FileSharer object; importing the name does not construct it. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name P2P.Service.FileSharer where FileSharer is used.

<a id="downloadhandler-l16"></a>

### Line 16 (import)

```java
import com.sun.net.httpserver.Headers;
```

**What it does:** Make the type com.sun.net.httpserver.Headers available by its short name Headers. The HTTP header collection type from the JDK server API.

**Why it is here:** Handlers read incoming metadata or add/set outgoing metadata. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.Headers where Headers is used.

<a id="downloadhandler-l17"></a>

### Line 17 (import)

```java
import com.sun.net.httpserver.HttpExchange;
```

**What it does:** Make the type com.sun.net.httpserver.HttpExchange available by its short name HttpExchange. One HTTP request and its response channel.

**Why it is here:** handle receives this object to inspect method/URI/headers and access body streams. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.HttpExchange where HttpExchange is used.

<a id="downloadhandler-l18"></a>

### Line 18 (import)

```java
import com.sun.net.httpserver.HttpHandler;
```

**What it does:** Make the type com.sun.net.httpserver.HttpHandler available by its short name HttpHandler. The interface with handle(HttpExchange).

**Why it is here:** implements HttpHandler allows a class to be registered as a server context handler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.HttpHandler where HttpHandler is used.

<a id="downloadhandler-l19"></a>

### Line 19 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l20"></a>

### Line 20 (code)

```java
public class DownloadHandler implements HttpHandler {
```

**What it does:** Declare DownloadHandler implementing the HttpHandler contract.

**Why it is here:** The registered context requires handle(HttpExchange) for incoming download requests.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance. implements: Declare conformance to an interface contract such as HttpHandler or Runnable. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l21"></a>

### Line 21 (code)

```java
    private final FileSharer fileSharer;
```

**What it does:** Declare a private final reference to the shared FileSharer.

**Why it is here:** Token lookup and original cleanup must use the same state written by uploads.

**Syntax on this line:** private: Visibility: implementation details are confined to the containing class (including permitted nested-class access). final: This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l22"></a>

### Line 22 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l23"></a>

### Line 23 (code)

```java
    public DownloadHandler(FileSharer fileSharer) {
```

**What it does:** Declare the constructor taking the shared service object.

**Why it is here:** FileController manually supplies the dependency when registering the handler.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l24"></a>

### Line 24 (code)

```java
        this.fileSharer = fileSharer;
```

**What it does:** Store that argument in this handler's field.

**Why it is here:** Each later request can access it after construction ends.

**Syntax on this line:** this: The current object. this.field distinguishes an instance field from a same-named parameter. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l25"></a>

### Line 25 (brace)

```java
    }
```

**What it does:** Close the block opened on line 23: public DownloadHandler(FileSharer fileSharer) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 23's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l26"></a>

### Line 26 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l27"></a>

### Line 27 (code)

```java
    @Override
```

**What it does:** Mark handle as an interface-method implementation.

**Why it is here:** The compiler checks the declared contract.

**Syntax on this line:** Override: Compiler-checked annotation for a method overriding/implementing an inherited contract. It does not invoke the method.

<a id="downloadhandler-l28"></a>

### Line 28 (code)

```java
    public void handle(HttpExchange exchange) throws IOException {
```

**What it does:** Declare the per-request handler with an exchange and possible IOException.

**Why it is here:** HTTP request parsing and response/socket I/O happen inside this entry point.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. throws: Declare that a checked exception may propagate to the caller. This is not an exception handler. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l29"></a>

### Line 29 (code)

```java
        Headers headers = exchange.getResponseHeaders();
```

**What it does:** Get the outgoing header map.

**Why it is here:** CORS and attachment metadata must be set before sendResponseHeaders.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l30"></a>

### Line 30 (code)

```java
        headers.add("Access-Control-Allow-Origin", "*");
```

**What it does:** Allow wildcard origins in browser CORS.

**Why it is here:** The separate frontend origin needs permission to read responses.

**Example / read it aloud:** It is not a resource-authorization check.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l31"></a>

### Line 31 (code)

```java
        headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
```

**What it does:** Advertise GET, POST, OPTIONS for cross-origin permission checks.

**Why it is here:** A browser can inspect advertised methods.

**Example / read it aloud:** The actual download method check below accepts only GET (plus early OPTIONS).

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l32"></a>

### Line 32 (code)

```java
        headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");
```

**What it does:** Permit Content-Type and Authorization header names.

**Why it is here:** Cross-origin request headers may be preflighted.

**Example / read it aloud:** This service does not authenticate a JWT just because the name is allowed.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l33"></a>

### Line 33 (code)

```java
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
```

**What it does:** Expose Content-Disposition to browser JavaScript.

**Why it is here:** Share.jsx reads this response header to choose the browser download filename.

**Example / read it aloud:** Without exposure, a cross-origin response can exist while JS cannot access this non-safelisted header.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l34"></a>

### Line 34 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l35"></a>

### Line 35 (comment)

```java
        // Handle CORS preflight for this route
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 36: Select the OPTIONS preflight branch.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l36"></a>

### Line 36 (code)

```java
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
```

**What it does:** Select the OPTIONS preflight branch.

**Why it is here:** Permission checks should be answered without looking up a PIN or retrieving a file.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="downloadhandler-l37"></a>

### Line 37 (code)

```java
            exchange.sendResponseHeaders(204, -1);
```

**What it does:** Respond 204 with no body.

**Why it is here:** Only CORS permission metadata is needed for this branch.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l38"></a>

### Line 38 (code)

```java
            return;
```

**What it does:** Return from handle after preflight.

**Why it is here:** It prevents executing the download path on this exchange.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l39"></a>

### Line 39 (brace)

```java
        }
```

**What it does:** Close the block opened on line 36: if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 36's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l40"></a>

### Line 40 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l41"></a>

### Line 41 (comment)

```java
        //checking for method allowance
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 42: Reject when the method is not GET.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l42"></a>

### Line 42 (code)

```java
        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
```

**What it does:** Reject when the method is not GET.

**Why it is here:** Download is a read endpoint; POST or DELETE should not consume the file through this path.

**Example / read it aloud:** ! negates the equalsIgnoreCase result.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. !: Logical NOT: true becomes false and false becomes true.

<a id="downloadhandler-l43"></a>

### Line 43 (code)

```java
            String response = "Method Not Allowed";
```

**What it does:** Store the method-error text.

**Why it is here:** The following response length and body use one consistent message.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l44"></a>

### Line 44 (code)

```java
            exchange.sendResponseHeaders(405, response.getBytes().length);
```

**What it does:** Send status 405 with the encoded message's byte length.

**Why it is here:** The caller receives Method Not Allowed rather than a file.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l45"></a>

### Line 45 (code)

```java
            try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Open/own the response OutputStream in a try-with-resources block.

**Why it is here:** The error body must be written and the stream closed.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l46"></a>

### Line 46 (code)

```java
                os.write(response.getBytes());
```

**What it does:** Write the error-message bytes.

**Why it is here:** Headers do not themselves deliver the text.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l47"></a>

### Line 47 (brace)

```java
            }
```

**What it does:** Close the block opened on line 45: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 45's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l48"></a>

### Line 48 (code)

```java
            return;
```

**What it does:** Return after rejecting the method.

**Why it is here:** Rejected requests must not proceed to token/socket work.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l49"></a>

### Line 49 (brace)

```java
        }
```

**What it does:** Close the block opened on line 42: if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 42's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l50"></a>

### Line 50 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l51"></a>

### Line 51 (comment)

```java
        // Get token from query parameter
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 52: Read the query portion of the URI into query.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l52"></a>

### Line 52 (code)

```java
        String query = exchange.getRequestURI().getQuery();
```

**What it does:** Read the query portion of the URI into query.

**Why it is here:** The PIN appears after ? in the URL, separately from the /download/0 path.

**Example / read it aloud:** /download/0?token=482915 -> query is token=482915; missing query -> null.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l53"></a>

### Line 53 (code)

```java
        String token = null;
```

**What it does:** Initialize token to null.

**Why it is here:** The handler needs an explicit missing-token value if parsing finds nothing.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l54"></a>

### Line 54 (code)

```java
        if (query != null) {
```

**What it does:** Parse query only when a query string exists.

**Why it is here:** Calling split on null would throw.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="downloadhandler-l55"></a>

### Line 55 (code)

```java
            String[] params = query.split("&");
```

**What it does:** Split query at each & into a String array of parameter fragments.

**Why it is here:** A URL may contain several name=value pairs.

**Example / read it aloud:** x=1&token=482915 -> ["x=1", "token=482915"].

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** This is simple query parsing, not a complete URL/form decoding implementation.

<a id="downloadhandler-l56"></a>

### Line 56 (code)

```java
            for (String param : params) {
```

**What it does:** Iterate over every parameter fragment.

**Why it is here:** The token may not be the first query parameter.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. for: Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l57"></a>

### Line 57 (code)

```java
                if (param.startsWith("token=")) {
```

**What it does:** Look for a fragment beginning with the literal token=.

**Why it is here:** It recognizes the expected parameter name without accepting another prefix.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l58"></a>

### Line 58 (code)

```java
                    token = param.substring(6);
```

**What it does:** Keep the substring after the six characters token=.

**Why it is here:** The service needs the value rather than the parameter name.

**Example / read it aloud:** substring(6) on token=482915 gives 482915.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l59"></a>

### Line 59 (code)

```java
                    break;
```

**What it does:** Break from the parameter loop after the first token match.

**Why it is here:** Later parameters need not be scanned and a second token will not overwrite this one.

**Syntax on this line:** break: Exit the nearest enclosing loop/switch. Execution continues after it; this is not a method return. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l60"></a>

### Line 60 (brace)

```java
                }
```

**What it does:** Close the block opened on line 57: if (param.startsWith("token=")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 57's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l61"></a>

### Line 61 (brace)

```java
            }
```

**What it does:** Close the block opened on line 56: for (String param : params) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 56's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l62"></a>

### Line 62 (brace)

```java
        }
```

**What it does:** Close the block opened on line 54: if (query != null) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 54's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l63"></a>

### Line 63 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l64"></a>

### Line 64 (code)

```java
        try {
```

**What it does:** Begin try around registry lookup and file/socket response work.

**Why it is here:** IOException from the nested operations is handled by the catch at line 136.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l65"></a>

### Line 65 (comment)

```java
            // Ignore port in path, use only token for lookup
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 66: Reverse-look up the PIN and store a nullable Integer port.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l66"></a>

### Line 66 (code)

```java
            Integer port = fileSharer.getPortByToken(token);
```

**What it does:** Reverse-look up the PIN and store a nullable Integer port.

**Why it is here:** Current browser requests pass dummy path port 0; actual listener selection comes from server state.

**Example / read it aloud:** token 482915 -> Integer 53817, or null if no share matches.

**Syntax on this line:** Integer: The reference/object form of int. It can be null and can be used as a generic map key/value. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l67"></a>

### Line 67 (code)

```java
            if (port == null) {
```

**What it does:** Check for no matching port.

**Why it is here:** Missing/invalid/consumed PIN must be rejected before opening a socket.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="downloadhandler-l68"></a>

### Line 68 (code)

```java
                String response = "Access denied: Invalid or missing token";
```

**What it does:** Create the access-denied text.

**Why it is here:** The caller gets one controlled failure message for missing/invalid lookup.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l69"></a>

### Line 69 (code)

```java
                headers.add("Content-Type", "text/plain");
```

**What it does:** Set this response's MIME type to text/plain.

**Why it is here:** The body is an error message, not a file or JSON.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l70"></a>

### Line 70 (code)

```java
                exchange.sendResponseHeaders(403, response.getBytes().length); // 403 Forbidden
```

**What it does:** Send 403 and the message's encoded byte length.

**Why it is here:** Forbidden signals that this request lacks a usable access PIN.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l71"></a>

### Line 71 (code)

```java
                try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Obtain the error-response stream with automatic closure.

**Why it is here:** The denied response still needs a properly written/closed body.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l72"></a>

### Line 72 (code)

```java
                    os.write(response.getBytes());
```

**What it does:** Write the denied message to the HTTP body.

**Why it is here:** The browser/client can display the reason.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l73"></a>

### Line 73 (brace)

```java
                }
```

**What it does:** Close the block opened on line 71: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 71's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l74"></a>

### Line 74 (code)

```java
                return;
```

**What it does:** Return after denial.

**Why it is here:** There must be no socket read or file consumption on this branch.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l75"></a>

### Line 75 (brace)

```java
            }
```

**What it does:** Close the block opened on line 67: if (port == null) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 67's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l76"></a>

### Line 76 (comment)

```java
            // The per-file socket server always runs inside this same JVM (started by
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l77"></a>

### Line 77 (comment)

```java
            // UploadHandler on this host), so it must be reached via loopback rather than
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l78"></a>

### Line 78 (comment)

```java
            // the uploader's client IP, which is unreachable from here in a real deployment.
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 79: Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l79"></a>

### Line 79 (code)

```java
            try (Socket socket = new Socket("localhost", port)) {
```

**What it does:** Connect a new Socket to localhost at the looked-up port; own it in try-with-resources.

**Why it is here:** The per-file listener and stored file live on this same server host. Using the uploader IP would target the wrong machine.

**Example / read it aloud:** Integer port is automatically unboxed to an int for the constructor.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** No explicit connect/read deadline is configured here; listener startup can also race this connection.

<a id="downloadhandler-l80"></a>

### Line 80 (code)

```java
                InputStream socketInput = socket.getInputStream();
```

**What it does:** Get the socket's input stream.

**Why it is here:** FileSenderHandler writes to its socket output; this side must read those ordered bytes.

**Example / read it aloud:** The browser is not this TCP client; DownloadHandler is.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l81"></a>

### Line 81 (code)

```java
                File tempFile = File.createTempFile("download-", ".tmp");
```

**What it does:** Create an actual new uniquely named temporary file with prefix download- and suffix .tmp.

**Why it is here:** It stages the received payload before an HTTP length is known.

**Example / read it aloud:** Unlike new File(path), File.createTempFile creates a file on disk.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l82"></a>

### Line 82 (code)

```java
                tempFile.deleteOnExit(); // Extra safety: delete if JVM exits
```

**What it does:** Register the staging path for deletion during normal JVM termination.

**Why it is here:** This is a backup if an ordinary cleanup path leaves the staging file.

**Example / read it aloud:** Normal finally deletion remains the immediate cleanup attempt.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** deleteOnExit is not crash cleanup or a prompt expiry mechanism; registrations can accumulate until exit.

<a id="downloadhandler-l83"></a>

### Line 83 (code)

```java
                String fileName = "downloaded-file";
```

**What it does:** Choose downloaded-file as a fallback filename.

**Why it is here:** If the internal header does not contain Filename:, the response still needs a name.

**Example / read it aloud:** The current code does not reject an absent or malformed filename header.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l84"></a>

### Line 84 (code)

```java
                try {
```

**What it does:** Begin try paired with the staging-file finally cleanup.

**Why it is here:** Once staging exists, the handler wants to attempt deletion after normal or exceptional transfer completion.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l85"></a>

### Line 85 (code)

```java
                    try (FileOutputStream fileOutputStream = new FileOutputStream(tempFile)) {
```

**What it does:** Open a FileOutputStream on the staging file with automatic closure.

**Why it is here:** TCP payload bytes must be written to disk and the file handle released before HTTP reads.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l86"></a>

### Line 86 (code)

```java
                        byte[] buffer = new byte[4096];
```

**What it does:** Allocate a 4096-byte payload-read buffer.

**Why it is here:** Each socket read may return a chunk smaller than this capacity.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l87"></a>

### Line 87 (code)

```java
                        int byteRead;
```

**What it does:** Declare the count variable for subsequent buffered reads.

**Why it is here:** Writing only the actual count prevents stale bytes in the file.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l88"></a>

### Line 88 (code)

```java
                        ByteArrayOutputStream headerBaos = new ByteArrayOutputStream();
```

**What it does:** Create an in-memory ByteArrayOutputStream for header bytes only.

**Why it is here:** The protocol begins with a short filename line before the binary file.

**Example / read it aloud:** The current loop does not cap this header's length.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l89"></a>

### Line 89 (code)

```java
                        int b;
```

**What it does:** Declare an int holding one byte-read result.

**Why it is here:** InputStream.read() returns 0..255 for a byte or -1 for EOF, so int is needed to represent both.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l90"></a>

### Line 90 (code)

```java
                        while ((b = socketInput.read()) != -1) {
```

**What it does:** Read one socket byte at a time until EOF, assigning the result to b.

**Why it is here:** The handler needs to stop at the exact newline rather than accidentally mixing header and payload.

**Example / read it aloud:** Parentheses make the assignment happen before comparison with -1.

**Syntax on this line:** while: Repeat while a condition is true; test it before each iteration. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="downloadhandler-l91"></a>

### Line 91 (code)

```java
                            if (b == '\n') break;
```

**What it does:** If that byte is newline, break from the header-read loop.

**Why it is here:** The sender's newline ends the Filename metadata and separates payload.

**Example / read it aloud:** break stops only this loop; execution continues at header decoding.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. break: Exit the nearest enclosing loop/switch. Execution continues after it; this is not a method return. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. == / !=: Equality/inequality. == null tests missing reference; String content should use equals. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

<a id="downloadhandler-l92"></a>

### Line 92 (code)

```java
                            headerBaos.write(b);
```

**What it does:** Append a non-newline header byte to headerBaos.

**Why it is here:** The collected bytes can later be decoded as metadata text.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l93"></a>

### Line 93 (brace)

```java
                        }
```

**What it does:** Close the block opened on line 90: while ((b = socketInput.read()) != -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 90's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l94"></a>

### Line 94 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l95"></a>

### Line 95 (code)

```java
                        String header = headerBaos.toString().trim();
```

**What it does:** Decode the header bytes using the default charset and trim surrounding whitespace.

**Why it is here:** The next prefix test operates on a String.

**Example / read it aloud:** trim can also remove whitespace around the filename, altering some legitimate names.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l96"></a>

### Line 96 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l97"></a>

### Line 97 (code)

```java
                        if (header.startsWith("Filename: ")) {
```

**What it does:** Check whether the decoded header begins with Filename: plus a space.

**Why it is here:** The sender and receiver must agree on this metadata prefix.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="downloadhandler-l98"></a>

### Line 98 (code)

```java
                            fileName = header.substring("Filename: ".length());
```

**What it does:** Remove the prefix and keep the rest as fileName.

**Why it is here:** The HTTP attachment needs the stored basename, not the protocol label.

**Example / read it aloud:** "Filename: ".length() is 10.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l99"></a>

### Line 99 (brace)

```java
                        }
```

**What it does:** Close the block opened on line 97: if (header.startsWith("Filename: ")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 97's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l100"></a>

### Line 100 (code)

```java
                        while ((byteRead = socketInput.read(buffer)) != -1) {
```

**What it does:** Read remaining socket bytes in chunks until EOF.

**Why it is here:** Everything after the metadata newline is treated as payload.

**Example / read it aloud:** TCP read chunks need not equal the sender's write chunks.

**Syntax on this line:** while: Repeat while a condition is true; test it before each iteration. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

**Actual behavior / caution:** EOF does not prove expected total length: the protocol supplies no size/checksum.

<a id="downloadhandler-l101"></a>

### Line 101 (code)

```java
                            fileOutputStream.write(buffer, 0, byteRead);
```

**What it does:** Write only byteRead bytes from buffer offset 0 to the staging file.

**Why it is here:** Short reads must not append stale buffer contents.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l102"></a>

### Line 102 (brace)

```java
                        }
```

**What it does:** Close the block opened on line 100: while ((byteRead = socketInput.read(buffer)) != -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 100's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l103"></a>

### Line 103 (brace)

```java
                    }
```

**What it does:** Close the block opened on line 85: try (FileOutputStream fileOutputStream = new FileOutputStream(tempFile)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 85's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l104"></a>

### Line 104 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l105"></a>

### Line 105 (comment)

```java
                    // Detect file type (e.g., pdf, jpg, png, etc.)
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 106: Create a Path from the reported filename and ask installed file-type detectors for its MIME type.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** This probes a Path made from the reported filename; it is not content scanning of the staging file.

<a id="downloadhandler-l106"></a>

### Line 106 (code)

```java
                    String contentType = Files.probeContentType(Path.of(fileName));
```

**What it does:** Create a Path from the reported filename and ask installed file-type detectors for its MIME type.

**Why it is here:** The HTTP response needs a reasonable Content-Type.

**Example / read it aloud:** Path.of(fileName) describes the name; it is not reading the staging file's contents here.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

**Actual behavior / caution:** Detection is platform-dependent and not payload integrity or malware validation. This probes a Path made from the reported filename; it is not content scanning of the staging file.

<a id="downloadhandler-l107"></a>

### Line 107 (code)

```java
                    if (contentType == null) {
```

**What it does:** Check whether the type detector returned no type.

**Why it is here:** A fallback is needed for unknown extensions/detectors.

**Syntax on this line:** null: No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal. if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="downloadhandler-l108"></a>

### Line 108 (code)

```java
                        contentType = "application/octet-stream";
```

**What it does:** Choose generic application/octet-stream.

**Why it is here:** The receiver can still treat unknown content as downloadable binary data.

**Syntax on this line:** ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l109"></a>

### Line 109 (brace)

```java
                    }
```

**What it does:** Close the block opened on line 107: if (contentType == null) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 107's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l110"></a>

### Line 110 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l111"></a>

### Line 111 (comment)

```java
                    // Send the file to the client
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 112: Log that HTTP response metadata is about to be set/sent.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

<a id="downloadhandler-l112"></a>

### Line 112 (code)

```java
                    System.out.println("Sending file with headers:");
```

**What it does:** Log that HTTP response metadata is about to be set/sent.

**Why it is here:** It gives a diagnostic marker between socket staging and browser delivery.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l113"></a>

### Line 113 (code)

```java
                    headers.add("Access-Control-Expose-Headers", "Content-Disposition");
```

**What it does:** Add Content-Disposition to exposed CORS response headers again.

**Why it is here:** The intended purpose is browser access to the filename.

**Example / read it aloud:** The same header was already added at line 33; this addition is redundant.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l114"></a>

### Line 114 (code)

```java
                    headers.set("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
```

**What it does:** Set Content-Disposition to attachment with the fileName enclosed in quotes.

**Why it is here:** attachment requests download behavior; filename gives the browser a suggested name.

**Example / read it aloud:** The Java " sequences add literal quotes around UUID_notes.txt.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved. escapes: Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.

**Actual behavior / caution:** A robust implementation must safely encode/validate untrusted names for headers; this line concatenates directly.

<a id="downloadhandler-l115"></a>

### Line 115 (code)

```java
                    headers.set("Content-Type", contentType);
```

**What it does:** Set the HTTP MIME type to the detected/fallback contentType.

**Why it is here:** The response describes its file payload rather than the prior text/JSON error formats.

**Example / read it aloud:** set replaces values for the name, whereas add appends another header value.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l116"></a>

### Line 116 (code)

```java
                    System.out.println("File length: " + tempFile.length());
```

**What it does:** Log the staging-file size in bytes.

**Why it is here:** This is the actual number of staged bytes, not necessarily proof the sender delivered the original complete file.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="downloadhandler-l117"></a>

### Line 117 (code)

```java
                    exchange.sendResponseHeaders(200, tempFile.length());
```

**What it does:** Send 200 with the staging file's length as response length.

**Why it is here:** The staged file supplies a known count for the HTTP body.

**Example / read it aloud:** sendResponseHeaders happens before body writes.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** For a zero-length file, this HttpServer API treats length 0 as chunked encoding; the code does not special-case that.

<a id="downloadhandler-l118"></a>

### Line 118 (code)

```java
                    try (OutputStream os = exchange.getResponseBody();
```

**What it does:** Begin a multi-resource try by acquiring the HTTP response OutputStream.

**Why it is here:** The HTTP body needs a writer and that resource should close on exit.

**Example / read it aloud:** The semicolon inside the parentheses separates resource declarations, not normal statements.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l119"></a>

### Line 119 (code)

```java
                         FileInputStream fis = new FileInputStream(tempFile)) {
```

**What it does:** Add a FileInputStream reading staging to the same try-with-resources block.

**Why it is here:** The handler copies from staged disk to HTTP. Both streams are owned and close in reverse declaration order.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l120"></a>

### Line 120 (code)

```java
                        byte[] buffer = new byte[4096];
```

**What it does:** Allocate a new 4096-byte buffer for the disk-to-HTTP copy.

**Why it is here:** This buffer belongs to a different scope/copy stage than line 86's buffer.

**Syntax on this line:** new: Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task. byte: A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1. []: An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l121"></a>

### Line 121 (code)

```java
                        int bytesRead;
```

**What it does:** Declare the count returned by staging-file reads.

**Why it is here:** The response must receive exactly the bytes read per iteration.

**Syntax on this line:** int: A primitive signed 32-bit integer, used here for ports, indexes and byte counts. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l122"></a>

### Line 122 (code)

```java
                        while ((bytesRead = fis.read(buffer)) != -1) {
```

**What it does:** Read staging chunks until file EOF.

**Why it is here:** All staged bytes must be copied to the HTTP response.

**Syntax on this line:** while: Repeat while a condition is true; test it before each iteration. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison. == / !=: Equality/inequality. == null tests missing reference; String content should use equals.

<a id="downloadhandler-l123"></a>

### Line 123 (code)

```java
                            os.write(buffer, 0, bytesRead);
```

**What it does:** Write exactly bytesRead bytes to HTTP output.

**Why it is here:** Using the count preserves the file when the final chunk is short.

**Example / read it aloud:** This is the transfer from server to recipient HTTP client.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l124"></a>

### Line 124 (brace)

```java
                        }
```

**What it does:** Close the block opened on line 122: while ((bytesRead = fis.read(buffer)) != -1) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 122's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l125"></a>

### Line 125 (brace)

```java
                    }
```

**What it does:** Close the block opened on line 119: FileInputStream fis = new FileInputStream(tempFile)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 119's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l126"></a>

### Line 126 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l127"></a>

### Line 127 (code)

```java
                    fileSharer.cleanupAfterDownload(port);
```

**What it does:** Ask FileSharer to remove the original file and registry entries for port.

**Why it is here:** The happy path should invalidate the consumed PIN and remove its original temporary copy.

**Example / read it aloud:** This runs only after the HTTP-copy try finishes successfully.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** An HTTP write failure jumps to cleanup/catch before this call; original/maps can remain.

<a id="downloadhandler-l128"></a>

### Line 128 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="downloadhandler-l129"></a>

### Line 129 (code)

```java
                } finally {
```

**What it does:** Begin the finally block for the staging-file try.

**Why it is here:** It attempts local staging cleanup whether sending succeeds or throws.

**Syntax on this line:** finally: Run cleanup when control leaves its associated try under normal Java unwinding, including return/exception paths; forced termination can prevent it. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l130"></a>

### Line 130 (comment)

```java
                    // Always delete temp file
```

**What it does:** This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line 131: Check whether staging still exists.

**Why it is here:** Comments record the author's intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.

**Actual behavior / caution:** finally attempts deletion; File.delete can fail and its result is ignored.

<a id="downloadhandler-l131"></a>

### Line 131 (code)

```java
                    if (tempFile.exists()) {
```

**What it does:** Check whether staging still exists.

**Why it is here:** Deletion is attempted only for a currently present path.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

**Actual behavior / caution:** finally attempts deletion; File.delete can fail and its result is ignored.

<a id="downloadhandler-l132"></a>

### Line 132 (code)

```java
                        tempFile.delete();
```

**What it does:** Attempt to delete the staging file.

**Why it is here:** Staging is no longer needed once this handler leaves its transfer attempt.

**Example / read it aloud:** File.delete returns boolean, ignored here.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

**Actual behavior / caution:** The earlier comment "Always delete" means always attempt on this cleanup path, not guaranteed success. finally attempts deletion; File.delete can fail and its result is ignored.

<a id="downloadhandler-l133"></a>

### Line 133 (brace)

```java
                    }
```

**What it does:** Close the block opened on line 131: if (tempFile.exists()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 131's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l134"></a>

### Line 134 (brace)

```java
                }
```

**What it does:** Close the block opened on line 129: } finally {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 129's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l135"></a>

### Line 135 (brace)

```java
            }
```

**What it does:** Close the block opened on line 79: try (Socket socket = new Socket("localhost", port)) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 79's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l136"></a>

### Line 136 (code)

```java
        } catch (IOException e) {
```

**What it does:** Catch IOException from the download try after owned resources are unwound.

**Why it is here:** Socket, file and HTTP I/O can fail independently.

**Syntax on this line:** catch: Handle a matching exception thrown from the associated try; it does not catch failures in another thread. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l137"></a>

### Line 137 (code)

```java
            System.err.println("Error downloading file from peer: " + e.getMessage());
```

**What it does:** Log the failure description to standard error.

**Why it is here:** The phrase peer is a log label; the intended socket is local server-to-server-component communication.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="downloadhandler-l138"></a>

### Line 138 (code)

```java
            String response = "Error downloading file: " + e.getMessage();
```

**What it does:** Build a text error message containing the exception description.

**Why it is here:** The author sends a caller-visible reason for failed I/O.

**Example / read it aloud:** Raw exception messages can reveal implementation details.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison. +: Numeric addition for numbers; text concatenation when a String operand is involved.

<a id="downloadhandler-l139"></a>

### Line 139 (code)

```java
            headers.add("Content-Type", "text/plain");
```

**What it does:** Add text/plain as an error MIME type.

**Why it is here:** The intended new body is a text error, not file bytes.

**Example / read it aloud:** If attachment headers already exist, add does not remove them.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l140"></a>

### Line 140 (code)

```java
            exchange.sendResponseHeaders(500, response.getBytes().length);
```

**What it does:** Attempt to send 500 and the error text length.

**Why it is here:** A pre-response socket/file failure can be reported as a server error.

**Example / read it aloud:** If 200 headers were already sent, a second status cannot reliably replace them and this call may itself fail.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l141"></a>

### Line 141 (code)

```java
            try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Acquire the error response stream in try-with-resources.

**Why it is here:** The error body must also close its output resource.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="downloadhandler-l142"></a>

### Line 142 (code)

```java
                os.write(response.getBytes());
```

**What it does:** Write the error message bytes.

**Why it is here:** It completes the attempted error response when headers/body are still writable.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="downloadhandler-l143"></a>

### Line 143 (brace)

```java
            }
```

**What it does:** Close the block opened on line 141: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 141's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l144"></a>

### Line 144 (brace)

```java
        }
```

**What it does:** Close the block opened on line 136: } catch (IOException e) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 136's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l145"></a>

### Line 145 (brace)

```java
    }
```

**What it does:** Close the block opened on line 28: public void handle(HttpExchange exchange) throws IOException {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 28's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="downloadhandler-l146"></a>

### Line 146 (brace)

```java
}
```

**What it does:** Close the block opened on line 20: public class DownloadHandler implements HttpHandler {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 20's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

### Pause and Check Your Understanding

**Question:** Why connect to localhost?

**Answer:** The FileSharer listener runs on the Java server host; the uploader browser does not run that listener.

**Question:** Why save the TCP bytes before sending HTTP?

**Answer:** The staging file gives a known response length, at the cost of extra disk I/O and latency.

**Question:** Does finally guarantee that tempFile.delete succeeded?

**Answer:** No. It guarantees execution reaches cleanup under normal Java unwinding; delete returns a boolean that this code ignores.

<a id="corshandler"></a>

## CORSHandler.java

**Source:** [handler/CORSHandler.java](../src/main/java/P2P/handler/CORSHandler.java)

**Purpose:** Respond to root-context preflight and give unmatched ordinary requests a 404.

**Who calls it:** HttpServer invokes handle for its / fallback context.

**Picture it:** A reception desk that answers browser permission checks or says the route does not exist.

**Snapshot SHA-256:** `b21d2eae660baf22ff2864becf8a05b6c6a2b875c16c8731226f2743ca904a4a`

<a id="corshandler-l1"></a>

### Line 1 (package)

```java
package P2P.handler;
```

**What it does:** Declare that this file's types belong to the P2P.handler package.

**Why it is here:** Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.

**Example / read it aloud:** The directory below src/main/java follows the package parts. The fully qualified class name includes P2P.handler.

<a id="corshandler-l2"></a>

### Line 2 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="corshandler-l3"></a>

### Line 3 (import)

```java
import java.io.IOException;
```

**What it does:** Make the type java.io.IOException available by its short name IOException. A checked exception type for input/output failures.

**Why it is here:** Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.IOException where IOException is used.

<a id="corshandler-l4"></a>

### Line 4 (import)

```java
import java.io.OutputStream;
```

**What it does:** Make the type java.io.OutputStream available by its short name OutputStream. A base class for writing bytes to a destination.

**Why it is here:** HTTP responses and socket sends use its write methods; it is not specific to text. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name java.io.OutputStream where OutputStream is used.

<a id="corshandler-l5"></a>

### Line 5 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="corshandler-l6"></a>

### Line 6 (import)

```java
import com.sun.net.httpserver.Headers;
```

**What it does:** Make the type com.sun.net.httpserver.Headers available by its short name Headers. The HTTP header collection type from the JDK server API.

**Why it is here:** Handlers read incoming metadata or add/set outgoing metadata. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.Headers where Headers is used.

<a id="corshandler-l7"></a>

### Line 7 (import)

```java
import com.sun.net.httpserver.HttpExchange;
```

**What it does:** Make the type com.sun.net.httpserver.HttpExchange available by its short name HttpExchange. One HTTP request and its response channel.

**Why it is here:** handle receives this object to inspect method/URI/headers and access body streams. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.HttpExchange where HttpExchange is used.

<a id="corshandler-l8"></a>

### Line 8 (import)

```java
import com.sun.net.httpserver.HttpHandler;
```

**What it does:** Make the type com.sun.net.httpserver.HttpHandler available by its short name HttpHandler. The interface with handle(HttpExchange).

**Why it is here:** implements HttpHandler allows a class to be registered as a server context handler. An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.

**Example / read it aloud:** Without this import you could write the fully qualified name com.sun.net.httpserver.HttpHandler where HttpHandler is used.

<a id="corshandler-l9"></a>

### Line 9 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="corshandler-l10"></a>

### Line 10 (code)

```java
public class CORSHandler implements HttpHandler {
```

**What it does:** Declare CORSHandler as a class implementing HttpHandler.

**Why it is here:** HttpServer contexts expect an object with the handle(HttpExchange) contract.

**Example / read it aloud:** implements is interface conformance; it does not mean this class inherits a concrete implementation.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. class: Defines a named type and its members. A class declaration does not construct an instance. implements: Declare conformance to an interface contract such as HttpHandler or Runnable. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="corshandler-l11"></a>

### Line 11 (code)

```java
    @Override
```

**What it does:** Use @Override to tell the compiler that handle implements an existing contract.

**Why it is here:** It catches signature mistakes when writing the handler.

**Syntax on this line:** Override: Compiler-checked annotation for a method overriding/implementing an inherited contract. It does not invoke the method.

<a id="corshandler-l12"></a>

### Line 12 (code)

```java
    public void handle(HttpExchange exchange) throws IOException {
```

**What it does:** Declare handle with one exchange object representing this request/response, and allow IOException.

**Why it is here:** The server invokes this method per request; exchange supplies method, headers and response body.

**Syntax on this line:** public: Visibility: code outside this package can access the member/type when its containing type permits it. void: This method returns no value. return; exits it without a result. throws: Declare that a checked exception may propagate to the caller. This is not an exception handler. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="corshandler-l13"></a>

### Line 13 (code)

```java
        Headers headers = exchange.getResponseHeaders();
```

**What it does:** Get the mutable response-header collection into headers.

**Why it is here:** The following additions describe the response sent to the browser.

**Example / read it aloud:** These are not the incoming request headers.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="corshandler-l14"></a>

### Line 14 (code)

```java
        headers.add("Access-Control-Allow-Origin", "*");
```

**What it does:** Add Access-Control-Allow-Origin with wildcard *.

**Why it is here:** A cross-origin browser can read eligible responses under wildcard CORS rules.

**Example / read it aloud:** This is browser policy, not authentication or a restriction on curl callers.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="corshandler-l15"></a>

### Line 15 (code)

```java
        headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
```

**What it does:** Advertise GET, POST and OPTIONS as permitted cross-origin methods.

**Why it is here:** A browser preflight can see which methods the API allows.

**Example / read it aloud:** This header does not implement those routes or override later method checks.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="corshandler-l16"></a>

### Line 16 (code)

```java
        headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");
```

**What it does:** Allow Content-Type and Authorization as requested cross-origin headers.

**Why it is here:** A preflight can permit these header names on the actual request.

**Example / read it aloud:** Allowing Authorization does not parse/verify credentials.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="corshandler-l17"></a>

### Line 17 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="corshandler-l18"></a>

### Line 18 (code)

```java
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
```

**What it does:** Check case-insensitively whether the incoming request method is OPTIONS.

**Why it is here:** This selects the browser-permission-check response branch.

**Syntax on this line:** if: Run the controlled statement/block only when its condition is true. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.

<a id="corshandler-l19"></a>

### Line 19 (code)

```java
            exchange.sendResponseHeaders(204, -1);
```

**What it does:** Send status 204 and response length -1, meaning no response body.

**Why it is here:** A preflight reply can provide permission headers without file bytes or a text payload.

**Example / read it aloud:** 204 is No Content; -1 is this API's no-body signal, not chunked length 0.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="corshandler-l20"></a>

### Line 20 (code)

```java
            return;
```

**What it does:** Return from handle immediately.

**Why it is here:** The same exchange must not fall through to send a 404 as a second response.

**Syntax on this line:** return: Exit the current method now. In a helper it exits that helper; in handle it ends that request callback. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="corshandler-l21"></a>

### Line 21 (brace)

```java
        }
```

**What it does:** Close the block opened on line 18: if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 18's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="corshandler-l22"></a>

### Line 22 (blank)

```java

```

**What it does:** A blank line; it performs no operation.

**Why it is here:** Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.

<a id="corshandler-l23"></a>

### Line 23 (code)

```java
        String response = "NOT FOUND";
```

**What it does:** Create the fallback text NOT FOUND.

**Why it is here:** Ordinary unmatched requests need a clear error body.

**Syntax on this line:** String: An immutable text object. String comparisons use equals for contents, not == for object identity. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="corshandler-l24"></a>

### Line 24 (code)

```java
        exchange.sendResponseHeaders(404, response.getBytes().length);
```

**What it does:** Send a 404 status and the byte length of that text.

**Why it is here:** The receiver must know the status and expected body length before reading.

**Example / read it aloud:** The size is encoded bytes, not merely Java String character count.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="corshandler-l25"></a>

### Line 25 (code)

```java
        try (OutputStream os = exchange.getResponseBody()) {
```

**What it does:** Get the HTTP response OutputStream inside try-with-resources.

**Why it is here:** The handler needs a stream for the body; closing it releases/completes the response stream even on write failure.

**Syntax on this line:** try: Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources. (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. =: Assign the right-side value to the left variable. It is not equality comparison.

<a id="corshandler-l26"></a>

### Line 26 (code)

```java
            os.write(response.getBytes());
```

**What it does:** Encode NOT FOUND and write the bytes to the response body.

**Why it is here:** Sending headers alone would not send the text payload promised by the response length.

**Syntax on this line:** (): Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax. .: Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access. ;: End a Java statement/declaration; also separate for-loop clauses or try resource declarations.

<a id="corshandler-l27"></a>

### Line 27 (brace)

```java
        }
```

**What it does:** Close the block opened on line 25: try (OutputStream os = exchange.getResponseBody()) {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 25's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="corshandler-l28"></a>

### Line 28 (brace)

```java
    }
```

**What it does:** Close the block opened on line 12: public void handle(HttpExchange exchange) throws IOException {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 12's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

<a id="corshandler-l29"></a>

### Line 29 (brace)

```java
}
```

**What it does:** Close the block opened on line 10: public class CORSHandler implements HttpHandler {

**Why it is here:** Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.

**Example / read it aloud:** Match this } back to line 10's { before deciding which method, loop, condition or resource lifetime has ended.

**Syntax on this line:** {}: Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.

### Pause and Check Your Understanding

**Question:** Does allowing Authorization verify a JWT?

**Answer:** No. It only allows the browser to send that header; no token verification is performed by this handler.

**Question:** Why return after the 204?

**Answer:** Without it, execution would attempt to send the unrelated 404 response on the same exchange.

**Question:** What does try-with-resources close here?

**Answer:** The HTTP response OutputStream, not all server resources.

## Trace a Complete Transfer by Source Lines

1. App L14/L17/L18 -> FileController L28-L46/L52: compute API port, build shared service/handlers and start HTTP.

2. UploadHandler L94-L178: return early for preflight, wrong method, rate/type/declared-size rejection.

3. UploadHandler L184-L221 -> MultiParser L50-L91: extract boundary, accumulate envelope, parse headers and copy payload.

4. UploadHandler L268-L277 -> FileSharer L66-L74/L136-L160: save disk, register path/PIN, start a listener thread.

5. UploadHandler L282-L286: return JSON; the browser displays/shares the PIN.

6. DownloadHandler L52-L79 -> FileSharer L94-L100: extract query PIN, find actual port, reject missing lookup, connect locally.

7. FileSharer L179-L196 -> DownloadHandler L88-L103: sender writes filename/newline plus disk bytes, receiver stages bytes until EOF.

8. DownloadHandler L106-L127 -> FileSharer L118-L131: set HTTP attachment, copy staged file, attempt original deletion and remove maps. L129-L132 attempts staging deletion.

For current timeout/race/partial-transfer behavior, read the cautions at those exact lines. Proposed improvements are explanations, not changes to the Java implementation.

## Library Contracts Used for Accuracy

[JDK HttpServer](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpServer.html), [HttpExchange response lengths](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpExchange.html), [Socket read timeout](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/Socket.html), [ServerSocket accept/bind](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/ServerSocket.html), [ConcurrentHashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html), [ExecutorService shutdown](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ExecutorService.html), [File.delete/deleteOnExit](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/File.html).

## Snapshot Maintenance

The reader includes the source snapshot so it works offline. If Java source changes, rerun `node docs/code-walkthrough/build.cjs` and update annotations for any changed line meaning. Line-number coverage checks cannot prove that an explanation still matches a changed statement; review the content too.
