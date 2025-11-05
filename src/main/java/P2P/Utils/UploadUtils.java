package P2P.Utils;

import java.util.Random;

public class UploadUtils {
    public static int generatePort(){
        // these are basically unreserved ports, that are not taken by any application
        int DYNAMIC_STARTING_PORT = 49152;
        int DYNAMIC_ENDING_PORT = 65535;
        int range = (DYNAMIC_ENDING_PORT - DYNAMIC_STARTING_PORT) + 1; // inclusive
        Random random = new Random();
        // Doing this to prevent overflow, like we do in binary search
        return DYNAMIC_STARTING_PORT + random.nextInt(range);
    }
}
