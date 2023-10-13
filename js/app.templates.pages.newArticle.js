app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.newArticle = {
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
                        <div class="lessonPreview article">
                            <div class="overlay">
                                <div>
                                    <button class="materialButtonFill materialThemeDark marginBottom4">Open Book</button>
                                    <h5 class="materialHeader materialTextCenter  materialThemeDark fontFamilyLato">0% Completed</h5>
                                </div>
                            </div>

                            <div class="materialLessonVideo materialPlaceHolder">
                                <div style="background: transparent;  z-index: 2;">
                                    <a href="#!/lesson/5002/book" target="_blank" style="width: 100%;height: 100%;background: transparent;display: block;"></a>
                                </div>
                                <iframe src="https://pianoencyclopedia.com/en/ebook-viewer/?pdfUrl=//pianoencyclopedia.com/en/ebook-viewer/pdfs/The Piano Encyclopedia Music Fundamentals.pdf&amp;progressDetails=&amp;engagementTime=0" frameborder="0" allowfullscreen=""></iframe>
                            </div>
                        </div>



                        <section class="app_lessonOverviewSection">
                            <div class="courseTitle">
                                <h4 class="fontFamilyOptimus">The Music Chronicles</h4>
                                <p class="materialParagraph">QUINTESSIAL ROCK SONGS, MUSIC FUNDAMENTALS</p>
                            </div>

                            <div class="lessonProgress">
                                <p>54% Completed</p>
                                <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em;"> <i class="fa fa-bookmark"></i> </a>
                            </div>

                            <p class="lessonDescription">
                                Beethoven’s Bagatelle in a (Fur Elise)  was composed on April 27, 1810 as a leaf in an album, Ludwig Nohl, who discovered the manuscript and published it in 1867, appears to have misread Beethoven’s writing of the name “Therese” (von Brunswick). She was the woman Beethoven reputedly loves and it was in her papers that the manuscript of Fuer Elise was discovered.
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
                            <div class="materialAccordion">

                                <div class="materialAccordionHeader active">
                                    <div>
                                        <h4>Chapter 1: Fur Elise</h4>
                                        <p>0/24  |  1hr 45min Read</p>
                                    </div>
                                    <div class="dropdownIcon">
                                        <svg width="24" height="24" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.27539 13.0817L16.7345 23.5408L27.1937 13.0817" stroke="#C8C8C8" stroke-width="2.09183" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </div>
                                </div>

                                <div class="materialAccordionContent active">
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
                                </div>


                                <div class="materialAccordionHeader">
                                <div>
                                    <h4>Chapter 2: Fur Elise</h4>
                                    <p>0/24  |  1hr 45min Read</p>
                                </div>
                                <div class="dropdownIcon">
                                    <svg width="24" height="24" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.27539 13.0817L16.7345 23.5408L27.1937 13.0817" stroke="#C8C8C8" stroke-width="2.09183" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </div>
                            </div>

                            <div class="materialAccordionContent">
                                
                            </div>


                            <div class="materialAccordionHeader">
                                <div>
                                    <h4>Chapter 3: Fur Elise</h4>
                                    <p>0/24  |  1hr 45min Read</p>
                                </div>
                                <div class="dropdownIcon">
                                    <svg width="24" height="24" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.27539 13.0817L16.7345 23.5408L27.1937 13.0817" stroke="#C8C8C8" stroke-width="2.09183" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </div>
                            </div>

                            <div class="materialAccordionContent">
                                Hiii
                            </div>


                            </div>
                        </section>
                    </div>
                </div>
            </main>
        `

        html += `
                <script>
                    console.log("RUNNING");
                    dashboardInfiniteScrolling.load();  
                </script>

                <script>
                    const accordionButtons = document.querySelectorAll('.materialAccordionHeader');

                    // Set Default Accordion
                    accordionButtons[0].nextElementSibling.style.maxHeight = accordionButtons[0].nextElementSibling.scrollHeight + 'px';

                    accordionButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const content = button.nextElementSibling;

                            // accordionButtons.forEach(otherButton => {
                            //     if (otherButton !== button) {
                            //         otherButton.classList.remove('active');
                            //         otherButton.nextElementSibling.classList.remove('active');
                            //     }
                            // });

                            button.classList.toggle('active');
                            content.classList.toggle('active');

                            if (content.style.maxHeight) {
                                content.style.maxHeight = null;
                            } else {
                                content.style.maxHeight = content.scrollHeight + 'px';
                            }
                        });
                    });
                </script>
			`;

        return html;
    }
}