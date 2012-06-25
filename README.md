install [node.js](http://nodejs.org/#download) and npm

clone this repo

install all the node modules
    cd yourRepo
    npm install

run grunt to compile js
    grunt

compile the assets
    cd assets
    compass compile

run the server
    ./start
    
view at localhost:8080

Fresh Clone - Externals
=======================

  git submodule add https://github.com/jeffharnois/epic-Destiny-Obj.git externals

  git submodule update --init --recursive

update external
---------------

  git submodule foreach git pull