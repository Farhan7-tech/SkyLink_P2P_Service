package P2P.Service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import P2P.Utils.UploadUtils;

class FileSharerTest {

    @TempDir
    Path tmp;

    private Path newFile(String name) throws IOException {
        return Files.writeString(tmp.resolve(name), "payload");
    }

    @Test
    void offeredFileGetsASixDigitTokenAndIsRegistered() throws IOException {
        FileSharer sharer = new FileSharer();
        Path file = newFile("a.txt");

        int port = sharer.offerFile(file.toString(), "10.0.0.5");

        String token = sharer.getToken(port);
        assertTrue(token.matches("\\d{6}"), "token should be six digits, was " + token);
        assertTrue(sharer.isPortOccupied(port));
        assertEquals(file.toString(), sharer.getFilePath(port));
        assertEquals("10.0.0.5", sharer.getHostByPort(port));
    }

    @Test
    void tokenValidationAndReverseLookup() throws IOException {
        FileSharer sharer = new FileSharer();
        int port = sharer.offerFile(newFile("b.txt").toString(), "localhost");
        String token = sharer.getToken(port);

        assertTrue(sharer.validateToken(port, token));
        assertFalse(sharer.validateToken(port, null));
        assertFalse(sharer.validateToken(port, token.equals("000000") ? "111111" : "000000"));
        assertEquals(port, sharer.getPortByToken(token));
        assertNull(sharer.getPortByToken("not-a-token"));
    }

    @Test
    void eachOfferGetsItsOwnPort() throws IOException {
        FileSharer sharer = new FileSharer();

        int first = sharer.offerFile(newFile("c.txt").toString(), "localhost");
        int second = sharer.offerFile(newFile("d.txt").toString(), "localhost");

        assertNotEquals(first, second);
    }

    @Test
    void cleanupDeletesTheFileAndForgetsPortAndToken() throws IOException {
        FileSharer sharer = new FileSharer();
        Path file = newFile("e.txt");
        int port = sharer.offerFile(file.toString(), "localhost");
        String token = sharer.getToken(port);

        sharer.cleanupAfterDownload(port);

        assertFalse(Files.exists(file));
        assertFalse(sharer.isPortOccupied(port));
        assertNull(sharer.getToken(port));
        assertNull(sharer.getPortByToken(token));
    }

    @Test
    void generatedPortsStayInTheDynamicRange() {
        for (int i = 0; i < 2_000; i++) {
            int port = UploadUtils.generatePort();
            assertTrue(port >= 49152 && port <= 65535, "port out of range: " + port);
        }
    }
}
