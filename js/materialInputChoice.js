var materialInputChoice = function(){
	var that = {};
	
	/**
	* @purpose: Create html of radio or checkbox input controls 
	* @param [object] settings: 
	* {
	*		name: "pianoLevel",
	*		type: "checkbox",   // Can be "radio" or "checkbox"
	*       class: "materialChoiceColored",
	*		choices: [
	*			 {
	*				"value": "firstTimePlayer",
	*				"label": "First Time Player",
	*				"checked": false,
	*				"disabled" : true,
	*				"class": "any extra classes"				
	*			 },
	*			 {
	*				"value": "firstTimePlayer",
	*				"label": "First Time Player" 			
	*			 },
	*			 {
	*				"value": "firstTimePlayer",
	*				"label": "First Time Player" 			
	*			 },
	*			 {
	*				"value": "firstTimePlayer",
	*				"label": "First Time Player" 				
	* 			 }
	*			]
	*	}
	**/
	that.create = function(settings){
		settings.name = settings.name || false;
		settings.type = settings.type || "checkbox";
		settings.classes = settings.classes || "materialChoiceColored";
		settings.inline = settings.inline || false; 
		var html = '';
		settings.choices.forEach(function(item) {
		  html += `
				<div class="materialChoiceWrapper ${settings.classes}" ${settings.inline? "": "style='display: block; z-index: 999999;'"}>
				  <label>
					<input name="${settings.name}" ${item.checked? 'checked="checked"': ''} ${item.disabled? 'disabled="disabled"': ''} value="${item.value}" type="${settings.type}"><span class="materialChoice"><span class="materialCheckmark"></span></span><span class="materialChoiceText">${item.label}</span>
				  </label>
				</div>`; 
		});
		
		return html; 
	}
	
	var expose = {};
	expose.create = that.create;
	return expose;
}();