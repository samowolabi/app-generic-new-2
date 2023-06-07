app.templates = app.templates || {}; 
app.templates.pages = app.templates.pages || {}; 
app.templates.pages.profile = {
	loading : function(target){
			var html =`
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.modules.lesson.loading()}</div>
						<div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
						<div id="page-lesson-cards" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.loading()}</div>
					</div>`;
			
			return html;
	},
	__createPersonalCards: function(){
		var levelHtml = "<li class='materialParagraph materialThemeGoldLight' style='text-transform: capitalize;'>" + (app.data.user.profile.pianoLevel || "Not set")  +"</li>";
		 
		var genresHtml ="";
		for(var i=0; i< app.data.user.profile.genres.length; i++){
			
			genresHtml += "<li class='materialParagraph materialThemeGoldLight' style='text-transform: capitalize;'>" +app.data.user.profile.genres[i] +"</li>";
		} 
		if(!genresHtml) {genresHtml = "<li class='materialParagraph materialThemeGoldLight' style='text-transform: capitalize;'>No genres set</li>";}
		
		var interestsHtml ="";
		for(var i=0; i< app.data.user.profile.interests.length; i++){
			
			switch(app.data.user.profile.interests[i]){
				case "playByEar":
					var interestText = "Playing by Ear";
					break;
				case "learnSongs":
					var interestText = "Playing Your Favorite Music";
					break;
				case "improvisation":
					var interestText = "Improvisation";
					break;
				case "compose":
					var interestText = "Composition";
					break;
				case "readSheetMusic":
					var interestText = "Reading music at first sight";
					break;
				default: 
					var interestText = "Other interests";
					break;  
			}
			
			interestsHtml += "<li class='materialParagraph materialThemeGoldLight'>" + interestText+"</li>";
		} 
		if(!interestsHtml) {interestsHtml = "<li class='materialParagraph materialThemeGoldLight' style='text-transform: capitalize;'>No interests set</i>";}
	
	
		//Create rewards Sections
		var rewardsSectionResult = app.templates.modules.rewardsLevel.content({linkToRewardsPage: false});
		 
		var htmlRewardsSection1 = rewardsSectionResult.section1;
		var htmlRewardsSection2 = rewardsSectionResult.section2;
		
		var html =`
		<div id="profile-learning-preferences">
			<h2 class="materialHeaderBox materialTextCenter fontFamilyOptimus">
				${app.data.user.profile.name}
				<br>
				<span style="font-size: 0.75em;">${app.data.user.profile.email}</span>
				<br><br>
				<a style="font-size: 0.45em;" class=" materialButtonFill " data-button="" href="javascript: materialDialog.show('dialogChangePassword', {});">Change Password</a>
			</h2>
			<h3 class="rewardsHeader materialHeaderBox materialTextCenter materialThemeGreyLight fontFamilyOptimus">Your Rewards</h2>
			${htmlRewardsSection1}
			${htmlRewardsSection2}
			<h3 class="materialHeaderBox materialTextCenter materialThemeGreyLight fontFamilyOptimus">Your Learning Preferences</h2>
			<div class="row">
				<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
					<div class="materialCard materialThemeLightGold">
						<div class="materialCardTop" data-button="" data-href="javascript: showDialogPianoLevelOnProfilePage();">
							<div class="materialCardImg">
								<div class="materialCardImgInside" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png);"></div>
							</div>
							<div class="materialCardInfo materialThemeLightGold" style="min-height: 193px;">
								<h2 class="materialHeader">Piano Level</h2>
								<ul style=" margin-top: 15px;">
									${levelHtml} 
								</ul>
							</div>
						</div>
						<div class="materialCardAction materialThemeLightGold">
							<span><a class="materialButtonText materialButtonFill materialThemeDark" data-button="" href="javascript: showDialogPianoLevelOnProfilePage();">Edit</a></span>
						</div>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
					<div class="materialCard materialThemeLightGold">
						<div class="materialCardTop" data-button="" data-href="javascript: showDialogInterestsOnProfilePage();">
							<div class="materialCardImg">
								<div class="materialCardImgInside" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png);"></div>
							</div>
							<div class="materialCardInfo materialThemeLightGold" style="min-height: 193px;">
								<h2 class="materialHeader">Interests</h2>
								<ul style=" margin-top: 15px;">
									${interestsHtml} 
								</ul>
							</div>
						</div>
						<div class="materialCardAction materialThemeLightGold">
							<span><a class="materialButtonText materialButtonFill materialThemeDark" data-button="" href="javascript: showDialogInterestsOnProfilePage();">Edit</a></span>
						</div>
					</div>
				</div>
				<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
					<div class="materialCard materialThemeLightGold">
						<div class="materialCardTop" data-button="" data-href="javascript: showDialogGenresOnProfilePage();">
							<div class="materialCardImg">
								<div class="materialCardImgInside" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png);"></div>
							</div>
							<div class="materialCardInfo materialThemeLightGold"style="min-height: 193px;">
								<h2 class="materialHeader">Favorite Genres</h2>
								<ul style=" margin-top: 15px;">
									${genresHtml} 
								</ul>
							</div>
						</div>
						<div class="materialCardAction materialThemeLightGold">
							<span><a class="materialButtonText materialButtonFill materialThemeDark" data-button="" href="javascript: showDialogGenresOnProfilePage();">Edit</a></span>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		
		return html;
	},
	content : function (){
		
		 var dataCards 		= app.data.user.cards;  

		
		var html =`
					<div class="container-fluid" style=" padding-top: 0px;">
						<div class="row">   
								 <h2 class="materialHeaderBox materialThemeDark   materialTextCenter fontFamilyLato materialColorDarkGrey" style="padding-top: 79px; font-size: 25px;  margin-bottom: 40px;   font-weight: 300;  color: #c8c8c8; background: rgba(52, 52, 51, 0.85)">Your Profile</h2> 
						</div>
					</div>
					 
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.pages.profile.__createPersonalCards()}</div>
						
						<h3 class="materialHeaderBox materialTextCenter materialThemeGreyDark fontFamilyLato">Your Progress</h3>
						
						<div id="page-lesson-cards" class="row action-cards-all">${app.templates.modules.actionCards.content(dataCards)}</div>
					</div>
					`; 
		return html;
	}	 
};
 


 
