var materialFullscreenIframe = function(id){
    var that = {};


	that.defaultSettings = function(settings){ 
		settings.contentAnimationShowName = settings.contentAnimationShowName || "fadeInDownCenter";
		settings.contentAnimationHideName = settings.contentAnimationHideName || "fadeOutUpCenter";
		settings.overlayAnimationShowName = settings.overlayAnimationShowName || "zoomIn";
		settings.overlayAnimationHideName = settings.overlayAnimationHideName || "zoomOut";

		return settings; 
	}
	
    /**
     * Create html and add event handling
     * @param string id
     * @param object settings
     */
    that.show = function(id, settings){
        /* Default settings */
        settings = that.defaultSettings(settings); 

        return materialComponent.show(id, settings);
    };
	
	 
	 /**
     * Create simple question message
     * @param string title
     * @param message message
	 * @param object settings
	 * @sample-usage:
			 materialDialog.question("Title of the dialog", "Message body",{
				  "buttonNo":{
					caption: "Not, yet",
					href:"https://gooogle.com",
					additional: "target='_blank'"
						
				   },
			|	  "buttonYes":{
					caption: "Yes, thanks!",
					href:"javascript: alert('An alert from js')",
					additional: "data-value='close'"
				  }
			}) 
     */
	that.iframe = function(url, settings){
		 if(typeof settings === "undefined"){settings = {};}
		
		 settings = that.defaultSettings(settings); 
	
		 var dialog = $(` 
				<div id="materialFullScreenIframe" class="materialFullScreenIframe"><iframe src="${url}" style="width: 100%; height: 100%; position: fixed; top: 0; bottom:0; right:0; left: 0; border: 0;"></iframe></div>
	`).appendTo('body'); 
		
		that.show("materialFullScreenIframe", settings);
		dialog.remove();
	}
  
	 /**
     * Create alert for no internet connection, refresh page after clicking on ok.
     * @param string title
     * @param message message
	 * @param object settings
     */
	that.alertNoInternetConnection = function(){
		var title = "Oops!";
		var description =  "Your internet connection is not working. Please check your internet connection and click on 'OK' to refresh the page.";
		materialDialog.alert(title, 
			description,
			{
				hideCallback: function(){
					location.reload();
				}
			}
		);
	}

    /**
     * Hide content
     */
    that.hide = function(item){
        materialComponent.hide(item);
    };

    var expose = {};
	expose.defaultSettings = that.defaultSettings;
    expose.show = that.show;
    expose.hide = that.hide;

    return expose;
}();
