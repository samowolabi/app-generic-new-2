var emailRemoteValidation = function(){
	var that = {};
	 
	that.defaultSettings = function(settings){ 
            settings.maxNumberOfRetries 	= settings.maxNumberOfRetries 	|| 1;
            settings.waitMsBeforeRetrying 	= settings.waitMsBeforeRetrying || 1050;
            
			settings.formCSSSelector				= settings.formCSSSelector 				|| "form";
			settings.emailFieldCSSSelector			= settings.emailFieldCSSSelector 		|| "input[type='email']";
			settings.emailSuggestionCSSSelector		= settings.emailSuggestionCSSSelector 	|| ".emailSuggestion"; 
			
			settings.emailSuggestionDomains = ["yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com", "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk", "facebook.com", "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com", "outlook.com", "earthlink.net"];
			settings.emailSuggestionTopLevelDomains = ["co.jp", "co.uk", "com", "net", "org", "info", "edu", "gov", "mil", "com.au", "com.ar", "fr", "ru"];
 
			settings.callbackInit				= settings.callbackInit						|| function(){ materialSnackBar.push("Add init callback"); };
			settings.callbackSubmitForm 	 	= settings.callbackSubmitForm   			|| function(){ materialSnackBar.push("Add submit form callback"); }; 
			settings.callbackInvalidEmailField 	= settings.callbackInvalidEmailField   		|| function(emailFieldCSSSelector, emailSuggestionCSSSelector){ 
																										 
																										$(".emailErrorNotice").html("* Please enter a valid email address");
																										$(".emailIcon.signup-input-icon").addClass("emailInputError");
																										 $(emailFieldCSSSelector).addClass("emailInputError").focus(); 
																								};
			settings.callbackValidEmailField 	= settings.callbackValidEmailField   		|| function(emailFieldCSSSelector){ 
																										$(".emailErrorNotice").html("");
																										$(".emailIcon.signup-input-icon").removeClass("emailInputError");
																										$(emailFieldCSSSelector).removeClass("emailInputError");
																							   };
			
			settings.callbackWaitStart 	= settings.callbackWaitStart 	|| function(){ materialDialog.showLoading("Hold on...","Verifying your information.", {"theme": "materialThemeDark"}); };
            settings.callbackWaitEnd 	= settings.callbackWaitEnd 		|| function(){ materialDialog.hideLoading();  };
			
			settings.callbackValid 		= settings.callbackValid 		|| function(settings, valid, code, description, email){ 
																				settings.callbackSubmitForm(email);
																			};
																			
			settings.callbackInvalid 	= settings.callbackInvalid 		|| function(settings, valid, code, description, email){ 
																				 switch (code) {
																					case "305": /* Disposable address */
																					   var message = "Disposable Emails are Not Allowed";
																						break;
																					case "420": /* The domain seems to be mispelled */
																						var message = "It seems you made a spelling mistake.";
																						break;
																					default:
																						var message = "It seems you made a mistake.";
																				}
																				
																				materialDialog.alert("Oops! Invalid Email Address...", message, {
																					hideCallback: function(){ 
																						settings.callbackInvalidEmailField(settings.emailFieldCSSSelector, settings.emailSuggestionCSSSelector);
																						$(settings.emailSuggestionCSSSelector).hide();
																						$(settings.emailFieldCSSSelector).val(""); 
																					}, 
																					"theme": "materialThemeDark"
																				});  
																			};
			settings.callbackMaybeValid = settings.callbackMaybeValid 	|| function(settings, valid, code, description, email){ 
																				var callbackYes = function(valid, code, description, email){ settings.callbackSubmitForm(email); };
																				var callbackNo  = function(valid, code, description, email){ 
																						settings.callbackInvalidEmailField(settings.emailFieldCSSSelector, settings.emailSuggestionCSSSelector);
																						$(settings.emailSuggestionCSSSelector).hide();
																						$(settings.emailFieldCSSSelector).val(""); 
																					};
																					
																					materialDialog.confirm("Is it correct: "+email + "?", "Please double-check there is no spelling mistake. Is it correct? ", callbackYes, callbackNo, "Yes",  "No", {"modal": true, "theme": "materialThemeDark"})

																			};
 
            return settings; 
	}
	
	//email is invalid.
							
							
							
	that.___validate = function(email, formData, callbackWaitStart, callbackProcess, retryTimes){
		
		callbackWaitStart();

		$.ajax({
			type: "POST",
			url: "https://pianoencyclopedia.com/en/ajax/verify-email-remotely/",
			data: {
				"s": "frgd5nqRs3",
				"email": email,
				"form_data": formData,
				"format": "json"
			},
			dataType: "json"
		})
		.done(function(data) {
			callbackProcess(true, data);
		})
		.fail(function(ajaxObject, errorCode) {
			callbackProcess(false, errorCode);
		})
		.always(function() { 
		});
	}; 
	
	that._validate = function (settings, retries) {
 		
		var email 	 = $(settings.emailFieldCSSSelector).val();
		var formData = $(settings.formCSSSelector).serialize();
		 
		/* Default number of retries to 1 (value used to count recursive calls) */
		retries = (typeof retries !== 'undefined') ? retries : 1;
 
		that.___validate(email, formData,
			settings.callbackWaitStart,
			function(ajaxSuccess, data) {
				if (ajaxSuccess === true) {

					//Now analyze the success parameter inside the received data
					switch (data.success) {
						case "yes":
 							    switch(data.valid){
									case "yes":
											settings.callbackWaitEnd();
											settings.callbackValid(settings, data.valid, data.code, data.description, email);
										 break;
									case "no":
											settings.callbackWaitEnd();
											settings.callbackInvalid(settings, data.valid, data.code, data.description, email);
										break;
									case "maybe":
											settings.callbackWaitEnd();
											settings.callbackMaybeValid(settings, data.valid, data.code, data.description, email);
										 break;
								}
							break;
						case "retry":
							//retry 
							if (retries < settings.maxNumberOfRetries) {
								window.setTimeout(function() {
									settings.callbackWaitEnd();
									that._validate(settings, retries);
								}, settings.waitMsBeforeRetrying);
								retries++;
							} else {
								settings.callbackWaitEnd();
								settings.callbackMaybeValid(settings, "maybe", "n/a", "n/a", email);
							}

							break;
						case "no":
							settings.callbackWaitEnd();
							settings.callbackMaybeValid(settings, data.valid, data.code, data.description, email);
							
							break;
						default:
							settings.callbackWaitEnd();
							settings.callbackMaybeValid(settings, "error", "n/a", "n/a", email);
					};


				} else {
					//retry 
					if (retries < settings.maxNumberOfRetries) {
						window.setTimeout(function() {
							settings.callbackWaitEnd();
							that._validate(settings, retries);
						}, settings.waitMsBeforeRetrying);
						retries++;
					} else {
						//Ajax request failed after several attempts (e.g "service not available")
						settings.callbackWaitEnd();
						settings.callbackMaybeValid(settings, "maybe", "n/a", "n/a", email);
					}
				}
			}
		);
	} 
	
	that.refreshEmailSuggestion = function(emailFieldCSSSelector, emailSuggestionCSSSelector, domains, topLevelDomains){
		$(emailFieldCSSSelector).mailcheck({
			domains: domains,
			topLevelDomains: topLevelDomains,
			suggested: function(element, suggestion) {
				$(emailSuggestionCSSSelector).html("Did you mean <span class='emailSuggestionText'>" + suggestion.full + "</span>?</a>");
				$(emailSuggestionCSSSelector).css("display", "inline-block");
			},
			empty: function(element) {
				$(emailSuggestionCSSSelector).hide();
			}
		});
	}
	
	that.regexValidateEmail = function(email) {
		var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if (filter.test(email)) {
			return true;
		} else {
			return false;
		}
	}
	
	that.refreshRegexValidateEmail = function(emailFieldCSSSelector, emailSuggestionCSSSelector, callbackValidEmailField, callbackInvalidEmailField){
		var email = $(emailFieldCSSSelector).val();
			 		 
		if(that.regexValidateEmail(email)){
			callbackValidEmailField(emailFieldCSSSelector);
		}
		else{ 
			callbackInvalidEmailField(emailFieldCSSSelector, emailSuggestionCSSSelector);
		}
		
	}
	
	/* Initialize events: call this once*/
	that.init = function(settings = {}){
		var settings = that.defaultSettings(settings);
		
		/* Run init callback */
		settings.callbackInit(settings);
		
		/* Do simple regex validation and email suggestion on change */  
		$(settings.emailFieldCSSSelector).on('blur change', function(event) { 
			that.refreshRegexValidateEmail(settings.emailFieldCSSSelector, settings.emailSuggestionCSSSelector, settings.callbackValidEmailField, settings.callbackInvalidEmailField);
			that.refreshEmailSuggestion(settings.emailFieldCSSSelector, settings.emailSuggestionCSSSelector, settings.emailSuggestionDomains, settings.emailSuggestionTopLevelDomains);	
		});
	 
		/* Fill emailInput Input with suggestion from Mailcheck library on click*/
		$(settings.emailSuggestionCSSSelector).on('click', function(event) {
			event.preventDefault();
			var suggestedEmail = $(settings.emailSuggestionCSSSelector + " .emailSuggestionText").text();
			$(settings.emailFieldCSSSelector).val(suggestedEmail);
			$(settings.emailSuggestionCSSSelector).hide();
			return false;
		});
	}
	
	/* Call this on every validation */
	that.validate = function(settings = {}){
		var settings = that.defaultSettings(settings);
		var email 	 = $(settings.emailFieldCSSSelector).val();
		
		/* Do regex validation before doing remote validation */
		if(that.regexValidateEmail(email)){
			that._validate(settings);
		}
		else{
			settings.callbackInvalid(settings);
		}
		
	}
	
	/* Expose public methods */
	var expose = {};
	expose.validate = that.validate;
	expose.init = that.init;
		
	return expose;
}();