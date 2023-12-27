app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.search = {
    loading: function (target) {
        var html = `
                <div class="container marginTop40"> 
                    <div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
                </div>
			`;

        return html;
    },
    content: function (searchQuery) {
        searchQuery = searchQuery || "";

        var html = `
            <style>
                body {
                    /* background: #120d0d !important; */
                }
				.materialBarDashboardNavigation.materialBarDashboard:nth-child(1), h2.materialHeaderBox {
					display: none !important;
				}
            </style>

            ${app.templates.modules.appHeader.content({
                searchQuery: searchQuery,
                getSearchandFilterValueCallback: (data) => redirectToHomeIfValueIsEmpty(data)
            })}

            <input type="hidden" class="addPaginationValue" value="1">
            <section class="app_searchCardsResultContentContainer help-search-result-container">
                <div class="row infiniteScrollingContainer">
                    <!-- Infinite Scroll Cards -->  
                </div>

                <div class="row">
                    <div class="col-sm-12 noResultsDiv" style="display: none;">
                        <h3 class='marginTop8 marginBottom8' style='color: #ffffff; text-align: center;'>No results found</h3>
                    </div>
                </div>
            </section>
        `;

        html += `
            <script>
                function redirectToHomeIfValueIsEmpty(data){
                    if (!data) { return; }
                    if (data.hasOwnProperty("searchValue") && data.searchValue == "") { 
                        router.navigate('/'); 
                    }
                }
            </script>
        `

        return html;
    },
    notFound: function (searchQuery) {

        materialDialog.alert("Oops!",
            `There is no search query added ${searchQuery}. Press 'OK' to be taken to the dashboard where you will be able to access more lessons.`,
            {
                hideCallback: function () {
                    // router.navigate('/');
                }
            }
        );

        return app.templates.pages.search.loading();
    }
}