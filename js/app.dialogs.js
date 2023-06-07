var dialogUnlockLesson = function(){
	materialDialog.question("Would you like to unlock this lesson now?", "Get unlimited <i>lifetime</i> access to all lessons from the Members-Area and upgrade to a premium account by ordering  our  world-acclaimed Digital-Home Study Course  'The Logic Behind Music'. <br><br><b>Get  ready to make your musical dreams come true with  The Piano Encyclopedia!</b>",                        
	{
		"buttonNo":{
			caption: "Not yet",
			value: "no"
		},
		"buttonYes":{
			caption: "Unlock All",
			href:  "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/?ref=members-area-unlock",
			additional: "target='_blank'",
			value: "yes"
		} 
	});
	
	app.callback("path=" + app.currentRoute + "&unlock=clicked");
};

$('<div id="dialogPianoLevel" class="materialDialog" data-on-init-callback="dialogPianoLevel.init(thisComponent)"></div>').appendTo('body');
var dialogPianoLevel = {};
dialogPianoLevel.init = function(thisComponent) {

    var header = 'What is your piano level?';
    var subHeader = "We'll send you personalized lessons according to your level:";

    if (material.variables.criticismFlowDifficulty === "easy") {
        header = 'Too easy? ' + (app.data.user.profile.pianoLevel ? "Has your piano level changed?" : "What is your piano level?");
        subHeader = "You mentioned that you found this lesson too easy. We didn't know you already knew this! We'll send you amazing personalized lessons according your level:";
    } else if (material.variables.criticismFlowDifficulty === "hard") {
        header = 'Too hard? ' + (app.data.user.profile.pianoLevel ? "Has your piano level changed?" : "What is your piano level?");
        subHeader = "You mentioned that you found this lesson too hard. Not a problem! We'll send you amazing personalized lessons according your level:";
    }


    var buttonText1 = "Back";
    var buttonText2 = "Save";
    thisComponent.html(`
	<h3>${header}</h3>
	<div class="materialDialogContent">
		<h4>${subHeader}</h4>
		<form action="#">
		   ${materialInputChoice.create({name: "pianoLevel",
				type: "radio",
				inline: false,
				choices: [
					{
						"label": "First-time player",
						"value": "firstTimePlayer",
						"checked": (app.data.user.profile.pianoLevel === "firstTimePlayer")
					},
					{
						"label": "Beginner",
						"value": "beginner",
						"checked": (app.data.user.profile.pianoLevel === "beginner")
					},
					{
						"label": "Intermediate",
						"value": "intermediate",
						"checked": (app.data.user.profile.pianoLevel === "intermediate")
					},
					{
						"label": "Advanced",
						"value": "advanced",
						"checked": (app.data.user.profile.pianoLevel === "advanced")
					}
					]
				})
			}
		</form>
	</div>
	<div class="materialDialogAction">
		${material.history.createBackButton(buttonText1)}
		<button class="materialButtonFill submit" data-on-click-callback=" dialogPianoLevel.submit(value, thisSelection, thisComponent)">
			${buttonText2}
		</button>
	</div>
	`);

    var target = $('input[name=pianoLevel]', thisComponent);
    target.on('change', function() {

        var noChecked = 0;
        $.each(target, function() {
            if ($(this).is(':checked')) {
                noChecked++;
            }
        });
        if (noChecked > 0) {
            $(".materialButtonFill.submit", thisComponent).html(buttonText2);
            $(".materialButtonFill.submit", thisComponent).removeAttr('disabled');
        } else {
            $(".materialButtonFill.submit", thisComponent).html("Choose One");
            $(".materialButtonFill.submit", thisComponent).attr('disabled', 'disabled');
        }
    });

    if (!app.data.user.profile.pianoLevel) {
        $(".materialButtonFill.submit", thisComponent).html("Choose One");
        $(".materialButtonFill.submit", thisComponent).attr('disabled', 'disabled');
    }
};

