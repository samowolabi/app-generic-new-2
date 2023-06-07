var materialRating = function(){
	var that = {};
	
	/**
	* @purpose: Create html of radio or checkbox input controls 
	* @param [object] settings
	**/
	that.create = function(settings){
		settings.name = settings.name || "rating";
		settings.number = settings.number || 5;
		settings.classes = settings.classes || "text-center";
		settings.icon = settings.icon || "fa fa-heart";
		settings.tooltipPlacement = settings.tooltipPlacement || "bottom";
		settings.tooltipLabels = settings.tooltipLabels || ["Not what I expected", "Not Good", "Good", "Very Good", "Loved it!"];
		settings.onChangeCallback = settings.onChangeCallback || false;   
		settings.onClickNoHide = settings.onClickNoHide || false;  
		settings.rating = settings.rating || false;  
		
			
		var onClickNoHideTag   = settings.onClickNoHide? `  data-on-click-no-hide="true" ` : "";
		var onChangeCallbackTag   = settings.onChangeCallback? `  data-on-change-callback="${settings.onChangeCallback}" ` : ""; 
		//Mover el on change tag a cada input, no en general. Con esto solucionamos todo este merengue!
		
		var html = `<div class="materialRating ${settings.classes}" ${onChangeCallbackTag}>`;
		
		/* Create a phantom input with value "unset" so that the on hover css works */
		html += `<input style="display: none;" type="radio" value="unset" id="${settings.name}-unset" name="${settings.name}" checked="checked">
				 <label style="display: none;" for="${settings.name}-unset" class="${settings.icon}"></label>`;
					
		for(var i=0; i< settings.number; i++){
			html += `<input type="radio" value="${i+1}" ${(i===(settings.rating-1))? "checked='checked'": ""} id="${settings.name}-${i}" name="${settings.name}">
					 <label for="${settings.name}-${i}" data-value="${i}" ${onClickNoHideTag} class="${settings.icon}" data-placement="${settings.tooltipPlacement}" data-toggle="tooltip" title="${settings.tooltipLabels[i]}"></label>`; 
		}
		
		html += "</div>"; 
		
		return html; 
	}
	
	/*
	* @purpose: inits all ratings in this component
	*/
	that.init = function(thisComponent){ 
		
		$('.materialRating', thisComponent).each(function( index ) {
			var thisRating = $(this);
			
			var snackbarText = thisRating.data("on-change-show-snackbar");
			var onChangeCallback = thisRating.data("on-change-callback");
			
			/* Apply "on change" event on all inputs of this rating */
			var thisRatingInputs = $("input", thisRating); 
			$(thisRatingInputs).unbind("change"); //Remove previous binds so there is not conflict if init() is called multiple times
			$(thisRatingInputs).on("change", function(event){ 
			   var value = $(this).val();	
			   if(onChangeCallback){
					var fx = new Function("value", onChangeCallback);  fx(value);
			   } 
			})
		});	
	}
	
	var expose = {};
	expose.create = that.create;
	expose.init = that.init;
	return expose;
}();