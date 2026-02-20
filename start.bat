@echo off
echo Starting Kodbank Servers...
start "Kodbank Server" cmd /k "cd server && npm start"
start "Kodbank Client" cmd /k "cd client && npm run dev"
echo Servers started in separate windows.
