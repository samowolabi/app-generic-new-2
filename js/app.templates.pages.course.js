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
        var courseProgress = app.data.course[courseId].stats.lessons.totalProgress || 0;
		
        var buttonCaption = (courseProgress > 0)? ((courseProgress > 85)? "Finish Course": "Resume Course"): "Start Course";

        		/*
		* @purpose: Get all lessons from this course and check which one was the lesson the user last engaged with
		* @param int courseId: the course id, in question
		*/
		var getLastEngagedLessonIdFromCourse = function(courseId){
	
			/*
			* @purpose: internal function to get all lessons ids from a particular course
			* @param int courseId: the course id, in question
			*/
			var getAllLessonsIdsFromCourse = function(courseId) {
				var allLessonsIdsFromCourse = [];
				
				if(app.data.course[courseId]){
					app.data.course[courseId].chapterIds.forEach(function(chapterId){
					   if(app.data.chapter[chapterId]){
							app.data.chapter[chapterId].lessonIds.forEach(function(lessonId){
							   allLessonsIdsFromCourse.push(lessonId);
							})
					   } 
					})
				}
				
				return allLessonsIdsFromCourse;
			};
			
			var courseEngagementLastestDate = false; 
			var courseEngagementLastestLessonId = false;
			getAllLessonsIdsFromCourse(courseId).forEach(function(lessonId){
				if(app.data.user.learning[lessonId] && app.data.user.learning[lessonId].engagementLastDate){
					var engagementLastDate = new Date(app.data.user.learning[lessonId].engagementLastDate);
					
					if(!courseEngagementLastestDate){
						courseEngagementLastestDate = engagementLastDate;
						courseEngagementLastestLessonId = lessonId;
					}else{
						if(engagementLastDate.getTime() > courseEngagementLastestDate.getTime()){
							courseEngagementLastestDate = engagementLastDate;
							courseEngagementLastestLessonId = lessonId;
						}
					}
				}
				
			}); 
			
			return courseEngagementLastestLessonId;
		};


        /*
		* @purpose: get the first lesson of the first chapter of this course
		* @param int courseId: the course id, in question
		*/
		var getFirstLessonIdFromCourse = function(courseId){
			var firstLessonId = false;
			if(app.data.course[courseId]){
				app.data.course[courseId].chapterIds.forEach(function(chapterId){
				   if(app.data.chapter[chapterId]){
						app.data.chapter[chapterId].lessonIds.forEach(function(lessonId){
						   if(!firstLessonId){ firstLessonId =  lessonId};
						})
				   } 
				})
			}
			return firstLessonId;
		};


        var lastEngagedLessonIdFromCourse = getLastEngagedLessonIdFromCourse(courseId);
		var firstLessonIdFromCourse = getFirstLessonIdFromCourse(courseId);
		
		var lessonId = lastEngagedLessonIdFromCourse ? lastEngagedLessonIdFromCourse : firstLessonIdFromCourse; 
		
		if(lessonId){
			var resumeLessonTitle =  app.data.lesson[lessonId].title;
			var buttonLink = "#!/lesson/"+lessonId; 
		}
		else{
			var resumeLessonTitle =  "Browse Your Dashboard";
			var buttonLink = "#!/"; 
			buttonCaption = "Go back";
		}


        var url;

        if(app.data.offer.isDataAvailable()){
            url = "https://pianoencyclopedia.com/en/" + app.data.offer.general.availability.urlPathStartArray[0] + "/" + app.data.offer.general.availability.urlPathEnd + "/";
        }
        else{
            url = "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/";
        }

		var completenessPorcentage = Math.round(app.data.user.stats.lessons.complete /app.data.user.stats.lessons.total *100); 
        var outLineLearnHtml = `
            <div class="materialOutlineLearn">
                <h5 class="materialOutlineTitle">More Lessons</h5>
                <ul class="materialOutlineList"> 
                    <li data-progress="${completenessPorcentage}" data-progress-affects-class="materialOutlineViewComplete" class="materialOutlineView">
                        <div class="materialOutlineListBody">
                            <a href="#!/">
                                <div class="materialOutlineThumbnail" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png);">
                                    <div class="materialProgressBar ">
                                        <div class="materialProgressBarInside" data-progress="${completenessPorcentage}" data-progress-affects-width style="width:10px;"></div>
                                    </div>
                                </div>
                                <h6>Go Back To Your Lessons Dashboard</h6>
                                <p>You have ${app.data.user.stats.lessons.incomplete} unfinished lessons</p> 
                            </a>
                        </div>
                        <div class="materialOutlineIcon"><i class="fa fa-check"></i></div>
                    </li>
                </ul> 
            </div>
        `;
        
        var completenessPorcentage = 0;
        outLineLearnHtml += `
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
        `;

        outLineLearnHtml += `
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
            <main class="app_mainContainer maxWidthContainer marginBottom20">
                <header class="app_heroHeader">
                    <div>
                        <div class="app_heroSection maxWidthContainer">
                            <h4 class="fontFamilyOptimus">${courseData.title}</h4>
                            <p class="materialParagraph materialThemeGoldDark">${courseData.description}</p>

                            <div class="app_headerButtonContainer">
                                <div>
                                    <a href="${buttonLink}" class="materialButtonFill materialThemeGoldDark">${buttonCaption}</a>
                                    <a href="#" class="materialButtonIcon materialThemeDark" data-button="" data-icon-class-on="fa fa-bookmark" data-icon-class-off="fa fa-bookmark-o" style="font-size: 1.5em; display: none;"> <i class="fa fa-bookmark"></i> </a>
                                </div>
                                <p>${courseData.stats.lessons.complete} of ${courseData.stats.lessons.total} LESSONS</p>
                            </div>

                            <div class="buttonLessonTitle">${resumeLessonTitle}</div>
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
                </section>

                ${app.templates.modules.lessonsOutline.content(courseId, courseData.stats.lessons.totalProgress)}
            </main>
        `;

        html += `
                <script>
                    console.log("RUNNING");
                    // dashboardInfiniteScrolling.load();
                </script>
			`;
        return html;
    }
}