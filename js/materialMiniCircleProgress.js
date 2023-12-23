var materialMiniCircleProgress = (function () {
    var that = {};
    that.created = false;

    that.create = function (settings) {
        var percentage = settings.hasOwnProperty('percentage') ? Number(settings.percentage) : 0;

        function specialRound(x){
			if(x>95 && x <100) {
			   return 95;
		   }
		   if(x==0) {
			   return 5;
		   }
		   return Math.ceil(x/5)*5;
	   }

        percentage = specialRound(percentage);

        var html = `
            <div class="materialProgressCircleMini materialThemeGoldDark" data-progress="${percentage}" data-progress-affects-data-percentage>
                <span class="materialProgressCircleMini-left">
                    <span class="materialProgressCircleMini-bar"></span>
                </span>
                <span class="materialProgressCircleMini-right">
                    <span class="materialProgressCircleMini-bar"></span>
                </span>
            </div>
        `;

        that.created = true;
        return html;
    }

    return that;
})();