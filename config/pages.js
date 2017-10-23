var path = require('path');
function getPagePath(pagePath) {
  return function(build) {
    return path.join("./", build, pagePath)
  }
}
/**
 * this expects a folder to have index.html, scripts.js and styles.scss and this makes up a P5 page in AEM
 */
module.exports = [
  {
    name: "tk-countdown",
    srcDir: ".",
    destDir: getPagePath("/"),
    data: {
      pageURL: "/",
      description: "Tk Countdown.",
      title: "Coundtown to event",
      omniPageType: "vd mkt page_tk"
    }
  }
]
