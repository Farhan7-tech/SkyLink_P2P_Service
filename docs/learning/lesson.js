(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scene = (title, from, to, phase, plain, detail, source, question, answer, outcome = 'Current code', error = false) => ({title, from, to, phase, plain, detail, source, question, answer, outcome, error});
  const scenarios = {
    success: [
      scene('Choose a file', 'uploader', null, 0, 'You select notes.txt. The file is still on your device.', 'FileUpload accepts one file. Share stores the File and sets isUploading when the upload starts. This UI state is different from server transfer state.', 'Main UI: FileUpload.onDrop / Share.handleFileUpload', 'Has the server stored the file yet?', 'No. Selection is browser state. Only a successful HTTP upload creates server state.', 'Browser'),
      scene('Send the upload', 'uploader', 'upload', 1, 'Your browser sends a file envelope to the Java server over HTTP.', 'Share appends a file field to FormData and Axios posts to VITE_API_BASE_URL/upload. The browser creates the multipart boundary. The five-minute Axios timeout is separate from the later listener timeout.', 'Main UI: Share.handleFileUpload', 'Is this a connection to the other person\'s device?', 'No. It is an HTTP connection to the Java service.', 'POST /upload'),
      scene('Validate and parse', 'upload', null, 2, 'The server checks the request, collects its bytes and separates the file from the envelope.', 'UploadHandler counts attempts per remote IP, checks method, multipart type, boundary and size. It buffers the entire request. MultiParser uses a whole-body String for headers and byte search for the end marker, then copies payload bytes. Extension and claimed MIME are checked.', 'UploadHandler.handle / MultiParser.parse', 'Does an 8192-byte buffer make the whole upload streaming?', 'No. ByteArrayOutputStream keeps accumulating the entire body, and the parser creates more copies.', 'Memory'),
      scene('Store a temporary copy', 'upload', 'disk', 3, 'The server now has your file on its own temporary disk.', 'The filename becomes UUID_notes.txt under java.io.tmpdir/SkyLink-uploads. FileOutputStream writes the extracted payload. This path uses no MongoDB and consumes no main-app credit.', 'UploadHandler: uniqueFileName / FileOutputStream', 'Could the server read the uploaded plaintext?', 'Yes. The bytes are stored and read by the server. Client-side end-to-end encryption is not implemented.', 'Server disk'),
      scene('Register a port and PIN', 'disk', 'maps', 4, 'The server remembers which file belongs to a port and gives it a six-digit code.', 'Example: availableFiles[53817] = FileInfo(path, uploaderIP); accessTokens[53817] = "482915". These are two process-local ConcurrentHashMaps. Port selection is containsKey then put, not an atomic OS reservation. Random PINs are not checked for collision.', 'FileSharer.offerFile / generateAccessToken', 'What survives a process restart: the map or perhaps the disk file?', 'The maps are lost. Disk files may remain without a usable lookup.', 'Process memory'),
      scene('Start the file listener', 'maps', 'listener', 5, 'A new thread opens a TCP listener on the server. It waits for one connection.', 'startFileServer binds ServerSocket(53817), sets a 50-second accept timeout and waits. It accepts once, starts a sender thread and closes the listening socket. The upload handler does not wait for confirmed bind readiness.', 'UploadHandler: new Thread / FileSharer.startFileServer', 'Which machine is listening?', 'The Java server host. Neither browser is running this ServerSocket.', 'Accept wait: 50 s'),
      scene('Return the PIN', 'maps', 'uploader', 6, 'The upload response gives your browser a code it can show you.', 'HTTP returns {port:53817, token:"482915"}. Share stores both values and InviteCode displays the token. The current UI does not need the returned port for download. This scene shows a ready listener, but readiness is not guaranteed before response in current code.', 'UploadHandler: JSON response / Main UI: InviteCode', 'What does receiving 200 fail to prove?', 'It does not prove the background listener bound successfully before the response.', '200 / example PIN'),
      scene('Share the code', 'uploader', 'recipient', 7, 'You give 482915 to the recipient, for example in a message. No file bytes move between the browsers here.', 'PIN distribution is outside this backend protocol. There is no browser data channel, heartbeat or tab-close invalidation implemented. The server already owns the uploaded copy.', 'Main UI: InviteCode / FileDownload', 'Does closing the uploader tab automatically delete the share?', 'No. No tab-close invalidation is implemented in this integration.', 'PIN only'),
      scene('Request the download', 'recipient', 'download', 8, 'The recipient sends the PIN to the same Java API over HTTP.', 'FileDownload calls onDownload(0, accessToken). Share requests /download/0?token=482915 with responseType blob. HttpServer context prefix matching reaches DownloadHandler. The path port 0 is ignored.', 'Main UI: FileDownload.handleSubmit / Share.handleDownload', 'Does 0 identify the file listener?', 'No. It is a dummy path value; the PIN selects the actual port.', 'GET /download/0'),
      scene('Find the share', 'download', 'maps', 9, 'The download handler finds which port has this PIN.', 'getPortByToken scans accessTokens and returns 53817. Missing or unknown PIN returns 403. There is no atomic claim here, so two requests can resolve the same pending PIN.', 'DownloadHandler.handle / FileSharer.getPortByToken', 'Does this lookup verify a Clerk user?', 'No. It checks possession of a PIN. P2P handlers do not verify Clerk JWTs.', 'PIN -> 53817'),
      scene('Connect inside the server', 'download', 'listener', 10, 'The Java download handler connects to its own file listener using localhost.', 'new Socket("localhost", 53817) addresses the listener on this host. The uploader IP is not the listener host. The merged networking fix corrects this placement. The sender writes a Filename line and bytes from disk.', 'DownloadHandler: Socket("localhost", port) / FileSenderHandler', 'Why would connecting to uploaderHost fail in a normal remote deployment?', 'The browser client is not hosting the socket server. The listener and uploaded file are on the Java host.', 'Local TCP'),
      scene('Stage the received bytes', 'listener', 'staging', 11, 'The handler collects the internal TCP payload into a second temporary file.', 'It reads the filename through newline, then 4096-byte chunks until EOF. Staging provides an HTTP response length but adds disk I/O. No expected size/checksum validates completeness; an interrupted sender can produce a shorter apparent success.', 'DownloadHandler: headerBaos / tempFile copy', 'Does EOF prove the original whole file arrived?', 'No. It proves only that this stream ended. A length/checksum would let the application verify completeness.', 'Download temp disk'),
      scene('Send the HTTP attachment', 'staging', 'recipient', 12, 'The server sends the file to the recipient. The browser opens a download.', 'DownloadHandler sets Content-Type and Content-Disposition, sends the staged length, then copies bytes to the response. CORS exposes Content-Disposition. Share creates a Blob, object URL and anchor, then revokes/removes them. The stored UUID prefix remains in the filename.', 'DownloadHandler: HTTP copy / Main UI: Share.handleDownload', 'Can the server prove the person saved the file?', 'No. Completing a server-side HTTP write is not a recipient persistence acknowledgment.', '200 / attachment'),
      scene('Clean the successful share', 'maps', 'disk', 13, 'After its successful send path, the server attempts to delete the original and forgets the PIN.', 'cleanupAfterDownload attempts File.delete, then removes both maps even if deletion fails. Staging deletion runs in finally. This is the happy path; timeout and failed transfers have incomplete original cleanup.', 'FileSharer.cleanupAfterDownload / DownloadHandler finally', 'Will a later request with the same cleaned-up PIN work?', 'Lookup no longer finds it, so the HTTP path returns 403. This is still not a robust exactly-once delivery protocol.', 'Successful-path cleanup')
    ],
    invalid: [
      scene('A share is waiting', 'maps', null, 7, 'The example share is ready, but the recipient enters the wrong code.', 'The map contains example PIN 482915. The browser submits 111111 instead; client formatting is not access validation.', 'FileSharer.accessTokens / Main UI: FileDownload', 'Where is the authoritative PIN check?', 'On the server during reverse lookup.', 'Example share ready'),
      scene('Submit the wrong PIN', 'recipient', 'download', 8, 'The request still reaches the server. Only the code is wrong.', 'GET /download/0?token=111111 reaches DownloadHandler, regardless of the dummy path port.', 'DownloadHandler query parsing', 'Does CORS decide whether this PIN is correct?', 'No. Browser origin permissions and PIN authorization are separate.', 'GET /download'),
      scene('No matching port', 'download', 'maps', 8, 'The server cannot find that code in its lookup table.', 'getPortByToken returns null. The handler branches before constructing a socket.', 'FileSharer.getPortByToken / DownloadHandler', 'Will a socket connection be attempted?', 'No. The handler returns before socket creation.', 'Unknown PIN', true),
      scene('Reject with 403', 'download', 'recipient', 7, 'The recipient gets Access denied. The original share can still be pending.', 'DownloadHandler returns 403 for an invalid or missing PIN. This does not consume the legitimate share. Repeated failed download guesses are not limited by the upload-only limiter.', 'DownloadHandler: port == null branch', 'What security improvement belongs on this endpoint?', 'Limit failed PIN attempts and use stronger unique secrets with explicit expiry.', '403 / forbidden', true)
    ],
    timeout: [
      scene('Wait for a recipient', 'listener', null, 7, 'The listener is waiting, but nobody downloads.', 'ServerSocket.accept blocks with a 50000 ms timeout. The animation clock is illustrative, not real transfer time.', 'FileSharer.startFileServer', 'Does the 50 seconds include the whole download?', 'No. This timeout limits the blocking accept call.', 'Accept wait: 50 s'),
      scene('Listener times out', 'listener', null, 7, 'After 50 seconds, the listening socket closes. The maps and original file remain.', 'accept throws SocketTimeoutException, caught as IOException. The catch logs an error and has no cleanupAfterDownload call. This is not full expiry deletion.', 'FileSharer.startFileServer catch', 'What stale resources remain?', 'The original file and both map entries can remain; the listening socket has closed.', 'Closed / stale PIN', true),
      scene('Stale PIN still resolves', 'download', 'maps', 9, 'A later download finds the old PIN even though its listener is gone.', 'getPortByToken can return the stale port. Existence in the map does not establish a live listener.', 'DownloadHandler / FileSharer.getPortByToken', 'Why might this be 500 rather than 403?', 'The PIN resolves, then the socket connection fails.', 'Lookup succeeds'),
      scene('Connection fails', 'download', 'listener', 9, 'The local socket cannot connect to the closed listener; the API can return 500.', 'The IOException path returns a server error. A proposed fix would expire state, delete files and return an intentional expired/invalid result.', 'DownloadHandler IOException catch', 'What should expiry coordinate?', 'Listener closure, token invalidation, registry removal and disk cleanup.', '500 / stale share', true)
    ],
    retry: [
      scene('The first download completed', 'maps', 'disk', 13, 'The normal successful cleanup has already removed the share.', 'This branch begins after the successful HTTP-copy path, with both map entries removed and original deletion attempted.', 'cleanupAfterDownload', 'Is the PIN still registered?', 'No.', 'First transfer consumed'),
      scene('Try the same code again', 'recipient', 'download', 13, 'A second request reuses example PIN 482915.', 'The handler receives the same token query, but this no longer references an active map entry.', 'DownloadHandler query parsing', 'Does the dummy path port help recover the old file?', 'No. It is ignored, and the PIN is no longer registered.', 'Retry request'),
      scene('Reject the retry', 'download', 'recipient', 13, 'The lookup fails and the handler returns 403.', 'This sequential retry differs from two concurrent requests resolving a still-active PIN. Current code does not implement an atomic concurrent claim.', 'DownloadHandler: port == null', 'Does this establish exactly-once delivery under failure?', 'No. A sequential happy-path retry test does not cover interruption or concurrent claims.', '403 / consumed PIN', true)
    ],
    startup: [
      scene('Register before binding', 'maps', 'listener', 4, 'The port and PIN are registered. The background listener has not finished starting yet.', 'offerFile writes maps before new Thread calls startFileServer and binds the OS port.', 'UploadHandler / FileSharer.offerFile', 'Is a registry entry the same as a bound socket?', 'No. The OS socket bind is a separate later operation.', 'Not ready yet'),
      scene('Return an early success', 'maps', 'uploader', 4, 'The API can return a code while the listener is still starting.', 'There is no latch/future proving readiness before the JSON response. This branch illustrates a possible timing interleaving.', 'UploadHandler: thread start followed by response', 'How could you establish readiness?', 'Bind before publishing success or await an explicit readiness result within a deadline.', 'Possible race'),
      scene('Download immediately', 'recipient', 'download', 4, 'A very fast recipient requests the file before binding finishes.', 'The token resolves, but Socket(localhost, port) may run before a listener exists.', 'DownloadHandler Socket constructor', 'Will this fail every time?', 'No. It depends on scheduling; that is why it is a race.', 'Immediate request'),
      scene('Connection may be refused', 'download', 'listener', 4, 'The request may fail even though upload returned 200.', 'A later bind may succeed, or a bind may fail because another process owns the port. Readiness and rollback would make upload success reliable.', 'FileSharer.startFileServer / DownloadHandler catch', 'What test targets this problem?', 'Coordinate readiness and perform an immediate download; also force a bind failure and verify rollback.', 'Possible 500', true)
    ],
    race: [
      scene('Two uploads choose port P', 'upload', 'maps', 3, 'Two requests happen to generate the same candidate port.', 'Call them A and B. Both can observe !availableFiles.containsKey(P) before either inserts. This is a possible concurrency schedule, not a measured event.', 'FileSharer.offerFile', 'Are the individual containsKey operations unsafe?', 'The operations are safe; the compound check-then-put workflow is not atomic.', 'Concurrent A + B'),
      scene('A inserts its file', 'disk', 'maps', 4, 'Request A stores its FileInfo under P.', 'A has checked absence and puts its metadata. B can still proceed using its earlier observation.', 'FileSharer.offerFile: availableFiles.put', 'Does B automatically recheck?', 'No. The current branch goes straight to put after its check.', 'A -> port P'),
      scene('B overwrites the entry', 'upload', 'maps', 4, 'Request B writes to the same key. One file entry replaces the other.', 'ConcurrentHashMap.put is safe as a map operation but replacement is allowed. Token insertion in a separate map can also interleave and mismatch metadata.', 'FileSharer.offerFile: two map writes', 'Would thread-safe maps prevent this replacement?', 'No. You need atomic reservation and coordination across the transfer record.', 'Lost association', true),
      scene('Reserve, bind, then publish', 'maps', 'listener', 4, 'A proposed fix uses an atomic transfer reservation and confirms the listener before returning a code.', 'putIfAbsent can reserve one map key, but alone does not reserve the OS port or unique PIN. Use one transfer record, a bounded allocation loop, bind readiness and rollback on failure. This improvement is not implemented here.', 'Proposed lifecycle improvement', 'What three things need distinct guarantees?', 'Unique registry ownership, a successful OS socket bind and a unique access token.', 'Proposed fix')
    ]
  };
  let scenarioKey = 'success', step = 0, playing = false, playTimer = null, frame = null;
  const text = (id, value) => { el(id).textContent = value; };
  function diskState(phase) {
    text('disk-detail', phase >= 13 ? 'Deletion attempted' : phase >= 3 ? 'UUID_notes.txt' : 'Not stored yet');
    text('map-detail', phase >= 13 ? 'Both entries removed' : phase >= 4 ? '53817 / 482915' : 'No share registered');
    text('socket-detail', phase >= 11 ? 'One connection accepted' : phase >= 5 ? 'localhost :53817 / waiting' : 'Listener not ready');
    text('staging-detail', phase >= 13 ? 'Deletion attempted' : phase >= 11 ? 'download-*.tmp' : 'No staging file');
    text('recipient-chip', phase >= 12 ? 'UUID_notes.txt' : phase >= 7 ? 'Example PIN 482915' : 'Waiting for PIN');
    text('recipient-detail', phase >= 12 ? 'Attachment received' : 'HTTP client');
    text('uploader-detail', phase >= 6 ? 'Example PIN 482915' : phase >= 1 ? 'Sent to server' : 'File selected');
    text('server-status', phase >= 13 ? 'Successful path: clear maps; attempt file deletion.' : 'Bytes travel through this host.');
    if (scenarioKey === 'timeout' && step >= 1) text('socket-detail', 'Closed after accept timeout');
    if (scenarioKey === 'timeout' && step >= 1) text('server-status', 'Current bug: stale maps and original file remain.');
    if (scenarioKey === 'invalid') text('recipient-chip', 'Wrong PIN 111111');
    if (scenarioKey === 'startup') text('socket-detail', 'Background bind not confirmed');
    if (scenarioKey === 'race') {
      text('map-detail', step === 0 ? 'A and B see port P absent' : step === 1 ? 'P -> file A' : 'P -> file B; separate PIN write');
      text('server-status', step === 3 ? 'Proposed state coordination, not implemented.' : 'Safe individual operations; unsafe compound workflow.');
    }
  }
  function stop() {
    playing = false; clearTimeout(playTimer); playTimer = null;
    text('play', 'Play'); el('play').setAttribute('aria-label', 'Play lesson');
  }
  function schedule() {
    clearTimeout(playTimer);
    if (!playing) return;
    playTimer = setTimeout(() => {
      if (step + 1 >= scenarios[scenarioKey].length) { stop(); return; }
      step++; render(true); schedule();
    }, Number(el('pace').value));
  }
  function drawRoute(animate) {
    if (frame !== null) cancelAnimationFrame(frame);
    const s = scenarios[scenarioKey][step];
    const route = el('route'), packet = el('packet'), box = el('network').getBoundingClientRect();
    if (!s.to) { route.setAttribute('d', ''); packet.style.display = 'none'; return; }
    const a = el(s.from).getBoundingClientRect(), b = el(s.to).getBoundingClientRect();
    let ax = a.left + a.width / 2 - box.left, ay = a.top + a.height / 2 - box.top;
    let bx = b.left + b.width / 2 - box.left, by = b.top + b.height / 2 - box.top;
    if (Math.abs(bx - ax) > Math.abs(by - ay)) {
      ax += (bx > ax ? 1 : -1) * a.width / 2;
      bx += (bx > ax ? -1 : 1) * b.width / 2;
    } else {
      ay += (by > ay ? 1 : -1) * a.height / 2;
      by += (by > ay ? -1 : 1) * b.height / 2;
    }
    const bend = Math.max(14, Math.abs(bx - ax) / 3);
    route.setAttribute('d', `M ${ax} ${ay} C ${ax + (bx >= ax ? bend : -bend)} ${ay}, ${bx + (bx >= ax ? -bend : bend)} ${by}, ${bx} ${by}`);
    const length = route.getTotalLength();
    packet.style.display = '';
    const setPoint = progress => { const p = route.getPointAtLength(length * progress); packet.setAttribute('cx', p.x); packet.setAttribute('cy', p.y); };
    if (!animate || reduced.matches) { setPoint(1); return; }
    const started = performance.now();
    const tick = now => { const t = Math.min((now - started) / 1700, 1); setPoint(t * t * (3 - 2 * t)); if (t < 1) frame = requestAnimationFrame(tick); else frame = null; };
    frame = requestAnimationFrame(tick);
  }
  function render(animate = false) {
    const list = scenarios[scenarioKey], s = list[step];
    text('scene-title', s.title); text('step-number', `${String(step + 1).padStart(2, '0')} / ${list.length}`);
    text('outcome', s.outcome); el('outcome').classList.toggle('error', s.error);
    text('plain', s.plain); text('detail', s.detail); text('source', s.source);
    text('recall-question', s.question); text('recall-solution', s.answer);
    el('recall-answer').open = false;
    el('scrub').max = list.length - 1; el('scrub').value = step; text('step-output', step + 1);
    el('previous').disabled = step === 0; el('next').disabled = step === list.length - 1;
    el('network').classList.toggle('error', s.error);
    el('network').setAttribute('aria-label', `${s.title}. ${s.plain}`);
    document.querySelectorAll('.node').forEach(node => node.classList.toggle('active', node.id === s.from || node.id === s.to));
    el('chapters').replaceChildren(...list.map((item, index) => {
      const li = document.createElement('li'), button = document.createElement('button'), number = document.createElement('span'), name = document.createElement('span');
      number.textContent = String(index + 1).padStart(2, '0'); name.textContent = item.title; name.className = 'chapter-name';
      button.append(number, name); button.setAttribute('aria-label', `Step ${index + 1}: ${item.title}`);
      if (step === index) button.setAttribute('aria-current', 'step');
      button.addEventListener('click', () => { stop(); step = index; render(true); });
      li.append(button); return li;
    }));
    diskState(s.phase); drawRoute(animate);
  }
  el('scenario').addEventListener('change', () => { stop(); scenarioKey = el('scenario').value; step = 0; render(true); });
  el('previous').addEventListener('click', () => { stop(); if (step > 0) step--; render(true); });
  el('next').addEventListener('click', () => { stop(); if (step + 1 < scenarios[scenarioKey].length) step++; render(true); });
  el('scrub').addEventListener('input', () => { stop(); step = Number(el('scrub').value); render(true); });
  el('play').addEventListener('click', () => {
    if (playing) { stop(); return; }
    if (step === scenarios[scenarioKey].length - 1) { step = 0; render(true); }
    playing = true; text('play', 'Pause'); el('play').setAttribute('aria-label', 'Pause lesson'); drawRoute(true); schedule();
  });
  el('pace').addEventListener('change', schedule);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  new ResizeObserver(() => drawRoute(false)).observe(el('network'));
  reduced.addEventListener('change', () => drawRoute(false));
  const tabButtons = [...document.querySelectorAll('[data-tab]')];
  function chooseTab(id, focus = false) {
    if (!['lesson', 'plan', 'drill'].includes(id)) id = 'lesson';
    stop();
    tabButtons.forEach(button => { const selected = button.dataset.tab === id; button.setAttribute('aria-selected', String(selected)); el(button.dataset.tab).hidden = !selected; if (selected && focus) button.focus(); });
    history.replaceState(null, '', `#${id}`);
    if (id === 'lesson') requestAnimationFrame(() => drawRoute(false));
  }
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => chooseTab(button.dataset.tab));
    button.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % tabButtons.length;
      if (event.key === 'ArrowLeft') next = (index + tabButtons.length - 1) % tabButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabButtons.length - 1;
      if (next !== null) { event.preventDefault(); chooseTab(tabButtons[next].dataset.tab, true); }
    });
  });
  let saved = {completed: [], review: []};
  try { const data = JSON.parse(localStorage.getItem('skylink-p2p-study-v1')); if (data && Array.isArray(data.completed) && Array.isArray(data.review)) saved = data; } catch (_) { /* Storage can be unavailable for local documents. */ }
  const persist = () => { try { localStorage.setItem('skylink-p2p-study-v1', JSON.stringify(saved)); } catch (_) { /* The lesson also works without saved progress. */ } };
  const days = [
    [
      ['00:00-00:45', 'The architecture', 'Guide sections 1-3. Draw both browsers and the Java host. Q1-3, Q6-8.', 'Explain where every byte lives.'],
      ['00:45-01:30', 'Startup and HTTP routes', 'Read App, FileController and CORSHandler. Q4-5, Q16, Q27-28.', 'Separate HTTP workers from file threads.'],
      ['01:30-02:30', 'Upload and multipart', 'Read UploadHandler, MultiParser, UploadUtils. Trace steps 1-5. Q9-14, Q21, Q23-24, Q33-36.', 'Explain boundaries, size checks and heap copies.'],
      ['02:30-03:30', 'Sockets and download', 'Read FileSharer and DownloadHandler. Play the remaining steps. Q18-19, Q22, Q25-26, Q29-32.', 'Explain localhost, framing, EOF and cleanup.'],
      ['03:30-04:15', 'React integration', 'Read Share, FileDownload, FileUpload, InviteCode. Q17, Q37, Q41, Q43, Q46.', 'Trace the dummy path port, Blob and filename.'],
      ['04:15-05:00', 'Run a local transfer', 'Use HOW_TO_RUN.md. Upload and download promptly; compare text/binary hashes; retry the PIN. Q20, Q38-40.', 'Name what unit tests do and do not cover.'],
      ['05:00-06:00', 'Speak and recall', 'Answer Q1-40 before revealing answers. Rehearse a 30-second and two-minute project pitch.', 'Draw the path from memory; mark weak answers.']
    ],
    [
      ['00:00-00:45', 'Closed-book recall', 'Revisit marked questions and Q41-50. Draw file path, states and resources without code.', 'Explain cleanup and timeout distinctions.'],
      ['00:45-01:45', 'Races and lifecycle', 'Try race, timeout and startup scenarios. Q51-59. Write A/B interleavings.', 'Propose atomic reservations and download claims.'],
      ['01:45-02:30', 'Security and memory', 'Q60-65, Q69-71. Discuss secret guessing, socket bypass, copies and truncation.', 'Prioritize three improvements with tests.'],
      ['02:30-03:15', 'The full SkyLink project', 'Q46-50, Q66-68. Revisit Clerk, persistent upload, credits and payment fulfillment.', 'Keep JWT, PIN, Mongo and TCP responsibilities separate.'],
      ['03:15-04:00', 'Deploy and investigate', 'Q72-78. Diagnose wrong host, stale PIN, bind races and replica routing.', 'Explain PORT, loopback, CI and the target merge conflict.'],
      ['04:00-05:00', 'Two mock interviews', 'Round A: Q1/21/23/25/29/38/79. Round B: Q51/55/59/60/65/67/80.', 'Use direct answer, mechanism, example, trade-off.'],
      ['05:00-06:00', 'Final revision', 'Answer missed questions and Q79-80. Rehearse your real contribution and limitations.', 'Two-minute pitch plus three honest weaknesses.']
    ]
  ];
  function renderPlan() {
    days.forEach((blocks, day) => {
      el(`day${day + 1}`).replaceChildren(...blocks.map((block, index) => {
        const key = `${day}-${index}`, row = document.createElement('label'), check = document.createElement('input'), content = document.createElement('div');
        row.className = 'study-block'; check.type = 'checkbox'; check.checked = saved.completed.includes(key); check.setAttribute('aria-label', `Complete Day ${day + 1}: ${block[1]}`); row.classList.toggle('done', check.checked);
        const time = document.createElement('time'), title = document.createElement('h4'), practice = document.createElement('p'), pass = document.createElement('p');
        time.textContent = block[0]; title.textContent = block[1]; practice.textContent = block[2]; pass.textContent = `Ready when: ${block[3]}`; pass.className = 'pass';
        content.append(time, title, practice, pass); row.append(check, content);
        check.addEventListener('change', () => { saved.completed = saved.completed.filter(k => k !== key); if (check.checked) saved.completed.push(key); row.classList.toggle('done', check.checked); persist(); }); return row;
      }));
    });
  }
  el('clear-progress').addEventListener('click', () => { saved.completed = []; persist(); renderPlan(); });
  const allQuestions = window.SKYLINK_QUESTIONS;
  let questionIndex = 0;
  function questionList() { const level = el('question-level').value; return allQuestions.filter(q => level === 'All' || (level === 'Review' ? saved.review.includes(q.id) : q.level === level)); }
  function renderQuestion() {
    const list = questionList(); questionIndex = Math.max(0, Math.min(questionIndex, list.length - 1)); const q = list[questionIndex];
    text('question-count', list.length ? `${questionIndex + 1} of ${list.length}` : 'No marked questions');
    ['question-prev', 'question-next', 'shuffle'].forEach(id => { el(id).disabled = list.length < 2; });
    el('review-question').disabled = !q; el('model-answer').hidden = !q;
    if (!q) { text('question-id', 'Review queue'); text('question-topic', ''); text('question-text', 'No questions marked for review yet.'); text('answer-text', ''); text('answer-source', ''); el('review-question').checked = false; return; }
    text('question-id', `Q${q.id} / ${q.level}`); text('question-topic', q.topic); text('question-text', q.q); text('answer-text', q.a); text('answer-source', `Source: ${q.source}`);
    el('model-answer').open = el('show-answers').checked; el('review-question').checked = saved.review.includes(q.id);
  }
  el('question-level').addEventListener('change', () => { questionIndex = 0; renderQuestion(); });
  el('question-prev').addEventListener('click', () => { const list = questionList(); questionIndex = (questionIndex + list.length - 1) % list.length; renderQuestion(); });
  el('question-next').addEventListener('click', () => { const list = questionList(); questionIndex = (questionIndex + 1) % list.length; renderQuestion(); });
  el('shuffle').addEventListener('click', () => { const list = questionList(); questionIndex = (questionIndex + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length; renderQuestion(); });
  el('show-answers').addEventListener('change', renderQuestion);
  el('review-question').addEventListener('change', () => { const q = questionList()[questionIndex]; if (!q) return; saved.review = saved.review.filter(id => id !== q.id); if (el('review-question').checked) saved.review.push(q.id); persist(); if (el('question-level').value === 'Review') renderQuestion(); });
  render(false); renderPlan(); renderQuestion(); chooseTab(location.hash.slice(1));
})();
