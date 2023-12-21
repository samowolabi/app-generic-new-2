app.templates = app.templates || {};
app.templates.modules = app.templates.modules || {};
app.templates.modules.appHeader = {
    loading: function () {
        var html = `
            <div class="row">
                <div class="col-xs-12">
                    <div class="materialLessonVideo">
                        <div class="materialPlaceHolder"></div>
                    </div>
                </div>
            </div>

            <div class="row materialLesson">
                 <div class="col-xs-12">
                    <div class="container-fluid" style="background: white; padding: 3em;">
                        <div class="col-xs-12" class="materialLessonDescription">
                            <h3  class="materialPlaceHolder" style="height: 30px; margin-top: 0"></h3>
                            <h1  class="materialPlaceHolder" style="height: 60px;"></h1>
                            <p class="materialPlaceHolder" style="height: 80px;"></p>
                        </div>
                        <div class="col-xs-12  col-md-6 materialLessonFile">
                            <div class="materialPlaceHolder"></div>
                        </div>
                        <div class="col-xs-12 col-md-6">
                            <div class="materialLessonRating ">
                                <div class="materialLessonRatingCaption materialPlaceHolder"  style="width: 300px;"> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        return html;
    },
    content : function (props){
        var html = `
            <div class="app_headerDiv">
                <a href='#!/'><div><img src="images/logo.png" alt="logo" class="logo"></div></a>

                ${
                    materialSearchBar.create({
                        defaultValue: props.searchQuery,
                        placeholder: "",
                        showFilterSwitch: true,

                        searchFunc: dashboardInfiniteScrollingLib.callbacks.searchBtn,
                        filterDropdownFunc: dashboardInfiniteScrollingLib.callbacks.filterDropdown,
                        filterFormsContentFunc: app.createFiltersHtmlNew,
                        resetFiltersFunc: app.resetFilterInputs,

                        getSearchandFilterValueCallback: props?.getSearchandFilterValueCallback || function(){}
                    })
                }
                
                <div class="mobileNavRightContainer">
                    <div class="mobileFilterDivTrigger">
                        <svg width="32" height="32" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16.7744" cy="17.2744" r="5.25" stroke="#CFCFCF" stroke-width="1.16667"/><path d="M20.625 21.125L24.3373 24.8373" stroke="#CFCFCF" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>

                    <a class="materialBarDashboardNavLink" href="#" data-button="" data-script="if(!app.sidebarOn){ materialDrawer.show('appSidebarMenu',{direction: 'right', initCallback:function(component){ app.updateUI(); app.sidebarOn = true; }, hideCallback: function(){ app.sidebarOn = false;}});}">
                        <div class="userProfileDiv">
                            <svg width="15.5" height="15.5" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.50033 9.49967C11.6865 9.49967 13.4587 7.72747 13.4587 5.54134C13.4587 3.35521 11.6865 1.58301 9.50033 1.58301C7.3142 1.58301 5.54199 3.35521 5.54199 5.54134C5.54199 7.72747 7.3142 9.49967 9.50033 9.49967Z" fill="#A2A2A2" />
                                <path d="M9.49996 11.4795C5.53371 11.4795 2.30371 14.1395 2.30371 17.417C2.30371 17.6387 2.47788 17.8128 2.69954 17.8128H16.3004C16.522 17.8128 16.6962 17.6387 16.6962 17.417C16.6962 14.1395 13.4662 11.4795 9.49996 11.4795Z" fill="#A2A2A2" />
                            </svg>
                            <p>Rod</p>
                        </div>
                    </a>
                </div>
            </div>
        `;

        html += `
            <script>
                dashboardInfiniteScrollingLib.load();
                materialSearchBar.init()
            </script>
        `;

        return html;
    }
}