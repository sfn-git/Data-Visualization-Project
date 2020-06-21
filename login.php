<?php 
include 'dbconfig.php';

$uname = mysqli_real_escape_string($con, $_POST['username']);
$pass = mysqli_real_escape_string($con, $_POST['password']);

// If someone access the page via URL
if($uname == "" || $pass == ""){

    die("Unable to access page. Please return to the home page.");

}

// Error checking
if(mysqli_connect_error()){

    $response->message = "Unable to connect to authentication server";
    $response->status = 0;
    

}else{

    $sql = "SELECT * FROM DV_User WHERE login='$uname'";
    $res = mysqli_query($con, $sql);

    if(!$res){

        $response->message = "Unable to verify login credentials";
        $response->status = 0;
        $response->error = mysqli_error($con);
    

    }else{

        $row = mysqli_fetch_assoc($res);
        if($pass == $row['password'] && $uname == $row['login']){

            $response->message = "Login Successful!";
            $response->status = 1;
            $response->uid = $row['uid'];
            $response->username = $row['login'];
            $response->name = $row['name'];
            $response->gender = $row['gender'];


        }else{

            $response->message = "Wrong username or password.";
            $response->status = 0;

        }

    }
}

mysqli_close($con);
// Sends back to javascript to be parsed
echo json_encode($response);

?>