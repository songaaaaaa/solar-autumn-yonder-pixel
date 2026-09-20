# Nightwire autorun
# Starts Ollama, AnythingLLM (if installed), and the Hideout server on :8080.
# Grok Relay is part of the website — no extra process. Put the xAI key in Settings.

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Start-IfFree([int]$Port) {
  $listening = netstat -ano | Select-String ":$Port\s+.*LISTENING"
  return -not $listening
}

Write-Host "== Nightwire autorun ==" -ForegroundColor Cyan

# --- Ollama ---
Write-Host "Starting Ollama..."
$ollama = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollama) {
  if (Start-IfFree 11434) {
    Start-Process -FilePath $ollama.Source -ArgumentList "serve" -WindowStyle Minimized
    Start-Sleep -Seconds 2
  } else {
    Write-Host "Ollama already on port 11434"
  }
} else {
  $ollamaApp = Join-Path $env:LOCALAPPDATA "Programs\Ollama\ollama app.exe"
  if (Test-Path $ollamaApp) {
    Start-Process $ollamaApp
  } else {
    Write-Host "Ollama not found on PATH. Start it from the tray if you have it." -ForegroundColor Yellow
  }
}

# --- AnythingLLM desktop ---
Write-Host "Starting AnythingLLM..."
$allmCandidates = @(
  (Join-Path $env:LOCALAPPDATA "Programs\AnythingLLM\AnythingLLM.exe"),
  (Join-Path $env:LOCALAPPDATA "AnythingLLM\AnythingLLM.exe"),
  (Join-Path ${env:ProgramFiles} "AnythingLLM\AnythingLLM.exe"),
  (Join-Path ${env:ProgramFiles(x86)} "AnythingLLM\AnythingLLM.exe")
)
$allm = $allmCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($allm) {
  $running = Get-Process | Where-Object { $_.ProcessName -match "AnythingLLM|anything-llm" }
  if (-not $running) {
    Start-Process $allm
  } else {
    Write-Host "AnythingLLM already running"
  }
} else {
  Write-Host "AnythingLLM.exe not found. Open the desktop app yourself." -ForegroundColor Yellow
}

# --- Hideout / Grok Relay (same server) ---
Write-Host "Starting Hideout on http://localhost:8080 ..."
$env:VITE_AUTH_ENABLED = "false"
if (-not (Start-IfFree 8080)) {
  Write-Host "Port 8080 is busy. Close the other Vite window or taskkill its PID." -ForegroundColor Yellow
} else {
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$Root'; `$env:VITE_AUTH_ENABLED='false'; npx vite dev --host 0.0.0.0 --port 8080"
  )
}

Start-Sleep -Seconds 3
Start-Process "http://localhost:8080"

Write-Host "Done. In Settings: Ollama URL 127.0.0.1:11434, AnythingLLM key + my-workspace, Grok key + model."
Write-Host "Grok is Relay inside the UI — not a separate program."