dialogPianoLevel.submit = function(value, thisSelection, thisComponent) {
   if (material.variables.criticismFlow) {
        material.variables.criticismFlow.removeItemByValue("easy");
        material.variables.criticismFlow.removeItemByValue("hard");
        material.variables.criticismFlow.removeItemByValue("profileLevel");
    }

    var checkedElement = $('input[name=pianoLevel]:checked', thisComponent);
    
	app.data.user.profile.pianoLevel = checkedElement.val();
	app.callback('path=' + app.currentRoute + '&level='+app.data.user.profile.pianoLevel); 
	
    var checkedElementText = checkedElement.parent().find('span').text();
    materialSnackBar.push("Your piano level was saved: " + checkedElementText);

    dialogLessonCriticism.flow(value, thisSelection, thisComponent);
	 
};




$('<div id="dialogLessonRating" class="materialDialog" data-on-init-callback="dialogLessonRating.init(thisComponent)"></div>').appendTo('body');
var dialogLessonRating = {};
dialogLessonRating.init = function(thisComponent) {

    var header = "Did you enjoy this lesson?";
    var subHeader = "Rate this lesson so we can send you amazing personalized content that you love.";

    if (typeof thisLesson().rating !== "undefined") {
        header = "Would you like to change your rating?";
    }

    var buttonText = ["Select a Rating", "Next"];
    thisComponent.html(`
		<h3 class="text-center">${header}</h3>
		<div class="materialDialogContent">
			<h4 class="text-center">${subHeader}</h4>
			 ${materialRating.create({icon: "fa fa-star", name:"rating", onClickNoHide: true, rating: thisLesson().rating})}
		</div>
		<div class="materialDialogAction">
			<button class="materialButtonFill" disabled="disabled" data-on-click-callback="dialogLessonRating.submit(value, thisSelection, thisComponent)">
				${buttonText[0]}
			</button>
		</div>`);

    var ratingInput = $('input[name=rating]', thisComponent);
    ratingInput.on('change', function() {
        $('.materialButtonFill', thisComponent).html(buttonText[1]).removeAttr('disabled');
    });

    if (typeof thisLesson().rating !== "undefined") {
        $('.materialButtonFill', thisComponent).html(buttonText[1]).removeAttr('disabled');
    }
};

dialogLessonRating.submit = function(value, thisSelection, thisComponent) {
    thisLesson().rating = $('input[name=rating]:checked', thisComponent).val();
    dialogLessonRating.flow(value, thisSelection, thisComponent);
}

dialogLessonRating.flow = function(value, thisSelection, thisComponent) {
	
	app.callback('path=' + app.currentRoute + '&rating='+thisLesson().rating); 
	
    if (thisLesson().rating > 3) {
        materialDialog.show('dialogLessonTestimonial', material.history.getLastSettings())
    } else {
        materialDialog.show('dialogLessonCriticism', material.history.getLastSettings())
    }

}




$('<div id="dialogLessonTestimonial" class="materialDialog" data-on-init-callback="dialogLessonTestimonial.init(thisComponent)"></div>').appendTo('body');
var dialogLessonTestimonial = {};
dialogLessonTestimonial.init = function(thisComponent) {

    var header = `Great! You rated this lesson with a ${thisLesson().rating}/5`;
    var subheader = "We are glad you enjoyed it! Feel free to write a few lines and let us know what you enjoyed the most so we can send you even more amazing personalized content:";
    
	var buttonText1 = "Change Rating";
    var buttonText2 = "Send";
    var textAreaPlaceHolder = "Write your feedback here...";
    thisComponent.html(`
	<h3>${header}</h3>
	<div class="materialDialogContent">
		<h4>${subheader}</h4>
		<textarea placeholder="${textAreaPlaceHolder}" name="testimonial" class="materialInputTextArea" cols="30" rows="5"></textarea>
	</div>
	<div class="materialDialogAction">
		${material.history.createBackButton(buttonText1)}
		<button class="materialButtonFill" data-on-click-callback=" dialogLessonTestimonial.submit(value, thisSelection, thisComponent)">
			${buttonText2}
		</button>
	</div>`);
};

dialogLessonTestimonial.submit = function(value, thisSelection, thisComponent) {
    thisLesson().testimonial = $('textarea[name=testimonial]', thisComponent).val();
    materialSnackBar.push("Thank you for your feedback! More amazing content to come!");
	
	app.callback('path=' + app.currentRoute + '&testimonial=positive'); 
}




