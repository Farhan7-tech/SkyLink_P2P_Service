# SkyLink Interview Question Bank

80 project-specific questions with model answers: 20 beginner, 30 intermediate and 30 advanced. Read [the beginner guide and two-day plan](../INTERVIEW_PREP.md), use [interactive flashcards](learning/index.html#drill), and run [the local exercise](HOW_TO_RUN.md).

Try each answer aloud before reading. Use a direct answer, mechanism, source example and trade-off. Model answers describe current code unless explicitly labeled proposed. They are not a claim that every possible interview question is included.

## Beginner (20)

### Q1. What does SkyLink's P2P service do?

**Topic:** Architecture

It provides temporary file sharing by PIN. A browser uploads to a Java HTTP server, which stores the bytes, registers a port/PIN and starts a file socket listener. Another HTTP request with the PIN retrieves the bytes through a local TCP connection. Successful-path cleanup attempts to delete the file and removes its registry entries.

**Code to explain:** UploadHandler.handle; FileSharer; DownloadHandler.handle

### Q2. How is this different from the main SkyLink backend?

**Topic:** Architecture

The main backend uses Spring Boot, Clerk identity, MongoDB, credits and payments for persistent files. This service uses JDK HttpServer, local temporary disk and in-memory PIN maps. It does not verify Clerk tokens or consume upload credits.

**Code to explain:** FileController; main app FileMetadataService and SecurityConfig

### Q3. Is the current transfer directly browser-to-browser?

**Topic:** Architecture

No. Both browsers call the server over HTTP; all payload bytes pass through server memory/disk. The TCP listener and its connecting download handler run on the Java server. A direct browser data channel would require another design such as WebRTC.

**Code to explain:** UploadHandler; DownloadHandler; FileSharer.startFileServer

### Q4. Why can this service run without Spring Boot?

**Topic:** Java

The JDK supplies HttpServer and Java networking classes. FileController manually constructs handlers and their shared FileSharer dependency. The POM has test dependencies, but no Spring application dependency. This trades framework conveniences for explicit routing, validation and lifecycle code.

**Code to explain:** pom.xml; FileController constructor

### Q5. Where does execution begin?

**Topic:** Java

P2P.App.main reads PORT or 8081, starts FileController and registers a shutdown hook. It then joins its own main thread to wait indefinitely. A malformed numeric PORT is an unchecked failure outside its two exception catches.

**Code to explain:** App.main

### Q6. What is a port, and which ports are used?

**Topic:** Networking

A port selects a network endpoint on a host. The HTTP API defaults to 8081. UploadUtils generates per-file candidate ports inclusively from 49152 through 65535. The registry checks candidates, but only an actual socket bind establishes OS availability.

**Code to explain:** App.main; UploadUtils.generatePort; FileSharer.offerFile

### Q7. What is the difference between HTTP and TCP here?

**Topic:** Networking

HTTP describes browser requests and responses with methods, URLs, headers and bodies. TCP supplies an ordered byte stream. Inside the server a simple TCP protocol writes a filename line followed by payload bytes; the browser receives an HTTP attachment.

**Code to explain:** DownloadHandler; FileSharer.FileSenderHandler

### Q8. What do Socket and ServerSocket do?

**Topic:** Networking

ServerSocket listens and accept waits for an incoming connection. Socket represents a connection with input/output streams. FileSharer listens; DownloadHandler connects to localhost and reads from the accepted sender connection.

**Code to explain:** FileSharer.startFileServer; DownloadHandler.handle

### Q9. What is FormData used for?

**Topic:** Upload

The React Share page puts the selected File into a FormData field named file. The browser serializes it as multipart/form-data with headers and boundary delimiters. The service extracts the filename, claimed MIME and payload from that envelope.

**Code to explain:** main UI Share.handleFileUpload; MultiParser.parse

### Q10. What is a multipart boundary?

**Topic:** Upload

It is a delimiter named in the request Content-Type that separates multipart sections. MultiParser looks for CRLF plus the boundary to locate the end of the file bytes. It needs the exact browser-supplied boundary; guessing the header independently from the body breaks parsing.

**Code to explain:** UploadHandler boundary extraction; MultiParser.parse

### Q11. Where are uploaded files stored?

**Topic:** Upload

Under java.io.tmpdir/SkyLink-uploads, using a UUID-prefixed basename. The upload is first fully buffered and parsed in memory. A download creates a second temporary staging file. There is no database file collection in this service.

**Code to explain:** FileController.uploadDir; UploadHandler disk write; DownloadHandler tempFile

### Q12. What does the six-digit PIN mean?

**Topic:** Security

It is a bearer secret: knowledge of the code allows lookup of a share. Random produces a value from 100000 through 999999. The current code does not ensure global PIN uniqueness, cryptographic unpredictability or download attempt limits.

**Code to explain:** FileSharer.generateAccessToken; getPortByToken

### Q13. What do the two maps store?

**Topic:** State

availableFiles maps port to a FileInfo containing disk path and uploader host. accessTokens maps port to PIN. Both belong to the same FileSharer shared by upload and download handlers. Restart destroys both maps even if temporary disk files remain.

**Code to explain:** FileSharer fields and constructor; FileController constructor

### Q14. What checks run before storing a file?

**Topic:** Upload

Method, per-IP attempt counter, multipart Content-Type, declared/accumulated body length, boundary/parser result, extracted payload size, extension and claimed MIME. Allowed metadata does not prove contents are harmless. Some unchecked input errors are not converted into structured responses.

**Code to explain:** UploadHandler.handle

### Q15. What do 400, 403, 405, 413, 415 and 429 mean here?

**Topic:** API

400 means malformed upload; 403 means missing or unknown download PIN; 405 means wrong method; 413 means size limit exceeded; 415 means extension/MIME rejected; 429 means upload attempt counter exceeded. Socket/I/O errors can return 500.

**Code to explain:** UploadHandler.handle; DownloadHandler.handle

### Q16. What is CORS?

**Topic:** Browser

It is a browser policy governing reading responses from another origin. These handlers allow wildcard origins and answer OPTIONS. It does not authenticate callers and cannot stop a command-line client from sending requests.

**Code to explain:** CORSHandler; UploadHandler and DownloadHandler headers

### Q17. What do Blob and object URL do during download?

**Topic:** Browser

Axios asks for blob data. Share wraps the bytes in a Blob, creates an object URL and a temporary anchor with the download filename, clicks it, then revokes/removes them. Blob handling is in the browser, after the server's HTTP response.

**Code to explain:** main UI Share.handleDownload

### Q18. When is the file removed?

**Topic:** Lifecycle

After DownloadHandler finishes its successful HTTP-copy path, it calls cleanupAfterDownload. That attempts original deletion and removes maps; staging deletion runs in finally. Listener timeout and failed paths do not reliably delete the original or invalidate the PIN.

**Code to explain:** DownloadHandler.handle; FileSharer.cleanupAfterDownload

### Q19. Why is there a 50-second timeout?

**Topic:** Networking

The listener limits its blocking accept wait to 50000 milliseconds so it does not listen forever. When that wait expires, the exception is logged and the listener closes. There is no expiry cleanup in that catch, so a stale share remains registered.

**Code to explain:** FileSharer.startFileServer

### Q20. How do you build and test the repository?

**Topic:** Testing

With an installed JDK 17+ and Maven, run mvn -B clean verify. Ten JUnit tests cover parser and registry/helper behavior. java -jar target/P2P-1.0-SNAPSHOT.jar starts the API. CI runs mvn -B test using Java 17.

**Code to explain:** pom.xml; src/test; .github/workflows/ci.yml

## Intermediate (30)

### Q21. Trace an upload from the React click to the returned PIN.

**Topic:** Upload

Dropzone calls Share with one File; Share posts FormData to the P2P base URL. UploadHandler validates and buffers the request; MultiParser extracts bytes and metadata; the handler writes a UUID-prefixed temp file. offerFile inserts the path/host and PIN under a port. A new listener thread starts, then HTTP returns port/token JSON. Listener readiness is not confirmed first.

**Code to explain:** main UI FileUpload/Share; UploadHandler; FileSharer

### Q22. Trace a download from the entered PIN to the saved browser file.

**Topic:** Download

FileDownload calls onDownload with dummy port 0. DownloadHandler reverse-looks up PIN, connects to localhost, reads the filename line and remaining bytes into staging disk, and responds with attachment headers. Share builds a Blob/object URL download. Successful server-copy cleanup removes maps/original; staging deletion runs in finally.

**Code to explain:** main UI FileDownload/Share; DownloadHandler

### Q23. Why search payload boundaries as bytes rather than decode the payload as text?

**Topic:** Parsing

Arbitrary files contain bytes that are not valid text. The parser copies payload from the original byte array, and a unit test covers all byte values. However it still finds header positions in a whole-body String, then reuses them as byte offsets, which is unsafe for some non-ASCII headers.

**Code to explain:** MultiParser.parse; MultiParserTest.keepsBinaryContentIntact

### Q24. What is the complexity of findSequence?

**Topic:** Parsing

For n input bytes and an m-byte marker, its nested candidate/comparison loops have worst-case O(n*m) time and constant search workspace. parse also creates a whole-body String and payload copy, so overall memory is proportional to upload size. A previous commit label mentioning optimization does not change the actual loop complexity.

**Code to explain:** MultiParser.findSequence and parse

### Q25. Why does DownloadHandler connect to localhost instead of uploaderHost?

**Topic:** Networking

The per-file listener was created inside this Java service, and the upload's bytes are on its disk. uploaderHost describes the HTTP client's address; that client is not running the listener. The incoming networking fix correctly addresses the server's own listener via localhost.

**Code to explain:** DownloadHandler Socket construction; UploadHandler listener thread

### Q26. Does the downloader need to connect to the random port directly?

**Topic:** Networking

The intended browser path does not. It calls the API download context, and the handler performs the random-port TCP connection internally. The returned port is not needed by the current PIN-only frontend. The listener nevertheless binds wildcard in current code, which may expose a separate bypass if network rules permit access.

**Code to explain:** main UI FileDownload; FileSharer.startFileServer

### Q27. Why are HTTP and socket work put on different threads?

**Topic:** Concurrency

Blocking upload/download handlers occupy HTTP workers; each per-file listener waits independently on accept and each sender writes independently. That keeps waiting listeners out of the HTTP pool, but it creates additional unbounded threads. Ten HTTP workers are not a cap on total transfer resource use.

**Code to explain:** FileController executor; UploadHandler new Thread; FileSharer sender thread

### Q28. Is the fixed pool of ten a complete overload strategy?

**Topic:** Concurrency

No. It limits executing HTTP tasks to ten but the standard fixed pool has an unbounded queue, and listener/sender threads are outside it. Large requests can consume memory/disk even with a worker cap. Production control needs bounded queues, transfer limits and explicit rejection/backpressure.

**Code to explain:** FileController Executors.newFixedThreadPool; UploadHandler

### Q29. Why use ConcurrentHashMap, and what does it not solve?

**Topic:** Concurrency

Handlers run concurrently, so map operations need safe access. ConcurrentHashMap provides that for its supported operations. It does not make containsKey followed by put atomic, synchronize two separate maps, reserve an OS port, or make mutable UploadInfo increments safe.

**Code to explain:** FileSharer.offerFile; UploadHandler.uploadTracker

### Q30. How does PIN reverse lookup scale?

**Topic:** State

getPortByToken scans all entries in accessTokens, so it is O(number of pending shares). A direct token-to-transfer map would make lookup efficient and could simplify atomic claims. It still needs unique token insertion and coordinated expiry/cleanup.

**Code to explain:** FileSharer.getPortByToken

### Q31. Explain the difference between accept timeout and transfer deadline.

**Topic:** Lifecycle

ServerSocket SO_TIMEOUT applies to accept; Socket SO_TIMEOUT applies to reads. Neither setting here creates a complete upload/download deadline or bounds blocked writes. The sender sets a read timeout but mainly writes. DownloadHandler's socket lacks explicit connect/read timeout configuration.

**Code to explain:** FileSharer.startFileServer/FileSenderHandler; DownloadHandler

### Q32. What does try-with-resources achieve here?

**Topic:** Java

It closes registered AutoCloseable resources when the block exits, including exceptions. The listener, connecting socket, file streams and HTTP response streams use it. It does not delete files or remove map entries automatically; those need explicit cleanup. Closing a listening socket does not close an already accepted client socket.

**Code to explain:** FileSharer; DownloadHandler; UploadHandler

### Q33. Why prefix filenames with a UUID?

**Topic:** Upload

It reduces accidental overwrite collisions for uploads with the same basename. new File(filename).getName strips host-platform directory components before storage. That is not complete cross-platform untrusted-name validation. The current sender uses the stored basename, so users receive the UUID prefix too.

**Code to explain:** UploadHandler uniqueFileName; FileSenderHandler header

### Q34. Are extension and MIME allowlists enough to establish safety?

**Topic:** Security

No. Both filename and part Content-Type come from the client. MIME matching uses startsWith, and octet-stream is allowed. A renamed or forged file can pass. Safer storage/headers and content checks may be needed depending on the threat model; these checks are not malware scanning.

**Code to explain:** UploadHandler isAllowedExtension/isAllowedMimeType

### Q35. Why are size checks repeated?

**Topic:** Upload

Declared Content-Length enables early rejection; accumulated reads enforce a limit even without a trustworthy length; extracted payload checks defend after parsing. Request-envelope checks include multipart overhead. The whole request still accumulates in heap, so repeated limits do not make the path streaming.

**Code to explain:** UploadHandler.handle

### Q36. How does the upload rate limiter work and where is it weak?

**Topic:** Security

A static IP-to-UploadInfo map tracks a window and mutable count. After ten counted POST attempts in the active window it returns 429. Concurrent increments/resets are not atomic, entries are never evicted, and a reverse proxy may collapse clients onto one visible IP. Download guessing has no analogous limit.

**Code to explain:** UploadHandler.uploadTracker and handle

### Q37. Why expose Content-Disposition in CORS?

**Topic:** Browser

The browser needs that response header to learn the attachment filename across origins. DownloadHandler adds Access-Control-Expose-Headers for it. Exposing a header is separate from permitting an origin and from validating access to the file.

**Code to explain:** DownloadHandler headers; main UI Share filename parsing

### Q38. What do the current ten tests prove?

**Topic:** Testing

Five registry/helper tests cover basic token/port mapping and cleanup; five parser tests cover a normal part, binary payload, default MIME, missing filename and missing closing boundary. They do not exercise real HTTP/socket transfers, races, port bind failures, expiry, large files or adversarial input.

**Code to explain:** FileSharerTest; MultiParserTest

### Q39. Why use PORT and a two-stage Docker build?

**Topic:** Deployment

PORT lets a host choose the public API listening port. A two-stage build separates Maven compilation from runtime files, reducing build-tool inclusion. The local ignored Dockerfile uses Java 21, skips tests and runs the original jar. EXPOSE documents a port; it does not set the Java listening port.

**Code to explain:** App.main; local Dockerfile; pom.xml

### Q40. What changes when the process restarts?

**Topic:** Lifecycle

All maps and listeners disappear, making old PINs unusable even if files remain on disk. There is no persisted registry restoration or startup orphan sweep. Shutdown stops the HTTP server/executor, but does not comprehensively coordinate per-file threads and file deletion.

**Code to explain:** FileSharer fields; FileController.stop; App shutdown hook

### Q41. Why does /download/0 work, and is routing exact?

**Topic:** API

HttpServer matches context path prefixes, so /download/0 reaches the /download handler. The handler ignores path port and uses only token query lookup. Prefix registration is not exact routing; explicit path validation would be needed if suffixes must be restricted.

**Code to explain:** FileController.createContext; DownloadHandler query parsing

### Q42. Is a one-time listener the same as exactly-once delivery?

**Topic:** Lifecycle

No. One accept limits connections, but failures can happen after acceptance or while returning HTTP. There is no atomic PIN claim, recipient acknowledgment or retry protocol. The sender's successful write does not prove browser persistence, and EOF can follow a truncated send.

**Code to explain:** FileSharer.startFileServer/FileSenderHandler; DownloadHandler

### Q43. Does closing the uploader tab invalidate the PIN?

**Topic:** Browser

No invalidation request, heartbeat or unload handler implements that behavior in the inspected integration. After upload, the server owns the bytes and listener. UI text requests an open tab, but actual expiry is governed by server state and listener timeout, with incomplete cleanup.

**Code to explain:** main UI Share/InviteCode; FileSharer.startFileServer

### Q44. How does DownloadHandler know where payload begins and ends?

**Topic:** Networking

It reads a newline-terminated Filename header, then treats all remaining bytes until EOF as payload. TCP does not preserve application message boundaries, so framing is necessary. The current protocol has no byte count or checksum and the handler does not require a valid header before accepting payload.

**Code to explain:** DownloadHandler socketInput loop; FileSenderHandler

### Q45. Why does download stage to another file?

**Topic:** Memory

Staging lets the handler know the payload length before sending an HTTP response and keeps the main copy off heap. It adds disk writes/reads, latency and temporary disk consumption. It does not validate completeness because length/checksum are not supplied by the sender.

**Code to explain:** DownloadHandler tempFile and sendResponseHeaders

### Q46. Which frontend state belongs to temporary transfers?

**Topic:** Integration

Share stores selected file, upload/download flags, returned port/PIN and active tab. FileDownload stores entered PIN/error; InviteCode stores clipboard state. These are browser UI state, while FileSharer maps are backend transfer state. Changing a tab does not delete server state.

**Code to explain:** main UI Share, InviteCode, FileDownload

### Q47. How does Clerk authentication differ from PIN access?

**Topic:** Integration

A verified Clerk JWT identifies a user for main-backend protected operations. A PIN grants possession-based access to a temporary share without establishing user identity. Receiving Authorization in allowed CORS headers does not mean the P2P handlers verify a JWT.

**Code to explain:** main SecurityConfig/ClerkJwtAuthFilter; P2P handlers

### Q48. Does every file upload use MongoDB and consume a credit?

**Topic:** Integration

No. Main FileMetadataService stores fileContent in MongoDB and consumes a credit per persistent upload. Share posts to the separate P2P URL; these handlers use temporary disk and maps, with no UserCreditsService or database calls. Always identify the actual endpoint first.

**Code to explain:** main FileMetadataService; Share; UploadHandler

### Q49. What are authentication and authorization in the main SkyLink project?

**Topic:** Integration

Authentication establishes who the caller is; authorization checks whether that user may act on a resource. Main delete checks ownership, but togglePublic has no owner comparison and public download checks existence without a public/owner policy. A valid JWT alone is not permission for another user's file.

**Code to explain:** main SecurityConfig and FileMetadataService

### Q50. What does payment signature verification prove, and what else is needed?

**Topic:** Integration

The main service checks HMAC over order ID and payment ID. Correct fulfillment also needs stored-order ownership, canonical price/plan, provider payment status and a once-only grant. Current verification accepts client plan selection and can grant again on replay. P2P has no payment logic.

**Code to explain:** main PaymentService.verifyPayment/createOrder

## Advanced (30)

### Q51. Show a race in offerFile even with ConcurrentHashMap.

**Topic:** Concurrency

A and B both generate port P. A checks absent; B checks absent; A puts FileInfo A; B overwrites with FileInfo B. Token inserts can interleave independently, so a token/path pairing can become inconsistent. An atomic single-record reservation, followed by successful bind/readiness, would protect the workflow; individual safe map operations are insufficient.

**Code to explain:** FileSharer.offerFile

### Q52. Would putIfAbsent alone completely fix port allocation?

**Topic:** Concurrency

It would make one map's candidate reservation atomic, but does not bind the OS port, coordinate a second map, guarantee a unique PIN or roll back a failed listener. Prefer one transfer record and a lifecycle that reserves, binds, publishes readiness and compensates every failure, with bounded allocation attempts.

**Code to explain:** FileSharer.offerFile/startFileServer

### Q53. What happens if another process already owns the chosen port?

**Topic:** Networking

offerFile may register it because only its own map was checked. The later ServerSocket bind throws IOException and is logged; the upload may already have returned 200. The stale token/file remain. Binding before publishing readiness or using an OS-selected socket port avoids false readiness.

**Code to explain:** UploadHandler listener thread; FileSharer.startFileServer

### Q54. How would you eliminate the upload-response/listener-start race?

**Topic:** Concurrency

Create/bind the listener before reporting a usable transfer, or use a readiness future/latch whose successful result the handler waits for within a deadline. Publish token state only with readiness and return a controlled failure on bind/timeout. Test an immediate download and deliberate bind failure.

**Code to explain:** UploadHandler new Thread then JSON response

### Q55. What happens when two users download the same PIN simultaneously?

**Topic:** Concurrency

Both can reverse-look up the same port before cleanup. The listener accepts only one connection; the other may connect but not be served, be reset, or be refused depending on timing/backlog. There is no atomic claim. A compare-and-set transition from AVAILABLE to CLAIMED would select one owner and return a deliberate response to the other.

**Code to explain:** DownloadHandler getPortByToken; FileSharer accept once

### Q56. Design a precise transfer lifecycle.

**Topic:** Lifecycle

Proposed states: REGISTERING, AVAILABLE, CLAIMED, COMPLETED and EXPIRED/FAILED. Bind/validate before AVAILABLE; atomically claim by token; define when a failed claim can return to AVAILABLE; expire with time-based cleanup. Treat deletion as a retryable task rather than assuming it succeeded. State changes need synchronization across requests and cleanup workers.

**Code to explain:** proposed redesign grounded in FileSharer/DownloadHandler

### Q57. How would you make cleanup reliable without hiding failures?

**Topic:** Lifecycle

Centralize terminal transitions, close sockets, delete original/staging files and remove indexes according to policy. Record deletion failures and retry them; run an orphan sweep bounded by managed directory and retention. Current cleanup removes maps even if File.delete fails, so unreferenced files can persist. Test timeout, cancellation, disk failure and duplicate cleanup.

**Code to explain:** FileSharer.cleanupAfterDownload; DownloadHandler finally

### Q58. How would you make the IP limiter thread-safe and proxy-aware?

**Topic:** Concurrency

Use atomic map compute or immutable window records for check-and-increment, evict expired keys, and bound key count. Choose fixed/sliding-window or token-bucket behavior explicitly. Trust forwarded IP only from configured proxies; arbitrary header trust enables spoofing. Decide whether invalid attempts should count and add a separate PIN-attempt limiter.

**Code to explain:** UploadHandler.uploadTracker

### Q59. A PIN was issued one minute ago but returns 500. Why?

**Topic:** Debugging

A likely path is accept timeout: after 50 seconds without a connection, the listener closes but the maps and original file remain. PIN lookup succeeds, then localhost connection fails and DownloadHandler returns 500. Verify server logs and state first. Proper expiry should atomically invalidate the share and clean files, with an intentional API result.

**Code to explain:** FileSharer.startFileServer catch; DownloadHandler IOException catch

### Q60. What is the threat model of six-digit Random PINs?

**Topic:** Security

There are 900000 possible values and multiple live shares increase accidental collisions and guess success. Random is not intended for secret generation; no uniqueness check or failed-download limiter exists. Use SecureRandom, atomic uniqueness checks, longer tokens, short explicit expiry, attempt limits and safe logs. Rate limiting only uploads does not protect download secrets.

**Code to explain:** FileSharer.generateAccessToken/getPortByToken; DownloadHandler

### Q61. Can a direct TCP client bypass HTTP PIN validation?

**Topic:** Security

Potentially, if deployment networking exposes the listener. new ServerSocket(port) binds wildcard and FileSenderHandler sends immediately after accept without checking PIN. The HTTP handler's token validation is not a control on that separate socket. Bind loopback or authenticate the socket; directly serving authorized HTTP would remove this extra surface.

**Code to explain:** FileSharer.startFileServer/FileSenderHandler

### Q62. How would actual end-to-end encryption change this design?

**Topic:** Security

Client-side encryption before upload would let the server store/relay ciphertext; the recipient would decrypt with a key the server cannot obtain. Key exchange, authenticity and metadata leakage need design. HTTPS protects a transport connection but does not stop the server reading plaintext. No such cryptographic client protocol exists in current code.

**Code to explain:** main UI Share/FileDownload; P2P streams

### Q63. Which valid or hostile multipart cases are not covered?

**Topic:** Parsing

Non-ASCII names, multiple fields before the file, multiple files, boundary-like payload bytes, varied header casing/encoding, malformed quoting and empty files. String character positions are not universally byte offsets. Use a proven streaming parser with explicit limits and test cases; the current five parser tests only establish a narrow subset.

**Code to explain:** MultiParser.parse/findSequence; MultiParserTest

### Q64. Estimate heap pressure for several maximum-size uploads.

**Topic:** Memory

Do not calculate only count times payload size. ByteArrayOutputStream capacity, toByteArray copy, whole-body String, decoded temporary data and extracted payload can coexist. Thus each upload can require multiple payload-sized allocations, with charset/JDK details affecting exact values. Measure allocation/heap/GC under controlled load; add streaming and admission limits before claiming 500 MiB concurrency.

**Code to explain:** UploadHandler buffering; MultiParser.parse

### Q65. What is a simpler transfer architecture than the internal socket hop?

**Topic:** Design

Proposed: stream multipart to bounded temp storage, register a unique token/expiry, atomically claim it, then stream the authorized disk file directly to HTTP. This removes random ports, listener readiness races and staging through TCP. It changes the teaching/design purpose of the socket demonstration, so explain that trade-off and preserve explicit cleanup/integrity semantics.

**Code to explain:** proposed alternative to FileSharer/DownloadHandler

### Q66. How would you implement real browser P2P?

**Topic:** Design

A proposed WebRTC data-channel design would add signaling, peer connection negotiation, STUN/TURN connectivity and chunking/integrity/flow control. Relay fallback may still be necessary. It would remove this server-stored-byte path for successful direct connections, but increases connectivity and client lifecycle complexity. Current Java socket code cannot simply be called a browser data channel.

**Code to explain:** current Share HTTP calls; proposed WebRTC design

### Q67. Why does horizontal scaling break pending shares?

**Topic:** Deployment

Upload to instance A creates only A's maps and disk file. Download routed to B cannot find that PIN; B's localhost is B, not A. Sticky routing is one temporary option but fails with instance loss. Shared transfer metadata plus shared/object storage and atomic claims would support replicas; that is a proposed architecture.

**Code to explain:** FileController per-instance FileSharer; local uploadDir

### Q68. How would you scale SkyLink to many users?

**Topic:** Design

Start with concurrent request/file sizes and retention, not registered-user count alone. Fix owner policies/payment idempotency in the main backend; use metadata-only paginated queries and object storage as appropriate. For temporary transfers bound upload memory, disk, attempts and threads; define expiry and shared claims before replicas. Verify changes with measured load and failure tests.

**Code to explain:** main FileMetadataService/PaymentService; P2P resource paths

### Q69. What if the sender fails after writing half the file?

**Topic:** Networking

It logs IOException and closes the socket. DownloadHandler reads EOF and may treat the shorter staging file as complete because the protocol has no expected length/checksum. HTTP can return 200 for truncated content and then clean the original. Add declared length and integrity validation before deciding completion; TCP delivery alone does not validate application completeness.

**Code to explain:** FileSenderHandler.run catch/finally; DownloadHandler read until EOF

### Q70. What if the browser disconnects during the HTTP response?

**Topic:** Lifecycle

A write may throw before cleanupAfterDownload, leaving the original/maps even though the one-shot listener has already been consumed. The staging finally block still attempts deletion. A generic 500 cannot meaningfully replace headers already sent. Define cancellation, terminal state and retry policy and test disconnects at several positions.

**Code to explain:** DownloadHandler HTTP write, cleanup call and catch

### Q71. How would you bound connect, read and write stalls?

**Topic:** Networking

Use an unconnected Socket plus connect(endpoint, timeout), set a read timeout, cap header/payload lengths and propagate cancellation. Socket SO_TIMEOUT does not bound blocked writes; use an I/O model or supervised deadline that closes/cancels work. Limit overall transfer duration and concurrent jobs, with explicit cleanup on deadline.

**Code to explain:** DownloadHandler socket and unbounded header loop; FileSenderHandler

### Q72. Which tests would you add first?

**Topic:** Testing

HTTP upload/download hash integrity and retry; immediate-download readiness; bind failure and 50-second expiry cleanup; simultaneous upload reservation and two-download claim; multipart encodings/multiple fields; interrupted sender/browser and disk errors. Prioritize expected policy and reproducible failures, rather than tests mirroring getters. Current unit tests remain valuable but narrow.

**Code to explain:** src/test; reviewed handler/lifecycle gaps

### Q73. How do you test networking without flaky sleeps?

**Topic:** Testing

Use ephemeral API/test ports, readiness signals, deadlines and joinable tasks. Coordinate race interleavings with barriers/latches instead of hoping timing collides. Inject a clock/short expiry for expiry tests, ensure all sockets/threads/files close in teardown, and check exact bytes plus terminal state. Production currently lacks these seams; introducing them would be a focused testability change.

**Code to explain:** proposed testing for FileController/FileSharer

### Q74. How would you diagnose local success but remote failure?

**Topic:** Deployment

Trace the browser's actual base URL and HTTP status, host PORT binding, TLS termination/CORS, server logs, listener readiness and expiry. Check that download uses server loopback, not client IP. For multiple instances check routing/state locality. Do not assume a deployed version matches the local merged code; verify the deployed commit and networking configuration.

**Code to explain:** App; DownloadHandler loopback fix; main UI Share

### Q75. What caused this merge conflict and how was it resolved?

**Topic:** Git

Local changes modified generated jar/test-report files while incoming commits stopped tracking target. The four unresolved paths were generated output, so resolution removed them from the index and kept target ignored. Source changes, the localhost fix, tests and CI were preserved; clean verify regenerated binaries locally. A normal merge commit preserves both histories.

**Code to explain:** Git merge state; .gitignore; resolved target paths

### Q76. Why doesn't adding target to .gitignore fix already tracked artifacts?

**Topic:** Git

Ignore rules control untracked files; they do not remove existing tracked entries. Removing target files from the index stops tracking while generated files can remain/reappear locally. Avoiding binary build outputs reduces noise and modify/delete conflicts. Rebuild artifacts in CI or publish releases deliberately rather than commit every build.

**Code to explain:** .gitignore; incoming stop-tracking commit

### Q77. What would you monitor in production?

**Topic:** Observability

Pending/claimed/expired transfers, successful completions, cleanup failures, disk bytes, heap/GC, worker queue, listener/thread count, bind failures, upload/PIN rejection rates and latency. Use correlation IDs without logging secrets or file contents. A readiness check should consider resources; root 404 and simple startup logging are not full health checks.

**Code to explain:** FileController; current System.out/err paths; proposed metrics

### Q78. Why is Thread.currentThread().join unusual, and how would shutdown improve?

**Topic:** Java

The main thread waits for itself indefinitely, relying on process interruption/shutdown. It is not joining a worker's completion. A clearer lifecycle could use a latch or server ownership and preserve interrupt state. Shutdown should stop admission, coordinate in-flight work within a deadline, close listeners and apply pending-file retention/cleanup policy.

**Code to explain:** App.main; FileController.stop

### Q79. How do you describe your contribution without exaggeration?

**Topic:** Interview

Use a real change you can trace: problem, your decision, code you changed, verification and remaining limitation. For example, explain why a server-hosted listener must be reached locally and how to test binary transfer. Do not say you personally authored the merged fix unless that is true, or invent metrics/incidents. Distinguish your work from assistance, frameworks and provider behavior.

**Code to explain:** your actual work history; DownloadHandler and tests as explainable examples

### Q80. What three improvements would you prioritize and why?

**Topic:** Interview

For this service: protect PIN/socket access, make lifecycle claims/expiry/cleanup explicit and atomic, then stream/bound memory/threads/disk. These address unauthorized access, stale/broken shares and overload. For the combined main product also prioritize file ownership and once-only payment/credit fulfillment. Choose a scope, propose tests and state that these improvements are not implemented by this documentation merge.

**Code to explain:** review findings in INTERVIEW_PREP.md

## Further Reading

Timeout and map semantics: [JDK Socket](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/Socket.html), [JDK ServerSocket](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/ServerSocket.html), [JDK ConcurrentHashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html). A different browser-to-browser design would use [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API).

Source of truth for flashcards: learning/questions.js. Regenerate this reference with `node docs/learning/build-question-bank.cjs` after changing that data.
