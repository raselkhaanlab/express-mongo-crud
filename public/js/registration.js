'use strict';

var baseUrl = 'http://localhost:5000/auth/';
var registrationBtn = $('#registration-btn');

registrationBtn.on('click',registrationHandler);

function registrationHandler(e) {
    // $("#registration-modal").modal('hide');

    var formdata = $('#registration-form').serializeArray();
    var formattedData = {};
    formdata.forEach(function(item){
        formattedData[item.name] = item.value;
    });

    var url = baseUrl + 'registration';
    $("#registration-form").LoadingOverlay("show");
    $.post(url, formattedData)
    .done(function(msg,statusText,xhr){ 
        $("#registration-form").LoadingOverlay("hide"); 
        if(msg && msg.data) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Registration completed',
                text:'Your registration successfuly complete! you can login now.',
                showConfirmButton: false,
                timer: 3000
              });
            $("#registration-modal").modal('hide');
        }
    })
    .fail(function(xhr, status, error) {
        $("#registration-form").LoadingOverlay("hide");
        if(xhr.status && xhr.status==400) {
            var res = xhr.responseJSON;
            if(res) {
                var err = res.errors;
                // console.log(err);
                if(err.first_name) {
                    $('#first_name').addClass("is-invalid");
                    $('#first_name').next().text(err.first_name);
                }
                else {
                    $('#first_name').removeClass("is-invalid");
                    $('#first_name').next().text('');
                }
                if(err.last_name) {
                    $('#last_name').addClass("is-invalid");
                    $('#last_name').next().text(err.last_name);
                }
                else {
                    $('#last_name').removeClass("is-invalid");
                    $('#last_name').next().text('');
                }
                if(err.mobile_number) {
                    $('#mobile_number').addClass("is-invalid");
                    $('#mobile_number').next().text(err.mobile_number);
                }
                else {
                    $('#mobile_number').removeClass("is-invalid");
                    $('#mobile_number').next().text('');
                }

                if(err.email) {
                    $('#email').addClass("is-invalid");
                    $('#email').next().text(err.email);
                }
                else {
                    $('#email').removeClass("is-invalid");
                    $('#email').next().text('');
                }

                if(err.password) {
                    $('#password').addClass("is-invalid");
                    $('#password').next().text(err.password);
                }
                else {
                    $('#password').removeClass("is-invalid");
                    $('#password').next().text('');
                }
            }
        }
        else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title:'Registration Failed',
                text: 'your registration is unsuccessful',
                showConfirmButton: false,
                timer: 3000
              })
        }
    });


}

//clear modal value

$("#registration-modal").on('hidden.bs.modal',function(){
    $("#first_name").val("");
    $("#first_name").next().text("");
    $("#first_name").removeClass("is-invalid");

    $("#last_name").val("");
    $("#last_name").next().text("");
    $("#last_name").removeClass("is-invalid");

    $("#moblie_number").val("");
    $("#moblie_number").next().text("");
    $("#moblie_number").removeClass("is-invalid");

    $("#email").val("");
    $("#email").next().text("");
    $("#email").removeClass("is-invalid");

    $("#password").val("");
    $("#password").next().text("");
    $("#password").removeClass("is-invalid");
});