$('<div id="dialogLessonOtherReasons" class="materialDialog" data-on-init-callback="dialogLessonOtherReasons.init(thisComponent)"></div>').appendTo('body');
var dialogLessonOtherReasons = {};
dialogLessonOtherReasons.init = function(thisComponent) {

    var header = `Our staff of musicians wants to hear from you...`;
    var subheader = "You mentioned you had other reasons why you didn't enjoy this lesson. Please write a few lines and let us know what they are so we can send you amazing personalized content that you love:";
    var buttonText1 = "back";
    var buttonText2 = "Send";
    var textAreaPlaceHolder = "Write your feedback here...";
    thisComponent.html(`
	<h3>${header}</h3>
	<div class="materialDialogContent">
		<h4>${subheader}</h4>
		<textarea placeholder="${textAreaPlaceHolder}" name="otherReasons"  class="materialInputTextArea" cols="30" rows="5"></textarea>
	</div>
	<div class="materialDialogAction">
		 ${material.history.createBackButton(buttonText1)}
		<button class="materialButtonFill" data-on-click-callback=" dialogLessonOtherReasons.submit(value, thisSelection, thisComponent)">
			${buttonText2}
		</button>
	</div>`);
};

dialogLessonOtherReasons.submit = function(value, thisSelection, thisComponent) {
    if (material.variables.criticismFlow) {
        material.variables.criticismFlow.removeItemByValue("others");
    }
    thisLesson().otherReasons = $('textarea[name=otherReasons]', thisComponent).val();
    dialogLessonCriticism.flow(value, thisSelection, thisComponent);
	
	app.callback('path=' + app.currentRoute + '&testimonial=negative'); 
}




$('<div id="dialogLessonCriticism" class="materialDialog" data-on-init-callback="dialogLessonCriticism.step1.init(thisComponent)"></div>').appendTo('body');
var dialogLessonCriticism = {};
dialogLessonCriticism.step1 = {};
dialogLessonCriticism.step1.init = function(thisComponent) {

    var header = `Oops! You rated this lesson with a ${thisLesson().rating}/5`;
    var subHeader = "Tell us why, so we can send you amazing personalized content that you love:";
    
	
	if($(window).width() > 500){
		var buttonText1 = "Change Rating";
	}
	else{
		var buttonText1 = "Undo";
	}
	
    var buttonText2 = ["Choose Any", "Next"];
    var choices = ["It was <b>too easy</b>", "It was <b>too hard</b>", "It was unrelated to the <b>skills</b> I want to develop", "It was unrelated to the <b>music genres</b> I love", "Other reasons"];

    thisComponent.html(`
	<h3>${header}</h3>
	<div class="materialDialogContent">
		<h4>${subHeader}</h4>
		<form action="#">
		   ${materialInputChoice.create({
				name: "lessonCriticism",
				type: "checkbox",
				inline: false,
				choices: [
					{
						"label": choices[0],
						"value": "easy",
					},
					{
						"label": choices[1],
						"value": "hard",
					},
					{
						"label": choices[2],
						"value": "interests"
					},
					{
						"label": choices[3],
						"value": "genres"
					},
					{
						"label": choices[4],
						"value": "others"
					}
				]
				})
			}
		</form>
	</div>
	<div class="materialDialogAction">
		${material.history.createBackButton(buttonText1)}
		<button disabled="disabled" class="materialButtonFill" data-on-click-callback=" dialogLessonCriticism.step1.submit(value, thisSelection, thisComponent)">
			${buttonText2[0]}
		</button>
	</div>
	`);

    /* If user clicks on "Too easy", uncheck "Too hard"; and vice-versa. */
    var checkboxTooEasy = $('input[name=lessonCriticism][value=easy]', thisComponent);
    checkboxTooEasy.on('change', function() {
        $('input:checkbox[name=lessonCriticism][value=hard]').attr('checked', false);
    });

    var checkboxTooHard = $('input[name=lessonCriticism][value=hard]', thisComponent);
    checkboxTooHard.on('change', function() {
        $('input:checkbox[name=lessonCriticism][value=easy]').attr('checked', false);
    });

    var checkboxes = $('input[name=lessonCriticism]', thisComponent);
    checkboxes.on('change', function() {

        var noChecked = 0;
        $.each(checkboxes, function() {
            if ($(this).is(':checked')) {
                noChecked++;
            }
        });

        if (noChecked > 0) {
            $('.materialButtonFill', thisComponent).html(buttonText2[1]).removeAttr('disabled');
        } else {
            $('.materialButtonFill', thisComponent).html(buttonText2[0]).attr('disabled', 'disabled');
        }
    });

}

