var gulp        = require('gulp');
var g           = require('gulp-load-plugins')({lazy: false});
var noop        = g.util.noop;
var es          = require('event-stream');
var bowerFiles  = require('main-bower-files');
var rimraf      = require('rimraf');
var queue       = require('streamqueue');
var lazypipe    = require('lazypipe');
var stylish     = require('jshint-stylish');
var bower       = require('./bower');
var jade        = require('gulp-jade');
var tinylr      = require('tiny-lr');
var util        = require('util');

var tinyServer      = tinylr();
var tinyServer_port = 35729;

// GULP PATHS
var errorHandler    = require('./build/errors');
var config          = require('./build/config');
var client          = config.client;
var tmp             = config.build;


var Gulper              = require('./gulperfile');



gulp.task('clean', function ( done ){
   return gulp.src( tmp.path ).pipe( g.clean() );
});


/*
 *=========================
 *
 *  GULP BUILD TASKS
 *
 *========================
 */

  /*
   *  Javascript Scripts
   */
  gulp.task('scripts:root', function(){
    return gulp.src(client.scripts.root)
      .pipe( g.jshint())
        .on('error', errorHandler.onWarning )
      .pipe( g.jshint.reporter('default') )
      .pipe( g.ngAnnotate() )
      .pipe( g.rename(config.app_file_name ) )
      .pipe( gulp.dest( dist.scripts ) )
  });

  gulp.task('scripts:bundle', function(){
    return gulp.src( client.scripts.modules )
      .pipe( g.jshint() )
        .on('error', errorHandler.onWarning )
      .pipe( g.jshint.reporter('default') )
      .pipe( g.ngAnnotate() )
      .pipe( g.concat( config.modules_file_name ) )
      .pipe( g.uglify() )
      .pipe( gulp.dest( dist.scripts ) )
  });
  gulp.task('scripts:vendor', function(){
    return gulp.src( client.vendor )
      .pipe( g.concat( config.vendor_file_name ) )
      .pipe( g.uglify() )
      .pipe( gulp.dest( dist.scripts ) );
  });

  /*
   *  MINIFY IMAGES
   */
  gulp.task('imagemin', function() {
    return gulp.src( client.images )
      .pipe( changed( tmp.images ) )
      .pipe( imagemin() )
      .pipe(gulp.dest( tmp.images ));
  });


/*
 *=========================
 *
 *  GULP SERVER & BUILD TASKS
 *
 *========================
 */

  /*
   *  COMPILE TEMPLATES and place them into the .tmp directory
   */
  gulp.task('templates:jade', function(){
    return gulp.src( client.templates.jade )
      .pipe( g.jade() )
      .pipe( g.angularTemplatecache( config.jade_file_name, { module: config.module_name }))
      .pipe( gulp.dest( config.build.templatesPath ))
      .pipe( g.livereload() );
  });
  gulp.task('templates:html', function(){
    return gulp.src( client.templates.html )
      .pipe( g.angularTemplatecache( config.html_file_name, { module: config.module_name } ) )
      .pipe( gulp.dest( config.build.templatesPath ) )
      .pipe( g.livereload() );
  });

