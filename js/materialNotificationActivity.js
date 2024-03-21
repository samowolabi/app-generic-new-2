/* https://github.com/hustcc/timeago.js */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.timeago=e()}(this,function(){"use strict";var t="second_minute_hour_day_week_month_year".split("_"),e="?_??_??_?_?_?_?".split("_"),n=[60,60,24,7,365/7/12,12],r={en:function(e,n){if(0===n)return["just now","right now"];var r=t[parseInt(n/2)];return e>1&&(r+="s"),[e+" "+r+" ago","in "+e+" "+r]},zh_CN:function(t,n){if(0===n)return["??","???"];var r=e[parseInt(n/2)];return[t+" "+r+"?",t+" "+r+"?"]}},a=function(t){return parseInt(t)},i=function(t){return t instanceof Date?t:!isNaN(t)||/^\d+$/.test(t)?new Date(a(t)):(t=(t||"").trim().replace(/\.\d+/,"").replace(/-/,"/").replace(/-/,"/").replace(/(\d)T(\d)/,"$1 $2").replace(/Z/," UTC").replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),new Date(t))},o=function(t,e,i){e=r[e]?e:r[i]?i:"en";for(var o=0,u=t<0?1:0,c=t=Math.abs(t);t>=n[o]&&o<n.length;o++)t/=n[o];return(t=a(t))>(0===(o*=2)?9:1)&&(o+=1),r[e](t,o,c)[u].replace("%s",t)},u=function(t,e){return((e=e?i(e):new Date)-i(t))/1e3},c=function(t,e){return t.getAttribute?t.getAttribute(e):t.attr?t.attr(e):void 0},f=function(t){return c(t,"data-timeago")||c(t,"datetime")},d=[],l=function(t){t&&(clearTimeout(t),delete d[t])},s=function(t){if(t)l(c(t,"data-tid"));else for(var e in d)l(e)},h=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();var p=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.nowDate=e,this.defaultLocale=n||"en"}return h(t,[{key:"setLocale",value:function(t){this.defaultLocale=t}},{key:"doRender",value:function(t,e,r){var a=this,i=u(e,this.nowDate);t.innerHTML=o(i,r,this.defaultLocale);var c=function(t,e){var n=setTimeout(function(){l(n),t()},e);return d[n]=0,n}(function(){a.doRender(t,e,r)},Math.min(1e3*function(t){for(var e=1,r=0,a=Math.abs(t);t>=n[r]&&r<n.length;r++)t/=n[r],e*=n[r];return a=(a%=e)?e-a:e,Math.ceil(a)}(i),2147483647));!function(t,e){t.setAttribute?t.setAttribute("data-tid",e):t.attr&&t.attr("data-tid",e)}(t,c)}},{key:"render",value:function(t,e){void 0===t.length&&(t=[t]);for(var n=void 0,r=0,a=t.length;r<a;r++)n=t[r],s(n),this.doRender(n,f(n),e)}},{key:"format",value:function(t,e){return o(u(t,this.nowDate),e,this.defaultLocale)}}]),t}(),v=function(t,e){return new p(t,e)};return v.register=function(t,e){r[t]=e},v.cancel=s,v});

/* Initialize and declare the materialNotificationActivity object */
var materialNotificationActivity = function(){
    var that = {};

    that.init = function(){
        that.queue = [];

        /* Add materialNotificationActivity html to body */
        that.snackBar = $(`<div class="materialNotificationActivityContainer" style="display: none">
							<div class="materialNotificationActivityAvatar">
								 <div></div>
							</div>
							<div class="materialNotificationActivityText">
								<span class="materialNotificationActivityName">Name</span>
								<div class="materialNotificationActivityTextBlock">Description</div>
								<div class="materialNotificationActivitySubTextBlock"><span class="materialNotificationActivityTimeAgo">Time Ago</span>
									<span class="materialNotificationActivityVerified"><i class="fa fa-check-circle"></i> </span>
								</div>
							</div>
					</div>
				</div>`).appendTo('body');

        /* Handle events : if click on button hide prematurely */
        that.line1 = $(".materialNotificationActivityName", that.snackBar);
        that.line2 = $(".materialNotificationActivityTextBlock", that.snackBar);
	    that.timeAgo = $(".materialNotificationActivityTimeAgo", that.snackBar);
		that.avatar = $(".materialNotificationActivityAvatar", that.snackBar); 

       that.snackBar.onMouseDownRipple();
       that.snackBar.on("click", function(event){
             event.preventDefault();
            that.hide();
        });
    }();

	that.init = function(){
		/* Start after 5 seconds; re-fetch data every 3 minutes */
		setTimeout(function(){
			that.fetchRemoteData();
			
			setInterval(function(){
				that.fetchRemoteData();
			}, 1000*60*3);
			
		}, 5000);
	};
	
	that.fetchRemoteData = function(){
		$.ajax({  
			
			url: "http://learn.pianoencyclopedia.com/hydra/HydraApi/activity/public/always", 
			data: {
				/*q: "select title,abstract,url from search.news where query=\"cat\"",*/
				format: "json"
			},
			dataType: 'jsonp',
            success: function(notifications){
                notifications.forEach(function(notification){
					that.push(notification);
				})
			}
		 }) 
		 .fail(function() { 
			/* Do nothing. Wait for the next cycle. */
		 });  
	};

    /**
     * Private Method: Hide snackbar
     */
   that.hide = function(callback){
        that.snackBar.fadeOut(500, callback);
    };

    /*
    * @type: private method
    * @purpose: show next materialNotificationActivity
    */
	that.show = function(newNotification){
		
		/* If this is a new notification but there are already items on queue, exit */
		if(newNotification && (that.queue.length > 1)){
			return;
		}
		
		/* Get the first item of the queue  */
		var lastItem = that.queue[0];
		
		/* Update Snackbar html and show */
		that.line1.html(lastItem.name + " from " + lastItem.location);
        that.line2.html(lastItem.description);
		
		/* Dependency with timeago.js library */
		that.timeAgo.html(timeago().format(new Date(lastItem.datetime)));
		
		if(lastItem.countryCode === "US"){
			that.avatar.html(` 
				<div style="background-image: url(images/us-maps-states/${lastItem.regionCode.toUpperCase()}.png); background-size: 250%;"></div> `); 
		}
		else{ 
			that.avatar.html(` 
			<div style="background-image: url(images/world-flags-round/128/${lastItem.countryCode.toLowerCase()}.png); background-size: 84px;"></div> `); 
		}
       
		that.snackBar.animateWithClass({
            className: "fadeInUp",
            duration: "500",
            onEndCallback: function(){
                /* Delay; hide current materialNotificationActivity; delay; and show the next one */
                setTimeout(function(){

                    /* Hide Snackbar and delete first element */
                    that.hide(function(){
                        that.queue.shift();

                        if(that.queue.length>0){
                            setTimeout(function(){
                                /* newNotification = false */
                                that.show(false);
                            }, (4000 +  Math.random() * 6000) );
                        }

                    });

                }, 5000);
            }
        });

    };
 
	/* 
	* @type: public method
	* @purpose: push materialNotificationActivity into the queue.
	* @param object notification: {name: name, location: location, description: description, countryCode: countryCode, regionCode: regionCode, datetime: datetime} 
	*/
	that.push = function(notification){

		/* Push an item into the queue */
        that.queue.push(notification);
		
		/* newNotification = true */
		that.show(true);
	};

    var expose = {};
    expose.push = that.push; 

	that.init();
	return expose;
}(); 

 