<#
.SYNOPSIS
    Launches the Lakenzie's Site dev environment: backend (FastAPI/uvicorn)
    and frontend (Vite) side by side.

.DESCRIPTION
    Preferred: Windows Terminal (wt.exe) with two split panes.
      - Left pane:  backend  — activate .venv, run uvicorn on port 8000
      - Right pane: frontend — npm run dev

    Fallback (no wt.exe): two separate PowerShell windows via Start-Process.

.NOTES
    Run from anywhere; paths are resolved relative to this script.
#>

$ErrorActionPreference = 'Stop'

$repoRoot    = $PSScriptRoot
$backendDir  = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'

if (-not (Test-Path $backendDir))  { Write-Warning "Missing $backendDir — has the backend been created yet?" }
if (-not (Test-Path $frontendDir)) { Write-Warning "Missing $frontendDir — has the frontend been created yet?" }

# Commands each pane/window runs. Keep them self-contained strings.
$backendCmd  = '.\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000'
$frontendCmd = 'npm run dev'

$wt = Get-Command wt.exe -ErrorAction SilentlyContinue

if ($wt) {
    Write-Host 'Launching Windows Terminal with split panes (backend | frontend)...'
    # One wt invocation: first pane = backend, split-pane = frontend.
    & wt.exe `
        new-tab --title 'backend' -d $backendDir powershell -NoExit -Command $backendCmd `; `
        split-pane --title 'frontend' -d $frontendDir powershell -NoExit -Command $frontendCmd
}
else {
    Write-Host 'wt.exe not found — falling back to two PowerShell windows.'
    Start-Process powershell -WorkingDirectory $backendDir `
        -ArgumentList '-NoExit', '-Command', $backendCmd
    Start-Process powershell -WorkingDirectory $frontendDir `
        -ArgumentList '-NoExit', '-Command', $frontendCmd
}

Write-Host ''
Write-Host 'Backend:  http://localhost:8000  (API docs at /docs)'
Write-Host 'Frontend: see the Vite pane for its local URL (usually http://localhost:5173)'
