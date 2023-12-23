var materialFilterPills = (function () {
    var that = {};
    that.created = false;

    that.create = function (settings) {

        // Get Config
        var defaultValue = settings.hasOwnProperty("defaultValue") ? (settings.defaultValue != '_' ? settings.defaultValue : "") : "";
        var list = settings.hasOwnProperty("list") ? settings.list : [];
        var getClickedPillData = settings.hasOwnProperty("getClickedPillData") ? settings.getClickedPillData : function () { return null; };

        that.defaultValue = defaultValue;
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
            <div class="materialFilterPillsContainer">
                <div class="overlay leftScroll">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4.5L7.5 12L15 19.5" stroke="#F9F4DE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div class="materialFilterPillsDiv">
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
                url += `#!/filter/${filterQuery}`;

                window.history.pushState({}, '', url);
            }


            // Filter App Data by Key of the filter pills clicked and return the mapped course cards
            function filterAppDataByKey(key) {
                if (!key) { return null; }
                
                const keyData = app.data.explore[key]

                if (!keyData) { return null; }

                const mappedCourseCard = keyData.map(function (item) {
                    var course = app.data.course[item];
                    if (!course) { return null; }
                    return { courseId: item, course: course }
                })

                // Remove null values from the array
                const mappedCourseCardFilter = mappedCourseCard.filter(function (item) {
                    return item !== null;
                })

                return mappedCourseCardFilter;
            }


            /* Set Active Pills */
            function setActivePills(value) {
                const activePills = document.querySelectorAll(`.materialFilterPillsDiv .materialChip[data-value="${value}"]`);
                if (!activePills.length) {
                    return;
                }

                activePills.forEach(function (pill) {
                    pill.querySelector('input').checked = true;

                    // Add active class to the pill
                    pill.classList.add('active');

                    // Update the URL with the filter query
                    updateFilterQueryUrl(value);

                    const mappedCourseData = filterAppDataByKey(value);
                    if (!mappedCourseData) { return; }
                    that.getClickedPillData(mappedCourseData)
                });
            }


            document.querySelectorAll(".materialFilterPillsContainer").forEach(function (parentDiv) {
                const pillsScrollingDiv = parentDiv.querySelector('.materialFilterPillsDiv');
                const containerWidth = pillsScrollingDiv.scrollWidth;
                const scrollAmount = 500;

                // Hide Left Carousel at first
                parentDiv.querySelector('.materialFilterPillsContainer .overlay.leftScroll').style.display = 'none';

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
                        parentDiv.querySelector('.materialFilterPillsContainer .overlay.leftScroll').style.display = 'flex';
                    }
                });

                // Hide Right Carousel if there is no scroll
                if (pillsScrollingDiv.scrollWidth <= pillsScrollingDiv.clientWidth) {
                    parentDiv.querySelector('.materialFilterPillsContainer .overlay.rightScroll').style.display = 'none';
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

                        // Show all cards if 'All' is selected
                        if (!pill.dataset.value) {
                            that.getClickedPillData(null)
                        } else {
                            // Update the URL with the filter query
                            updateFilterQueryUrl(pill.dataset.value);

                            const mappedCourseData = filterAppDataByKey(pill.dataset.value);
                            if (!mappedCourseData) { return; }
                            that.getClickedPillData(mappedCourseData)
                        }
                    })
                })
            });

            // Get active pills set in data value and check the child input type checkbox programmatically
            setActivePills(that.defaultValue);
        } catch (error) {
            console.log(error);
        }
    }

    return that;
})();