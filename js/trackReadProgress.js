var trackReadProgressHandler = null;
function trackReadProgressStop() { 
	if(typeof trackReadProgressHandler === "function"){
		$(window).off('scroll', trackReadProgressHandler);
	}
}
function trackReadProgress(selector, ms, updateCb) {
  //Track p, li, and img inside selector
  const selectorChildren = selector + ' p, ' + selector + ' li, ' + selector + ' img';
  const elementsRead = [];

  function wasInViewport(el, ms, cb) {
		const stats = el.inViewportStatus = el.inViewportStatus || {};
		if (stats.in) {
		  return true;
		}
		const w = window.innerWidth || document.documentElement.clientWidth;
		const h = window.innerHeight || document.documentElement.clientHeight;
		const rect = el.getBoundingClientRect();

		function checkAllEdges(stats, cb) {
		  stats.in = stats.top && stats.bottom && stats.right && stats.left; 
		  if (stats.in) {
			cb();
		  }
		}

		function checkEdge(prop, condCb) {
		  if (stats[prop]) {
			return;
		  }
		  const tid = prop+'timeoutId';
		  if (condCb()) {
			if (typeof stats[tid] === 'undefined') {
			  stats[tid] = setTimeout(function(prop, stats, condCb, checkAllEdges) {
				stats[prop] = condCb();
				checkAllEdges();
			  }.bind(null, prop, stats, condCb, checkAllEdges.bind(null, stats, cb)), 
			  ms);
			}  
		  }
		  else {
			clearTimeout(stats[tid]);
			delete stats[tid];
		  }
		}


		checkEdge('top', function(rect) { 
		  return rect.top >=0 && rect.top < h; 
		}.bind(null, rect));

		checkEdge('bottom', function(rect) { 
		  return rect.bottom >= 0 && rect.bottom < h;
		}.bind(null, rect));

		checkEdge('left', function(rect) { 
		  return rect.left >= 0 && rect.left < w 
		}.bind(null, rect));

		checkEdge('right', function(rect) { 
		  return rect.right >= 0 && rect.right < w 
		}.bind(null, rect));
  }

  function indexElements() {
    $(selectorChildren).each(function(i) {
      this.index = i;
      $(this).addClass(''+i);
    });
  }

  function watchScroll() {
  
    //Unbind previous handler before assigning new, so this script can be run multiple times on the same page (single page application)
	trackReadProgressStop();
	
    trackReadProgressHandler = function() {
      checkRead();
    };
	
    $(window).on('scroll', trackReadProgressHandler);
  }

  function checkRead() {
    var elementsTotalCount = $(selectorChildren).length;
    $(selectorChildren).each(function() {
      if (!elementsRead.includes(this.index)) {
        wasInViewport(this, ms, function() {
          elementsRead.push(this.index);
          $(this).addClass('read');
          
          var elementsReadCount = elementsRead.length;
          var progressReal = Math.round(100 * elementsReadCount/elementsTotalCount);
          var elementBiggestIndex = Math.max.apply(null, elementsRead);
          var progressMax  =   Math.round(100 *(elementBiggestIndex +1) / elementsTotalCount); //Add +1 since index is zero based
          updateCb(elementsRead, elementsReadCount, elementsTotalCount, progressMax, progressReal);
        }.bind(this));
      }
    });
  }

  indexElements();
  watchScroll();
  checkRead();
}