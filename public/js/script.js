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
    $.ajax({
        url: url,
        type: 'PUT',
        data:formattedData,
        success: function(msg,statusText,xhr) {
            getProductAndAddtoTable();
            $("#update-product-modal").modal('hide');
            $.notify('item update successfully','success')
        },
        error:function(xhr,text,err) {
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
                $.notify('product update fail');
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
    var url = baseUrl + 'products'
    $.post(url, formattedData)
    .done(function(msg,statusText,xhr){  
        if(msg && msg.data) {

            productName.value = "";
            productName.removeClass("is-invalid");
            productName.next().text('');

            productUnitPrice.value ="";
            productUnitPrice.removeClass("is-invalid");
            productUnitPrice.next().text('');

            totalProduct.value=""
            totalProduct.removeClass("is-invalid");
            totalProduct.next().text('');

            $("#add-product-modal").modal('hide');
            getProductAndAddtoTable();
            $.notify('save successfully','success');
        }
    })
    .fail(function(xhr, status, error) {
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
                    totalProduct.addClass("is-invalid");
                    totalProduct.next().text('');
                }
            }
        }
    });

}

function getProductAndAddtoTable() {
    var url = baseUrl + "products";

    $.get(url)
    .done(function(msg,statusText,xhr){
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
        console.log(error);
    });
}

//delete product
$(document).on('click','.delete',function(e){
    let id = $(e.target).data('id');
    var url = baseUrl + "products/"+id;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(msg,statusText,xhr) {
            console.log(msg,statusText,xhr);
            getProductAndAddtoTable();
            $.notify('item delete successfully','success')
        },
        error:function(xhr,text,err) {
            console.log(xhr,text,err);
            $.notify('product delete fail');
        }
    });
});

//update

$(document).on('click','.update',function(e){
    $()
    let id = $(e.target).data('id');
    var url = baseUrl + "products/"+id;
    $("#update-product-modal").modal('show');

    $.get(url)
    .done(function(msg,statusText,xhr){
        if(msg && msg.data) {
            $('#productName-update').val(msg.data.product_name);
            $('#productUnitPrice-update').val(msg.data.unit_price);
            $('#totalProduct-update').val(msg.data.total_product);
            $('#update-product-form').data('id',msg.data._id);
            console.log($('#update-product-form').data())
        }
    })
    .fail(function(xhr,status,error){
        $("#update-product-modal").modal('show');
        $.notify('something went wrong');
    });
});

$(document).ready(function(){
    getProductAndAddtoTable();
})