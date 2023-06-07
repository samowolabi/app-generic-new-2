var dashboardInfiniteScrolling = function(){
	var that = [];
	
	that.vars = [];
	that.vars.currentscrollHeight = 0;
	that.vars.count = 0;
	that.vars.scrollDiv = true;
	
	that.callbacks = [];
	that.callbacks.infiniteScrollingCardsSearchBar = function() {
		if(that.fx.scrollHeightVariableAndClearHTML()){
			that.fx.loadInfiniteCards();
		}
	}
	that.callbacks.searchBtn = function(event) {
		 event.preventDefault()
		if(that.fx.scrollHeightVariableAndClearHTML()) {
			that.fx.loadInfiniteCards();
		}
	}
	that.callbacks.filterDropdown = function() {
		if(that.fx.scrollHeightVariableAndClearHTML()) {
			that.fx.loadInfiniteCards();
		}
	}
	that.callbacks.filterSwitch = function() {
		$('.filterDropdown select.level').val('');
		$('.filterDropdown select.duration').val('');
		$('.filterDropdown select.era').val('');
		$('.filterDropdown select.composer').val('');
		$('.filterDropdown select.workType').val('');
			
		$('.filterDropdownToggle').toggle();
		if(that.fx.scrollHeightVariableAndClearHTML()){
			that.fx.loadInfiniteCards();
		}
	}
	
	that.callbacks.onScroll = function() {
		//console.log("START: ON SCROLL CALLBACK");
		var scrollHeight = $(document).height();
		var scrollPos = Math.floor($(window).height() + $(window).scrollTop());
		var isBottom = ((scrollHeight - 100) < scrollPos) ? true : false;
		if(that.vars.scrollDiv === false){
			//console.log("Infinite Scrolling A", "that.vars.scrollDiv", that.vars.scrollDiv, "isBottom", isBottom, "that.vars.currentscrollHeight < scrollHeight", (that.vars.currentscrollHeight < scrollHeight), "that.vars.currentscrollHeight", that.vars.currentscrollHeight, "scrollHeight", scrollHeight, "scrollPos", scrollPos, "$(window).height()", $(window).height(), "$(window).scrollTop()", $(window).scrollTop());
			that.vars.currentscrollHeight = 0;
		}
		if (that.vars.scrollDiv && isBottom && that.vars.currentscrollHeight < scrollHeight) {
			//console.log("Infinite Scrolling B", "that.vars.scrollDiv", that.vars.scrollDiv, "isBottom", isBottom, "that.vars.currentscrollHeight < scrollHeight", (that.vars.currentscrollHeight < scrollHeight), "that.vars.currentscrollHeight", that.vars.currentscrollHeight, "scrollHeight", scrollHeight, "scrollPos", scrollPos, "$(window).height()", $(window).height(), "$(window).scrollTop()", $(window).scrollTop());
			that.fx.loadInfiniteCards();
			that.vars.currentscrollHeight = scrollHeight;
		}
		//console.log("Infinite Scrolling C", "that.vars.scrollDiv", that.vars.scrollDiv, "isBottom", isBottom, "(scrollHeight - 100)", (scrollHeight - 100), "scrollPos", scrollPos,  "that.vars.currentscrollHeight < scrollHeight", (that.vars.currentscrollHeight < scrollHeight), "that.vars.currentscrollHeight", that.vars.currentscrollHeight, "scrollHeight", scrollHeight, "$(window).height()", $(window).height(), "$(window).scrollTop()", $(window).scrollTop());
			
	}
	 

	that.createCard = function (courseId, course, columnWidthClass){ 

		var href = `#!/course/${courseId}`;
		
		var countdownHtml = function(date){
				return `
				<span data-countdown="${date}"> 
					<span data-days>00</span>
					<span data-days-caption> Days </span>
					<span data-hours>00</span>:<span data-minutes>00</span>:<span data-seconds>00</span>
				</span>`;
				};
				
		var shareButtonHtml = `
			<span>
				<a href="#" class="materialButtonIcon materialThemeDark" data-button data-icon-class-on="fa fa-share-alt pressed" data-icon-class-off="fa fa-share-alt" data-action="materialContextMenu">
					<i class="fa fa-share-alt" aria-hidden="true"></i>
					<ul class="materialContextMenu" data-position="bottom left" data-url="https://pianoencyclopedia.com/en/sign-up/?utm_source=share&utm_campaign=members-area&utm_content=${encodeURIComponent(href)}" data-callback="window.open(value.replace('%url%', $(thisContextMenuUl).data('url')), '_blank');">
						<li data-value="https://www.facebook.com/sharer/sharer.php?u=%url%">
							<i class="fa fa-facebook-official"></i> Facebook
						</li>
						<li data-value="https://twitter.com/intent/tweet?url=%url%&text=Learn how to improvise, compose, and play the piano by ear by discovering The Logic Behind Music" data-callback="window.open('' + value, '_blank');">
							<i class="fa fa-twitter" aria-hidden="true"></i> Twitter
						</li>
						<li data-value="https://api.whatsapp.com/send?text=Learn how to improvise, compose, and play the piano by ear by discovering The Logic Behind Music: %url%">
							<i class="fa fa-whatsapp" aria-hidden="true"></i> Whatsapp
						</li> 
						<li data-value="mailto:?subject=This piano course is amazing&amp;body=Learn how to improvise, compose, and play the piano by ear by discovering The Logic Behind Music: %url%">
							<i class="fa fa-envelope" aria-hidden="true"></i>Email
						</li>
					</ul> 
				</a> 
			</span>`;
		
		  
		switch(course.progressStatus){			
			case "new":
				var buttonAction = "Start";
				break;
			case "inProgress": 
				var buttonAction = `Resume`;
				break;
			case "completed": 
				var buttonAction = `Watch Again`;
			default: 
				var buttonAction = "Start";
		}
		 
		
		


		var icon;				
		switch(course.type){ 
			case "add-here-different-course-types":
				icon = "fa-newspaper-o";			
				break;
			default: 	
				icon = "fa-graduation-cap";			
		}

		switch(course.dateStatus){
			case "expiringAsap":
				var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>Expiring in ${countdownHtml(course.deadlineDateString)}</p>`;
				var theme = "materialThemeLightGold";
				var themeOverlay = "";
				var themeButton = "materialButtonFill materialThemeDark";
				var actionHtml = `<span>
									<a href="${href}" class="materialButtonText ${themeButton}" data-button >${buttonAction}</a>
								  </span>
								  ${shareButtonHtml}`;
				var progressChipHtml = `<span data-new><i>NEW</i></span>
									<span data-incomplete><span data-progress-affects-html>0</span>%</span>
									<span data-complete><i class="fa fa-check"></i></span>`;
					
				break;
			case "expiringSoon": 
				var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>Expiring Soon</p>`;  
				var theme = "materialThemeLightGold";
				var themeOverlay = "";
				var themeButton = "materialButtonFill materialThemeDark";
				var actionHtml = `<span>
									<a href="${href}" class="materialButtonText ${themeButton}" data-button >${buttonAction}</a>
								  </span>
								  ${shareButtonHtml}`;
				var progressChipHtml = `<span data-new><i>NEW</i></span>
									<span data-incomplete><span data-progress-affects-html>0</span>%</span>
									<span data-complete><i class="fa fa-check"></i></span>`;				   
				break;
			case "comingAsap":
				var scarcityHtml = ``;
				var theme = "materialThemeDarkGold";
				var themeOverlay = "materialOverlayShallowBlack";
				var themeButton = "materialButtonText";
				var actionHtml = `<p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i> Available in ${countdownHtml(course.availableDateString)}</p>`;
				var progressChipHtml = `<span data-new><i>COMING SOON</i></span>
									<span data-incomplete>COMING SOON</span>
									<span data-complete>COMING SOON</span>`;
				var icon = "fa-clock-o";		
				break;
			case "comingSoon":
				var scarcityHtml = ``;  
				var theme = "materialThemeDarkGold";
				var themeOverlay = "materialOverlayShallowBlack";
				var themeButton = "materialButtonText";
				var actionHtml = `<p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i> Available Soon</p>`;
				var progressChipHtml = `<span data-new><i>COMING SOON</i></span>
									<span data-incomplete>COMING SOON</span>
									<span data-complete>COMING SOON</span>`;
				var icon = "fa-clock-o";		
				break;
			case "expired":
				var scarcityHtml = ``;  
				var theme = "materialThemeDarkGrey";
				var themeOverlay = "materialOverlayShallowBlack";
				var themeButton = "materialButtonText materialThemeDarkGrey";
				var actionHtml = `<span>
									<button disabled="disabled" class="materialButtonText ${themeButton}" data-button><i class="fa fa-lock"></i> Expired</button>
								  </span>`;
				var progressChipHtml = `<span data-new><i>EXPIRED</i></span>
									<span data-incomplete>EXPIRED</span>
									<span data-complete>EXPIRED</span>`;
				var icon = "fa-lock";		
				
				break;	
			case "available": 
			default: 
				var scarcityHtml = "";
				var theme = "materialThemeLightGold";
				var themeOverlay = "";
				var themeButton = "materialButtonFill materialThemeDark";
				var actionHtml = `<span>
									<a href="${href}" class="${themeButton}" data-button >${buttonAction}</a>
								  </span>
								  ${shareButtonHtml}`;
				var progressChipHtml = `<span data-new><i>NEW</i></span>
								<span data-incomplete><span data-progress-affects-html>0</span>%</span>
								<span data-complete><i class="fa fa-check"></i></span>`; 	
				
		}
		
		

			 


		var	progressBarStyling = `style="width:${course.stats.lessons.totalProgress}%; "`;

		var progressHtml = `<div class="materialProgressBar ${theme}">
								<div class="materialProgressBarInside" ${progressBarStyling}> 
								</div>
							</div>`;
		
							
		//Use thumbnail if available, else use big image, else use defaulti mage;
		var defaultImage = 'https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png';
		var courseImage = course.imageThumbnail || course.image || defaultImage; 
		
		var courseBackgroundColor = (courseImage === defaultImage) ? "black" : "grey";
		
		var bottomLeftChip = config.text.searchResultsBottomLeft(course) ?
							`<div class="materialCardNew materialThemeDark materialThemeFlat" style="left: 20px; right: auto">
								${config.text.searchResultsBottomLeft(course)}
							</div>;` : "";
							
		var topLeftChip =  config.text.searchResultsTopLeft(course) ?
							`<div class="materialCardNew materialThemeDark materialThemeFlat" style="left: 20px; right: auto; top: 20px; bottom: auto;">
								${config.text.searchResultsTopLeft(course)}
							</div>;` : ""; 
							
							
		var lineText1 =  config.text.searchResultsLineText1(course) ? `<h6 class="materialHeader">${config.text.searchResultsLineText1(course)}</h6>` : `<h6 class="materialHeader"></h6>`; 		

		var lineText2 =  config.text.searchResultsLineText2(course) ? `<p class="materialParagraph ${theme}">${config.text.searchResultsLineText2(course)}</p>` : `<p class="materialParagraph ${theme}"></p>`; 					
							
		var html = `
			<div class="${columnWidthClass}" style="min-height: ${config.layout.searchResultsMinHeight}">
					<div class="materialCard ${theme}">
						<div class="materialCardTop" data-button data-href="${href}"> 
							<div class="materialCardImg">
								<div class="materialCardImgInside" style="background-image: url(${courseImage}); background-color: ${courseBackgroundColor};"></div> 
								<div class="materialCardImgOverlay ${themeOverlay}"></div>
								 
								<div class="materialCardMediaType ${theme} materialThemeFlat">
										<i class="fa ${icon}" title="Course"></i>
								</div> 
								
								${bottomLeftChip}
								
								${topLeftChip} 
								
								<div class="materialCardNew ${theme} materialThemeFlat">
									<span data-progress="${course.stats.lessons.totalProgress}">
										${progressChipHtml}
									</span>
								</div>
							</div>
						${progressHtml}
							<div class="materialCardInfo ${theme}">
								<h2 class="materialHeader" style="font-size: ${config.layout.searchResultsCourseTitleFontSize}">${course.title}</h2>
								${lineText1}
								${lineText2} 
								${scarcityHtml} 
							</div>
						</div>
						<div class="materialCardAction ${theme}">
							${actionHtml}
						</div>
					</div>   
			</div>`;
		
		return html;
	}
					
	that.fx = []
	that.fx.loadInfiniteCards = function() {
	 
			// Load Infinite cards
			var noOfRecordsPerPage = 9;
			var paginationValue =  $('.addPaginationValue').val();
			var searchValue = $(".infiniteScrollingCardsSearchBar input").val();
			searchValue = searchValue ? searchValue.toLowerCase() : "";
			
			var level = $('.filterDropdown select.level').val();
			var duration = $('.filterDropdown select.duration').val();
			var era = $('.filterDropdown select.era').val();
			var composer = $('.filterDropdown select.composer').val();
			var workType = $('.filterDropdown select.workType').val();
			
			//Restore last used search and filters
			//app.restoreLastSearch();	
		 
			var filters = app.getFilterArray();
			var isFiltersEmpty = (Object.keys(filters).length === 0);
			
			if((searchValue === '' || searchValue === null) &&  (isFiltersEmpty)) {
				$('.recommendedDiv').show();
			}
			else {
				$('.recommendedDiv').hide();
			}
			 
			// start
			
			$('.cardLoadingPlaceholder').show();
			var filters = app.getFilterArray();
			var matchedCourses = app.searchCourses(searchValue, filters, paginationValue);
				 
			var columnWidthClass =  `cardSearchResult ${config.layout.searchResults}`; 
			var html = "";
			matchedCourses.forEach(function (courseId, index) { 
					var course = app.data.course[courseId]; 
					html += that.createCard(courseId, course, columnWidthClass); 
			});		
			
			
			$('.cardLoadingPlaceholder').hide();
			if(matchedCourses.length == 0) {
				if(paginationValue > 1){
				} else {
					that.fx.scrollHeightVariableAndClearHTML();
					$('.noResultsDiv').show();
				}
				that.vars.scrollDiv = false;
			}
			else {
				that.vars.scrollDiv = true;
				$('.noResultsDiv').hide(); 
			}
						
			$('.infiniteScrollingContainer').append(html);
			material.init(".infiniteScrollingContainer");
			
			Number(paginationValue++);
			$('.addPaginationValue').val(paginationValue);			
			 
	}
	
	that.fx.scrollHeightVariableAndClearHTML = function() {
		// clear saved scrollHeightVariable and html 
		that.vars.currentscrollHeight = 0;
		$('.addPaginationValue').val('1');
		$('.infiniteScrollingContainer').html('');
		return true
	}
	
	var exposed = [];
	exposed.loaded = false;
	exposed.load = function(){
		if(!exposed.loaded){
			exposed.loaded = true;
			that.fx.loadInfiniteCards();
			
			$('.filterDropdownToggle').hide();
			
			// On Scroll
			that.vars.currentscrollHeight = 0;
			that.vars.count = 0;
			that.vars.scrollDiv = true;
			
			console.log("TURN ON SCROLL CALLBACK");
			$(document).on("scroll", window, that.callbacks.onScroll); 
			
			$('.filterSwitch').on("click", that.callbacks.filterSwitch);
			$('.searchBtn').on("click", that.callbacks.searchBtn);
			$('.infiniteScrollingCardsSearchBar input').on("change ", that.callbacks.infiniteScrollingCardsSearchBar);
			$('.filterDropdown select').on("change", that.callbacks.filterDropdown);
		
		
		}
	};
	
	exposed.callbacks = that.callbacks;
	exposed.unload =  function (){
		if(exposed.loaded){
			$(document).off("change", '.infiniteScrollingCardsSearchBar input', that.callbacks.infiniteScrollingCardsSearchBar);
			$(document).off("click", '.searchBtn', that.callbacks.searchBtn);
			$(document).off("change", '.filterDropdown select', that.callbacks.filterDropdown);
			$(document).off("click", '.filterSwitch', that.callbacks.filterSwitch);
			
			console.log("TURN OFF SCROLL CALLBACK");
			$(document).off("scroll", window, that.callbacks.onScroll);
			exposed.loaded = false;
		}	 
	};
	
	return exposed;
	
}();