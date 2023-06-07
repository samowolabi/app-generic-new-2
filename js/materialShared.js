var material = {};
material.variables = material.variables || {};
/**
 * Attach mousedown ripple event
 * @param element: target element
 * @param settings: settings for riplpe
 */
material.ripple = function(element, settings){
		
		if(typeof settings === "undefined"){settings = {};}
		
		settings.centered = settings.centered || "false";
		settings.color = settings.color || "rgba(0,0,0,.4)";
		settings.appendTo = settings.appendTo || "body";
		settings.opacity = settings.opacity || 1;

		var fx = function(target){
			target.stopPropagation();
			ripplet(target, { 
				color: settings.color,  
				centered: settings.centered,
				clearingTimingFunction: "linear",
                className: "materialRipple",
				opacity: settings.opacity
			});
		};
		
		/* On mouse down: ripple */
		element.addEventListener('mousedown', fx);
		element.addEventListener('touchstart', fx);
};


jQuery.fn.onMouseDownRipple = function(){ 
	/* Init Ripple only once */
	if(typeof $(this).data("ripple-on") === "undefined"){ 
		material.ripple(this[0],{
			color: $(this).css("color"),
			opacity: 0.2
		});
		$(this).data("ripple-on", true); 
	} 
};


material.setProgress = function(target, progressValue){
	if(typeof progressValue === "undefined"){progressValue = false;}
	
	$('[data-progress]', this).data("progress", progressValue);
	material.renderProgress(target);
}

material.renderProgress = function(target){
		$('[data-progress]', target).each(function() {
		 
		progressValue =  $(this).data("progress"); 
		 
		var progressAffectsWidth = (typeof $(this).data("progress-affects-width") !== "undefined"); 
		var progressAffectsHeight = (typeof $(this).data("progress-affects-height")  !== "undefined"); 
		var progressAffectsDataPercentage = (typeof $(this).data("progress-affects-data-percentage")  !== "undefined"); 
	    var progressAffectsClass =  $(this).data("progress-affects-class") || false;  
		
		if(progressValue < 6){
			$("[data-new]", this).show();
			$("[data-incomplete]", this).hide();
			$("[data-complete]", this).hide();
			if(progressAffectsClass) { $(this).removeClass(progressAffectsClass);}   
		}
		else{ 
			if(progressValue >= 94){
				$("[data-new]", this).hide();
				$("[data-incomplete]", this).hide();
				$("[data-complete]", this).show(); 
				if(progressAffectsClass) { $(this).addClass(progressAffectsClass);}  
			}else{
				$("[data-new]", this).hide();
				$("[data-incomplete]", this).show();
				$("[data-complete]", this).hide();
				if(progressAffectsClass) { $(this).removeClass(progressAffectsClass);}  
			}
		} 
		
		/* Round to the nearest 0, 5 or 10. If < 100 and >95, use 95. If = 0, use 5: for visual purposes*/
		function specialRound(x){
			 if(x > 95 && x < 100) {
				return 95;
			}
			if(x==0) {
				return 5;
			}
			return Math.ceil(x/5)*5;
		}
		 
		$("[data-progress-affects-html]", this).html(progressValue);   
		if(progressAffectsWidth) { $(this).css("width", specialRound(progressValue) + "%"); }
		if(progressAffectsHeight) { $(this).css("height", specialRound(progressValue) + "%"); }
		if(progressAffectsDataPercentage) { $(this).attr("data-percentage", specialRound(progressValue));} /* We use attr() instead of data() as we want to update the attribute and not just the data value */
		
	 });
}
/**
 * Init Material library
 **/
