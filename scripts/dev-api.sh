#!/usr/bin/env bash
# Keep Laravel API alive during local AI calls (artisan serve can exit on fatals).
set -u
cd "$(dirname "$0")/../apps/api"

PORT=8000
HOST=127.0.0.1

port_in_use() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1
    return $?
  fi
  return 1
}

api_healthy() {
  curl -fsS "http://${HOST}:${PORT}/up" >/dev/null 2>&1
}

while true; do
  if port_in_use; then
    if api_healthy; then
      echo "[dev-api] ${HOST}:${PORT} already healthy — waiting (no restart loop)"
      # Stay attached so concurrently keeps this process; poll until the listener dies
      while port_in_use && api_healthy; do
        sleep 5
      done
      echo "[dev-api] existing server went away — starting a new one"
    else
      echo "[dev-api] ${HOST}:${PORT} busy but unhealthy — freeing port"
      PIDS="$(lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t 2>/dev/null || true)"
      if [ -n "${PIDS}" ]; then
        kill ${PIDS} 2>/dev/null || true
        sleep 1
        kill -9 ${PIDS} 2>/dev/null || true
      fi
    fi
  fi

  echo "[dev-api] starting php artisan serve on ${HOST}:${PORT}"
  # display_errors=0 prevents PHP Notices from polluting JSON API responses
  php -d display_errors=0 -d display_startup_errors=0 \
    -d max_execution_time=180 -d default_socket_timeout=180 \
    artisan serve --host="${HOST}" --port="${PORT}"
  CODE=$?
  echo "[dev-api] artisan serve exited with code ${CODE}; restarting in 1s…"
  sleep 1
done
