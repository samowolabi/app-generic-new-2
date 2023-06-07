function ieOldIE() {
    var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    var msie = ua.indexOf('MSIE ') >= 0; // IE 10 or older
    var trident = ua.indexOf('Trident/') >= 0; //IE 11
	var edge = ua.indexOf('Edge/') >= 0;//Ie Edge
    return (msie && !edge)  || (trident && !edge);               
}

if(ieOldIE()){
	materialDialog.alert("Your web browser is too old...", "You are using Internet Explorer 11 which was released in 2013 and is no longer recommended by Microsoft. To get the best experience out of <i>The Piano Encyclopedia</i> and be able to access all of our lessons and gifts, we recommend you to upgrade to any <i>modern</i> web browser. <br><br><b>We recommend Google's Chrome web browser.</b> Please click on the following link to go to Google's page and upgrade your web browser for free:<br><br><a href='https://www.google.com/chrome/' target='_blank'>Download Google's Chrome modern web browser for free &raquo;</a><br><br> <b>Feel free to continue, most lessons will work, but some of them will not until you upgrade your browser - and you will be missing out the best parts.</b>", {
	"buttonCaption" : "Continue"
	});
}
 
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'
var router = new Navigo(config.root, useHash, hash);
app.routeId = "";
app.currentRoute = "";
app.loaded = false; 
app.hashHistory = [];

router.hooks({
  before: function(done, params) { 
	
	// doing some async operation
	if(app.currentRoute === "" || app.currentRoute === "/newest"  || app.currentRoute === "/expiring" ){
		app.dashboardScrollPosition = $(document).scrollTop(); 
	}  
	  
	//Add micro delay between each page on purpose so ripple effect is visible and page seems more responsive  
	setTimeout(done, 250);
  },
  after: function(params) {  
	  // after resolving 
	  
	  app.currentRoute = function(router){
		  var route = router._lastRouteResolved.url; 
		  
		  //Check if the current route is the same as the location href (with or without trailing slash), or a trailing slash, and if so set as "" 
		  if(
			  (route ===  window.location.href) || 
			  ((route + "/") ===  window.location.href) || 
			  (route ===  (window.location.href+ "/"))  ||
			  (route === "/") 
		  ){
				return "";
		  }else{
				return route;  
		  }
		  
	  }(router);
	   
	  //Cleans up URL of email tracking to avoid double tracking  email clicks
	  app.cleanUpUrlEmailTracking();
	  
	  if(!app.loaded){
		app.loaded = true;
		app.callback("path=" + app.currentRoute + "&pageview=y&onload=y");
	  }
	  else{
		app.callback("path=" + app.currentRoute + "&pageview=y");
	  }
	  
	  
	  //Track page views in this session
	  app.session.pageViews++; 
	  
	  //Update Back button URL
	  app.hashHistory.push(app.currentRoute);
	  var backHrefDefault =  "#!/";
	  app.backHref = backHrefDefault;
	  var hashHistoryReversed = app.hashHistory.reverse();
	  var updateBackHref = function(hashHistoryReversed){
		  for (const route of hashHistoryReversed) {
				var re = /(lesson|course|profile|rewards)/;
				var matches = re.exec(route);
				if(matches && matches.length){
					continue;
				}
				app.backHref =  "#!" + route;
				$(".materialBarDashboardBackBtn").attr("href", app.backHref); 
				app.hashHistory = [];
				return true;
		  }
	  }(hashHistoryReversed);
	 
	  
  },
  leave: function (params) {
      // when you are going out of the that route
	  
  }
});

