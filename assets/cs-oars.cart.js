/* Add to cart */

(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

var check_countdown = 0;

var GLOBAL = {
  common : {
    init: function(){
      $('html').removeClass('no-js').addClass('js');
      //searchPlaceholder();
      if($(window).innerWidth() > 767 ){
        
          $('.add-to-cart').bind( 'click', addToCart );
        
      }
      else { $('.add-to-cart').bind( 'click', directAddToCart ); }
      $('.cart-form .clearAllCart').bind( 'click', clearAllCart );
    }
  },
  templateIndex : { init: function(){ }  },
  templateProduct : { init: function(){ }  },
  templateCart : { init: function(){ }  }
}

var UTIL = {
  fire : function(func,funcname, args){
    var namespace = GLOBAL;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
      namespace[func][funcname](args);
    }
  },
  loadEvents : function(){
    var bodyId = document.body.id;
    // hit up common first.
    UTIL.fire('common');
    // do all the classes too.
    $.each(document.body.className.split(/\s+/),function(i,classnm){
      UTIL.fire(classnm);
      UTIL.fire(classnm,bodyId);
    });
  }

};
$(document).ready(UTIL.loadEvents);

/* Fly image to Cart */
function flyToCart(imgobj, cart, time){
  
  if(imgobj){
    var imgsrc = imgobj.attr('src');

    imgobj.animate_from_to(cart, {
      pixels_per_second: time, 
      initial_css: {
        'image': imgsrc
      },
      callback: function(){
      }
    });
  }
}

/* Popup notify add-to-cart */
function notifyProduct($info){
    $.jGrowl($info,{
      position:'center',
      life: 500000
    });	
}

function directAddToCart(){
  $(this).submit();
}

/* Ajaxy add-to-cart */
function addToCart(e){
  check_countdown = 0;
  $('#ajax-cart-modal').show();
  if (typeof e !== 'undefined') e.preventDefault();
  var $this = $(this);
  var form = $this.parents('form');
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    async: false,
    data: form.serialize(),
    dataType: 'json',
    error: addToCartFail,
    success: addToCartSuccess,
    cache: false
  });
  // Hide Modal
  $('.modal').modal('hide');
}

function clearAllCart(){
  if (confirm("Are you sure you want to clear all items in cart?") == true) {
    $.ajax({
      type: "POST",
      url: '/cart/clear.js',
      success: function(){
        location.reload(); 
      },
      dataType: 'json'
    });
  } else {
    
  }
}

function addToCartSuccess (jqXHR, textStatus, errorThrown){
  $.ajax({
    type: 'GET',
    url: '/cart.js',
    async: false,
    cache: false,
    dataType: 'json',
    success: updateCartDesc
  });
  Shopify.getCart(function(cart) {
    Shopify.updateCartInfo(cart, '.cart-info .cart-content');	
  });
  var $info = 'added to cart';
  var ai_image = '<a href="'+ jqXHR['url'] +'"><img src="'+ Shopify.resizeImage(jqXHR['image'], 'medium') +'" alt="'+ jqXHR['title'] +'"/></a>';
  var ai_name = '<a href="'+ jqXHR['url'] +'">'+ jqXHR['product_title'] + '</a>';
  var ai_price = '<span class="money">'+Shopify.formatMoney(jqXHR['price'], cart_money_format)+'</span>';  
  var ai_variant = ""; if(jqXHR['variant_title'] != null) ai_variant = 'Variant: '+jqXHR['variant_title'];
  var ai_qty = 'Qty: x'+$('.item-quantity').val();
  var ai_numpro = ""; if ($(".num-items-in-cart span.number").html() ==1) ai_numpro = "There is 1 item in your Shopping Bag."; else ai_numpro = "There are "+$(".num-items-in-cart span.number").html()+" items in your Shopping Bag.";
  //load data to Ajax Cart Modal
  $(".ajax-cart-note").removeClass("error");
  $(".ajax-cart-note").html($info);
  $('.ajax-cart-image').html(ai_image);
  $('.ajax-cart-product-title').html(ai_name);
  $('.ajax-cart-price').html(ai_price);
  $('.ajax-cart-variant').html(ai_variant); 
  $('.ajax-cart-qty').html(ai_qty);
  $('.ajax-cart-number-product').html(ai_numpro);
  $('.ajax-cart-loading').hide();
  $('.ajax-cart-box').show().addClass("fadeIn animated");
  countDown(10);
}

function addToCartFail(jqXHR, textStatus, errorThrown){
  var response = $.parseJSON(jqXHR.responseText);
  var $info = '<div class="error">Add to cart failure!<br/>Error: '+ response.description +'</div>';
  var ai_numpro = ""; if ($(".num-items-in-cart span.number").html() ==1) ai_numpro = "There is 1 item in your Shopping Bag."; else ai_numpro = "There are "+$(".num-items-in-cart span.number").html()+" items in your Shopping Bag.";
  $(".ajax-cart-note").addClass("error");
  $(".ajax-cart-note").html($info);
  $('.ajax-cart-image').html("");
  $('.ajax-cart-product-title').html("");
  $('.ajax-cart-price').html("");
  $('.ajax-cart-variant').html(""); 
  $('.ajax-cart-qty').html("");
  $('.ajax-cart-number-product').html(ai_numpro);
  $('.ajax-cart-loading').hide();
  $('.ajax-cart-box').show().addClass("fadeIn animated");
  countDown(10);
}

