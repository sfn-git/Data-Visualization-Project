$(function(){

    //Event for when login button is pressed
    $("#login-menu-btn").on('click', function(e){

        e.preventDefault();
        //Checks to see if cookie is set
        if(Cookies.get('uid') == null){

            $(".login-popup").css('display' , 'block');

        }else{

            document.getElementById('messageArea').innerHTML = "You are already logged in as " + Cookies.get('name');

        }

    });

    //Cancel button within the login popup
    $("#login-cancel").on('click', function(e){

        e.preventDefault();
        $('.login-popup').css('display' , 'none');

    });

    //Event for when the form is submitted
    $('#login-db').on('submit', function(e){

        e.preventDefault();
        //Authenticates users input for login
        $.ajax({

            method: "POST",
            url: 'login.php',
            data: $(this).serialize(),
            success: function(response){
                //Parses response
                response = JSON.parse(response);
                
                //If PHP program determines that the login is unsuccessful
                if(response['status'] == 0){

                    document.getElementById('login_msg').innerHTML = response['message'];
                    document.getElementById('messageArea').innerHTML = response['message'] + " Please try again.";

                }else if(response['status'] == 1){
                    // Sets the cookies once login is determined to be successful
                    document.getElementById('login_msg').innerHTML = "";
                    $('.login-popup').css('display' , 'none');
                    Cookies.set('uid', response['uid'], {expires: 30});
                    Cookies.set('username', response['username'], {expires: 30});
                    Cookies.set('name', response['name'], {expires: 30});
                    Cookies.set('gender', response['gender'], {expires: 30});
                        
                    document.getElementById('messageArea').innerHTML = "Thank you for logging in " + Cookies.get('name');
                    

                }else{

                    document.getElementById('messageArea').innerHTML = "Please refresh the page and try again";

                }

            },
            error: function(response, status, error){

                document.getElementById('messageArea').innerHTML = "Please refresh the page and try again";

            }

        });

    });

});
