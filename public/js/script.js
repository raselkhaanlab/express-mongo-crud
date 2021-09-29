"use strict";
var addBtn = $('#product-save-btn');
var updateBtn = $('#product-update-btn');
var baseUrl = 'http://localhost:5000/api/v1.0/';
var productName = $("#productName");
var productUnitPrice= $("#productUnitPrice");
var totalProduct=$("#totalProduct");
var productTable = $('#productTable');
var refreshBtn = $('#refresh');

// loading overlay options
var options = {
    image:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="margin-right:-2px;display:block;background-repeat-y:initial;background-repeat-x:initial;animation-play-state:paused" ><g transform="translate(50 50)" style="transform:matrix(1, 0, 0, 1, 50, 50);animation-play-state:paused" ><g transform="matrix(1,0,0,1,0,0)" style="transform:matrix(1, 0, 0, 1, 0, 0);animation-play-state:paused" ><path d="M29.491524206117255 -5.5 L37.491524206117255 -5.5 L37.491524206117255 5.5 L29.491524206117255 5.5 A30 30 0 0 1 26.12715009048092 14.743541913308446 L26.12715009048092 14.743541913308446 L32.25550563543275 19.885842790800762 L25.18484192888081 28.312331665109514 L19.056486383928988 23.1700307876172 A30 30 0 0 1 10.537592076579571 28.08841670916336 L10.537592076579571 28.08841670916336 L11.926777497915015 35.96687873326103 L1.0938922147807286 37.87700868759726 L-0.2952932065547146 29.998546663499596 A30 30 0 0 1 -9.98262238224421 28.290409158821245 L-9.98262238224421 28.290409158821245 L-13.98262238224421 35.218612389096755 L-23.50890182387304 29.71861238909675 L-19.50890182387304 22.79040915882124 A30 30 0 0 1 -25.831856883926196 15.255004750191159 L-25.831856883926196 15.255004750191159 L-33.349397850213464 17.99116589679651 L-37.111619426795826 7.654547068151507 L-29.59407846050856 4.918385921546156 A30 30 0 0 1 -29.59407846050856 -4.9183859215461485 L-29.59407846050856 -4.9183859215461485 L-37.111619426795826 -7.654547068151498 L-33.349397850213464 -17.991165896796502 L-25.8318568839262 -15.255004750191151 A30 30 0 0 1 -19.508901823873053 -22.79040915882123 L-19.508901823873053 -22.79040915882123 L-23.508901823873057 -29.718612389096737 L-13.982622382244227 -35.21861238909675 L-9.982622382244223 -28.29040915882124 A30 30 0 0 1 -0.29529320655473523 -29.998546663499596 L-0.29529320655473523 -29.998546663499596 L1.0938922147807042 -37.87700868759726 L11.926777497915003 -35.96687873326103 L10.537592076579564 -28.08841670916336 A30 30 0 0 1 19.056486383928977 -23.170030787617215 L19.056486383928977 -23.170030787617215 L25.1848419288808 -28.312331665109532 L32.25550563543274 -19.885842790800766 L26.127150090480917 -14.743541913308448 A30 30 0 0 1 29.491524206117255 -5.500000000000013 M0 -20A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20" fill="#3eb781" style="animation-play-state:paused" ></path></g></g><!-- generated by https://loading.io/ --></svg>',
    imageColor:'green',
    background:'rgba(128,128,128,0.1)'
};
$.LoadingOverlaySetup(options)


//refresh data on dom

refreshBtn.click(function(e){
    getProductAndAddtoTable();
});


//clean up on modal hide

$("#update-product-modal").on('hidden.bs.modal',function(e){
    $("#productName-update").val("");
    $("#productName-update").next().text("");
    $("#productName-update").removeClass("is-invalid");

    $("#productUnitPrice-update").val("");
    $("#productUnitPrice-update").next().text("");
    $("#productUnitPrice-update").removeClass("is-invalid");

    $("#totalProduct-update").val("");
    $("#totalProduct-update").next().text("");
    $("#totalProduct-update").removeClass("is-invalid");
});

$("#add-product-modal").on('hidden.bs.modal',function(){
    $("#productName").val("");
    $("#productName").next().text("");
    $("#productName").removeClass("is-invalid");

    $("#productUnitPrice").val("");
    $("#productUnitPrice").next().text("");
    $("#productUnitPrice").removeClass("is-invalid");

    $("#totalProduct").val("");
    $("#totalProduct").next().text("");
    $("#totalProduct").removeClass("is-invalid");
});

//add product button click;
addBtn.click(addProductHandler);

//update product
updateBtn.click(function(e){
    let id = $('#update-product-form').data('id');
    let formdata = $('#update-product-form').serializeArray();
    let formattedData = {};
    formdata.forEach(function(item){
        formattedData[item.name] = item.value;
    });
    var url = baseUrl +'products/'+id;
    $("#update-product-modal").modal('show');
    $("#product-table").LoadingOverlay('show');
    $.ajax({
        url: url,
        type: 'PUT',
        data:formattedData,
        success: function(msg,statusText,xhr) {
            $("#product-table").LoadingOverlay('hide');
            $("#update-product-modal").modal('hide');
            getProductAndAddtoTable();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title:'Updated',
                text: 'Your work has been updated',
                showConfirmButton: false,
                timer: 2500
              });
        },
        error:function(xhr,text,err) {
            $("#product-table").LoadingOverlay('hide');
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
                        $('#totalProduct-update').removeClass("is-invalid");
                        $('#totalProduct-update').next().text('');
                    }
                }
            }
            else {
                $("#update-product-modal").modal('hide');
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title:'Update Failed',
                    text: 'data update failed',
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
            getProductAndAddtoTable();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Saved',
                text:'Your work has been saved successfuly',
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
                title:'Save Failed',
                text: 'save unsuccessful',
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
            if(data && data.length <1){
                tr='<td colspan="5" class="text-center"> No data found,list is empty.</td>';
                $(tbody).html(tr);
            }
            
            data.forEach(function(item,index){
                 tr += '<tr><td>'+ (index+1) +'</td><td>'+item.product_name +'</td><td>'+ item.unit_price +'</td><td>'+ item.total_product +'</td><td>'+ (item.status ==true?"Active":"Inactive") +'</td><td><button class="btn btn-success m-2 p-2 update" type="button" data-id='+ item._id +' >update</button><button class="btn btn-danger delete" data-id='+ item._id+'>delete</button></td> </tr>';
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
          cancelButton: 'btn btn-danger mr-2'
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
                        {
                            position: 'center',
                            title:'Deleted',
                            icon: 'success',
                            text: 'you docuemt has been deleted',
                            showConfirmButton: false,
                            timer: 2500
                          }
                      )
                },
                error:function(xhr,text,err) {
                    $("#product-table").LoadingOverlay("hide");
                    swalWithBootstrapButtons.fire(
                        {
                            position: 'center',
                            title:'Delete Failed',
                            icon: 'error',
                            text: 'document deletation goes wrong',
                            showConfirmButton: false,
                            timer: 2500
                          }
                      )
                }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            {
                position: 'center',
                title:'Delete Canceled',
                icon: 'error',
                text: 'you docuemt is not deleted :)',
                showConfirmButton: false,
                timer: 1500
              }
          )
          
        }
      });
});

//update modal open
$(document).on('click','.update',function(e){
    $()
    let id = $(e.target).data('id');
    var url = baseUrl + "products/"+id;
    $("#update-product-modal").modal('show');
    $("#update-product-modal").LoadingOverlay("show");
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

//load data on page load
$(document).ready(function(){
    getProductAndAddtoTable();
})