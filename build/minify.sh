#!/bin/sh

YUI="./yuicompressor-2.4.8.jar"
SRC="../src"
RES="../res"
OUT="../output"

echo "Deleting old content of output..."
rm -rf $OUT
mkdir $OUT

echo "Combining JS files..."
cat \
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
$SRC/style.css \
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

cp $SRC/canvas-ui/canvas-ui-0.0.1.min.js $OUT/canvas-ui-0.0.1.min.js

echo "Done!"
# find . -iname "*.js" -exec cat "{}" \; > singlefile.js