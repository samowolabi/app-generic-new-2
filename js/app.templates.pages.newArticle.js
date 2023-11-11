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
    content: function (data, activeCourseId, activeLessonId, overrideTitle) {
        var data = app.data;
        console.log(data);

        activeCourseId = 3000;
        activeLessonId = 8101;

        var html = `
            <main class="app_mainContainer maxWidthContainer">
                <ul class="materialBreadCrumbs marginTop20 marginBottom3">
                    <li>Exclusive Gifts</li>
                    <li>Books</li>
                    <li>${data.lesson[activeLessonId].title}</li>
                </ul>
                
                <div class="app_LessonContainer">
                    <div>    
                        <section class="app_articleContentSection">
                            <div class="app_articleContentHeader">    
                                <h4 class="fontFamilyOptimus">${data.lesson[activeLessonId].title}</h4>
                                <p class="fontFamilyOptimus">${data.lesson[activeLessonId].subtitle}</p>
                            </div>

                            <div class="lessonProgress">
                                <p>${data.lesson[activeLessonId].progress}% Completed</p>
                                <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em;"> <i class="fa fa-bookmark"></i> </a>
                            </div>

                            <!-- <div style="width: 100%; height: 500px"></div> -->

                            <div class="row">
                                <div class="col-xs-12"><article id="article">${data.lesson[activeLessonId].content}</article></div>
                            </div>
                            
                            <script>  
                                var thisLesson = function() { return app.data.user.learning[${data.lesson[activeLessonId].id}]; }
                                var thisLessonId = ${data.lesson[activeLessonId].id};
                                var articleStats = {}; 
                                articleStats.progressLastUpdate    = null;
                                articleStats.progressLastSent 	   = null;  
                                
                                articleStats.selector = '#article';
                                
                                //We will use this function multiple times, since we need to check all data, we don't know what is the last update
                                articleStats.updateSegmentedProgressBar = function(){
                                    
                                    var selectorChildren = (articleStats.selector + ' p, ' + articleStats.selector + ' li, ' + articleStats.selector + ' img');
                                    var elementsTotalCount = $(selectorChildren).length;
                                    var progressArrayUniques = removeDuplicateAndKeepOrder(thisLesson().engagementProgressArrayDetails);
                                    //Get widthPorcentage with two decimals
                                    var widthPorcentage = Math.round((100 / elementsTotalCount) * 100)/ 100;
                                    
                                    var segmentedProgressBarInsideHtml= "";
                                    for(var i=0; i< elementsTotalCount; i++){
                                            
                                        var className = progressArrayUniques.includes(i)? "materialProgressBarInside": "";
                                        segmentedProgressBarInsideHtml += '<div id="segmentedProgressBar${data.lesson[activeLessonId].id}-'+ i + '" style="width: '+ widthPorcentage +'%; height: 8px; float: left;" class="' + className +'"></div>';
                                        $("#segmentedProgressBar${data.lesson[activeLessonId].id}").html();
                                    }
                                    $("#segmentedProgressBar${data.lesson[activeLessonId].id}").html(segmentedProgressBarInsideHtml);
                                };
                                
                                articleStats.updateSegmentedProgressBar();
                                
                                trackReadProgress(articleStats.selector, 7000, function(elementsReadArray, elementsReadCount, elementsTotalCount, progressMax, progressReal){
                                
                                    //Security check in case scroll event is not deleted on time.
                                    if(thisLessonId != ${data.lesson[activeLessonId].id}) {console.log("Scroll event not deleted on time"); return;}
                                    
                                    //console.log(elementsReadArray, elementsReadCount, elementsTotalCount, progressMax, progressReal); 
                                    
                                    thisLesson().engagementProgressArrayDetails 	= thisLesson().engagementProgressArrayDetails || []; 
                                    thisLesson().engagementProgressMaxPercent 		= thisLesson().engagementProgressMaxPercent   || 0; 
                                    thisLesson().engagementProgressRealPercent 		= thisLesson().engagementProgressRealPercent  || 0; 
                                    thisLesson().engagementTime 					= thisLesson().engagementTime   			  || 0; 
                                    
                                    //Concat previous progress details with the new elements array, and remove duplicates to get the total progress array of what was read. Different from video, this progress array contains uniques (and not repeats) since it is not possible to accurately measure when a paragraph is read more than once  
                                    thisLesson().engagementProgressArrayDetails = removeDuplicateAndKeepOrder(thisLesson().engagementProgressArrayDetails.concat(elementsReadArray));
                            
                                    if(progressMax > thisLesson().engagementProgressMaxPercent){
                                        thisLesson().engagementProgressMaxPercent = progressMax;
                                    }
                                    if(progressReal > thisLesson().engagementProgressRealPercent){
                                        thisLesson().engagementProgressRealPercent = progressReal;
                                        
                                        //1 paragraph/element is worth 5 points 
                                        var rewardPoints = Math.round(elementsTotalCount * thisLesson().engagementProgressRealPercent / 100) * 5;
                                        if(thisLesson().engagementProgressRealPercent>=99 && !thisLesson().reached100Once){
                                            app.callback("path=" + app.currentRoute + "&progress=100");
                                            app.addRewardPoints("Completed 100% of this article", rewardPoints); thisLesson().reached100Once = true;
                                        }
                                        else if(thisLesson().engagementProgressRealPercent>=75 && !thisLesson().reached75Once){
                                            app.callback("path=" + app.currentRoute + "&progress=75");
                                            app.addRewardPoints("Completed 75% of this article", rewardPoints); thisLesson().reached75Once = true;
                                        }
                                        else if(thisLesson().engagementProgressRealPercent>=50 && !thisLesson().reached50Once){
                                            app.callback("path=" + app.currentRoute + "&progress=50");
                                            app.addRewardPoints("Completed 50% of this article", rewardPoints); thisLesson().reached50Once = true;
                                        }
                                        else if(thisLesson().engagementProgressRealPercent>=25 && !thisLesson().reached25Once){
                                            app.callback("path=" + app.currentRoute + "&progress=25");
                                            
                                            /*Silently add reward points as 25% progress is triggered as soon as the viewer stares at the article */
                                            app.addRewardPoints(false, rewardPoints); thisLesson().reached25Once = true;
                                        }
                                        
                                        //Update Segmented Progress Bar entirely
                                        articleStats.updateSegmentedProgressBar(); 
                                    }
                            
                                    thisLesson().engagementFirstDate = thisLesson().engagementFirstDate || datetimeToEST(new Date());
                                    thisLesson().engagementLastDate  = datetimeToEST(new Date()); 
                                    
                                    app.data.user.stats.lessons.lastLessonEngagementId	 = "${data.lesson[activeLessonId].id}";
                                        
                                    var timestamp = (new Date()).getTime();
                                    timestamp = Math.floor(timestamp / 1000);
                                    articleStats.progressLastUpdate = timestamp; 
                                    
                                    $("#lessonProgress${data.lesson[activeLessonId].id}").html(thisLesson().engagementProgressMaxPercent);
                                    if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${data.lesson[activeLessonId].id}").html("Completed"); }
                                });
                                
                                //Update progress to server every 20 seconds, and add 20 seconds to engagement time
                                app.runTimer(function(){  
                                    thisLesson().engagementTime += 20; 
                                    app.saveToServer(${data.lesson[activeLessonId].id});  
                                }, 20000);     
                            </script>


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
                                    <h6 class="fontFamilyOptimus">${data.lesson[activeLessonId].title}</h6>
                                    <p class="materialParagraph">You are in Lesson -/-</p>
                                </div>

                                <div class="app_lessonContentOverviewProgress">
                                    <p>Course Progress</p>
                                    <p>${data.lesson[activeLessonId].progress}% Completed</p>
                                </div>
                            </div>

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