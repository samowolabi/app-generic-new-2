var materialCardScrolling = (function () {
	

	

    var that = {};
    that.created = false;
 
	that.instances = {};  // Object to hold states for each instance
    that.instanceIdCounter = 0; // Counter to generate unique IDs
	
    // Constants
    var pageSize = 10;
    var maxItemsInView = 30;
    var buffer = 5;
 
 
	var generateUniqueId = function() {
        return "" + (that.instanceIdCounter++);
    }
	
    var getHtml = function (itemId, settings) {
		var html = '';
        const { data, list } = settings
		
        // Column Width
        var columnWidthClass = `cardSearchResult ${config.layout.searchResults}`;
        if (list.type === 'lesson') { 
			if(data.lesson.hasOwnProperty(itemId)) {
				var lessonId = data.lesson[itemId]?.id;
				var lesson = data.lesson[itemId];
				html += app.createLessonCard(lessonId, lesson, columnWidthClass);
			}   
        }
		
        if (list.type === 'course') { 
			if(data.course.hasOwnProperty(itemId)) {
				var courseId = itemId;
				var course = data.course[itemId];
				html += app.createCourseCard(courseId, course, columnWidthClass);
			} 
        }
		
        return html;
	};

    // Placeholder for function to generate HTML for a range
    var generateHtmlForRange = function (settings, startIndex, endIndex) { 
		var html = '';
		var ids = settings.list.ids.slice(startIndex, endIndex);
		 
		var columnWidthClass = `cardSearchResult ${config.layout.searchResults}`; // Ensure this config is accessible

		ids.forEach(function (id) { 
			html += getHtml(id, settings);  
		});
		 
		return html;
	}; 
 
	var appendItems = function (materialCardsDiv, html) {
		materialCardsDiv.insertAdjacentHTML('beforeend', html);
	};

	var prependItems = function (materialCardsDiv, html) {
		materialCardsDiv.insertAdjacentHTML('afterbegin', html);
	};
	
	var removeChildNodes = function (parentElement, count, isFromStart) {
		while (count > 0 && parentElement.children.length > buffer) {
			if (isFromStart) {
				parentElement.removeChild(parentElement.firstChild);
			} else {
				parentElement.removeChild(parentElement.lastChild);
			}
			count--;
		}
	};

	var easeInOutCubic = function(timeFraction) {
		return timeFraction < 0.5
			? 4 * timeFraction * timeFraction * timeFraction
			: 1 - Math.pow(-2 * timeFraction + 2, 3) / 2;
	};

   var smoothScrollTo = function(element, target, duration) {
		var start = element.scrollLeft,
			change = target - start,
			startTime = performance.now(),
			endTime = startTime + duration;

		var animateScroll = function(time) {
			var currentTime = time || performance.now();
			var timeFraction = (currentTime - startTime) / duration;
			if (timeFraction > 1) {timeFraction = 1;}

			var easedTimeFraction = easeInOutCubic(timeFraction);
			var newScrollPosition = start + change * easedTimeFraction;
			element.scrollLeft = newScrollPosition;

			if (timeFraction < 1) {
				window.requestAnimationFrame(animateScroll);
			}
		};

		animateScroll();
	};
	
   
   var updateViewIncrementally = function (state, direction) {
		var settings = state.settings;
		var materialCardsDiv = document.querySelector('.materialCardsDiv');
		var previousContentWidth = materialCardsDiv.scrollWidth;
		var startIndex, endIndex, html;

		// Determine the range of items to be added based on the direction of scrolling
		if (direction === 'right') {
			startIndex = Math.max(state.currentIndex - buffer, 0);
			endIndex = Math.min(startIndex + maxItemsInView, settings.list.ids.length);
			html = generateHtmlForRange(settings, startIndex, endIndex);

			appendItems(materialCardsDiv, html);
			removeChildNodes(materialCardsDiv, pageSize, true);

			// Adjust the scroll position smoothly to the right
			var newContentWidth = materialCardsDiv.scrollWidth;
			adjustScrollPosition(materialCardsDiv, previousContentWidth, 'right');
		} else if (direction === 'left') {
			startIndex = Math.max(state.currentIndex - maxItemsInView + buffer, 0);
			endIndex = Math.min(startIndex + maxItemsInView, settings.list.ids.length);
			html = generateHtmlForRange(settings, startIndex, endIndex);

			prependItems(materialCardsDiv, html);
			removeChildNodes(materialCardsDiv, pageSize, false);

			// Adjust the scroll position smoothly to the left
			var addedContentWidth = materialCardsDiv.scrollWidth - previousContentWidth;
			adjustScrollPosition(materialCardsDiv, addedContentWidth, 'left');
		}
 
		state.currentIndex = endIndex;
	};

   var adjustScrollPosition = function (materialCardsDiv, previousContentWidth, direction) {
	
		var addedContentWidth = materialCardsDiv.scrollWidth - previousContentWidth;
		if (direction === 'right') {
			smoothScrollTo(materialCardsDiv, materialCardsDiv.scrollLeft + addedContentWidth, 500); // 500ms for animation
		} else if (direction === 'left') {
			smoothScrollTo(materialCardsDiv, materialCardsDiv.scrollLeft - addedContentWidth, 500);
		}

	};

		 
	 
    // Placeholder for debounce function 
	var debounceScroll = function (func, delay) {
		var timeout;
		return function() {
			var context = this;
			var args = Array.prototype.slice.call(arguments);

			clearTimeout(timeout);
			timeout = setTimeout(function() {
				func.apply(context, args);
			}, delay);
		};
	};

 

    // Initialization function
    that.init = function () {
		try {
			document.querySelectorAll(".app_coursesCardsContainer").forEach(function (parentDiv) {
				const cardsScrollingDiv = parentDiv.querySelector('.materialCardsDiv');
				const containerWidth = cardsScrollingDiv.scrollWidth;
				const scrollAmount = 800;
				 
				const instanceId = parentDiv.querySelector('.materialCardsScrolling').getAttribute('data-instance');
				var state = that.instances[instanceId];
 
				// Hide Left Carousel at first
				parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';

				// Combined scroll event handler
				var handleScroll = debounceScroll(function () {
					var scrollLeft = cardsScrollingDiv.scrollLeft;
					var maxScrollLeft = cardsScrollingDiv.scrollWidth - cardsScrollingDiv.clientWidth;

					// Update for lazy loading content
					if (scrollLeft > state.lastScrollLeft && scrollLeft >= maxScrollLeft - 100) {
						state.currentIndex += pageSize;
						updateViewIncrementally(state, 'right');
					} else if (scrollLeft < state.lastScrollLeft && scrollLeft <= 100) {
						state.currentIndex = Math.max(state.currentIndex - pageSize, 0);
						updateViewIncrementally(state, 'left');
					}
					state.lastScrollLeft = scrollLeft;

					// Show/hide left arrow
					if (scrollLeft > 0) {
						parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'flex';
					} else {
						parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';
					}

					// Show/hide right arrow
					if (scrollLeft + cardsScrollingDiv.clientWidth >= maxScrollLeft) {
						parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').style.display = 'none';
					} else {
						parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').style.display = 'flex';
					}
				}, 250, state.settings);

				cardsScrollingDiv.addEventListener('scroll', function() {
					handleScroll(state.settings); // Passing settings here
				});

				// Left arrow click handler
				parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').addEventListener('click', function () {
					cardsScrollingDiv.scrollLeft -= scrollAmount;
				});

				// Right arrow click handler
				parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').addEventListener('click', function () {
					cardsScrollingDiv.scrollLeft += scrollAmount;
				});

			});
		} catch (error) {
			console.error('Error initializing materialCardScrolling:', error);
		}
	};

    that.create = function (settings) {
		 if (!config?.layout?.searchResults) {
			console.error("Missing config.layout.searchResults");
		 }
		 
		var instanceId = generateUniqueId();
        that.instances[instanceId] = {
            currentIndex: 0,
            totalItems: 0,
            lastScrollLeft: 0,
            settings: settings
        };
         
		 var initialHtml = generateHtmlForRange(settings, 0, pageSize);
		 
		 var htmlWrapper = `
            <div class="materialCardsScrolling help-scrolling-course-cards" data-instance="${instanceId}">
                <div class="overlay scrollLeft">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4.5L7.5 12L15 19.5" stroke="#F9F4DE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div class="overlay scrollRight">
                    <svg viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.99121 4.88672L17.9911 12.8866L9.99121 20.8864" stroke="#F9F4DE" stroke-width="1.59997" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <div class="materialCardsDiv">
                    ${initialHtml}
                </div>
            </div>
        `;
        that.created = true;

        return htmlWrapper;
    }


    return that;
})();
