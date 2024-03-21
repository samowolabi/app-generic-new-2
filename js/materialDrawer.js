var materialDrawer = function(id){
    var that = {};

    /**
     * Create html and add event handling
     * @param string id
     * @param object settings
     */
    that.show = function(id, settings){
        /* Default settings */
        settings = function(){
            settings.direction  =  settings.direction || "left";

            settings.contentAnimationShowTime = "500";
            settings.overlayAnimationShowTime = "300";
            settings.contentAnimationHideTime = "500";
			settings.overlayAnimationHideTime = "300";
            
            settings.overlayAnimationShowName = "fadeIn";
            settings.overlayAnimationHideName = "fadeOut";

            return settings;
        }();

        if(settings.direction === "left"){
            settings.contentClass = "left";
            settings.contentAnimationShowName = "slideInLeft";
            settings.contentAnimationHideName = "slideOutLeft";
            settings.contentSwipeLeftHide = true;
        }else{
            settings.contentClass = "right";
            settings.contentAnimationShowName = "slideInRight";
            settings.contentAnimationHideName = "slideOutRight";
            settings.contentSwipeRightHide = true;
        }

        return materialComponent.show(id, settings);
    };

    /**
     * Hide content
     */
    that.hide = function(item){
        materialComponent.hide(item);
    };

    var expose = {};
    expose.show = that.show;
    expose.hide = that.hide;

    return expose;
}();
