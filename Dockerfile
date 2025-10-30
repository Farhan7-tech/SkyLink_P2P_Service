# Stage 1: Build the Java application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package dependency:copy-dependencies -DskipTests

# Stage 2: Run the built app
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copy built jar and dependencies
COPY --from=build /build/target/P2P-1.0-SNAPSHOT.jar app.jar
COPY --from=build /build/target/dependency/*.jar ./lib/

# Main API port (used by frontend)
EXPOSE 8081

ENV SERVER_PORT=8081


# Run your Java app (your main class: P2P.App)
CMD ["java", "-cp", "app.jar:lib/*", "P2P.App"]

