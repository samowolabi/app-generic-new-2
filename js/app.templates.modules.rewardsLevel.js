app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.rewardsLevel = { 
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
	content : function(sectionName){
		//if(typeof showDefaultCards === "undefined"){showDefaultCards = true;}
		//if(typeof megaSizePermitted === "undefined"){megaSizePermitted = true;}
		  
	 
		var rewardAwards = app.data.rewards;
		
		/*{
			"levels": [
				{
					"rewardPoints": 0,
					"name": "Stone",
					"icon": "stone.png",
					"benefits": {
						"lessons": [5005,5006,5007],
						"offer": {
							"url": "exclusive/holidays",
							"deadline": "+ 3 days",
							"dialog": {
								"title": "Some title",
								"subtitle": "Some subtitle",
								"background": "url",
								"icon": "url",
							}
						}
					}
				},
				{
					"rewardPoints": 2000,
					"name": "Bronze",
					"icon": "bronze.png",
					"benefits": {
						"lessons": [5005,5006,5007]
					}
				},
				{
					"rewardPoints": 4000,
					"name": "Silver",
					"icon": "silver.png",
					"benefits": {
						"lessons": [5005,5006,5007]
					}
				},
				{
					"rewardPoints": 6000,
					"name": "Gold",
					"icon": "gold.png",
					"benefits": {
						"lessons": [5005,5006,5007]
					}
				},
				{
					"rewardPoints": 8000,
					"name": "Platinum",
					"icon": "platinum.png",
					"benefits": {
						"lessons": [5005,5006,5007]
					}
				}
			]
		
		};*/
		
		
		var currentRewardPoints = app.data.user.profile.rewardPoints; 
		
		//Get reward level at base index-0
		var currentRewardLevel = app.getCurrentRewardLevel(); 

		/* Calculate how many points are neded to  reach the next level */
		var pointsTotalNextRewardsLevel = 0;
		var pointsNextRewardLevel = 0;
		var nextRewardsLevel = currentRewardLevel;
		var maxtRewardsLevelReached = false;
		
		if ((currentRewardLevel+1) < rewardAwards.levels.length) {
			pointsTotalNextRewardsLevel = rewardAwards.levels[currentRewardLevel + 1].rewardPoints - currentRewardPoints;
			pointsNextRewardLevel = rewardAwards.levels[currentRewardLevel + 1].rewardPoints;
			nextRewardsLevel = currentRewardLevel + 1; 
		}else{
		    maxtRewardsLevelReached = true;
		}
		
		var progressToNextRewardsLevel =  pointsNextRewardLevel?  Math.round(100* currentRewardPoints / pointsNextRewardLevel): 100;
	
		//Base Index-1 for display
		var currentRewardLevelDisplay = currentRewardLevel +1;
		var nextRewardsLevelDisplay =  nextRewardsLevel +1;
		
		if(maxtRewardsLevelReached){
		     nextRewardsLevelHtml = `
		   <h3 class="materialHeader materialThemeGoldDark">Congratulations!</h3>
		   <p class="materialParagraph">Maximum Rewards Level</p>`;
		}else{
		   nextRewardsLevelHtml = `
		   <h3 class="materialHeader materialThemeGoldDark">${pointsTotalNextRewardsLevel} points<span> needed</span></h3>
		   <p class="materialParagraph">Reach Rewards Level ${nextRewardsLevelDisplay}</p>`;
		}
			
		var htmlRewardsSection1 = `
		<div class="rewardWrap">
			<div class="row">
				<div class="col-xs-12 col-sm-6 br-right">
					<div class="rewardContent">
						<div class="row">
							<div class="col-sm-12 col-md-offset-2"> <img class="cup" src="https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/cup.svg">
								<h3 class="materialHeader materialThemeGoldDark">Rewards Level ${currentRewardLevelDisplay}</h3>
								<p class="materialParagraph">Current Level</p>
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-sm-6">
					<div class="rewardContent">
						<div class="row">
							<div class="col-sm-12 col-md-offset-2"> <img src="https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/badge.svg">
								${nextRewardsLevelHtml}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="rewardPoints">
				<div class="row">
					<div class="col-sm-12"> <a href="https://pianoencyclopedia.com/en/members-area/#!/profile/"><span>Learn how you can use your Reward Points &raquo; </span></a></div>
				</div>
			</div>
			<div class="materialProgressBar materialThemeLightGold">
				<div class="materialProgressBarInside" style="width: ${progressToNextRewardsLevel}%;"> </div>
			</div>
		</div>`;
    
		var itemsHtml = "";
		var className;
		var progress;
		for (var i = 0; i < rewardAwards.levels.length; i++) {
			
			if(currentRewardLevel >= i){
				className =  "rewardUnlock";
				progress = 100;
			}
			else{
				className =  "rewardLock";
				if(currentRewardLevel+1 >= i){
					progress = progressToNextRewardsLevel;
				}else{
					progress = 0;
				}
			}
			 
			var listHtml = "";
				for (var j = 0; j < rewardAwards.levels[i].benefits.lessons.length ; j++) {
				var lessonId = rewardAwards.levels[i].benefits.lessons[j];
				
				if(app.data.lesson[lessonId]){
					var title =   `<a href="#!/lesson/${lessonId}">${app.data.lesson[lessonId].title}</a>`;
				}
				else{
					var title =   `<a href='javascript: materialDialog.alert("Unlock New Piano Lessons", "Unlock free access to  premium learning material. The name of this piano lesson will be revealed once you unlock <b>Rewards Level ${i+1}</b>.", {buttonCaption: "Continue Learning"})'>New piano lesson</a>`;
				}
				
				listHtml += `<li class="materialParagraph">${title}</li>`;
			}
 
			itemsHtml += `
					<div class="item">
						<div class="${className}">
							<div class="cardHead">
								<div class="row">
									<div class="col-xs-6">
										<p class="materialParagraph">Level ${i+1}</p>
									</div>
									<div class="col-xs-6">
										<p class="materialParagraph"><i class="fa fa-unlock"></i> ${rewardAwards.levels[i].rewardPoints} points</p>
									</div>
								</div>
							</div>
							<div class="materialProgressBar materialThemeLightGold">
								<div class="materialProgressBarInside" style="width: ${progress}%; "> </div>
							</div>
							<div class="cardContent">
								<ul>
									${listHtml}
								</ul>
							</div>
						</div>
					</div>`;
		}

		var htmlRewardsSection2 = `
		<div class="rewardSlider owl-carousel owl-theme">
			${itemsHtml}			 
		</div>`;
	 
		var result =  {
			"section1": htmlRewardsSection1,
			"section2": htmlRewardsSection2
		};
		
		if(result[sectionName]){
			return result[sectionName];  
		}
		else{
			return "Wrong section name";
		}
				
	}
};
 
 
 
