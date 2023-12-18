/*
http.open('GET', request_field, true);
http.setRequestHeader("Access-Control-Allow-Origin", "*");
http.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
http.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
http.send();
*/


/*
*  @purpose: replaces text multiple times at once
*  var str = 'x dddd x d x ddd x dddd x dd x'
*  var find = ['dddd', 'ddd', 'dd', 'd']
*  var replace = ['d', 'dd', 'ddd', 'dddd']
*  var replaced = replaceOnce(str, find, replace)
*  t.is(replaced, 'x d x dddd x dd x dddd x ddd x')
*/
var replaceOnce = function replaceOnce(str, find, replace, flags) {
  var gFlag = false

  if (typeof str !== 'string') {
    throw new TypeError('`str` parameter must be a string!')
  }

  if (!Array.isArray(find)) {
    throw new TypeError('`find` parameter must be an array!')
  }

  if (!Array.isArray(replace)) {
    throw new TypeError('`replace` parameter must be an array!')
  }

  if (!find.length || !replace.length) {
    throw new Error('`find` and `replace` parameters must not be empty!')
  }

  if (find.length !== replace.length) {
    throw new Error('`find` and `replace` parameters must be equal in length!')
  }

  if (flags) {
    if (typeof flags !== 'string') {
      throw new TypeError('`flags` parameter must be a string!')
    } else if (~flags.indexOf('g')) {
      gFlag = true
    } else {
      flags += 'g'
    }
  } else {
    flags = 'g'
  }

  var done = []
  var joined = find.join(')|(')
  var regex = new RegExp('(' + joined + ')', flags)

  return str.replace(regex, (match, ...finds) => {
    var replaced

    finds.some((found, index) => {
      if (found !== undefined) {
        if (gFlag) {
          replaced = replace[index]
        } else if (!~done.indexOf(found)) {
          done.push(found)
          replaced = replace[index]
        } else {
          replaced = found
        }

        return true
      }
    })

    return replaced
  })
};

function isMobile(){
   //Properties on the navigator 
    function m1() {
        var regex = /Android|webOS|Phone|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent);
    }

    //Touch event
    function m2() {
        return (('ontouchstart' in window) || ("ontouchstart" in document.documentElement));
    }

    //Window.orientation
    function m3() {
        return (window.orientation !== undefined);
    }

    //Window.matchMedia()
    function m4() {
        return (window.matchMedia && window.matchMedia("only screen and (max-width: 760px)").matches);
    }

    //Screen size
    function m5() {
        return (window.innerWidth <= 800 && window.innerHeight <= 600);
    }

    return (m1() || m2() || m3() || m4() || m5());
}

var app = {}; 

app.session = {};
app.session.pageViews = 0;
app.session.timeElapsed = 0;
app.session.rewardPointsGained = 0;  
app.session.onlyOnce = {};

/**
 * Do action if condition or wait. if(condition()){ action(); } else{ wait  and check again } 
 */
app.debounce = function(actionFx, conditionFx, timeMs){
	if(typeof timeMs === "undefined"){ timeMs = 5000; }
	
	if(conditionFx()){
		actionFx();
	}else{
		console.log("app.debounce",actionFx,conditionFx,timeMs);
		setTimeout(function(){
			app.debounce(actionFx, conditionFx, timeMs);
		}, timeMs);
	}
};
 
//Will return true if it is the first time it's called or X hours have passed since last call
/* Sample usage: 
* app.onlyOnceEvery({id:"trigger5", hours: 4, mode: "cookie"}) 
* app.onlyOnceEvery({id:"trigger5", days: 4, mode: "session"}) 
* app.onlyOnceEvery({id:"trigger5", minutes: 4, mode: "cookie"})  
*/
app.onlyOnceEvery = function(params){
	var uniqueId = params.id || "not-set";
	var days = params.days || false;
	var hours = params.hours || false;
	var minutes = params.minutes || false;
	var mode = params.mode || "session";

	if(days){
		hours = (days+0) * 24;
	}
	
	if(minutes){
		hours = (minutes+0) / 60;
	}
	
	//TODO test if working correctly.
	var cookieCheck = function(){
		uniqueId = "oo-"+uniqueId;
		var nowDate = new Date();
		var last = Cookies.get(uniqueId);
		var lastDate = (last? (new Date(last)) : false);
		var lastDateSession = app.session.onlyOnce[uniqueId]; 
		
		if(last && lastDate && ((nowDate - lastDate ) < (hours * 60 * 60 * 1000))){
			return false;
		}
		
		//If we are on incognito mode, we want to at least remember the last seesion
		if(lastDateSession && ((nowDate - lastDateSession ) < (hours * 60 * 60 * 1000))){
			return false;
		}
		
		app.session.onlyOnce[uniqueId] = nowDate;
		Cookies.set(uniqueId, nowDate, { expires: ((hours+0)/24) });
		return true;
	} 
	
	var sessionCheck = function(){
		var nowDate = new Date();
		var lastDate = app.session.onlyOnce[uniqueId]; 
		
		if(lastDate && ((nowDate - lastDate ) < (hours * 60 * 60 * 1000))){
			return false;
		}
		
		app.session.onlyOnce[uniqueId] = nowDate;
		return true;
	}
	
	
	if(mode === "cookie"){ 
		return cookieCheck(); 
	}
	else{	 
		return sessionCheck();
	}
};

app.dialogs = app.dialogs || {};
app.dialogs.unfinishedLessons = function(settings){
	if(typeof settings === "undefined"){ settings = {};	}
	
	var dialogHtml = `<div class="row">
							<div class="col-sm-12 col-xs-12" data-value="close"  data-href="#!/expiring/">
									<div class="materialCard materialCardProgress materialCardSizeMega" style="margin: 0; background:#fff !important;    background-position: center !important;   background-size: cover !important;">
										 <div class="container-fluid">
											<div class="row">
												
												<div class="materialCardProgressLeft materialCardProgressLeftDouble">
													
													<div class="materialProgressCircle" data-progress="completenessPorcentage" data-progress-affects-data-percentage="" data-percentage="10">
														<span class="materialProgressCircle-left">
															<span class="materialProgressCircle-bar"></span>
														</span>
														<span class="materialProgressCircle-right">
															<span class="materialProgressCircle-bar"></span>
														</span>
														<div class="materialProgressCircle-value"> 
															<div>
																<span><span>3</span>/33</span><br>
																Lessons<br>Completed
															</div>
														</div>
													</div>
													<br class="visible-xs visible-sm"><br class="visible-xs visible-sm"> 
													<div class="materialImageCircle hidden-xs" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.v2.min.png); ">  
													</div>
													
												</div> 
												<div class="materialCardProgressRight materialCardProgressRightDouble">
												  <h3 class="materialHeader" style="margin-bottom: 20px;">You have 30 unfinished lessons</h3>
													<p class="materialParagraph">Small steps add up to big progress. Invest five minutes in your piano learning now and see how far you can go!</p>
													<a href="#!/expiring/"  data-value="close" class="materialButtonFill">Complete next lesson</a>
												</div> 
											</div>
										</div>
									</div> 
								</div>
						</div>`;
	materialDialog.custom(dialogHtml, settings);
}


app.dialogs.exclusiveInvitation = function(url, settings){
	if(typeof settings === "undefined"){ settings = {};	}
	 
	
	var dialogHtml = `<div class="row">
		<div class="col-sm-12 col-xs-12" data-value="close" data-href-target="_blank" data-href="${url}">
				<div class="materialCard materialCardProgress materialCardSizeMega materialThemeDark" style="margin: 0; background-color:#111111 !important;    background-position: center !important;   background-size: cover !important;">
					 <div class="container-fluid">
						<div class="row">
							
							<div class="materialCardProgressLeft materialThemeDark materialCardProgressLeftDouble">
								
								<div class="materialProgressCircle materialThemeDark" data-progress="95" data-progress-affects-data-percentage="" data-percentage="10">
									<span class="materialProgressCircle-left">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<span class="materialProgressCircle-right">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<div class="materialProgressCircle-value"> 
										<div>
											<span>${app.data.user.profile.rewardPoints}</span><br>
											Reward<br>Points
										</div>
									</div>
								</div>
								<br class="visible-xs visible-sm"><br class="visible-xs visible-sm"> 
								<div class="materialImageCircle materialThemeDark hidden-xs" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.v2.min.png); ">  
								</div>
								
							</div> 
							<div class="materialCardProgressRight materialThemeDark materialCardProgressRightDouble">
                              <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;">Exclusive invitation for ${app.data.user.profile.name}</h3>
								<p class="materialParagraph materialThemeDark">You are invited to our exclusive special offer that grants you lifetime access to all piano courses of The Piano Encyclopedia at the best deal ever offered!</p>
								<a href="${url}" target="_blank" data-value="close" class="materialButtonFill materialThemeDark">Let me in!</a>
							</div> 
						</div>
					</div>
				</div> 
			</div>
	</div>`;
	materialDialog.custom(dialogHtml, settings);
}

app.dialogs.questionProgress = function( settings){
	if(typeof settings === "undefined"){ settings = {};	}
    settings.title = settings.title || "Undefined title";
    settings.subtitle = settings.subtitle || "Undefined subtitle";
    settings.progressPercentage = settings.progressPercentage || "0";
    settings.progressDisplay = settings.progressDisplay || "0";
    settings.progressTitle = settings.progressTitle || "Melody Coins";
    settings.progressSubTitle = settings.progressSubTitle || "<b style='color: white'>Your Balance</b>";

     settings.buttonNo  = settings.buttonNo || {};
     settings.buttonYes = settings.buttonYes || {};

     settings.buttonNo.caption  = settings.buttonNo.caption || "NO";
     settings.buttonYes.caption = settings.buttonYes.caption || "YES";

     settings.buttonNo.value  = settings.buttonNo.value || "no";
     settings.buttonYes.value = settings.buttonYes.value || "yes";

     settings.buttonNo.href  = settings.buttonNo.href || "javascript: void(0);";
     settings.buttonYes.href = settings.buttonYes.href || "javascript: void(0);";

     settings.buttonNo.additional  = settings.buttonNo.additional || "";
     settings.buttonYes.additional = settings.buttonYes.additional || "";

     settings.buttonNo.theme  = settings.buttonNo.theme || "materialButtonOutline materialThemeDark";
     settings.buttonYes.theme = settings.buttonYes.theme || "materialButtonFill materialThemeDark";

     settings.hideCallback = settings.hideCallback || function(value){ console.log("Question result: ", value);};

	 settings.image = settings.image || "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/melody-coins.sm.png";
	 
	
	var dialogHtml = `<div class="row">
		<div class="col-sm-12 col-xs-12">
				<div class="materialCard materialCardProgress materialCardSizeMega materialThemeDark" style="margin: 0; background-color:#111111 !important;    background-position: center !important;   background-size: cover !important;">
					 <div class="container-fluid">
						<div class="row">

							<div class="materialCardProgressLeft materialThemeDark materialCardProgressLeftDouble">

								<div class="materialProgressCircle materialThemeDark" data-progress="${settings.progressPercentage}" data-progress-affects-data-percentage="">
									<span class="materialProgressCircle-left">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<span class="materialProgressCircle-right">
										<span class="materialProgressCircle-bar"></span>
									</span>
									<div class="materialProgressCircle-value">
										<div>
											<span>${settings.progressDisplay}</span><br>
											${settings.progressTitle}<br>${settings.progressSubTitle}
										</div>
									</div>
								</div>
								<br class="visible-xs visible-sm"><br class="visible-xs visible-sm">
								<div class="materialImageCircle materialThemeDark hidden-xs" style="background-image: url(${settings.image}); ">
								</div>

							</div>
							
							<div class="materialCardProgressRight materialThemeDark materialCardProgressRightDouble">
                              <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;">${settings.title}</h3>
								<p class="materialParagraph materialThemeDark">${settings.subtitle}</p>
								<div>
                                    <a class="${settings.buttonNo.theme}"  data-value='${settings.buttonNo.value}'  ${settings.buttonNo.additional}  href="${settings.buttonNo.href}">${settings.buttonNo.caption}</a>
                                    <a class="${settings.buttonYes.theme}" data-value='${settings.buttonYes.value}' ${settings.buttonYes.additional} href="${settings.buttonYes.href}">${settings.buttonYes.caption}</a>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
	</div>`;
	
	materialDialog.custom(dialogHtml, settings);
}

