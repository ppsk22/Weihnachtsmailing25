<?php
/**
 * Save Banner to Server
 * 
 * Accepts binary file upload via FormData (much faster than base64!)
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
$SAVE_DIR = 'banners/';
$MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

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

// Check for file upload (FormData)
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadedFile = $_FILES['file'];
    $filename = isset($_POST['filename']) ? basename($_POST['filename']) : $uploadedFile['name'];
    $tempPath = $uploadedFile['tmp_name'];
    $fileSize = $uploadedFile['size'];
    
    if ($fileSize > $MAX_FILE_SIZE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'File too large (max 100MB)']);
        exit();
    }
    
    $fileContent = file_get_contents($tempPath);
    $isValidGif = substr($fileContent, 0, 3) === 'GIF';
    $isValidPng = substr($fileContent, 0, 8) === "\x89PNG\r\n\x1a\n";
    $isValidJpeg = substr($fileContent, 0, 2) === "\xFF\xD8";
    $isValidJson = preg_match('/\.json$/i', $filename) && json_decode($fileContent) !== null;
    
    if (!$isValidGif && !$isValidPng && !$isValidJpeg && !$isValidJson) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid file (must be GIF, PNG, JPEG, or JSON)']);
        exit();
    }
    
    // Determine extension
    if ($isValidJson) {
        $extension = 'json';
        $fileType = 'JSON';
    } elseif ($isValidGif) {
        $extension = 'gif';
        $fileType = 'GIF';
    } elseif ($isValidJpeg) {
        $extension = 'jpg';
        $fileType = 'JPEG';
    } else {
        $extension = 'png';
        $fileType = 'PNG';
    }
    
    // Sanitize filename - strip everything except safe characters
    // First, get just the base name without extension
    $baseName = pathinfo($filename, PATHINFO_FILENAME);
    $originalExt = pathinfo($filename, PATHINFO_EXTENSION);
    
    // Strip to only lowercase alphanumeric and underscore
    $baseName = preg_replace('/[^a-z0-9_]/i', '', $baseName);
    $baseName = strtolower($baseName);
    
    // If base name is empty or too short after sanitization, generate a new one
    if (strlen($baseName) < 5) {
        $baseName = 'banner_' . time() . '_' . bin2hex(random_bytes(3));
    }
    
    // Ensure correct extension based on content type
    $filename = $baseName . '.' . $extension;
    
    $filepath = $SAVE_DIR . $filename;
    if (!move_uploaded_file($tempPath, $filepath)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save file']);
        exit();
    }
    
    $logEntry = date('Y-m-d H:i:s') . ' | ' . $filename . ' | ' . $fileType . ' | ' . $fileSize . ' bytes' . PHP_EOL;
    file_put_contents($SAVE_DIR . 'save_log.txt', $logEntry, FILE_APPEND);
    
    echo json_encode([
        'success' => true,
        'filename' => $filename,
        'filepath' => $filepath,
        'size' => $fileSize,
        'type' => $fileType,
        'timestamp' => $_POST['timestamp'] ?? date('c')
    ]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'No file uploaded']);