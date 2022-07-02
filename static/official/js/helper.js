$(document).ready(function(){
    if (localStorage.getItem("officialaccesstoken")== null){
        window.location="/"
      }
      else{
        $.ajax({
          url: "/api/get-user-details/",
          type: "GET",
          async:true,
          cache:false,
          beforeSend: function (xhr) {
              xhr.setRequestHeader(
                  "Authorization",
                  "Token " + localStorage.getItem("officialaccesstoken")
              );
          },
          statusCode: {
            401: function() {
                localStorage.removeItem("officialaccesstoken")
                window.location.href="/"
            }
          },
          success:function(response){
            $("#userName").html(response['username']);
          }
       })
      }
});


$("#logout").click(function(){
  $.ajax({
      url: "/api/logout/",
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Token " + localStorage.getItem("officialaccesstoken")
        );
      },
      statusCode: {
          403: function(response) {
          },
          200:function(response){                
          },
      },
      success:function(){
          localStorage.removeItem("officialaccesstoken")
          window.location="/"
      }
  });
});
