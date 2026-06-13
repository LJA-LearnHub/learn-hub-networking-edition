@echo off
setlocal
cd /d "%~dp0\.."
echo Normalizing Markdown...
node scripts\normalize-techplus-markdown.mjs
echo Building learn-hub-techplus-md.js...
node scripts\build-techplus-from-markdown.mjs
echo Done.
