var materialFilterPills = (function () {
    var that = {};
    that.created = false;

    var getHtml = function (settings) {
        var html = '';
        settings.list.forEach(function (item) {
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

    that.create = function (settings) {

        var htmlWrapper = `
            <div class="materialFilterPillsContainer">
                <div class="overlay leftScroll">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4.5L7.5 12L15 19.5" stroke="#F9F4DE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div class="materialFilterPillsDiv">
                    ${getHtml(settings)}
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
            var columnWidthClass = `cardSearchResult ${config.layout.searchResults}`;

            // Filter App Data by Key of the filter pills clicked and return the mapped course cards
            const filterAppDataByKey = function (key) {
                const keyData = app.data.explore[key]
                const mappedCourseCard = keyData.map(function (item) {
                    var lesson = app.data.course[item];
                    if (!lesson) { return '' }

                    var lessonId = app.data.course[item]?.id;
                    return app.createCourseCard(lessonId, lesson, columnWidthClass);
                })

                return mappedCourseCard.join('');
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
                            $('.heroSectionContainer').show();
                            $('.app_coursesCardsSection').show();
                            $('.app_ratingsSection').show();
                            $('.app_actionCardsContainer').show();
                            $('.app_searchCardsResultContentContainer .infiniteScrollingContainer').hide();

                            // Clear cards from the DOM
                            document.querySelector('.app_searchCardsResultContentContainer .infiniteScrollingContainer').innerHTML = '';
                            return;
                        } else {
                            $('.heroSectionContainer').hide();
                            $('.app_coursesCardsSection').hide();
                            $('.app_ratingsSection').hide();
                            $('.app_actionCardsContainer').hide();
                            $('.app_searchCardsResultContentContainer .infiniteScrollingContainer').show();
    
                            // Filter App Data by Key of the filter pills clicked and return the mapped course cards
                            const mappedCourseCard = filterAppDataByKey(pill.dataset.value);
    
                            // Add cards to the DOM
                            document.querySelector('.app_searchCardsResultContentContainer .infiniteScrollingContainer').innerHTML = mappedCourseCard
                        }
                    });
                });

                // Get active pills set in data value and check the child input type checkbox programmatically
                app.setActivePills('defaultChecked');
            });
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();
