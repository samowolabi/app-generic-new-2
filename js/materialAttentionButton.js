var materialAttentionButton = function(){
	
	var that = {};
	
	that.__imageBall = 'https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/animated-sprites/music-note.min.png';
	that.__imageFireworks = 'https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/animated-sprites/shooting_star_spritesheet_orange.min.png';
 	
	that.__visible = false;
	that.__initiated = false; 
	that.__loaded = false; 
	that.__callback = function(){ console.log("Set a custom callback for materialAttentionButton using setCallback() method"); }
	
	//Preload images
	document.addEventListener("DOMContentLoaded", function(){
		that.__init();
	}); 
	
	var setCallback = function(fx){
		if(typeof fx === 'function'){
			that.__callback = fx;
		}
	};  
	
	var __init = function(){
			try{
				var position = isMobile() ? "bottom: 85px;" : "top: 85px;" ;
				var html = `
				<div id="attention-button" class="animated pulse infinite" style="display: none; position: fixed; ${position} right: 40px; z-index: 100;">
					<a href="#">
					<div style="position: relative;">
						<div id="attention-button-ball" style="width: 50px;height: 50px; border-radius: 100px;box-shadow: 0 0 2px 0px #ffd700cf, 0 0 7px 0px #ffd700cf, 0 0 1px 0px rgb(209 153 0) inset; border: 1px solid black;box-sizing: border-box; transition: 0.3s background ease-in;"> 
						<img alt="" src="${that.__imageBall}" style="width: 30px; height: 30px; padding: 10px; box-sizing: content-box;" ></div>
						<div id="attention-button-animation" style="position: absolute;width: 90px;height: 90px;top: -20px;left: -20px;background-image: url('${that.__imageFireworks}');background-position: 0 0;"></div>
					</div>
				  </a>
				</div>
				<style>
					#attention-button-ball{
						background: rgb(255,187,0);
					}
					#attention-button a:hover #attention-button-ball{
						background: #ff8100;
					}
					
					 #attention-button-animation{
						 -webkit-animation: attention-button-fireworks 5s infinite steps(99);
						 animation: attention-button-fireworks 5s infinite steps(99);
						/* the number of steps is 1 less than the number of drawn frames */
					}
					 @-webkit-keyframes attention-button-fireworks {
						 to {
							 background-position: 100% 0;
						}
					}
					 @keyframes attention-button-fireworks {
						 to {
							 background-position: 100% 0;
						}
					} 
				</style>`;
				var div = document.createElement('div'); 
				div.innerHTML = html;

				document.body.append(div); 
				
				that.__imageBallElement = new Image();
				that.__imageBallElement.src = that.__imageBall;  
				
				that.__imageFireworksElement = new Image();
				that.__imageFireworksElement.src = that.__imageFireworks ; 
				
				that.__initiated = true;
			}
			catch(err) {
			  console.log(err.message);
			}
		 
	};
	
	var show = function(){ 
		try{
			that.__visible = true;   
			if(!that.__initiated){
				that.__init();
			}
			if(!that.__loaded){
				//On scroll more than 2 page hide attention-button
				window.onscroll = function() {
					if(window.pageYOffset < window.innerHeight){
						if(that.__visible){ $("#attention-button").fadeOut();}
					}else{
						if(that.__visible){ $("#attention-button").fadeIn(); }
					}
				};
			
				//On click attention-button hide attention-button
				$('#attention-button').click(function(){ 
					$("#attention-button").fadeOut();
					
					if(typeof that.__callback === 'function'){
						that.__callback();
					} 
					
					event.preventDefault();
				});

				$("#attention-button").fadeIn();
			}
	 
			that.__loaded = true;
		}
		catch(err) {
		  console.log(err.message);
		}
	}
	
	var hide = function(){
		that.__visible = false; 
	}
	
	that.__init = __init;
	that.show = show;
	that.hide = hide;
	that.setCallback = setCallback;
	
	return that;
	
}();