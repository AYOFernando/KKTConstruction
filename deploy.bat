@echo off
echo Deploying KKT Constructions to GitHub...
git add .
git commit -m "Update: Services section and hosting preparation"
git push -u origin main
echo Deployment complete!
pause
