$(document).ready(function() {
		$('.material-tabs').each(function() {

				/* Assign multiple variables to the clicked tab */
				var active, content, links = $(this).find('a');

				var active = $(links[0]);
				active.addClass('active');

				var content = $(active[0].hash);

				links.not(active).each(function() {
						$(this.hash).hide();
				});
				
				/* Set the width of the highlight to be the same with the tab on load event */
				var tabPosition = active.position();
					var tabWidth  = active.outerWidth();
					$(".materialTabHighlight").css({"width":tabWidth, "left":tabPosition.left});
				
	            /* Set the width of the highlight to be the same with the tab on window resize event */
				$(window).resize(function(){
					var tabPosition = active.position();
					var tabWidth  = active.outerWidth();
					$(".materialTabHighlight").css({"width":tabWidth, "left":tabPosition.left});
				});

				$(this).on('click', 'a', function(e) {
					
					    var tabPosition = $(this).position();
					    var tabWidth  = $(this).outerWidth();
					  
					    active.removeClass('active');
						content.hide();

						active = $(this);
						content = $(this.hash);
						
						$(".materialTabHighlight").css({"width":tabWidth, "left":tabPosition.left});

						active.addClass('active');
						content.show();
						
						e.preventDefault();
				});
		});
});