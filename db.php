<?php
    $mysqli = new mysqli("localhost", "root", "", "rating");
    $params = $_GET;

    $act = $params['act'];

    if ($act == 'add') {
        $id = $params['id'];
        $ball = $params['ball'];
        $mysqli->query("REPLACE INTO `results` (`id`, `ball`) VALUES ($id, $ball)");
    } else if ($act == 'get') {
    	$res = $mysqli->query("SELECT * FROM `results` ORDER BY `ball` DESC LIMIT 10");
    	$json = array();
    	while ($row = $res->fetch_assoc()) {
    		$json[] = $row;
    	}
    	echo json_encode($json);
    }
?>
