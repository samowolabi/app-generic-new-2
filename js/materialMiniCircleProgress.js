var materialMiniCircleProgress = (function () {
    var that = {};
    that.created = false;

    that.create = function (settings) {
        var percentage = settings.hasOwnProperty('percentage') ? Number(settings.percentage) : 0;

        var html = `
            <div class="materialCardProgressLeft">
                <div class="materialProgressCircleMini materialThemeGoldDark" data-progress="${percentage}" data-progress-affects-data-percentage>
                    <span class="materialProgressCircleMini-left">
                        <span class="materialProgressCircleMini-bar"></span>
                    </span>
                    <span class="materialProgressCircleMini-right">
                        <span class="materialProgressCircleMini-bar"></span>
                    </span>
                </div>
            </div>
        `;

        that.created = true;
        return html;
    }

    return that;
})();