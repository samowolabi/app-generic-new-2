var materialTopBar = (function () {
    var that = {};

    that.create = function (settings) {
        const { text, icon, countdownTime, link } = settings;

        var htmlWrapper = `
            <div class="materialTopNavBarContainer">
                <!-- Navigation Bar -->
                <div class="materialBarDashboardNavigation materialBarDashboard">
                    <div class="container">
                        <div class="row">
                            <nav
                                class="navbar navbar-expand-lg navbar-inverse materialBarDashboardNavBar materialBarDashboardNavWidth">
                                <div class="navbar-header">
                                    <!-- 
                                    <button type="button" class="navbar-toggle materialBarDashboardNavbarToggle announcementNotifications" data-button="" data-script="app.showAnnoucementDialog(true)" style="float: left; margin: 5px 5px 3px; position: relative; display: block">
                                        <span class="sr-only">Notifications</span>
                                        <span class="fa fa-envelope" style="color: white;  font-size: 21px;">
                                            <span class="num animated headShake fast infinite announcementNotificationsCounter" style="position: absolute; right: 1px; top: 6px; color: #fff; background: red; padding: 2px 5px; font-family: 'Lato', sans-serif; font-size: 13px; border-radius: 18px; font-weight: bold;">1</span>
                                        </span>
                                    </button>
                                    -->
                                    <button type="button" class="navbar-toggle materialBarDashboardNavbarToggle" data-button
                                        data-script="if(!app.sidebarOn){ materialDrawer.show('appSidebarMenu',{direction: 'right', initCallback:function(component){ app.updateUI(); app.sidebarOn = true; }, hideCallback: function(){ app.sidebarOn = false;}});}">
                                        <span class="sr-only">Toggle navigation</span>
                                        <span class="icon-bar"></span>
                                        <span class="icon-bar"></span>
                                        <span class="icon-bar"></span>
                                    </button>
                                    <div class="materialBarDashboardStandardImage">
                                        <img
                                            src="https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/logo-text.min.svg">
                                    </div>
                                    <a class="materialBarDashboardSearch"></a>
                                    <a class="navbar-brand materialBarDashboardBackBtn materialBarDashboardNavLink" href="#!">
                                        <i class="fa fa-angle-left"></i>&nbsp;<span>Go Back</span>
                                    </a>
                                </div>

                                <div class="collapse navbar-collapse materialBarDashboardNavbarCollapse"
                                    id="example-navbar-collapse">
                                    <div class="materialBarDashboardDiv">
                                        <img class="materialBarDashboardImage"
                                            src="https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/logo-text.min.svg">
                                    </div>
                                    <ul class="nav navbar-nav navbar-right">
                                        <!-- <li><a class="materialBarDashboardNavLink" href="#" data-button>My Classes</a></li> -->

                                        <!-- 
                                        <li>
                                            <a class="materialBarDashboardNavLink" href="#" data-button data-button data-script="app.showAnnoucementDialog(true)">
                                            <i class="fa fa-envelope" aria-hidden="true"></i> UNREAD MESSAGE (1)
                                            </a>
                                        </li>
                                        -->
                                        <li>
                                            <a class="materialBarDashboardNavLink" href="#" data-button data-button
                                                data-script="if(!app.sidebarOn){ materialDrawer.show('appSidebarMenu',{direction: 'right', initCallback:function(component){ app.updateUI(); app.sidebarOn = true; }, hideCallback: function(){ app.sidebarOn = false;}});}">
                                                <i class="fa fa-user" aria-hidden="true"></i> <span
                                                    class="valueFirstName">YOU</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
                <!--  End Navigation Bar -->

                <a href="${link || "#"}">
                    <div class="materialTopBarContainer">
                        <div class="materialTopBarDiv">
                            <img src="${icon}" width="40" height="40" />
                            <p style="margin:0">${text}</p>

                            <div> 
                                <span data-countdown="${countdownTime}"}>
                                    <span data-show-if-long-hours>
                                        <span data-days>00</span> Days</span>
                                        <span data-hide-if-long-hours>
                                            <span data-hours-total>00</span>:
                                            <span data-minutes >00</span>:
                                            <span data-seconds>00</span>
                                        </span>
                                    </span>
                            </div>
                        </div>
                    </div>
                </a>

            </div>
        `;

        return htmlWrapper;
    }

    that.init = (function () {
        // document.querySelector('.materialTopBarContainer[data-click]').addEventListener('click', that.handleOnClick);

        var updateBackHref = function (hashHistory) {
            console.error('hashHistory Loaded', hashHistory, new Date().getTime());
            console.error('Nav 1', $(".materialBarDashboardBackBtn").attr("href"));
            $(".materialBarDashboardBackBtn").attr("href", `#!${hashHistory[hashHistory.length - 2] || ""}`);
            console.error('Nav 2', $(".materialBarDashboardBackBtn").attr("href"));
        }
        
        updateBackHref(app.hashHistory);
    })

    return that;
})();