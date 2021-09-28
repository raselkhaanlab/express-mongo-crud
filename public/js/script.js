"use strict";
var addBtn = $('#product-save-btn');
var updateBtn = $('#product-update-btn');
var baseUrl = 'http://localhost:5000/api/v1.0/';
var productName = $("#productName");
var productUnitPrice= $("#productUnitPrice");
var totalProduct=$("#totalProduct");
var productTable = $('#productTable');
var refreshBtn = $('#refresh');

//refresh data on dom

refreshBtn.click(function(e){
    getProductAndAddtoTable();
});

//add product button click;
addBtn.click(addProductHandler);
updateBtn.click(function(e){
    let id = $('#update-product-form').data('id');
    let formdata = $('#update-product-form').serializeArray();
    let formattedData = {};
    formdata.forEach(function(item){
        formattedData[item.name] = item.value;
    });
    var url = baseUrl +'products/'+id;
    $("#update-product-modal").modal('show');
    $.ajax({
        url: url,
        type: 'PUT',
        data:formattedData,
        success: function(msg,statusText,xhr) {
            $("#update-product-modal").modal('hide');
            getProductAndAddtoTable();
            $("#update-product-modal").modal('hide');
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your work has been updated',
                showConfirmButton: false,
                timer: 2500
              });
        },
        error:function(xhr,text,err) {
            $("#update-product-modal").modal('hide');
            if(xhr.status && xhr.status==400) {
                let res = xhr.responseJSON;
                if(res) {
                    let err = res.errors;
                    if(err.product_name) {
                        $("#productName-update").addClass("is-invalid");
                        $("#productName-update").next().text(err.product_name);
                    }
                    else {
                        $("#productName-update").removeClass("is-invalid");
                        $("#productName-update").next().text('');
                    }
                    if(err.unit_price) {
                        $('#productUnitPrice-update').addClass("is-invalid");
                        $('#productUnitPrice-update').next().text(err.unit_price);
                    }
                    else {
                        $('#productUnitPrice-update').removeClass("is-invalid");
                        $('#productUnitPrice-update').next().text('');
                    }
                    if(err.total_product) {
                        $('#totalProduct-update').addClass("is-invalid");
                        $('#totalProduct-update').next().text(err.total_product);
                    }
                    else {
                        $('#totalProduct-update').addClass("is-invalid");
                        $('#totalProduct-update').next().text('');
                    }
                }
            }
            else {
                $("#update-product-modal").modal('hide');
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'update fail',
                    showConfirmButton: false,
                    timer: 2500
                  });
            }
        }
    });

});
function addProductHandler(e) {
    // $("#add-product-modal").modal('hide');

    let formdata = $('#add-product-form').serializeArray();
    let formattedData = {};
    formdata.forEach(function(item){
        formattedData[item.name] = item.value;
    });
    var url = baseUrl + 'products';
    $("#add-product-form").LoadingOverlay("show");
    $.post(url, formattedData)
    .done(function(msg,statusText,xhr){ 
        $("#add-product-form").LoadingOverlay("hide"); 
        if(msg && msg.data) {

            productName.val("");
            productName.removeClass("is-invalid");
            productName.next().text('');

            productUnitPrice.val("");
            productUnitPrice.removeClass("is-invalid");
            productUnitPrice.next().text('');

            totalProduct.val("");
            totalProduct.removeClass("is-invalid");
            totalProduct.next().text('');
            getProductAndAddtoTable();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 2500
              });
            $("#add-product-modal").modal('hide');
        }
    })
    .fail(function(xhr, status, error) {
        $("#add-product-form").LoadingOverlay("hide");
        if(xhr.status && xhr.status==400) {
            let res = xhr.responseJSON;
            if(res) {
                let err = res.errors;
                if(err.product_name) {
                    productName.addClass("is-invalid");
                    productName.next().text(err.product_name);
                }
                else {
                    productName.removeClass("is-invalid");
                    productName.next().text('');
                }
                if(err.unit_price) {
                    productUnitPrice.addClass("is-invalid");
                    productUnitPrice.next().text(err.unit_price);
                }
                else {
                    productUnitPrice.removeClass("is-invalid");
                    productUnitPrice.next().text('');
                }
                if(err.total_product) {
                    totalProduct.addClass("is-invalid");
                    totalProduct.next().text(err.total_product);
                }
                else {
                    totalProduct.removeClass("is-invalid");
                    totalProduct.next().text('');
                }
            }
        }
        else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'save unsuccessful',
                showConfirmButton: false,
                timer: 2500
              })
        }
    });


}

function getProductAndAddtoTable() {
    var url = baseUrl + "products";
    $("#product-table").LoadingOverlay("show");
    $.get(url)
    .done(function(msg,statusText,xhr){
        $("#product-table").LoadingOverlay("hide");
        if(msg && msg.data) {
            var data = msg.data;
            var tbody = $("#tbody");
            var tr ='';
            data.forEach(function(item,index){
                 tr += '<tr><td>'+ (index+1) +'</td><td>'+item.product_name +'</td><td>'+ item.unit_price +'</td><td>'+ item.total_product +'</td><td><button class="btn btn-success m-2 p-2 update" type="button" data-id='+ item._id +' >update</button><button class="btn btn-danger delete" data-id='+ item._id+'>delete</button></td> </tr>';
            });
            $(tbody).html(tr);
        }
    })
    .fail(function(xhr,status,error){
        $("#product-table").LoadingOverlay("hide");
        console.log(error);
    });
}

//delete product
$(document).on('click','.delete',function(e){
    let id = $(e.target).data('id');
    var url = baseUrl + "products/"+id;
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            $("#product-table").LoadingOverlay("show");
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(msg,statusText,xhr) {
                    $("#product-table").LoadingOverlay("hide");
                    getProductAndAddtoTable();
                    swalWithBootstrapButtons.fire(
                        'Deleted!',
                        'Your document has been deleted.',
                        'success'
                    );
                },
                error:function(xhr,text,err) {
                    $("#product-table").LoadingOverlay("hide");
                    swalWithBootstrapButtons.fire(
                        'sorry!',
                        'delete fail',
                        'error'
                      )
                }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'you docuemt is not deleted :)',
            'error'
          )
        }
      });
});

//update

$(document).on('click','.update',function(e){
    $()
    let id = $(e.target).data('id');
    var url = baseUrl + "products/"+id;
    $("#update-product-modal").modal('show');
    $("#update-product-modal").LoadingOverlay("hide");
    $.get(url)
    .done(function(msg,statusText,xhr){
        $("#update-product-modal").LoadingOverlay("hide");
        if(msg && msg.data) {
            $("#display-product-id").text("#"+msg.data._id);
            $('#productName-update').val(msg.data.product_name);
            $('#productUnitPrice-update').val(msg.data.unit_price);
            $('#totalProduct-update').val(msg.data.total_product);
            $('#update-product-form').data('id',msg.data._id);
            console.log($('#update-product-form').data());
        }
    })
    .fail(function(xhr,status,error){
        $("#add-product-form").LoadingOverlay("hide");
        $("#update-product-modal").modal('hide');
        $.notify('something went wrong');
    });
});

$(document).ready(function(){
    getProductAndAddtoTable();
})