function searchPlaceholder(){

  if(!Modernizr.input.placeholder){
    $('#top-search-input').focus(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
      }
    }).blur(function() {
      var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
      }
    }).blur();
    $('[placeholder]').parents('form').submit(function() {
      $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
      })
    });
  }

}

function ajaxCartHide(){
  $("#ajax-cart-modal").addClass("zoomOut animated").fadeOut();
  $("#ajax-cart-modal").removeClass("zoomOut animated");
  check_countdown = 1;
}

/* Cart Get/Update Data */
Shopify.updateCartInfo = function(cart, cart_summary_id, cart_count_id) {
    if ((typeof cart_summary_id) === 'string') {
      var cart_summary = jQuery(cart_summary_id);
      if (cart_summary.length) {
        // Start from scratch.
        cart_summary.empty();
        // Pull it all out.
        
        jQuery.each(cart, function(key, value) {
          if (key === 'items') {
            
            if (value.length) {
              jQuery('<div class="items control-container"></div>').appendTo(cart_summary);
              var table = jQuery(cart_summary_id + ' div.items');
              jQuery.each(value, function(i, item) {
                jQuery('<div class="group_cart_item"><div class="cart-left"><a class="cart-image" href="' + item.url + '"><img src="' + Shopify.resizeImage(item.image, '250x_crop_center') + '" alt="" title=""/></a></div><div class="cart-right"><div class="cart-description"><div class="cart-title"><a href="' + item.url + '">' + item.title + '</a></div><div class="cart-qty"><span class="quantity">Qty: ' + item.quantity + '</span></div></div><div class="cart-price-close"><div class="cart-price"><span class="money">' + Shopify.formatMoney(item.price, cart_money_format) + '</span></div><a class="cart-close" title="Remove" href="javascript:void(0);" onclick="Shopify.removeItem(' + item.variant_id + ')"><span class="cs-icon icon-close"></span></a></div></div></div>').appendTo(table);
              });
              var ai_numpro = ""; if (value.length ==1) ai_numpro = "There is 1 item in your Shopping Bag."; else ai_numpro = "There are "+$(".num-items-in-cart span.number").html()+" items in your Shopping Bag.";
                       
                jQuery('<div class="subtotal-action"><div class="subtotal"><span class="title">Subtotal</span><span class="cart-total-right money">' + Shopify.formatMoney(cart.total_price, cart_money_format) + '</span></div><div class="action"><button class="_btn" onclick="window.location=\'/cart\'">View Cart</button><button class="_btn float-right" onclick="window.location=\'/checkout\'">Check Out</button></div></div>').appendTo(cart_summary);
            
            }
            else {
              jQuery('<div class="empty text-center"><em>Your shopping cart is empty. <a href="/collections/all" class="_btn">Continue Shopping</a></em></div>').appendTo(cart_summary);
            }
          }
        });
      }
    }
    // Update cart count.
    if ((typeof cart_count_id) === 'string') {
      if (cart.item_count == 0) { 
        jQuery('#' + cart_count_id).html('your cart is empty');
       
      }
      else if (cart.item_count == 1) {
        jQuery('#' + cart_count_id).html('1 item in your cart');
      }
        else {
          jQuery('#' + cart_count_id).html(cart.item_count + ' item(s) in the shopping cart');
        }
    }
    wishlist_init();                                       
    wishlist_add();
    /* Update cart info */
    updateCartDesc(cart);
  };
  
  function updateCartDesc(data){
    var $cartLinkText = $('.num-items-in-cart .number');
    //var $cartPrice = '<span class="total"> - '+ Shopify.formatMoney(data.total_price, cart_money_format) +'</span>';
    switch(data.item_count){
      case 0:
        $cartLinkText.html('0');
        break;
      case 1:
        $cartLinkText.html('1');                
        break;
      default:
        $cartLinkText.html(data.item_count);
        break;
    }
    $('.ajax-cart-subtotal').html("<span class='money'>"+Shopify.formatMoney(data.total_price, cart_money_format)+"</span>");
    
    $('.price_text').html("<span class='money'>"+Shopify.formatMoney(data.total_price, cart_money_format)+"</span>");
    
  }
  
  Shopify.onCartUpdate = function(cart) {
    Shopify.updateCartInfo(cart, '.cart-info .cart-content', 'shopping-cart');
  };
     
            
  $(window).load(function() {
    // Let's get the cart and show what's in it in the cart box.	
    Shopify.getCart(function(cart) {      
      Shopify.updateCartInfo(cart, '.cart-info .cart-content');		
    });
  });
    
  function countDown(count) {
    if (count > 0) {
       if(count > 1) $(".countDiv").html("This popup will auto close after <span>"+count+"</span> seconds"); else $(".countDiv").html("This popup will auto close after <span>"+count+"</span> second");
      if(check_countdown == 1){
        setTimeout (function() { countDown(0); }, 0);
      }
      else{
        setTimeout (function() { countDown(count-1); }, 1000);
      }
    }
    else
       ajaxCartHide();
  }