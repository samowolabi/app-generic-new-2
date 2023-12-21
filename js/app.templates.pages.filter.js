app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.filter = {
    loading: function (target) {
        var html = `
                <div class="container marginTop40"> 
                    <div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
                </div>
			`;

        return html;
    },
    content: function (filterQuery) {
        filterQuery = filterQuery || "";

        console.error("filterQuery", filterQuery)

        // Filter Pills
        let filterPillsData = Object.keys(app.data.explore).map((item, index) => {
            return {
                name: item, value: item, active: false
            }
        })

        // Push "All" filter pill to the beginning of the array
        filterPillsData.unshift({
            name: 'All', value: '', active: true
        })

        var html = `
            <section class="app_coursesCardsFilterPills">	
                ${
                    materialFilterPills.create({
                        defaultValue: filterQuery,
                        list: filterPillsData,
                        getClickedPillData: (data) => populateCards(data)
                    })
                }
            </section>

            <section class="app_searchCardsResultContentContainer">
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
                function populateCards(data) {
                    if (!data) { 
                        document.querySelector('.infiniteScrollingContainer').innerHTML = '';
                        router.navigate('/');
                        return;
                    }

                    const columnWidthClass = 'cardSearchResult ' + config.layout.searchResults;

                    const mappedCards = data.map(function (item) {
                        return app.createCourseCard(item.courseId, item.course, columnWidthClass)
                    })

                    const html = mappedCards.join('');
                    document.querySelector('.infiniteScrollingContainer').innerHTML = html;
                }

                materialFilterPills.init();
            </script>
        `

        return html;
    },
    notFound : function (filterQuery){
	
		materialDialog.alert("Oops!", 
			`There is no search query added ${filterQuery}. Press 'OK' to be taken to the dashboard where you will be able to access more lessons.`,
			{
				hideCallback: function(){
					// router.navigate('/');
				}
			}
		);	 
				
		return app.templates.pages.search.loading();
	}
}