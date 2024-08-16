module.exports = {
  apps: [
    {
      name: "IBT-Headless",
      script: "npm",
      args: "start",
      time: true,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "root",  // Your SSH username
      host: "headless.saggitari.us",  // Your server's domain or IP address
      ref: "origin/main",
      repo: "git@github.com:Alex-Scott-NZ/IBT-React.git",  // Replace with your GitHub repository's SSH URL
      path: "/home/saggitari/web/headless.saggitari.us/app",  // Path on your server where the app will be deployed
      "pre-deploy-local": "",
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};

