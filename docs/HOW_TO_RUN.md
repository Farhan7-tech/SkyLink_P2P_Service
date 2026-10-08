# How to Run and Verify a Local SkyLink Transfer

This tutorial uses local-only requests. You will see an upload return a PIN, download the same bytes, and observe successful-path PIN invalidation. Study [the architecture](../INTERVIEW_PREP.md) and [questions](QUESTION_BANK.md) alongside it.

## Prerequisites

Java JDK 17+ (including javac), Maven 3.8+, curl.exe and PowerShell. JAVA_HOME must refer to an installed JDK and PATH must include its bin directory. The machine used for this review had a stale JAVA_HOME; verification used the installed JetBrains JDK by setting JAVA_HOME for that process. Use your own installed JDK path.

On this computer, the installed JetBrains runtime includes the compiler module used by Maven. These session-only settings worked for the build:

```powershell
$env:JAVA_HOME = 'C:\Program Files\JetBrains\IntelliJ IDEA 2025.3\jbr'
$env:Path = $env:JAVA_HOME + '\bin;' + $env:Path
```

## Step 1: Build

```powershell
Set-Location 'D:\SkyLink_P2P_Share'
java -version
mvn -B clean verify
```

Expected: BUILD SUCCESS and 10 tests with no failures. Maven creates target/P2P-1.0-SNAPSHOT.jar. Build output is ignored by Git.

## Step 2: Start the server

```powershell
$env:PORT = '8081'
java -jar target/P2P-1.0-SNAPSHOT.jar
```

Expected: API server started on port 8081. Keep this terminal running for the exercise. If the port is busy, choose a free local port and change every URL below accordingly. The upload's per-file listener waits only 50 seconds, so download promptly after the next step.

**Observed Windows startup issue:** this machine's JetBrains Java 17 and 21 runtimes failed inside the JDK selector's Unix-domain wakeup pipe with `Unable to establish loopback connection` / `Invalid argument: connect`, before the HTTP server was created. A minimal HttpServer-only probe reproduced it. Local network verification succeeded with the JVM option below, which makes the Unix-domain bind fail early and allows the JDK's TCP fallback. The directory must not exist; this is a local diagnostic workaround, not a service source change or a recommended deployment setting.

```powershell
java '-Djdk.net.unixdomain.tmpdir=D:\SkyLink_P2P_Share\target\absent-unix-socket-dir' -jar target/P2P-1.0-SNAPSHOT.jar
```

The fallback mechanism is visible in [OpenJDK PipeImpl.createListener](https://github.com/openjdk/jdk21u/blob/master/src/java.base/windows/classes/sun/nio/ch/PipeImpl.java). If the ordinary command works with your JDK/environment, use it. This option does not change the localhost connection used by SkyLink's file transfer.

## Step 3: Upload, download and compare

In a second terminal, choose an existing small nonempty txt/pdf/png/zip file. Example below assumes notes.txt exists. curl.exe is deliberate: Windows PowerShell may alias curl to a different command.

```powershell
Set-Location 'D:\SkyLink_P2P_Share'
$samplePath = 'D:\SkyLink_P2P_Share\notes.txt'
$share = curl.exe --silent --show-error --fail -F "file=@$samplePath" 'http://localhost:8081/upload' | ConvertFrom-Json
$share
$downloadPath = Join-Path $env:TEMP 'skylink-local-download.bin'
curl.exe --silent --show-error --fail --output $downloadPath "http://localhost:8081/download/0?token=$($share.token)"
(Get-FileHash -LiteralPath $samplePath).Hash -eq (Get-FileHash -LiteralPath $downloadPath).Hash
curl.exe --silent --output NUL --write-out '%{http_code}' "http://localhost:8081/download?token=$($share.token)"
```

Expected: upload object contains port/PIN; hash comparison True; second download 403 after successful cleanup. Requesting port 0 in the path works because the service uses the PIN to look up the actual internal port. Repeat with a small binary file to validate the complete byte path. Do not upload real sensitive files for an exercise.

## What you built

You ran a local server-relayed transfer through HTTP, temporary disk, a local TCP listener, HTTP again and cleanup. You did not establish a direct browser P2P link.

## How to Inspect the Tests

```powershell
mvn -B test
```

Read src/test/java/P2P/Service/FileSharerTest.java and src/test/java/P2P/Utils/MultiParserTest.java. The first covers registry/cleanup/port helpers; the second covers narrow multipart inputs and binary payloads. Ten passing unit tests do not prove concurrent download claims, socket authentication or all failure-path cleanup.

## How to Diagnose Common Failures

| Symptom | Inspection |
|---|---|
| Java not found / JAVA_HOME invalid | Point JAVA_HOME to an actual JDK root; add its bin to PATH; run java -version and javac -version. |
| BindException at startup | API port is in use. Change PORT; do not stop another application's process without checking its owner. |
| 400 upload | Confirm multipart FormData, a nonempty file and boundary; parser is not general-purpose multipart. |
| 413 | Request including envelope exceeded 500 MiB, even if payload is slightly smaller. |
| 415 | Check allowed filename extension and claimed MIME; allowlists are in UploadHandler. |
| 429 | Too many POST attempts from the same remote IP during the window; invalid uploads count too. |
| 403 download | Missing/unknown PIN or successful prior consumption. |
| 500 soon after upload | Listener startup/bind race or I/O error; inspect logs. |
| 500 after waiting | Listener accept timeout closes listener but leaves stale maps/file. Upload again for the exercise; automatic timeout cleanup is not implemented. |
| Download named UUID_notes.txt | Filename header comes from the stored basename. Original-name restoration is a proposed change. |
| Failed browser fetch but curl works | Compare UI P2P base URL, CORS/preflight, exposed header and browser network response. |

Press Ctrl+C in the server terminal when finished. The shutdown hook stops HTTP/executor; do not assume it expires every pending share or deletes every leftover upload. The exercise download remains in your temp folder for inspection.

## How the Merge Was Resolved

The checkout was merging origin/main into local main. The only four unmerged paths were target/P2P-1.0-SNAPSHOT.jar, target/original-P2P-1.0-SNAPSHOT.jar and the old AppTest reports. Incoming history intentionally stopped tracking target/. Resolution kept those removals in the index and preserved Java source, the loopback networking fix, tests, README and CI. Rebuilding regenerates binaries locally. No history rewrite or force push is necessary.
