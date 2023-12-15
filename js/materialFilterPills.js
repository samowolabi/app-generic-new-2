var materialFilterPills = (function () {
    var that = {};
    that.created = false;

    var getHtml = function (settings) {
        var html = '';
        settings.list.forEach(function (item) {
            html += `
                <!-- <span data-ripple data-value='${item.value}'>${item.name}</span> -->
                <!--<div class="materialChipFilter">
                    <input class="materialChipInput" name="size" type="checkbox"> <svg class="materialChipCheckbox" viewbox="-2 -3 30 30">
                    <path class="materialChipCheckboxPath" d="M1.73,12.91 8.1,19.28 22.79,4.59" fill="none" stroke="black"></path></svg>
                    <div class="materialChipInputText">
                        ${item.name}
                    </div>
                </div>-->

                <div class="materialChipFilter materialThemeDark" data-value="${item.active ? 'defaultChecked' : ''}">
                    <input class="materialChipInput materialThemeDark" name="size" type="checkbox"> <svg class="materialChipCheckbox" viewBox="-2 -3 30 30">
                    <path class="materialChipCheckboxPath" d="M1.73,12.91 8.1,19.28 22.79,4.59" fill="none" stroke="black"></path></svg>
                    <div class="materialChipInputText materialThemeDark">
                    ${item.name}
                    </div>
                </div>
            `;
        })

        return html;
    }

    that.create = function (settings) {
        var htmlWrapper = `
            <div class="materialFilterPillsContainer marginBottom20">
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

                // Set Toggle Pills Active
                parentDiv.querySelectorAll('.materialFilterPillsDiv .materialChipFilter').forEach(function (pill) {
                    pill.addEventListener('click', function (event) {
                        if (pill.classList.contains('active')) {
                            pill.classList.remove('active');
                        } else {
                            pill.classList.add('active');
                        }
                    });
                });

                // Get active pills set in data value and check the child input type checkbox programmatically
                function setActivePillsOnLoad() {
                    const activePills = parentDiv.querySelectorAll('.materialFilterPillsDiv .materialChipFilter[data-value="defaultChecked"]');
                    activePills.forEach(function (pill) {
                        pill.querySelector('input').checked = true;

                        // Add active class to the pill
                        pill.classList.add('active');
                    });
                }

                setActivePillsOnLoad();
            });
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();
