var userId = $("#instafeed").data("userId");
var accessToken = $("#instafeed").data("accessToken");
var limit = $("#instafeed").data("limit");
if( userId != undefined ){
  var userFeed = new Instafeed({
      get: 'user',
      userId: userId,
      accessToken: accessToken,
      limit: limit,
      resolution: 'standard_resolution',
      template: '<a href="{{link}}" target="_blank" class="insta_item"><div class="insta_overlay"><ul><li><span class="icon-small icon-small-heart"></span> {{likes}}</li><li><span class="icon-small icon-small-commenting"></span> {{comments}}</li></ul></div><img src="{{image}}"></a>'
  });

  userFeed.run();
}

$(window).load(function(e) {
    insta_slider();
});
$(window).resize(function(e) {
    insta_slider();
});

function insta_slider() {
    $('.instafeed_small .insta_item').css('height', $('.instafeed_small .insta_item').width());
}