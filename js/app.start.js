function ieOldIE() {
	var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
	var msie = ua.indexOf('MSIE ') >= 0; // IE 10 or older
	var trident = ua.indexOf('Trident/') >= 0; //IE 11
	var edge = ua.indexOf('Edge/') >= 0;//Ie Edge
	return (msie && !edge) || (trident && !edge);
}

if (ieOldIE()) {
	materialDialog.alert("Your web browser is too old...", "You are using Internet Explorer 11 which was released in 2013 and is no longer recommended by Microsoft. To get the best experience out of <i>The Piano Encyclopedia</i> and be able to access all of our lessons and gifts, we recommend you to upgrade to any <i>modern</i> web browser. <br><br><b>We recommend Google's Chrome web browser.</b> Please click on the following link to go to Google's page and upgrade your web browser for free:<br><br><a href='https://www.google.com/chrome/' target='_blank'>Download Google's Chrome modern web browser for free &raquo;</a><br><br> <b>Feel free to continue, most lessons will work, but some of them will not until you upgrade your browser - and you will be missing out the best parts.</b>", {
		"buttonCaption": "Continue"
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
	before: function (done, params) {

		// doing some async operation
		if (app.currentRoute === "" || app.currentRoute === "/newest" || app.currentRoute === "/expiring") {
			app.dashboardScrollPosition = $(document).scrollTop();
		}

		//Add micro delay between each page on purpose so ripple effect is visible and page seems more responsive  
		setTimeout(done, 250);
	},
	after: async function (params) {
		// after resolving 

		app.currentRoute = function (router) {
			var route = router._lastRouteResolved.url;

			// Check if the current route is the same as the location href (with or without trailing slash), or a trailing slash, and if so set as "" 
			if (
				(route === window.location.href) ||
				((route + "/") === window.location.href) ||
				(route === (window.location.href + "/")) ||
				(route === "/")
			) {
				return "";
			} else {
				return route;
			}
		}(router);

		// Cleans up URL of email tracking to avoid double tracking  email clicks
		app.cleanUpUrlEmailTracking();

		if (!app.loaded) {
			app.loaded = true;
			app.callback("path=" + app.currentRoute + "&pageview=y&onload=y");
		}
		else {
			app.callback("path=" + app.currentRoute + "&pageview=y");
		}

		// Track page views in this session
		app.session.pageViews++;

		// Update Back button URL
		// If the previous route is not the same as the current route, push it to the history else pop it

		if (app.data) {
			app.refeshBackButtonUrl();
		}
	},
	leave: function (params) {
		// when you are going out of the that route

	}
});

router.on({
	'/oldlesson/:lessonId': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.oldlesson.loading(); },
			contentCondition: function () { return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
			contentTrue: function () { return app.templates.pages.oldlesson.content(params.lessonId); },
			contentFalse: function () { return app.templates.pages.oldlesson.notFound(params.lessonId); },
			callback: function () { if (app.data.user.profile.rewardPoints > 100) { dialogsCompleteProfileFlow(); } }
		});

		app.routeId = "/lesson/";
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'/lesson/:lessonId/book': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.lesson.loading(); },
			contentCondition: function () { return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
			contentTrue: function () { return app.templates.pages.lesson.content(params.lessonId); },
			contentFalse: function () { return app.templates.pages.lesson.notFound(params.lessonId); },
			callback: function () {
                var getRelatedVideoUrl = function(lessonId){
			        //TODO: all this is hardcoded for now, but it should be dynamic in the future.
 
                    // Calculate the adjusted ID to get the associated video URL (only works for The Ultimate Collection of Piano Music)
                    var adjustedId =  parseInt(lessonId) - 100000;
                    if(!adjustedId){ return null;}

                    // Check if app.data.lesson[adjustedId] exists
                    var lessonData = app.data.lesson[adjustedId];
                    if (!lessonData) {
                        console.error("Lesson data not found for the given ID  for getting related video URL");
                        return null;
                    }

                    // Access the content property
                    return lessonData.content;
                };
                var relatedVideoUrl = getRelatedVideoUrl(params.lessonId);
                var additionalRelatedVideoUrl = relatedVideoUrl ? ("&relatedVideoUrl=" + encodeURIComponent(relatedVideoUrl)): "";

				//helpTour.pageLoad('lesson');
				materialDialog.iframe("https://pianoencyclopedia.com/en/viewers/interactive-pdf-reader/?file=" + encodeURIComponent(app.data.lesson[params.lessonId].attachmentUrl) + additionalRelatedVideoUrl + "#auto", {})
			}
		});

		app.routeId = "/lesson/book/";
		window.scrollTo(0, 0);
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'/lesson/:lessonId': function (params) { //Change newLesson to just lesson and change "lesson" to "oldLesson". Same for newCourse and anything new
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.lesson.loading(); },
			contentCondition: function(){ return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
			contentTrue: function () { return app.templates.pages.lesson.content(params.lessonId); },
			contentFalse: 	  function(){ return app.templates.pages.lesson.notFound( params.lessonId );},
			callback:  function() {
				//helpTour.pageLoad('lesson', params.lessonId);
				if(app.data.user.profile.rewardPoints > 100) { dialogsCompleteProfileFlow(); } 
				window.scrollTo(0, 0);
			} 
		});


		app.routeId = "/lesson/";
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'/search/:searchQuery': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.search.loading(); },
			contentCondition: function () { return true; },
			contentTrue: function () { return app.templates.pages.search.content(params.searchQuery); },
			contentFalse: function () { return app.templates.pages.search.notFound(params.searchQuery); },
			callback: function () { 
				app.setCurrentRouteBottomNavActive();
				//helpTour.pageLoad('search');
				window.scrollTo(0, 0);
			}
		});

		app.routeId = "/search/";
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'/filter/:filterQuery': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.filter.loading(); },
			contentCondition: function () { return true; },
			contentTrue: function () { return app.templates.pages.filter.content(params.filterQuery); },
			contentFalse: function () { return app.templates.pages.filter.notFound(params.filterQuery); },
			callback: function () {
				app.setCurrentRouteBottomNavActive();
				//helpTour.pageLoad('filter');
				window.scrollTo(0, 0);
			}
		});

		app.routeId = "/search/";
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'/old-course/:courseId': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.oldcourse.loading(); },
			contentCondition: function () { return (typeof app.data.course[params.courseId] !== "undefined"); },
			contentTrue: function () { return app.templates.pages.oldcourse.content(params.courseId); },
			contentFalse: function () { return app.templates.pages.oldcourse.notFound(params.courseId); },
			callback: function () { }
		});

		app.routeId = "/course/";
		window.scrollTo(0, 0);
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'/course/:courseId/lesson/:lessonId': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.course.loading(); },
			contentCondition: function () { return (typeof app.data.course[params.courseId] !== "undefined"); },
			contentTrue: function () { return app.templates.pages.course.content(params.courseId, params.lessonId); },
			contentFalse: function () { return app.templates.pages.course.notFound(params.courseId); },
			callback: function () { }
		});

		app.routeId = "/course/";
		window.scrollTo(0, 0);
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'/course/:courseId': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.course.loading(); },
			contentCondition: function(){ return (typeof app.data.course[params.courseId] !== "undefined"); },
			contentTrue: function () { return app.templates.pages.course.content(params.courseId); },
			contentFalse: 	  function(){ return app.templates.pages.course.notFound( params.courseId );},
			callback: function () { 
				//helpTour.pageLoad('course', params.courseId);
				window.scrollTo(0, 0);
			}
		});


		app.routeId = "/course/";
		$(".materialBarDashboardBackBtn").fadeIn();
	},

	'': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.newHome.loading(); },
			contentCondition: function () { return true; },
			contentTrue: function () { return app.templates.pages.newHome.content(); },
			callback: function () { 
				app.setCurrentRouteBottomNavActive();
				//helpTour.pageLoad('home');
				$(document).scrollTop(app.dashboardScrollPosition || 0); 
			}
		});

		app.routeId = "/home/";
		$(".materialBarDashboardBackBtn").hide();
	},

	'/history/': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.history.loading(); },
			contentCondition: function () { return true; },
			contentTrue: function () { return app.templates.pages.history.content(); },
			callback: function () { }
		});


		app.routeId = "/history/";
		$(".materialBarDashboardBackBtn").fadeIn();
	},
	/*
	'/lesson/:lessonId/rating/:rating': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.lesson.loading();}, 
				contentCondition: function(){ return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
				contentTrue:  	  function(){ return app.templates.pages.lesson.content( app.data.lesson[params.lessonId], 	app.data.cards	);},
				contentFalse: 	  function(){ return app.templates.pages.lesson.notFound( params.lessonId );} 
			}); 
    },
	*/
	'/old-dashboard/': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.dashboard.loading(); },
			contentCondition: function () { return true; },
			contentTrue: function () { return app.templates.pages.dashboard.sortedNewestFirst(app.data); },
			callback: function () { $(document).scrollTop(app.dashboardScrollPosition || 0); }
		});
		app.routeId = "/dashboard/";
		$(".materialBarDashboardBackBtn").hide();

	},
	'/expiring/': function (params) {
		//If we are not on dashboard, create html. Else simply, re-order.
		if (app.routeId.startsWith("/dashboard/")) {

			app.html({
				target: "#dashboard-lessons",
				loading: function () { return app.templates.pages.dashboard.loading(); },
				contentCondition: function () { return true; },
				contentTrue: function () { return app.templates.pages.dashboard.__createCourses(app.data, app.data.global.courses.sortedExpiringFirst); },
				callback: function () { $('html, body').animate({ scrollTop: $('main').offset().top }, 500, 'linear'); $("input[value='/expiring/']").prop("checked", true); }

			});
		}
		else {

			app.html({
				target: "#content",
				loading: function () { return app.templates.pages.dashboard.loading(); },
				contentCondition: function () { return true; },
				contentTrue: function () { return app.templates.pages.dashboard.sortedExpiringFirst(app.data); },
				callback: function () { $(document).scrollTop(app.dashboardScrollPosition || 0); $("input[value='/expiring/']").prop("checked", true); }

			});
		}

		app.routeId = "/dashboard/expiring/";
		$(".materialBarDashboardBackBtn").hide();

	},
	'/newest/': function (params) {
		if (app.routeId.startsWith("/dashboard/")) {

			app.html({
				target: "#dashboard-lessons",
				loading: function () { return app.templates.pages.dashboard.loading(); },
				contentCondition: function () { return true; },
				contentTrue: function () { return app.templates.pages.dashboard.__createCourses(app.data, app.data.global.courses.sortedNewestFirst); },
				callback: function () { $('html, body').animate({ scrollTop: $('main').offset().top - 85 }, 500, 'linear'); $("input[value='/newest/']").prop("checked", true); }
			});
		}
		else {
			app.html({
				target: "#content",
				loading: function () { return app.templates.pages.dashboard.loading(); },
				contentCondition: function () { return true; },
				contentTrue: function () { return app.templates.pages.dashboard.sortedNewestFirst(app.data); },
				callback: function () { $(document).scrollTop(app.dashboardScrollPosition || 0); $("input[value='/newest/']").prop("checked", true); }
			});
		}

		app.routeId = "/dashboard/newest/";
		$(".materialBarDashboardBackBtn").hide();

	},
	'/profile/': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.profile.loading(); },
			contentCondition: function () { return true; },
			contentTrue: function () { return app.templates.pages.profile.content(); },
			callback: function () { 
				//helpTour.pageLoad('profile');
				$(document).scrollTop(app.dashboardScrollPosition || 0); 
			}
		});

		window.scrollTo(0, 0);
		app.routeId = "/profile/";
		$(".materialBarDashboardBackBtn").fadeIn();

	},
	'/rewards/': function (params) {
		app.html({
			target: "#content",
			loading: function () { return app.templates.pages.profile.loading(); },
			contentCondition: function () { return true; },
			contentTrue: function () { return app.templates.pages.profile.content(); },
			callback: function () { $('html, body').animate({ scrollTop: $('.rewardsHeader').offset().top - 100 }, 500, 'linear'); }
		});

		app.routeId = "/rewards/";
		$(".materialBarDashboardBackBtn").fadeIn();

	},
	'*': function () {
		console.log("not found");
	}
}).resolve();

var plaformCustomBehavior = function () {
	var that = {};
	var hidePremium = function () {
		$("html").addClass("app-hide-premium");
	};

	var hideAds = function () {
		$("html").addClass("app-hide-ads");
	};

	var hideSignup = function () {
		$("html").addClass("app-hide-signup");
	};

	var hideCustomDialogs = function () {
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

	var getPlatformId = function () {
		var platform = getParameterByName("platform");
		var electron = getParameterByName("electron") ? "-electron" : "";
		var cordova = getParameterByName("cordova") ? "-cordova" : "";
		//appleStore
		return platform + electron + cordova;
	};

	var init = function (platform) {
		var platform = getPlatformId();

		console.log("Platform Custom Behavior", platform);

		if (platform == "iphone-cordova" || platform == "mac-electron") {
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