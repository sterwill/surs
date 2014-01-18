#!/bin/sh
set -e
convert icon.png -colors 256 -resize 48x48 icon-48.png
convert icon.png -colors 256 -resize 32x32 icon-32.png
convert icon.png -colors 256 -resize 24x24 icon-24.png
convert icon.png -colors 256 -resize 16x16 icon-16.png
icotool -c -o icon.ico icon-48.png icon-24.png icon-32.png icon-16.png
#rm icon-48.png icon-32.png icon-24.png icon-16.png 