app.dialogs.selectPlan = function( settings){
	if(typeof settings === "undefined"){ settings = {};	}
    settings.title = settings.title || "Continue Your Musical Journey";
    settings.subtitle = settings.subtitle || "GET MORE MELODY COINS<br>WITH OUR SPECIAL LAUNCH OFFER";
    settings.progressPercentage = settings.progressPercentage || "95";
    settings.progressDisplay = settings.progressDisplay || "1000";
    settings.progressTitle = settings.progressTitle || "Melody Coins";
    settings.progressSubTitle = settings.progressSubTitle || "<b style='color: white'>Your Balance</b>";

     settings.buttonNo  = settings.buttonNo || {};
     settings.buttonYes = settings.buttonYes || {};

     settings.buttonNo.caption  = settings.buttonNo.caption || "NO";
     settings.buttonYes.caption = settings.buttonYes.caption || "YES";

     settings.buttonNo.value  = settings.buttonNo.value || "no";
     settings.buttonYes.value = settings.buttonYes.value || "yes";

     settings.buttonNo.href  = settings.buttonNo.href || "javascript: void(0);";
     settings.buttonYes.href = settings.buttonYes.href || "javascript: void(0);";

     settings.buttonNo.additional  = settings.buttonNo.additional || "";
     settings.buttonYes.additional = settings.buttonYes.additional || "";

     settings.buttonNo.theme  = settings.buttonNo.theme || "materialButtonOutline materialThemeDark";
     settings.buttonYes.theme = settings.buttonYes.theme || "materialButtonFill materialThemeDark";

     settings.hideCallback = settings.hideCallback || function(value){ 
		CountdownTimer.end();
		console.log("Question result: ", value);
	 };

	 settings.image = settings.image || "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/melody-coins.sm.png";
	
	settings.countdownText = settings.countdownText || "Special Offer";
	
	var expireExtensionHoursToAdd = [2,2,2];
	var urlPathEnd = "test"; 
	
	var countdownDateNow = new Date();
	var countdownTimezoneNow = "";
	
	//Only do an extension with the deadline date (never with the start date)
	var extension = ""; 
	/*if(availabilityStatus !== "notStarted"){
		extension = 'data-extension="["'+ expireExtensionHoursToAdd.toString() +'"]"';  
	} */
	//var dialogCountdownText = "Testings";
	
	settings.contentClass = "maxWidth1200";

	
	CountdownTimer.init();
	var timerHtml = "";
	var isOfferAvailable = CountdownTimer.getIsOfferAvailable();
	if(isOfferAvailable){
		settings.coupon ="SPECIAL-LAUNCH-OFFER";
		settings.subtitle =  "GET MORE MELODY COINS<br>WITH OUR SPECIAL LAUNCH OFFER";    
		timerHtml = `
		<div class="time">
			<span>
				<div id="d">00</div>
				DAYS
			</span>
			<span>
				<div id="h">00</div>
				HOURS
			</span>
			<span>
				<div id="m">00</div>
				MINUTES
			</span>
			<span>
				<div id="s">00</div>
				SECONDS
			</span>
		</div>
								
		<script type="text/javascript">
		var isOfferAvailable = CountdownTimer.getIsOfferAvailable();
		var priceMonthly, priceYearly, priceLifetime;
		if(isOfferAvailable){
			CountdownTimer.start({
				d: document.getElementById("d"),
				h: document.getElementById("h"),
				m: document.getElementById("m"),
				s: document.getElementById("s")
			});
		}
		</script>`;
		
		priceMonthly = `<s style="font-size: 0.85em;">$29.90</s> $9.99`;
		priceYearly = `<s style=" font-size: 0.85em;">$359.00</s> $99.00`;
		priceLifetime = `<s style=" font-size: 0.85em;">$3999.00</s> $899.00`;
		
	}else{
		timerHtml = "";
		settings.coupon ="";
		settings.subtitle =  "GET MORE MELODY COINS";    

		priceMonthly = `$29.90`;
		priceYearly = `$359.00`;
		priceLifetime = `$3999.00`;

	}

	
	var dialogHtml = `<div class="row">
		<div class="col-sm-12 col-xs-12">
				<div class="materialCard materialCardProgress materialCardSizeMega materialThemeDark" style="margin: 0; background-color:#111111 !important;    background-position: center !important;   background-size: cover !important;">
					 <div class="container-fluid selectPlan ">
						<div class="row">
  
						<div style="text-align: center;">
						  <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;font-size: 2.5em;">${settings.title}</h3>
							<p class="materialParagraph materialThemeDark" style="font-size: 1.7em;">${settings.subtitle}</p>
						</div>
									
						${timerHtml}

							
<div class="row">
<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
	<div class="materialCard materialThemeLightGold" style="margin-top: 45px;">
		<div class="materialCardTop" data-button="" data-href="javascript: app.checkout('the-ultimate-collection-of-piano-music', '${settings.coupon}');">
			<div class="materialCardImg">
				<div class="materialCardImgInside" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/melody-coins-monthly-plan.png);"></div>
			</div>
			<div class="materialCardInfo materialThemeLightGold" style="min-height: 193px; text-align: center">
				<h2 class="materialHeader" style="margin-bottom: 20px;">Receive Monthly<br>
				<span style=" font-size: 1.5em;">&#9834; 22,000</span><br>
				MELODY COINS</h2>
				<p class="materialParagraph materialThemeDark">Embark on a musical journey with The Ultimate Collection of Piano Music, where every month brings new discoveries. Use Melody Coins to unlock new pieces and continuously enrich your repertoire &#8212; all for just:</p>
				<h2 class="materialHeader" style="margin-bottom: 20px;">${priceMonthly}</h2>
				<div>
					<a class="materialButtonFill materialThemeDark"   href="javascript: app.checkout('the-ultimate-collection-of-piano-music', '${settings.coupon}');" style=" font-size: 1.2em; margin-bottom: 20px;">Monthly Plan</a>
				</div>
			</div>
		</div>
		<div class="materialCardAction materialThemeLightGold" style=" text-align: center;">
			<span style=" display: block; margin: 0 auto; color: grey;">Cancel or pause anytime</span>
		</div>
	</div>
</div>
<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
	<div class="materialCard materialThemeLightGold">
		<div class="materialCardHeader">
			<span>Most Popular Choice</span>
		</div>
		<div class="materialCardTop" data-button="" data-href="javascript: app.checkout('the-ultimate-collection-of-piano-music-yearly', '${settings.coupon}');">
			<div class="materialCardImg">
				<div class="materialCardImgInside" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/melody-coins-yearly-plan.png);"></div>
			</div>
			<div class="materialCardInfo materialThemeLightGold" style="min-height: 193px; text-align: center">
				<h2 class="materialHeader" style="margin-bottom: 20px;">Receive Yearly<br>
				<span style=" font-size: 1.5em;">&#9834; 300,000</span><br>
				MELODY COINS</h2>
				<p class="materialParagraph materialThemeDark">With our annual plan you will instantly receive a year's supply of Melody Coins, unlocking a world of piano pieces to master. Perfect for the dedicated student, this plan offers an enriching journey and smart savings compared to the monthly option.</p>
				<h2 class="materialHeader" style="margin-bottom: 20px;">${priceYearly}</h2>
				<div>
					<a class="materialButtonFill materialThemeDark"   href="javascript: app.checkout('the-ultimate-collection-of-piano-music-yearly', '${settings.coupon}');" style=" font-size: 1.2em; margin-bottom: 20px;">Annual Plan</a>
				</div>
			</div>
		</div>
		<div class="materialCardAction materialThemeLightGold" style=" text-align: center;">
			<span style=" display: block; margin: 0 auto; color: grey;">Cancel or pause anytime</span>
		</div>
	</div>
</div>
<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
	<div class="materialCard materialThemeLightGold"  style="margin-top: 45px;">
		<div class="materialCardTop" data-button="" data-href="javascript: app.checkout('the-ultimate-collection-of-piano-music-lifetime-access', '${settings.coupon}');">
			<div class="materialCardImg">
				<div class="materialCardImgInside" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-generic/images/melody-coins-lifetime-access.png);"></div>
			</div>
			<div class="materialCardInfo materialThemeLightGold" style="min-height: 193px; text-align: center">
				<h2 class="materialHeader" style="margin-bottom: 20px;">Receive Unlimited<br>
				<span style=" font-size: 1.3em;">LIFETIME ACCESS</span></h2>
				<p class="materialParagraph materialThemeDark">Instantly unlock every single piece of The Ultimate Collection of Piano Music with this exclusive offer. This plan grants you unlimited access to all currently available pieces - for life. Only 50 Lifetime Memberships available as part of our special product launch &#8212; secure yours now!</p>
				<h2 class="materialHeader" style="margin-bottom: 20px;">${priceLifetime}</h2>
				<div>
					<a class="materialButtonFill materialThemeDark"   href="javascript: app.checkout('the-ultimate-collection-of-piano-music-lifetime-access', '${settings.coupon}');" style=" font-size: 1.2em; margin-bottom: 20px;">Lifetime Access</a>
				</div>
			</div>
		</div>
		<div class="materialCardAction materialThemeLightGold" style=" text-align: center;">
			<span style=" display: block; margin: 0 auto; color: grey;">One-time Payment</span>
		</div>
	</div>
</div>


</div>


 <!-- As part of your monthly or yearly subscription, you will receive Melody Coins each period. These Melody coins, if not utilized within the current period, can be carried over and used in subsequent periods as long as your subscription remains active. This feature allows you the flexibility to use your Melody coins according to your own schedule and convenience, ensuring that you get the full value of your subscription. Please note, however, that if your subscription is canceled or lapses, any unused Melody coins will expire and will not be redeemable in future periods. If you opt for the lifetime access option, you will not receive Melody Coins. Instead, we will instantly unlock all of the current pieces of The Ultimate Collection of Piano Music for you. This offer provides immediate and permanent access to our extensive collection, ensuring that you have a wealth of piano music at your fingertips.
-->

<p class="materialParagraph materialThemeDark" style=" font-size: 14px; line-height: 14px; font-style: italic; padding: 20px; background: #3700009e; margin: auto 30px;">
You may cancel at any time. Your subscription will continue until you cancel. Cancellation takes effect at the end of your current billing period. Taxes may apply. All fees are non-refundable. We reserve the right to modify or discontinue our services (or any part thereof) with or without notice. Offer terms are subject to change.</p>
							
						</div>
					</div>
				</div>
			</div>
	</div>`;
	materialDialog.custom(dialogHtml, settings);
}

					
app.callback = function(callbackDataAsUrl, trackOnServer = true){
	//Add mobile data
	callbackDataAsUrl += "&isMobile=" + (isMobile()? "y":"n");

	console.log("app.callback", callbackDataAsUrl);
	if(trackOnServer){ HydraSystem.track(callbackDataAsUrl); }
	
	/*
	Possible callbacks: 
	app.callback("path=" + app.currentRoute + "&unlock=clicked");
	app.callback('path=' + app.currentRoute + '&level='+app.data.user.profile.pianoLevel); 
	app.callback('path=' + app.currentRoute + '&rating='+thisLesson().rating); 
	app.callback('path=' + app.currentRoute + '&testimonial=positive'); 
	app.callback('path=' + app.currentRoute + '&testimonial=negative'); 
	app.callback('path=' + app.currentRoute + '&interests='+app.data.user.profile.interests.toString()); 
	app.callback('path=' + app.currentRoute + '&genres='+app.data.user.profile.genres.toString()); 
	app.callback("path=" + app.currentRoute + "&rewardlevel="+ newRewardLevelDisplay + "L");
	app.callback("path=" + app.currentRoute + "&rewardpoints="+ Math.round(app.data.user.profile.rewardPoints/100)*100 + "p");
	app.callback("path=" + app.currentRoute + "&announcement=shown&origin=" + "${announcementOrigin}");
	app.callback("path=" + app.currentRoute + "&announcement=read&origin=" + "${announcementOrigin}");
	app.callback("path=" + app.currentRoute + "&pageview=y"); //on every page view
	app.callback("path=" + app.currentRoute + "&pageview=y&onload=y"); //on load
	app.callback("path=" + app.currentRoute + "&progress=100");
	app.callback("path=" + app.currentRoute + "&progress=75");
	app.callback("path=" + app.currentRoute + "&progress=50");
	app.callback("path=" + app.currentRoute + "&progress=25");
	app.callback("path=" + app.currentRoute + "&comingsoon=y");
	app.callback("path=" + app.currentRoute + "&expired=y") 
	app.callback("path=" + app.currentRoute + "&book=y&action=" + action + "&progressMax=" + progressMax + "&progress=" + progressReal + "&bookCurrentPage=" + currentPage + "&bookTotalPages=" + numberOfPages + "&engagementTime=" + engagementTime, false);
		book actions: loaded, page-change, print, download, open-toolbar-menu, open-contextual-menu
	app.callback("timer=global&rewardPointsGained=' + (app.session.rewardPointsGained) + '&timeElapsed=' + (app.session.timeElapsed) + '&pageViews=' + (app.session.pageViews)
	app.callback("exitintent": "=y")
	
	//Additional variables:
	app.session = {};
	app.session.pageViews = 0;
	app.session.timeElapsed = 0;
	app.session.rewardPointsGained = 0;  
	*/
	/*Example triggers behavior:
	triggers = [
		{ 
			//@explanation: if((color=='red') OR (path=='/lesson/1001' AND progress==100))
			"conditions":[ // 
				{"color": "red"},
				{"path": "/lesson/1001","progress": "100"}
			],
			"action":"if(app.data.user.profile.membershipType){doSomething5()}"
		},
		{
			//@explanation: if(color=='red')
			"conditions":[
				{"color": "blue"}
			],
			"action":"if(app.data.user.profile.membershipType){doSomething5()}"
		},
		{
			//@explanation: if(path=='/lesson/2005' OR path=='/lesson/1005')
			"conditions":[
				{"path": "/lesson/2005"},
				{"path": "/lesson/1005"}
			],
			"action":"doSomething3()"
		},
		{
			//@explanation: if(color=='red' OR (path=='/lesson/1001' AND progress=='100' AND color=='blue'))
			"conditions":[
				{"color": "red"},
				{"path": "/lesson/1001","progress": "100", "color": "blue"}
			],
			"action":"if(app.data.user.profile.membershipType){doSomething5()}"
		}
	];*/
	//Posible actions:
	//app.showCustomDialog(true)
	//app.showAnnoucementDialog(true) 
	
	/*
	Extract parameters of tracker in an associative array.
	Example Result: 
	{
		"path": "/lesson/2001",
		"announcement": "read",
		"origin": "timer" 
	}
	*/
	function extractFromCallbackData(tracker){
		var result = {};
		var params = tracker.split("&");
		for(var i = 0; i < params.length; i++){
			var param = params[i].split("=");
			result[param[0]] = param[1];
		}
		return result;
	}
	
	var callbackData = extractFromCallbackData(callbackDataAsUrl);
	
	var defaultTriggers = [
		{
			"description": "Lesson Engagement",
			"enabled": true,
			"conditions":[
				{"progress": ">=95", "progress": "<=100"}
			],
			"action": `
				if(!app.session.customDialogTriggered){
					app.showCustomDialog(10*1000);
				}`
		},
		{
			"description": "Feedback Engagement",
			"enabled": true,
			"conditions":[
				{"rating": ">=4","rating":"<=5"},
				{"testimonial": "positive"}
			],
			"action": `
				if(!app.session.customDialogTriggered){
					app.showCustomDialog(10*1000);
				}`
		},
		{
			"description": "Book Viewer Engagement",
			"enabled": true,
			"conditions":[ 
				{"book": "y","action":"page-change", "bookCurrentPage":">2"},
				{"book": "y","action":"print"},
				{"book": "y","action":"open-contextual-menu"},
			],
			"action": `
				if(!app.session.customDialogTriggered){
					app.showCustomDialog(60000);
				}`
		},
		{
			"description": "Book Viewer Engagement",
			"enabled": false,
			"conditions":[  
				{"book": "y","action":"open-toolbar-menu"},
				
			],
			"action": `
				if(!app.session.customDialogTriggered){
					if(isMobile()){
						if(app.onlyOnceEvery({id:"trigger5", hours: 4, mode: "cookie"})){
							app.showCustomDialog(600);
						}
					}else{
						app.showCustomDialog(2000);
					}
				}`
		},
		{
			"description": "Book Viewer Engagement",
			"enabled": false,
			"conditions":[ 
				{"book": "y","action":"download"},
				{"book": "y","action":"print"},
			],
			"action": `
				if(!app.session.customDialogTriggered){
					app.showCustomDialog(600);
				}`
		},
		{
			"description": "App Engagement",
			"enabled": false,
			"conditions":[
				{"timer": "global", "rewardPointsGained": ">100", "timeElapsed": ">60000", "pageViews": ">5"}
			],
			"action": `
				if(!app.session.customDialogTriggered){
					app.showCustomDialog(10*1000);
				}`
		},
		{
			"description": "App Engagement",
			"enabled": true,
			"conditions":[
				{"timer": "global", "rewardPointsGained": ">39"},
				{"timer": "global", "timeElapsed": ">120000"},
			],
			"action": `
				if(app.onlyOnceEvery({id:"trigger8", minutes: 4, mode: "session"})){
					if(app.data.offer.isDataAvailable()){
						materialAttentionButton.setCallback(function(){
							app.callback('path=' + app.currentRoute + '&attentionButton=clicked'); 
						})
						materialAttentionButton.show();
					}
				}
				`
		},
		{
			"description": "Attention Button Clicked",
			"enabled": true,
			"conditions":[
				{"attentionButton": "clicked"}
			],
			"action": ` 
				if(app.data.offer.isDataAvailable()){
					var url = "https://pianoencyclopedia.com/en/" + app.data.offer.general.availability.urlPathStartArray[0] + "/" + app.data.offer.general.availability.urlPathEnd + "/";
				}
				else{
					var url = "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/";
				}
				
				app.dialogs.exclusiveInvitation(url, {});
				materialAttentionButton.hide();
				`
		},
		{
			"description": "App Engagement",
			"enabled": false,
			"conditions":[
				{"pageview": "y"}
			],
			"action": `
				if(!app.session.customDialogTriggered){
					if(app.session.pageViews >5){
						setTimeout(function(){app.showCustomDialog()}, 15000);
					}
				}`
		},
		{
			"description": "Exit Intent",
			"enabled": true,
			"conditions":[
				{"exitintent": "y"}
			],
			"action": `
				titleNotifier.add();
				
				/*if(app.session.pageViews >1 || app.session.timeElapsed > 20){
					if(!app.session.customDialogTriggered){
						app.showCustomDialog(0);
					}
				}else{ 
					if(!materialDialog.areDialogsOpen()){
							 
							if(app.onlyOnceEvery({id:"trigger10", minutes: 1, mode: "session"})){
								app.dialogs.unfinishedLessons({});
							}
							 
					} 
				}*/
				
				`
		} 
	];
	//TODO: an option to get triggers from app.data.user.... so we can have different triggers for every user
	var triggers = defaultTriggers;
	 
	
	function extractFromCallbackData(tracker){
		var result = {};
		var params = tracker.split("&");
		for(var i = 0; i < params.length; i++){
			var param = params[i].split("=");
			result[param[0]] = param[1];
		}
		return result;
	};
 
	var callbackData = extractFromCallbackData(callbackDataAsUrl); 
	/*
	var callbackData = {
			"path": "/lesson/1001",
			"progress": "100",
			"announcement": "read",
			"origin": "timer",
			"color": "blue"
	}
	*/
 
	//Evaluate if trigger is true or not
	function evaluateTrigger(trigger, callbackData){
		if(trigger.enabled != true){
			return false;
		}
		var results = [];
		for(var i = 0; i < trigger.conditions.length; i++){
			var condition = trigger.conditions[i];
			//console.log("--------------Condition--------------", condition)
			var subresult = true;
			for(var key in condition){
				//console.log(key, condition[key], callbackData[key]);
				/*if((!callbackData[key]) || (condition[key] != callbackData[key])){
					subresult = false;
					break;
				}*/
				
				var re = /^([<>=!]+)?(.+?)$/; 
				var matches = re.exec(condition[key]);
				if(!matches){
					console.log("Wrong operator on condition", condition[key]);
					return false;
				}
				
				var conditionOperator = matches[1] || "=="; //If undefined use equal
				var conditionValue 	  = matches[2];
				
				var comparisonResult = false;
				switch(conditionOperator){
					case "<":
						comparisonResult = (callbackData[key] < conditionValue);
						break;
					case ">":
						comparisonResult = (callbackData[key] > conditionValue);
						break;
					case "<=":
						comparisonResult = (callbackData[key] <= conditionValue);
						break;
					case ">=":
						comparisonResult = (callbackData[key] >= conditionValue);
						break;
					case "=": 
					case "==":
						comparisonResult = (callbackData[key] == conditionValue);
						break;
					case "!=":
						comparisonResult = (callbackData[key] != conditionValue);
						break;
					default:
						comparisonResult = false;
				}
				
				//console.log("XXX",trigger,  key, callbackData[key], conditionOperator, conditionValue, comparisonResult);
				if((callbackData[key]) && (comparisonResult)){ 
				}else{
					subresult = false;
					break;
				}
				//console.log("AND--")
			}
			results.push(subresult)
			//console.log("--------------OR--------------")
		}
		 
		var result = false;
		for (var j = 0; j < results.length; j++) {
		  if (results[j]) {
			result = true;
			break;
		  }
		}
		return result;
	}


	//Evaluate all triggers
	//DEBUG MODE: Add "?debug=yes" to the url to turn on debug mode and execute all js at once to check for errors. Must do this before launching any campaign or making changes
	function evaluateTriggers(triggers, callbackData){
		for(var key in triggers){
			var trigger = triggers[key];
			
			var debugMode = app.getQueryParameter("debug");
			
			if(debugMode !=="yes"){
				var result = evaluateTrigger(trigger, callbackData);
				if(result){
					console.log("Triggered: ", callbackData, triggers, trigger, trigger.action); 
					
					try { eval(trigger.action) } 
					catch (err) {
						var message = err.message;
						if (err instanceof SyntaxError){
						  message = "Syntax Error: " +err.message+ ". Code: "+ trigger.action;
						}
						console.log(message);
						HydraSystem.track(callbackDataAsUrl + "&error=y&code="+trigger.action);
					} 
				}
			}
			else{
				//On debug mode, run all triggers at the same time to check for js errors.
				console.log("Debugging Trigger: ", trigger, trigger.action); 
				try { 
					eval(trigger.action); 
				} 
				catch (err) {
					var message = err.message;
					if (err instanceof SyntaxError){
					  message = "Syntax Error: " +err.message+ ". Code: "+ trigger.action;
					}
					console.log(message);
					HydraSystem.track(callbackDataAsUrl + "&error=y&code="+trigger.action);
				} 
			}
		}
	}

	evaluateTriggers(triggers, callbackData);
}
/* Must match PHP keys on HydraAppGeneric.class.php */
app.uncompressedKeys = ['"visible"','"deadlineDateString"','"availableDateString"','"engagementProgressArrayDetails"','"engagementProgressMaxPercent"','"engagementProgressRealPercent"','"engagementTime"','"accessFirstDate"','"accessLastDate"','"accessCount"','"engagementFirstDate"','"engagementLastDate"','"reached25Once"','"reached50Once"','"reached75Once"','"reached100Once"'];
app.compressedKeys   = ['"v"','"dD"','"aD"','"eA"','"eM"','"eP"','"eT"','"aF"','"aL"','"aC"','"eF"','"eL"','"r2"','"r5"','"r7"','"rT"'];

app.compressJSON = function(JsonString){ 
	return replaceOnce(JsonString, app.uncompressedKeys, app.compressedKeys, "g");
}

app.uncompressJSON = function(JsonString){
	 return replaceOnce(JsonString, app.compressedKeys, app.uncompressedKeys, "g");
}
 
 /* Store interval timers that are currently running */
app.intervalTimers = [];
app.timeoutTimers = [];

// Run a global check timer every X ms
app.intervalTimerGlobal = setInterval(function(){ 
		
	//Exit if user is not logged in.
	if(!(app.data && app.data.user &&  app.data.user.profile &&  app.data.user.profile.email)){
		return false;
	}
	
	if(!app.session.__specialPromotionDialogLastShownDate){
		app.session.__specialPromotionDialogLastShownDate  = false;
	}
	
	if(!app.session.__rewardPointsGainedLastSpecialPromotionDialog){
		app.session.__rewardPointsGainedLastSpecialPromotionDialog  = 0;
	}
		
	var updateTimeElapsed = function(){
		if(!app.session.__startDate){
			app.session.__startDate  = new Date();
		}
		
		var endDate = new Date();
		var startDate = app.session.__startDate;
		app.session.timeElapsed = endDate.getTime() - startDate.getTime(); 
	}();
	
	var updateRewardPointsGained = function(){
		if(app.data.user.profile.rewardPoints){
			if(!app.session.__startRewardPoints){
				app.session.__startRewardPoints  = app.data.user.profile.rewardPoints;
			}
		}
		
		var endRewardPoints = app.data.user.profile.rewardPoints;
		var startRewardPoints = app.session.__startRewardPoints;
		
		app.session.rewardPointsGained = endRewardPoints - startRewardPoints;  
	}();
	
	var conditionToShowDialog = function(){
		 
		//var conditionRewardPoints = app.session.rewardPointsGained >= 100;
		var conditionTimeElapsedSession = app.session.timeElapsed >= 8 * 1000;
		var conditionDialogNeverShownBefore = app.session.__specialPromotionDialogLastShownDate === false;
		if(!conditionDialogNeverShownBefore){
			var conditionTimeElapsedLastSpecialPromotionDialog = moment(new Date()).diff(moment(app.session.__specialPromotionDialogLastShownDate), 'minutes') >= 5; 
		}
		else{
			var conditionTimeElapsedLastSpecialPromotionDialog = false;
		}
			
		var conditionNewRewardPointsSinceLastSpecialPromotionDialog = ((app.session.rewardPointsGained - app.session.__rewardPointsGainedLastSpecialPromotionDialog) >= 20);
		
		/* Show the first time after 8 seconds, the second time show if any action was done (+20 reward points), and at least 5 minutes have passed. If these two criteria apply, keep showing */
		
		return (conditionTimeElapsedSession && (conditionDialogNeverShownBefore || conditionTimeElapsedLastSpecialPromotionDialog) && conditionNewRewardPointsSinceLastSpecialPromotionDialog);
		
	}

	//Show custom dialog if conditions met
	if(conditionToShowDialog()){
	    console.log("Show Promotion Dialog");
		//app.showSpecialPromotionDialog();
		app.session.__specialPromotionDialogLastShownDate  = new Date();
		app.session.__rewardPointsGainedLastSpecialPromotionDialog = app.session.rewardPointsGained;
	}
	
	app.callback('timer=global&rewardPointsGained=' + (app.session.rewardPointsGained) + '&timeElapsed=' + (app.session.timeElapsed) + '&pageViews=' + (app.session.pageViews), false); 
	//console.log("Run global timer", app.session);
	
}, 5000);


/**
* @type: private function
* @purpose: Will clear all setIntervals and setTimeouts. Called automatically on every new page generation.
**/
app.stopTimers = function(){
		/* Stop previous INTERVAL timers and reset the array */
		var intervalTimersLength = app.intervalTimers ? app.intervalTimers.length: 0;
		for (var i=0; i<intervalTimersLength; i++) {
			clearInterval(app.intervalTimers[i]); 
		}
		app.intervalTimers = [];

		/* Stop previous TIMEOUT timers and reset the array */
		var timeoutTimersLength = app.timeoutTimers ? app.timeoutTimers.length: 0;
		for (var i=0; i<timeoutTimersLength; i++) {
			clearInterval(app.timeoutTimers[i]); 
		}
		app.timeoutTimers = []; 
}



/**
* @type: public function
* @purpose: Instead of using setInterval, use this wrapper. On every new page load all setIntervals will be cleared automatically if you use this function
* @param callable fx: function
* @param int timeInMs: time for setInterval
**/
app.runTimer = function(fx, timeInMs){
	var intervalTimer = setInterval(fx, timeInMs);

	//Store interval timer so we can stop it after loading a new page
	app.intervalTimers.push(intervalTimer);

	return intervalTimer;
}

app.clearTimer = function(fx) {
	fx = clearInterval(fx);
	return fx;
}

/**
* @type: public function
* @purpose: Instead of using setTimeout, use this wrapper. On every new page load all setTimeouts will be cleared automatically if you use this function
* @param callable fx: function
* @param int timeInMs: time for setInterval
**/
app.runTimeout = function(fx, timeInMs){
	var timeoutTimer = setTimeout(fx, timeInMs);

	//Store timeout timer so we can stop it after loading a new page
	app.timeoutTimers.push(timeoutTimer);
}

/**
* @type: private function
* @purpose: Will clear all page specific variables and events. Called automatically on every new page generation.
**/
app.resetPageVariablesAndBindedEvents = function(){
	if(typeof thisLessonId !== "undefined") { thisLessonId = null; }
	if(typeof thisLesson !== "undefined")   { thisLesson = null; }
	if(typeof ebookStats !== "undefined")   { ebookStats = null; }
	if(typeof videoStats !== "undefined")   { videoStats = null; }
	if(typeof articleStats !== "undefined") { articleStats = null; }
	
	//Stop any binded event of reading progres
	trackReadProgressStop();
	
	//Stop and reset all timers
	app.stopTimers(); 
	
	//Disable events from infinite scrolling dashboard (will be skipped if not loaded)
	dashboardInfiniteScrolling.unload();
	
	material.init();
}

