$('#subjectViewTable').DataTable();
var subjectId = 0
subjects()
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
                    var tableData = [];
                    var editSubject = '<a href="#" id=' + rowData['id'] + ' class="icofont-edit text-success edit-edit"><i class="iicofont-edit text-success"></i></a>'
                    var deleteSubject = '<button type="button" id="btnDelete" value=' + rowData['id'] + ' class="btn-delete"><i class="icofont-ui-delete text-danger"></i></button>'
                    tableData.push([rowData['subject'], editSubject, deleteSubject])
                    table.rows.add(tableData).draw();
                }
            }
        }
    });
};

$("#subjectAddForm").validate({
    rules: {
        subject: {
            required: true,
            maxlength: 30,
        },
    },
    messages: {
        subject: {
            required: "This field is required",
        },
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        if (subjectId != 0) {
            updateSubject(data)
        }
        else {
            saveSubject(data)
        }
    }
});

function saveSubject(data) {
    $.ajax({
        url: "/api/router/subjects/",
        type: "POST",
        data: data,
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
                $("#subjectModal").modal('hide')
                $("#subjectAddForm").trigger("reset")
                swal("Oops! Saved Successfully!", {
                    icon: "success",
                });
                var tableData = []
                table = $("#subjectViewTable").DataTable();
                var editSubject = '<a href="#" id=' + response['id'] + ' class="icofont-edit text-success edit-edit"><i class="iicofont-edit text-success"></i></a>'
                var deleteSubject = '<button type="button" id="btnDelete" value=' + response['id'] + ' class="btn-delete"><i class="icofont-ui-delete text-danger"></i></button>'
                tableData.push([response['subject'], editSubject, deleteSubject])
                table.rows.add(tableData).draw();
            },
            208: function (response) {
                $("#subjectAddForm").trigger("reset")
                $("#subjectModal").modal('hide')
                swal("Oops!", response['message'], {
                    icon: "error",
                });
            },
        }
    });
}

function updateSubject(data) {
    $.ajax({
        url: "/api/router/subjects/" + subjectId + "/",
        type: "PUT",
        data: data,
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
                $("#subjectAddForm").trigger("reset")
                $("#subjectModal").modal('hide')
                swal("Updated successfully...", {
                    icon: "success",
                });
                subjects();
            },
            208: function (response) {
                $("#subjectAddForm").trigger("reset")
                $("#subjectModal").modal('hide')
                swal("Oops!" + response['message'], {
                    icon: "error",
                });
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
                    url: "/api/router/subjects/" + id + "/",
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
                            subjects()
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
        url: "/api/router/subjects/" + id + "/",
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
                $("#subject").val(response['subject'])
                subjectId = response['id']
                $("#subjectModal").modal('show')
            }
        }
    });

});

$("#btnSubject").click(function(){
    subjectId = 0
    $("#subjectAddForm").trigger("reset")
});