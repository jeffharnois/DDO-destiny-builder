Backbone Boilerplate App
========================

This default/tutorial App is for any Rep.com developer to use to begin working with a new App and to get familiar with the framework.

The apps use [Backbone.js](http://documentcloud.github.com/backbone/) organized in the style of  [Backbone-boilerplate](https://github.com/tbranyen/backbone-boilerplate), and uses [Hogan.js](http://twitter.github.com/hogan.js/) to compile and render templates.  Backbone.js requires jQuery and [underscore.js](http://documentcloud.github.com/underscore/) as its dependencies.


## Installation ##

First, download this to your branch

``` bash
mkdir tutorial
cd tutorial
git init
git remote add origin git@github.com:jeffharnois/Rep.com-App.git
git pull origin master
rm -rf .git
```

This will do a fresh install of the file (without git history).

## Tutorial ##

Once you have installed the tutorial App, the first thing to do is build the App so that we can make sure it installed correctly.

``` bash
npm install
grunt --config src/tutorial/config.js -e development
```

This runs a build task that will minify/uglify (release folder only), lint, concat the templates, and output the namespace.js, app.js and templates as one App file within Apps/dist/tutorial.  Inside of Apps/dist/tutorial you will find two folders, debug and release.  

Debug is intended for development, and while the files are concatenated, they are not minified.

Load up your server and hit /index.html, and you should see a success message.