/**
* @type: public function
* @purpose: Gets next lesson from course, given current lesson id as input. If no more lessons are left on this course, it returns false. 
* @param int currentLessonId
**/
app.getNextLessonFromCourse = function(currentLessonId){ 
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
	
	return nextLessonId;		
}



app.getCurrentRewardLevel = function(){
	var currentRewardPoints = app.data.user.profile.rewardPoints || 0;
	var rewardAwards = app.data.rewards;
	var currentRewardLevel = 0;
	if(rewardAwards){
		for (var i = 0; i < rewardAwards.levels.length; i++) {
			if (currentRewardPoints >= rewardAwards.levels[i].rewardPoints) {
				currentRewardLevel = i;
			}
		}
	}
	return currentRewardLevel;
};

/**
* @type: public function
* @purpose: Updates points, date, and shows snackbar.
* @param string  snackBarText: text to show
* @param int rewardPointsToAdd: points to add.
**/
app.addRewardPoints = function(snackBarText, rewardPointsToAdd){
	
	var oldRewardLevel = app.getCurrentRewardLevel();
	
	app.data.user.profile.rewardPointsDate = datetimeToEST(new Date());	
	app.data.user.profile.rewardPoints = app.data.user.profile.rewardPoints || 10;	
	app.data.user.profile.rewardPoints += rewardPointsToAdd;
	 
	var newRewardLevel = app.getCurrentRewardLevel(); 
	
	
	//User advanced to next Rewards Level
	if(newRewardLevel > oldRewardLevel){
		var newRewardLevelDisplay = newRewardLevel + 1; //Index based 1
		//Track reward level
		app.callback("path=" + app.currentRoute + "&rewardlevel="+ newRewardLevelDisplay + "L");
		materialSnackBar.push(`Congratulations! You've unlocked Rewards Level ${newRewardLevelDisplay}`);
	}
	 
	var createHistogramOfRewardPoints = function(){ 

        app.data.user.profile.rewardPointsHistogram = app.data.user.profile.rewardPointsHistogram || {};
		var rewardPointsHistogram = app.data.user.profile.rewardPointsHistogram;  
 
        var dayCounter = rewardPointsHistogram["counter"] || 0; 

        var today 		  = dateToSQL(new Date());	
        var dateOnCounter = rewardPointsHistogram["date." + dayCounter + ""] || null;

        /* If date is undefined, it's the first time, set date to today, and total sum to score */
        if(!dateOnCounter) {
            rewardPointsHistogram["date." + dayCounter + ""] = today;
            rewardPointsHistogram["sum."  + dayCounter + ""] = rewardPointsToAdd;
        }
        else if(dateOnCounter === today){
            /* If stored date is today, then it's not the first time. Update the counter only */
            var sum =  rewardPointsHistogram["sum." + dayCounter + ""] || 0;
            rewardPointsHistogram["sum." + dayCounter + ""]  = sum + rewardPointsToAdd;
        }
        else{
            /* If stored date is not today, then it's a new day. */

			var frequencyTrackingMaximumNumberOfDays = 365*5; // 5 years
			
            dayCounter++;
            if(dayCounter >=(frequencyTrackingMaximumNumberOfDays)){
                dayCounter =0;
            }

            //Update day counter, date, and set sum to score

            rewardPointsHistogram["counter"] = dayCounter;
            rewardPointsHistogram["sum." + dayCounter + ""]  = rewardPointsToAdd;
            rewardPointsHistogram["date." + dayCounter + ""] = today; 
        }  
    }();  
	
	//Track reward points to the nearest hundreds
	app.callback("path=" + app.currentRoute + "&rewardpoints="+ Math.round(app.data.user.profile.rewardPoints/100)*100 + "p");
	
	/* Only show snackbar if not empty */
	if(snackBarText){
		materialSnackBar.push(`${snackBarText}. You've gained ${rewardPointsToAdd} additional Reward Points`);
	}
}

app.fetchRemoteData = function(callback){
	$.ajax({  
		dataType: "text", //To avoid parsing of JSON
		url: config.serverUrl, 
		cache: false, 
		type: "POST",
		crossDomain: true,
		headers: {
			"accept": "application/json"
		},
		data: {
			"url": window.location.href,
            "referrer": document.referrer,
			"action": "get",
			"hs_uid": (localStorage.getItem('hs_uid') || ""), 
			"hs_uidh": (localStorage.getItem('hs_uidh') || ""),
			"appName": config.appName
		} 
	 })
	 .done(function(data) { 

		try{
            //Uncompress the data keys
            data = JSON.parse(app.uncompressJSON(data));
        }catch(e){
            console.error(e);
            data = {
                "error": "parsing-json"
            }
        }

		if(app.returnedError(data)){return false};		

		var lessonId = false;
		app.refresh(lessonId, data);
		if(typeof callback === "function") {callback();};
	 })
	 .fail(function(XMLHttpRequest, textStatus, errorThrown) {
        // console.log('Error Getting status for parameters: - Error:' + errorThrown);
		console.log(XMLHttpRequest + ' ' + textStatus + ' ' + errorThrown);
		materialDialog.alertNoInternetConnection();	 
	 });  
}

app.saveToServer = function(lessonId){
	if(typeof lessonId === "undefined"){lessonId = null;}
	
	//Check if global variable is defined and available.
	if(typeof thisLessonId !== "undefined"){lessonId = thisLessonId;} 
	 
	 //Recalculate all stats before sending data.
	app.data = app.__buildDataFromDataRaw(app.data); 
 
 	//Compress the data keys
	var dataToSend = app.compressJSON(JSON.stringify(app.data.user)); 
		
	$.ajax({  
		dataType: "text", //To avoid parsing of JSON
		url: config.serverUrl, 
		cache: false, 
		type: "POST",
		crossDomain: true,
		headers: {
			"accept": "application/json"
		},
		data: {
			"url": window.location.href,
            "referrer": document.referrer,
			"action": "set",
			"data": dataToSend,
			"hs_uid": (localStorage.getItem('hs_uid') || ""), 
			"hs_uidh": (localStorage.getItem('hs_uidh') || ""),
			"appName": config.appName
		} 
	 })
	 .done(function(data) {  
		//Uncompress the data keys
		try{
		    data = JSON.parse(app.uncompressJSON(data));
		}catch(e){
		    console.error(e);
		    data = {
		        "error": "parsing-json"
		    }
		}

		if(app.returnedError(data)){return false};
  
		if(!lessonId){
			app.refresh(null, data);  
		}else{ 
			//If we are in a lesson page, ensure that the lesson is 100% finished. Else, loading data will override actual data while user is watching, deleting user progress, and generating a bug.
			if(app.data.user.learning[lessonId] && app.data.user.learning[lessonId].engagementProgressRealPercent == 100){
				app.refresh(lessonId, data); 
			}
		}
	 })
	 .fail(function(XMLHttpRequest, textStatus, errorThrown) {
        console.log('Error Getting status for parameters: - Error:' + errorThrown); 
		//Fail silently.
	 });  
	console.log("Save data to server");
}

app.returnedError = function(data){
	if(data.error){
	
		var settings = {
			hideCallback: function(){
				location.reload();
			}
		}

		switch(data.error){
		case "user-lessons-json-empty":
			materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap  so we can fix this for you: ULJ-E100", settings);
			return true;
			break;
		case "user-lessons-json-invalid":
			materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap  so we can fix this for you: ULJ-I200", settings);
			return true;
			break;
		case "all-lessons-json-empty":
			materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap  so we can fix this for you: ALJ-E300", settings);
			return true;
			break;
		case "all-lessons-json-invalid":
			materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap  so we can fix this for you: ALJ-I400", settings);
			return true;
			break;
		case "invalid-user-id-hash-combination":
			//Sane as unknown user, ask to login again
		case "unknown-user-id":
			// materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap  so we can fix this for you: UN-U500", settings);
			materialDialog.show("dialogSignup", {
				modal: true,
				hideCallback: function(){}
			});
			
			return true;
			break; 
		default:
			materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap  so we can fix this for you: UN-X600", settings);
			return true;
			break; 	
		}
	}
	
	return false;
};


app.refresh = function(lessonId, dataFromServer){
	if(typeof dataFromServer === "undefined"){dataFromServer = false;}
	 
	var data = dataFromServer ? dataFromServer : app.data;
	 
	app.data = app.__buildDataFromDataRaw(data);  
	$('.action-cards-all').html(app.templates.modules.actionCards.content(app.data.user.cards)); 
	$('.action-cards-top').html(app.templates.modules.actionCards.content([], true)); 
	$('.action-cards-bottom').html(app.templates.modules.actionCards.content(app.data.user.cards, false)); material.init(); 
	
	if(lessonId) { 
		var chapterId = app.data.lesson[lessonId].parentChapter;
		var parentCourseId = app.data.chapter[chapterId].parentCourse;
		$("#page-lesson-outline").html(app.templates.modules.lessonsOutline.content(app.data, parentCourseId, lessonId));
	}
 
	material.init();
}


app.refeshBackButtonUrl = function(){
	var updateBackHref = function (hashHistory) {
		$(".materialBarDashboardBackBtn").attr("href", `#!${hashHistory[hashHistory.length - 2] || ""}`);
	}

	if (app.currentRoute.indexOf("/lesson/") > -1 && app.hashHistory.length === 0) {

		// get the lessonId from the app.currentRoute
		let lessonId = app.currentRoute.split("/lesson/")[1];

		console.log('lessonId', app.data.lesson[lessonId]);

		if (!app.data.lesson[lessonId]) {
			console.log('lessonId not found');
			return;
		}

		let parentChapter = app.data.lesson[lessonId].parentChapter;
		let parentCourse = app.data.chapter[parentChapter].parentCourse;
		app.hashHistory.push("/course/" + parentCourse);
		app.hashHistory.push(app.currentRoute);

		updateBackHref(app.hashHistory); // Update back button URL
	} else {
		if (app.hashHistory[app.hashHistory.length - 2] !== app.currentRoute) {
			app.hashHistory.push(app.currentRoute);
		} else {
			app.hashHistory.pop();
		}
		updateBackHref(app.hashHistory); // Update back button URL
	}
}

 
app.getLessonIdsFromCourse = function(courseId){ 
	var affectedLessons = [];
	var chapterIds = app.data.course[courseId].chapterIds || []; 
	
	chapterIds.forEach(function (chapterId) { 
		var lessonIds =  app.data.chapter[chapterId].lessonIds || []; 
		affectedLessons = affectedLessons.concat(lessonIds);
	}); 
	
	return affectedLessons;
};
		
