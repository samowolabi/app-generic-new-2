var materialFloatingLoginMenu = (function () {
  var that = {}; 
  that.isLogged = false;
  that.isReady = false;
 
  var getHtml = function(logged = false){  
	  that.isLogged = logged;	
      // Define SVG icons as template literals
      var iconLogout = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 12H3.62" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke-linecap="round" stroke-linejoin="round"></path></svg>`; 
      var iconLogin = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 12H14.88" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.65 8.6499L16 11.9999L12.65 15.3499" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
      var iconMenuClosed =  `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.625 13H24.375" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.625 22.75H24.375" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.625 3.25H24.375" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
	  var iconMenuOpened =  `<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.50018 1.5L22.8629 22.5627" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22.8625 1.5L1.49986 22.5627" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
	  var iconHome =  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 18V15" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.07 2.81997L3.14002 8.36997C2.36002 8.98997 1.86002 10.3 2.03002 11.28L3.36002 19.24C3.60002 20.66 4.96002 21.81 6.40002 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

      // Conditional icon based on login status
      var loggedClass = logged ? "logged" : "";

      // HTML structure
      var html = `
	    <div class="materialFloatingMenuContainer ${loggedClass}">
          
          <div class="materialFloatingMenuButton" data-ripple="" data-action="log">
            ${iconLogin}
			${iconLogout}
			<span class="menuText" data-ripple="">Log out</span>
          </div>
		  <div class="materialFloatingMenuButton" data-ripple="" data-action="home">
            ${iconHome}
			<span class="menuText" data-ripple="">Home Screen</span>
          </div>
          <div class="materialFloatingMenuOpener" data-ripple=""  data-action="menu">
            ${iconMenuClosed}
			${iconMenuOpened}
			<span class="menuText" data-ripple="">Main Menu</span>
          </div>
        </div>`;

      return html; 
   }

    /*	
	* @purpose: Debounce function
	* @param [function] func
	* @param [int] delay in ms
	*/
    var  debounce = function(func, delay) {
		let inDebounce;
		return function() {
			const context = this;
			const args = arguments;
			clearTimeout(inDebounce);
			inDebounce = setTimeout(function(){ func.apply(context, args)}, delay);
		};
	};

	var __close = function(){
		$('#materialFloatingLoginMenu .materialFloatingMenuContainer').removeClass('active');			
		$('#materialFloatingLoginMenu .materialFloatingMenuOpener').removeClass('active');	
	};
	
	var __open = function(){
		$('#materialFloatingLoginMenu .materialFloatingMenuContainer').addClass('active');			
		$('#materialFloatingLoginMenu .materialFloatingMenuOpener').addClass('active');	
	};
	
	var __toggle = function(){
		$('#materialFloatingLoginMenu .materialFloatingMenuContainer').toggleClass('active');			
		$('#materialFloatingLoginMenu .materialFloatingMenuOpener').toggleClass('active');	
	};
	
	/*
	* @purpose: Create html of radio or checkbox input controls 
	* @param [object] settings
	*/
	var create = function(settings = {}){
		if(that.isReady){
			//Already created
			that.show();
			console.log("materialFloatingLoginMenu was created more than once, request ignored, will show() instead");
		}
		else{
			settings.logged = settings.logged|| false;
			settings.onClickCallbackHome = settings.onClickCallbackHome || false;
			settings.onClickCallbackLog  = settings.onClickCallbackLog || false; 
		
			var html = getHtml(settings.logged);

			/* Create */
			
			// Check for the existence of the div before creation
			if ($('#materialFloatingLoginMenu').length === 0) {
				var content =  function() {
					return $('<div id="materialFloatingLoginMenu">'+html+'</div>').appendTo('body');
				}(); //.hide();
			}
	  
			$('#materialFloatingLoginMenu [data-action="menu"]').off('click').on('click', function (event) { 
				__toggle();	 
			});

			$('#materialFloatingLoginMenu [data-action="home"]').off('click').on('click', debounce(function() {
				if(typeof settings.onClickCallbackHome === "function") {
				  settings.onClickCallbackHome(that.isLogged);
				  __close();
				}
			  }, 300));
	 
			$('#materialFloatingLoginMenu [data-action="log"]').off('click').on('click', debounce(function() {
				if(typeof settings.onClickCallbackLog === "function") {
				  settings.onClickCallbackLog(that.isLogged);
				  __close();
				}
			  }, 300));
			  
			that.isReady = true;
		} 
	}
 
    var logged = function(isLogged){
		if(isLogged){ 
			that.isLogged = true;
			$('#materialFloatingLoginMenu .materialFloatingMenuContainer').addClass('logged');
		}
		else{ 
			that.isLogged = false;
			$('#materialFloatingLoginMenu .materialFloatingMenuContainer').removeClass('logged');
		} 	
	};
 
	var hide = function(){
		$('#materialFloatingLoginMenu').hide();
	};

	var show = function(){
		$('#materialFloatingLoginMenu').show();
	};
 
	that.create = create;
	that.logged = logged;
	that.hide = hide;
	that.show = show;
	 
	return that;
})();
/*
Sample usage:
#Add menu

materialFloatingLoginMenu.create({
	onClickCallbackHome: function(isLogged){
        materialDialog.question("Please confirm.", "Would you like to go to the home screen?", {
            "buttonNo": {
                caption: "No",
				value: "no"
            },
            "buttonYes": {
                caption: "Yes", 
				value: "yes"
            },
            "hideCallback": function(thisComponent){
                console.log("Result: ", thisComponent.lastValue);
                
                if(thisComponent.lastValue === "yes"){	
                     //Refresh self and clear parameters
                     var url = window.location.href;                         
                     url = QueryParameter.updateUrl(url, {
                        "email": "",
                        "needsVerification": ""
                     });
                     window.location.href = url;
                } 
            }
        });


    },
	onClickCallbackLog: function(isLogged){
        if(isLogged){
            materialDialog.question("Please confirm.", "Would you like to log out?", {
                "buttonNo": {
                    caption: "No",
                    value: "no" 
                },
                "buttonYes": {
                    caption: "Yes", 
                    value: "yes" 
                },
                "hideCallback": function(thisComponent){
                    console.log("Result: ", thisComponent.lastValue);
                    
                    if(thisComponent.lastValue === "yes"){	
                         DeviceStorage.clear("email");
                         
                         //Refresh self and clear parameters
                         var url = window.location.href;                         
                         url = QueryParameter.updateUrl(url, {
                            "email": "",
                            "needsVerification": ""
                         });
                         window.location.href = url;
                            
                    } 
                }
            }); 
        }
        else{
            materialDialog.show("dialogLogin", { modal: true, hideCallback: function () { } });
        }

    } 
})
#Update logged status
materialFloatingLoginMenu.logged(true);
materialFloatingLoginMenu.logged(false);

#Hide
materialFloatingLoginMenu.hide();
#Show
materialFloatingLoginMenu.show();
*/