/**
 * ExitIntent
 * Originally: BounceBack.js v1.0,  upgraded by Rod Schejtman and renamed as ExitIntent
 * https://github.com/AMKohn/bounceback  
 * Copyright 2014 Avi Kohn, upgraded by Rod Schejtman
 * Distributable under the MIT license
 * Does NOT depend on jquery
 */

/*
SAMPLE USAGE:
==============
ExitIntent.init({
  checkReferrer: false,
  aggressive: true,
  onBounce: function() { 
	titlenotifier.add(); //Add notification +1 to title
  }
})

OPTIONS DOCUMENTATION
===========
maxDisplay
	Default: 1

	The maximum number of times the dialog may be shown on a page, or 0 for unlimited. Only applicable on desktop browsers.

distance
	Default: 100

	The minimum distance in pixels from the top of the page to consider triggering for.

method
	Default: auto

	The bounce detection method.

	Options:

	auto: Automatically picks a method based on the device type. mouse is used for desktop browsers and history for mobile.

	mouse: This detects bounces based on the mouse's direction, velocity and distance from the top of the page.

history: 
	This method uses the HTML5 History APIs (or hashes when in an older browser) to duplicate the page in the history. Then when the visitor clicks to go back ExitIntent detects the navigation and shows the dialog. This method is almost foolproof, but could annoy some users. It works best for mobile browsers.

sensitivity
	Default: 10

	The minimum distance the mouse has to have moved in the last 10 mouse events for onBounce to be triggered.

cookieLife
	Default: 1

	The cookie (when localStorage isn't available) expiry age, in days.

scrollDelay
	Default: 500

	The amount of time in milliseconds that bounce events should be ignored for after scrolling, or 0 to disable.

	This is necessary for the case when a user is scrolling and their mouse overshoots the page. As soon as scrolling stops a mouseout event is fired incorrectly triggering a bounce event.

	Because of this ExitIntent waits a small amount of time after the last scroll event before re-enabling bounce detection.

checkReferrer
	Default: false

	Whether or not to check the referring page to see if it's on the same domain and this isn't the first pageview.

aggressive
	Default: false

	This controls whether or not the bounce dialog should be shown on every page view or only on the user's first.

storeName
	Default: ExitIntent-visited

	The name/key to store the localStorage item (or cookie) under.

onBounce
	Default: function() { return ExitIntent; }

	The handler to call when a bounce has been detected. This accepts no arguments since none are necessary.
*/
(function(root, factory) {
	// The Istanbul comments stop the UMD from being counted in coverage reports
	
	// AMD 
	/*if (typeof define === "function" && define.amd) {
		define(function() {
			return factory(root, document, {});
		});
	}

	// Node.js and CommonJS, for testing
	else if (typeof exports !== "undefined") {
		// This is a test run, inject the test environment
		if (global && global.testEnv) {
			factory(global.testEnv, global.testEnv.document, exports);
		} 
		else {
			factory(root, document, exports);
		}
	}

	// Normal browser usage 
	else {
		root.ExitIntent = factory(root, document, {});
	}
	*/
	
	// Normal browser usage 
	root.ExitIntent = factory(root, document, {});

	// `root` and `doc` allow for better compression
})(window, function(root, doc, ExitIntent) {
	/**
	 * Attaches an event to the window.
	 * 
	 * This could accept an element as an argument but that would make testing more difficult.
	 *
	 * @api    private
	 * @param  {Element}   elm The element to attach the event to
	 * @param  {String}    evt The name of the event to attach
	 * @param  {Function}  cb  The event callback
	 */
	var addEvent = function(elm, evt, cb) {
		if (elm.attachEvent) {
			elm.attachEvent("on" + evt, cb);
		}
		else {
			elm.addEventListener(evt, cb, false);
		}
	};


	// There isn't any other library called ExitIntent that would use the
	// variable, but might as well
	//var oldExitIntent = root.ExitIntent;

	/**
	 * Restores the ExitIntent variable in the global scope to its previous value
	 *
	 * @return {Object} ExitIntent
	 */
	 /*
	ExitIntent.noConflict = function() {
		root.ExitIntent = oldExitIntent;

		return this;
	};
	*/

	ExitIntent.version = "1.0.0";

	ExitIntent.options = {
		distance: 100, // The minimum distance in px from the top to consider triggering for
		maxDisplay: 1, // The maximum number of times the dialog may be shown on one page, or 0 for unlimited.  Only applicable when using the mouse based method
		method: "auto", // The bounce detection method
		sensitivity: 10, // The minimum distance the mouse has to have moved in the last 10 mouse events for onBounce to be triggered
		cookieLife: 1, // The cookie (when localStorage isn't available) expiry age, in days
		scrollDelay: 500, // The amount of time in ms that bouncing should be ignored for after scrolling, or 0 to disable
		aggressive: true, // Whether or not to ignore the cookie that blocks initialization unless it's the first pageview
		checkReferrer: false, // Whether or not to check the referring page to see if it's on the same domain and this isn't the first pageview. If true, then if this is a second pageview, it won't trigger.
		waitMsBeforeActivation: 500, //Wait in ms before exit intent detection is activated to avoid false positives
		storeName: "exit-intent-visited", // The key to store the cookie (or localStorage item) under
		onBounce: function() { return ExitIntent; } // The default onBounce handler
	};


	ExitIntent.data = {
		/**
		 * Gets an item's value by key from storage
		 *
		 * @api    public
		 * @param  {String} key The key to retrieve the value from
		 * @return {String}     The retrieved value
		 */
		get: function(key) {
			if (root.localStorage) {
				return root.localStorage.getItem(key) || "";
			}
			else {
				var cookies = doc.cookie.split(";");

				var i = -1,
					data = [],
					cVal = "",
					cName = "",
					length = cookies.length;

				while (++i < length) {
					data = cookies[i].split("=");

					if (data[0] == key) {
						data.shift();

						return data.join("=");
					}
				}

				return "";
			}
		},


		/**
		 * Sets a key to the specified value in storage
		 *
		 * @api    public
		 * @param  {String} key   The key to store under
		 * @param  {String} value The value to store
		 * @return {Object}       The data store, for chained calls
		 */
		set: function(key, value) {
			if (root.localStorage) {
				root.localStorage.setItem(key, value);
			}
			else {
				var dt = new Date();

				dt.setDate(dt.getDate() + ExitIntent.options.cookieLife);
				
				doc.cookie = key + "=" + value + "; expires=" + dt.toUTCString() + ";path=/;";
			}

			return this;
		}
	};


	var shown = 0;

	/**
	 * This proxies calls to onBounce to ensure that it isn't triggered
	 * more than the limit specified in the options allows
	 */
	ExitIntent.onBounce = function() {
		shown++;
 
		if (!this.options.maxDisplay || shown <= this.options.maxDisplay) {
			this.options.onBounce();
		}
	};


	/**
	 * Whether or not the current browser is mobile (or touch based)
	 * 
	 * This is used to decide if the mouse or pushState method should be used.
	 *
	 * @type {Boolean}
	 */
	var isMobileCheck1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(root.navigator.userAgent);
	var isMobileCheck2 = !!(typeof window !== 'undefined' &&
		  ('ontouchstart' in window ||
			(window.DocumentTouch &&
			  typeof document !== 'undefined' &&
			  document instanceof window.DocumentTouch))) ||
		!!(typeof navigator !== 'undefined' &&
      (navigator.maxTouchPoints || navigator.msMaxTouchPoints));
	 
	ExitIntent.isMobile = isMobileCheck1 || isMobileCheck2;
	
	/**
	 * Whether or not ExitIntent is disabled, toggled by default on scroll
	 *
	 * @type {Boolean}
	 */
	ExitIntent.disabled = false;


	/**
	 * Whether or not ExitIntent has been activated.  This prevents activate
	 * from executing more than once
	 *
	 * @type {Boolean}
	 */
	ExitIntent.activated = false;


	/**
	 * Disables ExitIntent.
	 * 
	 * This does _not_ remove the event handlers since that would involve
	 * more complicated code to handle each of the handlers when only one
	 * would ever be attached at a given time.
	 *
	 * @api    public
	 * @return {Object} ExitIntent
	 */
	ExitIntent.disable = function() {
		this.disabled = true;

		return this;
	};


	/**
	 * Enables ExitIntent
	 *
	 * @api    public
	 * @return {Object} ExitIntent
	 */
	ExitIntent.enable = function() {
		this.disabled = false;

		return this;
	};


	/**
	 * Attaches handlers as necessary and sets up ExitIntent
	 */
	ExitIntent.activate = function(method) {
		 
				
		if (method == "history") {
			// The history API for modern browsers
			if ("replaceState" in root.history) {
				// Set data in the current state to let ExitIntent know that it should
				// fire the onBounce handler
				root.history.replaceState({
					isBouncing: true
				}, root.title);

				// Then add a new state to the history so hitting back navigates to
				// the previous added state and fires onBounce
				root.history.pushState(null, root.title);

				// Handle popstate events
				addEvent(root, "popstate", function(e) { 
					if (root.history.state && root.history.state.isBouncing) {
						ExitIntent.onBounce();
					}
				});
			} 
			else if ("onhashchange" in root) { 
			    // And the hash for others 
				// BHT -> ExitIntent Hash Trigger
				root.location.replace("#bht");

				root.location.hash = "";

				addEvent(root, "hashchange", function() { 
					if (root.location.hash.substr(-3) === "bht") {
						ExitIntent.onBounce();
					}
				});
			}
		}
		else {
			var timer = null,
				movements = [],
				scrolling = false;


			addEvent(doc, "mousemove", function(e) {
				movements.unshift({
					x: e.clientX,
					y: e.clientY
				});

				movements = movements.slice(0, 10);
			});


			addEvent(doc, "mouseout", function(e) { 
				if (!ExitIntent.disabled) {
					var from = e.relatedTarget || e.toElement;
 
					if (
						(!from || from.nodeName == "HTML") && 
						e.clientY <= ExitIntent.options.distance && 
						movements.length == 10 &&
						movements[0].y < movements[9].y &&
						movements[9].y - movements[0].y > ExitIntent.options.sensitivity
					) {
						ExitIntent.onBounce();
					}
				}
			});


			// While scrolling using the mouse if it leaves the body the mouseout event is
			// delayed until scrolling stops.  This ensures that the event fired then is ignored.
			 if (this.options.scrollDelay) {
				addEvent(root, "scroll", function(e) {
				 	if (!ExitIntent.disabled) {
						ExitIntent.disabled = true;

						clearTimeout(timer);

						timer = setTimeout(function() {
							ExitIntent.disabled = false;
						}, ExitIntent.options.scrollDelay);
					}
				});
			}
		}
	};


	/**
	 * Initializes ExitIntent.
	 * 
	 * Multiple calls will update options that are not already in use.
	 *
	 * @api    public
	 * @param  {Object} [options] Any options to initialize with
	 * @return {Object}           ExitIntent
	 */
	ExitIntent.init = function(options) {
		options = options || {};

		var key;

		for (key in this.options) {
			if (this.options.hasOwnProperty(key) && !options.hasOwnProperty(key)) {
				options[key] = this.options[key];
			}
		}

		this.options = options;

		if (options.checkReferrer && doc.referrer) {
			var a = doc.createElement("a");
			
			a.href = doc.referrer;

			if (a.host == root.location.host) {
				//Do not activate exit intent if this is not the first page visit. (referrer is from same domain)
				this.data.set(options.storeName, "1");
			}
		}

		if (!this.activated && (options.aggressive || !this.data.get(options.storeName))) {

			var thisClass = this;
			/* Wait before activation of detection of exit intent to avoid false positives*/
			setTimeout(function(){ 
				thisClass.activated = true;
				
				if (options.method === "history" || (options.method === "auto" && thisClass.isMobile)) {
					thisClass.activate("history");
				}
				else {
					thisClass.activate("mouse");
				}
				
				//Do not activate exit intent again, until cookie expires.
				thisClass.data.set(options.storeName, "1");
				
			}, options.waitMsBeforeActivation); 			
		}

		return this;
	};
	
	window.addEventListener('beforeunload', function(event){
	   if(this.activated) {
			event.returnValue = `You have unfinished lessons. Are you sure you want to leave?`;
			ExitIntent.onBounce();
	   }
	}); 
	
	return ExitIntent;
});

