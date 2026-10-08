# SkyLink P2P: Beginner Guide and Two-Day Interview Plan

Prepared from the local source on 8 October 2026. This guide describes the merged code, including the loopback download fix, the 10 JUnit tests, and CI. It separates implemented behavior from proposed improvements. Two days means focused preparation, not a promise of mastery. The question bank is comprehensive for this project, not every question any interviewer could ask.

Start with the [animated lesson](docs/learning/index.html), then use the [80 questions and answers](docs/QUESTION_BANK.md). The existing main SkyLink guide is at `D:\SKYLINK\INTERVIEW_PREP.md`; its older P2P networking and test observations predate this merge. Use this guide for the current P2P behavior.

## 1. Explain the project in plain English

Imagine a temporary parcel counter. You give the counter a file. It stores the file, gives you a six-digit collection code, and lets someone holding that code collect the file. After the server completes the successful download path, it attempts to delete the file and forgets the code.

The counter is the Java server. Both browsers talk to it using HTTP. Despite the P2P name, bytes pass through server memory and disk. There is no browser-to-browser WebRTC connection, no client socket listener, and no application end-to-end encryption. The server can read the file. Keeping the uploader tab open is not enforced after upload: no tab-close message invalidates the PIN in these files.

**Thirty-second interview answer:**

> SkyLink has a React frontend and two Java backends. The Spring Boot backend handles persistent files, identity, credits and payments. The separate P2P-named service uses the JDK HTTP server and Java TCP sockets for temporary PIN-based transfers. It validates and buffers an upload, saves it to temporary disk, registers a port and PIN, and starts a per-file listener. A download handler finds the port from the PIN, connects locally to that listener, stages the bytes and returns an HTTP attachment. The normal successful path removes the file and registry entries. I would improve expiry cleanup, token security and atomic transfer ownership before production use.

**Two-minute answer:** Add the three machines, the exact byte path below, the reason for `localhost`, the tests, and one concrete failure scenario. Describe your personal contribution accurately; source code does not prove who designed every part. Do not claim measured scale, encryption, or incidents without evidence.

## 2. The two SkyLink paths

| Concern | Persistent SkyLink | Temporary P2P service |
|---|---|---|
| Browser caller | Upload, Dashboard, MyFiles, PublicFileView | Share, FileUpload, InviteCode, FileDownload |
| Backend | Spring Boot, controllers/services/repositories | JDK HttpServer, HttpHandler, raw TCP |
| Identity | Clerk JWT for protected operations | PIN possession; no Clerk verification here |
| File storage | MongoDB document `fileContent` byte array | OS temporary directory plus in-memory maps |
| Credits | Persistent upload consumes credits | No credit deduction in this repository |
| Access | File IDs, public flag, ownership policy | Six-digit PIN reverse lookup |
| Retention | Stored until explicit deletion in current code | Successful-path cleanup; incomplete timeout/failure cleanup |
| Payments/support | Razorpay, transaction records, mail workflow | None |

Main UI integration is in `D:\SKYLINK\SkyLinkUI\src\pages\Share.jsx` and `src/components/{FileUpload,InviteCode,FileDownload}.jsx`. It calls `${VITE_API_BASE_URL}/upload` and `/download/0?token=PIN`. The hardcoded persistent API endpoints in `src/util/apiEndpoints.js` are a separate configuration path.

## 3. Beginner vocabulary

| Word | Meaning in this project |
|---|---|
| HTTP request | Browser asks a server to upload or download. Method, URL, headers and body describe the request. |
| TCP | Ordered byte-stream transport used by the internal file socket. Reads do not preserve write-message boundaries. |
| IP/host | Which machine to contact. Uploader IP identifies the browser's network endpoint, not the server's file listener. |
| Port | A numbered endpoint on a machine. The API defaults to 8081; each pending file gets a port between 49152 and 65535. |
| localhost/loopback | This machine. Inside DownloadHandler it means the Java server host. |
| ServerSocket | Listening socket. `accept()` waits for a connection. |
| Socket | Connected endpoint with input/output streams. |
| Stream/buffer | Read/write bytes a chunk at a time. A 4096-byte buffer does not mean the whole application uses only 4096 bytes. |
| Multipart/boundary | A browser upload envelope containing headers and file bytes, separated by a boundary marker. |
| MIME type | Claimed file type such as `application/pdf`. A client-supplied claim does not prove the file's actual contents. |
| Map | Lookup table. This service stores port -> FileInfo and port -> PIN. |
| Thread | A path of execution. A waiting socket can occupy a thread while other threads keep working. |
| Race | Two operations interleave and violate an assumption. Thread-safe maps do not make a multi-step workflow atomic. |
| CORS | Browser permission to read responses across origins. It is not login or protection against command-line callers. |
| Bearer secret | Whoever holds it can use it. The PIN is such a secret, not a verified user identity. |
| Cleanup | Close handles, delete temporary files, remove maps. These are distinct operations and can fail separately. |

