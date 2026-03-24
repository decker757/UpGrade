module.exports = {
  apps: [
    {
      name: 'upgrade-flask',
      cwd: '/home/ubuntu/HackInTheClouds/backend',
      script: '/home/ubuntu/HackInTheClouds/backend/venv/bin/gunicorn',
      args: 'app:app --workers 2 --bind 0.0.0.0:5001',
      interpreter: 'none',
      env: { FLASK_ENV: 'production' },
    },
    {
      name: 'upgrade-next',
      cwd: '/home/ubuntu/HackInTheClouds/frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      interpreter: 'none',
      env: { NODE_ENV: 'production' },
    },
  ],
}
