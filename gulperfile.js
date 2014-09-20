;(function(){
'use-strict';
  var gulp    = require('gulp');
  var config  = require('./build/config.js');

  module.exports = function(config){

    function Gulper(config){
      this.config = config,
      this.client = config.client
      this.tmp = config.build
    }
    Gulper.prototype = Object.create(Gulper.prototype);
    Gulper.prototype.constructor = Gulper;

    Gulper.prototype.runWatch = function(){
      gulp.watch( client.templates.jade, ['templates:jade']);
      gulp.watch( client.templates.html, ['templates:html']);

      var BuiltFiles = [
        client.scripts.root,
        client.scripts.modules,
        tmp.styles + '*.css',
        tmp.scripts + '*.js',
        tmp.templates + '*.js',
      ]
      gulp.watch(BuiltFiles, notifyLiveReload);
    }


    return new Gulper(config);
  }

})();