material.init = function(target){
    /* Ripple */
    $( "[data-button], .materialCardTop, .materialButton, .materialRating label, .materialButtonText, .materialButtonOutline, .materialButtonFill, .materialButtonIcon, .materialChipAction, .materialChipChoice, .materialOutlineView", target).each(function() {
		 $(this).onMouseDownRipple();
		 
		 $(this).click(function(event){
			/*Prevent propagation of events to parents, which results in double or triple actions */
			event.stopPropagation();
		 });
    }); 
	
	 
	/* Data buttons and context menus */
	$("[data-button]").each(function() { 
  
		/* 
		* @purpose: Update function which will change the status of the element and re-render it
		* @param string status: "on" or "off".
		* @example: Use $(".buttonIcon")[0].update("on") to change status of button 0 to "on"
		*/
		this.update = function (status, event) {
				var thisButton = this;    
				
				/* Update status in data */
				$(thisButton).data("status", status);
		
			   /* Create class name from status */ 
			   var buttonClassName = $(thisButton).data("class-" +status) || false;
				
				  /* Create class name from status */ 
			   var iconClassName = $(thisButton).data("icon-class-" +status) || false;

			   /* Update class name of button */
			   if(buttonClassName){
					$(thisButton)[0].className = buttonClassName;
			   }
				
			   /* Update class of direct child .icon item of 'this', if there is an icon; else, update button class */ 
			   var icon = $("> i.fa", thisButton);
			   if(iconClassName && icon.length !== 0) {
					icon[0].className = iconClassName; 
			   } 
			   
			   
			   /* Check if there is any action */
			   var action = $(thisButton).data("action") || false; 
		 
			   if(action === "materialContextMenu"){ 
					/* Add position class if defined via data-position, else use "bottom left" */
					var position = $(".materialContextMenu", thisButton).data("position") || "bottom left"; 

					/* Check if any custom style is required via data-style, such as "overlay" */
					var style = $(".materialContextMenu", thisButton).data("style") || "";
					
					/* Check if modal is required. Menu will not close unless an option is selected. Should be user with data-style="overlay" data-modal="yes" */
					var modal = $(".materialContextMenu", thisButton).data("modal") || false;
		

					var thisContextMenu =  $(".materialContextMenu", thisButton);
					thisContextMenu[0].className = "materialContextMenu " + status + " " + position;

					/* Create a div that covers the whole screen to capture "lost focus" */
					$(".materialContextMenuOverlay")[0].className = "materialContextMenuOverlay "+  style +" "+ status  + " " + (modal === true ? "materialModal":"");
					
					/* Remove previous event listeners on click and add a new one for current open menu*/
					$(".materialContextMenuOverlay").unbind( "click" );

					/* If modal is not required, then assign on click event to materialContextMenuOverlay to close on "lostFocus" */
					if(modal === false){
						$(".materialContextMenuOverlay").click(function(){ 
							
							var status = $(thisButton).data("status") || "off"; 
							if(status==="on"){
								/* Close menu and hide overlay */
								thisButton.update("off", "lostFocus");
								$(".materialContextMenuOverlay")[0].className = "materialContextMenuOverlay off"; 
							}
						});
					}
					
			 
					 /* Add on click functionality just once*/
					var onClickEventsRegistered = $(thisContextMenu).data("on-click-events-registered") || "no"; 
					if(onClickEventsRegistered === "no"){ 
					
						/* Save that on click events were already registered */
						$(thisContextMenu).data("on-click-events-registered", "yes");
						$("li", thisContextMenu).click(function(event){
									
									/* Use the data value or else use the text */
									var value = $(this).data("value") || $(this).text(); 
									
									var callback = $(thisContextMenu).data("callback") || "console.log('No callback defined. Selection: " + value + "');"; 
									 
									 /* Define function and run it*/
									var fx = new Function('thisContextMenuUl', 'thisContextMenuLi','value', callback);
									fx(thisContextMenu, this, value);
						}); 
					}
			   }	 
			   
			   if(action === "materialDrawer" && status === "on"){ 
					/* Get Drawer id target; if not specified, silently exit */
					var targetId = $(thisButton).data("drawer-id") || false;
					if(!targetId) {console.log("Missing drawer id"); return};
					  
					/* Add position class if defined via data-position, else use "bottom left" */
					var position = $(thisButton).data("drawer-position") || "left"; 

					/* Check if any custom style is required via data-style, such as "overlay" */
					var style = $(thisButton).data("drawer-style") || "overlay";
					
					/* Check if modal is required. Menu will not close unless an option is selected. Should be user with data-style="overlay" data-modal="yes" */
					var modal = $(thisButton).data("drawer-modal") || false;
 
					materialDrawer.show(targetId, position, style, modal, thisButton);
					
				}
			
			   /* Execute scripts if needed and if coming from a "click" event to avoid a recursive loop */
			   var scriptStatus = $(this).data("script-" +status) || false; 
			   if(event==="click" && scriptStatus){
					var fx = new Function(scriptStatus);  fx();
			   }
			   
			   /* Execute scripts that don't depend on status too */
			   var scriptAlways = $(this).data("script") || false; 
			   if(event==="click" && scriptAlways) {
					var fx = new Function(scriptAlways);  fx();
			   }
		 };
		 
		/* On Click : toggle status and update */
		$(this).unbind("click"); //Remove previous binds so there is not conflict if material.init() is called multiple times
		$(this).click(function(event){

				event.stopPropagation();

				/* If href="#" then prevent default to avoid jumping of page to top */
				if($(this).attr('href') ==="#") event.preventDefault();


				/* Check if it has target, which will have less priority than data-href-target */
				 var hrefTarget = $(this).attr('target') || "_self";
				
				/* If data-href is used, go to that link on click */
				var dataHref 	   = $(this).data('href') || false;
				var dataHrefTarget = $(this).data('href-target') || hrefTarget;
				 
				if(dataHref) {
					window.open(dataHref, dataHrefTarget);
				}
				
				/* Get status and if undefined set to "off"*/
			   var status = $(this).data("status") || "off"; 
			   
			   /* Toggle status */
			   status = (status ==="off") ? "on" : "off"; 
			   
			   /* Call update function */
			   this.update(status, "click");
		 });
		  
		
	});
  
  
	/* Tooltips */
	$('[data-toggle="tooltip"]', target).tooltip();
		
	/* Init ratings */
	materialRating.init(target);
	
	/* Init Progress */
	material.renderProgress(target);
	
	/* Init countdowns */
	/* Function for animating Countdown Timers
	  @params 
	  @dateTime - date - The date as string to be used for the timers, in the given format. Also it can be a hour/minute modifier if a special format is used.
	  @format - string - format of the dateTime. It can also be a special format
	  @timezone - string - The name of the timezone
	  @extension - array - Defines what extension of time to add when deadline reaches 0 [4, 4, 4, 2, 2, 2]
	  @callback - callback to call on final countdown after extensions
	*/
	 $('[data-countdown]', target).each(function() {
		
		
		var countdownDateString = $(this).data("countdown") || false; 
		
		//New functionality
		var countdownTimezone = $(this).data("timezone") || false; 
		var countdownFormat = $(this).data("format") || "YYYY-MM-DD HH:mm:ss"; 
		var countdownHoursToAdd = $(this).data("extension") || false; 
		var countdownCallback = $(this).data("callback") || false;  //UNUSED FOR NOW
		var countdownUseCookie = !($(this).data("cookie") === "no"); //Used for debug purposes, set data-cookie="no" to avoid using cookies to remember last deadline. E.g : <span data-countdown="10" data-format="RELATIVE_NOW_SECONDS" data-cookie="no"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span>
 
		var deadlineMoment = moment(countdownDateString);
 
		switch(countdownFormat){
			case "RELATIVE_NOW_HOURS":   
				deadlineMoment = moment().add(countdownDateString,"hours");  
				break;
		
			case "RELATIVE_NOW_MINUTES":  
				deadlineMoment = moment().add(countdownDateString,"minutes");
				break; 
				
			case "RELATIVE_NOW_SECONDS":  
				deadlineMoment = moment().add(countdownDateString,"seconds");
				break; 
					
			case "MIDNIGHT":  
				var d = new Date();
				d.setHours(23, 59, 59, 0); // next midnight
				deadlineMoment = moment(d.toISOString());
				break; 	
				
			default:
				if(countdownTimezone){
					deadlineMoment = moment.tz(countdownDateString, countdownFormat, countdownTimezone);	
				}
				else{
					deadlineMoment =  moment(countdownDateString); 
				}
				break;
		}
		
		/* Count number of days to target date from now */
		var countDaysToTargetDate = function(targetDateString) {
			var date1 = new Date();
			var date2 = new Date(targetDateString);
			var timeDiff = Math.abs(date2.getTime() - date1.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			return diffDays;
		}


		if(countdownUseCookie){
			/* If format is anything relative, remember the deadline set from cookies */	
			switch(countdownFormat){
				case "RELATIVE_NOW_HOURS":   
				case "RELATIVE_NOW_MINUTES": 
				case "RELATIVE_NOW_SECONDS":  
				case "MIDNIGHT":  
					var daysToExpire = countDaysToTargetDate(deadlineMoment.format()) + 1;	
					var deadlineCookie = Cookies.get('deadlineCountdown')
					if(!deadlineCookie){  
						/* Create a cookie expiring in 7 days, valid to the path of the current page */
						Cookies.set('deadlineCountdown', deadlineMoment.format(), { expires: daysToExpire, path: '' });
					}
					else{
						deadlineMoment = moment(deadlineCookie);
					} 
					break; 
			}
		}
		
		//Logic for time extension based on countdown hours to add
		var countdownFinishedCount = 0;
		var hoursToAdd = countdownHoursToAdd || [0]; 
		var currentDate = new Date();
		var hoursToAddSum = hoursToAdd.reduce(function getSum(total, num) {return total + num;}) // sum of hours in the array
		var deadlineMaximumMoment = moment(deadlineMoment).add(hoursToAddSum, 'hours'); 
	  
		if (currentDate > deadlineMoment.toDate()) { // Past
		
			// Check if the extra hours has already been added with the time set.
			if (deadlineMaximumMoment.toDate() < currentDate) { // The currentDate is greater than the (deadlineMoment + hoursToAdd)
				countdownFinishedCount = hoursToAdd.length;
			} 
			else if (deadlineMaximumMoment.toDate() > currentDate) { // The currentDate is lesser than the (deadlineMoment + hoursToAdd)
				
				while (deadlineMoment.toDate() < currentDate) { // Calculate Time left to get the current value of countdownFinishedCount
					if (countdownFinishedCount > (hoursToAdd.length - 1)) {
						return; 
					}
					var hoursToAddNow = hoursToAdd[countdownFinishedCount];
					deadlineMoment.add(hoursToAddNow, 'hours');
					countdownFinishedCount++;
				}
			}
		} else { } // Present
		 
		 
		 //The countdown will NOT restart when reaching zero, but if the deadline has been reached, and there is an extension, upon refreshing the page, the time extension will be added. This effect is on purpose, so when the countdown reaches zero, it shows as "expired".
		

		/*
		* # Sample usage 1:
		* <span data-countdown="2022-06-01 00:00:00"><span data-show-if-long-hours><span data-days>00</span> Days</span><span data-hide-if-long-hours><span data-hours-total>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></span>
		*
		* This will display:
		* 95:59:59 => Accumulated hour countdown up to 96 hours 
		* 7 Days => Day countdown after 96 hours
		*
		* # Sample usage 2:
		* Free Access Expiring in <span data-countdown="2019-01-01 00:00:00"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span>
		*
		* This will display:
		* 95:59:59 => Acculumated hour countdown p to 96 hours 
		* 7 Days 23:17:23 => Day and hour countdown after 96 hours
		* 
		* # Sample usage 4:
		*  <span data-countdown="2022-06-01 00:00:00" data-format="Y-m-d H:i:s" data-extension="[1,1,1,1,1]"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span>
		*/
		$(this).countdown(deadlineMoment.toDate(), function(event) {
			
			/* If more than 96 hours, show days; else hide days and show hours combined up to 96 hours */
			var totalHours = parseInt(event.strftime('%H'),10)  + parseInt(event.strftime('%D') * 24, 10);
			
			function pad(n, width, z) {
			  z = z || '0';
			  n = n + '';
			  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
			}
			
			/* Add padding so "1" becomes "01" */
			totalHours = pad(totalHours, 2);

			if(totalHours>96){
				$('[data-days]', this).html(event.strftime('%D'));
				$('[data-hours]', this).html(event.strftime('%H'));
				$('[data-hide-if-long-hours]', this).hide(); 
				$('[data-show-if-long-hours]', this).show();
			}
			else{ 
				$('[data-hours]', this).html(totalHours);	
				$('[data-days], [data-days-caption]', this).html("");  
				$('[data-hide-if-long-hours]', this).show(); 
				$('[data-show-if-long-hours]', this).hide();
			}
			
			$('[data-hours-total]', this).html(totalHours);
			$('[data-minutes]', this).html(event.strftime('%M'));
			$('[data-seconds]', this).html(event.strftime('%S'));
		}).on('finish.countdown', function(){
		 
			//TODO: test this
			if(countdownCallback){
				var fx = new Function(countdownCallback);
				fx(this);
			}
			
			/* Whenever any countdown finishes - refetch data from server and do nothing as it could interrupt the lesson the user is watching for no valid reason (e.g: countdown affects other page) */
			app.fetchRemoteData(); 
		});
	}); 
	/* init buttons */
	 
};

$(document).ready(function(){	
	material.init($("body"));
});


/* Extend Array by adding method removeItemByValue */ 
Array.prototype.removeItemByValue = function (value) {
		var index = this.indexOf(value);
		if(index !== -1){
			this.splice(index, 1);
		}
		
		return this;
};



 /** 
 * This function getQueryStringParameterByName takes parameter name and url 
 * as parmaters and returns parameter value 
 * @parameter {String} parameterName
 * @parameter {String} url (optional)
 * (if url is not passed it takes the current url from window.location.href)
 **/

function getQueryStringParameterByName(parameterName, url) {
	  if (!url) url = window.location.href;
	  parameterName= parameterName.replace(/[\[\]]/g, "\\$&");
	  var regularExpression = 
		  new RegExp("[?&]" + parameterName + "(=([^&#]*)|&|#|$)"),
	  results = regularExpression.exec(url);
	  if (!results) return null;
	  if (!results[2]) return '';
	  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
	  
jQuery.fn.animateWithClass = function(settings){
	if(typeof settings === "undefined"){ settings = {}; }

	settings.className = settings.className || "unsetAnimationClassName";
	settings.duration = settings.duration || "500";
    settings.easing = settings.easing || "ease-out";
	settings.iterationCount =  settings.iterationCount || 1 ;
	settings.onEndCallback = settings.onEndCallback || false;
	settings.onEndHide = settings.onEndHide || false;
    settings.onEndRemove = settings.onEndRemove || false;
     /* No default values for onStartDisableScrolling and onEndDisableScrolling on purpose */

     var target = this;

	 $(target).show();
	 
	 if(settings.onStartDisableScrolling === true) {
         $("body").addClass("materialNoScroll");
     }
    if(settings.onStartDisableScrolling === false) {
        $("body").removeClass("materialNoScroll");
    }

	$(target).css({
            "-webkit-animation-iteration-count": settings.iterationCount,
            "-moz-animation-iteration-count": settings.iterationCount,
            "-o-animation-iteration-count": settings.iterationCount,
            "animation-iteration-count": settings.iterationCount,
            "-webkit-animation-duration": settings.duration+ "ms",
			"-moz-animation-duration": settings.duration+ "ms",
			"-o-animation-duration": settings.duration+ "ms",
			"animation-duration": settings.duration + "ms",
            "-webkit-transition-timing-function": settings.easing,
            "-moz-transition-timing-function": settings.easing,
            "-o-transition-timing-function": settings.easing,
            "transition-timing-function": settings.easing
	});

	$(target).addClass('animated ' + settings.className);
	
	window.setTimeout(function(){
        $(target).removeClass('animated ' + settings.className);

        if(settings.onEndDisableScrolling === true) {
            $("body").addClass("materialNoScroll");
        }
        if(settings.onEndDisableScrolling === false) {
            $("body").removeClass("materialNoScroll");
        }

	    if(settings.onEndHide)   { $(target).hide();}
        if(settings.onEndRemove) { $(target).remove();}

		if(typeof settings.onEndCallback === "function")  {settings.onEndCallback(target, settings);}
	}, settings.duration * settings.iterationCount + 10); /* Extra 10 ms */
	  
    return this;
};

 /* Simplification Wrapper of animateWithClass */
jQuery.fn.animateWithClassSimple = function(animationName, callback, duration, easing) {
		if(typeof duration === "undefined"){duration = 500;}
		if(typeof easing === "undefined"){easing = "linear";}
		
		$(this).animateWithClass({
			className: animationName,
			duration: duration,
			onEndCallback: callback,
			easing : easing
		});  
		return this;
};

/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 * Example usage: Cookies.set('myVariableName', 'myVariableValue', { expires: 3 });  // expires in 3 days 
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));