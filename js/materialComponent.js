var materialComponent = function(id){
    var that = {};
    that.items = []; 
	
    /**
     * Create html and add event handling
     * @param string id
     * @param object settings: settings to display component
	 * @return object materialComponent
     */
    that.create = function(id, settings){

        var item = {};

		item.lastValue = null;
		
        /* Save settings */
        item.settings = function(){
            settings.modal = settings.modal || false;

            if(typeof settings.disableScrolling === "undefined"){
                settings.disableScrolling = true;
            }
 
            settings.componentType = settings.componentType || "generic";
			
			settings.overlayStyling = settings.overlayStyling || "overlay";

            settings.contentClass = settings.contentClass || "";

            settings.separateAnimation = (typeof settings.separateAnimation !== "undefined")? settings.separateAnimation : true;
			
			settings.closeButton = (typeof settings.closeButton !== "undefined")? settings.closeButton : true;
			settings.closeButtonTheme = settings.closeButtonTheme ||  ""; //materialThemeDark
			
            settings.overlayAnimationShowName = settings.overlayAnimationShowName ||  "fadeIn";
            settings.overlayAnimationHideName = settings.overlayAnimationHideName ||  "fadeOut";
            settings.contentAnimationShowName = settings.contentAnimationShowName ||  "fadeInLeft";
            settings.contentAnimationHideName = settings.contentAnimationHideName ||  "fadeOutLeft";

            settings.overlayAnimationShowTime = settings.overlayAnimationShowTime ||  "500";
            settings.overlayAnimationHideTime = settings.overlayAnimationHideTime ||  "300";
            settings.contentAnimationShowTime = settings.contentAnimationShowTime ||  "500";
            settings.contentAnimationHideTime = settings.contentAnimationHideTime ||  "500";

            settings.overlayAnimationEasing = settings.overlayAnimationEasing ||  "linear";
            settings.contentAnimationEasing = settings.contentAnimationEasing ||  "ease-out";

            settings.contentSwipeLeftHide  = settings.contentSwipeLeftHide || false;
            settings.contentSwipeRightHide = settings.contentSwipeRightHide || false;
            settings.contentSwipeUpHide    = settings.contentSwipeUpHide || false;
            settings.contentSwipeDownHide  = settings.contentSwipeDownHide || false;

            settings.contentSwipeLeftCallback  = settings.contentSwipeLeftCallback || false;
            settings.contentSwipeRightCallback = settings.contentSwipeRightCallback || false;
            settings.contentSwipeUpCallback    = settings.contentSwipeUpCallback || false;
            settings.contentSwipeDownCallback  = settings.contentSwipeDownCallback || false;
			

            settings.hideCallback 	= settings.hideCallback || false;
			settings.initCallback	= settings.initCallback || false;

            return settings;
        }();

        /* Create overlay and hide */
        item.overlay =  function() {
            return $('<div id="materialOverlay-'+ id +'" class="materialOverlay' + ' '+
                ((item.settings.modal === true) ? "materialModal" : "") + ' ' +
                item.settings.overlayStyling+'"></div>').appendTo('body');
        }().hide();

        /* Create content by cloning target, remove id, and hide. If id not found, display a warning. */
        item.content = function(){
				var target  = $('#' + id);
                if(!target.length){ console.error("ERROR: Target id not found: '" +  id + "'. This will trigger additional errors:"); }
				return  target.clone().removeAttr('id').addClass(settings.contentClass).appendTo('body');
        }().hide();
	 
		
		/* Swipe events on the content */
        var contentHammer = new Hammer(item.content[0]);
        contentHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL }); /* detect swipe in all directions */
        contentHammer.on("swipeleft swiperight swipeup swipedown", function(event){
            switch(event.type){
                case "swipeleft":
                    if(item.settings.contentSwipeLeftHide) { that.hide(item);}
                    if(typeof item.settings.contentSwipeLeftCallback === "function"){
                        item.settings.contentSwipeLeftCallback();
                    }
                    break;
                case "swiperight":
                    if(item.settings.contentSwipeRightHide) { that.hide(item);}
                    if(typeof item.settings.contentSwipeRightCallback === "function"){
                        item.settings.contentSwipeRightCallback();
                    }
                    break;
                case "swipeup":
                    if(item.settings.contentSwipeUpHide) { that.hide(item);}
                    if(typeof item.settings.contentSwipeUpCallback === "function"){
                        item.settings.contentSwipeUpCallback();
                    }
                    break;
                case "swipedown":
                    if(item.settings.contentSwipeDownHide) { that.hide(item);}
                    if(typeof item.settings.contentSwipeDownCallback === "function"){
                        item.settings.contentSwipeDownCallback();
                    }
                    break;
            }
        });

        var clickFx = false;

        /* Check if there is an init callback */
        var initCallback = item.content.data("on-init-callback") || false;
        if(initCallback){
            var initFx = new Function('thisComponent',  initCallback);
            var thisComponent = item.content;
            initFx(thisComponent);
        }

		/* Check if there is an on submit callback */
        $("[data-on-submit-callback]", item.content).each(function( index ) {
 
            $(this).on("submit", function(event){
			 
                /* data-on-submit-callback: will run js code on click */
                var onSubmitCallback = $(this).data("on-submit-callback") || false;
                if(onSubmitCallback){
                    submitFx = new Function('value','thisSelection', 'thisComponent', onSubmitCallback);
                }
 
                var value = $(this).data("value") || null;
                var thisSelection = $(this);
				var thisComponent = item.content;
				
				//To be used on hide callback
				item.lastValue = value;

                /* If submit function is true, hide dialog; else do not hide */
                if(typeof submitFx === "function") {
					 if(submitFx(value, thisSelection, thisComponent)){
						that.hide(item, function(item){});
					}
				}
				
				//Prevent form submission
				return false;
 
            });
        });

		/* Add close button if not modal */
		if(item.settings.closeButton && !item.settings.modal){
			item.content.prepend(`<button data-value="close" class="materialCloseButton materialButtonIcon ${item.settings.closeButtonTheme}"><i class="fa fa-close"></i></button>`);
		}
        
	 
        /* Add event handling to the items inside the content and ripple effects*/
        $("[data-value],[data-href],[data-on-click-callback],[data-on-click-no-hide]", item.content).each(function( index ) {

            $(this).onMouseDownRipple();
			
            $(this).on("click", function(event){
			 
                /* data-href: open link; data-href-target: _self | _blank (on current or new page) */
                var dataHref = $(this).data('href') || false;
                if(dataHref){
                    var dataHrefTarget = $(this).data('href-target') || "_self";
                    window.open(dataHref, dataHrefTarget);
                }

                /* data-on-click-no-hide: will not hide the content if target is clicked if this tag is on */
                var onClickNoHide = (typeof $(this).data("on-click-no-hide") !== "undefined");

                /* data-on-click-callback: will run js code on click */
                var onClickCallback = $(this).data("on-click-callback") || false;
                if(onClickCallback){
                    clickFx = new Function('value','thisSelection', 'thisComponent', onClickCallback);
                }

                var value = $(this).data("value")  || $(this).text();
                var thisSelection = $(this);
                var thisComponent = item.content;

				//To be used on hide callback
				item.lastValue = value;
				
                /* If no hide on click: execute callback directly; else execute after hide */
                if(onClickNoHide){
                    if(typeof clickFx === "function") { clickFx(value, thisSelection, thisComponent);}
                }
                else{
                    that.hide(item, function(item){
                        if(typeof clickFx === "function") { clickFx(value, thisSelection, thisComponent);}
                    });
                }
 
            });
        });

        /* Close on click of overlay if not modal */
        if(!item.settings.modal){
            item.overlay.on("click", function(event){
                that.hide(item);
            });
        }
		
		/* Init items */
		material.init(item.content);
		
		/* Init custom callback */
		if(typeof item.settings.initCallback === "function") { item.settings.initCallback(item.content);}
		
		// $('[data-toggle="tooltip"]', item.content).tooltip();
		 
		//materialRating.init(target);
		
		//Facilitators
		item.id = id; 
		item.hide = function(){
			materialComponent.hide(item);
		};
		
		item.show = function(){
			materialComponent.show(id);
		};
		 
		
        return item;

    };



    /**
     * Show content (and create it first)
     * @param string id
     * @param object settings
     */
    that.show = function(id, settings, saveHistory){
		if(typeof saveHistory === "undefined"){saveHistory = true;}
		 
		/* Save into history */
		if(saveHistory) { material.history.save(id, settings); }
		
        var item = that.create(id, settings);
		
		//Track open components
		materialComponent.__currentOpenComponents = materialComponent.__currentOpenComponents || [];
		materialComponent.__currentOpenComponents.push(item);
		
        /* Animate overlay and content separately; or animate both together */
        if(item.settings.separateAnimation){
            item.overlay.animateWithClass({
                className: item.settings.overlayAnimationShowName,
                duration:  item.settings.overlayAnimationShowTime,
                easing:    item.settings.overlayAnimationEasing,
                onStartDisableScrolling: (item.settings.disableScrolling || item.settings.modal),
                onEndCallback: function(){
                    item.content.animateWithClass({
                        className: item.settings.contentAnimationShowName,
                        duration:  item.settings.contentAnimationShowTime,
                        easing:    item.settings.contentAnimationEasing
                    });
                }
            });
        }
        else{
            var both = item.overlay.add(item.content);
            both.animateWithClass({
                className: item.settings.contentAnimationShowName,
                duration:  item.settings.contentAnimationShowTime,
                easing:    item.settings.contentAnimationEasing,
                onStartDisableScrolling: (item.settings.disableScrolling || item.settings.modal)
            });
        }
		
		

        return item;
    };

    /**
     * Hide content
	 * @item object materialComponent
	 * @item callable callback
     */ 
    that.hide = function(item, callback){

		//Track open components
		materialComponent.__currentOpenComponents = materialComponent.__currentOpenComponents || []; 
		
		//Remove component from materialComponent.__currentOpenComponents  
		for(var i = 0; i < materialComponent.__currentOpenComponents.length; i++){
			if(materialComponent.__currentOpenComponents[i].id === item.id){
				materialComponent.__currentOpenComponents.splice(i, 1); 
			}
		}
		
        /* Animate overlay and content separately; or animate both together */
        if(item.settings.separateAnimation){
            item.content.animateWithClass({
                className: item.settings.contentAnimationHideName,
                duration:  item.settings.contentAnimationHideTime,
                easing:    item.settings.contentAnimationEasing,
                onEndRemove: true,
                onEndCallback: function(){
                    item.overlay.animateWithClass({
                        className: item.settings.overlayAnimationHideName,
                        duration:  item.settings.overlayAnimationHideTime,
                        easing:    item.settings.overlayAnimationEasing,
                        onEndDisableScrolling: false,
                        onEndRemove: true,
                        onEndCallback: function(){
                            /* First is an internal callback; second is a settings extra callback */
                            if(typeof callback === "function") {callback(item);}
                            if(typeof item.settings.hideCallback === "function") {item.settings.hideCallback(item);}
                        }
                    });
                }
            });
        }
        else{
            var both = item.overlay.add(item.content);
            both.animateWithClass({
                className: item.settings.contentAnimationHideName,
                duration:  item.settings.contentAnimationHideTime,
                easing:    item.settings.contentAnimationEasing,
                onEndRemove: true,
                onEndDisableScrolling: false,
                onEndCallback: function(){
                    /* First is an internal callback; second is a settings extra callback */
                   if(typeof callback === "function") {callback(item);}
                   if(typeof item.settings.hideCallback === "function") {item.settings.hideCallback(item);}
                }
            });
        }

    };
	
		
	/**
	 * Hide all components
	 */
	that.hideAll = function(){
		materialComponent.__currentOpenComponents = materialComponent.__currentOpenComponents || [];  
		for(var i = 0; i < materialComponent.__currentOpenComponents.length; i++){
			that.hide(materialComponent.__currentOpenComponents[i]);
		}
	};
	
	/**
	 * Check if any components are open
	 */
	that.areComponentsOpen = function(componentType){
		 if(typeof componentType === "undefined"){ componentType = "generic";}
		 
		materialComponent.__currentOpenComponents = materialComponent.__currentOpenComponents || [];   
		
		for(var i = 0; i < materialComponent.__currentOpenComponents.length; i++){
			if(materialComponent.__currentOpenComponents[i].settings.componentType === componentType){
				return true;
			}
		}
		return false;
	};

    var expose = {};
	expose.areComponentsOpen = that.areComponentsOpen;
    expose.show = that.show;
    expose.hide = that.hide;
	expose.hideAll = that.hideAll;
	expose.history = that.history;

    return expose;
}();
