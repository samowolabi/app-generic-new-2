app.templates = app.templates || {}; 
app.templates.pages = app.templates.pages || {}; 
app.templates.pages.dashboard = {
	loading : function(){
			var html =`
					<div class="container" style="margin-top: 90px;">
						<div class="row"> 
							${app.templates.modules.lessonCards.loading()}
						</div>
					</div>`;
			
			return html;
	},
	sortedNewestFirst : function (data){
		return app.templates.pages.dashboard.__createPage(data, data.global.courses.sortedNewestFirst);
	},
	sortedExpiringFirst : function (data){ 	
		return app.templates.pages.dashboard.__createPage(data, data.global.courses.sortedExpiringFirst);
	}, 
	__createCourses : function(data, coursesIdsInOrder){
	
		var html = "";
		coursesIdsInOrder.forEach(function(courseId){
					if(data.course[courseId].stats.lessons.total >0){
						var courseTitle = data.course[courseId].title;
						html += `<h2 class="materialHeaderBox materialTextCenter materialThemeGreyLight fontFamilyOptimus"> ${courseTitle}</h2>`;
						
						data.course[courseId].chapterIds.forEach(function(chapterId){
							if(data.chapter[chapterId].stats.lessons.total >0){   
								var chapterTitle = data.chapter[chapterId].title;
								
								html += `<h3 class="materialHeaderBox materialTextCenter materialThemeGreyDark fontFamilyLato"> ${chapterTitle}</h2>`;
								
								var lessonList = [];
								if(data.chapter[chapterId].lessonIds){
									data.chapter[chapterId].lessonIds.forEach(function(lessonId){
										lessonList.push(data.lesson[lessonId]);
									});
								}
		 
								html +=` 
									<div class="row"> 
										${app.templates.modules.lessonCards.content(lessonList)}
									</div>
								`;
							}
						});	 
					}
		});
		
		if(html === ""){
			html = ` 
					<div class="row"> 
						<div class="col-md-12">
							<h3 class="materialHeader materialThemeGoldDark" style="text-align: center;margin-bottom: 50px;text-transform: initial;">
								Sorry, No Lessons Available Right Now...<br><br>
								<span style="color: #ffcf4d;">Write to support@PianoEncyclopedia.com to Request Free Lessons</span>
							</h3>
						</div>
					</div>
				`;
		}
			
		return html;	
	},
	__createPage : function (data, coursesIdsInOrder){
		 
		var name = data.user.profile.name ? (data.user.profile.name + ",")  : "";
		 
		html = ` 
			<div class="container-fluid" style=" padding-top: 0px;">
				<div class="row">   
						 <h2 class="materialHeaderBox materialThemeDark   materialTextCenter fontFamilyLato materialColorDarkGrey" style="padding-top: 79px; font-size: 25px;  margin-bottom: 40px;   font-weight: 300;  color: #c8c8c8; background: rgba(52, 52, 51, 0.85)">
							Welcome back${data.user.profile.firstname ? (", " + data.user.profile.firstname )  : ""}!
						</h2> 
				</div>
			</div>
			<div class="container">
				<div class="row action-cards-top">  
					${app.templates.modules.actionCards.content([])} 
				</div>
			</div>
			<div class="container">
				<h2 id="dashboard-lessons-header" class="materialHeader materialTextCenter fontFamilyLato materialThemeDark" style="color: #949494;  margin-bottom: 20px; margin-top: 20px; font-weight: 300;">Your Lessons</h2>
		
				<div style="text-align: center; margin-bottom: 50px;"> 
					
					<div class="materialChipChoice materialThemeDark">
						<input class="materialChipInput materialThemeDark" name="sortLessonsBy" type="radio" value="/newest/"  checked="checked">
						<div class="materialChipInputText materialThemeDark">
							Sort Newest First
						</div>
					</div>
					
					<div class="materialChipChoice materialThemeDark">
						<input class="materialChipInput materialThemeDark" name="sortLessonsBy" type="radio" value="/expiring/">
						<div class="materialChipInputText materialThemeDark">
							Sort Expiring First
						</div>
					</div>
					
					<script>
						$( "input[name='sortLessonsBy']" ).change(function() {
						  var value = $(this).val();
						  router.navigate(value);
						});
					</script>
					
				</div>
	`; 
	
		html += `<div id="dashboard-lessons">${ app.templates.pages.dashboard.__createCourses(data, coursesIdsInOrder)}</div>`;	
		
		html += `<div class="row action-cards-bottom">${app.templates.modules.actionCards.content(app.data.user.cards, false, true)}</div>
			</div>`;
		return html;
	}
};
 


 
