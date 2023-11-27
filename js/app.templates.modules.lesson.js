app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.lesson = {
	loading : function(){
			var html =`
				<div class="row">
					<div class="col-xs-12">
						<div class="materialLessonVideo">
							<div class="materialPlaceHolder"></div>
						</div>
					</div>
				</div>

				<div class="row materialLesson">
					 <div class="col-xs-12">
						<div class="container-fluid" style="background: white; padding: 3em;">
							<div class="col-xs-12" class="materialLessonDescription">
								<h3  class="materialPlaceHolder" style="height: 30px; margin-top: 0"></h3>
								<h1  class="materialPlaceHolder" style="height: 60px;"></h1>
								<p class="materialPlaceHolder" style="height: 80px;"></p>
							</div>
							<div class="col-xs-12  col-md-6 materialLessonFile">
								<div class="materialPlaceHolder"></div>
							</div>
							<div class="col-xs-12 col-md-6">
								<div class="materialLessonRating ">
									<div class="materialLessonRatingCaption materialPlaceHolder"  style="width: 300px;"> </div>
								</div>
							</div>
						</div>
					</div>
				</div>`;
			
			return html;
	},
	content : function (lessonId){
        var data = app.data;

        let activeLessonId = lessonId;
        let parentChapterId = app.data.lesson[activeLessonId].parentChapter;
        let parentCourseId = app.data.chapter[parentChapterId].parentCourse;
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

        var nextLessonId = app.getNextLessonFromCourse(app.data.lesson[activeLessonId].id);
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
        

        switch(data.lesson[activeLessonId].type){
            case "video":

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


            var contentTopHtml = `
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
            `

            var contentBottomHtml = '';
            break;

            case "article":
                var contentTopHtml = `
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
                `;

                var contentBottomHtml = '';
                break;

                case "ebook":
                    var contentTopHtml = `
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
                    `;
                    var contentBottomHtml = '';
                    break;

                case "interactive-video":

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

                    var contentTopHtml = `
                        <div>
                            <div class="row"> 
                                <div class="col-xs-12">
                                    <div class="materialLessonVideo">
                                        ${overlayVideoAction}
                                        <iframe id="vimeo" style="display: none;" onload="$(this).fadeIn();" src="https://pianoencyclopedia.com/en/viewers/interactive-video/?vimeoUrl=${data.lesson[activeLessonId].content}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
                                        
                                    <script>  
                                        var thisLesson = function() { return app.data.user.learning[${data.lesson[activeLessonId].id}]; }
                                        var thisLessonId = ${data.lesson[activeLessonId].id};
                                        var videoStats = {};
                                        
                                        videoStats.duration = null;
                                        videoStats.progressLastUpdate = null;
                                        videoStats.progressLastSent = null;
                                            
                                        
                                        videoStats.initSegmentedProgressBar = function(){
                                            var progressArrayUniques = removeDuplicateAndKeepOrder(thisLesson().engagementProgressArrayDetails);
                                            for(var i=0; i< progressArrayUniques.length; i++){
                                                $("#segmentedProgressBar${data.lesson[activeLessonId].id}-"+ progressArrayUniques[i]).addClass("materialProgressBarInside");
                                            }
                                        }();
                                        
                                        window.document.PlyrCallbackDuration = function(duration){
                                            console.log("Callback Duration received", duration);
                                            
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

                                            var vimeoPlayer = $("#vimeo")[0].contentWindow.vimeoPlayer;

                                            /**
                                             * @param int seconds: the actual time that the player seeked to in seconds
                                             */
                                            vimeoPlayer.setCurrentTime(resumeTime).then(function(seconds) {
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

                                        };
                                        
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
            
                                        window.document.PlyrCallbackTimeUpdate  = function(vimeoData, videoDuration, videoEngagementProgressArrayDetails, engagementProgressRealPercent, engagementProgressMaxPercent, engagementTime){
                                            console.log("Callback Time Update", vimeoData, videoDuration, videoEngagementProgressArrayDetails, engagementProgressRealPercent, engagementProgressMaxPercent, engagementTime);
                                            
                                            var currentPercent = Math.ceil(vimeoData.percent * 100);

                                            //If we have more than one item, and last element is the same as the one to add, exit
                                            var videoengagementProgressArrayDetailsLength = thisLesson().engagementProgressArrayDetails.length;
                                            if((videoengagementProgressArrayDetailsLength >=1) && (thisLesson().engagementProgressArrayDetails[videoengagementProgressArrayDetailsLength - 1] == currentPercent)) return;

                                            var timestamp = (new Date()).getTime();
                                            timestamp = Math.floor(timestamp / 1000);

                                            //Avoid adding progress 0 when user clicks play
                                            if(currentPercent >0){
                                                thisLesson().engagementProgressArrayDetails.push(currentPercent);												
                                            }
                                            
                                            //Update Segmented Progress Bar
                                            $("#segmentedProgressBar${data.lesson[activeLessonId].id}-"+currentPercent).addClass("materialProgressBarInside");
                                                
                                            videoStats.progressLastUpdate = timestamp;
                                            
                                            thisLesson().engagementFirstDate = thisLesson().engagementFirstDate || datetimeToEST(new Date());
                                            thisLesson().engagementLastDate  = datetimeToEST(new Date());
                                            
                                            app.data.user.stats.lessons.lastLessonEngagementId	 = "${data.lesson[activeLessonId].id}";
                                                
                                        }
                                        
                                        window.document.PlyrCallbackPlay = function(vimeoData){
                                            console.log("Callback Play received", vimeoData); 
                                            videoStats.update(false);
                                        };
                                        
                                        window.document.PlyrCallbackPause  = function(vimeoData, videoDuration, videoEngagementProgressArrayDetails, engagementProgressRealPercent, engagementProgressMaxPercent, engagementTime){
                                            console.log("Callback Pause", vimeoData, videoDuration, videoEngagementProgressArrayDetails, engagementProgressRealPercent, engagementProgressMaxPercent, engagementTime);
                                            
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
                                        }
            
                                        
                                        window.document.PlyrCallbackEnded = function(vimeoData){
                                            console.log("Callback Ended received", vimeoData);
                                            videoStats.update(false);
                                            
                                            //Show Action Overlay
                                            $('.materialLessonVideoActionOverlay').fadeIn();
                                            
                                            if(thisLesson().engagementProgressRealPercent>70){
                                                materialDialog.show('dialogLessonRating');
                                            }
                                        };
                                        
                                        window.document.PlyrCallbackReady = function(player){
                                            console.log("Callback Ready received", player);
                                        };
                                        
                                        //Run video stats update as soon as we load the page, and save to server
                                        videoStats.update(true);
                                        
                                        //Call update fx every 15 seconds if no other action taken, and since default parameter saveToServerAlways is false, it will only save to server if there was progress
                                        app.runTimer(videoStats.update, 15000); 

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
                    `;

                    var contentBottomHtml = '';
                    break;


                case "interactive-pdf":

                var contentTopHtml = `
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
                `;

                var contentBottomHtml = '';
        }


        var html = `
            ${contentTopHtml} 
            ${contentBottomHtml}
        `;

        return html;
    }
}