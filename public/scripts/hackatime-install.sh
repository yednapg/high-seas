#!/bin/bash

# Exit on any error
set -e

# Enable verbose logging if VERBOSE is set to true
VERBOSE=false

log() {
    if [ "$VERBOSE" = true ]; then
        echo "$1"
    fi
}

error() {
    echo "Error: $1" >&2
}

log "Starting Hakatime setup..."

# Step 1: Check if BEARER_TOKEN is set
if [ -z "$BEARER_TOKEN" ]; then
    error "BEARER_TOKEN environment variable is not set. Please set it before running this script."
    exit 1
fi

# Create or update the WakaTime config file
WAKATIME_CONFIG_FILE="$HOME/.wakatime.cfg"
log "Configuring WakaTime settings..."
{
    echo "[settings]"
    echo "api_url = https://waka.hackclub.com/api"
    echo "api_key = $BEARER_TOKEN"
} >"$WAKATIME_CONFIG_FILE"
echo "✓ Wrote config to $WAKATIME_CONFIG_FILE"
echo

# Step 2: Check if VS Code is installed
log "Checking for VS Code installation..."
if ! command -v code &>/dev/null; then
    error "VS Code is not installed. Install it at https://code.visualstudio.com/Download"
    if [ "$VERBOSE" = true ]; then
        case "$OSTYPE" in
        darwin*)
            error "(In VS Code, press ⌘⇧P and type \"Shell Command: Install 'code' command in PATH\".)"
            ;;
        msys* | win32*)
            error "(In VS Code, press Ctrl+Shift+P and type \"Shell Command: Install 'code' command in PATH\".)"
            ;;
        *)
            error "(In VS Code, press Ctrl+Shift+P and type \"Shell Command: Install 'code' command in PATH\".)"
            ;;
        esac
    fi
    exit 1
fi

# Install the WakaTime extension in VS Code
log "Installing the WakaTime extension in VS Code..."
if ! code --install-extension WakaTime.vscode-wakatime; then
    error "Failed to install WakaTime extension. Ensure you have network access and VS Code is in PATH."
    exit 1
fi
echo "✓ VS Code extension installed successfully"
echo

# Step 3: Send test heartbeats
log "Sending test heartbeats to verify setup..."
for i in {1..2}; do
    log "Sending heartbeat $i/2..."
    CURRENT_TIME=$(date +%s)

    # Prepare heartbeat data
    if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32"* ]]; then
        HEARTBEAT_DATA="{\"branch\":\"master\",\"category\":\"coding\",\"cursorpos\":1,\"entity\":\"welcome.txt\",\"type\":\"file\",\"lineno\":1,\"lines\":1,\"project\":\"welcome\",\"time\":$CURRENT_TIME,\"user_agent\":\"wakatime/v1.102.1 (windows)\"}"
    else
        HEARTBEAT_DATA="{\"branch\":\"master\",\"category\":\"coding\",\"cursorpos\":1,\"entity\":\"welcome.txt\",\"type\":\"file\",\"lineno\":1,\"lines\":1,\"project\":\"welcome\",\"time\":$CURRENT_TIME,\"user_agent\":\"wakatime/v1.102.1 (unix)\"}"
    fi

    if [ "$VERBOSE" = true ]; then
        response=$(curl -s -w "%{http_code}" -X POST "https://waka.hackclub.com/api/heartbeat" \
            -H "Authorization: Bearer $BEARER_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$HEARTBEAT_DATA")
        http_code="${response: -3}"
        response_body="${response%???}"
    else
        http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://waka.hackclub.com/api/heartbeat" \
            -H "Authorization: Bearer $BEARER_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$HEARTBEAT_DATA")
    fi

    if [ "$http_code" -eq 201 ]; then
        log "✓ Heartbeat $i sent successfully"
    else
        error_msg="Heartbeat $i failed with HTTP status $http_code."
        [ "$VERBOSE" = true ] && error_msg+=" Response: $response_body"
        error "$error_msg"
        exit 1
    fi

    [ $i -lt 2 ] && sleep 1
done

echo
echo "✨ Hakatime setup completed successfully!"
echo "You can now return to the setup page for further instructions."
