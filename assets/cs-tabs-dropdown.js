$(function() {
  $(".home-productTab-content").each(function() {
    var resizeTimeout   = 20;
    var $this = $(this);
    var dropdownList = $(this).find(".tabs-to-dropdown .tabs-dropdown .nav-tabs");
    var tabListItem = $(this).find(".tabs-to-dropdown .sub-tabs");
    tabListItem.clone().appendTo(dropdownList);
    var tabsToDropdown  = function() {
      
      var tamp = $this.find(".tabs-to-dropdown .sub-tabs:first-child").position().top;
      
      tabListItem.each(function(index) {
        
        var dropdownListItem  = dropdownList.children("li").eq(index);
        $(this).removeClass("tab-hide"); 
        var tabListItemOffset = $(this).position().top;
        if(tabListItemOffset <= tamp){
          $(this).removeClass("tab-hide"); 
          dropdownListItem.removeClass("tab-show");
          if(!$this.find('.tabs-dropdown .sub-tabs').hasClass('tab-show')){
            $this.find('.tabs-dropdown').removeClass('active_dropdown');
          }
        }
        else{
          $this.find('.tabs-dropdown').addClass('active_dropdown');
          $(this).addClass("tab-hide"); 
          dropdownListItem.addClass("tab-show");
        }
        
      });
    }
    var clickTabsActive = function(){
      $this.find('.sub-tabs').on('click', function() {
      	$this.find('.sub-tabs').removeClass('active');
        $this.find('.tab-pane').removeClass('active');
        $(this).addClass('active');
        var idTab = $(this).find('a').attr('href');
        $(idTab).addClass('active');
      });
    }
    tabsToDropdown();
    clickTabsActive();
    $(window).bind("resize", function(){
      tabsToDropdown();
    });
  }); 
});