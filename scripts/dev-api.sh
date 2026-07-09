#!/usr/bin/env bash
# Keep Laravel API alive during local AI calls.
# Uses a custom router so Broken pipe Notices from Laravel's stock server.php
# never pollute JSON or published HTML pages.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="${ROOT}/apps/api"
PUBLIC_DIR="${API_DIR}/public"
ROUTER="${API_DIR}/server-router.php"

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

# True only when the listener is our custom router (not artisan serve / stock server.php).
using_custom_router() {
  local pids
  pids="$(lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t 2>/dev/null || true)"
  [ -z "${pids}" ] && return 1
  local pid
  for pid in ${pids}; do
    if ps -p "${pid}" -o args= 2>/dev/null | grep -q "server-router.php"; then
      return 0
    fi
    # Parent may be the shell; check children too
    if pgrep -P "${pid}" -lf 2>/dev/null | grep -q "server-router.php"; then
      return 0
    fi
  done
  return 1
}

free_port() {
  local pids
  pids="$(lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t 2>/dev/null || true)"
  if [ -n "${pids}" ]; then
    echo "[dev-api] freeing ${HOST}:${PORT} (PIDs: ${pids})"
    kill ${pids} 2>/dev/null || true
    sleep 1
    kill -9 ${pids} 2>/dev/null || true
    # Also clear leftover artisan serve children
    pkill -9 -f "artisan serve --host=${HOST} --port=${PORT}" 2>/dev/null || true
    pkill -9 -f "php -S ${HOST}:${PORT}" 2>/dev/null || true
    sleep 0.5
  fi
}

if [ ! -f "${ROUTER}" ]; then
  echo "[dev-api] missing router: ${ROUTER}" >&2
  exit 1
fi

while true; do
  if port_in_use; then
    if using_custom_router && api_healthy; then
      echo "[dev-api] ${HOST}:${PORT} healthy with custom router — waiting"
      while port_in_use && using_custom_router && api_healthy; do
        sleep 5
      done
      echo "[dev-api] custom router went away — restarting"
    else
      echo "[dev-api] ${HOST}:${PORT} is not our custom router (or unhealthy) — replacing"
      free_port
    fi
  fi

  echo "[dev-api] starting PHP built-in server on ${HOST}:${PORT} (custom router)"
  cd "${PUBLIC_DIR}"
  # display_errors=0: never inject PHP Notices into HTML/JSON (Broken pipe, etc.)
  php -d display_errors=0 -d display_startup_errors=0 \
    -d log_errors=1 \
    -d max_execution_time=0 \
    -d default_socket_timeout=180 \
    -S "${HOST}:${PORT}" "${ROUTER}"
  CODE=$?
  echo "[dev-api] PHP server exited with code ${CODE}; restarting in 1s…"
  sleep 1
done
