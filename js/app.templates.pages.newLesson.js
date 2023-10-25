app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.newLesson = {
    loading: function (target) {
        var html = `
                <div class="container"> 
                    <div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.modules.lesson.loading()}</div>
                    <div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
                    <div id="page-lesson-cards" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.loading()}</div>
                </div>
			`;

        return html;
    },
    content: function (data, activeCourseId, activeLessonId, overrideTitle) {
        var data = app.data;

        var courseHtml = ``;
        activeCourseId = 3000;

        var html = `
            <main class="app_mainContainer maxWidthContainer">
                <ul class="materialBreadCrumbs marginTop24 marginBottom3">
                    <li>Exclusive Gifts</li>
                    <li>Lessons</li>
                    <li>The Hidden Patterns of Music</li>
                </ul>
                
                <div class="app_LessonContainer">
                    <div>
                        <div class="lessonPreview lesson">
                            <div style="width: 100%; height: 450px"></div>
                        </div>

                        <section class="app_lessonOverviewSection">
                            <div class="courseTitle">
                                <h4 class="fontFamilyOptimus">${data.course[activeCourseId].title}</h4>
                                <p class="materialParagraph">${data.course[activeCourseId].description}</p>
                            </div>

                            <div class="lessonProgress">
                                <p>${data.course[activeCourseId].stats.lessons.totalProgress}% Completed</p>
                                <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em;"> <i class="fa fa-bookmark"></i> </a>
                            </div>

                            <p class="lessonDescription">
                                ${data.course[activeCourseId].description}
                            </p>

                            <div class="app_LessonRatings">
                                <div class="overallRatings">
                                    <p>Rate this Lesson</p>

                                    <div class="materialRating">
                                        <input type="radio" value="1" id="materialRating-16" name="materialRating-4">
                                        <label for="materialRating-16" class="fa fa-heart" data-placement="bottom" data-toggle="tooltip" title="Very Bad"></label>
                                        <input type="radio" value="2" id="materialRating-17" name="materialRating-4">
                                        <label for="materialRating-17" class="fa fa-heart" data-placement="bottom" data-toggle="tooltip" title="Bad"></label>
                                        <input type="radio" value="3" id="materialRating-18" name="materialRating-4" checked>
                                        <label for="materialRating-18" class="fa fa-heart" data-placement="bottom" data-toggle="tooltip" title="Average"></label>
                                        <input type="radio" value="4" id="materialRating-19" name="materialRating-4">
                                        <label for="materialRating-19" class="fa fa-heart" data-placement="bottom" data-toggle="tooltip" title="Great"></label>
                                        <input type="radio" value="5" id="materialRating-20" name="materialRating-4">
                                        <label for="materialRating-20" class="fa fa-heart" data-placement="bottom" data-toggle="tooltip" title="Excellent"></label>
                                    </div>
                                </div>

                                <div style="display:flex; justify-content:space-end">
                                    <a class="materialButtonOutline materialThemeDark ">Next Lesson</a>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div>
                        <section class="app_lessonContentSection">
                            ${
                                materialAccordion.create({
                                    list: data.course[activeCourseId].chapterIds.map(function(chapterId, index) {
                                        return {
                                            header: data.chapter[chapterId].title,
                                            subHeader: `${data.chapter[chapterId].stats.lessons.incomplete}/${data.chapter[chapterId].stats.lessons.total}  |  -hr -min`,
                                            onInitOpenAccordion: index === 0 ? true : false,
                                            content: `
                                                <div class="materialOutlineLearn">
                                                    <ul class="materialOutlineList"> 
                                                        ${
                                                            data.chapter[chapterId].lessonIds.map(function(lessonId){
                                                                return `
                                                                    <li class="materialOutlineView materialOutlineViewComplete"> 
                                                                        <div class="materialOutlineListBody">
                                                                            <a href="http://learn.pianoencyclopedia.com/members-only/dashboard/lesson-3/"> 
                                                                                <div class="materialOutlineThumbnail" style="background-image: url(https://placeimg.com/960/540/nature?1);">
                                                                                    <div class="materialProgressBar">
                                                                                        <div class="materialProgressBarInside " style="width:30%;"></div>
                                                                                    </div>
                                                                                </div>
                                                                                <h6>${data.lesson[lessonId].title}</h6>
                                                                                <p>${data.lesson[lessonId].subtitle}</p>
                                                                                ${
                                                                                    data.lesson[lessonId].dateStatus === 'expiredAsap' ? `
                                                                                        <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring in <span data-countdown="${data.lesson[lessonId].deadlineDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>
                                                                                    ` : data.lesson[lessonId].dateStatus === 'expiringSoon' ? `
                                                                                        <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring Soon</p>
                                                                                    ` : data.lesson[lessonId].dateStatus === 'comingAsap' ? `
                                                                                        <p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Available in <span data-countdown="${data.lesson[lessonId].availableDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>
                                                                                    ` : data.lesson[lessonId].dateStatus === 'comingSoon' ? `
                                                                                        <p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Coming Soon</p>
                                                                                    ` : data.lesson[lessonId].dateStatus === 'expired' ? `
                                                                                        <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expired</p>
                                                                                    ` : ``
                                                                                }
                                                                            </a>
                                                                        </div>
                                                                        <div class="materialOutlineIcon"><i class="fa fa-check"></i></div>
                                                                    </li>
                                                                `
                                                            }).join('')
                                                        }
                                                    </ul>
                                                </div>
                                            `
                                        }
                                    })
                                })
                            }
                        </section>
                    </div>
                </div>
            </main>
        `

        html += `
                <script>
                    console.log("RUNNING");
                    dashboardInfiniteScrolling.load();  
                    materialAccordion.init();
                </script>
			`;

        return html;
    }
}