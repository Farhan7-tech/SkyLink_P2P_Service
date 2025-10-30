#!/bin/bash
set -e

echo "=== SkyLink Backend Setup Script ==="

# Update system
sudo apt update && sudo apt upgrade -y

# Install Java & Maven
sudo apt install -y openjdk-17-jdk maven

# Install Nginx & PM2
sudo apt install -y nginx
sudo npm install -g pm2

# Build backend
echo "Building Java backend..."
mvn clean package


# Set up Nginx for API proxy
echo "Configuring Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default

cat <<EOF | sudo tee /etc/nginx/sites-available/skylink
server {
    listen 81;
    server_name _;

    location /api/ {
        proxy_pass http://localhost:8081/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
}
EOF

sudo ln -sf /etc/nginx/sites-available/skylink /etc/nginx/sites-enabled/skylink
sudo nginx -t && sudo systemctl restart nginx

# Start backend using PM2
CLASSPATH="target/P2P-1.0-SNAPSHOT.jar:$(mvn dependency:build-classpath -DincludeScope=runtime -Dmdep.outputFile=/dev/stdout -q)"
pm2 start --name skylink-backend java -- -cp "$CLASSPATH" P2P.App
pm2 save
pm2 startup

echo "=== Setup Complete ==="
echo "Backend API: http://<your-lightsail-ip>/api/"
echo "Frontend is served from Netlify and communicates with this API."
