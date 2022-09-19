module.exports = {
  apps : [{
    script: "./main.js",
    watch: true,
    ignore_watch : ["logs"],
    watch_options: {
      followSymlinks : false
    } 
  }]
}
