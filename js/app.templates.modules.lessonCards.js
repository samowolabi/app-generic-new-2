app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.lessonCards = {
	loading : function(){
			var html =`
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div class="materialCard">
						<div class="materialCardTop" data-button data-href="#">
							<div class="materialCardImg materialPlaceHolder">
							</div>
							<div class="materialCardInfo">
								<h2 class="materialPlaceHolder" style="height: 30px;width: 70%"></h2>
								<h6 class="materialPlaceHolder" style="height: 20px;width: 50%"></h6>
								<p  class="materialPlaceHolder" style="height: 80px;width: 100%"></p>
							</div>
						</div>
						<div class="materialCardAction materialPlaceHolder" style="height: 45px;width: 100%">
						</div>
					</div>
				</div>	
				
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div class="materialCard">
						<div class="materialCardTop" data-button data-href="#">
							<div class="materialCardImg materialPlaceHolder">
							</div>
							<div class="materialCardInfo">
								<h2 class="materialPlaceHolder" style="height: 30px;width: 70%"></h2>
								<h6 class="materialPlaceHolder" style="height: 20px;width: 50%"></h6>
								<p  class="materialPlaceHolder" style="height: 80px;width: 100%"></p>
							</div>
						</div>
						<div class="materialCardAction materialPlaceHolder" style="height: 25px;width: 100%">
						</div>
					</div>
				</div>`; 
			
			return html;
	},
	content : function(lessonsList){
		var html = "";
		var cardSettings;
		
		var lessonsListLength = lessonsList.length;
		
		
		if(lessonsListLength === 1){
			var columnWidthClass = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
		}
		else{
			var columnWidthClass = "col-lg-6 col-md-6 col-sm-12 col-xs-12"; 
		} 
		
		for (var i = 0; i < lessonsListLength; i++) {  
			html += app.templates.modules.lessonCards.__createCardHtml(lessonsList[i], columnWidthClass); 
			if(i%2 == 1){
				html += "</div><div class='row'>";
			}
		}
		
		return html;
	},
	__createCardHtml : function (settings, columnWidthClass){ 

		var href = `#!/lesson/${settings.id}`;
		
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
		
		  
		switch(settings.progressStatus){			
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
		switch(settings.type){
			case "video":
				icon = "fa-film";			
				break;
			case "ebook":
				icon = "fa-book";			
				break;
			case "article":
				icon = "fa-newspaper-o";			
				break;
			default: 	
				icon = "fa-newspaper-o";			
		}

		switch(settings.dateStatus){
			case "expiringAsap":
				var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>Expiring in ${countdownHtml(settings.deadlineDateString)}</p>`;
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
				var actionHtml = `<p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i> Available in ${countdownHtml(settings.availableDateString)}</p>`;
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
		
		

			 


		var	progressBarStyling = `style="width:${settings.progress}%; "`;

		var progressHtml = `<div class="materialProgressBar ${theme}">
								<div class="materialProgressBarInside" ${progressBarStyling}> 
								</div>
							</div>`;
		
							


		var html = `
			<div class="${columnWidthClass}">
					<div class="materialCard ${theme}">
						<div class="materialCardTop" data-button data-href="${href}"> 
							<div class="materialCardImg">
								<div class="materialCardImgInside" style="background-image: url(${settings.image});"></div> 
								<div class="materialCardImgOverlay ${themeOverlay}"></div>
								<div class="materialCardMediaType ${theme} materialThemeFlat">
									<i class="fa ${icon}"></i>
								</div>
								<div class="materialCardNew ${theme} materialThemeFlat">
									<span data-progress="${settings.progress}">
										${progressChipHtml}
									</span>
								</div>
							</div>
						${progressHtml}
							<div class="materialCardInfo ${theme}">
								<h2 class="materialHeader">${settings.title}</h2>
								<h6 class="materialHeader">${settings.subtitle}</h6>
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
};
 


 
