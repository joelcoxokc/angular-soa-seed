var config = {
  app_file_name: 'app.js',
  modules_file_name: 'bundle.js',
  vendor_file_name: 'vendor.js',
  css_file_name: 'app.css',
  jade_file_name: 'cached_jade_templates.js',
  html_file_name: 'cached_html_templates.js',
  module_name: 'baseApp',
  client: {
    path: './client/',
    scripts: {
      root: './client/app/app.js',
      modules: ['./client/{app,components}/**/*.js', '!./client/app/app.js', '!./client/{app,components}/**/*.spec.js'],
    },
    styles: {
      css:'./client/styles/**/*.css',
    },
    index: './client/index.html',
    templates:{
     jade: './client/{app,components}/**/*.jade',
     html: ['./client/{app,components}/**/*.html']
    },
    bower: './client/bower_components/',
    vendor: './client/vendor/**/*.js',
    images: './client/assets/images/**/*'
  },
  build: {
    path: './.tmp/',
    stylePath: './.tmp/styles/',
    styles: './.tmp/styles/*.css',
    scriptPath: './.tmp/scripts/',
    scripts: './.tmp/scripts/*.js',
    templatesPath: './.tmp/templates/',
    templates: './.tmp/templates/*.js',
    dist: './dist/public',
    images: './.tmp/images/**/*',
    fonts: './.tmp/fonts'
  },
  dist: {
    images: './dist/images/',
    scripts: './dist/scritps/',
    styles: './dist/styles/',
    index: './dist/'
  },
  server: {
    path: './servers/',
    base: './servers/server/app.js',
    all: ['./servers/**/app.js', '!./servers/server/app.js']
  }
}
module.exports = config;