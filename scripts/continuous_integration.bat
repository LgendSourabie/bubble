@echo off
echo Starting FTP upload...

ftp -n -i -s:deployment_commands.txt
echo FTP upload completed!
pause