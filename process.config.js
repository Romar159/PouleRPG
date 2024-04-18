module.exports = {
  apps : [{
    script: "./main.js",
    watch: true,
    ignore_watch : ["logs", "assets/*"],
    watch_options: {
      followSymlinks : false
    } 
  }]
}