app.__buildDataFromDataRaw = function(data){ 
  
		/* Transfer user data (from "user->learning") to lesson data (lesson)*/
		var transferFromUserLearningToLessonObject = function(){ 
			for (var lessonId in data.lesson) {
				data.lesson[lessonId].visible 			  = (data.user.learning[lessonId] && data.user.learning[lessonId].visible) ? data.user.learning[lessonId].visible : false;
				data.lesson[lessonId].availableDateString = (data.user.learning[lessonId] && data.user.learning[lessonId].availableDateString) ? data.user.learning[lessonId].availableDateString : false;
				data.lesson[lessonId].deadlineDateString  = (data.user.learning[lessonId] && data.user.learning[lessonId].deadlineDateString) ? data.user.learning[lessonId].deadlineDateString : false;
				data.lesson[lessonId].progress 			  = (data.user.learning[lessonId] && data.user.learning[lessonId].engagementProgressMaxPercent) ? data.user.learning[lessonId].engagementProgressMaxPercent : 0;
			}
		}();
	
		data.user.stats 		= data.user.stats || {};
		data.user.stats.lessons = data.user.stats.lessons || {};
		data.user.stats.profile = data.user.stats.profile || {};
		
		/* Remove invisible lessons so they don't count on progress stats nor are shown */				
		var removeInvisibleLessons = function(){ 
			for (var lessonId in data.lesson) {
			
				if(data.lesson[lessonId].visible === false){
					delete data.lesson[lessonId];
				} 
			}  
		}();
				
		var buildLessonsIds = function(){ 
			for (var lessonId in data.lesson) {
				data.lesson[lessonId].id = lessonId;
			}
		}();

		var buildChapterChildrenIds = function(){ 
			//Initialize
			for (var chapterId in data.chapter) {
				data.chapter[chapterId].lessonIds = [];
			}
			//Populate
			for (var lessonId in data.lesson) {
				var chapterId = data.lesson[lessonId].parentChapter;  
				if(data.chapter[chapterId]){
					data.chapter[chapterId].lessonIds = data.chapter[chapterId].lessonIds || [];
					data.chapter[chapterId].lessonIds.push(lessonId);
				}
				else{
					console.log("Invalid chapterId", chapterId);
					materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap so we can fix this for you: INV-CHAPTER-"+ chapterId, {
						hideCallback: function(){
							location.reload();
						}
					}); 
				}
			}
		}();

		var buildCourseChildrenIds = function(){ 
			//Initialize
			for (var courseId in data.course) {
				data.course[courseId].chapterIds = [];
			}
			//Populate
			for (var chapterId in data.chapter) {
				var courseId = data.chapter[chapterId].parentCourse;
				if(data.course[courseId]){
					data.course[courseId].chapterIds = data.course[courseId].chapterIds || [];
					data.course[courseId].chapterIds.push(chapterId);
				}
				else{
					console.log("Invalid courseId", courseId);
					materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap so we can fix this for you: INV-COURSE-"+ courseId, {
						hideCallback: function(){
							location.reload();
						}
					}); 
				}
				
			}
		}();
		 
		 
		 
		var calculateLessonsDates = function(){
			for (var lessonId in data.lesson) { 
				if(data.lesson[lessonId].deadlineDateString){			 
					var deadlineDate = new Date(data.lesson[lessonId].deadlineDateString);
					var deadlineDateTime = (deadlineDate.getTime());
	
					data.lesson[lessonId].deadlineDate =  deadlineDate;			
					data.lesson[lessonId].deadlineDateTime = deadlineDateTime; 	
				} 
				if(data.lesson[lessonId].availableDateString){			 
					var availableDate = new Date(data.lesson[lessonId].availableDateString);		
					var availableDateTime = (availableDate.getTime());
	
					data.lesson[lessonId].availableDate =  availableDate;			
					data.lesson[lessonId].availableDateTime = availableDateTime; 	
				} 
			}
		}();
		
		
	
		var calculateLessonsDateStatus = function(){
			for (var lessonId in data.lesson) { 
				if(data.lesson[lessonId].deadlineDateString){			
					var msToDeadline = data.lesson[lessonId].deadlineDateTime - Date.now();
					data.lesson[lessonId].expired =  (msToDeadline<=0)? true : false;
					data.lesson[lessonId].msToDeadline = msToDeadline;
					data.lesson[lessonId].daysToDeadline = (msToDeadline / 1000 / 60 / 60 / 24);
				}
				if(data.lesson[lessonId].availableDateString){				
					var msToAvailable = data.lesson[lessonId].availableDateTime - Date.now();
					data.lesson[lessonId].available =  (msToAvailable<=0)? true : false;
					data.lesson[lessonId].msToAvailable = msToAvailable;
					data.lesson[lessonId].daysToAvailable = (msToAvailable / 1000 / 60 / 60 / 24);			
				}
	
				/*
				* We need to consider all cases, which gives us six different possible status.
				* Date Status available (6):
				*
				* comingSoon: The available date is more than 15 days away, so we will not show the countdown, just show "coming soon"
				* comingAsap: The available date is less than 15 days away, we so we will show a precise countdown 
				* available: lesson is available and is not expiring
				* expiringAsap: the lesson is expiring in less than 15 days
				* expiringSoon: the lesson is expiring in more than 15 days
				* expired: the lesson has expired
				*/
				if(!data.lesson[lessonId].deadlineDateString && !data.lesson[lessonId].availableDateString){		
					data.lesson[lessonId].dateStatus = "available"; 
					continue; /* Stop checking: continue to next lesson */
				}	
				
				if(data.lesson[lessonId].availableDateString){		
					if(!data.lesson[lessonId].available){
						data.lesson[lessonId].dateStatus = (data.lesson[lessonId].daysToAvailable > 15) ? "comingSoon" : "comingAsap";
						continue; /* Stop checking: continue to next lesson */ 
					}
				}
				
				/* If we reached here, then the curren status is available, but it cuold get overriden with the deadline */						
				data.lesson[lessonId].dateStatus = "available";
						
				if(data.lesson[lessonId].deadlineDateString){		
					if(!data.lesson[lessonId].expired){
						data.lesson[lessonId].dateStatus = (data.lesson[lessonId].daysToDeadline > 15) ? "expiringSoon" : "expiringAsap";
						continue; /* Stop checking: continue to next lesson */ 
					}
					else{
						data.lesson[lessonId].dateStatus = "expired"; 
					}
				}
				 
			} 
		}();
		
		var calculateEarliestAvailableDateTimes = function() {
			for (var courseId in data.course) {
				data.course[courseId].earliestAvailableDateTime = false;
				var chapterIds = data.course[courseId].chapterIds || []; 	
				var chapterIdsLength = chapterIds.length;
				for (var i = 0; i < chapterIdsLength; i++){
					var chapterId = chapterIds[i]; 
					var lessonIds = data.chapter[chapterId].lessonIds || [];
					var lessonIdsLength = lessonIds.length;
					for (var j = 0; j < lessonIdsLength; j++){
						var lessonId = lessonIds[j]; 
						
						if(data.lesson[lessonId].availableDateString){ 
							if( (!["comingSoon", "comingAsap"].includes(data.lesson[lessonId].dateStatus)) && (data.course[courseId].earliestAvailableDateTime === false)){
								data.course[courseId].earliestAvailableDateString = data.lesson[lessonId].availableDateString; 
								data.course[courseId].earliestAvailableDateTime   = data.lesson[lessonId].availableDateTime; 
								data.course[courseId].earliestAvailableDate       = data.lesson[lessonId].availableDate; 
								data.user.stats.lessons.newestLessonId = lessonId;
							}
							else{
								if( (!["comingSoon", "comingAsap"].includes(data.lesson[lessonId].dateStatus)) && (data.lesson[lessonId].availableDateTime < data.course[courseId].earliestAvailableDateTime)){
									data.course[courseId].earliestAvailableDateString = data.lesson[lessonId].availableDateString;
									data.course[courseId].earliestAvailableDateTime   = data.lesson[lessonId].availableDateTime; 
									data.course[courseId].earliestAvailableDate       = data.lesson[lessonId].availableDate; 
									data.user.stats.lessons.newestLessonId = lessonId;
								}
							}
						}
					}	
				} 
			}
		}();

		var calculateEarliestDeadlineDateTimes = function() {
			for (var courseId in data.course) {
				data.course[courseId].earliestDeadlineDateTime = false;
				var chapterIds = data.course[courseId].chapterIds || []; 	
				var chapterIdsLength = chapterIds.length;
				for (var i = 0; i < chapterIdsLength; i++){
					var chapterId = chapterIds[i]; 
					var lessonIds = data.chapter[chapterId].lessonIds || [];
					var lessonIdsLength = lessonIds.length;
					for (var j = 0; j < lessonIdsLength; j++){
						var lessonId = lessonIds[j]; 
						
						if(data.lesson[lessonId].deadlineDateString){  
							if( (!["expired"].includes(data.lesson[lessonId].dateStatus)) && data.course[courseId].earliestDeadlineDateTime === false){
								data.course[courseId].earliestDeadlineDateString = data.lesson[lessonId].deadlineDateString; 
								data.course[courseId].earliestDeadlineDateTime   = data.lesson[lessonId].deadlineDateTime; 
								data.course[courseId].earliestDeadlineDate       = data.lesson[lessonId].deadlineDate; 
								data.user.stats.lessons.expiringLessonId = lessonId;
							}
							else{
								if( (!["expired"].includes(data.lesson[lessonId].dateStatus)) && data.lesson[lessonId].deadlineDateTime < data.course[courseId].earliestDeadlineDateTime){
									data.course[courseId].earliestDeadlineDateString = data.lesson[lessonId].deadlineDateString; 
									data.course[courseId].earliestDeadlineDateTime   = data.lesson[lessonId].deadlineDateTime; 
									data.course[courseId].earliestDeadlineDate       = data.lesson[lessonId].deadlineDate; 
									data.user.stats.lessons.expiringLessonId = lessonId;
								}
							}
						}
					}	
				} 
			}
		}();


		var calculateLessonsProgressStatus = function(){
			for (var lessonId in data.lesson) {  
	
				/* 
				* Progress Status available (3):
				*
				* new: progress is < 6
				* inProgress: progress is >= 6 and < 94. 
				* completed: progress >= 94
				*/
				if(data.lesson[lessonId].progress < 6){
					data.lesson[lessonId].progressStatus = "new";
				}
				else{
					if(data.lesson[lessonId].progress < 94){
						data.lesson[lessonId].progressStatus = "inProgress";
					}
					else{
						data.lesson[lessonId].progressStatus = "completed";
					}
				} 
				 
			} 
		}();
		
		

		var sortLessonsByOrder = function(){
			for (var chapterId in data.chapter) {
				var lessonIds = data.chapter[chapterId].lessonIds || []; 
				if(lessonIds.length === 0) {continue};
				
				var tempLessonIds = [];
			
				var lessonIdsLength = lessonIds.length;
				for (var i = 0; i < lessonIdsLength; i++){
					var lessonId = lessonIds[i];
					tempLessonIds.push({lessonId: lessonId, order: data.lesson[lessonId].order});
				}
				
				tempLessonIds.sort(function(obj1, obj2) { 
					return obj1.order - obj2.order;
				});
			
				var sortedLessonIds = [];
				var tempLessonIdsLength = tempLessonIds.length;
				for (var i = 0; i < tempLessonIdsLength; i++){
					sortedLessonIds.push(tempLessonIds[i].lessonId);
				}
				
				data.chapter[chapterId].lessonIds = sortedLessonIds;
			}
		}();


		var sortChaptersByOrder = function(){
			for (var courseId in data.course) {
				var chapterIds = data.course[courseId].chapterIds || []; 
				if(chapterIds.length === 0) {continue};
				
				var tempChapterIds = [];
			
				var chapterIdsLength = chapterIds.length;
				for (var i = 0; i < chapterIdsLength; i++){
					var chapterId = chapterIds[i];
					tempChapterIds.push({chapterId: chapterId, order: data.chapter[chapterId].order});
				}
				tempChapterIds.sort(function(obj1, obj2) { 
					return obj1.order - obj2.order;
				});
			
				var sortedChapterIds = [];
				var tempChapterIdsLength = tempChapterIds.length;
				for (var i = 0; i < tempChapterIdsLength; i++){
					sortedChapterIds.push(tempChapterIds[i].chapterId);
				}
				
				data.course[courseId].chapterIds = sortedChapterIds;
			}
		}();


		var clearChapterStats = function(){ 
			for (var chapterId in data.chapter) {
				data.chapter[chapterId].stats = {};   
			}
		}();
		
		var clearCourseStats = function(){ 
			for (var courseId in data.course) {  
				data.course[courseId].stats = {};   
			}
		}(); 
		
		var buildChapterStats = function(){ 
			for (var chapterId in data.chapter) {
				var lessonIds = data.chapter[chapterId].lessonIds || []; 
			 
				var complete = 0;
				var total = lessonIds.length;
				var sumOfProgress = 0;
				for (var i = 0; i < total; i++){
					var lessonId = lessonIds[i];
					if(data.lesson[lessonId].progressStatus === "completed"){
						complete++;
					}
					sumOfProgress += data.lesson[lessonId].progress;
				}
				
				var totalProgress = total? Math.round(sumOfProgress / total):0; 
 
				data.chapter[chapterId].stats = {};
				data.chapter[chapterId].stats.lessons = {
						complete: complete, 
						incomplete: total - complete,
						total: total,
						sumOfProgress: sumOfProgress,
						totalProgress: totalProgress
				};
			}
		}()


		var buildCourseStats = function(){ 
			for (var courseId in data.course) {
				var chapterIds = data.course[courseId].chapterIds || []; 
			
				var complete = 0;
				var incomplete = 0;
				var total = 0;
				var sumOfProgress = 0;
				var chapterIdsLength = chapterIds.length;
				for (var i = 0; i < chapterIdsLength; i++){
					var chapterId = chapterIds[i];
					complete += data.chapter[chapterId].stats.lessons.complete;
					incomplete += data.chapter[chapterId].stats.lessons.incomplete;
					total += data.chapter[chapterId].stats.lessons.total;
					sumOfProgress += data.chapter[chapterId].stats.lessons.sumOfProgress;
				}
				
				var totalProgress = total? Math.round(sumOfProgress / total):0;
				 
				data.course[courseId].stats = {};
				data.course[courseId].stats.lessons = {
						complete: complete,
						incomplete: incomplete,
						total: total,
						sumOfProgress: sumOfProgress,
						totalProgress: totalProgress
				}; 
	 
			}
		}()
 
		/* Do not delete this function. This internal function uses "data". The global uses "app.data" */
		var getLessonIdsFromCourse = function(courseId){ 
			var affectedLessons = [];
			var chapterIds = data.course[courseId].chapterIds || []; 
			
			chapterIds.forEach(function (chapterId) { 
				var lessonIds =  data.chapter[chapterId].lessonIds || []; 
				affectedLessons = affectedLessons.concat(lessonIds);
			}); 
			
			return affectedLessons;
		};

		var buildCourseDateStatus = function(){ 
			for (var courseId in data.course) {
				 var lessonIds = getLessonIdsFromCourse(courseId);
				 
				 var msToDeadlines = [];
				 var msToAvailables = [];
				 
				 
				 // Si ninguna esta available, usar la PRIMERA fecha de "coming soon"
				 //IF Chequear todas las lecciones de un curso. Si hay por lo menos una "expiring", el curso esta "expiring" con la fecha mas proxima.
				 //ELSE IF Chequear todas las lecciones de un curso. Si hay por lo menos una "available", el curso esta "available".

 
 
				//Default value is expired
				data.course[courseId].dateStatus = "expired";

				lessonIds.forEach(function (lessonId) { 
				 
							//If there is just one lesson that is available, the whole course becomes available, if not expiringAsap or expiringSoon
							if(data.lesson[lessonId].dateStatus == "available"){
								if((data.course[courseId].dateStatus != "expiringSoon") && (data.course[courseId].dateStatus != "expiringAsap")){
									data.course[courseId].dateStatus = "available";
								}
							}
							
							//If there is just one lesson that is expiring, the whole course becomes expiring
							if((data.lesson[lessonId].dateStatus == "expiringAsap") || (data.lesson[lessonId].dateStatus == "expiringSoon")){
								if(data.course[courseId].msToDeadline){
									if(data.lesson[lessonId].msToDeadline < data.course[courseId].msToDeadline){
										data.course[courseId].msToDeadline = data.lesson[lessonId].msToDeadline;
										data.course[courseId].deadlineDateString = data.lesson[lessonId].deadlineDateString;
									};
								}
								else{
									data.course[courseId].msToDeadline = data.lesson[lessonId].msToDeadline;
									data.course[courseId].deadlineDateString = data.lesson[lessonId].deadlineDateString;
								}
								 
								if(data.lesson[lessonId].dateStatus == "expiringAsap"){
									data.course[courseId].dateStatus = "expiringAsap";
								}
								else if((data.lesson[lessonId].dateStatus == "expiringSoon") && (data.course[courseId].dateStatus != "expiringAsap")){
									data.course[courseId].dateStatus = "expiringSoon";
								}
								
							}; 
							
							//If course is "expired", and there is just one lesson comingSoon or comingAsap, we will use that value.
							if((data.lesson[lessonId].dateStatus == "comingAsap") || (data.lesson[lessonId].dateStatus == "comingSoon")){
								if(data.course[courseId].msToAvailable){
									if(data.lesson[lessonId].msToAvailable < data.course[courseId].msToAvailable){
										data.course[courseId].msToAvailable = data.lesson[lessonId].msToAvailable;
										data.course[courseId].availableDateString = data.lesson[lessonId].availableDateString;
									};
								}
								else{
									data.course[courseId].msToAvailable = data.lesson[lessonId].msToAvailable;
									data.course[courseId].availableDateString = data.lesson[lessonId].availableDateString;
								}

								 
								if(data.course[courseId].dateStatus == "expired"){
									if(data.lesson[lessonId].dateStatus == "comingAsap"){
										data.course[courseId].dateStatus = "comingAsap";
									}
									else if((data.lesson[lessonId].dateStatus == "comingSoon") && (data.course[courseId].dateStatus != "comingAsap")){
										data.course[courseId].dateStatus = "comingSoon";
									}
								}
								
							}; 
							 
							 
				});
				 
			}
		}()
 
 
		var buildUserStatsLessons = function(){ 
			var complete = 0;
			var incomplete = 0;
			var total = 0; 
				
			for (var courseId in data.course) { 
				complete += data.course[courseId].stats.lessons.complete;
				incomplete += data.course[courseId].stats.lessons.incomplete;
				total += data.course[courseId].stats.lessons.total; 
			}
			
			data.user.stats.lessons.complete = complete;
			data.user.stats.lessons.incomplete = incomplete;
			data.user.stats.lessons.total = total; 
			
		}();

		var buildUserStatsProfile = function(){ 
			var complete =0;
			if(data.user.profile.pianoLevel) {complete++;}
			if(data.user.profile.genres) {complete += data.user.profile.genres.length;}
			if(data.user.profile.interests) {complete += data.user.profile.interests.length;}
			 
			var total = 7; //pianoLevel +  3 genres + 3 interests 7 // + name + email =  9
		 
			data.user.stats.profile.complete = complete;
			data.user.stats.profile.incomplete =  total - complete;
			data.user.stats.profile.total = total; 
					
		}();
		
		
		var calculateChaptersProgressStatus = function(){
			for (var chapterId in data.chapter) {  
	
				/* 
				* Progress Status available (3):
				*
				* new: progress is < 6
				* inProgress: progress is >= 6 and < 94. 
				* completed: progress >= 94
				*/
				if(data.chapter[chapterId].stats.lessons.totalProgress < 6){
					data.chapter[chapterId].progressStatus = "new";
				}
				else{
					if(data.chapter[chapterId].stats.lessons.totalProgress < 94){
						data.chapter[chapterId].progressStatus = "inProgress";
					}
					else{
						data.chapter[chapterId].progressStatus = "completed";
					}
				} 
				 
			} 
		}();
		
		var calculateCoursesProgressStatus = function(){
			for (var courseId in data.course) {  
	
				/* 
				* Progress Status available (3):
				*
				* new: progress is < 6
				* inProgress: progress is >= 6 and < 94. 
				* completed: progress >= 94
				*/
				if(data.course[courseId].stats.lessons.totalProgress < 6){
					data.course[courseId].progressStatus = "new";
				}
				else{
					if(data.course[courseId].stats.lessons.totalProgress < 94){
						data.course[courseId].progressStatus = "inProgress";
					}
					else{
						data.course[courseId].progressStatus = "completed";
					}
				} 
				 
			} 
		}();

 
		
		
		
		var calculateCourseExplorationByFilters = function(){
			var courseSorter = new CourseSorter(data);
			data.explore = courseSorter.sortCoursesByAllFilters();
		}();

		data.global =  {};  
		data.global.courses = {}; 
		
		data.global.courses.sortedNewestFirst = function(){
			var tempCoursesIds= [];
			
			for (var courseId in data.course) {
				tempCoursesIds.push({courseId: courseId, earliestAvailableDateTime: data.course[courseId].earliestAvailableDateTime});
			}
			tempCoursesIds.sort(function(obj1, obj2) { 
				return obj2.earliestAvailableDateTime - obj1.earliestAvailableDateTime;
			});
			
			var sortedCoursesIds = [];
			var tempCoursesIdsLength = tempCoursesIds.length;
			for (var i = 0; i < tempCoursesIdsLength; i++){
				sortedCoursesIds.push(tempCoursesIds[i].courseId);
			}
			 
			return sortedCoursesIds;
		}();


		data.global.courses.sortedExpiringFirst = function(){
			var tempCoursesIds= [];
			
			for (var courseId in data.course) {
				//TODO: what if course already expired. Don't include it in the sort. We need to do: expiring first (that has not expired) then newest first
				tempCoursesIds.push({courseId: courseId, earliestDeadlineDateTime: data.course[courseId].earliestDeadlineDateTime});
			}
			tempCoursesIds.sort(function(obj1, obj2) { 
				return obj1.earliestDeadlineDateTime - obj2.earliestDeadlineDateTime;
			});
			
			var sortedCoursesIds = [];
			var tempCoursesIdsLength = tempCoursesIds.length;
			for (var i = 0; i < tempCoursesIdsLength; i++){
				sortedCoursesIds.push(tempCoursesIds[i].courseId);
			}
			 
			return sortedCoursesIds;
		}();
		
		var prepareDataSpecialOffer = function(){ 
			
			data.offer = data.offer || {};
			data.offer.general = data.offer.general || {};
			data.offer.general.availability = data.offer.general.availability || {};
			data.offer.pages = data.offer.pages || {};
			
			data.offer.pages.comingSoon 	= data.offer.pages.comingSoon || {};
			data.offer.pages.specialOffer 	= data.offer.pages.specialOffer || {};
			data.offer.pages.expires 		= data.offer.pages.expires || {};
			
			data.offer.pages.comingSoon.apps 	= data.offer.pages.comingSoon.apps || {};
			data.offer.pages.specialOffer.apps 	= data.offer.pages.specialOffer.apps || {};
			data.offer.pages.expires.apps 		= data.offer.pages.expires.apps || {};
			 
			
			data.offer.isDataAvailable = function(){   
				
				if(!!(
					data.offer &&
					data.offer.general &&
					data.offer.general.availability &&
					data.offer.general.availability.expireDate &&
					data.offer.general.availability.startDate &&
					data.offer.general.availability.startTimezone &&
					data.offer.general.availability.expireTimezone &&
					data.offer.general.availability.urlPathStartArray &&
					data.offer.general.availability.urlPathStartArray[0] &&
					data.offer.general.availability.urlPathEnd &&
					data.offer.pages &&
					data.offer.pages.comingSoon &&
					data.offer.pages.specialOffer &&
					data.offer.pages.expires)){
					/*  &&
					data.offer.pages.comingSoon.apps &&
					data.offer.pages.specialOffer.apps &&
					data.offer.pages.expires.app*/
					 
					return true; 
				}else{
					console.log("Missing special offer data. Hide.");
					return false;
				}
			};
			
			data.offer.general.availability.status = function(){ 
				if(!data.offer.isDataAvailable()){ 
					return "hide"; 
				}
				
				var expireDate 	= data.offer.general.availability.expireDate;
				var startDate 	= data.offer.general.availability.startDate;
				var startTimezone 	= data.offer.general.availability.startTimezone;
				var expireTimezone 	= data.offer.general.availability.expireTimezone;
				
				var startDateObject 	= moment.tz(startDate, "YYYY-MM-DD HH:mm:ss", startTimezone);
				var expireDateObject 	= moment.tz(expireDate, "YYYY-MM-DD HH:mm:ss", expireTimezone);
				var nowDateObject 		= moment.tz(moment(), "YYYY-MM-DD HH:mm:ss", startTimezone);

				var expireExtensionHoursToAdd = data.offer.general.availability.expireExtensionHoursToAdd;
				var expireExtensionDateObject = moment.tz(expireDate, "YYYY-MM-DD HH:mm:ss", expireTimezone);

				for (var i = 0; i < expireExtensionHoursToAdd.length; i++) {
					expireExtensionDateObject.add(expireExtensionHoursToAdd[i], 'hours');
				}
				
				//Wait 3 days before hiding
				var expireExtensionHideDateObject = expireExtensionDateObject.clone().add(3, 'days');
				
				var startDateCompare = nowDateObject.isAfter(startDateObject); 
				var expireExtensionDateCompare = nowDateObject.isAfter(expireExtensionDateObject);
				var expireExtensionHideDateCompare = nowDateObject.isAfter(expireExtensionHideDateObject);

				if (expireExtensionHideDateCompare) {
					return "hide"; 
				} else if (expireExtensionDateCompare) {
					return "expired";
				} else if (startDateCompare) {
					return "active";
				}  else {
					return "notStarted";
				}
			};
			
			data.offer.general.availability.nearestDeadlineDate = function(){
				var expireDate 	= data.offer.general.availability.expireDate;
				var expireTimezone 	= data.offer.general.availability.expireTimezone;
				var nearestDeadlineDateObject = moment.tz(expireDate, "YYYY-MM-DD HH:mm:ss", expireTimezone); 
				var expireExtensionHoursToAdd = data.offer.general.availability.expireExtensionHoursToAdd;
				 
				for (var i = 0; i < expireExtensionHoursToAdd.length; i++) {
					nearestDeadlineDateObject.add(expireExtensionHoursToAdd[i], 'hours');
					if (nowDateObject.isBefore(nearestDeadlineDateObject)) {
						break;
					}
				}
				 
				return nearestDeadlineDateObject.format("YYYY-MM-DD HH:mm:ss"); 
			}
			
			data.offer.general.availability.countdownDateNow = function(){ 
				var startDate 		= data.offer.general.availability.startDate;
				var startTimezone 	= data.offer.general.availability.startTimezone;
				var expireTimezone 	= data.offer.general.availability.expireTimezone;
				
				switch(data.offer.general.availability.status()){
					case "notStarted":
						var dateCountDownObject = moment.tz(startDate, "YYYY-MM-DD HH:mm:ss", startTimezone);
						break;
					case "active": 
					case "expired":
					case "hide":
						var dateCountDownObject = moment.tz(data.offer.general.availability.nearestDeadlineDate(), "YYYY-MM-DD HH:mm:ss", expireTimezone);
						break;
				}
				
				return dateCountDownObject.format("YYYY-MM-DD HH:mm:ss"); 
			}
			
			data.offer.general.availability.countdownTimezoneNow = function(){ 
				var startTimezone 	= data.offer.general.availability.startTimezone;
				var expireTimezone 	= data.offer.general.availability.expireTimezone;
				
				switch(data.offer.general.availability.status()){
					case "notStarted":
						return startTimezone;
						break;
					case "active": 
					case "expired":
					case "hide":
						return expireTimezone;
						break;
				}
			}
			
			data.offer.pages.appDataNow = function(){ 
				if(!data.offer.isDataAvailable()){ 
					return false; 
				}
				
				switch(data.offer.general.availability.status()){
					case "notStarted":
						//TODO: return data.offer.pages.comingSoon.apps;
						break;
					case "active": 
						//TODO: return data.offer.pages.specialOffer.apps;
					case "expired":
					case "hide":
						//TODO: return data.offer.pages.expired.apps;
						break;
				}
			}
			
		}();
		
		var addCardSpecialOffer = function(){ 
			/* DATA STRUCTURE:  app.data.offer.pages.(comingSoon|specialOffer)
				"apps": {
					  "dialog": {
						"title":"Give the gift of music",
						"body": "Great opportunity",
						"button": "ACCESS NOW",
						"countdownText": "Ends Soon",
						"imageBackground": "JPOG",
						"imageCircle": "JPOG", 
						"msToShow": 10000 => hardcodear todos los conditions to show, para empezar
					  },
					  "card":{
						 "title":"Give the gift of music",
						"body": "Great opportunity",
						"button": "ACCESS NOW",
						"countdownText": "Ends Soon",
						"imageBackground": "JPOG",
						"imageCircle": "JPOG", 
					  }
				  },
			*/
			
			var availabilityStatus = data.offer.general.availability.status();
			if(availabilityStatus === "hide") { return false; }
				
			var appDataNow = data.offer.pages.appDataNow();
			if(!appDataNow){ return false; } 

			var cardTitle  = appDataNow.card.title; 
			var cardBody   = appDataNow.card.body; 
			var cardButton = appDataNow.card.button; 
		 
			var imageBackground   = appDataNow.card.imageBackground; 
			var imageCircle 	  = appDataNow.card.imageCircle; 
			var cardCountdownText = appDataNow.card.countdownText; 
		 
			var urlPathEnd 				  = appDataNow.offer.general.availability.urlPathEnd; 
			var expireExtensionHoursToAdd = appDataNow.offer.general.availability.expireExtensionHoursToAdd;
			 
			var countdownDateNow 	 = appDataNow.offer.general.availability.countdownDateNow();
			var countdownTimezoneNow = appDataNow.offer.general.availability.countdownTimezoneNow();
			
			//Only do an extension with the deadline date (never with the start date) 
			var extension = "";
			if(availabilityStatus !== "notStarted"){
				extension = 'data-extension="["'+ expireExtensionHoursToAdd.toString() +'"]"'; 
			}
			
			data.user.cards.push(	
				{
					"type": "circularDeadlineImage",
					"theme": "materialThemeDark",
					"colClass": "col-sm-12 col-xs-12",
					"header": cardTitle,
					"description": cardBody,
					"buttonText":  cardButton,
					"buttonClass": "materialButtonOutline",
					"progressValue": "0",
					"progressText": "Completed",
					"deadlineDatetime": countdownDateNow,
					"deadlineExtras": '" data-format="Y-m-d H:i:s" ' + extension + ' data-timezone="' + countdownTimezoneNow + '"',
					"size": "materialCardSizeMega",
					"deadlineText": cardCountdownText,
					"circularImage": imageCircle,
					"backgroundImage": "url("+imageBackground+") !important",
					"backgroundImagePosition": "center !important",
					"backgroundImageSize": "initial !important",
					"buttonDisabled": false,
					"buttonHref": "https://pianoencyclopedia.com/en/exclusive-invitation/"+ urlPathEnd +"/?ref=offer-card",
					"buttonTarget": "_blank",
					"buttonAction": ""
				}
			);  
		}();

		//Reward points start at 10
		data.user.profile.rewardPoints = data.user.profile.rewardPoints || 10;
		
		return  data;
}

