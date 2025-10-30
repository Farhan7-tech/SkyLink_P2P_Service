# Build and run backend only
echo "Building Java backend..."
mvn clean package

echo "Starting Java backend..."
java -jar target/p2p-1.0-SNAPSHOT.jar