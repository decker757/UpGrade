module.exports = {
  apps: [
    {
      name: 'upgrade-flask',
      cwd: '/home/ec2-user/UpGrade/backend',
      script: '/home/ec2-user/UpGrade/backend/venv/bin/gunicorn',
      args: 'app:app --workers 2 --bind 0.0.0.0:5001',
      interpreter: 'none',
      env: { FLASK_ENV: 'production' },
    },
    {
      name: 'upgrade-next',
      cwd: '/home/ec2-user/UpGrade/frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      interpreter: 'none',
      env: { NODE_ENV: 'production' },
    },
  ],
}
