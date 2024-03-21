var materialPIP = (function() {
    var that = {};
    var container = null;
    var iframe = null;
    var currentSizeIndex = 0;
    var sizeClasses = ['size1', 'size2', 'size3', 'size4', 'size5'];
	var toolbar = null;
	var maximizeButton = null;

    var decreaseSizeButton = null;
    var increaseSizeButton = null;
	
    var createIframe = function(url, sizeClass) {
        if (container) {
            console.error("MaterialPIP is already initialized.");
            return;
        }

        container = document.createElement('div');
        container.className = 'materialPIP-container ' + sizeClass;
        currentSizeIndex = sizeClasses.indexOf(sizeClass);

        iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.className = 'materialPIP';
        container.appendChild(iframe);

        createControlButtons();

        document.body.appendChild(container);
    };

    var createControlButtons = function() {
        toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        container.appendChild(toolbar);

        var closeButton = document.createElement('button');
        closeButton.innerHTML = '&#215;';
        closeButton.className = 'close-btn';
        closeButton.onclick = that.hide;
        toolbar.appendChild(closeButton);

        decreaseSizeButton = document.createElement('button');
        decreaseSizeButton.innerHTML = '-';
        decreaseSizeButton.className = 'size-btn decrease';
        decreaseSizeButton.onclick = that.decreaseSize;
        toolbar.appendChild(decreaseSizeButton);

        increaseSizeButton = document.createElement('button');
        increaseSizeButton.innerHTML = '+';
        increaseSizeButton.className = 'size-btn increase';
        increaseSizeButton.onclick = that.increaseSize;
        toolbar.appendChild(increaseSizeButton);
		
		maximizeButton = document.createElement('button');
        maximizeButton.innerHTML = 'M';
        maximizeButton.className = 'size-btn maximize';
        maximizeButton.onclick = that.maximize;
        toolbar.appendChild(maximizeButton);

        updateButtonStates();
    };
	
	var updateButtonStates = function() {
        decreaseSizeButton.disabled = currentSizeIndex === 0;
        increaseSizeButton.disabled = currentSizeIndex === sizeClasses.length - 1;
        maximizeButton.disabled = currentSizeIndex === sizeClasses.length - 1; 
    };
	
	that.maximize = function() {
        if (currentSizeIndex < sizeClasses.length - 1) {
            currentSizeIndex = sizeClasses.length - 1; // Set to largest size
            that.resize(sizeClasses[currentSizeIndex]);
        }
    };
  
    that.init = function(url, sizeClass) {
        createIframe(url, sizeClass);
    };

    that.resize = function(sizeClass) {
        if (container && sizeClass) {
            container.className = 'materialPIP-container ' + sizeClass;
            currentSizeIndex = sizeClasses.indexOf(sizeClass);
			updateButtonStates(); 
        } else {
            console.error("Invalid size class or container not initialized.");
        }
    };

    that.show = function() {
        if (container) {
            container.style.display = 'block';
        } else {
            console.error("MaterialPIP is not initialized.");
        }
    };

    that.hide = function() {
        if (container) {
            container.style.animation = 'fadeOut 0.5s ease forwards';
            container.addEventListener('animationend', function() {
                document.body.removeChild(container);
                container = null;
                iframe = null;
            }, { once: true });
        }
    };

    that.changeURL = function(url) {
        if (iframe && url) {
            iframe.src = url;
        } else {
            console.error("Invalid URL or iframe not initialized.");
        }
    };

    that.decreaseSize = function() {
        if (currentSizeIndex > 0) {
            currentSizeIndex--;
            that.resize(sizeClasses[currentSizeIndex]);
        }
    };

    that.increaseSize = function() {
        if (currentSizeIndex < sizeClasses.length - 1) {
            currentSizeIndex++;
            that.resize(sizeClasses[currentSizeIndex]);
        }
    };

    return that;
})();

// Usage
materialPIP.init('https://example.com', 'size3');
