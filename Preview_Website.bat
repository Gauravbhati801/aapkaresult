@echo off
title AapkaResult Local Preview Server
echo Starting Local Preview Server...
start "" http://localhost:5500
node serve.js
pause
