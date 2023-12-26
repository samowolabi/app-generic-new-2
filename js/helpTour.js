var helpTour = (function () {
    var that = {};

    that.init = function () {
        var currentRoute = app.currentRoute;

        switch (true) {
            case currentRoute === '':
                config.help.home();
                break;
            case currentRoute.includes('course'):
                config.help.course();
                break;
            case currentRoute.includes('lesson'):
                config.help.lesson();
                break;
            case currentRoute.includes('profile'):
                config.help.profile();
                break;
            default:
                // Handle the default case if needed
                break;
        }
    };

    return that;
}());