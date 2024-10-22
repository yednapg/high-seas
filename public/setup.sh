#!/bin/bash

# Step 1: Add settings to the WakaTime config file
echo -e "[settings]\napi_url = https://waka.hackclub.com/api\napi_key = $BEARER_TOKEN" >> ~/.wakatime.cfg

echo "Wrote the config to ~/.wakatime.cfg";

echo ""; echo "Installing the time tracking extension in VS Code"

echo ""; echo "---------";

# Step 2: Check if VS Code is installed
if ! command -v code &> /dev/null; then
  echo "VS Code is not installed. Please install VS Code and try again."
  exit 1
fi

# Install the WakaTime extension in VS Code
code --install-extension WakaTime.vscode-wakatime

echo "---------";
echo ""; echo "The VS Code extension is installed!"

echo ""; echo "---"

echo ""; echo "Sending two hearbeats to our servers to make sure everything works!"
# Step 3: Run the curl command twice with a conditional sleep
echo ""; echo "---------";
for i in {1..2}; do
  response=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://waka.hackclub.com/api/heartbeat \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "branch": "master",
    "category": "coding",
    "cursorpos": 1,
    "entity": "welcome.txt",
    "type": "file",
    "lineno": 1,
    "lines": 1,
    "project": "welcome",
    "time": '$(date +%s.%N)',
    "user_agent": "wakatime/v1.102.1 (linux-6.6.56-unknown) go1.22.5 vscode/1.94.2 vscode-wakatime/24.6.2"
  }')

  # Check if the heartbeat was sent successfully
  if [ "$response" -eq 201 ]; then
    echo "Heartbeat sent successfully."
  else
    echo "Error sending heartbeat: HTTP status $response"
  fi

  # Sleep for 1 second only if this is not the last iteration
  if [ $i -lt 2 ]; then
    sleep 1
  fi
done

echo "---------"; echo "";
echo "You successfully setup Hackatime! Go back to the setup page and it should give you further instructions!"