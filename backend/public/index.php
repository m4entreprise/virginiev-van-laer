<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;

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

    if (!sendContactEmail($name, $email, $message)) {
        http_response_code(500);
        echo json_encode(['error' => 'mail_failed']);
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

function sendContactEmail(string $name, string $email, string $message): bool
{
    // Build email body
    $bodyLines = [
        'Nom: ' . $name,
        'Email: ' . $email,
        '',
        'Message:',
        $message,
        '',
        '---',
        'Adresse IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'inconnue'),
        'Date: ' . date('Y-m-d H:i:s'),
    ];

    $body = implode("\n", $bodyLines);

    // SMTP configuration via environment variables
    $host = getenv('MAIL_HOST') ?: ($_ENV['MAIL_HOST'] ?? 'mail.m4entreprise.be');
    $port = (int) (getenv('MAIL_PORT') ?: ($_ENV['MAIL_PORT'] ?? 465));
    $username = getenv('MAIL_USERNAME') ?: ($_ENV['MAIL_USERNAME'] ?? '');
    $password = getenv('MAIL_PASSWORD') ?: ($_ENV['MAIL_PASSWORD'] ?? '');
    $fromAddress = getenv('MAIL_FROM_ADDRESS') ?: ($_ENV['MAIL_FROM_ADDRESS'] ?? $username ?: 'no-reply@virginie-van-laer.on-forge.com');
    $fromName = getenv('MAIL_FROM_NAME') ?: ($_ENV['MAIL_FROM_NAME'] ?? 'Site web Virginie Van Laer');
    $encryption = strtolower((string) (getenv('MAIL_ENCRYPTION') ?: ($_ENV['MAIL_ENCRYPTION'] ?? 'ssl')));

    try {
        // Load Composer autoloader if available
        $autoload = __DIR__ . '/../vendor/autoload.php';
        if (is_file($autoload)) {
            require_once $autoload;
        }

        $mailer = new PHPMailer(true);
        $mailer->isSMTP();
        $mailer->Host = $host;
        $mailer->Port = $port;
        $mailer->SMTPAuth = true;
        $mailer->Username = $username;
        $mailer->Password = $password;

        if ($encryption === 'ssl') {
            $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($encryption === 'tls') {
            $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }

        $mailer->CharSet = 'UTF-8';

        $mailer->setFrom($fromAddress, $fromName);
        if ($email !== '') {
            $mailer->addReplyTo($email, $name !== '' ? $name : $email);
        }
        $mailer->addAddress('v.vanlaer@hotmail.com');

        $mailer->Subject = 'Nouveau message depuis le site web';
        $mailer->Body = $body;

        $mailer->send();
        return true;
    } catch (PHPMailerException $exception) {
        error_log('Contact form mail error: ' . $exception->getMessage());
        return false;
    }
}
