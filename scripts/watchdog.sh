#!/bin/bash
# RUBTA self-healing watchdog: checks both app ports every 20s and restarts any that are down.
# Detached + nohup: survives terminal/session reaping.
C=/workspace/project/rutba
LOG=/tmp/rubta_watchdog.log

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >> "$LOG"; }

port_up() {
  (exec 3<>/dev/tcp/127.0.0.1/"$1") >/dev/null 2>&1 && { exec 3>&- 3<&-; return 0; }
  exec 3>&- 3<&- 2>/dev/null
  return 1
}

start_port() {
  local port="$1"
  if port_up "$port"; then
    log "port $port already up"
  else
    log "port $port down -> restarting"
    if [ "$port" = "12000" ]; then
      (cd "$C" && PORT=12000 setsid nohup npm run dev >> /tmp/server_dev.log 2>&1 < /dev/null &)
    else
      (cd "$C" && PORT=12001 setsid nohup npm run dev >> /tmp/server_dev_12001.log 2>&1 < /dev/null &)
    fi
  fi
}

log "watchdog started (pid $$)"
while true; do
  start_port 12000
  start_port 12001
  sleep 20
done