/*
 * END GULP SERVER & BUILD TASKS
 *==============================
 */

 /*
 *=========================
 *
 *  GULP SERVER TASKS
 *
 *========================
 */

  /*
   *  RUN JSHINT ON SCRIPTS
   */
  gulp.task('jshint:scripts', function(){
    return gulp.src(client.scripts.root, client.scripts.modules)
      .pipe( g.jshint())
        .on('error', errorHandler.onWarning )
      .pipe( g.jshint.reporter('default') )
      .pipe( g.livereload( ) );
  });

  /*
   *  INJECT BOWER DEPENDENCIES
   */
  gulp.task('inject:bower', function () {
    var wiredep = require('wiredep').stream;
    gulp.src(client.index)
      .pipe(wiredep({
        directory: client.bower,
        exclude: ['bootstrap-sass-official']
      }))
      .pipe( gulp.dest( client.path ) );
  });

  /*
   *  INJECT STYLES  (Only used when a new file is added during gulp.watch)
   */
  gulp.task('inject:styles', function(){
    var index = gulp.src( client.index );
    var styles = gulp.src([client.styles.css], { read: false } );
    return index
      .pipe( g.inject( styles, { name:'styles', addRootSlash: false, relative:true }))
      .pipe( gulp.dest( client.path ) );
  });

  /*
   *  INJECT SCRIPTS  (Only used when a new file is added during gulp.watch)
   */
  gulp.task('inject:scripts',[
    'jshint:scripts'],
    function(){
      var target = gulp.src( client.index );
      var bundle = gulp.src( client.scripts.modules, {read: false} );
      return target
        .pipe(g.inject(bundle, {
            addRootSlash: false,
            relative: true,
            name: 'bundle',
          }))
        .pipe( gulp.dest( client.path ) )
    }
  );

  /*
   *  INJECT TEMPLATES  (Only used when a new file is added during gulp.watch)
   */
  gulp.task('inject:templates', function(){
    var target = gulp.src( client.index );
    var templates = gulp.src( tmp.templates, {read: false} );
    return target
      .pipe(g.inject(templates, {
        addRootSlash: true,
        name: 'templates',
        ignorePath: '.tmp'
      })).pipe(gulp.dest( client.path ));
  });

  /*
   *  INJECT VENDORS  (Only used when a new file is added during gulp.watch)
   */
  gulp.task('inject:vendor', function(){
    var target = gulp.src( client.index );
    var vendor = gulp.src( client.vendor, {read: false} );
    return target
      .pipe( g.inject( bundle, {
          addRootSlash: false,
          relative: true,
          name: 'vendor',
      } ) )
      .pipe( gulp.dest( client.path ) );
  });

  /*
   * Compile Both jade anf html templates
   */
  gulp.task('server:templates', function (done){
    g.runSequence([
      'templates:jade',
      'templates:html'
    ], done)
  });


  /*
   * Server Build
   */
  gulp.task('server:build',[
    'clean',
    'jshint:scripts',
    'server:templates',
    'inject:bower'],
    function( cb ){
      return buildInjector();
    }
  );

  /*
   *  Run Server
   *  ==========
   */
  gulp.task('server:run', function () {
    require('./servers/server/app.js');
    // return g.nodemon({
    //     script: './servers/server/app.js',
    //     ext: 'html js',
    //   })
    //   .on('change', [''])
    //   .on('restart', function () {
    //     console.log('restarted!')
    //   });
  });

  /*
   *  Watch Files
   *  ============
   */
  gulp.task('watch', function(){
    // tinyServer.listen(tinyServer_port  , function (err) {
    //     if (err) return console.log(err);

        // This is a custome built gulp plugin;
    gulp.start('gulp:watcher');

    // });

  });


  gulp.task('serve', ['server']);

/*
 * END GULP SERVER TASKS
 *======================
 */

/*
 * Server & Serve commands
 */
gulp.task('server', ['server:build', 'watch'], function ( callback ){
  g.runSequence('server:run', callback);
});

/*
 * Default
 */
gulp.task('default', ['server']);

gulp.task('gulper', function(){
  var gulper = require('./gulperfile.js')();
  gulper.runWatch()
});

// function runGulpWatch(){

gulp.task('gulp:watcher', function(){

  // gulp.watch( [client.scripts.root, client.scripts.modules], ['jshint:scripts']);
  gulp.watch( client.templates.jade, ['templates:jade']);
  gulp.watch( client.templates.html, ['templates:html']);
  gulp.watch( './gulperfile.js', ['gulper'] )

  var BuiltFiles = [
    client.scripts.root,
    client.scripts.modules,
    tmp.styles + '*.css',
    tmp.scripts + '*.js',
    tmp.templates + '*.js',
  ]
  gulp.watch(BuiltFiles, notifyLiveReload)
});
// }

function notifyLiveReload(event){
  console.log('File ' + event.path + ' was ' + event.type + ', reloading...');
  gulp.src(event.path, { read:false })
    .pipe( g.livereload( ) );
}

function injector(options){
  return options.target
    .pipe( g.inject(options.styles.src, options.styles.params) )
    .pipe( g.inject(options.vendor.src, options.vendor.params) )
    .pipe( g.inject(options.root.src, options.root.params) )
    .pipe( g.inject(options.bundle.src, options.bundle.params) )
    .pipe( g.inject(options.templates.src, options.templates.params) )
    .pipe( gulp.dest( client.path ) );

}

function buildInjector(){
  var options = {
      target: gulp.src( client.index ),
      dest: client.path,
      styles: {
        src: gulp.src( client.styles.css, {read:false}),
        params: {addRootSlash:false, relative:true, name:'styles'}
      },
      vendor: {
        src: gulp.src( client.vendor, {read:false}),
        params: {addRootSlash:false, relative:true, name:'vendor'}
      },
      root: {
        src: gulp.src( client.scripts.root, {read:false}),
        params: {addRootSlash:false, relative:true, name:'root'}
      },
      bundle:{
        src: gulp.src( client.scripts.modules, {read:false}),
        params: {addRootSlash:false, relative:true, name:'bundle'}
      },
      templates: {
        src: gulp.src( tmp.templates, {read:false}),
        params: {addRootSlash:true, ignorePath:'.tmp', name:'templates'}
      }
    }
    return injector(options);
}