<?php
/**
 * List Banners API
 * 
 * Scans banners folder and returns:
 * - All JSON files (in banners/)
 * - Which ones have corresponding GIF files (in banners/gif/)
 * - Which ones are missing GIFs
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$BANNERS_DIR = 'banners/';
$GIF_DIR = 'banners/gif/';

// Check if directory exists
if (!file_exists($BANNERS_DIR)) {
    echo json_encode([
        'success' => false,
        'error' => 'Banners directory not found'
    ]);
    exit();
}

// Create gif subfolder if it doesn't exist
if (!file_exists($GIF_DIR)) {
    mkdir($GIF_DIR, 0755, true);
}

// Scan for JSON files in banners/
$jsonFiles = glob($BANNERS_DIR . '*.json');

// Scan for GIF files in banners/gif/
$gifFiles = glob($GIF_DIR . '*.gif');

// Build lookup of existing GIFs (without extension)
$existingGifs = [];
foreach ($gifFiles as $gif) {
    $baseName = pathinfo($gif, PATHINFO_FILENAME);
    $existingGifs[$baseName] = true;
}

// Check each JSON and see if it has a corresponding GIF
$banners = [];
$missingGifs = [];
$hasGifs = [];

foreach ($jsonFiles as $json) {
    $baseName = pathinfo($json, PATHINFO_FILENAME);
    $hasGif = isset($existingGifs[$baseName]);
    
    $banners[] = [
        'name' => $baseName,
        'json' => basename($json),
        'hasGif' => $hasGif,
        'gif' => $hasGif ? 'gif/' . $baseName . '.gif' : null
    ];
    
    if ($hasGif) {
        $hasGifs[] = $baseName;
    } else {
        $missingGifs[] = $baseName;
    }
}

echo json_encode([
    'success' => true,
    'total' => count($banners),
    'withGif' => count($hasGifs),
    'withoutGif' => count($missingGifs),
    'missingGifs' => $missingGifs,
    'banners' => $banners
]);