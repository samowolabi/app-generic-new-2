app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.newEbook = {
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
    content: function () {
        var data = app.data;

        var html = `
            <main class="app_mainContainer maxWidthContainer">
                <ul class="materialBreadCrumbs marginTop20 marginBottom3">
                    <li>Exclusive Gifts</li>
                    <li>Books</li>
                    <li>The Music Chronicles</li>
                </ul>
                
                <div class="app_LessonContainer">
                    <div>    
                        <section class="app_articleContentSection">
                            <div class="app_articleContentHeader">    
                                <h4 class="fontFamilyOptimus">The Sustain Pedal</h4>
                                <p class="fontFamilyOptimus">How to use pedal for Legato & Coloring (Part 1/2)</p>
                            </div>

                            <div class="lessonProgress">
                                <p>54% Completed</p>
                                <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em;"> <i class="fa fa-bookmark"></i> </a>
                            </div>

                            <div style="width: 100%; height: 500px"></div>

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
                                    <a class="materialButtonOutline">Next Lesson</a>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div>
                        <section class="app_lessonContentSection">
                            <div class="app_lessonContentOverview">
                                <div>
                                    <h6 class="fontFamilyOptimus">The Wisdom from the Great matters</h6>
                                    <p class="materialParagraph">You are in Lesson 12/25</p>
                                </div>

                                <div class="app_lessonContentOverviewProgress">
                                    <p>Course Progress</p>
                                    <p>54% Completed</p>
                                </div>
                            </div>

                            ${
                                materialAccordion.create({
                                    list: [
                                        {
                                            header: 'Chapter 1: Fur Elise',
                                            subHeader: '0/24  |  1hr 45min Read',
                                            content: `
                                                <div class="materialOutlineLearn">
                                                    <ul class="materialOutlineList"> 
                                                        <li class="materialOutlineView materialOutlineViewComplete"> 
                                                            <div class="materialOutlineListBody">
                                                                <a href="http://learn.pianoencyclopedia.com/members-only/dashboard/lesson-3/"> 
                                                                    <div class="materialOutlineThumbnail" style="background-image: url(https://placeimg.com/960/540/nature?1);">
                                                                        <div class="materialProgressBar">
                                                                            <div class="materialProgressBarInside " style="width:30%;"></div>
                                                                        </div>
                                                                    </div>
                                                                    <h6>Lesson 1</h6>
                                                                    <p>How to Play 50 Songs with Just Four Chords</p>
                                                                    <p class="materialOutlineExpire"><i class="fa fa-clock-o"></i>Expiring in 12:23:02</p>
                                                                </a>
                                                            </div>
                                                            <div class="materialOutlineIcon"><i class="fa fa-check"></i></div>
                                                        </li>
                                                        <li class="materialOutlineView"> 
                                                            <div class="materialOutlineListBody">
                                                                <a href="http://learn.pianoencyclopedia.com/members-only/dashboard/lesson-4/">
                                                                    <div class="materialOutlineThumbnail" style="background-image: url(https://placeimg.com/960/540/nature?2);">
                                                                        <div class="materialProgressBar">
                                                                            <div class="materialProgressBarInside " style="width:90%;"></div>
                                                                        </div>
                                                                    </div>
                                                                    <h6>Lesson 2</h6>
                                                                    <p>How to Play 50 Songs with Just Four Chords</p>
                                                                </a>
                                                            </div>
                                                            <div class="materialOutlineIcon" style="background: #0b0b0b; border-color: rgba(240, 227, 224, 0.2);"> </div>
                                                        </li>
                                                        <li class="materialOutlineView"> 
                                                            <div class="materialOutlineListBody">
                                                                <a href="http://learn.pianoencyclopedia.com/members-only/dashboard/lesson-5/">
                                                                    <div class="materialOutlineThumbnail" style="background-image: url(https://placeimg.com/960/540/nature?3);">
                                                                        <div class="materialProgressBar">
                                                                            <div class="materialProgressBarInside " style="width:90%;"></div>
                                                                        </div>
                                                                    </div>
                                                                    <h6>Lesson 3</h6>
                                                                    <p>Adding a Fancy Bass Line</p>
                                                                </a>
                                                            </div>
                                                            <div class="materialOutlineIcon"><i class="fa fa-check"></i></div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            `
                                        },
                                        {
                                            header: 'Chapter 2: Fur Elise',
                                            subHeader: '0/24  |  1hr 45min Read',
                                            content: `Hi`
                                        },
                                        {
                                            header: 'Chapter 3: Fur Elise',
                                            subHeader: '0/24  |  1hr 45min Read',
                                            content: `Hi`
                                        }
                                    ]
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
                    materialAccordion.init()
                </script>
			`;

        return html;
    }
}