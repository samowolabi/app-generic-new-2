app.templates = app.templates || {}; 
app.templates.pages = app.templates.pages || {}; 
app.templates.pages.lesson = {
	loading : function(target){
			var html =`
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.modules.lesson.loading()}</div>
						<div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
						<div id="page-lesson-cards" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.loading()}</div>
					</div>`;
			
			return html;
	},
	content : function (lessonId){
		
		var dataLesson 		= app.data.lesson[lessonId];
		var dataCards 		= app.data.user.cards; 
		
		//Create breacrumb
		var parentChapterId    = app.data.lesson[lessonId].parentChapter;
		var parentChapterTitle = app.data.chapter[parentChapterId].title;

		var parentCourseId 	   = app.data.chapter[parentChapterId].parentCourse;
		var parentCourseTitle  = app.data.course[parentCourseId].title;		
		
		var lessonSubtitle 	   = app.data.lesson[lessonId].subtitle; 
		
		dataLesson.breadcrumb = [parentCourseTitle, parentChapterTitle, lessonSubtitle];

		
		var html =`
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.modules.lesson.content(dataLesson)}</div>
						<div id="page-lesson-cards" class="row action-cards-all">${app.templates.modules.actionCards.content(dataCards, true, true)}</div>
						<div id="page-lesson-outline" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.content(app.data, parentCourseId, lessonId)}</div>  
						<div class="row action-cards-bottom">${app.templates.modules.actionCards.content(app.data.user.cards, false, false)}
					</div>`; 
		return html;
	},
	notFound : function (lessonId){
	
		materialDialog.alert("Oops!", 
			`There is no lesson number ${lessonId}. Press 'OK' to be taken to the dashboard where you will be able to access more lessons.`,
			{
				hideCallback: function(){
					router.navigate('/');
				}
			}
		);	 
				
		return app.templates.pages.lesson.loading();
	}
};
 


 
