# Nightwire autopull
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "== Nightwire git pull ==" -ForegroundColor Cyan
Write-Host "Folder: $Root"

git status -sb
Write-Host ""
git pull

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Pull finished. Restart the server if it is already running:" -ForegroundColor Green
  Write-Host "  1. Ctrl+C in the Vite window"
  Write-Host "  2. Double-click start-nightwire.bat"
} else {
  Write-Host "Pull failed. If it mentions local changes, run:" -ForegroundColor Yellow
  Write-Host "  git stash"
  Write-Host "  git pull"
  Write-Host "  git stash pop"
}

Write-Host ""
Pause