/* Gets query parameter */
app.getQueryParameter = function (name, url)  {
    if(typeof url === "undefined"){ url = window.location.href; }
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/* 
Cleans query parameters of email tracking to avoid double tracking of email clicks
*/
app.cleanUpUrlEmailTracking = function(){
	var uri = window.location.toString();
	if (uri.indexOf("?") > 0) {  
		var re = /((?:hs_et|hs_es|hs_eth|hs_esh)=(?:.+?)[&])/; 
		var replacementpattern = "";
		var cleanUri = uri.replace(re, replacementpattern);
		window.history.replaceState({}, document.title, cleanUri); 
	}
} 

app.showSpecialPromotionDialog  = function(){ 

	var availabilityStatus = app.data.offer.general.availability.status();
	if(availabilityStatus === "hide") { return false; }
	
	var data = app.data.offer.pages.appDataNow();
	if(!data){ return false; } 

	
	//TODO: NO ES MUY IMPORTANTE. hacer que si el countdown expira por que comienza, o finaliza, que carguen los cards de nuevo! Y que el dialog haga refresh. Estamos listos para lanzar.

	/* DATA STRUCTURE:  app.data.offer.pages.(comingSoon|specialOffer)
		"apps": {
			  "dialog": {
				"title":"Give the gift of music",
				"body": "Great opportunity",
				"button": "ACCESS NOW",
				"countdownText": "Ends Soon",
				"imageBackground": "JPOG",
				"imageCircle": "JPOG", 
				"msToShow": 10000 => hardcodear todos los conditions to show, para empezar
			  },
			  "card":{
				 "title":"Give the gift of music",
				"body": "Great opportunity",
				"button": "ACCESS NOW",
				"countdownText": "Ends Soon",
				"imageBackground": "JPOG",
				"imageCircle": "JPOG", 
			  }
		  },
	*/
	
	var dialogTitle  		= data.dialog.title; 
	var dialogButton   		= data.dialog.body; 
	var dialogCountdownText = data.dialog.countdownText; 
	var dialogButton 		= data.dialog.button; 
 
	var imageBackground 	= data.dialog.imageBackground; 
	var imageCircle 		= data.dialog.imageCircle; 
	 
	 
	var expireExtensionHoursToAdd = app.data.offer.general.availability.expireExtensionHoursToAdd;
	var urlPathEnd = app.data.offer.general.availability.urlPathEnd; 
	
	var countdownDateNow = app.data.offer.general.availability.countdownDateNow();
	var countdownTimezoneNow = app.data.offer.general.availability.countdownTimezoneNow();
	
	//Only do an extension with the deadline date (never with the start date)
	var extension = ""; 
	if(availabilityStatus !== "notStarted"){
		extension = 'data-extension="["'+ expireExtensionHoursToAdd.toString() +'"]"';  
	} 
	
	 
	var html = `
		<div class="row">
			<div class="col-sm-12 col-xs-12" data-value="close" data-href-target="_blank" data-href="https://pianoencyclopedia.com/en/exclusive-invitation/${urlPathEnd}/?ref=offer-dialog">
					<div class="materialCard materialCardProgress materialThemeDark materialCardSizeMega" style="margin: 0; background-image: url(${imageBackground}) !important;   background-position: center !important;   background-size: initial !important; background-color: black;">
						 <div class="container-fluid">
							<div class="row">
								
								<div class="materialCardProgressLeft materialCardProgressLeftDouble">
									
									<div class="materialProgressCircle materialDeadlineCircle materialThemeDark">
										<span class="materialProgressCircle-left">
											<span class="materialProgressCircle-bar"></span>
										</span>
										<span class="materialProgressCircle-right">
											<span class="materialProgressCircle-bar"></span>
										</span>
										<div class="materialProgressCircle-value">
											<div>
												<span data-countdown="${countdownDateNow}" data-format="Y-m-d H:i:s" ${extension} data-timezone="${countdownTimezoneNow}"><span data-show-if-long-hours="" style="display: none;"><span data-days=""></span> Days</span><span data-hide-if-long-hours=""><span data-hours-total="">00</span>:<span data-minutes="">00</span>:<span data-seconds="">00</span></span></span><br>
												${dialogCountdownText}
											</div>
										</div>
									</div>-
									<br class="visible-xs visible-sm"><br class="visible-xs visible-sm"> 
									<div class="materialImageCircle materialThemeDark hidden-xs" style="background-image: url(${imageCircle}); ">  
									</div>
									
								</div> 
								<div class="materialCardProgressRight materialCardProgressRightDouble">
								  <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;">${dialogTitle}</h3>
									<p class="materialParagraph materialThemeDark">${dialogBody}</p>
									<a href="https://pianoencyclopedia.com/en/exclusive-invitation/${urlPathEnd}/?ref=dialog" target="_blank"  data-value="close" class="materialButtonFill materialThemeDark">${dialogButton}</a>
								</div> 
							</div>
						</div>
					</div> 
				</div>
		</div>`;
		
	material.history.clear();	
				 
	$('<div id="offerDialog" class="materialDialog" style="padding: 0;" data-on-init-callback="app.data.user.dialog.init(thisComponent)"></div>').appendTo('body');
	app.data.user.dialog.init = function(thisComponent) {
		thisComponent.html(html);		
	};
	materialDialog.show('offerDialog', {modal: (app.data.user.dialog.modal || false), hideCallback: function(){ 
		material.history.clear(); 
	}}); 
}

app.showCustomDialog = function(waitInMs){
	var success = "No user dialog data";
	if(app.data.user.dialog){
		//HARDCODE: modal, so no matter where the user clicks, it will open.
		 app.data.user.dialog.modal = false;
		
		// Do not show dialog if query contains ?overrideCustomDialog=yes 
		var overrideCustomDialog = app.getQueryParameter("overrideCustomDialog");
		if(overrideCustomDialog === "yes"){app.customDialogShown = true}
		  
		if(app.data.user.dialog && app.data.user.dialog.html){
			app.data.user.dialog.stats = app.data.user.dialog.stats || {};
			
			success = "Already triggered";
			
			if(!app.session.customDialogTriggered){ 
				app.session.customDialogTriggered = true;
  
				success = true;
				app.customDialogTimer = setTimeout(function(){    
					app.data.user.dialog.stats.lastShown = datetimeToEST(new Date()); 
					app.session.customDialogShown = true;
				
					//Wait until no dialogs are open to open a new dialog
					var OpenDialogFx = function(){
						material.history.clear();	 
						$('<div id="customDialog" class="materialDialog" style="padding: 0;" data-on-init-callback="app.data.user.dialog.init(thisComponent)"></div>').appendTo('body');
						app.data.user.dialog.init = function(thisComponent) {
							thisComponent.html(app.data.user.dialog.html);	
						};
						materialDialog.show('customDialog', {modal: (app.data.user.dialog.modal || false), hideCallback: function(){ 
							material.history.clear();  
						}}); 
					};
					
					var conditionFx = function(){
						return (!materialDialog.areDialogsOpen());
					};
					
					app.debounce(OpenDialogFx, conditionFx, 5000);
					
				}, waitInMs);
			}
			
	 	}
	}
	
	return success;
	
};

app.showAnnoucementDialog = function(openNow){ 
	
	app.customAnnouncementRead = false;
	
	var Template = function(text, input) {
		var output = text;
		for (var key in input) {
			output = output.replace(new RegExp("\\[" + key + "\\]", "g"), input[key]);
		}
		return output;
	};
	 
 
	//app.x = app.x || {};
	//HARD CODE FOR CONTEST. 700 is the wait time for the Ultimate collectionf of piano music
	
	app.data.user.announcement = app.data.user.announcement || {};
	var success = false;
	if(app.data.user.announcement){
	 
		// Do not show announcement dialog if query contains ?overrideAnnouncement=yes 
		var overrideCustomAnnouncement = app.getQueryParameter("overrideAnnouncement");
		if(overrideCustomAnnouncement === "yes"){app.customAnnouncementShown = true}
		
		// Show a announcement dialog once per session
		app.customAnnouncementShown = app.customAnnouncementShown || false;
		
		//TODO: use this value to check if the message is new or not compared to LAST READ date (no implementado)
		var messageDate = app.data.user.announcement.messageDate;
		
		
		// Default settings  
		var waitInMs = app.data.user.announcement.waitInMs || -1;
		var isModal = (app.data.user.announcement.modal == false) ? false : true;
		
		var announcementOrigin = "timer";
		if(openNow){
			waitInMs = 0;
			app.customAnnouncementShown = false;
			announcementOrigin = "user";
		}
		
		//Provide a default html template
		var htmlTemplate = app.data.user.announcement.html || `
		<div class="row">
			<div class="col-sm-12 col-xs-12" [CARD-ACTION]>
				<div class="materialCard materialCardProgress materialThemeDark materialCardSizeMega" style="margin:0;background-image:url([BACKGROUND-IMAGE])!important;background-position:center!important;background-size:cover!important; background-color: #330000 !important;">
					<div class="overlay-texture [BACKGROUND-TEXTURE] z-index0"></div>
					<div class="container-fluid">
						<div class="row">
							<script>
								app.callback("path=" + app.currentRoute + "&announcement=shown&origin=" + "${announcementOrigin}");
								
								var audioSyncInit = new audioSync({
								  audioPlayer: "audiofile",
								  subtitlesContainer: "sync-audio-text-transcription",
								  subtitlesFile: "[TRANSCRIPTION-FILEPATH]"
								});
								
								function playAudioMessage() {
								  app.customAnnouncementRead = true;
								  $(".announcementNotificationsCounter").hide();
								  
								  var audioFileHandler = document.getElementById("audiofile");
								  var elementsToHide = document.getElementsByClassName("sync-audio-text-play-hide");
								  var elementsToShow = document.getElementsByClassName("sync-audio-text-play-show");
								  
								  for (var i = 0; i < elementsToHide.length; i++) {
									elementsToHide[i].style.cssText = "display: none !important";
								  }
								  
								  for (var i = 0; i < elementsToShow.length; i++) {
									elementsToShow[i].style.display = "block";
								  }
								  
								  audioFileHandler.play();
								  
								  app.callback("path=" + app.currentRoute + "&announcement=read&origin=" + "${announcementOrigin}");
								}
							</script>
							<div class="materialCardProgressLeft materialCardProgressLeftDouble">
								<div class="materialProgressCircle materialDeadlineCircle materialThemeDark">
									<span class="materialProgressCircle-left"><span class="materialProgressCircle-bar"></span></span><span class="materialProgressCircle-right"><span class="materialProgressCircle-bar"></span></span>
									<div class="materialProgressCircle-value">
										<div>
											<span data-countdown="[DEADLINE-DATE]"><span data-show-if-long-hours="" style="display: none;"><span data-days=""></span> Days</span><span data-hide-if-long-hours=""><span data-hours-total="">00</span>:<span data-minutes="">00</span>:<span data-seconds="">00</span></span></span><br>
											[DEADLINE-TEXT]
										</div>
									</div>
								</div>-<br class="visible-xs visible-sm">
								<br class="visible-xs visible-sm">
								<div class="materialImageCircle materialThemeDark hidden-xs" style="background-image:url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.min.png)"></div>
							</div>
							<div class="materialCardProgressRight materialCardProgressRightDouble">
								<h2 class="materialHeader materialThemeDark sync-audio-text-play-hide">You've an unread message:</h2>
								<h3 class="materialHeader materialThemeDark sync-audio-text-play-show">Listening to message...</h3>
								<p class="materialParagraph materialThemeDark sync-audio-text-play-hide"><b>From:</b> [MESSAGE-FROM]</p> 
								<p class="materialParagraph materialThemeDark sync-audio-text-play-hide" style="margin-bottom: 30px;"><b>Subject:</b> [MESSAGE-SUBJECT]</p>
								
								<button class="hidden-xs materialButtonText materialThemeDark sync-audio-text-play-hide" data-value="close">[BUTTON-LATER-CAPTION]</button>
								<button onclick="playAudioMessage()" class="materialButtonFill materialThemeDark sync-audio-text-play-hide">[BUTTON-LISTEN-CAPTION]</button>
								<button class="visible-xs materialButtonText materialThemeDark sync-audio-text-play-hide" data-value="close" style="width: 100%; margin: 20px 0 0;">[BUTTON-LATER-CAPTION]</button>

								<div class="sync-audio-text-play-show">
									<audio controls="" id="audiofile" src="[AUDIO-FILEPATH]" style="margin: 10px auto 20px;width: 56%;max-width: 100%; min-width: 268px;"></audio>
									<p class="materialParagraph materialThemeDark " id="sync-audio-text-transcription" style="text-align: left;  text-shadow: 0 0 6px #ff0000, 0 -1px 1px #000000; letter-spacing: 0px; font-size: 20px; line-height: 1.3em;  width: 100%;font-weight: 500;"></p>
									<a class="materialButtonText materialThemeDark" data-value="close">[BUTTON-NO-CAPTION]</a>
									<a class="materialButtonFill materialThemeDark" data-value="close" href="[BUTTON-YES-URL]?ref=announcement&origin=${announcementOrigin}" [BUTTON-YES-BEHAVIOR]>[BUTTON-YES-CAPTION]</a> 
								</div> 
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		
		//HARDCODE URL. TODO: Remove later:
		if(app.data.offer.isDataAvailable()){
			var url = "https://pianoencyclopedia.com/en/" + app.data.offer.general.availability.urlPathStartArray[0] + "/" + app.data.offer.general.availability.urlPathEnd + "/";
		}
		else{
			var url = "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/";
		}
		app.data.user.announcement.buttonYesUrl = url;
		
		//Give text, code a template system able to replace  [NAME] [SUBJECT]  [COLOR] and any other variable dynamically.
		var input = {
			"CARD-ACTION": app.data.user.announcement.cardAction || "",
			"BACKGROUND-IMAGE": app.data.user.announcement.backgroundImage || "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/special-offer-backgrounds/header/christmas.min.jpg",
			"BACKGROUND-TEXTURE": app.data.user.announcement.backgroundTexture || "ttexture5 black5 opacity5",
			"DEADLINE-TEXT": app.data.user.announcement.deadlineText || "ENDS SOON",
			"DEADLINE-DATE": app.data.user.announcement.deadlineDate, 
			"MESSAGE-FROM": app.data.user.announcement.messageFrom || "[NOT-SET]",
			"MESSAGE-SUBJECT": app.data.user.announcement.messageSubject || "[NOT-SET]",
			"AUDIO-FILEPATH": app.data.user.announcement.audioFilePath || "",
			"TRANSCRIPTION-FILEPATH": app.data.user.announcement.transcriptionFilePath || "",
			"BUTTON-LISTEN-CAPTION": app.data.user.announcement.buttonListenCaption || "Listen to message",
			"BUTTON-LATER-CAPTION": app.data.user.announcement.buttonLaterCaption || "Not now",
			"BUTTON-YES-CAPTION": app.data.user.announcement.buttonYesCaption || "YES!",
			"BUTTON-YES-URL": app.data.user.announcement.buttonYesUrl || "",
			"BUTTON-YES-BEHAVIOR": app.data.user.announcement.buttonYesBehavior || 'target="_blank"',
			"BUTTON-NO-CAPTION": app.data.user.announcement.button1Caption || "No, thanks",
		}
		
		var compiledHtmlTemplate = Template(htmlTemplate, input);
		
		if(!app.customAnnouncementShown && app.data.user.announcement && compiledHtmlTemplate && app.data.user.announcement.audioFilePath && app.data.user.announcement.transcriptionFilePath && waitInMs >= 0){
			
			//Show notification counter if we have a message to show
			if(!app.customAnnouncementRead){
				$(".announcementNotificationsCounter").show(); 
			}
			
			app.customAnnouncementShown = true;
			
			
			//If message is opened before timeout, clear the timeout
			if(openNow && app.customAnnouncementTimer){
				clearTimeout(app.customAnnouncementTimer);
			}
			
			app.customAnnouncementTimer = setTimeout(function(){  
				app.customAnnouncementTimer = false;
				material.history.clear();	
				 
				$('<div id="customAnnouncement" class="materialDialog" style="padding: 0;" data-on-init-callback="app.data.user.announcement.init(thisComponent)"></div>').appendTo('body');
				app.data.user.announcement.init = function(thisComponent) {
					thisComponent.html(compiledHtmlTemplate);		
				};
				materialDialog.show('customAnnouncement', {modal: isModal, hideCallback: function(){ 
					material.history.clear(); 
				}}); 
			}, waitInMs);
			success = true;
	 	}else{
			var settings = {};
			if(openNow) {materialDialog.alert("No new messages", "We'll notify you whenever we make an important announcement so you don't miss anything.<br><br>Keep enjoying learning the piano with The Piano Encyclopedia!", settings);}
			
		}
	}
	return success; 
};



/*
//Deprecated
app.__showCustomDialog = function(openNow){
 
	//app.x = app.x || {};
	//HARD CODE FOR CONTEST. 700 is the wait time for the Ultimate collectionf of piano music
	
	if(app.data.user.dialog){
	 
		// Do not show dialog if query contains ?overrideCustomDialog=yes 
		var overrideCustomDialog = app.getQueryParameter("overrideCustomDialog");
		if(overrideCustomDialog === "yes"){app.customDialogShown = true}
		
		// Show a custom dialog once per session
		app.customDialogShown = app.customDialogShown || false;
		
		// Default settings 
		var waitInMs = app.data.user.dialog.waitInMs || -1;
		
		if(openNow){
			waitInMs = 0;
			// TODO: add a param to show more than once and call: app.customDialogShown = false; 
		}
		
		if(!app.customDialogShown && app.data.user.dialog && app.data.user.dialog.html && waitInMs >= 0){
			
			app.customDialogShown = true;
			
			//If message is opened before timeout, clear the timeout
			if(openNow && app.customDialogTimer){
				clearTimeout(app.customDialogTimer);
			}
			
			app.customDialogTimer = setTimeout(function(){  
				material.history.clear();	
				 
				$('<div id="customDialog" class="materialDialog" style="padding: 0;" data-on-init-callback="app.data.user.dialog.init(thisComponent)"></div>').appendTo('body');
				app.data.user.dialog.init = function(thisComponent) {
					thisComponent.html(app.data.user.dialog.html);		
				};
				materialDialog.show('customDialog', {modal: (app.data.user.dialog.modal || false), hideCallback: function(){ 
					material.history.clear(); 
				}}); 
			}, waitInMs);
			
	 	}
	}
};
*/
/*WORLDVISION CONTEST WORKFLOW
		 
			var d = new Date();
			d.setHours(23, 59, 59, 0); // next midnight
			app.x.deadline = d.toISOString();
			app.x.dialogModal = true; 
			app.data.user.profile.voted = app.data.user.profile.voted || false;
			app.x.dialogHtml1 = `<div class="row">
				<div class="col-sm-12 col-xs-12">
						<div class="materialCard materialCardProgress materialThemeDark materialCardSizeMega" style="margin: 0;">
							 <div class="container-fluid">
								<div class="row">
									  
									<div class="materialCardProgressLeft materialCardProgressLeftDouble">
										
										<div class="materialProgressCircle materialDeadlineCircle materialThemeDark">
											<span class="materialProgressCircle-left">
												<span class="materialProgressCircle-bar"></span>
											</span>
											<span class="materialProgressCircle-right">
												<span class="materialProgressCircle-bar"></span>
											</span>
											<div class="materialProgressCircle-value">
												<div>
													<span data-countdown="${app.x.deadline}"><span data-show-if-long-hours="" style="display: none;"><span data-days=""></span> Days</span><span data-hide-if-long-hours=""><span data-hours-total="">00</span>:<span data-minutes="">00</span>:<span data-seconds="">00</span></span></span><br>
													REWARD ENDS
												</div>
											</div>
										</div>-
										<br class="visible-xs visible-sm"><br class="visible-xs visible-sm"> 
										<div class="materialImageCircle materialThemeDark hidden-xs" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.v2.min.png);">  
										</div>
										
									</div> 
									<div class="materialCardProgressRight materialCardProgressRightDouble">
									  <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;font-size: 28px;">CLAIM YOUR REWARD</h3> 
									  <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;">Extra 500 People</h3>
									  <p class="materialParagraph materialThemeDark">To get complete <b>free</b> access to our new product "The Ultimate Collection of Piano Music"  you must follow two simple steps that will require just a minute of your time. </p>
									<a href="javascript: app.x.showDialog2();"  data-value="close" class="materialButtonFill materialThemeDark">CONTINUE</a>
									</div>  
								</div>
							</div>
						</div> 
					</div>
			</div>`;
			
			app.x.dialogHtml2 = `<div class="row">
				<div class="col-sm-12 col-xs-12">
						<div class="materialCard materialCardProgress materialThemeDark materialCardSizeMega" style="margin: 0;">
							 <div class="container-fluid">
								<div class="row">
									
									<script>
										var settings = {
											hideCallback: function(){
												material.history.clear();  
											}
										};
										var runOnlyOnce = "yes"; var fxCallbackName = "subscribeFxCallback"; var sequenceId = 1788; var nodeId = 2070; var timeToWaitString = ""; var subscribeFxCallback = function(result){console.log(result); if(!result.success && (result.reason!="already-subscribed")){ materialDialog.alert("Oops!", "Email with reward failed to be sent to "+app.data.user.profile.email+".  Please message support@pianoencyclopedia.com with your name, email and the following error so we can manually activate your reward. Error Code: '"+ result.reason+"'", settings);}}
										var activateReward = function(){ 
											materialDialog.alert("Congratulations, "+app.data.user.profile.firstname+"!", "Reward Granted! We have sent you an email to "+app.data.user.profile.email+" so that you can activate your reward. Please check your email now and enjoy! If you cannot find the email, please wait a few minutes, and then check  your spam folder.", settings);
											 
											var settings = {
													hideCallback: function(){
														material.history.clear();  
													}
												}; 


											HydraSystem.subscribe(sequenceId, runOnlyOnce, fxCallbackName, nodeId, timeToWaitString);
											app.data.user.profile.voted = true; 
										}
										
										var voteDialog1 = function(){
											materialDialog.alert("Voting is free and takes just a minute!", "You will be now redirected to the Worldvision Composers Contest's Page to vote. Once there, <b>click on the button 'Vote for Partipant'</b>. You will be asked to signup for free and verify your email to prove your vote is legit. <br><br>No matter who you vote, after you vote, come back to this page to be instantly granted your reward.", {
 buttonCaption: "Open Voting Page", 
 theme: "materialButtonFill materialThemeDark",
 href:"https://wvcomposers.classic-at-home.com/participants/368",
 additional: "data-value='close' target='_blank' onclick='voteDialog2()'",
 modal: true
});
										};
										
										var voteDialog2 = function(){
											materialDialog.question(app.data.user.profile.firstname + ", have you voted?", "Click on YES to claim your reward and get premium access to 'The Ultimate Collection of Piano Music' for <b>free</b>. Or click on NO to be taken to the voting page again.",{
												  "buttonNo":{
													caption: "Not, yet",
													href:"https://wvcomposers.classic-at-home.com/participants/368",
													additional: "target='_blank'",
														
												   },
												  "buttonYes":{
													caption: "Yes, I voted!",
													href:"javascript: activateReward()",
													additional: "data-value='close'"
												  },
												   modal: true
											}) 
										};

									</script>
									
									 
									<div class="materialCardProgressRight materialCardProgressRightDouble">
									  <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;font-size: 28px;">Step 1 of 2</h3>
									  <h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;">Support with your vote</h3>
										<p class="materialParagraph materialThemeDark">Voting is free, it will take you just a minute, and after doing this you will  be <i>instantly</i> granted <b>free access to our new product with over 400 piano lessons</b>!  Our CEO &amp; Founder of The Piano Encyclopedia, Rod Schejtman, has been shortlisted as <b>one of the best classical composers of the world</b> by the prestigious Worldvision Composers Contest. With your vote his new symphonic masterpiece for 80 players on stage will be played in
Vienna, Austria.  </p>
										<a href="javascript: voteDialog1();" data-value="close" class="materialButtonFill materialThemeDark">VOTE AND GET REWARD</a> 
									</div>  
									
									<div class="materialCardProgressLeft materialCardProgressLeftDouble" style="margin-top: 30px;">
										
										<div class="materialProgressCircle materialDeadlineCircle materialThemeDark">
											<span class="materialProgressCircle-left">
												<span class="materialProgressCircle-bar"></span>
											</span>
											<span class="materialProgressCircle-right">
												<span class="materialProgressCircle-bar"></span>
											</span>
											<div class="materialProgressCircle-value">
												<div>
													<span data-countdown="${app.x.deadline}"><span data-show-if-long-hours="" style="display: none;"><span data-days=""></span> Days</span><span data-hide-if-long-hours=""><span data-hours-total="">00</span>:<span data-minutes="">00</span>:<span data-seconds="">00</span></span></span><br>
													REWARD ENDS
												</div>
											</div>
										</div>
										<br class="visible-xs visible-sm"><br class="visible-xs visible-sm"> 
										<div class="materialImageCircle materialThemeDark hidden-xs" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.v2.min.png);">  
										</div>
										
									</div>
									
								</div>
							</div>
						</div> 
					</div>
			</div>`;
	
			app.x.showDialog1 = function(){
				material.history.clear();	
				 
				$('<div id="customDialog1" class="materialDialog" style="padding: 0;" data-on-init-callback="app.initDialog1(thisComponent)"></div>').appendTo('body');
				app.initDialog1 = function(thisComponent) {
					thisComponent.html(app.x.dialogHtml1);		
				};
				materialDialog.show('customDialog1', {modal: (app.x.dialogModal), hideCallback: function(){ 
					material.history.clear(); 
				}}); 
			};
			
			app.x.showDialog2 = function(){
				material.history.clear();	
				 
				$('<div id="customDialog2" class="materialDialog" style="padding: 0;" data-on-init-callback="app.initDialog2(thisComponent)"></div>').appendTo('body');
				app.initDialog2 = function(thisComponent) {
					thisComponent.html(app.x.dialogHtml2);		
				};
				materialDialog.show('customDialog2', {modal: (app.x.dialogModal), hideCallback: function(){ 
					material.history.clear(); 
				}}); 
			};
			
			if(!app.data.user.profile.voted){
				setTimeout(function(){  
					app.x.showDialog1();
				}, 2);
			}
	} */
//Deprecated	
/*
app.showAnnoucementDialog = function(openNow){ 
	
	app.customAnnouncementRead = false;
	
	var Template = function(text, input) {
		var output = text;
		for (var key in input) {
			output = output.replace(new RegExp("\\[" + key + "\\]", "g"), input[key]);
		}
		return output;
	};
	 
 
	//app.x = app.x || {};
	//HARD CODE FOR CONTEST. 700 is the wait time for the Ultimate collectionf of piano music
	
	app.data.user.announcement = app.data.user.announcement || {};
	var success = false;
	if(app.data.user.announcement){
	 
		// Do not show announcement dialog if query contains ?overrideAnnouncement=yes 
		var overrideCustomAnnouncement = app.getQueryParameter("overrideAnnouncement");
		if(overrideCustomAnnouncement === "yes"){app.customAnnouncementShown = true}
		
		// Show a announcement dialog once per session
		app.customAnnouncementShown = app.customAnnouncementShown || false;
		
		//TODO: use this value to check if the message is new or not compared to LAST READ date (no implementado)
		var messageDate = app.data.user.announcement.messageDate;
		
		
		// Default settings  
		var waitInMs = app.data.user.announcement.waitInMs || -1;
		var isModal = (app.data.user.announcement.modal == false) ? false : true;
		
		var announcementOrigin = "timer";
		if(openNow){
			waitInMs = 0;
			app.customAnnouncementShown = false;
			announcementOrigin = "user";
		}
		
		//Provide a default html template
		var htmlTemplate = app.data.user.announcement.html || `
		<div class="row">
			<div class="col-sm-12 col-xs-12" [CARD-ACTION]>
				<div class="materialCard materialCardProgress materialThemeDark materialCardSizeMega" style="margin:0;background-image:url([BACKGROUND-IMAGE])!important;background-position:center!important;background-size:cover!important; background-color: #330000 !important;">
					<div class="overlay-texture [BACKGROUND-TEXTURE] z-index0"></div>
					<div class="container-fluid">
						<div class="row">
							<script>
								app.callback("path=" + app.currentRoute + "&announcement=shown&origin=" + "${announcementOrigin}");
								
								var audioSyncInit = new audioSync({
								  audioPlayer: "audiofile",
								  subtitlesContainer: "sync-audio-text-transcription",
								  subtitlesFile: "[TRANSCRIPTION-FILEPATH]"
								});
								
								function playAudioMessage() {
								  app.customAnnouncementRead = true;
								  $(".announcementNotificationsCounter").hide();
								  
								  var audioFileHandler = document.getElementById("audiofile");
								  var elementsToHide = document.getElementsByClassName("sync-audio-text-play-hide");
								  var elementsToShow = document.getElementsByClassName("sync-audio-text-play-show");
								  
								  for (var i = 0; i < elementsToHide.length; i++) {
									elementsToHide[i].style.cssText = "display: none !important";
								  }
								  
								  for (var i = 0; i < elementsToShow.length; i++) {
									elementsToShow[i].style.display = "block";
								  }
								  
								  audioFileHandler.play();
								  
								  app.callback("path=" + app.currentRoute + "&announcement=read&origin=" + "${announcementOrigin}");
								}
							</script>
							<div class="materialCardProgressLeft materialCardProgressLeftDouble">
								<div class="materialProgressCircle materialDeadlineCircle materialThemeDark">
									<span class="materialProgressCircle-left"><span class="materialProgressCircle-bar"></span></span><span class="materialProgressCircle-right"><span class="materialProgressCircle-bar"></span></span>
									<div class="materialProgressCircle-value">
										<div>
											<span data-countdown="[DEADLINE-DATE]"><span data-show-if-long-hours="" style="display: none;"><span data-days=""></span> Days</span><span data-hide-if-long-hours=""><span data-hours-total="">00</span>:<span data-minutes="">00</span>:<span data-seconds="">00</span></span></span><br>
											[DEADLINE-TEXT]
										</div>
									</div>
								</div>-<br class="visible-xs visible-sm">
								<br class="visible-xs visible-sm">
								<div class="materialImageCircle materialThemeDark hidden-xs" style="background-image:url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.min.png)"></div>
							</div>
							<div class="materialCardProgressRight materialCardProgressRightDouble">
								<h2 class="materialHeader materialThemeDark sync-audio-text-play-hide">You've an unread message:</h2>
								<h3 class="materialHeader materialThemeDark sync-audio-text-play-show">Listening to message...</h3>
								<p class="materialParagraph materialThemeDark sync-audio-text-play-hide"><b>From:</b> [MESSAGE-FROM]</p> 
								<p class="materialParagraph materialThemeDark sync-audio-text-play-hide" style="margin-bottom: 30px;"><b>Subject:</b> [MESSAGE-SUBJECT]</p>
								
								<button class="hidden-xs materialButtonText materialThemeDark sync-audio-text-play-hide" data-value="close">[BUTTON-LATER-CAPTION]</button>
								<button onclick="playAudioMessage()" class="materialButtonFill materialThemeDark sync-audio-text-play-hide">[BUTTON-LISTEN-CAPTION]</button>
								<button class="visible-xs materialButtonText materialThemeDark sync-audio-text-play-hide" data-value="close" style="width: 100%; margin: 20px 0 0;">[BUTTON-LATER-CAPTION]</button>

								<div class="sync-audio-text-play-show">
									<audio controls="" id="audiofile" src="[AUDIO-FILEPATH]" style="margin: 10px auto 20px;width: 56%;max-width: 100%; min-width: 268px;"></audio>
									<p class="materialParagraph materialThemeDark " id="sync-audio-text-transcription" style="text-align: left;  text-shadow: 0 0 6px #ff0000, 0 -1px 1px #000000; letter-spacing: 0px; font-size: 20px; line-height: 1.3em;  width: 100%;font-weight: 500;"></p>
									<a class="materialButtonText materialThemeDark" data-value="close">[BUTTON-NO-CAPTION]</a>
									<a class="materialButtonFill materialThemeDark" data-value="close" href="[BUTTON-YES-URL]?ref=announcement&origin=${announcementOrigin}" [BUTTON-YES-BEHAVIOR]>[BUTTON-YES-CAPTION]</a> 
								</div> 
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		
		//Give text, code a template system able to replace  [NAME] [SUBJECT]  [COLOR] and any other variable dynamically.
		var input = {
			"CARD-ACTION": app.data.user.announcement.cardAction || "",
			"BACKGROUND-IMAGE": app.data.user.announcement.backgroundImage || "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/special-offer-backgrounds/header/christmas.min.jpg",
			"BACKGROUND-TEXTURE": app.data.user.announcement.backgroundTexture || "ttexture5 black5 opacity5",
			"DEADLINE-TEXT": app.data.user.announcement.deadlineText || "ENDS SOON",
			"DEADLINE-DATE": app.data.user.announcement.deadlineDate, 
			"MESSAGE-FROM": app.data.user.announcement.messageFrom || "[NOT-SET]",
			"MESSAGE-SUBJECT": app.data.user.announcement.messageSubject || "[NOT-SET]",
			"AUDIO-FILEPATH": app.data.user.announcement.audioFilePath || "",
			"TRANSCRIPTION-FILEPATH": app.data.user.announcement.transcriptionFilePath || "",
			"BUTTON-LISTEN-CAPTION": app.data.user.announcement.buttonListenCaption || "Listen to message",
			"BUTTON-LATER-CAPTION": app.data.user.announcement.buttonLaterCaption || "Not now",
			"BUTTON-YES-CAPTION": app.data.user.announcement.buttonYesCaption || "YES!",
			"BUTTON-YES-URL": app.data.user.announcement.buttonYesUrl || "",
			"BUTTON-YES-BEHAVIOR": app.data.user.announcement.buttonYesBehavior || 'target="_blank"',
			"BUTTON-NO-CAPTION": app.data.user.announcement.button1Caption || "No, thanks",
		}
		
		var compiledHtmlTemplate = Template(htmlTemplate, input);
		
		if(!app.customAnnouncementShown && app.data.user.announcement && compiledHtmlTemplate && app.data.user.announcement.audioFilePath && app.data.user.announcement.transcriptionFilePath && waitInMs >= 0){
			
			//Show notification counter if we have a message to show
			if(!app.customAnnouncementRead){
				$(".announcementNotificationsCounter").show(); 
			}
			
			app.customAnnouncementShown = true;
			
			
			//If message is opened before timeout, clear the timeout
			if(openNow && app.customAnnouncementTimer){
				clearTimeout(app.customAnnouncementTimer);
			}
			
			app.customAnnouncementTimer = setTimeout(function(){  
				app.customAnnouncementTimer = false;
				material.history.clear();	
				 
				$('<div id="customAnnouncement" class="materialDialog" style="padding: 0;" data-on-init-callback="app.data.user.announcement.init(thisComponent)"></div>').appendTo('body');
				app.data.user.announcement.init = function(thisComponent) {
					thisComponent.html(compiledHtmlTemplate);		
				};
				materialDialog.show('customAnnouncement', {modal: isModal, hideCallback: function(){ 
					material.history.clear(); 
				}}); 
			}, waitInMs);
			success = true;
	 	}else{
			var settings = {};
			if(openNow) {materialDialog.alert("No new messages", "We'll notify you whenever we make an important announcement so you don't miss anything.<br><br>Keep enjoying learning the piano with The Piano Encyclopedia!", settings);}
			
		}
	}
	return success; 
};
*/
app.html = function(params){ 
	 
	//Reset Page Specific variables and events on every new page creation
	app.resetPageVariablesAndBindedEvents();
	
	var __updateHtml = function(params){
		 
		if(typeof params.contentCondition  === "function"){	params.contentCondition  = params.contentCondition();} 
		if(params.contentCondition === true){
			if(typeof params.contentTrue  === "function"){	params.contentTrue  = params.contentTrue();}
			var content = params.contentTrue;
		}
		else{
			if(typeof params.contentFalse  === "function"){	params.contentFalse  = params.contentFalse();}
			var content = params.contentFalse;
		}
		/* It is possible to add some animation such as "animated pulse faster" */
		$(params.target).removeClass("animated faster").animate({ opacity: 0.01 }, 300, function(){
		
			/*$(params.target).html(content).addClass("animated  faster  ").animate({ opacity: 1 }, 300, function(){});*/
			$(params.target).html(content).addClass("animated faster").animate({ opacity: 1 }, 300);
			if(typeof params.callback === "function"){ params.callback();}
			 
			material.init(params.target);
		});
			
		app.updateUI(); 
		
	};

	//TODO: add a last datetime for fetching data, so if X time has passed ew fetch it again
	//if(app.data && app.dataIsFresh() )
	if(app.data){
		__updateHtml(params);  		
	}
	else{
		$(params.target).html(params.loading);
		app.fetchRemoteData(function(){
			__updateHtml(params); 
			//app.showCustomDialog();
			//app.showAnnoucementDialog();
		})
	}
	
};

