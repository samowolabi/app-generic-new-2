var helpTour = (function () {
    var that = {};

    that.getCurrentDate = function () {
        // Get the current date
        var currentDate = new Date();

        // Extract day, month, and year
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1; // Months are zero-based
        var year = currentDate.getFullYear();

        // Add leading zeros if needed
        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;

        // Create the formatted date string
        var formattedDate = day + '-' + month + '-' + year;

        return formattedDate;
    }

    that.helpButtonClicked = function (currentRoute) {
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
        }

        // Save the current date for the current route
        app.data.user.profile.help = app.data.user.profile.help || {}
        app.data.user.profile.help[currentRoute] = that.getCurrentDate();

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
            default:
                // Handle the default case if needed
                break;
        }
    };

    that.pageLoad = function (currentRoute) {
        if (!currentRoute) {
            return;
        }

        if (
            app &&
            app.hasOwnProperty('data') && app.data.hasOwnProperty('user') &&
            app.data.user.hasOwnProperty('profile') && app.data.user.profile.hasOwnProperty('help') &&
            app.data.user.profile.help.hasOwnProperty(currentRoute) && app.data.user.profile.help[currentRoute]
        ) { return; }

        that.helpButtonClicked(currentRoute);
    }

    return that;
}());