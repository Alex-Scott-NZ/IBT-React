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
      user: "root",
      host: "headless.saggitari.us",
      ref: "origin/main",
      repo: "git@github.com:Alex-Scott-NZ/IBT-React.git",
      path: "/home/saggitari/web/headless.saggitari.us/app",
      "pre-deploy-local": "",
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
