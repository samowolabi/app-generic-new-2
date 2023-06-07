material.components = material.components  || {};


material.components.cardCircularProgress = {};
material.components.cardCircularProgress = function(){
	
	var that = {};
	
	that.create = function(settings){
		settings.completed = settings.completed || "Completed";
		 
		var html = `
		<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
			<div class="materialCardProgress">
				 <div class="container-fluid">
					<div class="row">
					
						<div class="materialCardProgressLeft">
							<div class="materialProgressCircle" data-percentage="${progressRounded}">
								<span class="materialProgressCircle-left">
									<span class="materialProgressCircle-bar"></span>
								</span>
								<span class="materialProgressCircle-right">
									<span class="materialProgressCircle-bar"></span>
								</span>
								<div class="materialProgressCircle-value">
									<div>
										${settings.progress}%<br>
										<span>${settings.completed}</span>
									</div>
								</div>
							</div>
						</div>
						 
						<div class="materialCardProgressRight">
							<h3>5 More Lessons are Waiting for You</h3>
							<p><b>Want more premium content for free?</b> The sooner you complete the lessons, the sooner we will unlock new premium lessons for free, exclusively as our gift to you:</p>
							<button class="materialButtonOutline">Next Lesson</button>
						</div>
						 
						
					</div>
				</div>
			</div> 
		</div>`;
		
		//need to init
		//build an init function with scope
	
	}
	
}