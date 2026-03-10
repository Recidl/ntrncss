<?php

/**
 * Centralized request hardening utilities for public endpoints.
 */

function security_set_response_headers(): void
{
    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
}

function security_json_fail(int $statusCode, string $message): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
    ]);
    exit;
}

function security_get_client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return preg_replace('/[^0-9a-fA-F:.]/', '', (string) $ip) ?: '0.0.0.0';
}

function security_is_allowed_origin(array $allowedHosts): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        $host = parse_url($origin, PHP_URL_HOST);
        if ($host && in_array(strtolower((string) $host), $allowedHosts, true)) {
            return true;
        }
    }

    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if ($referer !== '') {
        $host = parse_url($referer, PHP_URL_HOST);
        if ($host && in_array(strtolower((string) $host), $allowedHosts, true)) {
            return true;
        }
    }

    // Some clients omit both origin and referer. Keep this permissive fallback to avoid false blocks.
    return $origin === '' && $referer === '';
}

function security_rate_limit(string $key, int $maxRequests, int $windowSeconds): bool
{
    $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'nontronics-rate-limit';
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return true;
    }

    $safeKey = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $key);
    $file = $dir . DIRECTORY_SEPARATOR . $safeKey . '.json';
    $now = time();

    $fp = fopen($file, 'c+');
    if (!$fp) {
        return true;
    }

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return true;
    }

    $raw = stream_get_contents($fp);
    $records = json_decode($raw ?: '[]', true);
    if (!is_array($records)) {
        $records = [];
    }

    $recent = [];
    foreach ($records as $ts) {
        $ts = (int) $ts;
        if ($ts >= ($now - $windowSeconds)) {
            $recent[] = $ts;
        }
    }

    $allowed = count($recent) < $maxRequests;
    if ($allowed) {
        $recent[] = $now;
    }

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($recent));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return $allowed;
}

function security_clean_text($value, int $maxLength = 1000): string
{
    $value = is_scalar($value) ? (string) $value : '';
    $value = trim($value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value);
    $value = preg_replace('/\s{2,}/u', ' ', $value);

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function security_contains_suspicious_payload(string $value): bool
{
    $patterns = [
        '/<\s*script\b/i',
        '/javascript\s*:/i',
        '/on\w+\s*=\s*/i',
        '/union\s+select/i',
        '/drop\s+table/i',
        '/insert\s+into/i',
        '/(\.|%2e){2}[\\\/]/i',
        '/<\?php/i',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $value)) {
            return true;
        }
    }

    return false;
}

function security_validate_email(string $email): bool
{
    if (strlen($email) > 254) {
        return false;
    }

    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function security_sanitize_filename(string $fileName): string
{
    $clean = preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName);
    $clean = preg_replace('/_+/', '_', (string) $clean);
    return trim((string) $clean, '._-');
}

/**
 * Load key/value pairs from the project root .env file for local development.
 * In production, prefer real server environment variables.
 */
function security_load_dotenv(): array
{
    static $cache = null;
    if (is_array($cache)) {
        return $cache;
    }

    $cache = [];
    $envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
    if (!is_file($envPath) || !is_readable($envPath)) {
        return $cache;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return $cache;
    }

    foreach ($lines as $line) {
        $line = trim((string) $line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }

        if (strpos($line, '=') === false) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        if ($key === '') {
            continue;
        }

        if (strlen($value) >= 2) {
            $first = $value[0];
            $last = $value[strlen($value) - 1];
            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                $value = substr($value, 1, -1);
            }
        }

        $cache[$key] = $value;
    }

    return $cache;
}

function security_env(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return (string) $value;
    }

    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return (string) $_ENV[$key];
    }

    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
        return (string) $_SERVER[$key];
    }

    $dotenv = security_load_dotenv();
    if (isset($dotenv[$key]) && $dotenv[$key] !== '') {
        return (string) $dotenv[$key];
    }

    return $default;
}

function security_env_int(string $key, int $default): int
{
    $value = security_env($key);
    if ($value === null || $value === '') {
        return $default;
    }

    return (int) $value;
}

function security_env_list(string $key, array $default = []): array
{
    $value = security_env($key);
    if ($value === null || trim($value) === '') {
        return $default;
    }

    $parts = array_map('trim', explode(',', $value));
    $parts = array_filter($parts, static function (string $item): bool {
        return $item !== '';
    });

    return array_values($parts);
}
