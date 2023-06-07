/* Keep track of history of interactive components (e.g dialogs)*/
material.history = function(){
	var that= {};
	
	that.queue = [];
	
	/**
	* @purpose: Save item into history
	**/
	that.save = function(id, settings){
		that.queue.push({id: id, settings: settings});
	}
	
	/**
	* @purpose: Show previous material interactive component and remove last element from history queue.
	* @return: true if there was a previous component; else, false.
	**/
	that.back = function(){  
		/* Get second to last (previous); remove last item; and show previous without saving on history */
		var len = that.queue.length;
		if(len>1){
			var previous = that.queue[len-2];
			that.queue.pop();
			materialComponent.show(previous.id, previous.settings, false /* Don't save on history */); 
			return true;
		}
		else{
			return false;
		}
	}
	
	/**
	* @purpose: Get the last used settings
	**/
	that.getLastSettings = function(){  
		 
		var len = that.queue.length;
		if(len>0){
			var last = that.queue[len-1]; 
			return last.settings;
		}
		else{
			return {};
		}
	}
	
	/**
	* @purpose: Clear the queue
	**/
	that.clear = function(){  
		 that.queue = [];
	}
	/**
	* @purpose: Creates back button if history is not empty
	* 
	**/
	/*
	{Add more features so we can show a different button if there is no back. Add full settings
		"noHistory": {
			label: "Change Rating"
			onClickCallback: "showDialog..."
		},
		"yesHistory": {
		
		}
		
		
		..or easier just call that.save() and add a fake history so this works.
	}
	*/
	that.createBackButton = function(buttonText){  
		if(that.queue.length>1){
		  return `<button class="materialButtonText"  data-on-click-callback="material.history.back()">
                    ${buttonText}
           </button>`;
		}
		else{
			return "";
		}
	}
	
	var expose = {};
	expose.queue = that.queue;
	expose.save = that.save;
	expose.back = that.back;
	expose.getLastSettings = that.getLastSettings;
	expose.clear = that.clear;
	expose.createBackButton = that.createBackButton;
	return expose;
}();