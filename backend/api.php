<?php

$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "todo_db";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
   
    echo json_encode(["error" => "Database connection failed. Check credentials in api.php and ensure MySQL is running: " . $conn->connect_error]);
    exit();
}


function initializeCategories($conn) {
    $check_sql = "SELECT COUNT(*) FROM categories";
    $result = $conn->query($check_sql);
    $row = $result->fetch_row();
    
    if ($row[0] == 0) {
       
        $categories_to_insert = [
            ['Frontend (React)', '#007bff'], 
            ['Backend (PHP/API)', '#28a745'], 
            ['Base de Datos (SQL)', '#ffc107'], 
            ['DevOps/Infra', '#6f42c1'], 
        ];
        
        $insert_sql_parts = [];
        foreach ($categories_to_insert as $cat) {
            $name = $conn->real_escape_string($cat[0]);
            $color = $conn->real_escape_string($cat[1]);
            $insert_sql_parts[] = "('$name', '$color')";
        }
        
        $insert_sql = "INSERT INTO categories (name, color) VALUES " . implode(", ", $insert_sql_parts);
        $conn->query($insert_sql);
    }
}

function initializeTags($conn) {
    $check_sql = "SELECT COUNT(*) FROM tags";
    $result = $conn->query($check_sql);
    $row = $result->fetch_row();
    
    if ($row[0] == 0) {
        $tags_to_insert = [
            'React', 
            'PHP/API', 
            'SQL/DB', 
            'Bug', 
            'Urgente', 
            'Refactor',
            'Feature',
            'Testing'
        ];
        
        $insert_sql_parts = [];
        foreach ($tags_to_insert as $tag_name) {
            $name = $conn->real_escape_string($tag_name);
            $insert_sql_parts[] = "('$name')";
        }
        
        $insert_sql = "INSERT INTO tags (name) VALUES " . implode(", ", $insert_sql_parts);
        $conn->query($insert_sql);
    }
}

function initializeTasks($conn) {
    $check_sql = "SELECT COUNT(*) FROM tasks";
    $result = $conn->query($check_sql);
    $row = $result->fetch_row();
    

    if ($row[0] == 0) {
        
        $cat_ids = [];
        $res = $conn->query("SELECT id FROM categories ORDER BY id ASC");
        while ($row_cat = $res->fetch_assoc()) {
            $cat_ids[] = $row_cat['id'];
        }
        
        
        $tasks_to_insert = [
            ["Configurar Nginx para el proyecto", 0, $cat_ids[3]], 
            ["Implementar hook personalizado para fetch", 0, $cat_ids[0]], 
            ["Crear endpoint de autenticación en API", 1, $cat_ids[1]],
            ["Optimizar consulta SELECT * de TaskService", 0, $cat_ids[2]], 
            ["Arreglar bug de renderizado en modo oscuro", 0, $cat_ids[0]], 
            ["Documentar el CRUD de etiquetas", 0, $cat_ids[1]], 
            ["Actualizar versión de React Router", 1, $cat_ids[0]], 
            ["Diseñar la estructura de la base de datos", 0, $cat_ids[2]], 
        ];

        $insert_sql_parts = [];
        $current_time = date('Y-m-d H:i:s');
        
        foreach ($tasks_to_insert as $task) {
            $text = $conn->real_escape_string($task[0]);
            $completed = (int)$task[1];
            $category_id = (int)$task[2];
            $insert_sql_parts[] = "('$text', $completed, $category_id, '$current_time')";
        }
        
        $insert_sql = "INSERT INTO tasks (text, completed, category_id, created_at) VALUES " . implode(", ", $insert_sql_parts);
        $conn->query($insert_sql);

      
        
        $tag_ids = [];
        $res = $conn->query("SELECT id, name FROM tags");
        while ($row_tag = $res->fetch_assoc()) {
            $tag_ids[$row_tag['name']] = $row_tag['id'];
        }

        $task_ids = [];
    
        $res = $conn->query("SELECT id FROM tasks ORDER BY id DESC LIMIT " . count($tasks_to_insert));
        while ($row_task = $res->fetch_assoc()) {
            $task_ids[] = $row_task['id'];
        }
        $task_ids = array_reverse($task_ids); 

        if (count($task_ids) === count($tasks_to_insert)) {
            $tags_to_assign = [
                [$task_ids[0], $tag_ids['Testing']],         
                [$task_ids[1], $tag_ids['React']],           
                [$task_ids[1], $tag_ids['Feature']],
                [$task_ids[2], $tag_ids['PHP/API']],        
                [$task_ids[3], $tag_ids['SQL/DB']],      
                [$task_ids[4], $tag_ids['Bug']],             
            ];

            $insert_tag_parts = [];
            foreach ($tags_to_assign as $assignment) {
                $insert_tag_parts[] = "(" . (int)$assignment[0] . ", " . (int)$assignment[1] . ")";
            }
            
            if (!empty($insert_tag_parts)) {
                $insert_tag_sql = "INSERT INTO task_tag (task_id, tag_id) VALUES " . implode(", ", $insert_tag_parts) . " ON DUPLICATE KEY UPDATE task_id=task_id";
                $conn->query($insert_tag_sql);
            }
        }
    }
}



