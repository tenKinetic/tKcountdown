var path = require("path");
var webpack = require("webpack");

module.exports = function(entries, release) {
  var config = {
    // entry file to start from
    entry: entries,
    output: {
      // directory to output to
      path: path.resolve("./lib"),
      // output file name
      filename: "[name].js"
    },
    plugins: [
      /*
     * This makes the left side variable available in every module and assigned to the right side module
     */
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "window.$": "jquery"
      })
    ]
  };

  if (release) {
    var uglify = new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    });
    config.plugins.push(uglify);
  }else{
    //config.devtool = 'cheap-eval-source-map';
  }

  return config;
};
