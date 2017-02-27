#!/bin/sh

YUI="./yuicompressor-2.4.8.jar"
SRC="..\src"
RES="..\res"
OUT="..\output"

echo "Deleting old content of output..."
rm -rf $OUT
mkdir $OUT

echo "Combining JS files..."
cat \
$SRC/canvas-ui/button.js \
$SRC/canvas-ui/component.js \
$SRC/canvas-ui/label.js \
$SRC/canvas-ui/polyfill.js \
$SRC/canvas-ui/panel.js \
$SRC/canvas-ui/ui_manager.js \
$SRC/app.js \
$SRC/chessboard.js \
$SRC/common.js \
$SRC/config.js \
$SRC/menu.js \
$SRC/robot.js \
$SRC/robot_v2.js \
$SRC/rule.js \
> $OUT/temp.app.js

echo "Compressing JS files..."
java -jar "$YUI" \
--type js \
-o $OUT/app.min.js \
$OUT/temp.app.js

echo "Combining CSS files..."
cat \
$SRC/web.css \
> $OUT/temp.app.css

echo "Compressing CSS files..."
java -jar "$YUI" \
--type css \
-o $OUT/app.min.css \
$OUT/temp.app.css

echo "Deleting temporary files..."
rm -f $OUT/temp.app.js
rm -f $OUT/temp.app.css

echo "Preparing the index file..."
cp $SRC/index_release.html $OUT/index.html

echo "Copying resource files..."

if [ -f $RES/favicon.ico ]; then
  cp $RES/favicon.ico $OUT/favicon.ico
else
  echo 'No favicon file found'
fi

if [ ! -f  $RES/apple-touch-icon.png ]; then
  echo 'No apple-touch-icon file found'
else
  cp $RES/apple-touch-icon.png $OUT/apple-touch-icon.png
fi

echo "Done!"
# find . -iname "*.js" -exec cat "{}" \; > singlefile.js