router.on({
    '/lesson/:lessonId': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.lesson.loading();}, 
				contentCondition: function(){ return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
				contentTrue:  	  function(){ return app.templates.pages.lesson.content( params.lessonId );},
				contentFalse: 	  function(){ return app.templates.pages.lesson.notFound( params.lessonId );},
				callback : 		  function(){ if(app.data.user.profile.rewardPoints > 100) { dialogsCompleteProfileFlow(); } } 
			}); 
			
		app.routeId = "/lesson/";	
		window.scrollTo(0, 0);	
		$(".materialBarDashboardBackBtn").fadeIn();		
    }, 
	'/lesson/:lessonId/book': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.lesson.loading();}, 
				contentCondition: function(){ return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
				contentTrue:  	  function(){ return app.templates.pages.lesson.content( params.lessonId );},
				contentFalse: 	  function(){ return app.templates.pages.lesson.notFound( params.lessonId );},
				callback : 		  function(){ materialDialog.iframe("https://pianoencyclopedia.com/en/viewers/interactive-pdf-reader/?file="+ encodeURIComponent(app.data.lesson[params.lessonId].attachmentUrl) +"#auto", {}) } 
			}); 
			
		app.routeId = "/lesson/book/";	
		window.scrollTo(0, 0);	
		$(".materialBarDashboardBackBtn").fadeIn();		
    }, 
	 '/course/:courseId': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.course.loading();}, 
				contentCondition: function(){ return (typeof app.data.course[params.courseId] !== "undefined"); },
				contentTrue:  	  function(){ return app.templates.pages.course.content( params.courseId );},
				contentFalse: 	  function(){ return app.templates.pages.course.notFound( params.courseId );},
				callback : 		  function(){} 
			}); 
			
		app.routeId = "/course/";	
		window.scrollTo(0, 0);	
		$(".materialBarDashboardBackBtn").fadeIn();		
    }, 
	'': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.dashboardInfiniteScrolling.loading(); }, 
				contentCondition: function(){ return true; },
				contentTrue:  	  function(){ return app.templates.pages.dashboardInfiniteScrolling.content();}, 
				callback : 		  function(){ } 
			}); 
		
		
		app.routeId = "/dashboard-infinite-scrolling/";	 	
		$(".materialBarDashboardBackBtn").hide();	
    },/*
	'/lesson/:lessonId/rating/:rating': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.lesson.loading();}, 
				contentCondition: function(){ return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
				contentTrue:  	  function(){ return app.templates.pages.lesson.content( app.data.lesson[params.lessonId], 	app.data.cards	);},
				contentFalse: 	  function(){ return app.templates.pages.lesson.notFound( params.lessonId );} 
			}); 
    },*/
	'/old-dashboard/': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
				contentCondition: function(){ return true; },
				contentTrue:  	  function(){ return app.templates.pages.dashboard.sortedNewestFirst(app.data);}, 
				callback : 		  function(){ $(document).scrollTop(app.dashboardScrollPosition || 0); }
			}); 
		app.routeId = "/dashboard/";
		$(".materialBarDashboardBackBtn").hide();
		
    }, 
	'/expiring/': function (params) {  
		//If we are not on dashboard, create html. Else simply, re-order.
		if(app.routeId.startsWith("/dashboard/")){ 
			
			app.html({
					target: "#dashboard-lessons", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.__createCourses(app.data, app.data.global.courses.sortedExpiringFirst);}, 
					callback : 		  function(){ $('html, body').animate({ scrollTop: $('#dashboard-lessons-header').offset().top-85},500,'linear'); $("input[value='/expiring/']").prop("checked", true); }
				
			}); 
		}
		else{
			
			app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.sortedExpiringFirst(app.data);}, 
					callback : 		  function(){ $(document).scrollTop(app.dashboardScrollPosition || 0); $("input[value='/expiring/']").prop("checked", true); }
					
			}); 
		}
		 
		app.routeId = "/dashboard/expiring/";
		$(".materialBarDashboardBackBtn").hide();

    }, 
	'/newest/': function (params) {  
		if(app.routeId.startsWith("/dashboard/")){
			
			app.html({
					target: "#dashboard-lessons", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.__createCourses(app.data, app.data.global.courses.sortedNewestFirst);}, 
					callback : 		  function(){ $('html, body').animate({ scrollTop: $('#dashboard-lessons-header').offset().top-85},500,'linear'); $("input[value='/newest/']").prop("checked", true); }
			}); 
		}
		else{
			app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.sortedNewestFirst(app.data);}, 
					callback : 		  function(){ $(document).scrollTop(app.dashboardScrollPosition || 0); $("input[value='/newest/']").prop("checked", true); }
			}); 
		}	
		  
		app.routeId = "/dashboard/newest/";
		$(".materialBarDashboardBackBtn").hide();

    }, 
	'/profile/': function (params) {  
		app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.profile.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.profile.content();}, 
					callback : 		  function(){}
		}); 
		
		window.scrollTo(0, 0);  
		app.routeId = "/profile/";
		$(".materialBarDashboardBackBtn").fadeIn();		

    }, 
	'/rewards/': function (params) {  
		app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.profile.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.profile.content();}, 
					callback : 		  function(){ $('html, body').animate({ scrollTop: $('.rewardsHeader').offset().top-100},500,'linear'); }
		}); 
		 
		app.routeId = "/rewards/";
		$(".materialBarDashboardBackBtn").fadeIn();		

    }, 
    '*': function () {
		console.log("not found");
    }
}).resolve();

var plaformCustomBehavior = function(){
	var that = {};
	var hidePremium = function(){
		$("html").addClass("app-hide-premium");
	};
	
	var hideAds = function(){
		$("html").addClass("app-hide-ads");
	};
	
	var hideSignup = function(){
		$("html").addClass("app-hide-signup");
	};
	
	var hideCustomDialogs = function(){
		$("html").addClass("app-custom-dialogs");
	};
	

	
	function getParameterByName(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
	
	/*
	MAC DESKTOP:
	safari=true
	version=
	versionNumber=
	mac=true
	desktop=true
	webkit=true
	name=safari
	platform=mac
	
	IPHONE:
	nativeMobileWrapper=cordova
	platform=iphone
	cordova=true
	nativeMobile=true
	ios=true
	mobile=true
	iphone=true
	*/
	var getPlatformId = function(){
		var platform = getParameterByName("platform");
		var electron = getParameterByName("electron") ? "-electron" : "";
		var cordova  = getParameterByName("cordova") ? "-cordova" : ""; 
		//appleStore
		return platform + electron + cordova;
	}; 	
	
	var init = function(platform){
		var platform = getPlatformId();
		
		console.log("Platform Custom Behavior", platform);
		
		if(platform == "iphone-cordova" || platform == "mac-electron" ){
			hidePremium();
			hideAds();
			hideSignup();
			hideCustomDialogs(); 
		} 
	}
	
	
	init();
	//that.run = run;
	//return that;	
}();