var materialCardScrolling = (function () {
    var that = {};
    that.created = false;

    var getHtml = function (settings) {
        var html = '';

        const { data, list } = settings

        // Column Width
        var columnWidthClass = `cardSearchResult ${config.layout.searchResults}`;

        if (list.type === 'lesson') {
            list.ids.forEach(function (item) {
                if(data.lesson.hasOwnProperty(item)) {
                    var lessonId = data.lesson[item]?.id;
                    var lesson = data.lesson[item];
                    html += app.createLessonCard(lessonId, lesson, columnWidthClass);
                }  
            })
        }

        if (list.type === 'course') {
            list.ids.forEach(function (item) {
                if(data.course.hasOwnProperty(item)) {
                    var courseId = item;
                    var course = data.course[item];
                    html += app.createCourseCard(courseId, course, columnWidthClass);
                }
            })
        }

        return html;
    }


    that.create = function (settings) {
        var htmlWrapper = `
            <div class="materialCardsScrolling">
                <div class="overlay scrollLeft">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4.5L7.5 12L15 19.5" stroke="#F9F4DE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div class="overlay scrollRight">
                    <svg viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.99121 4.88672L17.9911 12.8866L9.99121 20.8864" stroke="#F9F4DE" stroke-width="1.59997" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <div class="materialCardsDiv">
                    ${getHtml(settings)}
                </div>
            </div>
        `;
        that.created = true;

        return htmlWrapper;
    }

    that.init = function () {
        try {
            document.querySelectorAll(".app_coursesCardsContainer").forEach(function (parentDiv) {
                const cardsScrollingDiv = parentDiv.querySelector('.materialCardsDiv');
                const containerWidth = cardsScrollingDiv.scrollWidth;
                const scrollAmount = 800;

                // Hide Left Carousel at first
                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';

                // Hide Right Carousel if there is no scroll
                if (cardsScrollingDiv.scrollWidth <= cardsScrollingDiv.clientWidth) {
                    parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').style.display = 'none';
                }

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').addEventListener('click', function (event) {
                    cardsScrollingDiv.scrollLeft -= scrollAmount;
                    if (cardsScrollingDiv.scrollLeft <= 0) {
                        cardsScrollingDiv.scrollLeft = containerWidth - cardsScrollingDiv.clientWidth;
                    }
                });

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').addEventListener('click', function (event) {
                    cardsScrollingDiv.scrollLeft += scrollAmount;

                    if (cardsScrollingDiv.scrollLeft + cardsScrollingDiv.clientWidth >= containerWidth) {
                        cardsScrollingDiv.scrollLeft = 0;
                    } else {
                        // Show Left Carousel
                        parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'flex';
                    }
                });
            })
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();