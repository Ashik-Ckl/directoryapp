$('#teacherViewTable').DataTable();
var teacherId = 0
teacher()
subjects()
function teacher(url) {
    var action ="/api/router/teacher/"
    if(url != null){
        action = url
    }
    $.ajax({
        url: action,
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
                if(response.length == 0){
                    swal('No data')
                }
                table = $("#teacherViewTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    var subject = ''
                    for (var j = 0; j < rowData.subject.length; j++) {
                        subject += rowData.subject[j].subject + ','
                    }
                    var tableData = [];
                    var profilepicture = '<a href="/view-profile/?teacher='+rowData['id']+'"><img src="' + rowData.profile_picture["small_square_crop"] + '"></a>'
                    var editSubject = '<a href="#teacherAddForm" id=' + rowData['id'] + ' class="icofont-edit text-success edit-edit"><i class="iicofont-edit text-success"></i></a>'
                    var deleteSubject = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="btn-delete"><i class="icofont-ui-delete text-danger"></i></button>'
                    tableData.push([rowData['first_name'], rowData['last_name'], profilepicture, rowData['email'], rowData['address'], rowData['phone'], rowData['room_number'], subject, editSubject, deleteSubject])
                    table.rows.add(tableData).draw();
                    subject = ''
                }
            }
        }
    });
};

$("#teacherAddForm").validate({
    rules: {
        subject: {
            required: true,
            minlength:1,
        },
        first_name:{
            required:true,
            maxlength:50,
        },
        last_name:{
            required:true,
            maxlength:50,
        },
        email:{
            required:true,
            email:true,
        },
        phone:{
            required:true,
        },
        room_number:{
            required:true,
        }
    },
    submitHandler: function (e) {
        var data = new FormData($("#teacherAddForm")[0]);
        if (teacherId != 0) {
            updateTeacher(data)
        }
        else {
            saveTeacher(data)
        }
    }
});

function saveTeacher(data) {
    $.ajax({
        url: "/api/router/teacher/",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("officialaccesstoken")
            );
        },
        statusCode: {
            401: function () {
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            201: function (response) {
                $("#teacherAddForm").trigger("reset");
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                teacher()
            },
            208: function (response) {
                swal("Oops!", response['msg'], {
                    icon: "error",
                });
            },
            400: function(){
                swal('you have selected more than 5 languages')
            }
        }
    });
}

function updateTeacher(data) {
    $.ajax({
        url: "/api/router/teacher/" + teacherId + "/",
        type: "PUT",
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("officialaccesstoken")
            );
        },
        statusCode: {
            401: function () {
                swal("Oops! Something went wrong!", {
                    icon: "error",
                });
            },
            200: function (response) {
                teacherId = 0
                $("#teacherAddForm").trigger("reset");
                swal("Updated successfully...", {
                    icon: "success",
                });
                teacher();
            },
            208: function (response) {
                teacherId = 0 
                swal("Oops!" + response['message'], {
                    icon: "error",
                });
            },
            400: function (jqXHR, textStatus, errorThrown){
                swal('You have selected more than 5 subjects')
            },
        }
    });
}

$(document).on('click', '#btnDelete', function () {
    rowIndex = $(this)
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                var id = $(this).val();
                var tableIndex = $(this)
                $.ajax({
                    url: "/api/router/teacher/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Token " + localStorage.getItem("officialaccesstoken")
                        );
                    },
                    statusCode: {
                        400: function () {
                            swal("Oops! Cannot delete this category!", {
                                icon: "error",
                            });
                        },
                        204: function () {
                            $(tableIndex).closest('tr').remove();
                            swal("Oops! Deleted Successfully!", {
                                icon: "success",
                            });
                        },
                        500: function () {
                            swal("Oops! This data canot be deleted!", {
                                icon: "error",
                            });
                        }
                    },
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });
});

$(document).on('click', '.edit-edit', function () {
    var id = $(this).attr('id')
    $.ajax({
        url: "/api/router/teacher/" + id + "/",
        type: "GET",
        cache: false,
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("officialaccesstoken")
            );
        },
        statusCode: {
            200: function (response) {
                $('input[name=subject]').attr('checked', false)
                teacherId = response['id']
                $("input[name=first_name]").val(response['first_name'])
                $("input[name=last_name]").val(response['last_name'])
                $("input[name=email]").val(response['email'])
                $("input[name=phone]").val(response['phone'])
                $("input[name=room_number]").val(response['room_number'])
                $("textarea[name=address]").val(response['address'])
                var subjects = $("input[name=subject]")
                for (var j = 0; j < response.subject.length; j++) {
                    subjects.filter('[value="' + response.subject[j].id + '"]').attr("checked","checked");
                }
                teacher()
            }
        }
    });

});


function subjects() {
    $.ajax({
        url: "/api/router/subjects/",
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
                if(response.length == 0){
                    $('.text-danger').html('please add subject for save teacher')
                }
                table = $("#subjectViewTable").DataTable();
                table.clear()
                table.draw()
                drawTable(response);
                function drawTable(data) {
                    for (var i = 0; i < data.length; i++) {
                        drawRow(data[i]);
                    }
                }
                function drawRow(rowData) {
                    $("[id=subjectsDiv]").append('\
                    <div class="col-2">\
                    <input type="checkbox" name="subject" value='+rowData['id']+' class="form-check-input">\
                    <label class="form-check-label" for="exampleCheck1">'+rowData['subject']+'</label>\
                    </div>\
                    ')
                    $("#filtersubjectsDiv").append('\
                    <div class="col-2">\
                    <input type="checkbox" name="subjectflt" value='+rowData['id']+' class="form-check-input">\
                    <label class="form-check-label" for="exampleCheck1">'+rowData['subject']+'</label>\
                    </div>\
                    ')
                }
            }
        }
    });
}

$("#subjectFilterForm").submit(function(){
    $("#subjectModal").modal('hide');
    var subjects = []
    $('[name="subjectflt"]:checked').each(function(i){
        subjects[i] =$(this).val();
    });
    subject = JSON.stringify(subjects)
    var url = "/api/router/teacher/?subjects="+subject
    if(subjects.length != 0){
        teacher(url)
    }
    return false;
});


