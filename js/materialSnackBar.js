/* Initialize and declare the materialSnackBar object */
var materialSnackBar = function(){
    var that = {};

    that.init = function(){
        that.queue = [];

        /* Add materialSnackBar html to body */
        that.snackBar = $('<div id="materialSnackBar" class="materialSnackBar"><span></span><a href="#" class="materialButtonText materialThemeDark"></a></div>').appendTo('body');

        /* Handle events : if click on button hide prematurely */
        that.button = $("a", that.snackBar);
        that.message = $("span", that.snackBar);

        that.button.onMouseDownRipple();
        that.button.on("click", function(event){
             event.preventDefault();
            that.hide();
        });
    }();

    /**
     * Private Method: Hide snackbar
     */
   that.hide = function(callback){
        that.snackBar.fadeOut(500, callback);
    };

    /*
    * @type: private method
    * @purpose: show next materialSnackBar
    */
	that.show = function(newNotification){
		
		/* If this is a new notification but there are already items on queue, exit */
		if(newNotification && (that.queue.length > 1)){
			return;
		}
		
		/* Get the first item of the queue  */
		var lastItem = that.queue[0];
		
		/* Update Snackbar html and show */
		that.message.html(lastItem.message);
        that.button.html(lastItem.buttonText);
        that.snackBar.animateWithClass({
            className: "fadeInUp",
            duration: "500",
            onEndCallback: function(){
                /* Delay; hide current materialSnackBar; delay; and show the next one */
                setTimeout(function(){

                    /* Hide Snackbar and delete first element */
                    that.hide(function(){
                        that.queue.shift();

                        if(that.queue.length>0){
                            setTimeout(function(){
                                /* newNotification = false */
                                that.show(false);
                            }, 500);
                        }

                    });

                }, 3000);
            }
        });

    };
	
	/* 
	* @type: public method
	* @purpose: push materialSnackBar into the queue.
	* @param string message: Message to display
	* @param string buttonText: text of button 
	*/
	that.push = function(message, buttonText){
		if(typeof buttonText === "undefined"){buttonText = "Dismiss";}
		
		/* Push an item into the queue */
        that.queue.push({message: message, buttonText: buttonText});
		
		/* newNotification = true */
		that.show(true);
	};

    var expose = {};
    expose.push = that.push;

	return expose;
}();


 