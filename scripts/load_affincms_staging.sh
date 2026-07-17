#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/apps/api/.env"
SQL_FILE="$ROOT/storage/affincms_phase1.sql"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Missing $SQL_FILE" >&2
  exit 1
fi

while IFS='=' read -r key value; do
  value="${value%$'\r'}"
  case "$key" in
    DB_HOST|DB_PORT|DB_USERNAME|DB_PASSWORD)
      printf -v "$key" '%s' "$value"
      ;;
  esac
done < "$ENV_FILE"

export MYSQL_PWD="${DB_PASSWORD:-}"
host="${DB_HOST:-127.0.0.1}"
port="${DB_PORT:-3306}"
user="${DB_USERNAME:-root}"

echo "Creating PageBuilder and legacy staging databases..."
mysql -h"$host" -P"$port" -u"$user" -e \
  "CREATE DATABASE IF NOT EXISTS pagebuilderv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE DATABASE IF NOT EXISTS affincms_legacy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "Loading extracted AffinCMS tables..."
mysql -h"$host" -P"$port" -u"$user" affincms_legacy < "$SQL_FILE"

echo "Legacy staging counts:"
mysql -h"$host" -P"$port" -u"$user" -e \
  "SELECT COUNT(*) AS pages FROM affincms_legacy.pagebuilder__pages;
   SELECT COUNT(*) AS promotions FROM affincms_legacy.discover_promotions;
   SELECT COUNT(*) AS announcements FROM affincms_legacy.affin_always_announcement_lists;
   SELECT COUNT(*) AS news FROM affincms_legacy.internal_news;"
