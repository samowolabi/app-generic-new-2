app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.newInteractivePdf = {
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
        console.log(data);

        // TODO: Set Dynamic Course and Lesson Ids
        // TODO: Solve this for iframe attributes: &progressDetails=${thisLesson.engagementProgressArrayDetails.toString()}&engagementTime=${thisLesson.engagementTime}
        activeCourseId = 3000;
        activeLessonId = 5001;

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

                            <div class="row"> 
                                <div class="col-xs-12"> 
                                    <div class="materialLessonVideo materialPlaceHolder">
                                        <div style="background: transparent;  z-index: 2;">
                                            <a href="#!/lesson/${data.lesson[activeLessonId].id}/book" target="_blank" style="width: 100%;height: 100%;background: transparent;display: block;"></a>
                                        </div>
                                        <iframe src="${data.lesson[activeLessonId].content}" frameborder="0" allowfullscreen></iframe>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        
                        <script>  
                            var thisLesson = function() { return app.data.user.learning[${data.lesson[activeLessonId].id}]; }
                            var thisLessonId = ${data.lesson[activeLessonId].id};
                            var ebookStats = {}; 
                            function ebookStatsCallback(bookProgressArray, pageCount, engagementTime){
                                /* 
                                //Disabled as now the ebook does an animation, which generates events if this code is not disabled.
                                var bookProgressArrayUniques = removeDuplicateAndKeepOrder(bookProgressArray);
                                var bookProgressArrayUniquesWithoutLetters = bookProgressArrayUniques.filter(function(item) { return !["d","p","f"].includes(item) });
                                var progressReal = Math.round(bookProgressArrayUniquesWithoutLetters.length / pageCount) *100;	
                                    
                                var maxPageNumber = (bookProgressArrayUniquesWithoutLetters && bookProgressArrayUniquesWithoutLetters.length) ? Math.max.apply(null, bookProgressArrayUniquesWithoutLetters) : 1;
                                var progressMax = Math.round(maxPageNumber / pageCount) *100;
                                
                                if((progressReal == 100) && !thisLesson().reached100Once){
                                    app.callback("path=" + app.currentRoute + "&progress=100");
                                    app.addRewardPoints("Finished Book", 50); thisLesson().reached100Once = true;
                                }
                                                                                
                                var downloaded = bookProgressArray.includes("d");
                                var printed    = bookProgressArray.includes("p");
                                var fullscreen = bookProgressArray.includes("f");
                                
                                if(downloaded ||  printed){
                                    progressMax = 100; 
                                    
                                    if(!thisLesson().reached100Once){
                                        app.callback("path=" + app.currentRoute + "&progress=100");
                                        if(downloaded) {app.addRewardPoints("Downloaded Book", 50); }
                                        if(printed) {app.addRewardPoints("Printed Book", 100); }  
                                        thisLesson().reached100Once = true;
                                    }
                                }
                                else if(fullscreen){
                                        progressMax = 100; 
                                }

                                                                
                                thisLesson().engagementProgressArrayDetails = bookProgressArray;
                                thisLesson().engagementTime = engagementTime;
                                thisLesson().engagementProgressMaxPercent = progressMax;
                                thisLesson().engagementProgressRealPercent = progressReal;
                                
                                thisLesson().engagementFirstDate = thisLesson().engagementFirstDate || datetimeToEST(new Date());
                                thisLesson().engagementLastDate  = datetimeToEST(new Date()); 
                                                
                                app.data.user.stats.lessons.lastLessonEngagementId	 = "${data.lesson[activeLessonId].id}";
                                
                                $("#lessonProgress${data.lesson[activeLessonId].id}").html(thisLesson().engagementProgressMaxPercent);
                                if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${data.lesson[activeLessonId].id}").html("Completed"); }
                                
                                app.saveToServer(${data.lesson[activeLessonId].id}); 
                                */
                            }
                            
                            function pdfReaderCallback(params){ 
                                console.log("Pdf reader callback received", params);
                                
                                var action = params["action"] || "";
                                var engagementProgressArray = params["engagementProgressArray"] || "";
                                var progressReal = params["engagementProgressRealPercent"] || "";
                                var progressMax = params["engagementProgressMaxPercent"] || "";
                                var numberOfPages = params["numberOfPages"] || "";
                                var currentPage = params["currentPage"] || ""; 
                                var engagementTime = params["engagementTime"] || ""; 
                                
                                app.callback("path=" + app.currentRoute + "&book=y&action=" + action + "&progressMax=" + progressMax + "&progress=" + progressReal + "&bookCurrentPage=" + currentPage + "&bookTotalPages=" + numberOfPages + "&engagementTime=" + engagementTime, false);
                                
                                if((progressReal == 100) && !thisLesson().reached100Once){
                                    app.callback("path=" + app.currentRoute + "&progress=100");
                                    app.addRewardPoints("Finished Book", 50); thisLesson().reached100Once = true;
                                }
                                
                                var downloaded = engagementProgressArray.includes("d");
                                var printed    = engagementProgressArray.includes("p"); 
                                
                                if(downloaded ||  printed){
                                    progressMax = 100; 
                                    
                                    if(!thisLesson().reached100Once){
                                        app.callback("path=" + app.currentRoute + "&progress=100");
                                        if(downloaded) {app.addRewardPoints("Downloaded Book", 50); }
                                        if(printed) {app.addRewardPoints("Printed Book", 100); }  
                                        thisLesson().reached100Once = true;
                                    }
                                }

                                thisLesson().engagementProgressArrayDetails = engagementProgressArray;
                                thisLesson().engagementTime = engagementTime;
                                thisLesson().engagementProgressMaxPercent = progressMax;
                                thisLesson().engagementProgressRealPercent = progressReal;
                                
                                thisLesson().engagementFirstDate = thisLesson().engagementFirstDate || datetimeToEST(new Date());
                                thisLesson().engagementLastDate  = datetimeToEST(new Date()); 
                                                
                                app.data.user.stats.lessons.lastLessonEngagementId	 = "${data.lesson[activeLessonId].id}";
                                
                                $("#lessonProgress${data.lesson[activeLessonId].id}").html(thisLesson().engagementProgressMaxPercent);
                                if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${data.lesson[activeLessonId].id}").html("Completed"); }
                                app.saveToServer(${data.lesson[activeLessonId].id});  
                            };
						</script>


                        <section class="app_lessonOverviewSection">
                            <div class="courseTitle">
                                <h4 class="fontFamilyOptimus">${data.lesson[activeLessonId].title}</h4>
                                <p class="materialParagraph">${data.lesson[activeLessonId].subtitle}</p>
                            </div>

                            <div class="lessonProgress">
                                <p>${data.lesson[activeLessonId].progress}% Completed</p>
                                <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em;"> <i class="fa fa-bookmark"></i> </a>
                            </div>

                            <p class="lessonDescription" style="color: white">
                                ${data.lesson[activeLessonId].content}
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
                                            onInitOpenAccordion: (index === 0 || index === 1) ? true : false,
                                            content: `
                                                <div class="materialOutlineLearn">
                                                    <ul class="materialOutlineList"> 
                                                        ${
                                                            data.chapter[chapterId].lessonIds.map(function(lessonId){
                                                                return `
                                                                    <li class="materialOutlineView materialOutlineViewComplete"> 
                                                                        <div class="materialOutlineListBody">
                                                                            <a href="http://learn.pianoencyclopedia.com/members-only/dashboard/lesson-3/"> 
                                                                                <div class="materialOutlineThumbnail" style="background-image: url(${data.lesson[lessonId].image});">
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
                materialAccordion.init()
            </script>
        `;

        return html;
    }
}