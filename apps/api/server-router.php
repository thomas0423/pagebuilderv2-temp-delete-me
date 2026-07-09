<?php

/**
 * Local PHP built-in server router (used by scripts/dev-api.sh).
 *
 * Same behavior as Laravel's vendor/.../resources/server.php, but does not
 * emit Notices when the client disconnects mid-request (errno 32 Broken pipe).
 * That happens often during long AI generate calls when the proxy/browser aborts.
 */

$publicPath = getcwd();

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// Emulate Apache mod_rewrite: serve existing public files as-is.
if ($uri !== '/' && file_exists($publicPath.$uri)) {
    return false;
}

$formattedDateTime = date('D M j H:i:s Y');
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
$remoteAddress = ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0').':'.($_SERVER['REMOTE_PORT'] ?? '0');
$logLine = "[$formattedDateTime] $remoteAddress [$requestMethod] URI: $uri\n";

// php://stdout write fails with EPIPE when the client already hung up.
$prev = set_error_handler(static fn () => true, E_WARNING | E_NOTICE | E_USER_WARNING | E_USER_NOTICE);
try {
    @file_put_contents('php://stdout', $logLine);
} finally {
    if ($prev === null) {
        restore_error_handler();
    } else {
        set_error_handler($prev);
    }
}

require_once $publicPath.'/index.php';
