'use strict';

var baseUrl = 'http://localhost:5000/auth/';
var forgetBaseUrl = 'http://localhost:5000/users/';
var registrationBtn = $('#registration-btn');
var forgetPasswordBtn = $('#forget-password-btn');

registrationBtn.on('click',registrationHandler);

function registrationHandler(e) {
    // $("#registration-modal").modal('hide');

    var formdata = $('#registration-form').serializeArray();
    var formattedData = {};
    formdata.forEach(function(item){
        formattedData[item.name] = item.value;
    });

    var url = baseUrl + 'pre-registration';
    $("#registration-form").LoadingOverlay("show");
    $.post(url, formattedData)
    .done(function(msg,statusText,xhr){ 
        $("#registration-form").LoadingOverlay("hide"); 
        if(msg && msg.data) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thank you!',
                text:msg.data.message,
                showConfirmButton: false,
                timer: 6000
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
                    $('#registration-form #email').addClass("is-invalid");
                    $('#registration-form #email').next().text(err.email);
                }
                else {
                    $('#registration-form #email').removeClass("is-invalid");
                    $('#registration-form #email').next().text('');
                }

                // if(err.password) {
                //     $('#password').addClass("is-invalid");
                //     $('#password').next().text(err.password);
                // }
                // else {
                //     $('#password').removeClass("is-invalid");
                //     $('#password').next().text('');
                // }
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
    $("#registration-form #first_name").val("");
    $("#registration-form #first_name").next().text("");
    $("#registration-form #first_name").removeClass("is-invalid");

    $("#registration-form #last_name").val("");
    $("#registration-form #last_name").next().text("");
    $("#registration-form #last_name").removeClass("is-invalid");

    $("#registration-form #mobile_number").val("");
    $("#registration-form #mobile_number").next().text("");
    $("#registration-form #mobile_number").removeClass("is-invalid");

    $('#registration-form #email').val("");
    $('#registration-form #email').next().text("");
    $('#registration-form #email').removeClass("is-invalid");

    // $("#password").val("");
    // $("#password").next().text("");
    // $("#password").removeClass("is-invalid");
});



forgetPasswordBtn.on('click',forgetPasswordhandler);

function forgetPasswordhandler (e) {
var modal = $('#forget-password-modal');
 var form = $("#forget-password-form");
 var emailInput = form.find("#email");
 var email = emailInput.val();
 
 var url = forgetBaseUrl +'forget-password';
 $("#forget-password-form").LoadingOverlay("show");
 $.post(url, {email:email})
 .done(function(msg,statusText,xhr){
    $("#forget-password-form").LoadingOverlay("hide");
    modal.modal('hide');
    $(emailInput).val('');
    Swal.fire({
        position: 'center',
        icon: 'success',
        title:'Success',
        text: msg.data.email,
        showConfirmButton: false,
        timer: 3000
      })
 })
 .fail(function(xhr,status,error){
    $("#forget-password-form").LoadingOverlay("hide");
    $(emailInput).val('');
    var msg = '';
    if(xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.email) {
        msg = xhr.responseJSON.data.email;
        form.find("#email").addClass("is-invalid");
        form.find("#email").next().text(msg);
    }
    else {
        msg = error;
        Swal.fire({
            position: 'center',
            icon: 'error',
            title:'Failed',
            text: msg,
            showConfirmButton: false,
            timer: 3000
          })
          modal.modal('hide');
    } 
 });
}

$('#forget-password-modal').on('hidden.bs.modal',function(e){
    $('#forget-password-modal #email').val('');
    $('#forget-password-modal #email').next().text("");
    $('#forget-password-modal #email').removeClass("is-invalid");
});