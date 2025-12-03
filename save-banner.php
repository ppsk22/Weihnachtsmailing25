<?php
/**
 * Save Banner to Server
 * 
 * This script receives a base64-encoded GIF image and saves it to the server.
 * Place this file in the same directory as your banner builder.
 * 
 * IMPORTANT: Create a 'banners' folder with write permissions (chmod 755 or 775)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Configuration
$SAVE_DIR = 'banners/'; // Directory to save banners (relative to this script)
$MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size

// Create save directory if it doesn't exist
if (!file_exists($SAVE_DIR)) {
    if (!mkdir($SAVE_DIR, 0755, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create save directory']);
        exit();
    }
}

// Check if directory is writable
if (!is_writable($SAVE_DIR)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Save directory is not writable']);
    exit();
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit();
}

// Validate required fields
if (empty($data['image']) || empty($data['filename'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields (image, filename)']);
    exit();
}

// Validate filename (sanitize to prevent directory traversal)
$filename = basename($data['filename']);
if (!preg_match('/^banner_\d+_[a-z0-9]+\.gif$/i', $filename)) {
    // If filename doesn't match expected pattern, generate a new one
    $filename = 'banner_' . time() . '_' . bin2hex(random_bytes(3)) . '.gif';
}

// Validate and decode base64 image
$imageData = $data['image'];

// Check if it's a data URL and extract the base64 part
if (strpos($imageData, 'data:image/gif;base64,') === 0) {
    $imageData = substr($imageData, strlen('data:image/gif;base64,'));
}

// Decode base64
$decodedImage = base64_decode($imageData, true);
if ($decodedImage === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid base64 image data']);
    exit();
}

// Check file size
if (strlen($decodedImage) > $MAX_FILE_SIZE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'File too large (max 10MB)']);
    exit();
}

// Verify it's actually a GIF (check magic bytes)
if (substr($decodedImage, 0, 3) !== 'GIF') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid GIF file']);
    exit();
}

// Save the file
$filepath = $SAVE_DIR . $filename;

if (file_put_contents($filepath, $decodedImage) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save file']);
    exit();
}

// Log the save (optional - creates a log file)
$logEntry = date('Y-m-d H:i:s') . ' | ' . $filename . ' | ' . strlen($decodedImage) . ' bytes' . PHP_EOL;
file_put_contents($SAVE_DIR . 'save_log.txt', $logEntry, FILE_APPEND);

// Success response
echo json_encode([
    'success' => true,
    'filename' => $filename,
    'filepath' => $filepath,
    'size' => strlen($decodedImage),
    'timestamp' => $data['timestamp'] ?? date('c')
]);
