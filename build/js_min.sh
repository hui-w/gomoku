#!/bin/sh

YUI_PATH="./yuicompressor-2.4.7.jar"

echo "Deleting old content of compressed file..."
rm -f ./app.min.js

echo "Combining all JS files into one.."

cat \
../src/canvas-ui/button.js \
../src/canvas-ui/component.js \
../src/canvas-ui/label.js \
../src/canvas-ui/panel.js \
../src/canvas-ui/ui_manager.js \
../src/app.js \
../src/chessboard.js \
../src/common.js \
../src/config.js \
../src/robot.js \
../src/rule.js \
> ./temp.app.js


echo "Compressing JS files..."

java -jar "$YUI_PATH" \
--type js \
-o app.min.js \
temp.app.js

echo "JS compilation succeeded."

rm -f ./temp.app.js

# find . -iname "*.js" -exec cat "{}" \; > singlefile.js