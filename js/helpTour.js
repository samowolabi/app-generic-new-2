var helpTour = (function () {
    var that = {};

    that.getCurrentDateTimeISO = function () {
        var currentDate = new Date();
        return currentDate.toISOString();
    }

    that.helpButtonClicked = function (currentRoute, courseOrLessonId) {
        if (!currentRoute) { // If no route is passed, get the current route
            currentRoute = app.currentRoute;

            if (currentRoute == '') {
                currentRoute = 'home';
            }
            if (currentRoute.includes('course')) {
                currentRoute = 'course';
            }
            if (currentRoute.includes('lesson')) {
                currentRoute = 'lesson';
            }
            if (currentRoute.includes('profile')) {
                currentRoute = 'profile';
            }
            if (currentRoute.includes('sideBarMenu')) {
                currentRoute = 'sideBarMenu';
            }
            if (currentRoute.includes('search')) {
                currentRoute = 'search';
            }
            if (currentRoute.includes('filter')) {
                currentRoute = 'filter';
            }
        }

        // Save the current date for the current route
        app.data.user.profile.help = app.data.user.profile.help || {}
        app.data.user.profile.help[currentRoute] = that.getCurrentDateTimeISO();

        switch (currentRoute) {
            case 'home':
                config.help.home();
                break;
            case 'course':
                config.help.course();
                break;
            case 'lesson':
                config.help.lesson();
                break;
            case 'profile':
                config.help.profile();
            case 'sideBarMenu':
                config.help.sideBarMenu();
                break;
            case 'search':
                config.help.search();
                break;
            case 'filter':
                config.help.filter();
                break;
            default:
                // Handle the default case if needed
                break;
        }
    };

    that.pageLoad = function (currentRoute, courseOrLessonId) {
        if (!currentRoute) {
            return;
        }

        // If url has a tour key and and the current route is lesson and the lesson is expired,
        if(config.help.checkIfTourKeyIsInUrl()) {
            if (currentRoute == 'lesson' && app.data.lesson[courseOrLessonId].expired === true) {
                config.help.demo_lesson();
            } else if (currentRoute == 'course') {
                config.help.demo_course();
            }
        }

        // If the user has already seen the tour for the current route, 
        // don't show it again, but if the user has not seen the tour, 
        // show the tour 
        if (
            app &&
            app.hasOwnProperty('data') && app.data.hasOwnProperty('user') &&
            app.data.user.hasOwnProperty('profile') && app.data.user.profile.hasOwnProperty('help') &&
            app.data.user.profile.help.hasOwnProperty(currentRoute) && app.data.user.profile.help[currentRoute]
        ) {
            return;
        }

        that.helpButtonClicked(currentRoute, courseOrLessonId);
    }

    return that;
}());