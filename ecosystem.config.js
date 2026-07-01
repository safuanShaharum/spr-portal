// PM2 process config for SPR Open Data Portal.
// Usage: pm2 start ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: 'spr-portal',
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // WP on this box serves over https with a self-signed cert (internal
        // localhost). Allow the server to fetch it (infografik/perundangan/faq
        // APIs + /api/proxy-file KMZ/dataset downloads). Remove once WP has a
        // trusted cert. Only affects this process's outbound HTTPS.
        NODE_TLS_REJECT_UNAUTHORIZED: '0',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_TLS_REJECT_UNAUTHORIZED: '0',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
