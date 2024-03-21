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
	content : function(options){
		if(typeof options === "undefined"){options = {};}
		options.linkToRewardsPage = options.linkToRewardsPage  || false;		 
		 
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
		
		var linkToRewardsPageHtml = "";
		if(options.linkToRewardsPage){
			linkToRewardsPageHtml = `
			<div class="rewardPoints">
				<div class="row">
					<div class="col-sm-12"> <a href="javascript:  void(0)" onclick="materialDialog.alert('Reward Points', 'You can gain Reward Points by completing lessons, rating them, and using The Piano Encyclopedia. With more Reward Points you can gain free access to additional premium content.', {buttonCaption: 'See Rewards', href:'#!/rewards/'})">Learn how you can use your Reward Points &raquo;</a></div>
				</div>
			</div>`;
		}else{
			linkToRewardsPageHtml = `
			<div class="rewardPoints">
				<div class="row">
					<div class="col-sm-12"><span>You have a total of ${currentRewardPoints} Reward Points</span></div>
				</div>
			</div>`; 
		}
	
		var htmlRewardsSection1 = `
		<div class="rewardWrap">
			<div class="row">
				<div class="col-xs-12 col-sm-6 br-right">
					<div class="rewardContent">
						<div class="row">
							<div class="col-sm-12 col-md-offset-2"> <img class="cup" src="https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/cup.svg">
								<h3 class="materialHeader materialThemeGoldDark">Rewards Level ${currentRewardLevelDisplay}</h3>
								<p class="materialParagraph">Your Current Level</p>
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
			<div class="materialProgressBar materialThemeLightGold">
				<div class="materialProgressBarInside" style="width: ${progressToNextRewardsLevel}%;"> </div>
			</div>
			${linkToRewardsPageHtml}
			
		</div>`;
    
		var itemsHtml = "";
		var className;
		var progress;
		var icon;
		var locked;
		for (var i = 0; i < rewardAwards.levels.length; i++) {
			
			
			if(currentRewardLevel >= i){
				locked = false;
				icon = "fa-unlock";
				className =  "rewardUnlock";
				progress = 100;
			}
			else{
				locked = true;
				icon = "fa-lock";
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
					var title =   `<a target="_blank" href="#!/lesson/${lessonId}">${app.data.lesson[lessonId].title}</a>`;
				}
				else{
					if(locked){
						var title =   `<a href="#" onclick='materialDialog.alert("Unlock New Piano Lessons", "Unlock free access to  premium learning material. The name of this piano lesson will be revealed once you unlock <b>Rewards Level ${i+1}</b>.", {buttonCaption: "Continue Learning"}); return false;'>New piano lesson</a>`;
					}
					else{
						var title =   `<a href="#" onclick='materialDialog.alert("Unlock New Piano Lessons", "Unlock free access to  premium learning material. The name of this piano lesson will be revealed soon</b>.", {buttonCaption: "Continue Learning"}); return false;'>New piano lesson</a>`;
					}
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
										<p class="materialParagraph"><i class="fa ${icon}"></i> ${rewardAwards.levels[i].rewardPoints} points</p>
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
		</div>
		
		<script>
			$('.rewardSlider').owlCarousel({
				loop: false,
				autoplay: true,
				nav: false,
				dots: true,
				slideBy: 1,
				autoplayTimeout: 25000, // time for slides changes
				smartSpeed: 250, // duration of change of 1 slide
				margin: 10,
				autoplayHoverPause: true,
				responsiveClass: true,
				responsive: {
					0: {
						items: 1,
						margin: 10
					},
					575: {
						items: 2,
						margin: 10
					},
					767: {
						items: 3,
						margin: 10
					},
					992: {
						items: 3,
						margin: 10
					}
				}
			});
		</script>
		
		
		`;
	 
		var result =  {
			"section1": htmlRewardsSection1,
			"section2": htmlRewardsSection2
		};
		return result;
				
	}
};
 
 
 