Read timeout semantics carefully: `ServerSocket.setSoTimeout(50000)` limits blocking `accept()`. `Socket.setSoTimeout(...)` limits socket reads; it is not a deadline for writes or the entire transfer. See [JDK ServerSocket](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/ServerSocket.html) and [JDK Socket](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/Socket.html).

## 4. Complete P2P repository map

All eight production Java files and both test files were read. Generated `target/` binaries are build output, not source. Git history, README, POM, CI, ignore rules, Dockerfile and Maven configuration were also inspected.

| File | What to learn | Important behavior |
|---|---|---|
| `src/main/java/P2P/App.java` | Entry point, environment variables, lifecycle | Parses `PORT`, defaults to 8081, constructs/starts controller, registers shutdown hook, joins its own main thread to wait indefinitely. Bad numeric PORT is not handled by its IOException/InterruptedException catches. |
| `Controller/FileController.java` | Composition and routes | Creates one FileSharer shared by both handlers, HttpServer, temp directory and 10-thread HTTP executor. Registers `/upload`, `/download`, `/`. Context matching is by path prefix. `stop()` stops HTTP and shuts its executor; does not coordinate all file threads/files. |
| `handler/UploadHandler.java` | Validation, multipart, disk storage | OPTIONS 204; POST only; per-IP counter; multipart/header/body checks; MultiParser; extension/MIME checks; UUID-prefixed basename; disk write; offerFile; listener thread; JSON port/PIN. |
| `Utils/MultiParser.java` | Parsing headers vs binary bytes | Converts the complete body to String to locate headers; locates content end with byte search; copies payload. Supports the narrow single-file shape used by UI, not general multipart handling. Empty content returns null. |
| `Utils/UploadUtils.java` | Inclusive random bounds | `49152 + Random.nextInt(16384)`. Random candidate generation does not reserve an OS socket. |
| `Service/FileSharer.java` | Registry, listening, sending, cleanup | Two ConcurrentHashMaps; six-digit Random PIN; containsKey/put port registration; linear reverse lookup; listener binds/waits/accepts once; sender thread writes filename line then bytes; cleanup called by DownloadHandler. |
| `handler/DownloadHandler.java` | Protocol adapter and response | GET/OPTIONS; splits token query; finds port; opens `Socket("localhost", port)`; reads header until newline and payload until EOF; download temp file; attachment headers; HTTP copy; original share cleanup; temp cleanup in finally. |
| `handler/CORSHandler.java` | Default context/preflight | Wildcard CORS, OPTIONS 204, otherwise 404. This is not a health/readiness endpoint. |
| `src/test/java/P2P/Service/FileSharerTest.java` | Registry unit tests | Five tests: six-digit registration, validation/reverse lookup, distinct sequential ports, cleanup, dynamic port range. No concurrent or real-socket coverage here. |
| `src/test/java/P2P/Utils/MultiParserTest.java` | Parser unit tests | Five tests: normal parsing, all 256 byte values, default MIME, absent filename, absent closing boundary. This does not establish general multipart correctness. |
| `pom.xml` | Build vs runtime dependencies | Java 17 source/target; JUnit API/params test scope; Surefire discovers JUnit Platform; jar main class, shade plugin, runtime dependency copy. No Spring runtime dependency. |
| `.github/workflows/ci.yml` | CI | Java 17, Maven test on main pushes/PRs; concurrency cancels older runs for the same ref. Packaging is verified locally separately. |
| `.gitignore` | Generated-file hygiene | Ignores target and local tooling files. Ignore does not untrack files already in Git. The resolved merge removes tracked build outputs. |
| `Dockerfile` | Container stages | Local ignored file: Maven/Java 21 build, skip tests, Java 21 runtime, original jar. A Spring Boot comment is inaccurate. This file is not tracked/pushed by this work. |
| `.mvn/{jvm,maven}.config` | Maven options | Both local files are empty in the inspected checkout. |
| `.github/assets/{banner,footer}.svg` | Documentation media | README illustrations, not part of runtime transfer behavior. |

## 5. Follow one file, step by step

Use an illustrative file `notes.txt`, PIN `482915` and port `53817`. Values are examples, not a live credential. Animation duration is teaching time, not measured service latency.

