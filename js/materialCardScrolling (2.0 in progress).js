var materialCardScrolling = (function () {
    var that = {};
    that.created = false; 
	that.instances = {};  // Object to hold states for each instance
    that.instanceIdCounter = 0; // Counter to generate unique IDs

    // Constants
    that.pageSize = 10; 
    that.maxItemsInView = 15;
    that.bufferPixels = 800; //Pixels 

    that.generateUniqueId = function() {
        return "" + (that.instanceIdCounter++);
    }
 
    that.createInstanceState = function (id, list) {
        that.instances[id] = {
            currentIndex: 0,
            totalItems: list.ids.length,
            lastScrollLeft: 0,
            list: list,
            isUpdating: false
        };
    }; 

	that.appendItems = function (materialCardsDiv, html) {
		var beforeAppend = materialCardsDiv.children.length;
        materialCardsDiv.insertAdjacentHTML('beforeend', html);
        var afterAppend = materialCardsDiv.children.length;
        console.log("[appendItems] Before Append:", beforeAppend, "After Append:", afterAppend);
    
	};

	that.prependItems = function (materialCardsDiv, html) {
        var beforePrepend = materialCardsDiv.children.length;
        materialCardsDiv.insertAdjacentHTML('afterbegin', html);
        var afterPrepend = materialCardsDiv.children.length;
        console.log("[prependItems] Before Prepend:", beforePrepend, "After Prepend:", afterPrepend);
    };

    that.removeChildNodes = function (parentElement, itemsToRemove, isFromStart) {
        console.log("[removeChildNodes] Function called");
        console.log("[removeChildNodes] Parameters received - Items to remove:", itemsToRemove, ", Remove from start:", isFromStart);
    
        if (itemsToRemove > 0) {
            console.log("[removeChildNodes] Starting removal process...");
            for (var i = 0; i < itemsToRemove; i++) {
                if (isFromStart) {
                    console.log("[removeChildNodes] Removing first child...");
                    parentElement.removeChild(parentElement.firstChild);
                } else {
                    console.log("[removeChildNodes] Removing last child...");
                    parentElement.removeChild(parentElement.lastChild);
                }
            }
            console.log("[removeChildNodes] Removal process complete. Current total items:", parentElement.children.length);
        } else {
            console.log("[removeChildNodes] No items to remove. Current total items:", parentElement.children.length);
        }
    };
    
    

    that.updateView = function (instanceId, direction) {
        
        console.log("[updateView] Function called for instance:", instanceId, ", Direction:", direction);
    
        var state = that.instances[instanceId];
        var materialCardsDiv = document.querySelector('[data-instance="' + instanceId + '"] .materialCardsDiv');
        
        if(state.isUpdating) {
            console.log("[updateView] Update already in progress. Skipping update.");
            //return;
        }

         // Current horizontal scroll position.
        var currentScrollLeft = materialCardsDiv.scrollLeft;
        var scrollWidthBeforeUpdate = materialCardsDiv.scrollWidth;
        var someThreshold = 100;

        var condition = Math.abs(currentScrollLeft - state.lastScrollLeft) > someThreshold;
        console.log("[updateView] Scroll condition check:", condition, ", Current scroll position:", currentScrollLeft, ", Last scroll position:", state.lastScrollLeft, ", Threshold:", someThreshold, ", Difference:", Math.abs(currentScrollLeft - state.lastScrollLeft));
        
        if (condition) { 
            console.log("[updateView] Current scroll position:", currentScrollLeft, ", Scroll width before update:", scrollWidthBeforeUpdate);
         
            // Width of the visible area of the scrollable container.
            var viewportWidth = materialCardsDiv.clientWidth;

            // Total width of the scrollable content.
            var totalScrollWidth = materialCardsDiv.scrollWidth;

            // Calculate the threshold for being 'near' the right edge.
            // This is the total width minus the viewport width and buffer pixels.
            var thresholdForRightEdge = totalScrollWidth - viewportWidth - that.bufferPixels;

            // Determine if the current scroll position is near the right edge.
            var nearRightEdge = currentScrollLeft >= thresholdForRightEdge;
 
            var hasMoreItems = state.currentIndex < state.totalItems;
            var nearLeftEdge = currentScrollLeft <= that.bufferPixels;
            var canScrollLeft = state.currentIndex > 0;
        
            console.log("[updateView] Scroll edge check - Near right edge:", nearRightEdge, ", Near left edge:", nearLeftEdge);
        
            if (direction === 'right' && nearRightEdge && hasMoreItems) { 
                state.isUpdating = true;
                
                console.log("[updateView] Adding items to the right...");
        
                var newStartIndex = state.currentIndex + that.pageSize;
                var newHtml = that.generateHtmlForRange({ list: state.list }, state.currentIndex, newStartIndex);
                that.appendItems(materialCardsDiv, newHtml);
                state.currentIndex = newStartIndex;

                var currentTotalItems = materialCardsDiv.children.length;
                var itemsToRemove = Math.max(0, currentTotalItems - that.maxItemsInView);
            
                console.log("[updateView] Calculated items to remove:", itemsToRemove);
                //that.removeChildNodes(materialCardsDiv, itemsToRemove, direction === 'left');
        
                /* setTimeout(function() {
                    console.log("[updateView] Adjusting scroll position...");
                    that.adjustScrollPosition(instanceId, materialCardsDiv, scrollWidthBeforeUpdate, direction);  
                }, 0);
                */

            } else if (direction === 'left' && nearLeftEdge && canScrollLeft) { 
                state.isUpdating = true;

                console.log("[updateView] Adding items to the left...");
        
                var newEndIndex = Math.max(state.currentIndex - that.pageSize, 0);
                var newHtml = that.generateHtmlForRange({ list: state.list }, newEndIndex, state.currentIndex);
                that.prependItems(materialCardsDiv, newHtml);
                state.currentIndex = newEndIndex;

                var currentTotalItems = materialCardsDiv.children.length;
                var itemsToRemove = Math.max(0, currentTotalItems - that.maxItemsInView);
            
                console.log("[updateView] Calculated items to remove:", itemsToRemove);
                //that.removeChildNodes(materialCardsDiv, itemsToRemove, direction === 'left');

                /* setTimeout(function() {
                    console.log("[updateView] Adjusting scroll position...");
                    that.adjustScrollPosition(instanceId, materialCardsDiv, scrollWidthBeforeUpdate, direction);  
                }, 0);
                */
            }
            else if(direction === 'right' && nearRightEdge && !hasMoreItems) { 
                
                const containerWidth = materialCardsDiv.scrollWidth;
                if (materialCardsDiv.scrollLeft + materialCardsDiv.clientWidth >= containerWidth) {
                    materialCardsDiv.scrollLeft -=   100;
                } else {
                    // Show Left Carousel
                    parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'flex';
                } 

            } 
        }
        else{
            console.log("[updateView] No scroll detected. Skipping update.");
        }
    
     
        state.lastScrollLeft = currentScrollLeft;
        console.log("[updateView] Function execution complete for instance:", instanceId);
    };
    
    
    

    that.adjustScrollPosition = function (instanceId, materialCardsDiv, contentWidthChange, direction) {
         
        var state = that.instances[instanceId];
        var beforeAdjust = materialCardsDiv.scrollLeft;
        console.log("[adjustScrollPosition] Adjusting Scroll. Direction:", direction, "New Scroll Left:", materialCardsDiv.scrollLeft);

        console.log("[adjustScrollPosition] Initial Scroll Left:", beforeAdjust);
    
        // Log the contentWidthChange and direction to verify they're as expected
        console.log("[adjustScrollPosition] Content Width Change:", contentWidthChange, "Direction:", direction);
    
        var adjustment;
        if (direction === 'right') {
            adjustment = contentWidthChange; 
        } else if (direction === 'left') {
            adjustment = -contentWidthChange; 
        }
    
        // Apply adjustment and log the intended new scroll position before actually setting it
        var intendedScrollLeft = materialCardsDiv.scrollLeft + adjustment;
        console.log("[adjustScrollPosition] Intended Scroll Left:", intendedScrollLeft);
    
        // Directly set element.scrollLeft to simulate smoothScrollTo functionality
        materialCardsDiv.scrollLeft = intendedScrollLeft;
    
        // Log the actual new scroll position after adjustment
        var afterAdjust = materialCardsDiv.scrollLeft;
        console.log("[adjustScrollPosition] Actual New Scroll Left:", afterAdjust);
    
        // Additional debugging to understand the discrepancy, if any
        if (beforeAdjust === afterAdjust) {
            console.log("[adjustScrollPosition] No Scroll Adjustment Detected. Checking overflow and item widths.");
            // Log the scrollWidth, clientWidth, and overflow status to investigate potential causes
            console.log("Scroll Width:", materialCardsDiv.scrollWidth, "Client Width:", materialCardsDiv.clientWidth, "Overflow:", materialCardsDiv.offsetWidth < materialCardsDiv.scrollWidth ? "Yes" : "No");
        }

        setTimeout(function() {
                state.isUpdating = false;
        }, 100);

    };

    that.smoothScrollTo = function(element, target) {
		/*var start = element.scrollLeft,
			change = target - start,
			startTime = performance.now(),
            duration=500; 

		var animateScroll = function(time) {
			var currentTime = time || performance.now();
			var timeFraction = (currentTime - startTime) / duration;
			if (timeFraction > 1) {timeFraction = 1;}

			var easedTimeFraction = that.easeInOutCubic(timeFraction);
			var newScrollPosition = start + change * easedTimeFraction;
			element.scrollLeft = newScrollPosition;

			if (timeFraction < 1) {
				window.requestAnimationFrame(animateScroll);
			}
		};

		animateScroll();*/
        element.scrollLeft = target;

	};
	

    that.getHtml = function (itemId, settings) {
		var html = '';
        var list = settings.list;
 
        // Column Width
        var columnWidthClass = `cardSearchResult ${config.layout.searchResults}`;

        if (list.type === 'lesson') { 
			if(app.data.lesson.hasOwnProperty(itemId)) {
				var lessonId =  app.data.lesson[itemId]?.id;
				var lesson =  app.data.lesson[itemId];
				html += app.createLessonCard(lessonId, lesson, columnWidthClass);
			}   
        }
		
        if (list.type === 'course') { 
			if(app.data.course.hasOwnProperty(itemId)) {
				var courseId = itemId;
				var course = app.data.course[itemId];
				html += app.createCourseCard(courseId, course, columnWidthClass);
			} 
        }
		
        return html;
	};

    // Placeholder for function to generate HTML for a range
    that.generateHtmlForRange = function (settings, startIndex, endIndex) { 
		var html = '';
        var list = settings.list;
		var ids = list.ids.slice(startIndex, endIndex);
		  
		ids.forEach(function (id) { 
			html += that.getHtml(id, settings);  
		});
		 
		return html;
	}; 

    that.create = function (settings) {
        var list = settings.list;

        //If list is empty render nothing
        if (!list || !list.ids || list.ids.length === 0) {
            console.log('Empty materialCardsScrolling list', settings);
            return '';
        }
        
        
        if(!config?.layout?.searchResults) { 
            throw new Error('config.layout.searchResults is not defined');
        }

        if(!app?.data) { 
            throw new Error('app.data is not defined');
        }

        var instanceId = that.generateUniqueId();
        that.createInstanceState(instanceId, settings.list);

        var initialHtml = that.generateHtmlForRange(settings, 0, that.pageSize);

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

    that.debounceScroll = function (func, delay) {
        var timeout;
        return function () {
            var context = this;
            var args = Array.prototype.slice.call(arguments);

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        };
    };

    // Easing function for smooth transitions
    that.easeInOutCubic = function (timeFraction) {
        return timeFraction < 0.5
            ? 4 * timeFraction * timeFraction * timeFraction
            : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2;
    };

    // Calculate the width of an individual item or group of items
    that.calculateItemWidth = function (cardsScrollingDiv) {
        if (!cardsScrollingDiv || !cardsScrollingDiv.firstElementChild) {
            console.error('Error: Unable to calculate item width - cardsScrollingDiv or its first child element is not found.');
            return null;
        }

        var item = cardsScrollingDiv.firstElementChild;
        var itemStyle = window.getComputedStyle(item);
        var itemWidth = item.offsetWidth;
        var itemMargin = parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight);

        return itemWidth + itemMargin;
    };


    that.init = function () {
        try {
            document.querySelectorAll(".app_coursesCardsContainer").forEach(function (parentDiv) {
                const cardsScrollingDiv = parentDiv.querySelector('.materialCardsDiv'); 
                 
                const itemWidth = that.calculateItemWidth(cardsScrollingDiv);

                if (itemWidth === null) {
                    console.error('Error: Item width calculation failed. Initialization stopped.');
                    return;
                } 

                const scrollAmount = itemWidth; 
                const instanceId = parentDiv.querySelector('.materialCardsScrolling').getAttribute('data-instance'); 
                
                // Hide Left Carousel at first
                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';

                var debouncedScrollHandler = that.debounceScroll(function (event) {
                    console.log("[Scroll Event] Triggered. Current scrollLeft:", cardsScrollingDiv.scrollLeft);

                    var direction = (cardsScrollingDiv.scrollLeft > that.instances[instanceId].lastScrollLeft) ? 'right' : 'left';
                    console.log("[Scroll Event] Determined Direction:", direction);

                    that.updateView(instanceId, direction);

                    console.log("[Scroll Event] Post-updateView. New scrollLeft:", cardsScrollingDiv.scrollLeft);
   
                    if (cardsScrollingDiv.scrollLeft > 0) {
                        parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'flex';
                    } else {
                        parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';
                    } 
                }, 250);

                // Show left Carousel if there is scroll
                cardsScrollingDiv.addEventListener('scroll', debouncedScrollHandler);
                
                // Hide Right Carousel if there is no scroll
                if (cardsScrollingDiv.scrollWidth <= cardsScrollingDiv.clientWidth) {
                    parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').style.display = 'none';
                }

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').addEventListener('click', function (event) { 
                    cardsScrollingDiv.scrollLeft -= scrollAmount; 
                     //LEFT
                    const containerWidth = cardsScrollingDiv.scrollWidth;
                    if (cardsScrollingDiv.scrollLeft <= 0) {
                        cardsScrollingDiv.scrollLeft = 100;
                    }  
                });

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').addEventListener('click', function (event) { 
                    cardsScrollingDiv.scrollLeft += scrollAmount; 
                });
            })
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();