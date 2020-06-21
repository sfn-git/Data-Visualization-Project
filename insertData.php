<?php

    $uid = $_POST['uid'];
    $login = $_POST['login'];
    $avgWage = $_POST['avgWage'];
    $estPop = $_POST['estPop'];

    $return = array();

    include 'dbconfig.php';


    $sql = "SELECT * from 2019F_nadeems.DV_Project WHERE uid=$uid";
    $res = mysqli_query($con, $sql);
    if(mysqli_num_rows($res)>0){

        $sql = "UPDATE 2019F_nadeems.DV_Project SET AvgWage=$avgWage, EstPop=$estPop WHERE uid=$uid";
        if(mysqli_query($con,$sql)){
            $return["Message"] = "Settings Saved!";
            $return["Status"] = 1;
        }else{
            $return["Message"] = "Unable to save settings" . $con->error;
            $return["Status"] = 0;
        }

    }else{

        $sql = "INSERT INTO 2019F_nadeems.DV_Project (uid, login, AvgWage, EstPop, datetime) VALUES ($uid, '$login', $avgWage, $estPop, NOW())";
        if(mysqli_query($con,$sql)){
            $return["Message"] = "Settings Saved!";
            $return["Status"] = 1;
        }else{
            $return["Message"] = "Unable to save settings " . $con->error;
            $return["Status"] = 0;
        }

    }

    mysqli_close($con);

    echo json_encode($return);

?>