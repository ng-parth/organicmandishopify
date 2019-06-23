$(document).ready(function(){
 $('#farmer-carousel').owlnewCarousel({
      stagePadding: 40,
      loop: true,
      margin: 20,
      nav: true,
      dots: false,
   	lazyload: true,
  
      responsive:{
        0:{
          items:1
        },
        800:{
          items:2
        },
        1000:{
          items:3
        }
      }
    });

});



