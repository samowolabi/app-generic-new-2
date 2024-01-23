var materialFilterPills = (function () {
    var that = {};
    that.created = false;

    that.create = function (settings) {

        // Get Config
        var defaultValue = settings.hasOwnProperty("defaultValue") ? (settings.defaultValue != '_' ? settings.defaultValue : "") : "";

        var activeSortFilterKey = "";
        if (settings.hasOwnProperty("activeSortFilterKey")) {
            activeSortFilterKey = settings.activeSortFilterKey === 'courses' ? 'coursesIds' : 'lessonsIds';
        } else {
            activeSortFilterKey = 'coursesIds';
        }

        var list = settings.hasOwnProperty("list") ? settings.list : [];

        // Reorder the list according to config.featuredFiltersOrder array provided in config.js
        if (config.featuredFiltersOrder && config.featuredFiltersOrder.length) {
            var featuredFiltersOrder = config.featuredFiltersOrder;
            var featuredFiltersOrderLength = featuredFiltersOrder.length;
        
            var featuredFiltersOrderMap = {};
            featuredFiltersOrder.forEach(function (item, index) {
                featuredFiltersOrderMap[item.toLowerCase()] = index;
            });
        
            list.sort(function (a, b) {
                var aIndex = featuredFiltersOrderMap[a.value.toLowerCase()];
                var bIndex = featuredFiltersOrderMap[b.value.toLowerCase()];
        
                if (aIndex === undefined) {
                    aIndex = a.value.toLowerCase() === '' ? -1 : featuredFiltersOrderLength;
                }
        
                if (bIndex === undefined) {
                    bIndex = b.value.toLowerCase() === '' ? -1 : featuredFiltersOrderLength;
                }
        
                return aIndex - bIndex;
            });
        }
                   

        console.error('list', list)

        var getClickedPillData = settings.hasOwnProperty("getClickedPillData") ? settings.getClickedPillData : function () { return null; };

        that.defaultValue = defaultValue;
        that.activeSortFilterKey = activeSortFilterKey;
        that.list = list;
        that.getClickedPillData = getClickedPillData;

        // Create Filter Pills HTML
        that.createFilterHtml = function (settings) {
            var html = '';

            that.list.forEach(function (item) {

                html += `
                    <div class="materialChip materialThemeDark" data-value="${item.value}" data-active="${item.active ? 'defaultChecked' : ''}">
                        <div class="materialChipChoice materialThemeDark">
                            <input class="materialChipInput" name="size" type="radio">
                            <div class="materialChipInputText">
                                ${item.name}
                            </div>
                        </div>
                    </div>
                `;
            })
            return html;
        }

        var htmlWrapper = `
            <div class="materialFilterPillsContainer help-filter-pills-container">
                <div class="overlay leftScroll">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4.5L7.5 12L15 19.5" stroke="#F9F4DE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div class="materialFilterPillsDiv help-filter-pills">
                    ${that.createFilterHtml(settings)}
                </div>

                <div class="overlay rightScroll">
                    <svg width="22" height="22" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.99121 4.88672L17.9911 12.8866L9.99121 20.8864" stroke="#F9F4DE" stroke-width="1.59997" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
        `;
        that.created = true;

        return htmlWrapper;
    }

    that.init = function () {
        try {
            // Update the URL with the filter query in this format /filter/:filterQuery
            function updateFilterQueryUrl(filterQuery) {
                if (!filterQuery) {
                    return;
                }

                let url = `${window.location.origin}${window.location.pathname}`
                url += `#!/filter/${filterQuery}/?type=${that.activeSortFilterKey === 'coursesIds' ? 'courses' : 'lessons'}`;

                window.history.pushState({}, '', url);
            }


            // Filter App Data by Key of the filter pills clicked and return the mapped course cards
            function filterAppDataByKey(key) {
                if (!key) { return null; }

                const keyData = app.data.explore[that.activeSortFilterKey][key];

                if (!keyData) { return null; }

                let mappedCard = [];

                if (that.activeSortFilterKey === 'coursesIds') {
                    mappedCard = keyData.map(function (item) {
                        var course = app.data.course[item];
                        if (!course) { return null; }
                        return { id: item, data: course }
                    })
                } else if (that.activeSortFilterKey === 'lessonsIds') {
                    mappedCard = keyData.map(function (item) {
                        var lesson = app.data.lesson[item];
                        if (!lesson) { return null; }
                        return { id: item, data: lesson }
                    })
                }

                // Remove null values from the array
                const mappedCardFilter = mappedCard.filter(function (item) {
                    return item !== null;
                })

                // Set the active sort filter key
                that.defaultValue = key;

                return mappedCardFilter;
            }


            /* Set Active Pills */
            that.setActivePills = function (value) {
                const activePills = document.querySelectorAll(`.materialFilterPillsDiv .materialChip[data-value="${value}"]`);
                if (!activePills.length) {
                    return;
                }

                activePills.forEach(function (pill) {
                    pill.querySelector('input').checked = true;

                    // Add active class to the pill
                    pill.classList.add('active');

                    // Scroll the pill to center
                    const pillsScrollingDiv = pill.closest('.materialFilterPillsDiv');
                    const pillWidth = pill.clientWidth;
                    const pillOffsetLeft = pill.offsetLeft;
                    const pillsScrollingDivWidth = pillsScrollingDiv.clientWidth;
                    const pillsScrollingDivScrollLeft = pillsScrollingDiv.scrollLeft;

                    const scrollAmount = 150;
                    const scrollLeft = pillOffsetLeft - (pillsScrollingDivWidth / 2) + (pillWidth / 2) + pillsScrollingDivScrollLeft;

                    pillsScrollingDiv.scrollLeft = scrollLeft - scrollAmount;

                    // Update the URL with the filter query
                    updateFilterQueryUrl(value);

                    const mappedCourseData = filterAppDataByKey(value);
                    if (!mappedCourseData) { return; }
                    that.getClickedPillData(mappedCourseData, that.activeSortFilterKey)
                });
            }


            document.querySelectorAll(".materialFilterPillsContainer").forEach(function (parentDiv) {
                const pillsScrollingDiv = parentDiv.querySelector('.materialFilterPillsDiv');
                const containerWidth = pillsScrollingDiv.scrollWidth;
                const scrollAmount = 150;

                // Hide Left Carousel at first
                parentDiv.querySelector('.materialFilterPillsContainer .overlay.leftScroll').style.visibility = 'hidden';

                // Left Scrolling
                parentDiv.querySelector('.materialFilterPillsContainer .overlay.leftScroll').addEventListener('click', function (event) {
                    pillsScrollingDiv.scrollLeft -= scrollAmount;
                    if (pillsScrollingDiv.scrollLeft <= 0) {
                        pillsScrollingDiv.scrollLeft = containerWidth - pillsScrollingDiv.clientWidth;
                    }
                });

                // Right Scrolling
                parentDiv.querySelector('.materialFilterPillsContainer .overlay.rightScroll').addEventListener('click', function (event) {
                    pillsScrollingDiv.scrollLeft += scrollAmount;

                    if (pillsScrollingDiv.scrollLeft + pillsScrollingDiv.clientWidth >= containerWidth) {
                        pillsScrollingDiv.scrollLeft = 0;
                    } else {
                        // Show Left Carousel
                        parentDiv.querySelector('.materialFilterPillsContainer .overlay.leftScroll').style.visibility = 'visible';
                    }
                });

                // show Left Carousel if there is scroll
                pillsScrollingDiv.addEventListener('scroll', function (event) {
                    if (pillsScrollingDiv.scrollLeft > 0) {
                        parentDiv.querySelector('.materialFilterPillsContainer .overlay.leftScroll').style.visibility = 'visible';
                    } else {
                        parentDiv.querySelector('.materialFilterPillsContainer .overlay.leftScroll').style.visibility = 'hidden';
                    }
                });

                // Hide Right Carousel if there is no scroll
                if (pillsScrollingDiv.scrollWidth <= pillsScrollingDiv.clientWidth) {
                    parentDiv.querySelector('.materialFilterPillsContainer .overlay.rightScroll').style.visibility = 'hidden';
                }

                // Set Toggle Pills Active
                parentDiv.querySelectorAll('.materialFilterPillsDiv .materialChip').forEach(function (pill) {
                    pill.querySelector('div').addEventListener('click', function () {
                        // Remove active class from all pills
                        parentDiv.querySelectorAll('.materialFilterPillsDiv .materialChip').forEach(function (pill) {
                            pill.classList.remove('active');
                        });

                        // Add active class to the pill
                        pill.classList.add('active');

                        // Scroll the pill to center
                        const pillWidth = pill.clientWidth;
                        const pillOffsetLeft = pill.offsetLeft;
                        const pillsScrollingDivWidth = pillsScrollingDiv.clientWidth;
                        const pillsScrollingDivScrollLeft = pillsScrollingDiv.scrollLeft;

                        const scrollLeft = pillOffsetLeft - (pillsScrollingDivWidth / 2) + (pillWidth / 2) + pillsScrollingDivScrollLeft;
                        pillsScrollingDiv.scrollLeft = scrollLeft - scrollAmount;

                        // Show all cards if 'All' is selected
                        if (!pill.dataset.value) {
                            that.getClickedPillData(null)
                        } else {
                            // Update the URL with the filter query
                            updateFilterQueryUrl(pill.dataset.value);

                            const mappedCourseData = filterAppDataByKey(pill.dataset.value);
                            if (!mappedCourseData) { return; }
                            that.getClickedPillData(mappedCourseData, that.activeSortFilterKey)
                        }
                    })
                })
            });

            // Get active pills set in data value and check the child input type checkbox programmatically
            that.setActivePills(that.defaultValue);
        } catch (error) {
            console.log(error);
        }
    }

    return that;
})();