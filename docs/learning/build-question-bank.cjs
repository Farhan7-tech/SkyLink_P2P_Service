const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'questions.js'), 'utf8'), context);
const questions = context.window.SKYLINK_QUESTIONS;
if (questions.length !== 80 || new Set(questions.map(q => q.id)).size !== 80) throw new Error('Expected 80 unique questions');
const lines = ['# SkyLink Interview Question Bank', '', '80 project-specific questions with model answers: 20 beginner, 30 intermediate and 30 advanced. Read [the beginner guide and two-day plan](../INTERVIEW_PREP.md), use [interactive flashcards](learning/index.html#drill), and run [the local exercise](HOW_TO_RUN.md).', '', 'Try each answer aloud before reading. Use a direct answer, mechanism, source example and trade-off. Model answers describe current code unless explicitly labeled proposed. They are not a claim that every possible interview question is included.', ''];
for (const level of ['Beginner', 'Intermediate', 'Advanced']) {
  const group = questions.filter(q => q.level === level);
  lines.push(`## ${level} (${group.length})`, '');
  for (const q of group) lines.push(`### Q${q.id}. ${q.q}`, '', `**Topic:** ${q.topic}`, '', q.a, '', `**Code to explain:** ${q.source}`, '');
}
lines.push('## Further Reading', '', 'Timeout and map semantics: [JDK Socket](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/Socket.html), [JDK ServerSocket](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/ServerSocket.html), [JDK ConcurrentHashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html). A different browser-to-browser design would use [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API).', '', 'Source of truth for flashcards: learning/questions.js. Regenerate this reference with `node docs/learning/build-question-bank.cjs` after changing that data.', '');
fs.writeFileSync(path.join(__dirname, '..', 'QUESTION_BANK.md'), lines.join('\n'));
console.log(`Generated ${questions.length} questions in docs/QUESTION_BANK.md`);
