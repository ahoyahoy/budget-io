/*jshint node:true*/
/* global require, module */
var EmberApp = require("ember-cli/lib/broccoli/ember-app")
var autoprefixer = require("autoprefixer")
var CssImport = require("postcss-import")
var CssNested = require("postcss-nested")

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    hinting: false,
    sassOptions: {
    },
    babel: {
      optional: [
        "es7.decorators",
        "es7.classProperties",
        "es7.asyncFunctions"
      ]
    }
  })

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  /*
  app.import("vendor/amcharts/amcharts.js")
  app.import("vendor/amcharts/serial.js")
  app.import("vendor/amcharts/plugins/responsive/responsive.js")
  */

  //app.import("vendor/dygraph.js")
  //app.import("vendor/dygraph-sync.js")

  //app.import("vendor/nv.d3.js")

  app.import("vendor/jquery-ui.min.js")
  app.import("vendor/jquery-scrolltofixed.js")


  return app.toTree()
}