initializeCategories($conn);
initializeTags($conn);
initializeTasks($conn);

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['resource']) && $_GET['resource'] == 'categories') {
    $sql = "SELECT id, name, color FROM categories ORDER BY name ASC";
    $result = $conn->query($sql);
    
    $categories = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    }
    echo json_encode($categories);
    $conn->close();
    exit();
}


if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['resource']) && $_GET['resource'] == 'tags') {
    $sql = "SELECT id, name FROM tags ORDER BY name ASC";
    $result = $conn->query($sql);
    
    $tags = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $tags[] = ['id' => (int)$row['id'], 'name' => $row['name']];
        }
    }
    echo json_encode($tags);
    $conn->close();
    exit();
}



$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        $sql = "
            SELECT 
                t.id, 
                t.text, 
                t.completed, 
                t.created_at,
                c.id AS category_id,
                c.name AS category_name,
                c.color AS category_color,
                GROUP_CONCAT(DISTINCT tg.id, ':', tg.name SEPARATOR ',') AS tags_data
            FROM 
                tasks t
            LEFT JOIN 
                categories c ON t.category_id = c.id
            LEFT JOIN 
                task_tag tt ON t.id = tt.task_id
            LEFT JOIN 
                tags tg ON tt.tag_id = tg.id
            GROUP BY 
                t.id
            ORDER BY 
                t.created_at DESC;
        ";
        $result = $conn->query($sql);

        $tasks = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $tags = [];
                if (!empty($row['tags_data'])) {
                    $tag_pairs = explode(',', $row['tags_data']);
                    foreach ($tag_pairs as $pair) {
                        if (strpos($pair, ':') !== false) {
                            list($tag_id, $tag_name) = explode(':', $pair, 2); 
                        
                            if (is_numeric($tag_id) && $tag_name !== '') { 
                                $tags[] = ['id' => (int)$tag_id, 'name' => $tag_name];
                            }
                        }
                    }
                }

                $tasks[] = [
                    'id' => (int)$row['id'],
                    'text' => $row['text'],
                    'completed' => (bool)$row['completed'],
                    'created_at' => $row['created_at'],
                    'category' => $row['category_id'] ? [
                        'id' => (int)$row['category_id'],
                        'name' => $row['category_name'],
                        'color' => $row['category_color']
                    ] : null,
                    'tags' => array_values($tags) 
                ];
            }
        }
        echo json_encode($tasks);
        break;

    case 'POST':
        if (!isset($data['text']) || empty($data['text'])) {
             http_response_code(400); 
             echo json_encode(["message" => "Task text is required."]);
             break;
        }
        $text = $conn->real_escape_string($data['text']);
        
       
        $category_id = isset($data['category_id']) && is_numeric($data['category_id']) && $data['category_id'] > 0 ? (int)$data['category_id'] : 'NULL'; 
        $tags = isset($data['tags']) && is_array($data['tags']) ? $data['tags'] : [];
        
        $sql = "INSERT INTO tasks (text, category_id, created_at) VALUES ('$text', $category_id, NOW())";

        if ($conn->query($sql) === TRUE) {
            $new_task_id = $conn->insert_id; 

         
            if (!empty($tags)) {
                $insert_tag_parts = [];
                foreach ($tags as $tag_id) {
                    $tag_id = (int)$tag_id;
                    if ($tag_id > 0) { 
                        $insert_tag_parts[] = "($new_task_id, $tag_id)";
                    }
                }

                if (!empty($insert_tag_parts)) {
                    $insert_tag_sql = "INSERT INTO task_tag (task_id, tag_id) VALUES " . implode(", ", $insert_tag_parts);
                  
                    $conn->query($insert_tag_sql . " ON DUPLICATE KEY UPDATE task_id=task_id"); 
                }
            }
            
            http_response_code(201);
            echo json_encode(["message" => "Task created", "id" => $new_task_id]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error creating task: " . $conn->error]);
        }
        break;

    case 'PUT':
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        
        if ($id === 0) {
             http_response_code(400);
             echo json_encode(["message" => "Task ID is required for update."]);
             break;
        }

        $updates = [];
        if (isset($data['completed'])) {
            $completed = (int)$data['completed'];
            $updates[] = "completed = $completed";
        }

        if (isset($data['text'])) {
             $text = $conn->real_escape_string($data['text']);
             $updates[] = "text = '$text'";
        }
        if (array_key_exists('category_id', $data)) {
          
            $category_id = ($data['category_id'] && is_numeric($data['category_id']) && $data['category_id'] > 0) ? (int)$data['category_id'] : 'NULL';
            $updates[] = "category_id = $category_id";
        }
   
        $tags_to_update = isset($data['tags']) && is_array($data['tags']) ? $data['tags'] : null;
        $tags_updated = false;

        if ($tags_to_update !== null) {
            $tags_updated = true;
          
            $conn->query("DELETE FROM task_tag WHERE task_id = $id");

            if (!empty($tags_to_update)) {
                $insert_tag_parts = [];
                foreach ($tags_to_update as $tag_id) {
                    $tag_id = (int)$tag_id;
                    if ($tag_id > 0) {
                        $insert_tag_parts[] = "($id, $tag_id)";
                    }
                }
                
                if (!empty($insert_tag_parts)) {
                    $insert_tag_sql = "INSERT INTO task_tag (task_id, tag_id) VALUES " . implode(", ", $insert_tag_parts);
                    $conn->query($insert_tag_sql);
                }
            }
        }
    


        if (empty($updates)) {
 
             if ($tags_updated) {
                 echo json_encode(["message" => "Tags updated successfully"]);
                 break;
             }
             http_response_code(400); 
             echo json_encode(["message" => "No data provided for update."]);
             break;
        }
        
        $sql = "UPDATE tasks SET " . implode(", ", $updates) . " WHERE id = $id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Task updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error updating task: " . $conn->error]);
        }
        break;

    case 'DELETE':
        $id = isset($data['id']) ? (int)$data['id'] : 0;

        if ($id === 0) {
         
            $sql = "DELETE FROM tasks WHERE completed = 1";
            $message = "Completed tasks deleted";
        } else {
     
            $conn->query("DELETE FROM task_tag WHERE task_id = $id");
            $sql = "DELETE FROM tasks WHERE id = $id";
            $message = "Task deleted";
        }

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => $message]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error deleting task: " . $conn->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

$conn->close();
?>