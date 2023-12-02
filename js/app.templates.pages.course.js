app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.course = {
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
    content: function (courseId) {
        var data = app.data;
        var courseData = app.data.course[courseId]
        let completenessPorcentage = 0;

        var url;

        if(app.data.offer.isDataAvailable()){
            url = "https://pianoencyclopedia.com/en/" + app.data.offer.general.availability.urlPathStartArray[0] + "/" + app.data.offer.general.availability.urlPathEnd + "/";
        }
        else{
            url = "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/";
        }

        var outLineLearnHtml = `
            <div class="materialOutlineLearn">
                <h5 class="materialOutlineTitle" style="background: #5f0000;">Upgrade Your Experience</h5>
                <ul class="materialOutlineList"> 
                    <li data-progress="${completenessPorcentage}" data-progress-affects-class="materialOutlineViewComplete" class="materialOutlineView">
                        <div class="materialOutlineListBody">
                            <a target="_blank" href="${url}?source=nativeAd">
                                <div class="materialOutlineThumbnail" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png);">
                                    <div class="materialProgressBar ">
                                        <div class="materialProgressBarInside" data-progress="${completenessPorcentage}" data-progress-affects-width style="width:10px;"></div>
                                    </div>
                                </div>
                                <h6>Discover our Digital Home-Study Course "The Logic Behind Music"</h6>
                                <p>The most comprehensive course in the world, with a 2-year curriculum of multimedia lessons, including  25,000 interactive piano graphics, animated sheet music, and interactive 3D hands that will show exactly what fingers to use. Quickly learn how to play your favorite songs, play by ear, improvise, and even create your own music - by discovering how music truly works.</p> 
                            </a>
                        </div>
                        <div class="materialOutlineIcon"><i class="fa fa-check"></i></div>
                    </li>
                </ul> 
            </div>

            <div class="container marginTop20">
                <div class="row action-cards-top">  
                    ${app.templates.modules.actionCards.content(app.data.user.cards, false, false)} 
                </div>
            </div>

            <div class="container marginTop10">
                <div class="row action-cards-top">  
                    ${app.templates.modules.actionCards.content(app.data.user.cards, true, true)} 
                </div>
            </div>
        `;


        var html = `
            <main class="app_mainContainer">
                <header class="app_heroHeader">
                    <div>
                        <div class="app_heroSection maxWidthContainer">
                            <h4 class="fontFamilyOptimus">${courseData.title}</h4>
                            <p class="materialParagraph materialThemeGoldDark">${courseData.description}</p>

                            <div class="app_headerButtonContainer">
                                <div>
                                    <button class="materialButtonFill materialThemeGoldDark">Continue Course</button>
                                    <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em;"> <i class="fa fa-bookmark"></i> </a>
                                </div>
                                <p>${courseData.stats.lessons.complete} of ${courseData.stats.lessons.total} LESSONS</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section class="app_lessonOverviewSection maxWidthContainer">
                    <div class="lessonProgress">
                        <p>${courseData.stats.lessons.totalProgress}% Completed</p>
                        <p>${courseData.chapterIds.length} CHAPTERS</p>
                    </div>

                    <p class="lessonDescription">
                        ${courseData.description}
                    </p>

                    <!--
                    <div class="overallRatings">
                        <p>Overall Ratings</p>

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
                    -->

                </section>

                <section class="app_lessonContentSection maxWidthContainer">
                    ${
                        materialAccordion.create({
                            list: courseData.chapterIds.map(function(chapterId) {
                                return {
                                    header: data.chapter[chapterId].title,
                                    subHeader: `${data.chapter[chapterId].stats.lessons.incomplete}/${data.chapter[chapterId].stats.lessons.total}`,
                                    onInitOpenAccordion: true,
                                    content: `
                                        <div class="materialOutlineLearn">
                                            <ul class="materialOutlineList"> 
                                            ${
                                                data.chapter[chapterId].lessonIds.map((lessonId) => (
                                                    `
                                                        <li data-id="${data.lesson[lessonId].id}" class="materialOutlineView materialOutlineViewComplete"> 
                                                            <div class="materialOutlineListBody">
                                                                <a href="#!/lesson/${data.lesson[lessonId].id}"> 
                                                                    <div class="materialOutlineThumbnail" style="background-image: url(${data.lesson[lessonId].image});">
                                                                        <div class="materialProgressBar">
                                                                            <div class="materialProgressBarInside " style="width: ${data.lesson[lessonId].progress}%;"></div>
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
                                                            <div class="materialOutlineIcon">${data.lesson[lessonId].progress > 90 ? '<i class="fa fa-check"></i>' : ''}</div>
                                                        </li>
                                                    `
                                                )).join('')
                                            }
                                     </ul>
                                 </div>
                                `
                                }
                            })
                        })
                    }

                    ${outLineLearnHtml}
                </section>
            </main>
        `;

        html += `
                <script>
                    console.log("RUNNING");
                    dashboardInfiniteScrolling.load();  
                    materialAccordion.init()
                </script>
			`;
        return html;
    }
}