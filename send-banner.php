<?php
/**
 * Banner Email Sender
 * Receives banner data via POST and sends it to the user's email
 * 
 * Required: PHPMailer (install via composer: composer require phpmailer/phpmailer)
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer - adjust path based on your setup
require 'vendor/autoload.php'; // If using Composer
// OR: require 'path/to/PHPMailer/src/PHPMailer.php'; etc.

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust for production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'error' => 'Invalid JSON data']));
}

// Extract and validate fields
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$imageBase64 = $data['image'] ?? '';
$timestamp = $data['timestamp'] ?? date('c');

// Validate required fields
if (empty($name) || strlen($name) < 2) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'error' => 'Name is required (min 2 characters)']));
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'error' => 'Valid email is required']));
}

if (empty($imageBase64)) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'error' => 'Image data is required']));
}

// Convert base64 to binary image data
// Remove data URL prefix if present (e.g., "data:image/png;base64,")
$imageData = preg_replace('#^data:image/\w+;base64,#i', '', $imageBase64);
$imageData = base64_decode($imageData);

if ($imageData === false) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'error' => 'Invalid image data']));
}

// Save image temporarily
$tempFile = tempnam(sys_get_temp_dir(), 'banner_') . '.png';
file_put_contents($tempFile, $imageData);

try {
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // ===== CONFIGURE THESE SETTINGS =====
    
    // SMTP Configuration (recommended for production)
    // Uncomment and configure for SMTP:
    /*
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'your-email@example.com';
    $mail->Password = 'your-password';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // or ENCRYPTION_SMTPS
    $mail->Port = 587; // or 465 for SSL
    */
    
    // Sender settings
    $mail->setFrom('noreply@yourcompany.com', 'Christmas Banner Builder');
    $mail->addReplyTo('support@yourcompany.com', 'Support');
    
    // ===== END CONFIGURATION =====
    
    // Recipient
    $mail->addAddress($email, $name);
    
    // Email content
    $mail->isHTML(true);
    $mail->Subject = '🎄 Your Christmas Banner is Ready!';
    
    // HTML body
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background: #1a1a2e; color: #ffffff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #16213e; padding: 30px; border-radius: 10px; }
            h1 { color: #ff6b6b; text-align: center; }
            p { line-height: 1.6; }
            .banner-note { background: #0f3460; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>🎄 Merry Christmas, {$name}! 🎄</h1>
            <p>Your personalized Christmas banner is attached to this email!</p>
            <div class='banner-note'>
                <strong>📎 Attachment:</strong> banner.png<br>
                <small>Created on: {$timestamp}</small>
            </div>
            <p>We hope you enjoy sharing your festive creation with friends, family, and colleagues!</p>
            <div class='footer'>
                <p>Made with ❤️ by Christmas Banner Builder</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Plain text alternative
    $mail->AltBody = "Merry Christmas, {$name}!\n\nYour personalized Christmas banner is attached to this email.\n\nCreated on: {$timestamp}\n\nEnjoy sharing your festive creation!";
    
    // Attach the banner image
    $mail->addAttachment($tempFile, 'banner.png', 'base64', 'image/png');
    
    // Send email
    $mail->send();
    
    // Clean up temp file
    unlink($tempFile);
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Banner sent successfully to ' . $email
    ]);
    
} catch (Exception $e) {
    // Clean up temp file on error
    if (file_exists($tempFile)) {
        unlink($tempFile);
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email: ' . $mail->ErrorInfo
    ]);
}
