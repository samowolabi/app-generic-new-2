var materialDialog = function(id){
    var that = {};

	
	that.defaultSettings = function(settings){ 
		settings.contentAnimationShowName = settings.contentAnimationShowName || "fadeInDownCenter";
		settings.contentAnimationHideName = settings.contentAnimationHideName || "fadeOutUpCenter";
		settings.overlayAnimationShowName = settings.overlayAnimationShowName || "zoomIn";
		settings.overlayAnimationHideName = settings.overlayAnimationHideName || "zoomOut";
		settings.componentType = settings.componentType || "dialog";
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
     * Create custom dialog with html
     * @param string id
     * @param object settings
     */
    that.custom = function(html, settings){
        that.__customId = that.__customId || 0;
		that.__customId++;
		
		material.history.clear();	 
		$('<div id="showCustomDialog'+ that.__customId +'" class="materialDialog" style="padding: 0;" data-on-init-callback="materialDialog.__customInitFx(thisComponent)"></div>').appendTo('body');
		materialDialog.__customInitFx = function(thisComponent) {
			thisComponent.html(html);	
		};
		
		var originalCallback = settings.hideCallback || function(){};
		
		settings.hideCallback = function(){ 
			material.history.clear(); 
			originalCallback();
		};
		
		materialDialog.show('showCustomDialog'+ that.__customId, settings); 
    };
	
	
	 /**
     * Create simple alert message
     * @param string title
     * @param message message
	 * @param object settings
     */
	that.alert = function(title, message, settings){
		 if(typeof settings === "undefined"){settings = {};}
		
		 settings = that.defaultSettings(settings); 
		 settings.buttonCaption = settings.buttonCaption || "OK";
		 settings.theme  = settings.theme || "materialButtonFill";
		 settings.buttonAligment = settings.buttonAligment || "flex-end"; 
		 settings.href = settings.href || "javascript: void(0);";
		 settings.additional = settings.additional || "";
		
		 var titleHtml = title ?  `<h3>${title}</h3>` : "";
		 var dialog = $(` 
				<div id="materialDialogAlert" class="materialDialog">
				    ${titleHtml}
				    <div class="materialDialogContent">
						<h4>${message}</h4>
				    </div> 
					<div class="materialDialogAction" style="justify-content: ${settings.buttonAligment}">
						<a class="${settings.theme}" ${settings.additional} href="${settings.href}" data-value="OK">${settings.buttonCaption}</a>
					</div> 
				</div>`).appendTo('body'); 
		
		that.show("materialDialogAlert", settings);
		dialog.remove();
	}
	
	
	 /**
     * Show a wait message on screen. Coded in singleton form
     * @param string title 
	 * @param object settings
     */
	that.waitStart = function(title = "Please wait...", settings){
		if(!materialDialog.__currentWaitDialog){
			if(typeof title === "undefined"){title = "Please wait...";}
			if(typeof settings === "undefined"){settings = {};}
			    
			settings = that.defaultSettings(settings); 
			settings.modal = true;
			settings.contentAnimationShowName = "fadeIn";
			settings.contentAnimationHideName = "fadeOut";
			settings.overlayAnimationShowName = "fadeIn";
			settings.overlayAnimationHideName = "fadeOut";
  
			 
			 var dialog = $(` 
					<div id="materialDialogAlert" class="materialDialog">
						<h3><i class="fa fa-cog fa-spin fa-fw" style="vertical-align: baseline;"></i> ${title}</h3>
					</div>`).appendTo('body'); 
			
			materialDialog.__currentWaitDialog = that.show("materialDialogAlert", settings);
			dialog.remove();
		} 
	}
	
	 /**
     * Hide wait message
	 * @param object settings
     */
	that.waitEnd = function(){
		if(materialDialog.__currentWaitDialog){
			materialDialog.hide(materialDialog.__currentWaitDialog);
			materialDialog.__currentWaitDialog = false;
		}
	}
	
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
	that.question = function(title, message, settings){
		 if(typeof settings === "undefined"){settings = {};}
		
		 settings = that.defaultSettings(settings); 
		 
		 settings.buttonNo  = settings.buttonNo || {};
		 settings.buttonYes = settings.buttonYes || {};
		 
		 settings.buttonNo.caption  = settings.buttonNo.caption || "NO";
		 settings.buttonYes.caption = settings.buttonYes.caption || "YES";
		 
		 settings.buttonNo.value  = settings.buttonNo.value || "no";
		 settings.buttonYes.value = settings.buttonYes.value || "yes";
		 
		 settings.buttonNo.href  = settings.buttonNo.href || "javascript: void(0);";
	     settings.buttonYes.href = settings.buttonYes.href || "javascript: void(0);";
		 
		 settings.buttonNo.additional  = settings.buttonNo.additional || "";
	     settings.buttonYes.additional = settings.buttonYes.additional || "";
		 
		 settings.buttonNo.theme  = settings.buttonNo.theme || "materialButtonOutline";
	     settings.buttonYes.theme = settings.buttonYes.theme || "materialButtonFill";
		  
		 settings.hideCallback = settings.hideCallback || function(value){ console.log("Question result: ", value);};
		
		 
		 var dialog = $(` 
				<div id="materialDialogQuestion" class="materialDialog">
				    <h3>${title}</h3>
				    <div class="materialDialogContent">
						<h4>${message}</h4>
				    </div>  
					<div class="materialDialogAction">
						<a class="${settings.buttonNo.theme}"  data-value='${settings.buttonNo.value}'  ${settings.buttonNo.additional}  href="${settings.buttonNo.href}">${settings.buttonNo.caption}</a> 
						<a class="${settings.buttonYes.theme}" data-value='${settings.buttonYes.value}' ${settings.buttonYes.additional} href="${settings.buttonYes.href}">${settings.buttonYes.caption}</a>
					</div> 
				</div>`).appendTo('body'); 
		
		that.show("materialDialogQuestion", settings);
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

	that.iframe = function(url, settings){
		 if(typeof settings === "undefined"){settings = {};}
		
		 settings = that.defaultSettings(settings); 
		 settings.hideCallback = settings.hideCallback || function(){ $("body").removeClass("materialIframeFullScreen");};
		 settings.componentType = "iframe";
		 settings.contentAnimationShowName = "fadeIn";
		 settings.contentAnimationHideName = "fadeOutUpCenter";
		
		 var dialog = $(` 
				<div id="materialFullScreenIframe" class="materialFullScreenIframe">
					<iframe src="${url}"></iframe>
				</div>
	`).appendTo('body'); 
	
		$("body").addClass("materialIframeFullScreen");
		
		that.show("materialFullScreenIframe", settings);
		dialog.remove();
	}
    /**
     * Hide content
     */
    that.hide = function(item){
        materialComponent.hide(item); 
    };
	
	 
	that.areDialogsOpen = function(){ 
		//TODO: distinguish between dialogs and other components
		return materialComponent.areComponentsOpen("dialog");
	};


  
		
    var expose = {};
	expose.defaultSettings = that.defaultSettings;
	expose.custom = that.custom;
    expose.show = that.show;
    expose.hide = that.hide;
	expose.alert = that.alert;
	expose.waitStart = that.waitStart;
	expose.waitEnd = that.waitEnd;
	expose.question = that.question;
	expose.alertNoInternetConnection = that.alertNoInternetConnection;
	expose.iframe = that.iframe;
	expose.hideAll = that.hideAll;
	expose.areDialogsOpen = that.areDialogsOpen;

    return expose;
}();
