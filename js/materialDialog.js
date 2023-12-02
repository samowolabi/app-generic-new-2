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
		
		var customId = 'showCustomDialog'+ that.__customId;
		  
		$('<div id="'+ customId +'" class="materialDialog" style="padding: 0;"></div>').appendTo('body');
	  
		var originalHideCallback = settings.hideCallback || function(){};
		var originalInitCallback = settings.initCallback || function(){};
		
		// By default we clear history
		var clearHistory = (typeof settings.clearHistory !== 'undefined') ? settings.clearHistory : true;
		
		settings.hideCallback = function(thisComponent){ 
			if(settings.clearHistory){ material.history.clear();} 
			originalHideCallback(thisComponent);
		};
		
		settings.initCallback = function(thisComponent){  
			thisComponent.html(html);	
			originalInitCallback(thisComponent);
		};
		
		materialDialog.show(customId, settings); 
		$('#' + customId).remove();
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
     * Create simple error message for handling edge cases
     * @param string title
     * @param message message
	 * @param object settings
     */
	that.error = function(errorDescription, errorCode, exception = false, refreshPage = false, hideCallback = false) {
		var title = "Oops! Something went wrong...";
		var message;
		
		try { 

			try {
				if (exception && 'message' in exception) {  
					errorDescription = errorDescription ? `${errorDescription}. ${exception.message}` : exception.message;
					console.error(exception);
				}
			} catch (err) {
				if (typeof errorDescription === 'string') {
					errorDescription += ". Exception could not be read";
				} else {
					errorDescription = "Exception could not be read";
				}
			}

			if(errorDescription){
				message = `An error has occurred. Please try again in a few minutes. If the issue persists, contact <a href='mailto:support@pianoencyclopedia.com'>support@pianoencyclopedia.com</a> and provide the error code: '${errorCode}' and message: '${errorDescription}'.`;
			}else{
				message = `An error has occurred. Please try again in a few minutes. If the issue persists, contact <a href='mailto:support@pianoencyclopedia.com'>support@pianoencyclopedia.com</a> and provide the error code: '${errorCode}'.`;
			}
			
			materialDialog.alert(title, message, {
				hideCallback: function() {
					if(typeof hideCallback === "function"){ hideCallback(); }
					if (refreshPage) {location.reload();}
				}
			});
			
		} catch (err) {
			console.error(err);
			
			message = `An critical error has occurred. Please try again in a few minutes. If the issue persists, contact <a href='mailto:support@pianoencyclopedia.com'>support@pianoencyclopedia.com</a> and provide us the steps to reproduce this error, including your system information.`;
			materialDialog.alert(title, message, {
				hideCallback: function() {
					if(typeof hideCallback === "function"){ hideCallback(); }
					if (refreshPage) {location.reload();}
				}
			});
		}
	};

	
	
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
  
	 
	that.iframe = function(input, settings) {
		var inputIsHtml = false;
		return that.__iframeHtmlOrUrl(input, settings, inputIsHtml);
	}
	
	that.iframeHtml = function(input, settings) {
		var inputIsHtml = true;
		return that.__iframeHtmlOrUrl(input, settings, inputIsHtml);
	}
	
	/**
	 * Loads an iframe with html and displays it in a full-screen dialog.
	 * @param {string} input: url/ html  - The url/ html to be loaded in the iframe.
	 * @param {object} [settings={}] - Optional settings for iframe and dialog behavior. Properties include: 
	 *     @property {string} contentAnimationShowName - Animation class for showing the iframe; default is 'fadeIn'.
	 *     @property {string} contentAnimationHideName - Animation class for hiding the iframe; default is 'fadeOutUpCenter'.
	 *     @property {boolean} useLoadingSplashScreen - Whether to use a splash screen while loading the iframe; default is false.
	 *     @property {number} timeOut - Time in seconds before hiding the splash screen if iframe hasn't loaded; default is 0 (no timeout).
	 *     @property {function} hideCallback - Callback function to execute when the iframe dialog is hidden.
	 *     @property {function} loadIframeCallback - Callback function to execute when the iframe finishes loading.
	 *     @property {boolean} clearHistory - Whether to clear the browser history when the iframe dialog is hidden; default is true.
	 * 	   @property {string} baseHref - base href to inject 
	 * @returns {object} - The result of that.show() method, assumed to be defined elsewhere.
	 * @throws Will throw an error if the iframe cannot be loaded.
	  * ## Sample Usage:
	 *  
	 * var myIframe = materialDialog.iframeHtml('(some html)', { 
	 *     contentAnimationShowName: 'fadeIn',
	 *     contentAnimationHideName: 'fadeOutUpCenter',
	 * 	   baseHref: 'https://pianoencyclopedia.com',
	 *     useLoadingSplashScreen: true,
	 *     timeOut: 5,
	 *     hideCallback: function(thisComponent) {
	 *         console.log('Iframe dialog hidden:', thisComponent);
	 *     },
	 *     loadIframeCallback: function() {
	 *         console.log('Iframe loaded');
	 *     },
	 *     clearHistory: true
	 * });
	 *
	 * materialDialog.hide(myIframe)
	 *  
	 */
	that.__iframeHtmlOrUrl = function(input, settings, inputIsHtml = false) {
		try {
		
			var html = false;
			var url = false;
			
			if(inputIsHtml){
				html = input;
				if (!html || typeof html !== 'string') {
					throw new Error('Invalid HTML content provided.');
				}
			}
			else{
				url = input;
				if (!url || typeof url !== 'string') {
					throw new Error('Invalid url provided.');
				}
			}
			
			

			// Initialize customId incrementor if not already present
			that.__customId = that.__customId || 0;
			that.__customId++;
			var customId = 'showIframeDialog' + that.__customId;

			// Initialize settings if undefined
			if (typeof settings === "undefined") { settings = {}; }

			// Component Type
			settings.componentType = "iframe";

			// Default settings
			settings = that.defaultSettings(settings);
			settings.contentAnimationShowName = settings.contentAnimationShowName || "fadeIn";
			settings.contentAnimationHideName = settings.contentAnimationHideName || "fadeOutUpCenter";
			settings.useLoadingSplashScreen = settings.useLoadingSplashScreen || false;
			settings.baseHref = settings.baseHref || false;
			settings.timeOut = settings.timeOut || 5; //5 seconds maximum
 
 
			var timer;

			// Show Loader if useLoadingSplashScreen is true
			if (settings.useLoadingSplashScreen) {
				materialLoadingSplashScreen.show();

				// Set up a timer to hide the loading screen if the iframe takes too long to load
				if (settings.timeOut > 0) {
					timer = setTimeout(function() {
						materialLoadingSplashScreen.hide();
						console.warn('Iframe load timed out');
					}, settings.timeOut * 1000);
				}
			}

			// Create the iframe and dialog with the customId
			settings.contentHtml = 
                '<div id="' + customId + '" class="materialFullScreenIframe">' +
                '<iframe></iframe>' +
                '</div>';
			   
			// Handle Hide Callback
			var originalHideCallback = settings.hideCallback || function() {};
			var clearHistory = (typeof settings.clearHistory !== 'undefined') ? settings.clearHistory : true;

			settings.hideCallback = function(thisComponent) {
				clearTimeout(timer);
				if (clearHistory) { material.history.clear(); }
				$("body").removeClass("materialIframeFullScreen"); 
				originalHideCallback(thisComponent); 
			};

			// Add class to body
			$("body").addClass("materialIframeFullScreen");
			
			//Id is null, as we are using settings.contentHtml
			var dialog =  that.show(null, settings);
			
			var iframe = $(dialog.content).find('iframe');
			
			// Attach onload event to the iframe
			iframe.on('load', function() {
				console.log('iframe loaded');
				clearTimeout(timer);

				// Hide Loader if useLoadingSplashScreen is true
				if (settings.useLoadingSplashScreen) {
					materialLoadingSplashScreen.hide();
				}

				// Call settings.loadIframeCallback if defined
				if (typeof settings.loadIframeCallback === "function") {
					settings.loadIframeCallback();
				}
			});
			 
			 
			// Append base element if baseHref is provided in settings
			if (html && settings.baseHref) {
				var baseTag = '<base href="' + settings.baseHref + '">'; 
				
				// Use regex to insert the base tag after the opening head tag
				html = html.replace(/(<head[^>]*>)/i, '$1' + baseTag);
			}
			
			// Set the srcdoc attribute to the provided HTML content
			//TODO: if this method fails for large content consider creating a basic srcdocand then using innerHtml for complete body
			if(html){
				iframe.attr('srcdoc', html);
			}
			else{
				iframe.attr('src', url);
			}
			
			return dialog;			
		} catch (error) {
			clearTimeout(timer);
			if (settings && settings.useLoadingSplashScreen) {
				materialLoadingSplashScreen.hide();
			}
			var errorDescription = "An error occurred while loading the iframe";
			var errorCode = "IFRAME_LOAD_ERROR";
			materialDialog.error(errorDescription, errorCode, error);
			console.error(error);
		}
	};

	
    /**
     * Hide content
     */
    that.hide = function(item){
        materialComponent.hide(item); 
    };
	
	/**
     * Hide all dialogs
    */
    that.hideAll = function(){
        materialComponent.hideAll("dialog"); 
    };
	 
	that.areDialogsOpen = function(){ 
		//TODO: distinguish between dialogs and other components
		return materialComponent.areComponentsOpen("dialog");
	};


  
		
    var expose = {};
	expose.defaultSettings = that.defaultSettings;
	expose.error = that.error;
	expose.custom = that.custom;
    expose.show = that.show;
    expose.hide = that.hide;
	expose.hideAll = that.hideAll;
	expose.alert = that.alert;
	expose.waitStart = that.waitStart;
	expose.waitEnd = that.waitEnd;
	expose.question = that.question;
	expose.alertNoInternetConnection = that.alertNoInternetConnection;
	expose.iframe = that.iframe;
	expose.iframeHtml = that.iframeHtml;
	expose.areDialogsOpen = that.areDialogsOpen;

    return expose;
}();
