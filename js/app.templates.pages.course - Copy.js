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
		 
		var courseTitle 		 = app.data.course[courseId].title;		
		var courseDescription  	 = app.data.course[courseId].description || "No course description";	
		var courseImage          = app.data.course[courseId].image || "";	 
		var courseProgress 		 = app.data.course[courseId].stats.lessons.totalProgress;
		
		var buttonCaption = (courseProgress > 0)? ((courseProgress > 85)? "Finish Lessson": "Resume Lessson"): "Start Lesson";
		var buttonLink = "#!"; //TODO
		
		var lessonId = null; //TODO
		
		var html =`
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;"> 
							<div class="heroDiv" style="background-image: url(${courseImage})">
								<div class="heroDivImageOverlay"></div>
								<div class="heroDivContent">
									<h2>${courseTitle}</h2>
									<p class="marginTop4">${courseDescription}</p>
									<span class="heroDivProgress marginTop8">${courseProgress}% Completed</span>
									<a href="#!" class="materialButtonFill materialThemeDark"><i class="fa fa-play"></i> ${buttonCaption}</a>
								</div>
							</div>
						</div>
						<!-- <div id="page-lesson-cards" class="row action-cards-all">${app.templates.modules.actionCards.content(dataCards, true, true)}</div >-->
						<div id="page-lesson-outline" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.content(app.data, courseId, lessonId, "Your Progress")}</div>  
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
 


 
