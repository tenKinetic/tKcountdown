var fs = require("fs");
var mkdirp = require("mkdirp");
var async = require("async");
var archiver = require("archiver");
var path = require('path');

module.exports = function(pages) {
  return function taks(build) {
    var done = this.async();

    mkdirp.sync("../artifacts");

    function makeZip(page, done) {
      var dir = path.resolve(__dirname, '..', page.destDir(build));
      var html = path.resolve(dir, "index.html");
      var css = path.resolve(dir, "countdown.css");
      var map = path.resolve(dir, "countdown.css.map");
      var js = path.resolve(dir, "coountdown.js");

      var output = fs.createWriteStream(
        path.resolve(__dirname, '..', "artifacts", page.name + ".zip")
      );

      var archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(output);
      archive.on('error', console.error);
      archive.append(fs.createReadStream(html), { name: "index.html" });
      archive.append(fs.createReadStream(css), { name: "countdown.css" });
      archive.append(fs.createReadStream(map), { name: "countdown.css.map" });
      archive.append(fs.createReadStream(js), { name: "countdown.js" });
      archive.finalize();
      output.on("close", done);
    }

    let tasks = pages.map(function(page) {
      return function(callback) {
        makeZip(page, callback);
      };
    });

    async.parallel(tasks, function(err, results) {
      done();
    });
  };
};
