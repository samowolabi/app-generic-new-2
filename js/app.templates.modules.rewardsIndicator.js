app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.rewardsIndicator = { 
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
		
		let nextRewardsLevelHtml;

		if(maxtRewardsLevelReached){
			nextRewardsLevelHtml = `
		   		<h3 class="materialHeader materialThemeGoldDark">Congratulations!</h3>
		   		<p class="materialParagraph materialThemeDark">Maximum Rewards Level</p>
		   `;
		}else{
		   nextRewardsLevelHtml = `
		   		<h4>${pointsTotalNextRewardsLevel} more Rewards Points needed to reach Reward Level ${nextRewardsLevelDisplay}</h4>
		   		<div class="rewardLevelProgress"><div style="width: ${progressToNextRewardsLevel}%"></div></div>
		   `;
		}
			
		var htmlRewardsSection1 = `
		<div class="app_ratingsSectionCard rewardLevel help-reward-level-progress-indicator">
			${nextRewardsLevelHtml}

			<div class="rewardLevelStats">
				<div>
					<svg width="42" height="42" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="1.05566" y="1" width="38.0805" height="36.3229" rx="18.1615" fill="#614F00" fill-opacity="0.34" />
						<path d="M19.1659 24.4531H17.2086C16.2516 24.4531 15.4687 25.2361 15.4687 26.193V26.4105H14.5987C14.2421 26.4105 13.9463 26.7063 13.9463 27.0629C13.9463 27.4196 14.2421 27.7154 14.5987 27.7154H25.038C25.3947 27.7154 25.6905 27.4196 25.6905 27.0629C25.6905 26.7063 25.3947 26.4105 25.038 26.4105H24.1681V26.193C24.1681 25.2361 23.3852 24.4531 22.4282 24.4531H20.4708V22.4609C20.2534 22.487 20.0359 22.4957 19.8184 22.4957C19.6009 22.4957 19.3834 22.487 19.1659 22.4609V24.4531Z" fill="#F5B400" />
						<path d="M25.4554 18.7036C26.0295 18.4861 26.5341 18.1295 26.9343 17.7293C27.7433 16.8332 28.274 15.7632 28.274 14.5105C28.274 13.2578 27.2909 12.2748 26.0382 12.2748H25.551C24.9856 11.1177 23.8025 10.3174 22.428 10.3174H17.2083C15.8338 10.3174 14.6507 11.1177 14.0852 12.2748H13.5981C12.3453 12.2748 11.3623 13.2578 11.3623 14.5105C11.3623 15.7632 11.893 16.8332 12.702 17.7293C13.1022 18.1295 13.6068 18.4861 14.1809 18.7036C15.0857 20.9307 17.2605 22.4966 19.8181 22.4966C22.3758 22.4966 24.5506 20.9307 25.4554 18.7036ZM22.2888 15.9285L21.7494 16.5897C21.6624 16.6854 21.6015 16.8767 21.6102 17.0072L21.6624 17.8598C21.6972 18.3817 21.3231 18.6514 20.836 18.46L20.0443 18.1469C19.9225 18.1034 19.7137 18.1034 19.5919 18.1469L18.8003 18.46C18.3131 18.6514 17.9391 18.3817 17.9739 17.8598L18.0261 17.0072C18.0348 16.8767 17.9739 16.6854 17.8869 16.5897L17.3475 15.9285C17.0082 15.5283 17.1561 15.0847 17.6607 14.9542L18.4871 14.7454C18.6176 14.7106 18.7742 14.5888 18.8438 14.4757L19.3049 13.7624C19.5919 13.3187 20.0443 13.3187 20.3314 13.7624L20.7925 14.4757C20.8621 14.5888 21.0187 14.7106 21.1491 14.7454L21.9756 14.9542C22.4802 15.0847 22.628 15.5283 22.2888 15.9285Z" fill="#F5B400" />
						<rect x="1.05566" y="1" width="38.0805" height="36.3229" rx="18.1615" stroke="#F5B400" stroke-width="1.05779" />
					</svg>
					<p>Rewards Level ${currentRewardLevelDisplay}</p>
				</div>

				<div>
					<svg width="42" height="42" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g style="mix-blend-mode:luminosity">
							<rect x="1.14844" y="1" width="37.4546" height="35.7259" rx="17.8629" fill="#614F00" fill-opacity="0.34" />
							<path d="M18.961 24.0688H17.0358C16.0946 24.0688 15.3245 24.8389 15.3245 25.7801V25.994H14.4689C14.1181 25.994 13.8271 26.2849 13.8271 26.6357C13.8271 26.9865 14.1181 27.2775 14.4689 27.2775H24.7366C25.0874 27.2775 25.3783 26.9865 25.3783 26.6357C25.3783 26.2849 25.0874 25.994 24.7366 25.994H23.8809V25.7801C23.8809 24.8389 23.1109 24.0688 22.1697 24.0688H20.2445V22.1094C20.0306 22.135 19.8166 22.1436 19.6027 22.1436C19.3888 22.1436 19.1749 22.135 18.961 22.1094V24.0688Z" fill="#F5B400" />
							<path d="M25.1475 18.4144C25.7123 18.2005 26.2085 17.8497 26.6021 17.4561C27.3979 16.5748 27.9198 15.5223 27.9198 14.2902C27.9198 13.0581 26.9529 12.0912 25.7208 12.0912H25.2417C24.6855 10.9532 23.5218 10.166 22.1699 10.166H17.036C15.6841 10.166 14.5205 10.9532 13.9643 12.0912H13.4851C12.253 12.0912 11.2861 13.0581 11.2861 14.2902C11.2861 15.5223 11.8081 16.5748 12.6038 17.4561C12.9974 17.8497 13.4937 18.2005 14.0584 18.4144C14.9483 20.6049 17.0874 22.145 19.603 22.145C22.1186 22.145 24.2577 20.6049 25.1475 18.4144ZM22.033 15.6849L21.5025 16.3352C21.4169 16.4293 21.357 16.6176 21.3656 16.7459L21.4169 17.5844C21.4512 18.0978 21.0832 18.3631 20.6041 18.1748L19.8254 17.8668C19.7057 17.824 19.5003 17.824 19.3805 17.8668L18.6019 18.1748C18.1227 18.3631 17.7548 18.0978 17.789 17.5844L17.8404 16.7459C17.8489 16.6176 17.789 16.4293 17.7034 16.3352L17.173 15.6849C16.8393 15.2913 16.9847 14.8549 17.481 14.7266L18.2938 14.5212C18.4222 14.487 18.5762 14.3672 18.6447 14.256L19.0981 13.5544C19.3805 13.118 19.8254 13.118 20.1078 13.5544L20.5613 14.256C20.6297 14.3672 20.7838 14.487 20.9121 14.5212L21.725 14.7266C22.2212 14.8549 22.3667 15.2913 22.033 15.6849Z" fill="#F5B400" />
							<rect x="1.14844" y="1" width="37.4546" height="35.7259" rx="17.8629" stroke="#F5B400" stroke-width="1.0404" />
						</g>
					</svg>
					<p>Rewards Level ${nextRewardsLevelDisplay}</p>
				</div>
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
	 
		console.warn('htmlRewardsSection1', htmlRewardsSection1)

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
 
 
 
