$(document).ready(function () {
    $('#alertError').hide();
    $('#signinBtn').click(function (event) {
        event.preventDefault();
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        if (email&&password){
            var req = {
                email:email,
                password:password
            }
            $.getJSON('/users/user',req,function (result) {
                if (result['loginCredential'] == true){
                    $('#alertError').hide();
                    /*var form = $('<form action="/loggedin" method="post">' +
                                 '<input type="text" name="loginCredential" value="true" />' +
                                 '</form>');
                    $('body').append(form);
                    form.submit();*/
                    $.redirect('/',{loginCredential:true,email:email},"POST")
                }
                else {
                    $('#alertError').show();
                }
            })
        }
        else{
            $('#alertError').show();
        }
    })
})