app.updateUI = function(){ 
	if($(".valueFirstName").html() != app.data.user.profile.firstname){
		$(".valueFirstName").hide().html(app.data.user.profile.firstname).fadeIn(500);
	}
	
	if($(".valueMembershipType").html() != app.data.user.profile.membershipType){
		$(".valueMembershipType").hide().html(app.data.user.profile.membershipType).fadeIn(500);  
	}
};

// Usage: app.searchCourses("", {"form": "Rondo", "era": "Classical"})
app.searchCourses = function(keyword="", filters, pageNumber, pageSize = 9){
	var matchedCourses = [];
	for (var courseId in app.data.course) {
		
		var lessonsIdsFromCourse = app.getLessonIdsFromCourse(courseId);

		//If course has no lessons, skip it.
		if(lessonsIdsFromCourse.length === 0){
			continue;
		}
		
		var course = app.data.course[courseId];



		var hasComposer = false, hasLevel = false, hasForm = false, hasEra = false, hasDuration = false, hasGenre = false, hasKeyword1 = false, hasKeyword2 = false;  hasKeyword3 = false;  hasKeyword4 = false;  
		
		if(keyword){
		
			if(course.title){
				hasKeyword1 	= ( course.title.toLowerCase().search(keyword.toLowerCase()) 	   !== -1 ) ? true : false; 
			} 
			
			if(course.description){
				hasKeyword2 	= ( course.description.toLowerCase().search(keyword.toLowerCase()) !== -1 ) ? true : false;
			} 
			
			//Deep search on filters of the course
			if(course.filters){   
				var hasFilters = true; 
				for (var filterKey in course.filters) { 
					var value = course.filters[filterKey]; 
					if(value){
						if(typeof value !== "string"){ value = value.toString(); }
						hasKeyword4 = ( value.toLowerCase().search(keyword.toLowerCase()) !== -1 ) ? true : false; 
						if(hasKeyword4){ break; } 
					} 
				} 
			}
		
			//Deep search on title and subtitle of lessons and title of chapter
			var deepSearch = function(courseId, keyword){
				var hasKeyword = false;
				var chapterIds = app.data.course[courseId].chapterIds || false; 
				
				if(chapterIds){
					chapterIds.some(function (chapterId) { 
						console.log(chapterId, "chapter"); 
						
						var chapter = app.data.chapter[chapterId];
						if(chapter.title){ 
							hasKeyword 	= ( chapter.title.toLowerCase().search(keyword.toLowerCase()) !== -1 ) ? true : false; 
							if(hasKeyword){ return true; } /* Break the loop */
						}
					
						var lessonIds = app.data.chapter[chapterId].lessonIds || false; 
						if(lessonIds){
							lessonIds.some(function (lessonId) { 
								console.log(lessonId, "lesson"); 
								var lesson = app.data.lesson[lessonId];
								
								if(lesson.title){
									hasKeyword 	= ( lesson.title.toLowerCase().search(keyword.toLowerCase()) !== -1 ) ? true : false; 
									if(hasKeyword){ return true; } /* Break the loop */
								}
								
								if(lesson.subtitle){
									hasKeyword 	= ( lesson.subtitle.toLowerCase().search(keyword.toLowerCase()) !== -1 ) ? true : false;
									if(hasKeyword){ return true; }  /* Break the loop */
								}
								
							})
						}
						if(hasKeyword) { return true;}  /* Break the loop */
					})
				}
				return hasKeyword;
			}; 			
			
			hasKeyword3 = deepSearch(courseId, keyword);
		}
		 
		
		
		var hasFilters = true; 
		if(course.filters){
			/*if(composer && course.filters.composer) { hasComposer 	= ((course.filters.composer === composer) 	 || composer === "All") ? true : false; }
			if(level && course.filters.level)		{ hasLevel 		= ((course.filters.level === level) 		 || level === "All") ? true : false; } 
			if(form && course.filters.form)			{ hasForm 		= ((course.filters.form === form) 		 	 || form === "All") ? true : false; }
			if(era && course.filters.era)			{ hasEra 		= ((course.filters.era === era) 			 || era === "All") ? true : false; }
			if(duration && course.filters.duration)	{ hasDuration 	= ((course.filters.duration >= duration) 	 || duration === "All") ? true : false; }
			if(genre && course.filters.genre)		{ hasGenre 		= ((course.filters.genre === genre) 		 || genre === "All") ? true : false; } 
			*/
			
			if(filters){
				var hasFilters = true; 
				for (var filterKey in filters) {
					
					var value = filters[filterKey]; 
					if(course.filters[filterKey] && value && (value != "All"))		{ hasFilters = hasFilters && ((course.filters[filterKey] == value)   || value === "All") ? true : false; } 
					 
				}
			}
		}
	  
		if(keyword){
			if( (hasKeyword1 || hasKeyword2 || hasKeyword3 || hasKeyword4)  && (hasFilters) ){
				 matchedCourses.push(courseId);
			}
		}else{
			if(hasFilters){
				 matchedCourses.push(courseId);
			}
		}
		
	}
	
	function paginate(array, page_size, page_number) {
	  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
	  return array.slice((page_number - 1) * page_size, page_number * page_size);
	}

	
	//matchedCourses.sort();
	
	//Do a more complex sort.
	//TODO: include  order by "new" (available date) and then by "expiring" (expire date)
	var complexSort = function(matchedCourses){
		var matchedCoursesOrdered = [];
		
		for (const courseId of matchedCourses) {
		 
			var data = "No order";
			var course = app.data.course[courseId];
			if(course){ 
				var sortFxResult = config.layout.searchResultsSortFx(course); 
				if(sortFxResult){ 
					data = sortFxResult; 
				}
			}
			
			var item = [courseId, data];
			matchedCoursesOrdered.push(item);	
		}
		console.log(matchedCoursesOrdered);
		matchedCoursesOrdered.sort(function (a, b) {
		      var nameA = a[1].toString().toUpperCase(); // ignore upper and lowercase
              var nameB = b[1].toString().toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
		});
		
		console.log("matchedCoursesOrdered", matchedCoursesOrdered);
		
		var matchedCoursesOrderedIdsOnly = [];
		for (const item of matchedCoursesOrdered) {
			var courseId = item[0];
			matchedCoursesOrderedIdsOnly.push(courseId);
		}

	   console.log("matchedCoursesOrderedIdsOnly", matchedCoursesOrderedIdsOnly);
       return matchedCoursesOrderedIdsOnly;
		
	};
	
	matchedCourses = complexSort(matchedCourses);
	
	//Save last search. TODO must do a better implementation
	//app.saveLastSearch(filters, keyword); 
	
	return paginate(matchedCourses, pageSize, pageNumber);
	
}

