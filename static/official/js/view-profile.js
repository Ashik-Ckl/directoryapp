var searchParams = new URLSearchParams(window.location.search)
var teacherId = searchParams.get('teacher')

$(document).ready(function(){
    $.ajax({
        url: "/api/router/teacher/"+teacherId+"/",
        type: "GET",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("officialaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $("#profilePicture").attr('src', response.profile_picture['medium_square_crop'])
                $("#fullName").html(response['first_name']+ ' ' + response['last_name'])
                $("#email").html('<b>Email:</b>'+response['email'])
                $("#phone").html('<b>Phone:</b>'+response['phone'])
                $("#roomNumber").html('<b>Room Number:</b>'+response['room_number'])
                $("#addressDiv").append(response['address'])
                var subject = ''
                for (var j = 0; j < response.subject.length; j++) {
                    subject += response.subject[j].subject + ','
                }
                $("#subjects").html('<b>Subjects:</b>'+subject)
                

            }
        }
    });
})