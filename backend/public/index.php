<?php

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if ($uri === '/api/contact') {
    handleContact();
    exit;
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found']);

function handleContact(): void
{
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        return;
    }

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody ?? '', true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body']);
        return;
    }

    $name = trim((string)($data['name'] ?? ''));
    $email = trim((string)($data['email'] ?? ''));
    $message = trim((string)($data['message'] ?? ''));
    $token = $data['recaptchaToken'] ?? $data['recaptcha_token'] ?? null;

    $errors = [];

    if ($name === '') {
        $errors['name'] = 'required';
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'invalid';
    }

    if ($message === '') {
        $errors['message'] = 'required';
    }

    if ($token === null || $token === '') {
        $errors['recaptcha'] = 'missing_token';
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['errors' => $errors]);
        return;
    }

    $recaptchaError = null;

    if (!verifyRecaptcha((string)$token, $recaptchaError)) {
        http_response_code(400);
        echo json_encode([
            'error' => 'captcha_failed',
            'code' => $recaptchaError,
        ]);
        return;
    }

    echo json_encode(['success' => true]);
}

function verifyRecaptcha(string $token, ?string &$error = null): bool
{
    $secret = getenv('RECAPTCHA_SECRET') ?: ($_ENV['RECAPTCHA_SECRET'] ?? null);

    if ($secret === null || $secret === '') {
        $error = 'missing_secret';
        return false;
    }

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-type: application/x-www-form-urlencoded\r\n" .
                        'Content-Length: ' . strlen($payload) . "\r\n",
            'content' => $payload,
            'timeout' => 5,
        ],
    ]);

    $result = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);

    if ($result === false) {
        $error = 'recaptcha_unreachable';
        return false;
    }

    $decoded = json_decode($result, true);

    if (!is_array($decoded)) {
        $error = 'invalid_response';
        return false;
    }

    if (empty($decoded['success'])) {
        $error = 'recaptcha_failed';
        return false;
    }

    if (isset($decoded['score']) && $decoded['score'] < 0.5) {
        $error = 'low_score';
        return false;
    }

    return true;
}
