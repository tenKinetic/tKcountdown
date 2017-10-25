var path = require("path");
var fs = require("fs");
var pages = require('./config/pages');

function makeWebpackConfig(pages, build) {
  var entries = {};
  for (var i = 0; i < pages.length; i++) {
    var page = pages[i];
    var dest = path.join(page.destDir(build), "countdown");
    var src = path.resolve(path.join(page.srcDir, "countdown.js"));
    entries[dest] = src;
  }
  return entries;
}

function makeSassConfig(pages, build) {
  function makeConfig(page) {
    return {
      expand: true,
      cwd: page.srcDir,
      src: ["countdown.scss"],
      dest: page.destDir(build),
      ext: ".css"
    };
  }
  return pages.map(makeConfig);
}

module.exports = function(grunt) {
  var webpackConfig = require("./webpack.config");
  require("load-grunt-tasks")(grunt);

  var projectId = "tv-av";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: {
      prebuild: {
        options: {
          force: true
        },
        src: ["lib/**/*"]
      }
    },
    copy: {
      lib: {
        files: [
          {
            expand: true,
            cwd:'.',
            src:'countdown_lib.ejs',
            dest: 'lib/',
            rename: () => {return 'lib/countdown.ejs'}
          }
        ]
      }
    },
    sass: {
      lib: {
        options: {
          sourceMap: true
        },
        files: makeSassConfig(pages, "./lib")
      }
    },
    webpack: {
      lib: webpackConfig(makeWebpackConfig(pages, "."), false)
    }
  });
  // grunt.loadNpmTasks('grunt-ftp-deploy')
  grunt.loadNpmTasks("grunt-webpack");

  grunt.registerTask(
    "zip",
    "Build zip of each page",
    require("./.grunt/zip-task")(pages)
  );

  grunt.registerTask(
    "ejs",
    "build html from ejs templates",
    require('./.grunt/compile-ejs-task')(pages)
  );

  // task(s)
  grunt.registerTask("build", [
    "clean:prebuild",
    "webpack:lib",
    'copy:lib',
    "sass:lib",
    'ejs:lib'
  ]);

};
