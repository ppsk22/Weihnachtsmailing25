<?php
/**
 * Save Banner to Server
 * 
 * This script receives a base64-encoded GIF or PNG image and saves it to the server.
 * Place this file in the same directory as your banner builder.
 * 
 * Supported formats: GIF (animated banners), PNG (static fallback)
 * Resolution: 1200x600 pixels (banner stage size)
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
$MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB max file size

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

// Determine file type from filename
$isGif = preg_match('/\.gif$/i', $filename);
$isPng = preg_match('/\.png$/i', $filename);

if (!$isGif && !$isPng) {
    // Default to GIF if extension not recognized
    $filename = preg_replace('/\.[^.]+$/', '', $filename) . '.gif';
    $isGif = true;
}

// Allow: letters, numbers, underscores, hyphens, dots (but not at start/end)
// Must end with .gif or .png and contain timestamp pattern
$extension = $isGif ? 'gif' : 'png';
if (!preg_match('/^[a-zA-Z0-9_-]+_\d+_[a-z0-9]+\.' . $extension . '$/i', $filename)) {
    // If filename doesn't match expected pattern, generate a new one
    $filename = 'banner_' . time() . '_' . bin2hex(random_bytes(3)) . '.' . $extension;
}

// Extra safety: remove any remaining problematic characters
$filename = preg_replace('/[^a-zA-Z0-9_.-]/', '', $filename);
if (empty($filename) || $filename === '.' . $extension) {
    $filename = 'banner_' . time() . '_' . bin2hex(random_bytes(3)) . '.' . $extension;
}

// Validate and decode base64 image
$imageData = $data['image'];

// Check if it's a data URL and extract the base64 part
if (strpos($imageData, 'data:image/gif;base64,') === 0) {
    $imageData = substr($imageData, strlen('data:image/gif;base64,'));
    $isGif = true;
} elseif (strpos($imageData, 'data:image/png;base64,') === 0) {
    $imageData = substr($imageData, strlen('data:image/png;base64,'));
    $isPng = true;
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
    echo json_encode(['success' => false, 'error' => 'File too large (max 100MB)']);
    exit();
}

// Verify it's actually a valid image (check magic bytes)
$isValidGif = substr($decodedImage, 0, 3) === 'GIF';
$isValidPng = substr($decodedImage, 0, 8) === "\x89PNG\r\n\x1a\n";

if (!$isValidGif && !$isValidPng) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid image file (must be GIF or PNG)']);
    exit();
}

// Update filename extension if it doesn't match the actual file type
if ($isValidPng && $isGif) {
    $filename = preg_replace('/\.gif$/i', '.png', $filename);
} elseif ($isValidGif && $isPng) {
    $filename = preg_replace('/\.png$/i', '.gif', $filename);
}

// Save the file
$filepath = $SAVE_DIR . $filename;

if (file_put_contents($filepath, $decodedImage) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save file']);
    exit();
}

// Log the save (optional - creates a log file)
$fileType = $isValidGif ? 'GIF' : 'PNG';
$logEntry = date('Y-m-d H:i:s') . ' | ' . $filename . ' | ' . $fileType . ' | ' . strlen($decodedImage) . ' bytes' . PHP_EOL;
file_put_contents($SAVE_DIR . 'save_log.txt', $logEntry, FILE_APPEND);

// Success response
echo json_encode([
    'success' => true,
    'filename' => $filename,
    'filepath' => $filepath,
    'size' => strlen($decodedImage),
    'type' => $fileType,
    'timestamp' => $data['timestamp'] ?? date('c')
]);
