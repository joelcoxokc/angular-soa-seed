var gulp        = require('gulp'),
    g           = require('gulp-load-plugins')({lazy: false}),
    noop        = g.util.noop,
    es          = require('event-stream'),
    bowerFiles  = require('main-bower-files'),
    rimraf      = require('rimraf'),
    queue       = require('streamqueue'),
    lazypipe    = require('lazypipe'),
    stylish     = require('jshint-stylish'),
    bower       = require('./bower'),
    isWatching  = false,
    jade        = require('gulp-jade'),
    del         = require('del');


var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

var errorHandler  = require('./build/errors');
var config        = require('./build/config');


var client = config.client;
var tmp = config.build;

gulp.task('clean', function(done){
   return gulp.src(tmp.path).pipe(g.clean());
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
      .pipe( g.jshint.reporter('default') );
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
  gulp.task('inject:scripts',['jshint:scripts'], function(){
    var target = gulp.src( client.index );
    var bundle = gulp.src( client.scripts.modules, {read: false} );
    return target
      .pipe(g.inject(bundle, {
          addRootSlash: false,
          relative: true,
          name: 'bundle',
        }))
      .pipe( gulp.dest( client.path ) )
  });

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
      .pipe(g.inject(bundle, {
          addRootSlash: false,
          relative: true,
          name: 'vendor',
        }))
      .pipe( gulp.dest( client.path ) );
  });

  /*
   *  Watch Index.html
   *  ================
   */
  gulp.task('index', function(){
    return gulp.src(config.client.index)
      .pipe(g.livereload());
  });


  /*
   * Server Build
   */
  gulp.task('server:build',['clean', 'jshint:scripts', 'server:templates', 'inject:bower'], function( cb ){
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
  });

  /*
   *  Run Server
   *  ==========
   */
  gulp.task('server:run', function () {
    return g.nodemon({ script: './servers/server/app.js'})
      // .on('change', ['lint'])
      .on('restart', function () {
        console.log('restarted!')
      });
  });

  /*
   *  Watch Files
   *  ============
   */
  gulp.task('watch', function(){

    gulp.watch( [client.scripts.root, client.scripts.modules], ['jshint:scripts']);
    gulp.watch( client.templates.jade, ['templates:jade']);
    gulp.watch( client.templates.html, ['templates:html']);
    gulp.watch( client.bower, ['inject:bower'] );
    gulp.watch( client.index, ['index']);

    var BuiltFiles = [
      config.build.scripts + '*.js',
      config.build.templates + '*.js',
      config.build.styles + '*.css',
    ]
    gulp.watch(BuiltFiles, notifyLiveReload)
  });

  /*
   * Compile Both jade anf html templates
   */
  gulp.task('server:templates', function (done){
    g.runSequence(['templates:jade', 'templates:html'], done)
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



function notifyLiveReload(event){
  console.log('File ' + event.path + ' was ' + event.type + ', reloading...');
  gulp.src(event.path, { read:false })
    .pipe(g.livereload());
}

function injector(options){
  return options.target
    .pipe( g.inject(options.styles.src, options.styles.params) )
    .pipe( g.inject(options.vendor.src, options.vendor.params) )
    .pipe( g.inject(options.root.src, options.root.params) )
    .pipe( g.inject(options.bundle.src, options.bundle.params) )
    .pipe( g.inject(options.templates.src, options.templates.params) )
    .pipe( gulp.dest( options.dest ) );

}