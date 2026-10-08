const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const files = require('./annotations.cjs');
const repo = path.resolve(__dirname, '..', '..');
const order = ['App.java','FileController.java','UploadUtils.java','MultiParser.java','UploadHandler.java','FileSharer.java','DownloadHandler.java','CORSHandler.java'];
const imports = {
  IOException:['A checked exception type for input/output failures.','Used in throws clauses/catch blocks so file, socket or HTTP failures can be handled.'],
  FileController:['Your project\'s class that constructs and manages the API server.','App needs to construct it and call its lifecycle methods.'],
  File:['A path representation with helpers such as exists, getName, delete and mkdirs.','Used to describe storage paths; construction alone does not create/read file contents.'],
  InetSocketAddress:['A host/port socket address value.','HttpServer.create needs the API address to bind.'],
  ExecutorService:['An interface for scheduling tasks and controlling executor shutdown.','The controller stores its worker pool through this abstraction.'],
  Executors:['A factory class for standard executor configurations.','newFixedThreadPool(10) creates the HTTP request scheduler.'],
  FileSharer:['Your shared pending-file/PIN registry and local TCP service.','Handlers coordinate through one FileSharer object; importing the name does not construct it.'],
  CORSHandler:['Your root-context HTTP handler.','The controller constructs it for preflight/404 fallback.'],
  DownloadHandler:['Your PIN-to-HTTP attachment handler.','The controller constructs and registers it at /download.'],
  UploadHandler:['Your upload validator/parser/storage handler.','The controller constructs it for /upload with its required dependencies.'],
  HttpServer:['The HTTP server implementation provided in the JDK jdk.httpserver module.','It binds the API endpoint and invokes registered handlers without Spring/Tomcat.'],
  Headers:['The HTTP header collection type from the JDK server API.','Handlers read incoming metadata or add/set outgoing metadata.'],
  HttpExchange:['One HTTP request and its response channel.','handle receives this object to inspect method/URI/headers and access body streams.'],
  HttpHandler:['The interface with handle(HttpExchange).','implements HttpHandler allows a class to be registered as a server context handler.'],
  OutputStream:['A base class for writing bytes to a destination.','HTTP responses and socket sends use its write methods; it is not specific to text.'],
  InputStream:['A base class for reading bytes from a source.','The download handler reads from the connected socket and detects EOF with -1.'],
  ByteArrayOutputStream:['An expandable in-memory byte accumulator.','Upload uses it for the whole envelope; download uses it for the filename header. Memory grows with accumulated bytes.'],
  FileOutputStream:['An OutputStream that writes to a disk file.','Uploads and download staging need real disk persistence.'],
  FileInputStream:['An InputStream that reads from a disk file.','The TCP sender and staged HTTP copy need the original file bytes.'],
  Socket:['A connected TCP endpoint with input/output streams.','The download handler connects; the file listener accepts a connected Socket.'],
  ServerSocket:['A listening TCP endpoint that binds a port and accepts connections.','Each pending file creates one temporary listener.'],
  Files:['A utility class with filesystem operations and file-type detection.','Download uses Files.probeContentType for a response MIME guess.'],
  Path:['A typed filesystem path representation.','Path.of(fileName) supplies the name to the file-type detector; it does not open the file.'],
  UUID:['A type/factory for widely unique identifiers.','UUID.randomUUID prefixes stored names to reduce overwrite collisions.'],
  Random:['A pseudorandom number generator with bounded integer selection.','Used for candidate ports and six-digit PINs; it is not a cryptographic access-secret generator.'],
  ConcurrentHashMap:['A map supporting safe individual concurrent operations.','Several threads access registry/limiter maps; compound workflows and mutable values still require coordination.'],
  MultiParser:['Your narrow multipart parser class.','UploadHandler delegates name/type/payload extraction to it.'],
  UploadUtils:['Your static port-candidate helper.','FileSharer calls generatePort while looking for a registry key.'],
  Map:['The general key/value map interface, including Map.Entry.','FileSharer uses Map.Entry to loop over token-map entries during reverse lookup.']
};
const glossary = {
  public:'Visibility: code outside this package can access the member/type when its containing type permits it.',
  private:'Visibility: implementation details are confined to the containing class (including permitted nested-class access).',
  static:'Belongs to the class rather than one object. A static nested class has no implicit enclosing-instance reference.',
  final:'This variable/reference cannot be reassigned after initialization. An object/array referred to by it may still be mutable.',
  class:'Defines a named type and its members. A class declaration does not construct an instance.',
  new:'Construct an object or array. For a constructor, new invokes initialization; it does not necessarily start a task.',
  this:'The current object. this.field distinguishes an instance field from a same-named parameter.',
  void:'This method returns no value. return; exits it without a result.',
  int:'A primitive signed 32-bit integer, used here for ports, indexes and byte counts.',
  long:'A primitive signed 64-bit integer, used here for timestamps and accumulated byte sizes.',
  boolean:'A primitive true/false value used by conditions and validation flags.',
  byte:'A signed 8-bit primitive. byte[] holds arbitrary file bytes; read() uses int so it can additionally return -1.',
  String:'An immutable text object. String comparisons use equals for contents, not == for object identity.',
  Integer:'The reference/object form of int. It can be null and can be used as a generic map key/value.',
  null:'No object reference. Dereferencing it fails, so the code guards it or uses it as a missing-result signal.',
  return:'Exit the current method now. In a helper it exits that helper; in handle it ends that request callback.',
  if:'Run the controlled statement/block only when its condition is true.',
  else:'The alternative branch when the preceding if condition is false.',
  for:'Repeat with an index or visit each element. A colon in for(Type item : collection) is an enhanced for loop.',
  while:'Repeat while a condition is true; test it before each iteration.',
  break:'Exit the nearest enclosing loop/switch. Execution continues after it; this is not a method return.',
  try:'Run protected work. try(Resource r = ...) also automatically closes declared AutoCloseable resources.',
  catch:'Handle a matching exception thrown from the associated try; it does not catch failures in another thread.',
  finally:'Run cleanup when control leaves its associated try under normal Java unwinding, including return/exception paths; forced termination can prevent it.',
  throws:'Declare that a checked exception may propagate to the caller. This is not an exception handler.',
  implements:'Declare conformance to an interface contract such as HttpHandler or Runnable.',
  Override:'Compiler-checked annotation for a method overriding/implementing an inherited contract. It does not invoke the method.',
  '()':'Parentheses declare parameters, pass call arguments, group expressions or contain loop/condition syntax.',
  '{}':'Braces group a class/method/control block or array initializer. They do not make concurrent operations atomic.',
  '[]':'An array type/index, such as byte[] or buffer[0]. Array indexes are zero-based.',
  '.':'Access a member or invoke a method on a class/object, such as fileSharer.getToken(port). Chained calls pass the returned object to the next access.',
  ';':'End a Java statement/declaration; also separate for-loop clauses or try resource declarations.',
  '=':'Assign the right-side value to the left variable. It is not equality comparison.',
  '== / !=':'Equality/inequality. == null tests missing reference; String content should use equals.',
  '!':'Logical NOT: true becomes false and false becomes true.',
  '&& / ||':'Logical AND/OR with short-circuit evaluation: the right side is evaluated only when needed.',
  '++ / +=':'Increment, or add then assign. A compound update is not automatically atomic between threads.',
  '+':'Numeric addition for numbers; text concatenation when a String operand is involved.',
  '<>':'Generic type parameters, or diamond inference for a constructor. Map keys/values use reference types.',
  '->':'Lambda arrow: arguments on the left, deferred task expression/body on the right.',
  '? :':'Conditional expression: condition ? resultIfTrue : resultIfFalse.',
  'escapes':'Inside strings, \" is a quote, \\ a backslash, \r carriage return and \n newline. These characters differ from their written escape notation.'
};
const corrections = {
  'App.java':[[35,38,'System.exit normally runs already-registered hooks, but a startup failure before registration has no such hook. Forced termination can skip hooks.']],
  'FileController.java':[[16,20,'The controller stops HTTP/executor resources; it does not clean every pending file/listener.'],[33,34,'Ten HTTP workers can improve concurrency but do not guarantee overload protection; the queue and independent file threads remain unbounded.'],[46,47,'The cap concerns concurrently executing HTTP tasks, not total submitted requests or all service threads.']],
  'UploadUtils.java':[[7,7,'Dynamic/private range does not mean unused. This helper does not inspect or reserve OS ports.'],[12,13,'The +1 makes the range inclusive. This fixed calculation is not a binary-search overflow prevention technique.']],
  'FileSharer.java':[[15,20,'The intended single-share association is not a global uniqueness/cleanup guarantee under races or failure.'],[37,38,'The PIN is generated with Random and lacks uniqueness/guess-attempt enforcement; secure is an overstatement. The raw socket does not verify a PIN.'],[48,50,'Six digits describe its format, not uniqueness or verified user identity.'],[57,65,'Free means absent from one registry map here, not OS-available; token and concurrent port uniqueness are not guaranteed.'],[78,78,'This method checks the registry key, not disk existence or a listening socket.'],[103,104,'Recorded uploader host is not needed by the current DownloadHandler, which connects to localhost.'],[156,158,'Socket SO_TIMEOUT limits reads, not writes or total transfer duration. The sender later replaces it with 30000 ms.']],
  'DownloadHandler.java':[[105,106,'This probes a Path made from the reported filename; it is not content scanning of the staging file.'],[130,132,'finally attempts deletion; File.delete can fail and its result is ignored.']],
  'UploadHandler.java':[[21,22,'The binary unit is 500 MiB; request-envelope checks include overhead.'],[89,97,'Preflight depends on cross-origin request details, not merely sharing a file; some FormData POST requests can be CORS-safelisted.'],[98,101,'sendResponseHeaders does not stop execution. The subsequent return exits handle.'],[147,148,'Content-Type is read from request headers, not extracted from the body at this point.'],[247,248,'Suffix validation cannot prove that a permitted-named file is not malicious.'],[279,282,'The current frontend uses PIN-only lookup and dummy path port 0; it does not require the returned port.']]
};
// Identify comments and delimiters without treating strings such as JSON as code braces.
function lex(lines){
  let block=false;
  return lines.map(raw=>{
    let code='', structural='', quote=null;
    for(let i=0;i<raw.length;i++){
      const c=raw[i],next=raw[i+1];
      if(block){if(c==='*'&&next==='/'){block=false;i++;}continue;}
      if(quote){code+=c;if(c==='\\'){if(next!==undefined){code+=next;i++;}}else if(c===quote)quote=null;continue;}
      if(c==='/'&&next==='/')break;
      if(c==='/'&&next==='*'){block=true;i++;continue;}
      if(c==='"'||c==="'"){quote=c;code+=c;continue;}
      code+=c;structural+=c;
    }
    return {raw,code:code.trim(),structural};
  });
}
function syntaxFor(code){
  const hits=[];
  for(const key of Object.keys(glossary).filter(k=>/^\w+$/.test(k)&&k!=='escapes'))if(new RegExp(`\\b${key}\\b`).test(code))hits.push(key);
  if(/[()]/.test(code))hits.push('()');if(/[{}]/.test(code))hits.push('{}');if(/[\[\]]/.test(code))hits.push('[]');
  if(code.includes('.'))hits.push('.');if(code.includes(';'))hits.push(';');
  if(/(^|[^=!<>])=([^=]|$)/.test(code))hits.push('=');if(/==|!=/.test(code))hits.push('== / !=');
  if(/!(?!=)/.test(code))hits.push('!');if(/&&|\|\|/.test(code))hits.push('&& / ||');
  if(/\+\+|\+=/.test(code))hits.push('++ / +=');if(/\+/.test(code))hits.push('+');
  if(/<[A-Z]|<>/.test(code))hits.push('<>');if(code.includes('->'))hits.push('->');if(code.includes('?'))hits.push('? :');if(code.includes('\\'))hits.push('escapes');
  return [...new Set(hits)];
}
const data=[];
for(const name of order){
  const f=files[name],sourcePath=path.join(repo,'src','main','java','P2P',f.path),source=fs.readFileSync(sourcePath,'utf8');
  const raw=source.replace(/\r\n/g,'\n').split('\n');if(raw.at(-1)==='')raw.pop();
  const parsed=lex(raw),stack=[],pairs={};
  parsed.forEach((l,i)=>{for(const c of l.structural){if(c==='{')stack.push(i+1);if(c==='}'){const start=stack.pop();if(!start)throw Error(`Unmatched close ${name}:${i+1}`);(pairs[i+1]??=[]).push(start);}}});
  if(stack.length)throw Error(`Unclosed blocks ${name}`);
  for(const key of Object.keys(f.notes))if(!parsed[Number(key)-1]?.code)throw Error(`Annotation is not executable ${name}:${key}`);
  const rows=parsed.map((l,i)=>{
    const line=i+1;let note=f.notes[line],kind='code';
    if(!l.raw.trim()){kind='blank';note={what:'A blank line; it performs no operation.',why:'Spacing visually separates nearby declarations/steps. Java ignores this whitespace, so removing this line would not change runtime behavior.'};}
    else if(!l.code){kind='comment';const next=parsed.findIndex((item,j)=>j>i&&f.notes[j+1]);const target=next===-1?Object.keys(f.notes).map(Number).filter(x=>x<line).at(-1):next+1;const explained=f.notes[target];note={what:`This is explanatory comment text, not an executed Java statement. Its nearby code is explained at line ${target}: ${explained.what}`,why:'Comments record the author\'s intent for a human reader. The JVM does not enforce a comment; the statements and library contracts determine what actually happens.'};}
    else if(l.code.startsWith('package ')){kind='package';const pkg=l.code.slice(8,-1);note={what:`Declare that this file\'s types belong to the ${pkg} package.`,why:'Packages give classes organized, qualified names and define package-access boundaries. They are not threads or runtime servers.',example:`The directory below src/main/java follows the package parts. The fully qualified class name includes ${pkg}.`};}
    else if(l.code.startsWith('import ')){kind='import';const qualified=l.code.slice(7,-1),short=qualified.split('.').at(-1),role=imports[short];if(!role)throw Error(`Unexplained import ${qualified}`);note={what:`Make the type ${qualified} available by its short name ${short}. ${role[0]}`,why:`${role[1]} An import resolves a name for compilation; it does not instantiate an object, open a stream or run the imported class.`,example:`Without this import you could write the fully qualified name ${qualified} where ${short} is used.`};}
    else if(l.code==='}'){kind='brace';const start=pairs[line]?.[0];if(!start)throw Error(`Unknown brace ${name}:${line}`);const opener=parsed[start-1].code;note={what:`Close the block opened on line ${start}: ${opener}`,why:'Braces establish scope and control-flow boundaries. Following statements are outside this just-closed block. Local variables declared inside it are not generally available outside; a try-with-resources block also closes its owned resources on exit.',example:`Match this } back to line ${start}\'s { before deciding which method, loop, condition or resource lifetime has ended.`};}
    else if(!note)throw Error(`Missing authored code explanation ${name}:${line}: ${l.code}`);
    if(!note.what||!note.why)throw Error(`Incomplete ${name}:${line}`);
    const caveats=(corrections[name]||[]).filter(([a,b])=>line>=a&&line<=b).map(x=>x[2]);
    return {line,raw:l.raw,code:l.code,kind,...note,caution:[note.caution||'',...caveats].filter(Boolean).join(' '),syntax:kind==='code'||kind==='brace'?syntaxFor(l.code):[]};
  });
  data.push({...f,id:name.replace('.java','').toLowerCase(),hash:crypto.createHash('sha256').update(source).digest('hex'),rows,notes:undefined});
}
const totals={files:data.length,lines:data.reduce((sum,f)=>sum+f.rows.length,0),authoredStatements:data.reduce((sum,f)=>sum+f.rows.filter(l=>l.kind==='code').length,0)};
const intro = `# Every Line of SkyLink P2P, Explained\n\nWritten for a beginner returning to this project. Covers all eight production Java files in the screenshot, with their original line numbers and original text. Snapshot: 8 October 2026. This is a code-teaching guide, not a claim that reading it alone establishes interview mastery.\n\n[Open the interactive line reader](code-walkthrough/index.html). [Overall flow and interview plan](../INTERVIEW_PREP.md). [Run a local transfer](HOW_TO_RUN.md).\n\n## Before Reading Any Code\n\nA class is a blueprint; an object is one instance constructed with new. A variable is a named slot holding a primitive value or an object reference. A method is a named operation; declaring it does not call it. A constructor initializes an object. A parameter is input to a call; a return value is its output. Fields remain with an object/class, while local variables belong to an invocation/scope. Two variables can refer to the same mutable object.\n\nThe operating system runs your Java process. The JVM executes your code. This process hosts an HTTP API and also per-file TCP listeners. Both browsers call the HTTP API; they do not host your ServerSocket. localhost inside DownloadHandler means this server host. Uploaded plaintext first accumulates in heap, then goes to temporary disk. The internal socket sends it to DownloadHandler, which stages it to a second file before returning HTTP.\n\nRead in the order below. Do not attempt all ${totals.lines} physical lines in one sitting. For a small block, explain what exists before it, what changes, where the next call goes, and which branch can return early. The reader lets you select every line, including comments/blank lines; program statements have individually authored explanations.\n\n## Read a Statement Token by Token\n\n\`FileController fileController = new FileController(port);\` reads as: the variable type is FileController; its name is fileController; = assigns the constructor result; new creates an object; (port) passes the numeric port; ; ends the statement. The constructor initializes fields and routes. The separate \`fileController.start();\` call starts HTTP processing. Uppercase/lowercase names are conventions, not hidden Java behavior.\n\n\`while ((bytesRead = stream.read(buffer)) != -1)\` reads as: call read to fill up to the buffer capacity; save its actual count in bytesRead; compare with EOF -1; run the body if not EOF; repeat. A 5000-byte file might read 4096, then 904, then -1. Write only the actual count, not the whole buffer.\n\n## Read These Chapters in Order\n\n`;
const md=[intro];
data.forEach((f,index)=>md.push(`${index+1}. [${f.name}](#${f.id}): ${f.purpose}`));
md.push('\n## Syntax Dictionary\n');
for(const [term,meaning] of Object.entries(glossary))md.push(`- **${term}:** ${meaning}`);
md.push('\n## Source Coverage\n',`All ${totals.files} files / ${totals.lines} physical lines / ${totals.authoredStatements} individually annotated code lines. Package/import declarations, comments, blank lines and closing braces are also explained. Source files are unchanged. The generator rejects any executable line without an authored explanation.\n`);
for(const f of data){
  md.push(`<a id="${f.id}"></a>\n\n## ${f.name}\n\n**Source:** [${f.path}](../src/main/java/P2P/${f.path})\n\n**Purpose:** ${f.purpose}\n\n**Who calls it:** ${f.caller}\n\n**Picture it:** ${f.analogy}\n\n**Snapshot SHA-256:** \`${f.hash}\`\n`);
  for(const row of f.rows){
    md.push(`<a id="${f.id}-l${row.line}"></a>\n\n### Line ${row.line} (${row.kind})\n\n\`\`\`java\n${row.raw}\n\`\`\`\n\n**What it does:** ${row.what}\n\n**Why it is here:** ${row.why}\n`);
    if(row.example)md.push(`**Example / read it aloud:** ${row.example}\n`);
    if(row.syntax.length)md.push(`**Syntax on this line:** ${row.syntax.map(k=>`${k}: ${glossary[k]}`).join(' ')}\n`);
    if(row.caution)md.push(`**Actual behavior / caution:** ${row.caution}\n`);
  }
  md.push('### Pause and Check Your Understanding\n');
  for(const [question,answer] of f.checks)md.push(`**Question:** ${question}\n\n**Answer:** ${answer}\n`);
}
md.push('## Trace a Complete Transfer by Source Lines\n',
'1. App L14/L17/L18 -> FileController L28-L46/L52: compute API port, build shared service/handlers and start HTTP.\n',
'2. UploadHandler L94-L178: return early for preflight, wrong method, rate/type/declared-size rejection.\n',
'3. UploadHandler L184-L221 -> MultiParser L50-L91: extract boundary, accumulate envelope, parse headers and copy payload.\n',
'4. UploadHandler L268-L277 -> FileSharer L66-L74/L136-L160: save disk, register path/PIN, start a listener thread.\n',
'5. UploadHandler L282-L286: return JSON; the browser displays/shares the PIN.\n',
'6. DownloadHandler L52-L79 -> FileSharer L94-L100: extract query PIN, find actual port, reject missing lookup, connect locally.\n',
'7. FileSharer L179-L196 -> DownloadHandler L88-L103: sender writes filename/newline plus disk bytes, receiver stages bytes until EOF.\n',
'8. DownloadHandler L106-L127 -> FileSharer L118-L131: set HTTP attachment, copy staged file, attempt original deletion and remove maps. L129-L132 attempts staging deletion.\n',
'For current timeout/race/partial-transfer behavior, read the cautions at those exact lines. Proposed improvements are explanations, not changes to the Java implementation.\n',
'## Library Contracts Used for Accuracy\n',
'[JDK HttpServer](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpServer.html), [HttpExchange response lengths](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpExchange.html), [Socket read timeout](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/Socket.html), [ServerSocket accept/bind](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/ServerSocket.html), [ConcurrentHashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html), [ExecutorService shutdown](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ExecutorService.html), [File.delete/deleteOnExit](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/File.html).\n',
'## Snapshot Maintenance\n',
'The reader includes the source snapshot so it works offline. If Java source changes, rerun `node docs/code-walkthrough/build.cjs` and update annotations for any changed line meaning. Line-number coverage checks cannot prove that an explanation still matches a changed statement; review the content too.\n');
fs.writeFileSync(path.join(repo,'docs','LINE_BY_LINE_GUIDE.md'),md.join('\n'));
fs.writeFileSync(path.join(__dirname,'snapshot.js'),`window.SKYLINK_CODE = ${JSON.stringify({files:data,glossary,totals},null,2)};\n`);
console.log(JSON.stringify(totals));