```text
Uploader browser ---- HTTP POST ----> UploadHandler
                                      |
                               memory -> parser -> temp disk
                                      |
                             port/PIN maps + ServerSocket
                                      |
Downloader browser -- HTTP GET -----> DownloadHandler
                                      |
                          TCP to localhost:53817
                                      |
                         FileSenderHandler reads disk
                                      |
                        download staging temp file
                                      |
Downloader browser <--- HTTP attachment
                                      |
                         delete original + clear maps
```

### Upload

1. FileUpload's dropzone accepts one selected file and calls Share's handler. Share appends `file` to FormData. The browser supplies the multipart boundary; manually guessing it can break parsing.
2. Axios posts to the separate P2P base URL. The UI tracks isUploading and logs progress. Its five-minute client timeout is separate from the listener's later 50-second accept timeout.
3. UploadHandler answers OPTIONS or rejects non-POST. It counts uploads using remote IP before later validation, so invalid attempts also count. Proxy-visible IPs and mutable counter races affect the limiter.
4. It validates multipart Content-Type and boundary. It rejects a request Content-Length or accumulated body above `500 * 1024 * 1024` bytes. Because the body includes the multipart envelope, the maximum accepted payload is slightly below 500 MiB for this path.
5. The handler accumulates the entire body in ByteArrayOutputStream, makes a byte-array copy, and passes it to MultiParser. The parser also creates a String and a payload array. This is not a streaming upload.
6. It checks extracted bytes, allowed extension and a MIME prefix. The allowlist includes generic octet-stream and checks client-supplied metadata, not virus scanning or content sniffing.
7. It writes `UUID_originalBasename` under `<java.io.tmpdir>/SkyLink-uploads`. FileSharer records file path/uploader IP and a PIN against a random port. Two maps exist only in this process.
8. It starts a thread that calls startFileServer and immediately returns JSON. There is no signal that the OS bind succeeded before the HTTP response. A very fast download can race listener startup.

### Download

1. FileDownload validates a nonempty PIN and calls `onDownload(0, PIN)`. The path's port is dummy data; DownloadHandler ignores it.
2. The handler finds the port by scanning the PIN map. Missing/unknown PIN returns 403 before socket work.
3. It connects to localhost because startFileServer runs on the same server. The old uploader-IP connection addressed the wrong machine; the merged fix corrects it.
4. The listener accepts one connection, starts FileSenderHandler, then closes the listening socket. The accepted socket remains independent while the sender works.
5. The sender writes `Filename: UUID_notes.txt\n`, then file bytes in 4096-byte chunks, then closes. No payload length, checksum, PIN authentication or application success acknowledgment exists in that TCP protocol.
6. DownloadHandler consumes the filename line and copies remaining bytes until EOF into a second temporary file. It probes the filename for Content-Type, adds Content-Disposition, then copies to the HTTP response.
7. Share receives a Blob, parses Content-Disposition, creates an object URL and download anchor, clicks it, then revokes/removes them. The filename currently includes the UUID prefix; preserving the original name would require separate metadata.
8. After its successful HTTP-copy path, DownloadHandler invokes cleanupAfterDownload: attempt original file deletion, remove both maps. Its finally block attempts staging-file deletion. This is not proof that a human saved the file, nor reliable exactly-once delivery.

## 6. API reference

| Request | Success | Failure paths |
|---|---|---|
| `POST /upload`, one multipart file | 200 `{port:number, token:string}` | 400 wrong content type/missing boundary/parser null; 405 wrong method; 413 size; 415 extension/MIME; 429 counter exceeded; 500 caught I/O |
| `GET /download?token=PIN` | 200 attachment bytes | 403 missing/unknown PIN; 405 wrong method; 500 caught socket/I/O failures |
| `GET /download/0?token=PIN` | Same handler through context prefix | Path port ignored |
| `OPTIONS /upload`, `/download`, `/` | 204, no body | Browser preflight permission, not identity verification |
| Other ordinary request under root | 404 `NOT FOUND` | No dedicated readiness check |

Unchecked failures such as a malformed Content-Length, invalid PORT, or null boundary internals are not comprehensively mapped to clean API responses. Do not describe the table as a complete centralized exception policy. CORS allows `*`; download exposes Content-Disposition so browser code can read it.

