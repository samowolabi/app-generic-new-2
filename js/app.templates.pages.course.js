app.templates = app.templates || {}; 
app.templates.pages = app.templates.pages || {}; 
app.templates.pages.course = {
	loading : function(target){
			var html =`
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.modules.lesson.loading()}</div>
						<div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
						<div id="page-lesson-cards" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.loading()}</div>
					</div>`;
			
			return html;
	},
	content : function (courseId){
		
		var dataCourse 		= app.data.course[courseId];
		var dataCards 		= app.data.user.cards; 
		 
		var defaultImage = 'https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png';
		var courseTitle 		 = app.data.course[courseId].title || "Course";		
		var courseDescription  	 = app.data.course[courseId].description || "";	
		var courseImage          = app.data.course[courseId].image || defaultImage;	 
		var courseProgress 		 = app.data.course[courseId].stats.lessons.totalProgress || 0;
		
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
		
		
		var html =`
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;"> 
							<div class="heroDiv" style="background-image: url(${courseImage}); background-size: cover; background-position: top center;">
								<div class="heroDivImageOverlay"></div>
								<div class="heroDivContent">
									<h2 class="marginTop7">${courseTitle}</h2>
									<p class="marginTop4">${courseDescription}</p>
									<span class="heroDivProgress marginTop8 marginBottom5">${courseProgress}% Completed</span>
									<a href="${buttonLink}" class="materialButtonFill materialThemeDark resumeLessonBtn"><i class="fa fa-play"></i> ${buttonCaption}</a>
									<div class="heroDivProgress marginTop5">${resumeLessonTitle}</div>
								</div>
							</div>
						</div>
						<!-- <div id="page-lesson-cards" class="row action-cards-all">${app.templates.modules.actionCards.content(dataCards, true, true)}</div >-->
						<div id="page-lesson-outline" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.content(app.data, courseId, null, "Your Progress")}</div>  
						<div class="row action-cards-bottom">${app.templates.modules.actionCards.content(app.data.user.cards, false, false)}
					</div>`; 
		return html;
	},
	notFound : function (lessonId){
	
		materialDialog.alert("Oops!", 
			`There is no course number ${lessonId}. Press 'OK' to be taken to the dashboard where you will be able to access more lessons.`,
			{
				hideCallback: function(){
					router.navigate('/');
				}
			}
		);	 
				
		return app.templates.pages.lesson.loading();
	}
};
 


 
