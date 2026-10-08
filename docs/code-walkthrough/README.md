# Maintain the Line-by-Line Teaching Guide

The reader covers all eight production Java files from the screenshot. `annotations.cjs` holds manually authored what/why/example/caution explanations keyed to source line numbers. `build.cjs` reads the original source, rejects missing executable-line explanations, adds import/package/comment/blank/closing-brace teaching entries and produces the offline snapshot plus the complete written guide.

```powershell
node docs/code-walkthrough/build.cjs
```

Outputs: [written guide](../LINE_BY_LINE_GUIDE.md) and [interactive reader](index.html). The reader loads its local snapshot/scripts/styles and requires no server or network connection.

Each chapter includes purpose, caller, an analogy and three understanding checks. Source lines and SHA-256 hashes are captured as a snapshot. If source meaning or line numbers change, update annotations before rebuilding. A passing coverage count is not a substitute for semantic review of explanations.

## Verified on 8 October 2026

- Eight exact source snapshots totaling 901 physical lines, including 470 individually annotated code lines. Every row has a what/why explanation; raw text and source hashes match. All 901 written-guide anchors were checked.
- Original Java source has no diff.
- Playwright checks passed at 1280, 736, 390 and 320 pixel widths: eight-file switching, selected-line text/teaching, next/previous, jump-to-line, deep links, comment/spacing filter, saved understood marks, misleading-comment cautions and boundary buttons.
- No horizontal overflow or browser runtime errors in those checks. Desktop/mobile screenshots were visually inspected.

The annotation text distinguishes intended rationale from enforced behavior. It does not rewrite flawed logic, prove production behavior, or claim the learner already understands the code. The earlier [transfer verification record](../VERIFICATION.md) covers the service/network checks, including the local Windows JVM workaround.