FileSharer public methods: `offerFile(path,host)` -> int; `isPortOccupied(port)` -> boolean (registry only); `validateToken(port,token)` -> boolean; `getToken(port)` -> String/null; `getPortByToken(token)` -> Integer/null; `getHostByPort(port)` and `getFilePath(port)` -> String/null; `startFileServer(port)` and `cleanupAfterDownload(port)` -> void. MultiParser has `(byte[],String)` constructor and `parse()` -> ParseResult/null with public final fileName/fileContent/contentType fields. UploadUtils exposes static `generatePort()` -> int. FileController exposes constructor(int), start(), stop(); each handler exposes handle(HttpExchange). App exposes main(String[]).

## 7. What really fails, and how to discuss it

| Current finding | Explain the consequence | Proposed improvement, not implemented here |
|---|---|---|
| 50-second accept timeout catches/logs IOException without cleanup | Listener closes but original file and PIN maps remain; later request may get 500 rather than 403 | Explicit expiry state and cleanup on timeout/bind failure; periodic orphan sweep |
| Random PIN, no uniqueness check or download attempt limit | Collisions can select the wrong share; small secret space can be guessed | SecureRandom, collision-checked insertion, longer tokens and attempt limits |
| ContainsKey then put across two maps | Concurrent uploads can reserve the same candidate; readers may see inconsistent pairs | Atomic reservation, single transfer record and a lifecycle state machine |
| Registry check is not OS bind | Another process may occupy the chosen port; upload still returns success | Bind first, register only after readiness; optionally OS-assigned port |
| New ServerSocket(port) binds wildcard; TCP has no PIN check | Depending on deployment network exposure, someone could connect directly, bypass HTTP PIN validation and consume the single accept | Bind loopback explicitly or authenticate socket protocol; simpler direct HTTP streaming |
| Two downloads can resolve the same PIN before cleanup | Both attempt connection, but listener accepts once; one may fail; retries after partial transfer are unreliable | Atomically claim transfer; define available/claimed/completed/expired states |
| HTTP pool fixed at 10, file listeners/senders use new Thread | HTTP workers are bounded but pending listener threads are not; fixed pool also has an unbounded work queue | Bound transfers, request queue, disk and memory budgets; apply backpressure |
| Full body and parser copies | Large concurrent uploads can exhaust heap before disk storage | Streaming multipart parser, bounded size/count and disk staging |
| Parser mixes String positions with byte offsets | Non-ASCII headers can shift offsets; multiple parts may confuse first header/body selection | Explicit encodings and a proven multipart parser |
| MIME prefix and extension check only | Renamed/forged content can pass; this is not malware prevention | Strict metadata validation, content inspection where required, safe headers/storage |
| Cleanup only after HTTP copy; sender failure looks like EOF | Truncated file may be treated as complete; original remains on other failures | Declared size/checksum, acknowledgments, cleanup policy for every terminal state |
| In-memory maps and local disk | Restart loses lookup but may leave files; replicas do not share state | Deliberate expiry/retention; shared state or route affinity; object storage alternative |
| Socket read timeouts missing in DownloadHandler | Download worker can wait indefinitely on a stalled sender | Explicit connect/read deadlines and cancellation; read timeout alone does not bound writes |
| No browser abort/tab-close protocol | Closing upload tab after success does not invalidate code | Correct product wording; implement lifecycle signaling only if required |
| Main app UI claims direct/E2E transfer | Claims exceed this implementation | Describe server-relayed temporary transfer; add E2E only with actual client cryptography |

These findings are code review observations, not exploits against production. Fixing these unrelated design limitations is not part of resolving this merge. The learning guide intentionally teaches them rather than silently changing the service's contract.

ConcurrentHashMap makes individual map operations safe, but the application's compound workflow still needs coordination. See the [JDK ConcurrentHashMap reference](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html). Browser-to-browser data channels would be a different implementation using [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API).

## 8. Two-day plan: 6 focused hours each day

Use relative hours so you can start whenever available. Take a 10-minute break after each block; breaks are additional to the six hours. Day 1 and Day 2 are study labels, not scheduled calendar events. If time is shorter, prioritize flow tracing, Q1-20, Q21/23/25/29/31/38/40/42/46, and Q51/52/55/56/59/60/61/65/67/68/70/79/80.

### Day 1: Understand and explain the working system

