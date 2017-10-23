var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var ejs = require('ejs');

var async = require("async");
var archiver = require("archiver");

module.exports = function(pages) {
  return function task(build) {

    var buildConfig = {
      isRelease: build === 'release'
    };
    for(var i = 0; i < pages.length; i ++){
      var page = pages[i];
      console.log('Compiling Template: '+page.name);
      var filename = path.resolve(page.srcDir,'index.ejs');
      console.log(`Build: ${build}`);
      buildConfig.styles = fs.readFileSync(path.resolve(page.destDir(build), 'countdown.css'));
      buildConfig.javascript = fs.readFileSync(path.resolve(page.destDir(build), 'countdown.js'));

      var text = fs.readFileSync(filename, 'utf8');
      var template = ejs.compile(text);
      var html = ejs.render(text, Object.assign({}, page.data, buildConfig), {filename: filename});
      var destFilename = path.resolve(page.destDir(build), 'index.html');
      fs.writeFileSync(destFilename, html);
    }

  };
};
