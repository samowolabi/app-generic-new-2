app.templates = app.templates || {}; 
app.templates.pages = app.templates.pages || {}; 
app.templates.pages.dashboardInfiniteScrolling = {
	loading : function(target){
			var html =`
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.modules.lesson.loading()}</div>
						<div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
						<div id="page-lesson-cards" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.loading()}</div>
					</div>`;
			
			return html;
	},
	content : function (){
	 var data = app.data;
	 var name = data.user.profile.name ? (data.user.profile.name + ",")  : "";
		
	//Create rewards Sections
		var rewardsSectionResult = app.templates.modules.rewardsLevel.content({linkToRewardsPage: true});

		var htmlRewardsSection1 = rewardsSectionResult.section1;
		var htmlRewardsSection2 = rewardsSectionResult.section2; //Not used
 
 
		var html = ` 
			<div class="container-fluid" style=" padding-top: 0px;">
				<div class="row">   
						 <h2 class="materialHeaderBox materialThemeGreyLight  materialHeaderBox materialTextCenter materialThemeGreyLight fontFamilyOptimus  materialTextCenter" style="${config.theme.header}">${config.text.header()}</h2> 
				</div>
			</div>
			<div class="container-fluid" style=" padding-top: 0px;">
				<div class="row">   
						 <h2 class="materialHeaderBox materialThemeDark   materialTextCenter fontFamilyLato materialColorDarkGrey" style="font-size: 25px;  margin-bottom: 40px;   font-weight: 300;  color: #c8c8c8; background: rgba(52, 52, 51, 0.85)">
							Welcome back${data.user.profile.firstname ? (", " + data.user.profile.firstname )  : ""}!
						</h2> 
				</div>
			</div>
			<div class="container">
				<div class="row action-cards-top">  
					${app.templates.modules.actionCards.content([])} 
				</div>
				${htmlRewardsSection1}
			</div> 
		`; 
		 
	
		html +=`
					
					 
					<div class="container"> 
						<div class="row">
							<div class="infiniteScrollingSearchDiv container-fluid container-fluid-max-width">
								<div class="row marginTop15">
									<div class="col-sm-12">
										<div class="infiniteScrollingCardsSearchBar" style=""> 
											<input placeholder="${config.text.searchBarPlaceholder}"  class="materialInputTextArea materialThemeDark" type="text"> 
										</div>
										<div class=""> 
											<button class="materialButtonFill materialThemeDark searchBtn"><i class="fa fa-search"></i> Search</button>
										</div>
									</div>
								</div>
							</div>	
						
							<div class="container-fluid container-fluid-max-width">
								<div class="row">
									<div class="col-sm-12 marginTop5 marginBottom3">
										<button class="materialButtonText materialThemeDark filterSwitch"><i class="fa fa-filter"></i> FILTER</button>
									</div>
								</div>
								
								<div class="row filterDropdownToggle marginBottom3">
									 <!-- Created dynamically -->
								</div>
								
								<script>
									var result = '';
								
									//Create filters based on current data.
									 $(".filterDropdownToggle").html(app.createFiltersHtml()); 
									  
									
									 if($(".filterInput").length == 0){
										$("button.filterSwitch").hide();								 
									 }
								</script> 
								
							 </div>
						
							<input type="hidden" class="addPaginationValue" value="1">
							<div class="container-fluid container-fluid-max-width">
								
								<div class="row recommendedDiv" style="display: none;">
									<div class="col-sm-12  ">
										<div class="materialHeaderBox materialThemeDark">Recommended for You </div>	
									</div>
								</div>
								
								<div class="row infiniteScrollingContainer">
									<!-- Infinite Scroll Cards -->  
								</div>
								
								<div class="row">
									<div class="col-sm-12 noResultsDiv" style="display: none;">
										<h3 class='marginTop8 marginBottom8' style='color: #ffffff; text-align: center;'>No results found</h3>
									</div>
								</div>
								
								<div class="row cardLoadingPlaceholder marginTop8" style="display:none;">
									<div class="col-lg-4 col-md-3 col-sm-6 col-xs-12">
										<div class="materialCard materialThemeDark">
											<div class="materialCardTop" data-button="" data-href="product1">
												<div class="materialCardImg materialPlaceHolder">
													<div  class="materialCardImgInside "></div> 
													<div class="materialCardImgOverlay"></div>
												</div>
												<div class="materialProgressBar materialThemeDark materialPlaceHolder" style="height: 8px;">
													<div style="width:100%;"></div>
												</div>
												<div class="materialCardInfo materialThemeDark">
													<h2 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 40px;"> </h2>
													<h6 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 30px;"></h6>  
													<p class="materialParagraph materialThemeDark" style="height: 20px;"></p>
												</div>
											</div>
											<div class="materialCardAction materialThemeDark materialPlaceHolder" style="height: 40px;">
												<span>
													
												</span>
												
											</div>
										</div>
									</div>
									<div class="col-lg-4 col-md-3 col-sm-6 col-xs-12">
										<div class="materialCard materialThemeDark">
											<div class="materialCardTop" data-button="" data-href="product1">
												<div class="materialCardImg materialPlaceHolder">
													<div  class="materialCardImgInside "></div> 
													<div class="materialCardImgOverlay"></div>
												</div>
												<div class="materialProgressBar materialThemeDark materialPlaceHolder" style="height: 8px;">
													<div style="width:100%;"></div>
												</div>
												<div class="materialCardInfo materialThemeDark">
													<h2 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 40px;"> </h2>
													<h6 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 30px;"></h6>  
													<p class="materialParagraph materialThemeDark" style="height: 20px;"></p>
												</div>
											</div>
											<div class="materialCardAction materialThemeDark materialPlaceHolder" style="height: 40px;">
												<span>
													
												</span>
												
											</div>
										</div>
									</div>
									<div class="col-lg-4 col-md-3 col-sm-6 col-xs-12 hidden-xs">
										<div class="materialCard materialThemeDark">
											<div class="materialCardTop" data-button="" data-href="product1">
												<div class="materialCardImg materialPlaceHolder">
													<div  class="materialCardImgInside "></div> 
													<div class="materialCardImgOverlay"></div>
												</div>
												<div class="materialProgressBar materialThemeDark materialPlaceHolder" style="height: 8px;">
													<div style="width:100%;"></div>
												</div>
												<div class="materialCardInfo materialThemeDark">
													<h2 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 40px;"> </h2>
													<h6 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 30px;"></h6>  
													<p class="materialParagraph materialThemeDark" style="height: 20px;"></p>
												</div>
											</div>
											<div class="materialCardAction materialThemeDark materialPlaceHolder" style="height: 40px;">
												<span>
													
												</span>
												
											</div>
										</div>
									</div>
									<div class="col-lg-4 col-md-3 col-sm-6 col-xs-12 hidden-xs">
										<div class="materialCard materialThemeDark">
											<div class="materialCardTop" data-button="" data-href="product1">
												<div class="materialCardImg materialPlaceHolder">
													<div  class="materialCardImgInside "></div> 
													<div class="materialCardImgOverlay"></div>
												</div>
												<div class="materialProgressBar materialThemeDark materialPlaceHolder" style="height: 8px;">
													<div style="width:100%;"></div>
												</div>
												<div class="materialCardInfo materialThemeDark">
													<h2 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 40px;"> </h2>
													<h6 class="materialHeader materialThemeDark materialPlaceHolder" style="height: 30px;"></h6>  
													<p class="materialParagraph materialThemeDark" style="height: 20px;"></p>
												</div>
											</div>
											<div class="materialCardAction materialThemeDark materialPlaceHolder" style="height: 40px;">
												<span>
												</span>
											</div>
										</div>
									</div>
								</div>
								
							</div>	
						</div>
					</div>
					<script>
						console.log("RUNNING");
						dashboardInfiniteScrolling.load();   
					</script>
					`; 
		return html;
	}	 
};
 


 
