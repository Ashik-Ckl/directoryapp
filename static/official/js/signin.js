
$("#loginForm").validate({
    rules:{
        username:{
            required:true,
        },
        password:{
            required:true
        },
        messages:{
            username:{
                required:"Please enter your ",            
            },
            password:{
                required:"This field is required"
            }
        }
    },
    submitHandler: function (e){
        var username = $('input[name=username]').val();
        var password = $('input[name=password]').val();      
        var csrftoken = $('[name="csrfmiddlewaretoken"]').val();
        data = {
            'username':username,
            'password':password,
            csrfmiddlewaretoken:csrftoken
        } 
        $.ajax({
            url:"/api/login/",
            type: "POST",
            data: data,
            statusCode: {
                400: function() {
                    $("#errorTag").html("Invalid username or password")
                },
                200:function(response){
                    localStorage.setItem("officialaccesstoken",response['token']);
                    window.location="/teachers/"
                }
            }
        });
    } 
});

$("#email").keyup(function(){
    $("#errorForm").html('')
})