# Step 1: Add settings to the WakaTime config file
$bearerToken = $env:BEARER_TOKEN
$configPath = "$HOME\.wakatime.cfg"
@"
[settings]
api_url = https://waka.hackclub.com/api
api_key = $bearerToken
"@ | Set-Content -Path $configPath

# Step 2: Check if VS Code is installed
if (-not (Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Host "VS Code is not installed. Please install VS Code and try again."
    exit 1
}

# Install the WakaTime extension in VS Code
& code --install-extension WakaTime.vscode-wakatime

# Step 3: Run the curl command twice with a conditional sleep
for ($i = 1; $i -le 2; $i++) {
    $time = (Get-Date -UFormat %s0000)
    $jsonData = @{
        branch = "master"
        category = "coding"
        cursorpos = 1
        entity = "welcome.txt"
        type = "file"
        lineno = 1
        lines = 1
        project = "welcome"
        time = $time
        user_agent = "wakatime/v1.102.1 (windows) go1.22.5 vscode/1.94.2 vscode-wakatime/24.6.2"
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri "https://waka.hackclub.com/api/heartbeat" `
                          -Method Post `
                          -Headers @{
                              Authorization = "Bearer $bearerToken"
                              "Content-Type" = "application/json"
                          } `
                          -Body $jsonData
        # Success message for each heartbeat
        Write-Host "Heartbeat sent successfully."
    } catch {
        Write-Host "Error sending heartbeat: $_"
    }

    # Sleep for 1 second only if this is not the last iteration
    if ($i -lt 2) {
        Start-Sleep -Seconds 1
    }
}

Write-Host "---------"; Write-Host "";

Write-Host "You successfully setup Hackatime! Go back to the setup page and it should give you further instructions!"