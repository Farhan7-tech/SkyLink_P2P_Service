package P2P.Utils;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;

class MultiParserTest {

    private static final String BOUNDARY = "----SkyLinkBoundary42";

    private static byte[] body(String disposition, String contentType, byte[] content) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        StringBuilder head = new StringBuilder();
        head.append("--").append(BOUNDARY).append("\r\n");
        head.append(disposition).append("\r\n");
        if (contentType != null) {
            head.append("Content-Type: ").append(contentType).append("\r\n");
        }
        head.append("\r\n");
        out.writeBytes(head.toString().getBytes(StandardCharsets.US_ASCII));
        out.writeBytes(content);
        out.writeBytes(("\r\n--" + BOUNDARY + "--\r\n").getBytes(StandardCharsets.US_ASCII));
        return out.toByteArray();
    }

    @Test
    void parsesFileNameContentTypeAndContent() {
        byte[] content = "hello skylink".getBytes(StandardCharsets.UTF_8);
        byte[] data = body("Content-Disposition: form-data; name=\"file\"; filename=\"notes.txt\"", "text/plain", content);

        MultiParser.ParseResult result = new MultiParser(data, BOUNDARY).parse();

        assertNotNull(result);
        assertEquals("notes.txt", result.fileName);
        assertEquals("text/plain", result.contentType);
        assertArrayEquals(content, result.fileContent);
    }

    @Test
    void keepsBinaryContentIntact() {
        byte[] content = new byte[256];
        for (int i = 0; i < content.length; i++) {
            content[i] = (byte) i;
        }
        byte[] data = body("Content-Disposition: form-data; name=\"file\"; filename=\"blob.zip\"", "application/zip", content);

        MultiParser.ParseResult result = new MultiParser(data, BOUNDARY).parse();

        assertNotNull(result);
        assertArrayEquals(content, result.fileContent);
    }

    @Test
    void defaultsContentTypeWhenPartHasNone() {
        byte[] data = body("Content-Disposition: form-data; name=\"file\"; filename=\"data.csv\"", null, "a,b\n1,2".getBytes(StandardCharsets.UTF_8));

        MultiParser.ParseResult result = new MultiParser(data, BOUNDARY).parse();

        assertNotNull(result);
        assertEquals("application/octet-stream", result.contentType);
    }

    @Test
    void returnsNullWhenThereIsNoFileName() {
        byte[] data = body("Content-Disposition: form-data; name=\"comment\"", null, "just text".getBytes(StandardCharsets.UTF_8));

        assertNull(new MultiParser(data, BOUNDARY).parse());
    }

    @Test
    void returnsNullWhenClosingBoundaryIsMissing() {
        String truncated = "--" + BOUNDARY + "\r\n"
                + "Content-Disposition: form-data; name=\"file\"; filename=\"cut.txt\"\r\n\r\n"
                + "the upload stopped here";

        assertNull(new MultiParser(truncated.getBytes(StandardCharsets.US_ASCII), BOUNDARY).parse());
    }
}
