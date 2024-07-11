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
        let defaultSortFilter = app.getURLParams()?.type || 'courses';

        // Get Filter Pills
        const getFilterPills = function () {
            let sortFilter = app.getURLParams()?.type === 'lessons' ? 'lessonsIds' : 'coursesIds';
            
            let exploreData = app.data.explore[sortFilter];

            let allPillsData = [
                { name: 'All', value: '', active: true }
            ]

            let filterPillsData = Object.keys(exploreData).map((item, index) => {
                return {
                    name: item, value: item, active: false
                }
            })

            return [...allPillsData, ...filterPillsData];
        }

        // console.error('getFilterPills', getFilterPills());

        var html = `
            <section class="app_coursesCardsFilterPills">	
                ${
                    materialFilterPills.create({
                        defaultValue: filterQuery,
                        activeSortFilterKey: defaultSortFilter,
                        list: getFilterPills(),
                        getClickedPillData: (data, activeSortFilterKey) => populateCards(data, activeSortFilterKey)
                    })
                }
            </section>

            <section class="filterDropdownSection marginTop10">
                <div class="materialInputWrap">
                    <select class="materialInputControl materialThemeDark" required="">
                        <option value="courses" selected>Show Courses</option>
                        <option value="lessons">Show Lessons</option>
                    </select>
                    <span class="materialInputHighlight"></span>
                    <span class="materialInputBar materialThemeDark"></span>
                    <label class="materialInputLabel materialThemeDark">Select</label>
                </div>
            </section>

            <input type="hidden" class="addPaginationValue" value="1">
            <section class="app_searchCardsResultContentContainer help-filter-result-container">
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
                function populateCards(data, activeSortFilterKey) {
                    // console.error({ data, activeSortFilterKey })

                    if (!data) { 
                        document.querySelector('.infiniteScrollingContainer').innerHTML = '';
                        router.navigate('/');
                        return;
                    }

                    console.log({data, activeSortFilterKey})

                    document.querySelector('.infiniteScrollingContainer').innerHTML = '';

                    const columnWidthClass = 'cardSearchResult ' + config.layout.searchResults;
                    const mappedCards = data.map(function (item) {
                        return activeSortFilterKey === 'coursesIds' ? 
                            app.createCourseCard(item.id, item.data, columnWidthClass) : 
                            app.createLessonCard(item.id, item.data, columnWidthClass);
                    })

                    const html = mappedCards.join('');
                    document.querySelector('.infiniteScrollingContainer').innerHTML = html;

                    material.init(".infiniteScrollingContainer");
                }

                function onChangeSortFilter() {
                    document.querySelector('section.filterDropdownSection select').addEventListener('change', function (e) {
                        // Get the data after ? in the url, if there is any
                        let urlData = window.location.hash.split('?');

                        let url = '';
                        if (urlData.length > 1) {
                            url += urlData[0] + '?type=' + e.target.value;
                        } else {
                            url += window.location.hash + '?type=' + e.target.value;
                        }
                        
                        router.navigate(url);
                    });
                }

                // Set the default sort filter
                if (app.getURLParams()?.type) {
                    document.querySelector('section.filterDropdownSection select').value = app.getURLParams()?.type || 'courses';
                }

                materialFilterPills.init();
                onChangeSortFilter();
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