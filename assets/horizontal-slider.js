$(document).ready(function(){
 $('#farmer-carousel').owlCarousel({
      stagePadding: 30,
      loop: true,
      margin: 10,
      nav: true,
      dots: false,
      lazyload: true,
      responsive:{
        0:{
          items:1
        },
        600:{
          items:2
        },
        1000:{
          items:3
        }
      }
    });

  var owl = $('.owl-carousel');
    owl.owlCarousel({
      stagePadding: 80,
      loop: false,
      margin: 10,
      nav: true,
      dots: false,
      lazyload: true,
      responsive:{
        0:{
          items:1
        },
        600:{
          items:3
        },
        1200:{
          items:4
        }
      }
    });
  
    
});



