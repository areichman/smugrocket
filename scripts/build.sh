#!/bin/bash

# Move to the project root directory
#
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR/..

# Concatentate all of the js files into a single file
#
for file in vendor/zepto.js vendor/underscore.js vendor/backbone.js vendor/handlebars.js app/app.js app/views/*.js
do
  cat $file >> tmp.app.js
done

# Compile the handlebars templates
#

# Uglify app.js unless we are running in development mode
#
if [ "$1" != "development" ]
then
  uglifyjs -o tmp.app.min.js tmp.app.js
  mv tmp.app.min.js tmp.app.js 
fi

# Compile the less templates
#

# Move app.js and app.css into the dist folder
#
mv tmp.app.js dist/scripts/app.js

