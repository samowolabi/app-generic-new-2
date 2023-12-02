var materialLoadingSplashScreen = (function() {
      
    var that = {};
	that.created = false;
	
    var getHtml = function(){  
     var html = '<div class="loadingSplashScreenContainer">' +
        '<div>' +
        '<img src="https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-global/img/logo-transparent-BG.png" alt="">' +
        '</div>' +
        '</div>';

      return html; 
   }
   
   
   var create = function() {
        try {
            if (!that.created) {
                var html = getHtml();
                $('<div id="loadingSplashScreenContainerWrapper">' + html + '</div>').appendTo('body');
                that.created = true; // Set the flag to true after creation
            }
        } catch (error) {
            console.error("An error occurred while creating the loader:", error);
        }
    };
   

    var show = function() {
        if(!that.created){
			create();
		}
		
		try {
            $('body').css('overflow', 'hidden');
            $('.loadingSplashScreenContainer').addClass('active');
        } catch (error) {
            console.error("An error occurred while showing the loader: ", error);
        }
    };

    var hide= function() {
        if(that.created){
			try {
				$('body').css('overflow', ''); // Removes the overflow property
				$('.loadingSplashScreenContainer').removeClass('active');
			} catch (error) {
				console.error("An error occurred while hiding the loader: ", error);
			}
		}
    };
	
	that.hide = hide;
	that.show = show;
    return that;
})();

// Usage
//materialLoadingSplashScreen.show(); // To show the loader
//materialLoadingSplashScreen.hide(); // To hide the loader
