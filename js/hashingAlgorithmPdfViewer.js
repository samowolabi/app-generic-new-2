var hashingAlgorithmPdfViewer = (function () {
    var that = {};

    that.simpleHash = function (P, D, Url) {
        var hash = 0;
        var combinedString = P + D + Url;
        
        for (var i = 0; i < combinedString.length; i++) {
            var char = combinedString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    return that;
}());