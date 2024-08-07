app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.newlesson = {
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
	content : function (lessonData){
		
		var thisLesson = app.data.user.learning[lessonData.id];

		//Default values
		thisLesson.engagementProgressArrayDetails 	= thisLesson.engagementProgressArrayDetails || []; 
		thisLesson.engagementProgressMaxPercent 	= thisLesson.engagementProgressMaxPercent   || 0; 
		thisLesson.engagementProgressRealPercent 	= thisLesson.engagementProgressRealPercent  || 0; 
		thisLesson.engagementTime 					= thisLesson.engagementTime   || 0; 
 
		//Set access first date, only the first time. Set access last date every time. Update access count
		thisLesson.accessFirstDate 	= thisLesson.accessFirstDate  || datetimeToEST(new Date());  
		thisLesson.accessLastDate 	= datetimeToEST(new Date()); 
		thisLesson.accessCount 		= thisLesson.accessCount  || 0;  
		thisLesson.accessCount++;
		
		app.data.user.stats.lessons.lastLessonAccessedId = lessonData.id; 
 
		var countdownHtml = function(date){
			return `
			<span data-countdown="${date}"> 
				<span data-days>00</span>
				<span data-days-caption> Days </span>
				<span data-hours>00</span>:<span data-minutes>00</span>:<span data-seconds>00</span>
			</span>`;
			};


		//TODO: add more customization and a dialog sequence that will open on click
		var unlockButtonHtml = function(dateStatus, context){
			
			var text = ``;		
			var themeIsDark = false;
			var classAdditionals = "";
			var style = "";
			var extraHtmlBefore = "";
			
			switch(dateStatus){
				case "expiringAsap": 
					text = ``;
					break;
				case "expiringSoon":  
					text = ``;
					break;
				case "comingAsap":
					text = `Unlock Now`;
					themeIsDark = true;
					break;
				case "comingSoon":
					text = `Unlock Now`; 
					themeIsDark = true;
					break;
				case "expired":
					text = `Unlock Lesson`;		
					break;	
				case "available": 
				default: 
					text = "";
			}
			
			
			switch(context){
				case "top":
					classAdditionals = "resumeLessonBtn";
					style = "";
					extraHtmlBefore = "";
					themeIsDark = true; //Always dark theme on top
					break;
				case "bottom":
				default: 
					classAdditionals = "";
					style = "font-size: 0.8em; margin-top: 50px;letter-spacing: 3.36px;"; 
					extraHtmlBefore = "<br>";
					break;
			}
			
			if(themeIsDark){
				classAdditionals += " materialThemeDark";
			}
		
			if(text){
				return `${extraHtmlBefore}<a href="#" onclick="dialogUnlockLesson(); return false;" class="materialButtonFill ${classAdditionals}" style="${style}" target="_blank"><i class="fa fa-unlock"></i> ${text}</a>`;				
			}
			else{
				return ``;
			}
			
		};

		var unlockButtonContext = "bottom";
		switch(lessonData.dateStatus){
			case "expiringAsap":
				var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>Free Access Expiring in ${countdownHtml(thisLesson.deadlineDateString)} ${unlockButtonHtml(lessonData.dateStatus, unlockButtonContext)}</p>`;
				break;
			case "expiringSoon": 
				var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>Free Access Expiring Soon... ${unlockButtonHtml(lessonData.dateStatus, unlockButtonContext)}</p>`;  
				break;
			case "comingAsap":
				var scarcityHtml = `<p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i>Free Access Coming in ${countdownHtml(thisLesson.availableDateString)} ${unlockButtonHtml(lessonData.dateStatus, unlockButtonContext)}</p>`;
				break;
			case "comingSoon":
				var scarcityHtml = `<p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i>Free Access Coming Soon! Stay tuned... ${unlockButtonHtml(lessonData.dateStatus, unlockButtonContext)}</p>`;
				break;
			case "expired":
				var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>We're sorry, you missed it! This lesson is no longer available for free. ${unlockButtonHtml(lessonData.dateStatus, unlockButtonContext)}</p>`;  							
				break;	
			case "available": 
			default: 
				var scarcityHtml = `${unlockButtonHtml(lessonData.dateStatus)}`;				
		}
	 
		
		segmentedProgressBarHtml = function(lessonId){
			segmentedProgressBarInsideHtml = "";
			for(var i=1; i<=100; i++){
				segmentedProgressBarInsideHtml += `<div id="segmentedProgressBar${lessonData.id}-${i}" style="width: 1%; height: 8px; float: left;"></div>`;
			}

			return `<div id="segmentedProgressBar${lessonId}" class="materialProgressBar materialThemeDarkGold"> 
						${segmentedProgressBarInsideHtml}
					</div>`;
		};

		switch(lessonData.type){
			case "interactive-sheet-music":
				//TODO: must complete this one
				/*var contentTopHtml = `<div class="row"> 
								<div class="col-xs-12">
									<div class="materialLessonVideo materialPlaceHolder">
		<iframe src="https://learn.pianoencyclopedia.com/hydra/HydraViewers/interactive-sheet-music/${lessonData['content']}&name=${app.data.user.profile.name}&email=${app.data.user.profile.email}&d=yes&p=yesprogressDetails=${thisLesson.engagementProgressArrayDetails.toString()}&engagementTime=${thisLesson.engagementTime}" frameborder="0" allowfullscreen></iframe>
									</div> 
								</div>
							  </div>
							  <script>  
									var thisLesson = function() { return app.data.user.learning[${lessonData.id}]; }
									var thisLessonId = ${lessonData.id};
									var ebookStats = {}; 
									function ebookStatsCallback(bookProgressArray, pageCount, engagementTime){
										 
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
														
										app.data.user.stats.lessons.lastLessonEngagementId	 = "${lessonData.id}";
										
										$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
										if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
		
										app.saveToServer(${lessonData.id}); 
									}
							</script>
							  `;
				var contentBottomHtml = '';
				var attachment 	=`<div class="col-xs-12  col-md-6 materialLessonFile">
								<a href="${lessonData['attachmentUrl']}" target="_blank" id="downloadEbook">
									<span class="materialLessonFileIcon">
										<i class="fa fa-file-pdf-o" aria-hidden="true"></i>
									</span>
									<span class="materialLessonFileText">
										<span>Download</span><br>
										<span>PDF Version</span>				    
									</span> 
								</a>
							</div> 
							<script>
								$("#downloadEbook").click(function() {
									thisLesson().engagementProgressMaxPercent = 100;  
									
									if(!thisLesson().reached100Once){
											app.callback("path=" + app.currentRoute + "&progress=100");
											app.addRewardPoints("Downloaded Book", 50); thisLesson().reached100Once = true;
									}
									
									$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
									if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
									
									app.saveToServer(${lessonData.id}); 
								});
							</script>`; 
				break;*/
			case "interactive-pdf":
				//Let's start with this one.
				var contentTopHtml = `<div class="row"> 
								<div class="col-xs-12">
									<div class="materialLessonVideo materialPlaceHolder">
									<iframe src="https://learn.pianoencyclopedia.com/hydra/HydraViewers/interactive-pdf/${lessonData['content']}&name=${app.data.user.profile.name}&email=${app.data.user.profile.email}&d=yes&p=yesprogressDetails=${thisLesson.engagementProgressArrayDetails.toString()}&engagementTime=${thisLesson.engagementTime}" frameborder="0" allowfullscreen></iframe>
									</div> 
								</div>
							  </div>
							  <script>  
									var thisLesson = function() { return app.data.user.learning[${lessonData.id}]; }
									var thisLessonId = ${lessonData.id};
									var ebookStats = {}; 
									function ebookStatsCallback(bookProgressArray, pageCount, engagementTime){
										 
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
														
										app.data.user.stats.lessons.lastLessonEngagementId	 = "${lessonData.id}";
										
										$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
										if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
		
										app.saveToServer(${lessonData.id}); 
									}
							</script>
							  `;
				var contentBottomHtml = '';
				var attachment 	=`<div class="col-xs-12  col-md-6 materialLessonFile">
								<a href="${lessonData['attachmentUrl']}" target="_blank" id="downloadEbook">
									<span class="materialLessonFileIcon">
										<i class="fa fa-file-pdf-o" aria-hidden="true"></i>
									</span>
									<span class="materialLessonFileText">
										<span>Download</span><br>
										<span>PDF Version</span>				    
									</span> 
								</a>
							</div> 
							<script>
								$("#downloadEbook").click(function() {
									thisLesson().engagementProgressMaxPercent = 100;  
									
									if(!thisLesson().reached100Once){
											app.callback("path=" + app.currentRoute + "&progress=100");
											app.addRewardPoints("Downloaded Book", 50); thisLesson().reached100Once = true;
									}
									
									$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
									if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
									
									app.saveToServer(${lessonData.id}); 
								});
							</script>`; 
				break;
			case "interactive-video":
			var nextLessonId = app.getNextLessonFromCourse(lessonData.id);
				if(nextLessonId){
					var description = "You are almost done...";
					var buttonText = "Next Lesson";
					var buttonHref = `#!/lesson/${nextLessonId}`;
				}
				else{
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
										
				var contentTopHtml = `<div class="row"> 
								<div class="col-xs-12">
									<div class="materialLessonVideo">
										${overlayVideoAction}
										<iframe id="vimeo" style="display: none;" onload="$(this).fadeIn();" src="https://pianoencyclopedia.com/en/viewers/interactive-video/?vimeoUrl=${lessonData['content']}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
										
									<script>  
										var thisLesson = function() { return app.data.user.learning[${lessonData.id}]; }
										var thisLessonId = ${lessonData.id};
										var videoStats = {};
										
										videoStats.duration = null;
										videoStats.progressLastUpdate = null;
										videoStats.progressLastSent = null;
											
										
										videoStats.initSegmentedProgressBar = function(){
											var progressArrayUniques = removeDuplicateAndKeepOrder(thisLesson().engagementProgressArrayDetails);
											for(var i=0; i< progressArrayUniques.length; i++){
												$("#segmentedProgressBar${lessonData.id}-"+ progressArrayUniques[i]).addClass("materialProgressBarInside");
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
											if(thisLessonId != ${lessonData.id}) { console.log("Timer not deleted on time"); return;}

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
												$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
												if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
												
												app.saveToServer(${lessonData.id}); 
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
											$("#segmentedProgressBar${lessonData.id}-"+currentPercent).addClass("materialProgressBarInside");
												
											videoStats.progressLastUpdate = timestamp;
											
											thisLesson().engagementFirstDate = thisLesson().engagementFirstDate || datetimeToEST(new Date());
											thisLesson().engagementLastDate  = datetimeToEST(new Date());
											
											app.data.user.stats.lessons.lastLessonEngagementId	 = "${lessonData.id}";
												
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
									${segmentedProgressBarHtml(lessonData.id)}
								</div>
							  </div>`;
				var contentBottomHtml = '';
				
				break;
				
			case "video":	
				
				var nextLessonId = app.getNextLessonFromCourse(lessonData.id);
				if(nextLessonId){
					var description = "You are almost done...";
					var buttonText = "Next Lesson";
					var buttonHref = `#!/lesson/${nextLessonId}`;
				}
				else{
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
													<button class="materialButtonText materialThemeGoldDark" onclick="$('.materialLessonVideoActionOverlay').fadeOut(); var iframe = document.querySelector('#vimeo');	var player = new Vimeo.Player(iframe); player.play();" style=" margin: 0; margin-top: 10px;"><i class="fa fa-repeat" style="vertical-align: baseline; margin-right: 7px;"></i>Watch Again</button>
												</div>
											</div>
										</div>`;
										
				var contentTopHtml = `<div class="row"> 
								<div class="col-xs-12">
									<div class="materialLessonVideo">
										${overlayVideoAction}
										<iframe id="vimeo" style="display: none;" onload="$(this).fadeIn();" src="${lessonData['content']}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
										 
										<script>  
										var thisLesson = function() { return app.data.user.learning[${lessonData.id}]; }
										var thisLessonId = ${lessonData.id};
										var videoStats = {};
										
										videoStats.initSegmentedProgressBar = function(){
											var progressArrayUniques = removeDuplicateAndKeepOrder(thisLesson().engagementProgressArrayDetails);
											for(var i=0; i< progressArrayUniques.length; i++){
												$("#segmentedProgressBar${lessonData.id}-"+ progressArrayUniques[i]).addClass("materialProgressBarInside");
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
												if(thisLessonId != ${lessonData.id}) { console.log("Timer not deleted on time"); return;}

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
													$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
													if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
													
													app.saveToServer(${lessonData.id}); 
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
												$("#segmentedProgressBar${lessonData.id}-"+currentPercent).addClass("materialProgressBarInside");
													
												videoStats.progressLastUpdate = timestamp;
												
												thisLesson().engagementFirstDate = thisLesson().engagementFirstDate || datetimeToEST(new Date());
												thisLesson().engagementLastDate  = datetimeToEST(new Date());
												
												app.data.user.stats.lessons.lastLessonEngagementId	 = "${lessonData.id}";

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
									${segmentedProgressBarHtml(lessonData.id)}
								</div>
							  </div>`;
				var contentBottomHtml = '';
				
				break;
			case "article":
				var contentTopHtml = `<div class="row">
										<div class="col-xs-12">	
											${segmentedProgressBarHtml(lessonData.id)}
										</div>
									  </div>`;
				var contentBottomHtml = `<div class="col-xs-12"><article id="article">${lessonData['content']}</article></div>
										<script>  
												var thisLesson = function() { return app.data.user.learning[${lessonData.id}]; }
												var thisLessonId = ${lessonData.id};
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
													var widthPorcentage = Math.floor((100 / elementsTotalCount) * 100)/ 100;
													
													var segmentedProgressBarInsideHtml= "";
													for(var i=0; i< elementsTotalCount; i++){
															
														var className = progressArrayUniques.includes(i)? "materialProgressBarInside": "";
														segmentedProgressBarInsideHtml += '<div id="segmentedProgressBar${lessonData.id}-'+ i + '" style="width: '+ widthPorcentage +'%; height: 8px; float: left;" class="' + className +'"></div>';
														$("#segmentedProgressBar${lessonData.id}").html();
													}
													$("#segmentedProgressBar${lessonData.id}").html(segmentedProgressBarInsideHtml);
												};
												
												articleStats.updateSegmentedProgressBar();
												
												trackReadProgress(articleStats.selector, 7000, function(elementsReadArray, elementsReadCount, elementsTotalCount, progressMax, progressReal){
												
													//Security check in case scroll event is not deleted on time.
													if(thisLessonId != ${lessonData.id}) {console.log("Scroll event not deleted on time"); return;}
													
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
													
													app.data.user.stats.lessons.lastLessonEngagementId	 = "${lessonData.id}";
													  
													var timestamp = (new Date()).getTime();
													timestamp = Math.floor(timestamp / 1000);
													articleStats.progressLastUpdate = timestamp; 
													
													$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
													if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
												});
												
												//Update progress to server every 20 seconds, and add 20 seconds to engagement time
												app.runTimer(function(){  
													thisLesson().engagementTime += 20; 
													app.saveToServer(${lessonData.id});  
												}, 20000);
												
										</script>`;
				break;
			case "ebook":
				var contentTopHtml = `<div class="row"> 
								<div class="col-xs-12"> 
									<div class="materialLessonVideo materialPlaceHolder">
										<div style="background: transparent;  z-index: 2;">
											<a href="#!/lesson/${lessonData.id}/book" target="_blank" style="width: 100%;height: 100%;background: transparent;display: block;"></a>
										</div>
										<iframe src="${lessonData['content']}&progressDetails=${thisLesson.engagementProgressArrayDetails.toString()}&engagementTime=${thisLesson.engagementTime}" frameborder="0" allowfullscreen></iframe>
									</div> 
								</div>
							  </div>
							  <script>  
									var thisLesson = function() { return app.data.user.learning[${lessonData.id}]; }
									var thisLessonId = ${lessonData.id};
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
														
										app.data.user.stats.lessons.lastLessonEngagementId	 = "${lessonData.id}";
										
										$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
										if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
										
										app.saveToServer(${lessonData.id}); 
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
														
										app.data.user.stats.lessons.lastLessonEngagementId	 = "${lessonData.id}";
										
										$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
										if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
										app.saveToServer(${lessonData.id});  
									};
							</script>
							  `;
				var contentBottomHtml = '';
				var attachment 	=`<div class="col-xs-12  col-md-6 materialLessonFile">
								<!--
								<a href="${lessonData['attachmentUrl']}" target="_blank" id="downloadEbook">
									<span class="materialLessonFileIcon">
										<i class="fa fa-file-pdf-o" aria-hidden="true"></i>
									</span>
									<span class="materialLessonFileText">
										<span>Download</span><br>
										<span>PDF Version</span>				    
									</span> 
								</a>
								-->
								<a href="#!/lesson/${lessonData.id}/book" target="_blank" style="font-size: 18px;"class="materialButtonFill" id="downloadEbook">
									<i class="fa fa-book" aria-hidden="true"></i>
									Open Book
								</a>
							</div> 
							<script>
								$("#downloadEbook").click(function() {
									thisLesson().engagementProgressMaxPercent = 100;  
									
									if(!thisLesson().reached100Once){
											app.callback("path=" + app.currentRoute + "&progress=100");
											app.addRewardPoints("Downloaded Book", 50); thisLesson().reached100Once = true;
									}
									
									$("#lessonProgress${lessonData.id}").html(thisLesson().engagementProgressMaxPercent);
									if(thisLesson().engagementProgressMaxPercent == 100){ $("#lessonProgressText${lessonData.id}").html("Completed"); }
									
									app.saveToServer(${lessonData.id}); 
								});
							</script>`;
				break;
		}				

		//Ebook is a special case coded above
		if(lessonData.type != "ebook"){
			if(lessonData['attachmentUrl']){
				var attachment 	=`<div class="col-xs-12  col-md-6 materialLessonFile">
									<a href="${lessonData['attachmentUrl']}" target="_blank" >
										<span class="materialLessonFileIcon">
											<i class="fa fa-file-${lessonData['attachmentType']}-o" aria-hidden="true"></i>
										</span>
										<span class="materialLessonFileText">
											<span>${lessonData["attachmentTitle"]}</span><br>
											<span>Download ${lessonData['attachmentType']}</span>				    
										</span> 
									</a>
								</div>
								`;
			}else{
				var attachment 	=`<div class="col-xs-12  col-md-6 materialLessonFile"></div>`;
			}
		}
 
		
		
		
		 
		 /* Mark lesson as complete if rated and real progress is more than 75*/ 
		var rating = `<div class="col-xs-12 col-md-6"> 
							<div class="materialLessonRating ">
								<div class="materialLessonRatingCaption">Rate this Lesson:</div>
								 ${materialRating.create({icon: "fa fa-heart", name:"ratingOnLesson", rating: thisLesson.rating, onChangeCallback: "if(!thisLesson().rating) {app.addRewardPoints('Rated Lesson', 40); }; if(thisLesson().engagementProgressRealPercent > 75){ thisLesson().engagementProgressMaxPercent = 100; }; thisLesson().rating = value; app.callback('path=' + app.currentRoute + '&rating='+value); thisLesson().ratingDate = datetimeToEST(new Date()); material.history.clear();	material.history.save('dialogLessonRating', materialDialog.defaultSettings({modal: false, hideCallback: function(){ app.saveToServer("+ lessonData.id +"); }})); dialogLessonRating.flow();"})}
							</div>
						</div>`;


		var defaultScript = `
			<script>
				var thisLesson = function() { return app.data.user.learning[${lessonData.id}]; }
				var thisLessonId = ${lessonData.id};

				thisLesson().engagementProgressArrayDetails 	= thisLesson().engagementProgressArrayDetails || []; 
				thisLesson().engagementProgressMaxPercent 		= thisLesson().engagementProgressMaxPercent   || 0; 
				thisLesson().engagementProgressRealPercent 		= thisLesson().engagementProgressRealPercent  || 0; 
				thisLesson().engagementTime 					= thisLesson().engagementTime   			  || 0; 
			</script>`;
		
		var unlockButtonContext = "top";
		switch(lessonData.dateStatus){
		 	case "comingAsap":
		 	case "comingSoon":
					var comingSoonTracking = '<script>app.callback("path=" + app.currentRoute + "&comingsoon=y");</script>';
					contentTopHtml = `<div class="heroDiv" style="background-image: url(${lessonData.image}); background-size: cover; background-position: top center;">
								<div class="heroDivImageOverlay"></div>
								<div class="heroDivContent">
									<h2 class="marginTop7"><i class="fa fa-clock-o" style="vertical-align: baseline;font-size: 300%;color: hsla(0,0%,100%,1); font-size: 3.5em; text-align: center; z-index: 2; text-shadow: 0 0 19px rgb(0 0 0 / 57%), 0 0 19px rgb(0 0 0 / 48%), 0 0 19px rgb(0 0 0 / 66%); vertical-align: middle;"></i></h2>
									
									<span class="heroDivProgress marginTop8 marginBottom5">${thisLesson.engagementProgressMaxPercent}% Completed</span>
									
									${unlockButtonHtml(lessonData.dateStatus, unlockButtonContext)}
									
									<div class="heroDivProgress marginTop5">Free access is coming soon.</div>
								</div>
							</div>${defaultScript}${comingSoonTracking}`;		
					
					/* 
					//OLD VERSION
					contentTopHtml =  `<div class="row"> 
								<div class="col-xs-12">
									<div class="materialLessonVideo" style="background: url(${lessonData.image}) center; background-size: cover;">
										<div style="background: hsla(0, 0%, 0%, 0.48); position: absolute; top: 0; left:0; width: 100%; height: 100%; z-index: 1; display: table;">
											<p class="materialLessonVideoIcon"><i class="fa fa-clock-o" <i class="fa fa-lock" style="vertical-align: baseline;"></i></p>
										</div> 
									</div> 
								</div>
							  </div>${defaultScript}${comingSoonTracking}`;	
							  
					*/
					contentBottomHtml = "";		  
					attachment = "";
					rating = "";
				break;
			case "expired":
					var expireTracking = '<script>app.callback("path=" + app.currentRoute + "&expired=y");</script>';
					contentTopHtml = `<div class="heroDiv" style="background-image: url(${lessonData.image}); background-size: cover; background-position: top center;">
								<div class="heroDivImageOverlay"></div>
								<div class="heroDivContent">
									<h2 class="marginTop7"><i class="fa fa-lock" style="vertical-align: baseline;font-size: 300%;color: hsla(0,0%,100%,1); font-size: 3.5em; text-align: center; z-index: 2; text-shadow: 0 0 19px rgb(0 0 0 / 57%), 0 0 19px rgb(0 0 0 / 48%), 0 0 19px rgb(0 0 0 / 66%); vertical-align: middle;"></i></h2>
									
									<span class="heroDivProgress marginTop8 marginBottom5">${thisLesson.engagementProgressMaxPercent}% Completed</span>
									
									${unlockButtonHtml(lessonData.dateStatus, unlockButtonContext)}
									
									<div class="heroDivProgress marginTop5">Free access has expired.</div>
								</div>
							</div>${defaultScript}${expireTracking}`;		
					/* 
					//OLD VERSION
					contentTopHtml = `<div class="row"> 
								<div class="col-xs-12">
									<div class="materialLessonVideo" style="background: url(${lessonData.image}) center; background-size: cover;">
										<div style="background: hsla(0, 0%, 0%, 0.5); position: absolute; top: 0; left:0; width: 100%; height: 100%; z-index: 1; display: table;">
											<p class="materialLessonVideoIcon"><i class="fa fa-lock" style="vertical-align: baseline;"></i></p>
										</div>										
									</div> 
								</div>
							  </div>${defaultScript}${expireTracking}`;		
					
					*/
					contentBottomHtml = "";		  
					attachment = "";
					rating = "";	
				break;	 	
		}
		
	  
		
		/*
		switch(data.lesson[lessonData.id].progressStatus){
			case "new":
				var progressText ="Unfinished";
				break;
			case "inProgress":
				var progressText ="Unfinished";
				break;
			case "completed":
				var progressText ="Completed";
				break; 
		}
		*/
		var progressText = (thisLesson.engagementProgressMaxPercent==100) ? "Completed": "Unfinished";
		var descriptionOrSubtitleHtml = lessonData["description"] ? `<p>${lessonData["description"]}</p>` : `<h2>${lessonData["subtitle"]}</h2>`;
 		
		var html = ` 
					${contentTopHtml} 
					<div class="oneTimeSpecialOfferPlaceHolder"></div>
					<div class="row materialLesson ${lessonData.type}" > 
						<div class="col-xs-12">
								 <div class="container-fluid">
									<div class="col-xs-12" class="materialLessonDescription">
										<h3 style="margin-top: 0">${lessonData["breadcrumb"].join(" &raquo; ")}</h3>
										<h1>${lessonData["title"]}</h1>
										${descriptionOrSubtitleHtml}
										${scarcityHtml}
									</div> 
									${contentBottomHtml} 
									${attachment}
									${rating}
							</div>	 
						</div>
						<div class="col-xs-12">
							<h3 class="materiaLessonBottomProgress">Lesson <span id='lessonProgressText${lessonData.id}'>${progressText}</span> <span style='display: inline-block;'>(<span id='lessonProgress${lessonData.id}'>${thisLesson.engagementProgressMaxPercent}</span>% Completed)</span></h3>
						</div>
					</div>`;
				 
		return html;
	}
};
 


 