| Focus time | Study | Practice | Pass criterion |
|---|---|---|---|
| 00:00-00:45 | Sections 1-3; compare both SkyLink backends | Draw uploader, server, downloader; explain HTTP/TCP/port/PIN | Say where every byte lives and why this is a relay |
| 00:45-01:30 | App, FileController, CORSHandler | Trace startup, PORT, shared FileSharer, routes and shutdown | Explain 10 HTTP workers vs extra file threads |
| 01:30-02:30 | UploadHandler, MultiParser, UploadUtils | Walk `notes.txt` from FormData to disk/PIN; inspect 8192-byte read loop | Explain boundary, three size checks and why copies consume heap |
| 02:30-03:30 | FileSharer, DownloadHandler | Play/pause animation; draw internal localhost hop, filename line, EOF and staging disk | Explain who listens and who connects without referring to uploader IP |
| 03:30-04:15 | Main React Share components | Trace selected file, loading flags, PIN display, Blob and object URL | Explain `/download/0`, VITE_API_BASE_URL and header exposure |
| 04:15-05:00 | Run [local tutorial](docs/HOW_TO_RUN.md); read both tests | Upload/download small text and binary file; compare hash; retry PIN | State actual test coverage and distinguish unit tests from HTTP integration |
| 05:00-06:00 | Question bank Q1-40 | Answer aloud before revealing each answer; deliver 30-second/two-minute explanation | Explain flow from memory; record weak questions for Day 2 |

### Day 2: Debug, defend trade-offs and interview

| Focus time | Study | Practice | Pass criterion |
|---|---|---|---|
| 00:00-00:45 | Closed-book Day 1 recall | Draw flow; revisit marked questions; Q41-50 | Explain EOF, timeouts and cleanup accurately |
| 00:45-01:45 | Section 7 concurrency/lifecycle; Q51-59 | Write A/B interleavings for port collision and two downloads; draw four transfer states | Explain why thread-safe maps are insufficient and propose atomic claims |
| 01:45-02:30 | Security and memory; Q60-65, Q69-71 | Model PIN guessing, direct socket bypass, large-upload heap copies | Name three prioritized improvements with tests |
| 02:30-03:15 | Main SkyLink integration; Q46-50, Q66-68 | Explain Clerk JWT vs PIN; persistent upload credits; payment replay and owner policy | Keep Spring/Mongo/payment behavior separate from P2P handlers |
| 03:15-04:00 | Deployment/testing; Q72-78 | Explain Render PORT, loopback, disk/restart/replicas, CI and tracked target conflict | Diagnose local-success/remote-failure without inventing deployed results |
| 04:00-05:00 | Two mock rounds; Q79-80 | Round A: pitch + flow + Java + networking. Round B: concurrency + security + scale + debugging | Speak clearly; distinguish current code, inference and proposed design |
| 05:00-06:00 | Final review and personal story | Answer missed questions; rehearse a real contribution and one trade-off | Two-minute explanation and three weaknesses without memorized slogans |

Score each response 0 = cannot explain, 1 = names terms, 2 = correct mechanism, 3 = mechanism plus trade-off/example. This is self-assessment, not a claim about your interview outcome. Aim for 2 on all essentials, then 3 on networking, races, memory, cleanup and project story.

## 9. Mock interview scripts

**Round A, 25 minutes:** Q1 project pitch (2 min); Q21 upload trace (5); Q23 multipart (4); Q25 localhost (4); Q29 maps (4); Q38 tests (3); Q79 contribution (3).

**Round B, 30 minutes:** Q51 collision interleaving (5); Q55 two downloads (5); Q59 timeout cleanup (4); Q60 token threat (4); Q65 streaming redesign (4); Q67 replicas (4); Q80 priority/trade-offs (4).

For each answer: state the direct answer, point to the responsible class, walk one example, then give a limitation and improvement. If unsure, say what you would inspect or test. Do not bluff "exactly once", E2E encryption, automatic expiry deletion or direct browser transfer.

## 10. Final revision card

- Browser -> HTTP handler -> server disk -> local TCP -> staging disk -> HTTP -> browser.
- API 8081 by default; per-file candidate range 49152-65535; example PIN has six digits.
- 500 MiB cap applies to request envelope too; 10 attempted POST uploads/min/IP is approximate under concurrency/proxies.
- 8192-byte upload read buffer; 4096-byte sender/download copy buffers; whole upload remains buffered.
- Listener accept waits 50 seconds; sender's Socket SO_TIMEOUT does not impose a write deadline.
- Upload returns before confirmed listener readiness. Map uniqueness is not OS port availability.
- Successful HTTP-copy path attempts cleanup. Timeout, restart and failed download are weaker paths.
- Main UI uses dummy path port 0 and only PIN for lookup. Returned filename includes UUID.
- No Clerk, MongoDB, Razorpay, WebRTC, TLS server or E2E cryptography implemented in this P2P repo.
- Ten tests cover parser and registry basics. CI runs them; it does not validate all network/security paths.

Next teaching session can start with Q1 and proceed one answer at a time. Use the lesson's flashcards to practice before revealing model answers.
