<?php

$dbtable = $_POST['db'];

include 'dbconfig.php';

$sql = "select RecordNumber, Zipcode, City, State, EstimatedPopulation, AvgWages, Latitude, Longitude from " . $dbtable;
$res = mysqli_query($con, $sql);
$data = array();
while($row = mysqli_fetch_assoc($res)){

    $data[] = $row;

}

mysqli_close($con);
echo json_encode($data);

?>