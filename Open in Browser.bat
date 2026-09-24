@echo off
title Tabeeb Pedia Website
echo ===================================================
echo     Tabeeb Pedia Server chal raha hai...
echo     Browser thori dair mein khud ba khud khul jaye ga.
echo     (Is window ko band na karen jab tak website use karni ho)
echo ===================================================
cd /d "%~dp0"
call npm run dev
pause
