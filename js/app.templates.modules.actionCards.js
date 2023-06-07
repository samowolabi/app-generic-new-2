app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.actionCards = { 
	loading : function(){
			var html =`
				<div class="col-sm-6 col-xs-12">
					<div class="materialCardProgress">
						 <div class="container-fluid">
							<div class="row">
								<div class="materialCardProgressLeft">
									<div class="materialImageCircle materialPlaceHolder"> </div>
								</div>
								 
								<div class="materialCardProgressRight">
									<h3 class="materialPlaceHolder"></h3>
									<p class="materialPlaceHolder"></p> 
								</div> 
							</div>
						</div>
					</div> 				
				</div> 	 
				
				<div class="col-sm-6 col-xs-12">
					<div class="materialCardProgress ">
						 <div class="container-fluid">
							<div class="row">
								<div class="materialCardProgressLeft">
									<div class="materialImageCircle materialPlaceHolder"> </div>
								</div>
								 
								<div class="materialCardProgressRight">
									<h3 class="materialPlaceHolder"></h3>
									<p class="materialPlaceHolder"></p> 
								</div> 
							</div>
						</div>
					</div> 				
				</div>`;
				
			return html;
	},
	content : function(cardsList, showDefaultCards, megaSizePermitted){
		if(typeof showDefaultCards === "undefined"){showDefaultCards = true;}
		if(typeof megaSizePermitted === "undefined"){megaSizePermitted = true;}
		
		var html = "";
		
		//Add default cards
		if(showDefaultCards){
			defaultCardsList =  app.templates.modules.actionCards.__createDefaultCards(); 
			
			var arrayDefaultCardsLength = defaultCardsList.length;
			for (var i = 0; i < arrayDefaultCardsLength; i++) {
				var settings = defaultCardsList[i]; 
				html += app.templates.modules.actionCards.__createCardHtml(settings); 
			}
		}

		//Custom User Cards
		var arrayCardsLength = cardsList.length;
		for (var i = 0; i < arrayCardsLength; i++) {
			var settings = cardsList[i];
			
			//Remove mega size if not permitted
			if(!megaSizePermitted && (settings.size === "materialCardSizeMega")){ 
				//Clone array before modifying it
				settings = JSON.parse(JSON.stringify(settings));
				settings.size ="";
			}
 
			html += app.templates.modules.actionCards.__createCardHtml(settings); 
		}
		
		return html;
	},
	__createDefaultCards : function(cardsList){
		var cardsList =  [];
		
		
		//These methods add new cards and return a new cardsList with more cards
		cardsList = app.templates.modules.actionCards.__createLearningPreferencesCards(cardsList);
		cardsList = app.templates.modules.actionCards.__createTotalProgressCard(cardsList);
		
		//Only Show this Card if Learning Preferences Card was completed
		if(cardsList.length<2){
			cardsList = app.templates.modules.actionCards.__createNextLessonCard(cardsList);
		}
		
		return cardsList;			
	},
	__createLearningPreferencesCards : function(cardsList){
		
		//Create Profile Card
		var genresCompleteness 	   = app.data.user.profile.genres 	  ? app.data.user.profile.genres.length    : 0;
		var interestsCompleteness  = app.data.user.profile.interests  ? app.data.user.profile.interests.length : 0; 
		var pianoLevelCompleteness = app.data.user.profile.pianoLevel ? 1 : 0; 

		var completenessScore = genresCompleteness + interestsCompleteness + pianoLevelCompleteness;
		var total 		 	  = 3 + 3 + 1;
		var completenessPorcentage =  Math.round(completenessScore / total *100);

		var text, action; 
		
		if(!pianoLevelCompleteness){
			text   = "<b>What is your piano level?</b>";
		}else{ 
			if(interestsCompleteness<3){
				text = "<b>What are your learning interests?</b>";
			}else{
				if(genresCompleteness<3){
					text = "<b>What are your favorite music genres?</b>";		
				} 
				else{
					return cardsList;		
				}
			}
		}
		
		action = "dialogsCompleteProfileFlow();";
		
		
		cardsList.push({
						"type"  		  : "circularProgress",
						"theme" 		  : "materialThemeGoldLight",
						"colClass"        : "col-sm-6 col-xs-12",
						"header"          : "Learning Preferences",
						"description"	  :  text + " Customize your learning experience.",
						"buttonText"      : "Complete",
						"buttonClass"     : "materialButtonOutline", 
						"progressValue"   : completenessPorcentage,
						"progressText"    : "Complete",
						"circularImage"   : "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.min.png", 
						"backgroundImage" : "",
						"buttonDisabled"  : false,
						"buttonAction"    : action
					});
					
		return cardsList;			
	},
	__createTotalProgressCard : function(cardsList){
		 
		var completenessPorcentage =  Math.round(app.data.user.stats.lessons.complete /app.data.user.stats.lessons.total *100);
              
		cardsList.push({
						"type"  		  : "circularNumber",
						"theme" 		  : "materialThemeGoldDark",
						"colClass"        : "col-sm-6 col-xs-12",
						"header"          : "Total Progress",
						"description"	  :  "<b style='color: #ffebb4;'>You have " + app.data.user.stats.lessons.incomplete + " unfinished lessons</b>. Complete them quickly to gain more Reward Points.<br><br><b style='color: #ffebb4;'>You have " + ((app.data.user.profile.rewardPoints) ? app.data.user.profile.rewardPoints : 0) + " Reward Points</b>. Unlock unique benefits and access more content for free.",
						"buttonText"      : "",
						"buttonClass"     : "materialButtonOutline", 
						"numberValue"     : app.data.user.stats.lessons.complete,
						"numberTotal"     : app.data.user.stats.lessons.total,
						"progressValue"   : completenessPorcentage,
						"progressText"    : "Lessons<br>Completed",
						"circularImage"   : "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.min.png", 
						"backgroundImage" : "",
						"buttonDisabled"  : false,
						"buttonAction"    : ""
					});
					
		return cardsList;			
	},
	__createNextLessonCard : function(cardsList){
		 
		var completenessPorcentage =  Math.round(app.data.user.stats.lessons.complete /app.data.user.stats.lessons.total *100);
              
		expiringLessonId 	   = app.data.user.stats.lessons.expiringLessonId;
		newestLessonId 		   = app.data.user.stats.lessons.newestLessonId;
		lastLessonAccessedId   = app.data.user.stats.lessons.lastLessonAccessedId;
		lastLessonEngagementId = app.data.user.stats.lessons.lastLessonEngagementId;
		
		//Get current lesson id
		var currentLessonId = false;
		var re = /\/lesson\/([\d]+)/;
		var matches = re.exec(window.location.href);
		if(matches && matches[0] && matches[1]){
		  currentLessonId = matches[1];
		}
		
		//If we are on lesson page, show the next immediate lesson
		if(currentLessonId &&  app.data.lesson[currentLessonId]){
			// Get the next lesson from current chapter
			var getNextLessonId = function(currentLessonId){
				var parentChapterId = app.data.lesson[currentLessonId].parentChapter; 
				var nextLessonIndex = app.data.chapter[parentChapterId].lessonIds.indexOf("" +currentLessonId) +1;
				var nextLessonId 	= app.data.chapter[parentChapterId].lessonIds[nextLessonIndex];
				return nextLessonId;
			}
			
			var getNextChapterFirstLessonId = function(currentChapterId){
				var parentCourseId 	 = app.data.chapter[currentChapterId].parentCourse;
				var nextChapterIndex = app.data.course[parentCourseId].chapterIds.indexOf("" +currentChapterId) +1;
				var nextChapterId    = app.data.course[parentCourseId].chapterIds[nextChapterIndex];
				
				if(nextChapterId && app.data.chapter[nextChapterId].lessonIds &&  Array.isArray(app.data.chapter[nextChapterId].lessonIds) && app.data.chapter[nextChapterId].lessonIds[0]){
					return app.data.chapter[nextChapterId].lessonIds[0];
				}
				else if(nextChapterId){
					return getNextChapterFirstLessonId(nextChapterId);
				}
				else{
					return false;
				}
			}
			
			var currentChapterId = app.data.lesson[currentLessonId].parentChapter;
			var nextLessonId = getNextLessonId(currentLessonId);
			if(!nextLessonId){
				nextLessonId = getNextChapterFirstLessonId(currentChapterId);
			}
			
			if(nextLessonId && app.data.lesson[nextLessonId]){
				cardsList.push({
							"type"  		  : "circularImage",
							"theme" 		  : "materialThemeGoldDark",
							"colClass"        : "col-sm-6 col-xs-12",
							"header"          : "Next Lesson",
							"description"	  : "<b>" + app.data.lesson[nextLessonId].title  + " - " + app.data.lesson[nextLessonId].subtitle + "</b>.<br><span style='color: #ffebb4;'>" + (app.data.user.learning[nextLessonId].engagementProgressRealPercent || 0) + "% Completed</span>",
							"buttonText"      : "Continue",
							"buttonClass"     : "materialButtonOutline",  
							"progressValue"   : app.data.user.learning[nextLessonId].engagementProgressRealPercent,
							"progressText"    : "Complete",
							"circularImage"   : app.data.lesson[nextLessonId].image, 
							"backgroundImage" : "",
							"buttonDisabled"  : false,
							"buttonAction"    : `router.navigate('#!/lesson/${nextLessonId}');`
				});
				return cardsList;		
			}
		} 
		
		if(lastLessonEngagementId && app.data.lesson[lastLessonEngagementId] && (lastLessonEngagementId != currentLessonId) && app.data.user.learning[lastLessonEngagementId] && (!app.data.user.learning[lastLessonEngagementId].engagementProgressRealPercent  || app.data.user.learning[lastLessonEngagementId].engagementProgressRealPercent < 95)){
				cardsList.push({
						"type"  		  : "circularImage",
						"theme" 		  : "materialThemeGoldDark",
						"colClass"        : "col-sm-6 col-xs-12",
						"header"          : "Resume Your Learning",
						"description"	  : "<b>" + app.data.lesson[lastLessonEngagementId].title  + " - " + app.data.lesson[lastLessonEngagementId].subtitle + "</b>.<br><span style='color: #ffebb4;'>" + (app.data.user.learning[lastLessonEngagementId].engagementProgressRealPercent || 0) + "% Completed</span>",
						"buttonText"      : "Complete",
						"buttonClass"     : "materialButtonOutline",  
						"progressValue"   : app.data.user.learning[lastLessonEngagementId].engagementProgressRealPercent,
						"progressText"    : "Complete",
						"circularImage"   : app.data.lesson[lastLessonEngagementId].image, 
						"backgroundImage" : "",
						"buttonDisabled"  : false,
						"buttonAction"    : `router.navigate('#!/lesson/${lastLessonEngagementId}');`
				});
		}
		else if(lastLessonAccessedId && app.data.lesson[lastLessonAccessedId] && (lastLessonAccessedId != currentLessonId) && app.data.user.learning[lastLessonAccessedId] && (!app.data.user.learning[lastLessonAccessedId].engagementProgressRealPercent || app.data.user.learning[lastLessonAccessedId].engagementProgressRealPercent < 95)){
				cardsList.push({
						"type"  		  : "circularImage",
						"theme" 		  : "materialThemeGoldDark",
						"colClass"        : "col-sm-6 col-xs-12",
						"header"          : "Resume Your Learning",
						"description"	  : "<b>" + app.data.lesson[lastLessonAccessedId].title  + " - " + app.data.lesson[lastLessonAccessedId].subtitle + "</b>. <br><span style='color: #ffebb4;'>" + (app.data.user.learning[lastLessonAccessedId].engagementProgressRealPercent || 0 ) + "% Completed</span>",
						"buttonText"      : "Complete",
						"buttonClass"     : "materialButtonOutline",  
						"progressValue"   : app.data.user.learning[lastLessonAccessedId].engagementProgressRealPercent || 0,
						"progressText"    : "Complete",
						"circularImage"   : app.data.lesson[lastLessonAccessedId].image, 
						"backgroundImage" : "",
						"buttonDisabled"  : false,
						"buttonAction"    : `router.navigate('#!/lesson/${lastLessonAccessedId}');`
				});
			
		}
		else if(expiringLessonId && app.data.lesson[expiringLessonId] && (expiringLessonId != currentLessonId) && app.data.user.learning[expiringLessonId] && app.data.user.learning[expiringLessonId].deadlineDateString && (app.data.user.learning[expiringLessonId].dateStatus =="expiringAsap") && (!app.data.user.learning[expiringLessonId].engagementProgressRealPercent || app.data.user.learning[expiringLessonId].engagementProgressRealPercent < 95)){
			cardsList.push({
						"type"  		  : "circularDeadline",
						"theme" 		  : "materialThemeGoldDark",
						"colClass"        : "col-sm-6 col-xs-12",
						"header"          : "Free Access Expiring",
						"description"	  : "<b>" + app.data.lesson[expiringLessonId].title  + " - " + app.data.lesson[expiringLessonId].subtitle + "</b>.<br><span style='color: #ffebb4;'>" + (app.data.user.learning[expiringLessonId].engagementProgressRealPercent ||0) + "% Completed</span>",
						"buttonText"      : "Complete",
						"buttonClass"     : "materialButtonOutline",  
						"progressValue"   : app.data.user.learning[expiringLessonId].engagementProgressRealPercent || 0,
						"progressText"    : "Complete",
						"circularImage"   : app.data.lesson[expiringLessonId].image, 
						"deadlineDatetime": app.data.user.learning[expiringLessonId].deadlineDateString,
						"deadlineText": "Hurry Up!",
						"backgroundImage" : "",
						"buttonDisabled"  : false,
						"buttonAction"    : `router.navigate('#!/lesson/${expiringLessonId}');`
			});
		}
		else if(newestLessonId && app.data.lesson[newestLessonId] && (newestLessonId != currentLessonId) && app.data.user.learning[newestLessonId] && (!app.data.user.learning[newestLessonId].engagementProgressRealPercent || app.data.user.learning[newestLessonId].engagementProgressRealPercent < 95)){
			cardsList.push({
						"type"  		  : "circularImage",
						"theme" 		  : "materialThemeGoldDark",
						"colClass"        : "col-sm-6 col-xs-12",
						"header"          : "New Lesson Available",
						"description"	  : "<b>" + app.data.lesson[newestLessonId].title  + " - " + app.data.lesson[newestLessonId].subtitle + "</b>.<br><span style='color: #ffebb4;'>" + (app.data.user.learning[newestLessonId].engagementProgressRealPercent || 0) + "% Completed</span>",
						"buttonText"      : "Complete",
						"buttonClass"     : "materialButtonOutline",  
						"progressValue"   : app.data.user.learning[newestLessonId].engagementProgressRealPercent || 0,
						"progressText"    : "Access",
						"circularImage"   : app.data.lesson[newestLessonId].image, 
						"backgroundImage" : "",
						"buttonDisabled"  : false,
						"buttonAction"    : `router.navigate('#!/lesson/${newestLessonId}');`
			});
		}
		else{
		
			var  lessonsIdsAvailable = [];
			var  lessonsIdsAvailableAndUnfinished = [];
			for (var lessonId in app.data.lesson) {
				//Not expired, coming soon/asap
				if(!["expired", "comingSoon", "comingAsap"].includes(app.data.lesson[lessonId].dateStatus)){
					lessonsIdsAvailable.push(lessonId);		
					if(!["completed"].includes(app.data.lesson[lessonId].dateStatus)){
						lessonsIdsAvailableAndUnfinished.push(lessonId);		
					}
				}
			}
			
			//Remove currentLessonId
			lessonsIdsAvailable				 = lessonsIdsAvailable.filter(function(item) { return item !== currentLessonId })
			lessonsIdsAvailableAndUnfinished = lessonsIdsAvailableAndUnfinished.filter(function(item) { return item !== currentLessonId })
			
			var randomLessonId = false;
			if(lessonsIdsAvailableAndUnfinished.length >0){
				randomLessonId = lessonsIdsAvailableAndUnfinished[Math.floor(Math.random()*lessonsIdsAvailableAndUnfinished.length)];
			}
			else{
				randomLessonId = lessonsIdsAvailable[Math.floor(Math.random()*lessonsIdsAvailable.length)];
			}
	
			if(randomLessonId && app.data.lesson[randomLessonId]){
				cardsList.push({
							"type"  		  : "circularImage",
							"theme" 		  : "materialThemeGoldDark",
							"colClass"        : "col-sm-6 col-xs-12",
							"header"          : "Continue Learning",
							"description"	  : "<b>" + app.data.lesson[randomLessonId].title  + " - " + app.data.lesson[randomLessonId].subtitle + "</b>.<br><span style='color: #ffebb4;'>" + (app.data.user.learning[randomLessonId].engagementProgressRealPercent || 0) + "% Completed</span>",
							"buttonText"      : "Complete",
							"buttonClass"     : "materialButtonOutline",  
							"progressValue"   : app.data.user.learning[randomLessonId].engagementProgressRealPercent || 0,
							"progressText"    : "",
							"circularImage"   : app.data.lesson[randomLessonId].image, 
							"backgroundImage" : "",
							"buttonDisabled"  : false,
							"buttonAction"    : `router.navigate('#!/lesson/${randomLessonId}');`
				});
			}
			else{
				cardsList.push({
							"type"  		  : "circularImage",
							"theme" 		  : "materialThemeGoldDark",
							"colClass"        : "col-sm-6 col-xs-12",
							"header"          : "Unlock New Lessons",
							"description"	  : "<b>Gain reward points and get free early-bird access to exclusive learning materials</b>",
							"buttonText"      : "Dashboard",
							"buttonClass"     : "materialButtonOutline",  
							"progressValue"   : 0,
							"progressText"    : "",
							"circularImage"   : "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.min.png", 
							"backgroundImage" : "",
							"buttonDisabled"  : false,
							"buttonAction"    : `router.navigate('#!/');`
				});
			}
		
		}
	   	
		return cardsList;			
	},
	__createCardHtml : function (settings){
	 	//Create default values for each settings
		settings.type = settings.type || "circularProgress";
		settings.theme = settings.theme || "";
		settings.colClass = settings.colClass || "col-sm-6 col-xs-12";
		settings.header = settings.header || "Header";
		settings.description = settings.description || "Some description";
		settings.buttonText =  settings.buttonText ||  "";
		settings.buttonClass =  settings.buttonClass ||  "materialButtonOutline"; 
		settings.buttonTarget = settings.buttonTarget || "_self"; 
		settings.buttonHref   = settings.buttonHref || false; 
		settings.size   	  = settings.size || ""; 
		
		settings.style   	  		= settings.style || ""; 
		settings.additionalClass   	= settings.additionalClass || ""; 
		
		settings.progressValue = settings.progressValue || "0";
		settings.progressText = settings.progressText || "Completed";
		
		settings.deadlineDatetime 	= settings.deadlineDatetime || "2019-1-1 23:59:59";
		settings.deadlineExtras 	= settings.deadlineExtras || "";
		settings.deadlineText 		= settings.deadlineText || "Expires Soon";
		
		
		settings.circularImage = settings.circularImage || ""; 
		settings.backgroundImage 		 = settings.backgroundImage || "";
		settings.backgroundImagePosition = settings.backgroundImagePosition || "";
		settings.backgroundImageSize 	 = settings.backgroundImageSize || "";
 
		settings.buttonDisabled = settings.buttonDisabled || false;
		settings.buttonAction = settings.buttonAction || "";
		 
		/* Round to the nearest 0, 5 or 10. If < 100 and >95, use 95. If = 0, use 5: for visual purposes*/
		function specialRound(x){
			 if(x>95 && x <100) {
				return 95;
			}
			if(x==0) {
				return 5;
			}
			return Math.ceil(x/5)*5;
		}
		
		var progressValueRounded = specialRound(settings.progressValue);

		var htmlLeftSection = "";
		var materialCardProgressRightClasses = "materialCardProgressRight";
		
		switch(settings.type){
			case "circularProgress":
						htmlLeftSection = `
							<div class="materialCardProgressLeft">
								<div class="materialProgressCircle ${settings.theme}" data-progress="${progressValueRounded}" data-progress-affects-data-percentage>
									<span class="materialProgressCircle-left">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<span class="materialProgressCircle-right">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<div class="materialProgressCircle-value"> 
										<div>
											<span><span data-progress-affects-html>0</span>%</span><br>
											${settings.progressText}
										</div>
									</div>
								</div>
							</div>`;
				break;
			case "circularNumber":
						htmlLeftSection = `
							<div class="materialCardProgressLeft">
								<div class="materialProgressCircle ${settings.theme}" data-progress="${progressValueRounded}" data-progress-affects-data-percentage>
									<span class="materialProgressCircle-left">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<span class="materialProgressCircle-right">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<div class="materialProgressCircle-value"> 
										<div>
											<span><span>${settings.numberValue}</span>/${settings.numberTotal}</span><br>
											${settings.progressText}
										</div>
									</div>
								</div>
							</div>`;
				break;
			case "circularDeadline":
						htmlLeftSection = `
							<div class="materialCardProgressLeft">
								<div class="materialProgressCircle materialDeadlineCircle ${settings.theme}">
									<span class="materialProgressCircle-left">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<span class="materialProgressCircle-right">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<div class="materialProgressCircle-value">
										<div> 
											<span data-countdown="${settings.deadlineDatetime}" ${settings.deadlineExtras}><span data-show-if-long-hours><span data-days>00</span> Days</span><span data-hide-if-long-hours><span data-hours-total>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></span><br>
											${settings.deadlineText}
										</div>
									</div>
								</div>
							</div> `;
				break;	
			case "circularImage":
						htmlLeftSection = `
							<div class="materialCardProgressLeft">  
								<div class="materialImageCircle ${settings.theme}">
									<div class="materialCardImgInside" style="background-image: url(${settings.circularImage});"></div> 
									<div class="materialCardImgOverlay"></div>
								</div> 
							</div>`;
				break;	
			case "circularDeadlineImage":
						htmlLeftSection = `
							<div class="materialCardProgressLeft materialCardProgressLeftDouble">
								
								<div class="materialProgressCircle materialDeadlineCircle ${settings.theme}">
									<span class="materialProgressCircle-left">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<span class="materialProgressCircle-right">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<div class="materialProgressCircle-value">
										<div>
											<span data-countdown="${settings.deadlineDatetime}" ${settings.deadlineExtras}><span data-show-if-long-hours><span data-days>00</span> Days</span><span data-hide-if-long-hours><span data-hours-total>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></span><br>
											${settings.deadlineText}
										</div>
									</div>
								</div>
								<br class="visible-xs visible-sm"><br class="visible-xs visible-sm"> 
								<div class="materialImageCircle ${settings.theme}" style="background-image: url(${settings.circularImage}); ">  
								</div>
								
							</div>`;
							
						materialCardProgressRightClasses += " materialCardProgressRightDouble";		
				break;	
		}
		
		var styleCode = "";
		 
		if(settings.style)					{styleCode += settings.style; }
		if(settings.backgroundImage)		{styleCode += ` background-image: ${settings.backgroundImage};`; }
		if(settings.backgroundImagePosition){styleCode += ` background-position: ${settings.backgroundImagePosition};`; }
		if(settings.backgroundImageSize)	{styleCode += ` background-size: ${settings.backgroundImageSize};`; }
		
		var additionalStyling = styleCode ? `style="${styleCode}"` : ``;
		
		
		
		var buttonDisabled ="";
		if(settings.buttonDisabled){
			buttonDisabled = 'disabled="disabled"';
		}
		 
		var buttonHtml; var dataButtonHtml = "";
		if(settings.buttonText){
			
			if(settings.buttonHref){
				dataButtonHtml  = `data-button  data-href="${settings.buttonHref}" data-href-target="${settings.buttonTarget}"`;
			}
			
			if(settings.buttonAction){
				dataButtonHtml  = `data-button  data-script="${settings.buttonAction}"`;
			}
			
			if(settings.buttonHref){
				buttonHtml =`<a ${buttonDisabled} href="${settings.buttonHref}" target="${settings.buttonTarget}" onclick="${settings.buttonAction}"  class="${settings.buttonClass} ${settings.theme}">${settings.buttonText}</a>`; 
			}
			else{
				buttonHtml =`<button ${buttonDisabled}  onclick="${settings.buttonAction}" class="${settings.buttonClass} ${settings.theme}">${settings.buttonText}</button>`;
			}
		}
		else{
			buttonHtml = "";
		}
		
		// Main logic for creating html
		var html = `
			<div class="${settings.colClass}" ${dataButtonHtml}>
				<div class="materialCard materialCardProgress ${settings.theme} ${settings.size} ${settings.additionalClass}" ${additionalStyling}>
					 <div class="container-fluid">
						<div class="row">
							${htmlLeftSection} 
							<div class="${materialCardProgressRightClasses}">
								<h3 class="materialHeader ${settings.theme}" style="margin-bottom: 20px;">${settings.header}</h3>
								<p class="materialParagraph ${settings.theme}">${settings.description}</p>
								${buttonHtml}
							</div> 
						</div>
					</div>
				</div> 
			</div>`;
		
		return html;
	} 
};
 
 
 
