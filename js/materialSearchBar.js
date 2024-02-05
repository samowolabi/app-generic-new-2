var materialSearchBar = (function () {
    var that = {};
    that.created = false;

    that.create = function (settings) {

        // Get Config          
        var defaultValue = settings.hasOwnProperty("defaultValue") ? (settings.defaultValue != '_' ? settings.defaultValue : "") : "";
        var placeholder = (settings.hasOwnProperty("placeholder") && settings.placeholder) ? settings.placeholder : config.text.searchBarPlaceholder || "Search";
        var showFilterSwitch = settings.hasOwnProperty("showFilterSwitch") ? settings.showFilterSwitch : true;

        // Invoke Functions Callbacks
        var searchFunc = settings.hasOwnProperty("searchFunc") ? settings.searchFunc : function () { return "" };
        var filterDropdownFunc = settings.hasOwnProperty("filterDropdownFunc") ? settings.filterDropdownFunc : function () { return "" };
        var filterFormsContentFunc = settings.hasOwnProperty("filterFormsContentFunc") ? settings.filterFormsContentFunc : function () { return "" };
        var resetFiltersFunc = settings.hasOwnProperty("resetFiltersFunc") ? settings.resetFiltersFunc : function () { return "" };

        // Get Search and Filter Value Callbacks
        var getSearchandFilterValueCallback = settings.hasOwnProperty("getSearchandFilterValueCallback") ? settings.getSearchandFilterValueCallback : function (data) { return "" };

        that.defaultValue = defaultValue;
        that.showFilterSwitch = showFilterSwitch;

        that.searchFunc = searchFunc;
        that.filterDropdownFunc = filterDropdownFunc;
        that.filterFormsContentFunc = filterFormsContentFunc;
        that.resetFiltersFunc = resetFiltersFunc;

        that.getSearchandFilterValueCallback = getSearchandFilterValueCallback;

        // User Stops Typing for 500 miliseconds
        that.timeout = null;
        that.doneTypingInterval = 1000;

        var html = `
            <div class="materialSearchBar">
                <div class="materialSearchInputDiv">
                    <div class="materialSearchInputWithBtn">
                        <input type="text" class="materialInputTextArea materialThemeDark searchBarInput help-search-bar" placeholder="${placeholder}" class="">
                        
                        <div>
                            <svg class="clearBtn" width="13" height="13" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1.5L22.8627 22.5627" stroke="#d4d4e3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.8623 1.5L1.49961 22.5627" stroke="#d4d4e3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <button class="materialButtonIcon materialThemeDark searchBtn help-search-button"><i class="fa fa-search"></i></button>
                        </div>
                    </div>

                    <button class="materialButtonIcon materialThemeDark filterSwitchBtn help-filter-dropdown-button">
                        <i class="fa fa-filter"></i>
                    </button>
                </div>

                <div class="filterFormsContainer help-search-result-container">
                    <div class="filterFormsDiv">
                        <!-- Created dynamically -->
                    </div>

                    <div class="filterBottomButtonDiv">
                        <button class="clearFilter materialButtonText materialThemeDark">Clear Filters</button>
                        <button class="doneButton materialButtonText materialThemeDark">Done</button>
                    </div>
                </div>
            </div>
        `;

        that.created = true;
        return html;
    }

    that.init = function () {
        try {
            // Toggle Material Searchbar Function
            function toggleMaterialSearchbar(status) {
                let materialSearchBar = document.querySelector('.materialSearchBar')
                
                if (status === 'open') {
                    materialSearchBar.classList.add('active');
                    // document.querySelector('body').style.overflow = 'hidden'
                } else if (status === 'close') {
                    materialSearchBar.classList.remove('active');
                    // document.querySelector('body').style.overflow = 'unset'
                } else {
                    materialSearchBar.classList.toggle('active');
                }
            }

            /* Close Material Searchbar on outside click */
            function closeMaterialSearchBarOutClick(event) {
                let materialSearchBar = document.querySelector('.materialSearchBar')
                if (!materialSearchBar) { return; }

                // Check if event.target is not mobileFilterDivTrigger or its children
                let mobileFilterDivTrigger = document.querySelector('.mobileFilterDivTrigger');
                
                if (event.target === mobileFilterDivTrigger) {
                    return;
                }
                if (mobileFilterDivTrigger.contains(event.target)) {
                    return;
                }
                if (materialSearchBar.contains(event.target)) {
                    return;
                }
                if (event.target === materialSearchBar) {
                    return;
                }

                toggleMaterialSearchbar('close');
            }

            // Close Material Searchbar on outside click
            document.addEventListener('click', closeMaterialSearchBarOutClick);

            // Update the URL with the search query in this format /search/:searchQuery
            function updateSearchQueryUrl(searchQuery) {
                let url = `${window.location.origin}${window.location.pathname}`

                // Get the data after ? in the url, if there is any
                let urlData = window.location.href.split('?')[1];

                url += `#!/search/${searchQuery ? searchQuery : '_'}${urlData ? `?${urlData}` : ''}`;
                window.history.pushState({}, '', url);
            }

            // Update the url with filter query in this format /search/:searchQuery/?filter1=value1&filter2=value2
            function updateSelectFilterQueryUrl(searchQuery) {
                let url = `${window.location.origin}${window.location.pathname}`

                // Check if there is a search query string in the url
                if (!searchQuery) {
                    url += '#!/search/_';
                } else {
                    url += `#!/search/${searchQuery}`;
                }

                url += '?';

                // Get all the filters
                let filters = document.querySelectorAll('.materialSearchBar .filterFormsDiv select');

                // Loop through all the filters and add them to the url
                filters.forEach(function (filter) {
                    if (filter.value == "") { return; }
                    url += filter.dataset.filter + '=' + filter.value + '&';
                });

                // Remove the last '&' from the url
                url = url.slice(0, -1);

                // Update the url
                window.history.pushState({}, '', url);
            }

            // Auto fill search bar with default value, and show clear button, if default value is not empty, also auto focus on search bar
            if (that.defaultValue) {
                $('.materialSearchBar input').val(that.defaultValue);
                $('.materialSearchBar svg.clearBtn').show();
                $('.materialSearchBar input').focus();

                // Search the default value
                that.searchFunc(event);
            }

            // Hide filter switch if showFilterSwitch is false
            if (!that.showFilterSwitch) {
                document.querySelector('.materialSearchBar .filterSwitchBtn').style.display = 'none';
                document.querySelector('.materialSearchBar .filterFormsContainer').style.display = 'none';
            }

            // Create filters based on current data
            if (that.filterFormsContentFunc) {
                document.querySelector('.materialSearchBar .filterFormsDiv').innerHTML = that.filterFormsContentFunc();
            }

            // Auto fill select filters with query params
            var autoFillSelectFilters = function () {
                if (!that.showFilterSwitch) { return; }
                let urlParams = app.getURLParams();
                if (urlParams) {
                    Object.keys(urlParams).forEach(function (key) {
                        let selectFilter = document.querySelector(`.materialSearchBar .filterFormsDiv select[data-filter="${key}"]`);
                        if (selectFilter) {
                            selectFilter.value = urlParams[key];
                        }
                    });

                    // Open the filter dropdown
                    toggleMaterialSearchbar('open');

                    // Filter the cards
                    that.filterDropdownFunc();
                }
            }();

            // Toggle Material Searchbar
            document.querySelector('.materialSearchBar .filterSwitchBtn').addEventListener('click', function (event) {
                toggleMaterialSearchbar();
            });

            // Toggle Material Searchbar
            document.querySelector('.mobileFilterDivTrigger').addEventListener('click', function (event) {
                toggleMaterialSearchbar();
            });

            // Open the filter dropdown if the search query is not empty and the current route is search
            if(!that.searchQuery) {
                if(app.currentRoute.includes('search'))
                toggleMaterialSearchbar('open');
            }

            // When Clear Filter button is clicked, clear all filters
            $('.materialSearchBar button.clearFilter').on("click", (event) => {
                that.resetFiltersFunc(); // Clear all filters

                let searchValue = $('.materialSearchBar input').val();
                updateSelectFilterQueryUrl(searchValue);

                that.searchFunc(event); // Search
                that.filterDropdownFunc(); // Filter

                // Callback function
                that.getSearchandFilterValueCallback({
                    searchValue: searchValue,
                    filterValue: app.getURLParams()
                });
            });

            // When done filter button is clicked, close the filter
            $('.materialSearchBar button.doneButton').on("click", (event) => {
                toggleMaterialSearchbar('close');
            });

            // On Search when enter is pressed, search the search bar, hide clear button if search bar is empty
            $('.materialSearchBar input').on("keyup", (event) => {
                // Update the URL with the search query in this format /search/:searchQuery
                updateSearchQueryUrl(event.target.value);

                // Show clear button if search bar is not empty
                if (event.target.value === "") {
                    $('.materialSearchBar svg.clearBtn').hide();
                } else {
                    if (event.key === 'Enter') {
                        that.searchFunc(event);
                        toggleMaterialSearchbar('close');

                        // Callback function
                        let searchValue = $('.materialSearchBar input').val();
                        that.getSearchandFilterValueCallback({
                            searchValue: searchValue,
                            filterValue: app.getURLParams()
                        });
                    }
                    $('.materialSearchBar svg.clearBtn').show();
                }

                // Callback function
                clearTimeout(that.timeout); // Clear the previous timeout

                // Make a new timeout set to go off in 1000ms (1 second)
                that.timeout = setTimeout(function () {
                    // Callback function
                    let searchValue = $('.materialSearchBar input').val();
                    that.getSearchandFilterValueCallback({
                        searchValue: searchValue,
                        filterValue: app.getURLParams()
                    });
                }, that.doneTypingInterval);
            });

            // On Search when search button is clicked, search the search bar
            $('.materialSearchBar .searchBtn').on("click", function (event) {
                that.searchFunc(event);
                toggleMaterialSearchbar('close');

                // Callback function
                let searchValue = $('.materialSearchBar input').val();
                that.getSearchandFilterValueCallback({
                    searchValue: searchValue,
                    filterValue: app.getURLParams()
                });
            });

            // When filter dropdown forms are changed, filter the cards
            if (
                that.showFilterSwitch &&
                $('.materialSearchBar .filterFormsDiv select')
            ) {
                $('.materialSearchBar .filterFormsDiv select').on("change", function (event) {
                    let searchValue = $('.materialSearchBar input').val();
                    updateSelectFilterQueryUrl(searchValue);

                    that.filterDropdownFunc(event);

                    // Callback function
                    that.getSearchandFilterValueCallback({
                        searchValue: searchValue,
                        filterValue: app.getURLParams()
                    });
                });
            }

            // Clear Search Bar
            $('.materialSearchBar svg.clearBtn').on("click", (event) => {
                $('.materialSearchBar input').val("");
                $('.materialSearchBar svg.clearBtn').hide();

                // Update the URL with the search query in this format /search/:searchQuery
                updateSearchQueryUrl("");

                that.searchFunc(event);

                // Callback function
                that.getSearchandFilterValueCallback({
                    searchValue: '',
                    filterValue: app.getURLParams()
                });
            });


        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();