app.getFilterArray = function(){
	var filters = {};
	$(".filterInput").each(function(index) {
	  var filterValue = $( this ).val();
	  var filterName = $( this ).data("filter");
	  if(filterValue) {filters[filterName] = filterValue;}	  
	});
	
	
	return filters;
}
	
app.updateFiltersForm = function(filterArray){ 
	for (var filterKey in filterArray) { 
		var filterValue = filterArray; 
		if(filterValue){
			$("#filterInput"+filterKey).val(filterValue).change();
		} 
	} 
}
 
app.saveLastSearch = function(filters, keyword){ 
	//Save values
	app.lastSearchFilters = filters;
	app.lastSearchKeyword = keyword;
}				
	
app.restoreLastSearch = function(){ 
	var filters = app.lastSearchFilters;
	var keyword = app.lastSearchKeyword;
	
	$(".infiniteScrollingCardsSearchBar input").val(keyword);
	app.updateFiltersForm(filters);
}				

app.updateOneTimeSpecialOfferHtml = function(timeout){
	 
		 
	var createOneTimeSpecialOfferHtml = function(settings){ 
		settings.theme = settings.theme || "materialThemeDark";
		
		settings.header1 = settings.header1 || "One-Time Only Special Offer";
		settings.header2 = settings.header2 || "Discover The Logic Behind Music";
		settings.header3 = settings.header3 || "Get this Special Offer";
		settings.paragraph = settings.paragraph || "Learn how to play the piano. Play your favorite songs by ear, improvise, and even compose your own music.";
		
		settings.description = settings.description || "Some description";
		settings.buttonText =  settings.buttonText ||  "Claim it!";
		settings.buttonClass =  settings.buttonClass ||  "materialButtonOutline"; 
		settings.buttonTarget = settings.buttonTarget || "_self"; 
		settings.buttonHref   = settings.buttonHref || false; 
		
		settings.deadlineDatetime 	= settings.deadlineDatetime || "2019-1-1 23:59:59";
		settings.deadlineExtras 	= settings.deadlineExtras || "";
		settings.deadlineText 		= settings.deadlineText || "Expires Soon";
		
		settings.circularImage = settings.circularImage || "https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/offer-includes-bubbles/free-upgrades.v2.min.png"; 
		settings.backgroundImage = settings.backgroundImage || "";

		var backgroundImageCss = settings.backgroundImage ? "background-image: url('backgroundImage')": "";
		
		return `
		<div style="background-color: #303335; margin: 30px 0; box-shadow: 0 0 6px 0px #ffc100b8; ${backgroundImageCss}">
			<div>
				<h3 style="background: #4c4c4c; text-align: center; padding: 20px; font-family: 'OptimusPrinceps'; text-transform: lowercase; font-size: 32px; letter-spacing: 3px; color: wheat;">
				${settings.header1}
				</h3>
			</div>
			<div class="container-fluid" style="padding: 30px;">
				<div class="row">
					
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
					</div>
					
					<div class="materialCardProgressRight materialCardProgressRightDouble">
						<h4 class="materialHeader materialThemeDark" style="margin-bottom: 0px;">${settings.header2}</h4>
						<h3 class="materialHeader materialThemeDark" style="margin-bottom: 20px;">${settings.header3}</h3>
						<p class="materialParagraph materialThemeDark">${settings.paragraph}</p>
						<a class="materialButtonFill materialThemeDark" data-value="close" href="${settings.buttonHref}?dialogOneTimeSpecialOffer" target="_blank">${settings.buttonText}</a>
					</div>
					
				</div>
			</div>
		</div>`; 
	};
 
	var oneTimeSpecialOfferHtml = "";
	if(app.data.user.oneTimeSpecialOffer){
		
		var settings = {};
		settings.theme = app.data.user.oneTimeSpecialOffer.theme;
		settings.header1 = app.data.user.oneTimeSpecialOffer.header1 ;
		settings.header2 = app.data.user.oneTimeSpecialOffer.header2;
		settings.header3 = app.data.user.oneTimeSpecialOffer.header3;
		settings.paragraph = app.data.user.oneTimeSpecialOffer.paragraph;
		
		settings.description = app.data.user.oneTimeSpecialOffer.description;
		settings.buttonText =  app.data.user.oneTimeSpecialOffer.buttonText;
		settings.buttonClass =  app.data.user.oneTimeSpecialOffer.buttonClass; 
		settings.buttonTarget = app.data.user.oneTimeSpecialOffer.buttonTarget; 
		settings.buttonHref   = app.data.user.oneTimeSpecialOffer.buttonHref; 
		
		settings.deadlineDatetime 	= app.data.user.oneTimeSpecialOffer.deadlineDatetime;
		settings.deadlineExtras 	= app.data.user.oneTimeSpecialOffer.deadlineExtras;
		settings.deadlineText 		= app.data.user.oneTimeSpecialOffer.deadlineText;
		
		settings.circularImage = app.data.user.oneTimeSpecialOffer.circularImage; 
		settings.backgroundImage = app.data.user.oneTimeSpecialOffer.backgroundImage;
			
		oneTimeSpecialOfferHtml = createOneTimeSpecialOfferHtml(settings);
	 
		var obj = $(".oneTimeSpecialOfferPlaceHolder").hide().html(oneTimeSpecialOfferHtml);
		var fadeInAnimationTime = 1000;
		var fx = function(){
			obj.fadeIn(fadeInAnimationTime);
			
			app.runTimeout(function(){ 
				$(".oneTimeSpecialOfferPlaceHolder h3:first-child").addClass("animated flash"); 
				app.runTimeout(function(){
					$(".oneTimeSpecialOfferPlaceHolder .materialProgressCircle-value").addClass("animated flash"); 
					app.runTimeout(function(){
						$(".oneTimeSpecialOfferPlaceHolder .materialButtonFill").addClass("animated flash");			
					}, 2000);	
				}, 1000);
			}, 2000);
		};
		
		if(timeout){
			app.runTimeout(fx, timeout);
		}
		else{
			fx();
		}
		
		//Make count
		material.init(".oneTimeSpecialOfferPlaceHolder");	
	}
	
}

					
app.createFiltersHtml = function() {
	
	var getCoursesFilters = function(){
		var filters = {};
		for (var courseId in app.data.course) {
			
			var course = app.data.course[courseId];
	  
			if(course.filters){
				for (var filterKey in course.filters) {
					//console.log(filters, filters.filterKey);
					if(!filters[filterKey]){ 
						filters[filterKey] = {};
					}
					
					var value = course.filters[filterKey]; 
					
					if(!filters[filterKey][value]){
						filters[filterKey][value] = 1;
					}
					else{
						filters[filterKey][value]++;
					}
				}
			}
		}
		 
		return filters;
	}

	var createFilterField = function(values, label){
		
		var options = [];
		var optionsSorted = [];
		var optionsHtml = "";
		for (var value in values) {
			options.push(value);
		}
		
		var capitalizedLabel = capitalizeFirstLetter(label);	
		 
		options.sort();
		for (var value of options) {
			optionsHtml += `<option value='${value}'>${value}</option>`;
		}
		
		return `
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
				<div class="materialInputContainer">
					<div class="materialInputWrap filterDropdown">
						<select class="materialInputControl materialThemeDark filterInput" required="" id="filterInput${label}" data-filter="${label}"> 
							<option value="" disabled="" selected=""></option>
							<option value="">All</option>
							${optionsHtml}
						</select>
						<span class="materialInputHighlight"></span>
						<span class="materialInputBar materialThemeDark"></span>
						<label class="materialInputLabel materialThemeDark">${capitalizedLabel}</label>
					</div>
				</div>
			</div>`;	
	}	

	var filters = getCoursesFilters();

	var html = ""; 
	for (var filterKey in filters) {
		var values = filters[filterKey];
		 
		function capitalizeFirstLetter(string) {
		  return string.charAt(0).toUpperCase() + string.slice(1);
		}
		 
		html += createFilterField(values,  filterKey);
	}
	
	return html;
}	


app.createFiltersHtmlNew = function(){
	
	var getCoursesFilters = function(){
		var filters = {};
		for (var courseId in app.data.course) {
			
			var course = app.data.course[courseId];
	  
			if(course.filters){
				for (var filterKey in course.filters) {
					//console.log(filters, filters.filterKey);
					if(!filters[filterKey]){ 
						filters[filterKey] = {};
					}
					
					var value = course.filters[filterKey]; 
					
					if(!filters[filterKey][value]){
						filters[filterKey][value] = 1;
					}
					else{
						filters[filterKey][value]++;
					}
				}
			}
		}
		 
		return filters;
	}

	var createFilterField = function(values, label){
		
		var options = [];
		var optionsSorted = [];
		var optionsHtml = "";
		for (var value in values) {
			options.push(value);
		}
		
		var capitalizedLabel = capitalizeFirstLetter(label);	
		 
		options.sort();
		for (var value of options) {
			optionsHtml += `<option value='${value}'>${value}</option>`;
		}
		
		return `
			<div class="materialInputContainer">
				<div class="materialInputWrap">
					<select class="materialInputControl materialThemeDark filterInput" required="" id="filterInput${label}" data-filter="${label}"> 
						<option value="" disabled="" selected=""></option>
						<option value="">All</option>
						${optionsHtml}
					</select>
					<span class="materialInputHighlight"></span>
					<span class="materialInputBar"></span>
					<label class="materialInputLabel materialThemeDark">${capitalizedLabel}</label>
				</div>
			</div>
		`;	
	}	

	var filters = getCoursesFilters();


	//if there are no filters, then hide the filter functionality

	var html = ""; 
	for (var filterKey in filters) {
		var values = filters[filterKey];
		 
		function capitalizeFirstLetter(string) {
		  return string.charAt(0).toUpperCase() + string.slice(1);
		}
		 
		html += createFilterField(values,  filterKey);
	}
	
	return html;
}


app.resetFilterInputs = function() {
    $(".filterInput").each(function() {
        $(this).val('');
    });
};


