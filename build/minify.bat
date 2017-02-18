@ECHO ON
REM Starting to minify JS & CSS files ...

@ECHO OFF
REM don't watch the sausage being made

REM the folder
SET TOOLS=%~DP0
SET SRC=%TOOLS%\..\src
SET RES=%TOOLS%\..\res
SET OUT=%TOOLS%\..\output

rd /S /Q %OUT%
md "%OUT%\"

REM Combine JS & CSS files into one file
type "%SRC%\canvas-ui\button.js" "%SRC%\canvas-ui\component.js" "%SRC%\canvas-ui\label.js" "%SRC%\canvas-ui\panel.js" "%SRC%\canvas-ui\ui_manager.js" "%SRC%\app.js" "%SRC%\chessboard.js" "%SRC%\common.js" "%SRC%\config.js" "%SRC%\home.js" "%SRC%\rule.js" "%SRC%\robot.js" "%SRC%\robot_v2.js" > "%OUT%\temp.app.js"
type "%SRC%\web.css" > "%OUT%\temp.app.css"

REM Compress with YUI Compressor  
java -jar "%TOOLS%\yuicompressor-2.4.7.jar" -o "%OUT%\app.min.js" "%OUT%\temp.app.js"
java -jar "%TOOLS%\yuicompressor-2.4.7.jar" -o "%OUT%\app.min.css" "%OUT%\temp.app.css"

REM Delete temporary files
del "%OUT%\temp.app.js"
del "%OUT%\temp.app.css"

REM Index Files
copy "%SRC%\index_release.html" "%OUT%\index.html"

REM Copy other files
copy "%RES%\favicon.ico" "%OUT%\favicon.ico"
copy "%RES%\apple-touch-icon.png" "%OUT%\apple-touch-icon.png"

@ECHO ON
