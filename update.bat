@echo off
echo Pulling latest changes...
git pull origin main --rebase

echo Adding files...
git add .

echo Committing changes...
git commit -m "Update: %date% %time%" || echo No changes to commit

echo Pushing to GitHub...
git push

echo Done!
pause