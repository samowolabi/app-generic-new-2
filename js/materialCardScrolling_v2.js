var materialCardScrollingV2 = (function () {
    var that = {};

    var getHtml = function (settings) {
        var html = '';

        const { data, list } = settings

        // Limit card from settings config
        if (settings.hasOwnProperty('limit')) {
            list.ids = list.ids.slice(0, settings.limit);
        }

        // Column Width
        var columnWidthClass = `cardSearchResult ${config.layout.searchResults}`;

        if (list.type === 'lesson') {
            list.ids.forEach(function (item) {
                if (data.lesson.hasOwnProperty(item)) {
                    var lessonId = data.lesson[item]?.id;
                    var lesson = data.lesson[item];
                    html += app.createLessonCard(lessonId, lesson, columnWidthClass);
                }
            })
        }

        if (list.type === 'course') {
            list.ids.forEach(function (item) {
                if (data.course.hasOwnProperty(item)) {
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
            <div class="materialSlickScrollingContainer help-scrolling-course-cards">
                <div class="materialSlickDiv">
                    ${getHtml(settings)}
                </div>
            </div> 
        `;

        return htmlWrapper;
    }


    that.init = function () {
        try {
            document.querySelectorAll(".materialSlickScrollingContainer").forEach(function (parentDiv) {
                const cardsScrollingDiv = parentDiv.querySelector('.materialSlickDiv');

                // Add unique class to the div
                let uniqueClass = `materialSlickScrolling_${Math.random().toString(36).substr(2, 9)}`;
                cardsScrollingDiv.classList.add(uniqueClass);

                $(`.${uniqueClass}`).slick({
                    dots: false,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    adaptiveHeight: true,
                    responsive: [
                      {
                        breakpoint: 1024,
                        settings: {
                          slidesToShow: 3,
                          slidesToScroll: 3,
                          infinite: false,
                          dots: false
                        }
                      },
                      {
                        breakpoint: 600,
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 2
                        }
                      },
                      {
                        breakpoint: 480,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1
                        }
                      }
                    ]
                });
            });
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();