app.createLessonCard = function(lessonId, lesson, columnWidthClass) {

	let parentChapterId = app.data.lesson[lessonId].parentChapter;
	let parentCourseId = app.data.chapter[parentChapterId].parentCourse;
	let course = app.data.course[parentCourseId]

	// console.log("parentCourseId", parentCourseId);
	// console.error('lesson', lesson)
	// console.error('app.data.course[parentCourseId]', app.data.course[parentCourseId])

	var href = `#!/lesson/${lessonId}`;

	var countdownHtml = function (date) {
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


	switch (lesson.progressStatus) {
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
	switch (lesson.type) {
		case "add-here-different-course-types":
			icon = "fa-newspaper-o";
			break;
		default:
			icon = "fa-graduation-cap";
	}

	switch (lesson.dateStatus) {
		case "expiringAsap":
			var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>Expiring in ${countdownHtml(lesson.deadlineDateString)}</p>`;
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
			var actionHtml = `<p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i> Available in ${countdownHtml(lesson.availableDateString)}</p>`;
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
								<button disabled="disabled" class="materialButtonText ${themeButton}" data-button><i class="fa fa-lock"></i> Locked</button>
							  </span>`;
			var progressChipHtml = `<span data-new><i>LOCKED</i></span>
								<span data-incomplete>LOCKED</span>
								<span data-complete>LOCKED</span>`;
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

	let parentChapter = lesson.parentChapter;

	var progressBarStyling = `style="width:${app.data.chapter[parentChapter].stats.lessons.totalProgress}%; "`;

	var progressHtml = `<div class="materialProgressBar ${theme}">
							<div class="materialProgressBarInside" ${progressBarStyling}> 
							</div>
						</div>`;

	var defaultImage = 'https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png';
	var courseImage = lesson.imageThumbnail || lesson.image || defaultImage;

	var courseBackgroundColor = (courseImage === defaultImage) ? "black" : "grey";

	var bottomLeftChip = config.text.searchResultsBottomLeft(course) ?
		`<div class="materialCardNew materialThemeDark materialThemeFlat" style="left: 20px; right: auto">
							${config.text.searchResultsBottomLeft(course)}
						</div>;` : "";

	var topLeftChip = config.text.searchResultsTopLeft(course) ?
		`<div class="materialCardNew materialThemeDark materialThemeFlat" style="left: 20px; right: auto; top: 20px; bottom: auto;">
							${config.text.searchResultsTopLeft(course)}
						</div>;` : "";

	var lineText1 = config.text.searchResultsLineText1(course) ? `<h6 class="materialParagraph">${config.text.searchResultsLineText1(course) == '?' ? 'Find out more inside...' : config.text.searchResultsLineText1(course)}</h6>` : `<h6 class="materialParagraph"></h6>`;

	var lineText2 = config.text.searchResultsLineText2(course) ? `<p class="materialParagraph ${theme}">${config.text.searchResultsLineText2(course)}</p>` : `<p class="materialParagraph ${theme}"></p>`;


	var html = `
		<!--<div class="${columnWidthClass}" style="min-height: ${config.layout.searchResultsMinHeight};">-->
		<div class="${columnWidthClass}">
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
								<span data-progress="${app.data.chapter[parentChapter].stats.lessons.totalProgress}">
									${progressChipHtml}
								</span>
							</div>
						</div>
					${progressHtml}
						<div class="materialCardInfo ${theme}">
							<h2 class="materialHeader" style="font-size: ${config.layout.searchResultsCourseTitleFontSize}">${lesson.title}</h2>
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


app.createCourseCard = function(courseId, course, columnWidthClass) {

	var href = `#!/course/${courseId}`;

	var countdownHtml = function (date) {
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


	switch (course.progressStatus) {
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

	// TODO: Get type for this
	switch (course?.type) {
		case "add-here-different-course-types":
			icon = "fa-newspaper-o";
			break;
		default:
			icon = "fa-graduation-cap";
	}

	switch (course.dateStatus) {
		case "expiringAsap":
			var scarcityHtml = `<p class="expiring" style="font-weight: bold;"><i class="fa fa-lock"></i>Expiring in ${countdownHtml(course.earliestDeadlineDateTime)}</p>`;
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
			var actionHtml = `<p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i> Available in ${countdownHtml(course.earliestAvailableDateString)}</p>`;
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

	var progressBarStyling = `style="width:${course.stats.lessons.totalProgress}%; "`;

	var progressHtml = `<div class="materialProgressBar ${theme}">
							<div class="materialProgressBarInside" ${progressBarStyling}> 
							</div>
						</div>`;

	var defaultImage = 'https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png';
	var courseImage = course.image || defaultImage;

	var courseBackgroundColor = (courseImage === defaultImage) ? "black" : "grey";

	var bottomLeftChip = config.text.searchResultsBottomLeft(course) ?
		`<div class="materialCardNew materialThemeDark materialThemeFlat" style="left: 20px; right: auto">
							${config.text.searchResultsBottomLeft(course)}
						</div>;` : "";

	var topLeftChip = config.text.searchResultsTopLeft(course) ?
		`<div class="materialCardNew materialThemeDark materialThemeFlat" style="left: 20px; right: auto; top: 20px; bottom: auto;">
							${config.text.searchResultsTopLeft(course)}
						</div>;` : "";

	var lineText1 = config.text.searchResultsLineText1(course) ? `<h6 class="materialParagraph">${config.text.searchResultsLineText1(course)}</h6>` : `<h6 class="materialParagraph"></h6>`;

	var lineText2 = config.text.searchResultsLineText2(course) ? `<p class="materialParagraph ${theme}">${config.text.searchResultsLineText2(course)}</p>` : `<p class="materialParagraph ${theme}"></p>`;


	var html = `
		<!--<div class="${columnWidthClass}" style="min-height: ${config.layout.searchResultsMinHeight};">-->
		<div class="${columnWidthClass}">
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


/*
TODO: pasar todo esto a una funcion aqui, de forma tal que pueda hacer refresh el route.
app.routes = {};
app.routes["/lesson/:lessonId"] = function(){
			html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.lesson.loading();}, 
				contentCondition: function(){ return (typeof app.data.lesson[params.lessonId] !== "undefined"); },
				contentTrue:  	  function(){ return app.templates.pages.lesson.content( app.data.lesson[params.lessonId], 	app.data.cards	);},
				contentFalse: 	  function(){ return app.templates.pages.lesson.notFound( params.lessonId );} 
			}); 
		app.routeId = "/lesson/";	
		window.scrollTo(0, 0);		
    },
	'': function (params) { 
		app.html({
				target: "#content", 
				loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
				contentCondition: function(){ return true; },
				contentTrue:  	  function(){ return app.templates.pages.dashboard.sortedNewestFirst(app.data);}, 
			}); 
		app.routeId = "/dashboard/";
		window.scrollTo(0, 0);		 
    }, 
	'/expiring/': function (params) {  
		if(app.routeId.startsWith("/dashboard/")){ 
			
			app.html({
					target: "#dashboard-lessons", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.__createCourses(app.data, app.data.global.courses.sortedExpiringFirst);}, 
			}); 
		}
		else{
			
			app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.sortedExpiringFirst(app.data);}, 
			}); 
		}
		app.routeId = "/dashboard/expiring/";
    }, 
	'/newest/': function (params) {  
		if(app.routeId.startsWith("/dashboard/")){
			
			app.html({
					target: "#dashboard-lessons", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.__createCourses(app.data, app.data.global.courses.sortedNewestFirst);}, 
			}); 
		}
		else{
			app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.dashboard.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.dashboard.sortedNewestFirst(app.data);}, 
			}); 
		}	
		
		app.routeId = "/dashboard/newest/";
		*/

app.wallet = function(){
	var expose = {};
	 
	/* Returns the price of the parent course */
	var getCoursePriceFromLesson = function(lessonId) {
		try {
			var parentChapterId = app.data.lesson[lessonId].parentChapter;
			if (!parentChapterId) {
				throw new Error('Parent chapter ID not found');
			}

			var parentCourseId = app.data.chapter[parentChapterId].parentCourse;
			if (!parentCourseId) {
				throw new Error('Parent course ID not found');
			}
  
			// Check if price is defined. If not, return null.
			return getCoursePrice(parentCourseId);
		} catch (error) {
			console.error('Error retrieving price from lesson ID:', error);
			return null;
		}
	};

	var getCoursePriceBeforeFromLesson = function(lessonId) {
	    try {
            var parentChapterId = app.data.lesson[lessonId].parentChapter;
            if (!parentChapterId) {
                throw new Error('Parent chapter ID not found');
            }

            var parentCourseId = app.data.chapter[parentChapterId].parentCourse;
            if (!parentCourseId) {
                throw new Error('Parent course ID not found');
            }

            // Check if price is defined. If not, return null.
            return getCoursePriceBefore(parentCourseId);
        } catch (error) {
            console.error('Error retrieving price from lesson ID:', error);
            return null;
        }
	}

	var getCoursePrice = function(courseId) {
		try {
			  
			var courseData = app.data.course[courseId];
			if (!courseData) {
				throw new Error('Course data is missing');
			}

			// Check if price is defined. If not, return null.
			return courseData.price ? courseData.price.melodyCoins : null;
		} catch (error) {
			console.error('Error retrieving price from course ID:', error);
			return null;
		}
	};

	var getCoursePriceBefore = function(courseId) {
    		try {

    			var courseData = app.data.course[courseId];
    			if (!courseData) {
    				throw new Error('Course data is missing');
    			}

    			// Check if price is defined. If not, return null.
    			return courseData.price ? courseData.priceBefore.melodyCoins : null;
    		} catch (error) {
    			console.error('Error retrieving price before from course ID:', error);
    			return null;
    		}
    	};
 

	var getUserBalance = function(){
		try {
			return app.data.user.wallet.melodyCoins;
		}catch (error) {
			console.error('Error retrieving Melody Coins Balance:', error);
			return 0;
		}
	};

	var unlockCourseFromLesson = function(lessonId){
	    try {
            var parentChapterId = app.data.lesson[lessonId].parentChapter;
            if (!parentChapterId) {
                throw new Error('Parent chapter ID not found');
            }

            var parentCourseId = app.data.chapter[parentChapterId].parentCourse;
            if (!parentCourseId) {
                throw new Error('Parent course ID not found');
            }
            unlockCourse(parentCourseId);
        } catch (error) {
            console.error('Error retrieving course ID from lesson ID:', error);
            return null;
        }
	};

	var unlockCourse = function(courseId){
	      try {
	           var userBalance = getUserBalance();
	           var coursePrice = getCoursePrice(courseId);
	           var coursePriceBefore = getCoursePriceBefore(courseId);

	           var subtitle;
	           if(coursePrice == coursePriceBefore){
	                subtitle = "Gain immediate access to this course for only:<br> <b>&#9834; " + coursePrice + " Melody Coins</b>. <br><br><b>Do you want to unlock this course now?</b>";
	           }else{
	                subtitle = "Gain immediate access to this course for only:<br> <s>&#9834; " + coursePriceBefore + " </s> <b>&#9834; " + coursePrice + " Melody Coins</b>. <br><br><b>Do you want to unlock this course now?</b>";
	           }


               //If there is no price, then the course is not unlockable via Melody Coins
	           if(coursePrice && coursePrice >0){
                   if (userBalance >= coursePrice) {
                          var userBalanceAfterUnlock = userBalance - coursePrice;
                           //Unlock via Melody Coins

                            var userBalance = app.wallet.getUserBalance();
                            var settings = {
                                title: "Unlock Full Course Access?",
                                subtitle: subtitle,
                                buttonNo: {
                                    caption: "Not yet",
                                    value: "no"
                                },
                                buttonYes: {
                                    caption: "Unlock Now!",
                                    value: "yes"
                                },
                                progressPercentage: "95",
                                progressDisplay: userBalance,
                                progressTitle: "Melody Coins",
                                progressSubTitle: "<b style='color: white'>Your Balance</b>",
                                hideCallback: function(result){

                                        if(result.lastValue === "yes"){
                                            $.ajax({
                                                dataType: "text", //To avoid parsing of JSON
                                                url: config.serverUrl,
                                                cache: false,
                                                type: "POST",
                                                crossDomain: true,
                                                headers: {
                                                    "accept": "application/json"
                                                },
                                                data: {
                                                    "url": window.location.href,
                                                    "referrer": document.referrer,
                                                    "action": "unlockCourse",
                                                    "hs_uid": (localStorage.getItem('hs_uid') || ""),
                                                    "hs_uidh": (localStorage.getItem('hs_uidh') || ""),
                                                    "appName": config.appName,
                                                    "courseId": courseId,
                                                }
                                             })
                                             .done(function(data) {
                                                try{
                                                    data = JSON.parse(data);
                                                }
                                                catch(e){
                                                    console.error("Error parsing JSON response from server", e);
                                                    data = null;
                                                }

                                                if(data && data.success == true && data.result === "COURSE_UNLOCK_SUCCESS"){
                                                    var settings = {
                                                        buttonCaption:  "Awesome!",
                                                        hideCallback: function(){
                                                            location.reload();
                                                        }
                                                    }

                                                  materialDialog.alert("Course Unlocked!", "Congratulations! You've just unlocked this course permanently by using merely &#9834; " + coursePrice + " Melody Coins. Your new balance is &#9834; " + userBalanceAfterUnlock + " Melody Coins. Get ready to dive into all the lessons this course offers. <br><br><b>The app will now refresh to grant you full access. Happy learning!</b>", settings);

                                                }else{
                                                    // Show error message
                                                    var settings = {
                                                        hideCallback: function(){
                                                            location.reload();
                                                        }
                                                    }

                                                    materialDialog.alert("Oops!", "Sorry, there seems to be an issue with your account. Please contact support@pianoencyclopedia with the following error message asap  so we can fix this for you: MEL-1" + data.error, settings);
                                                }
                                             })
                                             .fail(function(XMLHttpRequest, textStatus, errorThrown) {
                                                // console.log('Error Getting status for parameters: - Error:' + errorThrown);
                                                console.log(XMLHttpRequest + ' ' + textStatus + ' ' + errorThrown);
                                                materialDialog.alertNoInternetConnection();
                                             });
                                        }

                                }
                            }
                          app.dialogs.questionProgress(settings);


                   } else {
                           var needMoreCoins = coursePrice - userBalance;
                           var settings = {};

                           if(app.data.offer.isDataAvailable()){
                               url = "https://pianoencyclopedia.com/en/" + app.data.offer.general.availability.urlPathStartArray[0] + "/" + app.data.offer.general.availability.urlPathEnd + "/";
                           }
                           else{
                               url = "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/";
                           }

							app.dialogs.questionProgress({
								title: "You need just &#9834; " + needMoreCoins + " Melody Coins!",
								subtitle: "Sorry, you currently have &#9834; " + userBalance + " Melody Coins. You need just &#9834; " + needMoreCoins + " more Melody Coins to unlock this course. You can earn more Melody Coins by becoming a member of our Digital-Home Study Course, 'The Logic Behind Music', or by purchasing Melody Coins in our shop. <br><br> <b>Would you like to become a member of 'The Logic Behind Music' now and unlock this course?</b>",
								buttonNo: {
									caption: "Not yet",
									value: "no"
								},
								buttonYes: {
								   caption: "Unlock All",
								   href: url + "?ref=members-area-unlock",
								   additional: "target='_blank'",
								   value: "yes"
								},
								progressPercentage: "95",
								progressDisplay: userBalance,
								progressTitle: "Melody Coins",
								progressSubTitle: "<b style='color: white'>Your Balance</b>",
								hideCallback: function(result){}
							});
                            
							/*var dialogTitle = "You need just &#9834; " + needMoreCoins + " Melody Coins!";
                            var dialogMessage = "Sorry, you currently have &#9834; " + userBalance + " Melody Coins. You need just &#9834; " + needMoreCoins + " more Melody Coins to unlock this course. You can earn more Melody Coins by becoming a member of our Digital-Home Study Course, 'The Logic Behind Music', or by purchasing Melody Coins in our shop. <br><br> <b>Would you like to become a member of 'The Logic Behind Music' now and unlock this course?</b>";

                           materialDialog.question(dialogTitle,dialogMessage,
                           {
                               "buttonNo": {
                                   caption: "Not yet",
                                   value: "no"
                               },
                               "buttonYes": {
                                   caption: "Unlock All",
                                   href: url + "?ref=members-area-unlock",
                                   additional: "target='_blank'",
                                   value: "yes"
                               }
                           });*/
                   }
	           }
	           else{
                    if(app.data.offer.isDataAvailable()){
                        url = "https://pianoencyclopedia.com/en/" + app.data.offer.general.availability.urlPathStartArray[0] + "/" + app.data.offer.general.availability.urlPathEnd + "/";
                    }
                    else{
                        url = "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/";
                    }

               		materialDialog.question(    "Unlock Complete Access to All Premium Lessons?",
                     "This lesson, along with all other exclusive premium lessons, is available only to students of our Digital-Home Study Course, 'The Logic Behind Music', and cannot be unlocked individually. By enrolling in this globally acclaimed course, you gain lifetime access to all premium content in our Members-Area. <br><br><b>Enroll in 'The Logic Behind Music' now, unlock all premium lessons, and embark on your journey to achieving your musical dreams with The Piano Encyclopedia!</b>",
               		{
               			"buttonNo":{
               				caption: "Not yet",
               				value: "no"
               			},
               			"buttonYes":{
               				caption: "Unlock All",
               				href:  url + "?ref=members-area-unlock",
               				additional: "target='_blank'",
               				value: "yes"
               			}
               		});
	           }

	      }
	      catch (error) {
	              console.error('Error unlocking course:', error);
	      }
	};
		
		
 
    expose.getCoursePriceFromLesson = getCoursePriceFromLesson;
    expose.getCoursePrice = getCoursePrice;
    expose.getCoursePriceBeforeFromLesson = getCoursePriceBeforeFromLesson;
    expose.getCoursePriceBefore = getCoursePriceBefore;
    expose.unlockCourse = unlockCourse;
    expose.unlockCourseFromLesson = unlockCourseFromLesson;
    expose.getUserBalance = getUserBalance;
	return expose;
}();

app.getPreviewFromLesson = function(lessonId) {
    if (!lessonId || !app.data.lesson || !app.data.lesson[lessonId]) {
        return null;
    }

    var lesson = app.data.lesson[lessonId];
    if (lesson.preview) {
        return lesson.preview;
    }

    var parentChapterId = lesson.parentChapter;
    if (!parentChapterId || !app.data.chapter || !app.data.chapter[parentChapterId]) {
        return null;
    }

    var parentChapter = app.data.chapter[parentChapterId];
    var parentCourseId = parentChapter.parentCourse;
    if (!parentCourseId || !app.data.course || !app.data.course[parentCourseId]) {
        return null;
    }

    var parentCourse = app.data.course[parentCourseId];
    return parentCourse.preview || null;
};




CourseSorter = (function() {
    // Constructor
    var CourseSorter = function(data) {
        this.data = data;
    };

    // Method to sort courseIds by a specified filter
    CourseSorter.prototype.sortCourses = function(filterName, order) {
        var courseIds = Object.keys(this.data.course);

        return courseIds.sort(function(a, b) {
            var valueA = this.data.course[a].filters[filterName];
            var valueB = this.data.course[b].filters[filterName];

            if (order === 'ascending') {
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
            } else { // for 'descending'
                if (valueA > valueB) return -1;
                if (valueA < valueB) return 1;
            }

            return 0; // if equal
        }.bind(this));
    };

    // Method to retrieve unique filter names from all courses
    CourseSorter.prototype.getUniqueFilterNames = function() {
        var filterNames = {};
        Object.keys(this.data.course).forEach(function(courseId) {
            var filters = this.data.course[courseId].filters;
			
			if(!filters) return null;
            Object.keys(filters).forEach(function(filterName) {
                filterNames[filterName] = true;
            });
        }.bind(this));

        return Object.keys(filterNames);
    };

    // Method to sort courseIds for each filter in ascending order
    CourseSorter.prototype.sortCoursesByAllFilters = function() {
        var sortedCourses = {};
        var filters = this.getUniqueFilterNames();

        filters.forEach(function(filterName) {
            sortedCourses[filterName] = this.sortCourses(filterName, 'ascending');
        }.bind(this));

        return sortedCourses;
    };

    return CourseSorter;
})();

/* Set Active Pills */
app.setActivePills = function (activeDataset) {
	document.querySelectorAll(".materialFilterPillsContainer").forEach(function (parentDiv) {
		const activePills = parentDiv.querySelectorAll(`.materialFilterPillsDiv .materialChip[data-active="${activeDataset}"]`);
		activePills.forEach(function (pill) {
			pill.querySelector('input').checked = true;

			// Add active class to the pill
			pill.classList.add('active');
		});
	});
}

/* Toggle Material Searchbar */
app.toggleMaterialSearchbar = function (event, status) {
	event.stopPropagation();
	let materialSearchBar = document.querySelector('.materialSearchBar')

	if (status === 'open') {
		materialSearchBar.classList.add('active');
		document.querySelector('body').style.overflow = 'hidden'
	} else if (status === 'close') {
		materialSearchBar.classList.remove('active');
		document.querySelector('body').style.overflow = 'unset'
	} else {
		materialSearchBar.classList.toggle('active');

		if(materialSearchBar.classList.contains('active')) {
			document.querySelector('body').style.overflow = 'hidden'
		} else {
			document.querySelector('body').style.overflow = 'unset'
		}
	}
}

/* Close Material Searchbar on outside click */
app.closeMaterialSearchBarOutClick = function (event) {
	let materialSearchBar = document.querySelector('.materialSearchBar')

	if (!materialSearchBar.contains(event.target) && event.target !== materialSearchBar) {
		materialSearchBar.classList.remove('active');
	}

	if(materialSearchBar.classList.contains('active')) {
		document.querySelector('body').style.overflow = 'hidden'
	} else {
		document.querySelector('body').style.overflow = 'unset'
	}
}

app.checkout = function(pathname, coupon, userInformation) {
	try{
		// Valid pathnames
		var validPathnames = [
			'the-ultimate-collection-of-piano-music',
			'the-ultimate-collection-of-piano-music-yearly',
			'the-ultimate-collection-of-piano-music-lifetime-access'
		];

		// Check if pathname is valid
		if (validPathnames.indexOf(pathname) === -1) {
			console.error('Invalid pathname. Checkout process aborted.');
			return; // Exit the function if pathname is not valid
		}
		
		var paymentContact = {};
		 
		// Name fallback logic
		var firstNameProvided = userInformation && userInformation.firstName;
		var lastNameProvided = userInformation &&  userInformation.lastName;
		var profileNameProvided = app && app.data && app.data.user && app.data.user.profile && app.data.user.profile.name;

		if (firstNameProvided) {
			paymentContact.firstName = firstNameProvided;
		}
		if (lastNameProvided) {
			paymentContact.lastName = lastNameProvided;
		}

		try{
			if ((profileNameProvided && !firstNameProvided) || (profileNameProvided && !lastNameProvided)) {
				var fullName = app.data.user.profile.name.trim();
				var nameParts = fullName.split(/\s+/); // Split by one or more spaces

				var prefixes = ['Dr.', 'Mr.', 'Ms.', 'Mrs.']; // Extend this list as needed
				var suffixes = ['Jr.', 'Sr.', 'III', 'IV']; // Extend this list as needed

				// Remove prefix if present
				if (prefixes.indexOf(nameParts[0]) > -1) {
					nameParts.shift();
				}

				// Remove suffix if present
				if (suffixes.indexOf(nameParts[nameParts.length - 1]) > -1) {
					nameParts.pop();
				}

				// Determine first and last names based on remaining parts
				if (!firstNameProvided) {
					paymentContact.firstName = nameParts[0];
				}
				if (!lastNameProvided) {
					paymentContact.lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
				}
			}
		}
		catch(e){
			console.error('Checkout Error:', e);	
		}


		if (userInformation &&  userInformation.email) {
			paymentContact.email = userInformation.email;
		} else if (app && app.data && app.data.user && app.data.user.profile && app.data.user.profile.email) {
			paymentContact.email = app.data.user.profile.email;
		}
	
		if (userInformation &&  userInformation.company) {
			paymentContact.company = userInformation.company;
		}
		if (userInformation &&  userInformation.phone) {
			paymentContact.phone = userInformation.phone;
		}
		if (userInformation &&  userInformation.addressLine1) {
			paymentContact.addressLine1 = userInformation.addressLine1;
		}
		if (userInformation && userInformation.addressLine2) {
			paymentContact.addressLine2 = userInformation.addressLine2;
		}
		if (userInformation && userInformation.city) {
			paymentContact.city = userInformation.city;
		}
		if (userInformation && userInformation.region) {
			paymentContact.region = userInformation.region;
		}
		if (userInformation && userInformation.country) {
			paymentContact.country = userInformation.country;
		}
		if (userInformation && userInformation.postalCode) {
			paymentContact.postalCode = userInformation.postalCode;
		}
		

		console.log(paymentContact);
		// Configure the FastSpring Builder
		var fastSpringConfig = {
			'reset': true,
			'products': [
				{
					'path': pathname,
					'quantity': 1
				}
			],
			'paymentContact': paymentContact,
			'checkout': true
		};

		// Add coupon if provided
		if (coupon) {
			fastSpringConfig.coupon = coupon;
		}

		fastspring.builder.reset(); //clear the cart
		fastspring.builder.push(fastSpringConfig);
	}
	catch(e){
		var settings = {
			hideCallback: function(){
				location.reload();
			}
		};
		
		materialDialog.alert(
		"Oops! We're Really Popular Right Now!",
		"It seems a lot of piano enthusiasts are heading to checkout at the same moment! Please wait a moment and try again soon. If this message keeps popping up, our friendly team is ready to assist you at <a href='mailto:support@pianoencyclopedia.com'>support@pianoencyclopedia.com</a>. Just shoot us an email with 'CHECKOUT-1' and we'll help you process your order.", settings 
		);
		
	}
};

var CountdownTimer = (function() {
    var that = {};

    var displayElements;
    var interval = null;
    var isOfferAvailable;
 
	that.init = function() {
        
        try {
            isOfferAvailable = !__isOfferRecentlyShown();
        } catch (error) {
            console.error("Error checking offer availability:", error);
            isOfferAvailable = false;
        }
        return true;
    };

    that.start = function(elements) {
        displayElements = elements;
        if (!displayElements.d || !displayElements.h || !displayElements.m || !displayElements.s) {
            console.error("CountdownTimer initialization failed: Required HTML elements are missing.");
            return false;
        }
		
		if (!displayElements || !isOfferAvailable) {
            return;
        }
        try {
            __calculateAndDisplayTime();
            interval = setInterval(__calculateAndDisplayTime, 1000);
        } catch (error) {
            console.error("Error starting the countdown:", error);
        }
    };

    that.end = function() {
        if (!interval) {
            return;
        }
        clearInterval(interval);
        interval = null;
        __setDisplayToZero();
        isOfferAvailable = false;
    };

    that.getIsOfferAvailable = function() {
        return isOfferAvailable;
    };

    function __calculateAndDisplayTime() {
        try {
            var remainingTime = __getRemainingTime();
            if (remainingTime <= 0) {
                clearInterval(interval);
                __setDisplayToZero();
                __updateLastOfferTime();
                isOfferAvailable = false;
            } else {
                __updateDisplay(remainingTime);
            }
        } catch (error) {
            console.error("Error calculating or displaying time:", error);
            clearInterval(interval);
            __setDisplayToZero();
        }
    }

    function __getRemainingTime() {
        var now = new Date();
        var midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        return midnight.getTime() - now.getTime();
    }

    function __updateDisplay(remainingTime) {
        displayElements.d.innerHTML = __getTrueNumber(Math.floor(remainingTime / (1000 * 60 * 60 * 24)));
        displayElements.h.innerHTML = __getTrueNumber(Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        displayElements.m.innerHTML = __getTrueNumber(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)));
        displayElements.s.innerHTML = __getTrueNumber(Math.floor((remainingTime % (1000 * 60)) / 1000));
    }

    function __getTrueNumber(num) {
        return num < 10 ? "0" + num : num;
    }

    function __isOfferRecentlyShown() {
        var lastOfferTime = localStorage.getItem("lastOfferTime");
        var now = new Date().getTime();
        return lastOfferTime && now - lastOfferTime < 2 * 24 * 60 * 60 * 1000;
    }

    function __setDisplayToZero() {
        displayElements.d.innerHTML = 
        displayElements.h.innerHTML = 
        displayElements.m.innerHTML = 
        displayElements.s.innerHTML = "00";
    }

    function __updateLastOfferTime() {
        localStorage.setItem("lastOfferTime", new Date().getTime());
    }

    return that;
})();

// Usage
/* 

CountdownTimer.init();

var isOfferAvailable = CountdownTimer.getIsOfferAvailable();
if(isOfferAvailable){
	CountdownTimer.start({
	d: document.getElementById("d"),
	h: document.getElementById("h"),
	m: document.getElementById("m"),
	s: document.getElementById("s")
});
}

*/
// To end the timer, you can call:
// CountdownTimer.end();
 

//app.init();
//TODO: create wrapper over ajax request, to retry twice?	
