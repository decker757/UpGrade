#!/bin/bash
# Run this on the EC2 instance after SSH-ing in.
# Usage: bash deploy.sh

set -e
cd /home/ec2-user/UpGrade

echo "==> Pulling latest code..."
git pull origin main

echo "==> Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt gunicorn
deactivate
cd ..

echo "==> Installing frontend dependencies and building..."
cd frontend
npm ci
npm run build
cd ..

echo "==> Restarting services with PM2..."
pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js
pm2 save

echo "==> Done. App running at http://3.26.103.83"
