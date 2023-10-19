<?php

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetRequest();
        break;
    case 'POST':
        handlePostRequest();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

function handleGetRequest() {
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'getTemplate':
            $directory = 'templates/';
            $files = scandir($directory);
            $templates = array_filter($files, function ($file) {
                return is_file('templates/' . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'json';
            });
            $data = [
                'templates' => array_values($templates),
            ];
            echo json_encode($data);
            break;

        case 'getTemplateData':
            $name = $_GET['name'] ?? '';
            if (empty($name)) {
                http_response_code(400);
                echo json_encode(['error' => 'Template name is required']);
                break;
            }

            $filename = 'templates/' . $name;
            if (!file_exists($filename)) {
                http_response_code(404);
                echo json_encode(['error' => 'Template not found']);
                break;
            }

            $content = file_get_contents($filename);
            echo $content;
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
}


function handlePostRequest() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        return;
    }

    $action = $_GET['action'] ?? '';  // Get action from query string

    switch ($action) {
        case 'saveTemplate':
            $filename = 'templates/' . uniqid() . '.json';
            file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['message' => 'Template saved successfully', 'filename' => $filename]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
}

