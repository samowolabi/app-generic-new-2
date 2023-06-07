app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.lessonsOutline = {
	loading : function(){
			var html =`
				<h5 class="materialOutlineHeaderTitle materialThemeDark">
					<span class="materialPlaceHolder materialThemeDark" style="height:30px;width:250px;margin:0 auto;margin-bottom:10px;display:block"> </span>
					<span class="materialPlaceHolder materialThemeDark" style="height:25px;width:150px;margin:0 auto;display:block"> </span>
				</h5>
				<div class="materialProgressBar materialThemeDark">
					<div style="width:10px" class="materialProgressBarInside"></div>
				</div>
				<div class="materialOutlineLearn">
					<h5 class="materialOutlineTitle" style="height:40px;width:100%;padding:10px"> 
						<span class="materialPlaceHolder materialThemeDark" style="height:19px;width:150px;margin:0 auto;display:block;float:left"> </span>
					</h5>
					<ul class="materialOutlineList">
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
					</ul>
				</div> `;
			
			return html;
	},
	content : function (data, activeCourseId, activeLessonId, overrideTitle){ 
		var title = overrideTitle? overrideTitle : data.course[activeCourseId].title;
		var courseProgress = data.course[activeCourseId].stats.lessons.totalProgress;
			
		var html = ` 
			<h5 class="materialOutlineHeaderTitle materialThemeDark">
				${title}
				<p>&laquo; ${courseProgress}% Completed &raquo;</p>
			</h5>
			
			<div class="materialProgressBar materialThemeDark">
				<div class="materialProgressBarInside" data-progress="${courseProgress}" data-progress-affects-width style="width:10px;"></div>
			</div>`;
				
				  
			data.course[activeCourseId].chapterIds.forEach(function(chapterId){
				var chapterTitle = data.chapter[chapterId].title;
				
				if(data.chapter[chapterId].stats.lessons.total >0){   
					html += `<div class="materialOutlineLearn">
								<h5 class="materialOutlineTitle">${chapterTitle}</h5>
								<ul class="materialOutlineList">`;
						
					var lessonList = [];
					if(data.chapter[chapterId].lessonIds){
						data.chapter[chapterId].lessonIds.forEach(function(lessonId){
							var lessonTitle 	= data.lesson[lessonId].title;
							var lessonSubtitle  = data.lesson[lessonId].subtitle;
							var lessonImage 	= data.lesson[lessonId].image;
							var lessonProgress  = data.lesson[lessonId].progress;
							
							switch(data.lesson[lessonId].dateStatus){
								case "expiringAsap":
									var scarcityHtml = `<p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring in <span data-countdown="${data.lesson[lessonId].deadlineDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>`;
									break;
								case "expiringSoon":
									var scarcityHtml = `<p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring Soon</p>`;  
									break;
								case "comingAsap":
									var scarcityHtml = `<p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Available in <span data-countdown="${data.lesson[lessonId].availableDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>`;
									break;
								case "comingSoon":
									var scarcityHtml = `<p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Coming Soon</p>`;  
									break;
								case "expired":
									var scarcityHtml = `<p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expired</p>`;  
									break;	
								case "available": 
								default: 
									var scarcityHtml = "";
							}
			
							var activeClass = (activeLessonId == lessonId) ? "active" : "";
							//If user clicks on current lesson, scroll to top of page; else navigate to new lesson page.
							var href = (activeLessonId == lessonId) ? `javascript: $('html, body').animate({ scrollTop: $('#page-lesson-lesson').offset().top-85},500,'linear');` : `#!/lesson/${lessonId}` ;
			
							html +=	`
							<li data-progress="${lessonProgress}" data-progress-affects-class="materialOutlineViewComplete" class="materialOutlineView ${activeClass}">
								<div class="materialOutlineListBody">
									<a href="${href}">
										<div class="materialOutlineThumbnail" style="background-image: url(${lessonImage});">
											<div class="materialProgressBar ">
												<div class="materialProgressBarInside" data-progress="${lessonProgress}" data-progress-affects-width style="width:10px;"></div>
											</div>
										</div>
										<h6>${lessonTitle}</h6>
										<p>${lessonSubtitle}</p>
										${scarcityHtml}
									</a>
								</div>
								<div class="materialOutlineIcon"><i class="fa fa-check"></i></div>
							</li>`;
						});
					}
				
					
					html +=		`</ul> 
							</div>`;
				}
				  
			});	
		

		//Add an additional navigation to the Dashboard
		var completenessPorcentage =  Math.round(app.data.user.stats.lessons.complete /app.data.user.stats.lessons.total *100); 
		html += `<div class="materialOutlineLearn">
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
				</div>`;		


		//Add an additional navigation with a Native ad 
		var completenessPorcentage = 0;
		html += `<div class="materialOutlineLearn">
					<h5 class="materialOutlineTitle" style="background: #5f0000;">Upgrade Your Experience</h5>
					<ul class="materialOutlineList"> 
						<li data-progress="${completenessPorcentage}" data-progress-affects-class="materialOutlineViewComplete" class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a target="_blank" href="https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/?source=nativeAd">
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
				</div>`;		
									
								
		return html;
	}
};
 


 
