app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.newlesson = {
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
    content: function (lessonId) {
        var data = app.data;

        // activeCourseId = 3000;
        let activeLessonId = lessonId;
        let parentChapterId = data.lesson[activeLessonId].parentChapter;
        let parentCourseId = data.chapter[parentChapterId].parentCourse;
        let activeCourseId = parentCourseId;


        let segmentedProgressBarHtml = function(lessonId){
			let segmentedProgressBarInsideHtml = "";
			for(var i=1; i<=100; i++){
				segmentedProgressBarInsideHtml += `<div id="segmentedProgressBar${data.lesson[activeLessonId].id}-${i}" style="width: 1%; height: 8px; float: left;"></div>`;
			}

			return `<div id="segmentedProgressBar${lessonId}" class="materialProgressBar materialThemeDarkGold"> 
						${segmentedProgressBarInsideHtml}
					</div>`;
		};

        var nextLessonId = app.getNextLessonFromCourse(data.lesson[activeLessonId].id);
        if(nextLessonId) {
            var description = "You are almost done...";
            var buttonText = "Next Lesson";
            var buttonHref = `#!/lesson/${nextLessonId}`;
        }
        else {
            var description = "There is more.";
            var buttonText = "Dashboard";
            var buttonHref = `#!/`;
        
        }

        var overlayVideoAction = `<div class="materialLessonVideoActionOverlay" style="background: #1d1d1d; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 999; display: none;">
            <div style="position: relative; display: table;">
                <div style="display: table-cell; vertical-align: middle; color: wheat; text-align: center; position: relative;">
                    <h3 style="margin-top: 0;">
                            <b>${description}</b><br>
                    </h3>
                    <button class="materialButtonFill materialThemeGoldDark" onclick="router.navigate('${buttonHref}');" style=" margin: 0; font-size: 17px;">${buttonText}</button><br>
                    <button class="materialButtonText materialThemeGoldDark" onclick="$('.materialLessonVideoActionOverlay').fadeOut(); var iframe = document.querySelector('#vimeo');	$('#vimeo')[0].contentWindow.vimeoPlayer.play();" style=" margin: 0; margin-top: 10px;"><i class="fa fa-repeat" style="vertical-align: baseline; margin-right: 7px;"></i>Watch Again</button>
                </div>
            </div>
        </div>`;

        var html = `
            <main class="app_mainContainer maxWidthContainer">
                <ul class="materialBreadCrumbs marginTop24 marginBottom3">
                    <li>Exclusive Gifts</li>
                    <li>Lessons</li>
                    <li>The Hidden Patterns of Music</li>
                </ul>
                
                <div class="app_LessonContainer">
                    <div>
                        <div class="row"> 
                            <div class="col-xs-12">
                                <div class="materialLessonVideo">
                                    ${overlayVideoAction}    
                                    <iframe id="vimeo" style="display: none;" onload="$(this).fadeIn();" src="${data.lesson[activeLessonId].content}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
                                        
                                    <script>  
                                    var thisLesson = function() { return app.data.user.learning[${data.lesson[activeLessonId].id}]; }
                                    var thisLessonId = ${data.lesson[activeLessonId].id};
                                    var videoStats = {};
                                    
                                    videoStats.initSegmentedProgressBar = function(){
                                        var progressArrayUniques = removeDuplicateAndKeepOrder(thisLesson().engagementProgressArrayDetails);
                                        for(var i=0; i< progressArrayUniques.length; i++){
                                            $("#segmentedProgressBar${data.lesson[activeLessonId].id}-"+ progressArrayUniques[i]).addClass("materialProgressBarInside");
                                        }
                                    }();
    
                                    var initVimeoVideo = function(){
                                        var iframe = document.querySelector('#vimeo');
                                        var player = new Vimeo.Player(iframe);

                                        videoStats.duration = null;
                                        videoStats.progressLastUpdate = null;
                                        videoStats.progressLastSent = null;

                                        /**
                                         * @param int duration: duration of video in seconds
                                         */
                                        player.getDuration().then(function(duration) {
                                            videoStats.duration = duration;

                                            var resumeTime = parseInt(duration * thisLesson().engagementProgressMaxPercent/100);
                                            
                                            //If undefined or not set, no need to seek video, we can start from the beginning
                                            if(!resumeTime) return;

                                            //If video was finished before start from beginning
                                            if(resumeTime >= duration) {
                                                resumeTime = 0;
                                            } //If video was unfinished, start from resume time minus 6 seconds
                                            else if(resumeTime > 6) {
                                                resumeTime = resumeTime - 6;
                                            }

                                            /**
                                             * @param int seconds: the actual time that the player seeked to in seconds
                                             */
                                            player.setCurrentTime(resumeTime).then(function(seconds) {
                                                    console.log("Set current time to "+  seconds)
                                            }).catch(function(error) {
                                                switch (error.name) {
                                                    case 'RangeError':
                                                            console.log("Video Resume failed: The time was less than 0 or greater than the video�s duration");
                                                        break;

                                                    default:
                                                        console.log("Video Resume failed: " + error.name);
                                                        break;
                                                }
                                            });

                                        }).catch(function(error) {
                                            console.log("Video Resume failed: " + error.name);
                                        });

                                        videoStats.update = function(saveToServerAlways){
                                            thisLesson().engagementProgressArrayDetails 	= thisLesson().engagementProgressArrayDetails || []; 
                                            thisLesson().engagementProgressMaxPercent 		= thisLesson().engagementProgressMaxPercent   || 0; 
                                            thisLesson().engagementProgressRealPercent 		= thisLesson().engagementProgressRealPercent  || 0; 
                                            thisLesson().engagementTime 					= thisLesson().engagementTime   			  || 0; 
                                        
                                            /* Babylon will not transcribe this code as it is executed later, so we must code it compatible for IE 11 and not use default parameters in function declaration*/
                                            if(saveToServerAlways === undefined){saveToServerAlways = false;} 
                                        
                                            //Security check in case timer is not deleted on time.
                                            if(thisLessonId != ${data.lesson[activeLessonId].id}) { console.log("Timer not deleted on time"); return;}

                                            //engagementProgressArrayDetails: Contains all the details about the user progress, how many times he played, resumed, seeked, etc.etails = (videoStats.engagementProgressArrayDetails); 
                                            //progressArrayUniques: Contains a *summary* of all the times user watched video, eliminating repeated watched parts.
                                            videoStats.progressArrayUniques = removeDuplicateAndKeepOrder(thisLesson().engagementProgressArrayDetails);
                                            
                                            thisLesson().engagementProgressMaxPercent  = (thisLesson().engagementProgressArrayDetails && thisLesson().engagementProgressArrayDetails.length) ? Math.max.apply(null, thisLesson().engagementProgressArrayDetails) : 0; 
                                            thisLesson().engagementProgressRealPercent = videoStats.progressArrayUniques.length; 
                                            if(videoStats.duration){
                                                thisLesson().engagementTime = videoStats.duration * thisLesson().engagementProgressArrayDetails.length/100;
                                            }
                                                
                                            console.log("Updated stats");
                                            
                                            //Only update to server if there has been new progress, or if saveToServerAlways is true
                                            if (saveToServerAlways || (videoStats.progressLastSent != videoStats.progressLastUpdate)) { 
                                                
                                                if(videoStats.duration){
                                                    
                                                    //1 seconds is worth 1 points, rounded to nearest 10th
                                                    var rewardPoints = Math.round(videoStats.duration * thisLesson().engagementProgressRealPercent / 100 / 10) * 10;
                                                    if(thisLesson().engagementProgressRealPercent>=99 && !thisLesson().reached100Once){
                                                        app.callback("path=" + app.currentRoute + "&progress=100");
                                                        app.addRewardPoints("Completed 100% of this lesson", rewardPoints); thisLesson().reached100Once = true;
                                                    }
                                                    else if(thisLesson().engagementProgressRealPercent>=75 && !thisLesson().reached75Once){
                                                        app.callback("path=" + app.currentRoute + "&progress=75");
                                                        app.addRewardPoints("Completed 75% of this lesson", rewardPoints);  thisLesson().reached75Once = true;
                                                    }
                                                    else if(thisLesson().engagementProgressRealPercent>=50 && !thisLesson().reached50Once){
                                                        app.callback("path=" + app.currentRoute + "&progress=50");
                                                        app.addRewardPoints("Completed 50% of this lesson", rewardPoints);  thisLesson().reached50Once = true;
                                                    }
                                                    else if(thisLesson().engagementProgressRealPercent>=25 && !thisLesson().reached25Once){
                                                        app.callback("path=" + app.currentRoute + "&progress=25");
                                                        app.addRewardPoints("Completed 25% of this lesson", rewardPoints);  thisLesson().reached25Once = true;
                                                    }
                                                    
                                                }
                                            
                                                videoStats.progressLastSent = videoStats.progressLastUpdate;  
                                                $("#lessonProgress${data.lesson[activeLessonId].id}").html(thisLesson().engagementProgressMaxPercent);
                                                if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${data.lesson[activeLessonId].id}").html("Completed"); }
                                                
                                                app.saveToServer(${data.lesson[activeLessonId].id}); 
                                            }
                                        };

                                            
                                        //Measures the position of playback
                                        player.on('timeupdate', function(vimeoData) {

                                            var currentPercent = Math.ceil(vimeoData.percent * 100);

                                            //If we have more than one item, and last element is the same as the one to add, exit
                                            var videoengagementProgressArrayDetailsLength = thisLesson().engagementProgressArrayDetails.length;
                                            if((videoengagementProgressArrayDetailsLength >=1) && (thisLesson().engagementProgressArrayDetails[videoengagementProgressArrayDetailsLength - 1] == currentPercent)) return;

                                            var timestamp = (new Date()).getTime();
                                            timestamp = Math.floor(timestamp / 1000);

                                            //Avoid adding progress 0 when user clicks play
                                            if(currentPercent > 0){
                                                thisLesson().engagementProgressArrayDetails.push(currentPercent);												
                                            }
                                            
                                            //Update Segmented Progress Bar
                                            $("#segmentedProgressBar${data.lesson[activeLessonId].id}-"+currentPercent).addClass("materialProgressBarInside");
                                                
                                            videoStats.progressLastUpdate = timestamp;
                                            
                                            thisLesson().engagementFirstDate = thisLesson().engagementFirstDate || datetimeToEST(new Date());
                                            thisLesson().engagementLastDate  = datetimeToEST(new Date());
                                            
                                            app.data.user.stats.lessons.lastLessonEngagementId	 = "${data.lesson[activeLessonId].id}";

                                        });
                                        
                                        //Update stats on play, pause, and ended, and save to server only if progress has changed since last check
                                        player.on('play', function(vimeoData) {
                                            console.log('play', vimeoData);
                                            videoStats.update(false);
                                        });
                                        
                                        //Update stats on play, 
                                        player.on('pause', function(vimeoData) {
                                            console.log('paused', vimeoData);
                                            videoStats.update(false);

                                            //Sometimes 'pause' is triggered instead of ended
                                            if(vimeoData.percent == 1){
                                                
                                                //Show Action Overlay 					
                                                $('.materialLessonVideoActionOverlay').fadeIn();
                                                
                                                if(thisLesson().engagementProgressRealPercent>90){
                                                    materialDialog.show('dialogLessonRating');
                                                }
                                            }
                                            
                                            
                                        });

                                        player.on('ended', function(vimeoData) {
                                            console.log('ended', data);
                                            videoStats.update(false);
                                            
                                            //Show Action Overlay
                                            $('.materialLessonVideoActionOverlay').fadeIn();
                                                
                                            if(thisLesson().engagementProgressRealPercent>70){
                                                materialDialog.show('dialogLessonRating');
                                            }
                                        });
                                        
                                        //Run video stats update as soon as we load the page, and save to server
                                        videoStats.update(true);
                                        
                                        //Call update fx every 15 seconds if no other action taken, and since default parameter saveToServerAlways is false, it will only save to server if there was progress
                                        app.runTimer(videoStats.update, 15000); 
                                        
                                    }(); 

                                    </script>
                                        
                                </div> 
                            </div>
                            
                            <div class="col-xs-12">	
                                ${segmentedProgressBarHtml(data.lesson[activeLessonId].id)}
                            </div>
                        </div>

                        <section class="app_lessonOverviewSection">
                            <div class="courseTitle">
                                <h4 class="fontFamilyOptimus">${data.lesson[activeLessonId].title}</h4>
                                <p class="materialParagraph">${data.lesson[activeLessonId].subtitle}</p>
                            </div>

                            <div class="lessonProgress">
                                <p>${data.lesson[activeLessonId].progress}% Completed</p>
                                <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em;"> <i class="fa fa-bookmark"></i> </a>
                            </div>

                            <p class="lessonDescription">
                                ${data.lesson[activeLessonId].description}
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