dialogLessonCriticism.step1.submit = function(value, thisSelection, thisComponent) {
    material.variables.criticismFlow = [];
    var checkedElements = $('input[name=lessonCriticism]:checked', thisComponent);
    $.each(checkedElements, function() {
        material.variables.criticismFlow.push($(this).val());
    });

    /* Clone a copy to store the selectted answers */ 
    thisLesson().criticism = material.variables.criticismFlow.slice();

    dialogLessonCriticism.flow(value, thisSelection, thisComponent);
};

dialogLessonCriticism.flow = function(value, thisSelection, thisComponent) {
	 //If value is an empty array [], it will still validate as "true" and flow will run. That is expected, we set "material.variables.criticismFlow = false" at the very end of the flow.
    if (!material.variables.criticismFlow) return;

    /* Find values; process in specific order  */
    var easyIndex = material.variables.criticismFlow.indexOf("easy");
    var hardIndex = material.variables.criticismFlow.indexOf("hard");
    var genresIndex = material.variables.criticismFlow.indexOf("genres");
    var interestsIndex = material.variables.criticismFlow.indexOf("interests");
    var othersIndex = material.variables.criticismFlow.indexOf("others");

    material.variables.criticismFlowDifficulty = false;
    material.variables.criticismFlowGenres = false;
    material.variables.criticismFlowInterests = false;

    /* Flow for missing profile data */
    var profileLevelIndex = material.variables.criticismFlow.indexOf("profileLevel");
    var profileGenresIndex = material.variables.criticismFlow.indexOf("profileGenres");
    var profileInterestsIndex = material.variables.criticismFlow.indexOf("profileInterests");

    if (profileLevelIndex !== -1) {
        material.variables.criticismFlowDifficulty = "profile";

        var settings = material.history.getLastSettings();
        settings.hideCallback = function() {
            app.saveToServer();
        };

        materialDialog.show('dialogPianoLevel', settings);
        return;
    }
    if (profileInterestsIndex !== -1) {
        material.variables.criticismFlowInterests = "profile";

        var settings = material.history.getLastSettings();
        settings.hideCallback = function() {
            app.saveToServer();
        };

        materialDialog.show('materialDialogInterests', settings);
        return;
    }
    if (profileGenresIndex !== -1) {
        material.variables.criticismFlowGenres = "profile";

        var settings = material.history.getLastSettings();
        settings.hideCallback = function() {
            app.saveToServer();
        };

        materialDialog.show('materialDialogGenres', settings);
        return;
    }

    /* Criticism flow */
    if (easyIndex !== -1) {
        material.variables.criticismFlowDifficulty = "easy";
	   /* If too easy, only show dialog piano level if the level is not advanced */
        if (app.data.user.profile.pianoLevel !== "advanced") {
             var settings = material.history.getLastSettings();
			settings.hideCallback = function() {
				 app.saveToServer(); 
			}; 
			materialDialog.show('dialogPianoLevel', settings); 
            return;
        }
    }
    if (hardIndex !== -1) {
        material.variables.criticismFlowDifficulty = "hard";

        /* If too hard, only show dialog piano level if the level is not firstTimePlayer */
        if (app.data.user.profile.pianoLevel !== "firstTimePlayer") {
            
			var settings = material.history.getLastSettings();
			settings.hideCallback = function() {
				app.saveToServer();
			};
			
			materialDialog.show('dialogPianoLevel', settings);
            return;
        }
    }
    if (interestsIndex !== -1) {
        material.variables.criticismFlowInterests = "criticism";
        
		var settings = material.history.getLastSettings();
		settings.hideCallback = function() {
			app.saveToServer();
		};
			
		materialDialog.show('materialDialogInterests', settings);
        return;
    }
    if (genresIndex !== -1) {
        material.variables.criticismFlowGenres = "criticism";
       
		var settings = material.history.getLastSettings();
		settings.hideCallback = function() {
			app.saveToServer();
		}; 
		
		materialDialog.show('materialDialogGenres', settings);
        return;
    }
    if (othersIndex !== -1) {
	
		var settings = material.history.getLastSettings();
		settings.hideCallback = function() {
			app.saveToServer();
		};
		
        materialDialog.show('dialogLessonOtherReasons', settings);
        return;
    }

    /* This flow has finished */
    material.history.clear();
    materialSnackBar.push("Thank you for your feedback! We have updated your learning preferences.");
	material.variables.criticismFlow = false; //Convert empty array into false

    return;


};




