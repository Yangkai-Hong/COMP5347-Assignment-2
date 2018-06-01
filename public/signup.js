$(document).ready(function () {
    $('#alertSuccess').hide();
    $('#alertFail').hide();
    $('#buttonSignup').click(function (event) {
        event.preventDefault();
        var firstname = $('#inputFirstname').val();
        var lastname = $('#inputLastname').val();
        var username = $('#inputUsername').val();
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        //console.log("email: "+email);
        var req = {
            firstname:firstname,
            lastname:lastname,
            username:username,
            email:email,
            password:password
        }
        if (firstname&&lastname&&username&&email&&password) {
            $.getJSON('/users', req, function (result) {
                /*console.log(result['inDatabase']);
                if (result['inDatabase'] == false) {
                    $('#alertFail').show();
                }*/
                if (result['inDatabase'] == true) {
                    $('#alertSuccess').show();
                    $('#alertFail').hide();
                }
            })
        }
        else {
            $('#alertFail').show();
            $('#alertSuccess').hide();
        }
    })
})