# Verification Record

Local checks on 8 October 2026, before pushing the merge and learning material. This records observed results, not production health or performance measurements.

## Merge

- Four modify/delete conflicts existed only in generated target jar/test-report paths.
- Resolution preserved the incoming removal of tracked target output. Source/test/CI changes were retained, including the localhost download fix.
- `git ls-files -u` returned no unmerged entries. A normal merge commit preserved both histories; no force push was needed.

## Java

`mvn -B clean verify` using the installed JetBrains Java 21 compiler: BUILD SUCCESS; 10 tests, zero failures/errors/skips. The source/target remains Java 17. CI uses Java 17 and runs Maven test.

An additional local-only HTTP integration check started the packaged jar on a free API port with an isolated temp directory. Text and a 4096-byte binary payload each passed exact-byte and SHA-256 comparison through HTTP upload, local TCP, staging and HTTP download. Attachment filename/header exposure passed. Original upload directory was empty after each successful transfer and retry returned 403. Root 404, OPTIONS 204, wrong-method 405, invalid/missing PIN 403, wrong upload Content-Type 400 and denied .exe extension 415 were checked.

The Windows JetBrains runtimes failed unmodified HttpServer initialization inside the JDK's Unix-domain selector wakeup pipe. A minimal HttpServer probe reproduced the same failure independently of project code. Integration checks used the local `jdk.net.unixdomain.tmpdir` fallback workaround described in [How to Run](HOW_TO_RUN.md). Application source was not modified to accommodate it.

No deployed service was tested. Concurrent claims, live expiry cleanup, maximum-size uploads, rate-limiter races, cryptographic security and interrupted-transfer integrity remain gaps, described in the study guide. The browser failure scenarios are deterministic teaching simulations grounded in code; they are not automated evidence that every failure was triggered live.

## Learning Page

Playwright Chromium checks at 1280, 736, 390 and 320 pixel widths passed:

- All 14 success steps and every step of five failure/race scenarios.
- Moving packet, next/previous, scrub state, autoplay and pause.
- Fourteen study blocks, completion persistence on reload, and clear progress.
- All 80 distinct flashcards, correct 20/30/30 level counts, model answers, random selection and review-queue add/remove/empty states.
- No horizontal overflow or browser runtime errors in checked views.
- Reduced-motion behavior and arrow-key tab navigation.

Desktop/mobile screenshots were visually inspected. The compact in-chat animation also passed step/replay/pause and width checks at 736 and 320 pixels. Generated screenshots/test probes remain ignored under target; the authored in-chat fragment is stored in the chat's visualization directory. The full standalone learning page and its assets are committed under docs/learning.

## Documentation

The P2P guide covers all eight production Java files, both test files, configuration/build/CI and the main React integration. The model answer bank is generated from the same data as the flashcards with `node docs/learning/build-question-bank.cjs`. Local relative Markdown and HTML navigation links were checked. Main SkyLink's existing uncommitted edits were not included in this push.