$('<div id="materialDialogInterests" class="materialDialog" data-on-init-callback="materialDialogInterests.init(thisComponent)"></div>').appendTo('body');
var materialDialogInterests = {};
materialDialogInterests.init = function(thisComponent) {

    var headers = ['What are you most interested in learning?', 'Great! Choose two more interests...', 'One last additional interest...', 'Alright. You\'re done!'];
    var subHeaders = ["We'll team you up with the right teachers from our Staff of Musicians:", "The order is important, we will give priority to the interests you choose first:", "The order is important, we will give priority to the interests you choose first:", "Click on 'Save' button to continue..."];
    var buttonText1 = "Back";
    var buttonText2 = ["Choose 3", "Choose 2 More", "Choose 1 More", "Save"];
    var choices = ["Playing your favorite music", "Improvisation", "Composition", "Playing by Ear", "Reading music at first sight"];


    if (material.variables.criticismFlowInterests === "criticism") {
        subHeaders = ["You mentioned this lesson was unrelated to the skills you want to develop. We have lessons for every skill you want to master. Personalize your learning experience:", "The order is important, we will give priority to the interests you choose first:", "The order is important, we will give priority to the interests you choose first:", "Click on 'Save' button to continue..."];
    }

    app.data.user.profile.interests = app.data.user.profile.interests || [];

    if (app.data.user.profile.interests.length === 3) {
        headers = ['Have your learning interests changed?', 'Great! Choose two more interests...', 'One last additional interest...', 'Alright. You\'re done!'];
    }


    thisComponent.html(`
	<h3>${headers[0]}</h3>
	<div class="materialDialogContent">
		<h4>${subHeaders[0]}</h4>
		<form action="#">
		   ${materialInputChoice.create({name: "interests",
				type: "checkbox",
				inline: false,
				choices: [
					{
						"label": choices[0],
						"value": "learnSongs",
						"checked": (app.data.user.profile.interests.indexOf("learnSongs") !== -1)
					},
					{
						"label": choices[1],
						"value": "improvisation",
						"checked": (app.data.user.profile.interests.indexOf("improvisation") !== -1)
					},
					{
						"label": choices[2],
						"value": "composition",
						"checked": (app.data.user.profile.interests.indexOf("composition") !== -1)
					},
					{
						"label": choices[3],
						"value": "playByEar",
						"checked": (app.data.user.profile.interests.indexOf("playByEar") !== -1)
					},
					{
						"label": choices[4],
						"value": "readSheetMusic",
						"checked": (app.data.user.profile.interests.indexOf("readSheetMusic") !== -1)
					}
				]
				})
			}
		</form>
	</div>
	<div class="materialDialogAction">
		 ${material.history.createBackButton(buttonText1)}
		<button class="materialButtonFill submit" disabled="disabled" data-on-click-callback=" materialDialogInterests.submit(value, thisSelection, thisComponent)">
			${buttonText2[0]}
		</button>
	</div>
	`);

    var target = $('input[name=interests]', thisComponent);
    target.on('change', function() {

        var idx = app.data.user.profile.interests.indexOf($(this).val());

        if (idx !== -1) { // if already in array
            app.data.user.profile.interests.splice(idx, 1); // make sure we remove it
        }

        if (this.checked) { // if checked
            app.data.user.profile.interests.push($(this).val()); // add to end of array
        }

        var noChecked = 0;
        $.each(target, function() {
            if ($(this).is(':checked')) {
                noChecked++;
            }
        });
        if (noChecked >= 3) {
            $.each(target, function() {
                if ($(this).not(':checked').length == 1) {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $(".materialButtonFill.submit", thisComponent).html("Save");
            $(".materialButtonFill.submit", thisComponent).removeAttr('disabled');
        } else {
            target.removeAttr('disabled');
            $(".materialButtonFill.submit", thisComponent).html(buttonText2[noChecked]);
            $(".materialButtonFill.submit", thisComponent).attr('disabled', 'disabled');
        }
        $("h3", thisComponent).html(headers[noChecked]);
        $("h4", thisComponent).html(subHeaders[noChecked]);
    });

    if (app.data.user.profile.interests.length > 0) {
        var noChecked = 0;
        $.each(target, function() {
            if ($(this).is(':checked')) {
                noChecked++;
            }

        });
        if (noChecked >= 3) {
            $(".materialButtonFill.submit", thisComponent).removeAttr('disabled');
            $.each(target, function() {
                if ($(this).not(':checked').length == 1) {
                    $(this).attr('disabled', 'disabled');
                }
            });
        };
        $(".materialButtonFill.submit", thisComponent).html(buttonText2[noChecked]);
    }
};


materialDialogInterests.submit = function(value, thisSelection, thisComponent) {
    
	if (material.variables.criticismFlow) {
        material.variables.criticismFlow.removeItemByValue("interests");
        material.variables.criticismFlow.removeItemByValue("profileInterests");
    }
	
    materialSnackBar.push("Your learning interests were saved.");
    dialogLessonCriticism.flow(value, thisSelection, thisComponent);
	
	app.callback('path=' + app.currentRoute + '&interests='+app.data.user.profile.interests.toString()); 


};




$('<div id="materialDialogGenres" class="materialDialog" data-on-init-callback="materialDialogGenres.init(thisComponent)"></div>').appendTo('body');
var materialDialogGenres = {};
materialDialogGenres.init = function(thisComponent) {

    var headers = ['What are you favorite music genres?', 'Alright! Choose two more genres..', 'One last additional genre...', 'Awesome. You\'re done!'];
    var subHeaders = ["We'll personalize your lessons according to the music genres you love:", "The order is important, we will give priority to the genres you choose first:", "The order is important, we will give priority to the genres you choose first:", "Click on 'Save' button to continue..."];
    var buttonText1 = "Back";
    var buttonText2 = ["Choose 3", "Choose 2 More", "Choose 1", "Save"];
    var choices = ["Classical", "Jazz", "Blues", "Rock", "Pop", "Gospel"];


    if (material.variables.criticismFlowGenres === "criticism") {
        subHeaders = ["You mentioned this lesson was unrelated to the music you love. We have lessons tailored for every specific music genre. Personalize your learning experience:", "The order is important, we will give priority to the genres you choose first:", "The order is important, we will give priority to the genres you choose first:", "Click on 'Save' button to continue..."];
    }

    app.data.user.profile.genres = app.data.user.profile.genres || [];

    if (app.data.user.profile.genres.length === 3) {
        headers = ['Have your favorite genres changed?', 'Alright! Choose two more genres..', 'One last additional genre...', 'Awesome. You\'re done!'];
    }


    thisComponent.html(`
	<h3>${headers[0]}</h3>
	<div class="materialDialogContent">
		<h4>${subHeaders[0]}</h4>
		<form action="#">
		   ${materialInputChoice.create({name: "genres",
				type: "checkbox",
				inline: false,
				choices: [
					{
						"label": choices[0],
						"value": "classical",
						"checked": (app.data.user.profile.genres.indexOf("classical") !== -1)
					},
					{
						"label":  choices[1],
						"value": "jazz",
						"checked": (app.data.user.profile.genres.indexOf("jazz") !== -1)
					},
					{
						"label":  choices[2],
						"value": "blues",
						"checked": (app.data.user.profile.genres.indexOf("blues") !== -1)
					},
					{
						"label":  choices[3],
						"value": "rock",
						"checked": (app.data.user.profile.genres.indexOf("rock") !== -1)
					},
					{
						"label":  choices[4],
						"value": "pop",
						"checked": (app.data.user.profile.genres.indexOf("pop") !== -1)
					},
					{
						"label":  choices[5],
						"value": "gospel",
						"checked": (app.data.user.profile.genres.indexOf("gospel") !== -1)
					}
				]
				})
			}
		</form>
	</div>
	<div class="materialDialogAction">
		 ${material.history.createBackButton(buttonText1)}
		<button class="materialButtonFill submit" disabled="disabled" data-on-click-callback=" materialDialogGenres.submit(value, thisSelection, thisComponent)">
			${buttonText2[0]}
		</button>
	</div>
	`);

    var target = $('input[name=genres]', thisComponent);
    target.on('change', function() {

        var idx = app.data.user.profile.genres.indexOf($(this).val());

        if (idx !== -1) { // if already in array
            app.data.user.profile.genres.splice(idx, 1); // make sure we remove it
        }

        if (this.checked) { // if checked
            app.data.user.profile.genres.push($(this).val()); // add to end of array
        }

        var noChecked = 0;
        $.each(target, function() {
            if ($(this).is(':checked')) {
                noChecked++;
            }
        });
        if (noChecked >= 3) {
            $.each(target, function() {
                if ($(this).not(':checked').length == 1) {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $(".materialButtonFill.submit", thisComponent).html("Save");
            $(".materialButtonFill.submit", thisComponent).removeAttr('disabled');
        } else {
            target.removeAttr('disabled');
            $(".materialButtonFill.submit", thisComponent).html(buttonText2[noChecked]);
            $(".materialButtonFill.submit", thisComponent).attr('disabled', 'disabled');
        }
        $("h3", thisComponent).html(headers[noChecked]);
        $("h4", thisComponent).html(subHeaders[noChecked]);
    });

    if (app.data.user.profile.genres.length > 0) {
        var noChecked = 0;
        $.each(target, function() {
            if ($(this).is(':checked')) {
                noChecked++;
            }

        });
        if (noChecked >= 3) {
            $(".materialButtonFill.submit", thisComponent).removeAttr('disabled');
            $.each(target, function() {
                if ($(this).not(':checked').length == 1) {
                    $(this).attr('disabled', 'disabled');
                }
            });
        };
        $(".materialButtonFill.submit", thisComponent).html(buttonText2[noChecked]);
    }
};


materialDialogGenres.submit = function(value, thisSelection, thisComponent) {
    if (material.variables.criticismFlow) {
        material.variables.criticismFlow.removeItemByValue("genres");
        material.variables.criticismFlow.removeItemByValue("profileGenres");
    }
    materialSnackBar.push("Your favorite music genres were saved.");
    dialogLessonCriticism.flow(value, thisSelection, thisComponent);
	
	app.callback('path=' + app.currentRoute + '&genres='+app.data.user.profile.genres.toString()); 
	 
};


/* Flow of dialogs to make user complete profile info */
var dialogsCompleteProfileFlow = function() {
    var genresCompleteness = app.data.user.profile.genres ? app.data.user.profile.genres.length : 0;
    var interestsCompleteness = app.data.user.profile.interests ? app.data.user.profile.interests.length : 0;
    var pianoLevelCompleteness = app.data.user.profile.pianoLevel ? 1 : 0;

    material.variables.criticismFlow = false;
	if (!pianoLevelCompleteness) {
        material.variables.criticismFlow  = material.variables.criticismFlow  || [];
		material.variables.criticismFlow.push("profileLevel");
    }
    if (interestsCompleteness < 3) {
        material.variables.criticismFlow  = material.variables.criticismFlow  || [];
		material.variables.criticismFlow.push("profileInterests");
    }
    if (genresCompleteness < 3) {
        material.variables.criticismFlow  = material.variables.criticismFlow  || [];
		material.variables.criticismFlow.push("profileGenres");
    }

    material.history.clear();
    dialogLessonCriticism.flow();
}


var showDialogPianoLevelOnProfilePage = function(){
	var settings = {};
	settings.hideCallback = function() {
		app.saveToServer(); material.history.clear();
		app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.profile.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.profile.content();}, 
					callback : 		  function(){}
		}); 
	};
	materialDialog.show('dialogPianoLevel', settings); 
}

var showDialogInterestsOnProfilePage = function(){
	var settings = {};
	settings.hideCallback = function() {
		app.saveToServer(); material.history.clear();
		app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.profile.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.profile.content();}, 
					callback : 		  function(){}
		}); 
	};
	materialDialog.show('materialDialogInterests', settings);
	
} 

var showDialogGenresOnProfilePage = function(){
	var settings = {};
	settings.hideCallback = function() {
		app.saveToServer(); material.history.clear();
		app.html({
					target: "#content", 
					loading: 		  function(){ return app.templates.pages.profile.loading();}, 
					contentCondition: function(){ return true; },
					contentTrue:  	  function(){ return app.templates.pages.profile.content();}, 
					callback : 		  function(){}
		}); 
	};
	materialDialog.show('materialDialogGenres', settings); 
}