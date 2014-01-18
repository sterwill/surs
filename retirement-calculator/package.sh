#!/bin/sh

set -e 
BASE=`dirname $0`
TMP=`mktemp -d`
FILES="$TMP/files"
OUTPUT="$BASE/squeezy.exe"

rm -f "$OUTPUT"
mkdir -p "$FILES"
cp -r \
  "$BASE"/css \
  "$BASE"/external \
  "$BASE"/images \
  "$BASE"/js \
  "$BASE"/questions.html \
  "$BASE"/results.html \
  "$FILES"

7z a "$TMP"/squeezy.7z "$FILES"/*

# 7zsd.sfx is the Windows SFX stub
cat "$BASE"/dist/7zsd-squeezy.sfx "$BASE"/dist/config.txt "$TMP"/squeezy.7z > "$OUTPUT"

rm -r "$TMP"
