var emailRemoteValidation = function(){
	var that = {};
	
	function qS(q) {
		return document.querySelector(q);
	}
	 
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
																										 
																										qS(".emailErrorNotice").innerHTML = "* Please enter a valid email address";
																										qS(".emailIcon.signup-input-icon").classList.add("emailInputError");
																										qS(emailFieldCSSSelector).classList.add("emailInputError").focus(); 
																								};
			settings.callbackValidEmailField 	= settings.callbackValidEmailField   		|| function(emailFieldCSSSelector){ 
																										qS(".emailErrorNotice").innerHTML = "";
																										qS(".emailIcon.signup-input-icon").classList.remove("emailInputError");
																										qS(emailFieldCSSSelector).classList.remove("emailInputError");
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
																						qS(settings.emailSuggestionCSSSelector).style.display = "none";
																						qS(settings.emailFieldCSSSelector).value = ""; 
																					}, 
																					"theme": "materialThemeDark"
																				});  
																			};
			settings.callbackMaybeValid = settings.callbackMaybeValid 	|| function(settings, valid, code, description, email){ 
																				var callbackYes = function(valid, code, description, email){ settings.callbackSubmitForm(email); };
																				var callbackNo  = function(valid, code, description, email){ 
																						settings.callbackInvalidEmailField(settings.emailFieldCSSSelector, settings.emailSuggestionCSSSelector);
																						qS(settings.emailSuggestionCSSSelector).style.display = "none";
																						qS(settings.emailFieldCSSSelector).value = "";
																					};
																					
																					materialDialog.confirm("Is it correct: "+email + "?", "Please double-check there is no spelling mistake. Is it correct? ", callbackYes, callbackNo, "Yes",  "No", {"modal": true, "theme": "materialThemeDark"});
																				};
 
            return settings; 
	}
	
	//email is invalid.
							
							
							
	that.___validate = function(email, formData, callbackWaitStart, callbackProcess, retryTimes){
		
		callbackWaitStart();
		
		var payload = {
			s: "frgd5nqRs3",
			email: email,
			form_data: formData,
			format: "json"
		};
		
		var params = typeof payload == 'string' ? payload : Object.keys(payload).map(
			function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(payload[k]) }
		).join('&');
		
		// Set up our HTTP request
		var xhr = new XMLHttpRequest();
		
		// Create and send a GET request
		xhr.open('POST', 'https://pianoencyclopedia.com/en/ajax/verify-email-remotely/', true);
		
		xhr.timeout = 7000; // time in milliseconds
		
		// There was a connection error of some sort
		function errorResponse(e) {
			materialDialog.alert("Oops! There is a connection issue", "Please check your internet connection and retry... ", {
				"theme": "materialThemeDark"
			});
			console.log(e);
			callbackProcess(false, e);
		}
		
		// Setup our listener to process completed requests
		xhr.onload = function () {
			// Process our return data
			if (xhr.status >= 200 && xhr.status < 300) {} else {
				errorResponse(xhr.status);
			}
		};
		
		xhr.ontimeout = function (e) {
			// XMLHttpRequest timed out. Do something here.
			errorResponse(e);
		};
		
		xhr.onerror = function(e) {
			errorResponse(e);
		};
		
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4 && xhr.status==200) {
				callbackProcess(true, JSON.parse(xhr.response));
			}
		}
		
		//Send the proper header information along with the request
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(params);
	}; 
	
	that._validate = function (settings, retries) {
 		
		var email 	 = qS(settings.emailFieldCSSSelector).value;
		
		var serializeArray = function (form) {
			// Setup our serialized data
			var serialized = [];
			// Loop through each field in the form
			for (var i = 0; i < form.elements.length; i++) {
				var field = form.elements[i];
				
				// Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
				if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

				// If a multi-select, get all selections
				if (field.type === 'select-multiple') {
					for (var n = 0; n < field.options.length; n++) {
						if (!field.options[n].selected) continue;
						serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
					}
				}

				// Convert field data to a query string
				else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
					serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
				}
			}
			return serialized.join('&');
		};
		
		var formData = serializeArray(qS(settings.formCSSSelector));
		
		var formNameSignup = document.querySelectorAll("form[name='signup'] input");
			formNameSignup.forEach(function(element, index) {
				element.value = element.value.substring(0, 255);
			});
		 
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
		Mailcheck.run({
			email: qS(emailFieldCSSSelector).value,
			domains: domains,
			topLevelDomains: topLevelDomains,
			suggested: function(suggestion) {
				qS(emailSuggestionCSSSelector).innerHTML = "Did you mean <span class='emailSuggestionText'>" + suggestion.full + "</span>?</a>";
				qS(emailSuggestionCSSSelector).style.display = "inline-block";
			},
			empty: function(element) {
				qS(emailSuggestionCSSSelector).style.display = "none";
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
		var email = qS(emailFieldCSSSelector).value;
			 		 
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
		
		// Setup our function to run on various events
		var eventFunction = function (event) {
			that.refreshRegexValidateEmail(settings.emailFieldCSSSelector, settings.emailSuggestionCSSSelector, settings.callbackValidEmailField, settings.callbackInvalidEmailField);
			that.refreshEmailSuggestion(settings.emailFieldCSSSelector, settings.emailSuggestionCSSSelector, settings.emailSuggestionDomains, settings.emailSuggestionTopLevelDomains);	
		};
		qS(settings.emailFieldCSSSelector).addEventListener('blur', eventFunction, false);
		qS(settings.emailFieldCSSSelector).addEventListener('change', eventFunction, false);
	 
		/* Fill emailInput Input with suggestion from Mailcheck library on click*/
		qS(settings.emailSuggestionCSSSelector).addEventListener('click', function(event) {
			event.preventDefault();
			var suggestedEmail = qS(settings.emailSuggestionCSSSelector + " .emailSuggestionText").textContent;
			qS(settings.emailFieldCSSSelector).value = suggestedEmail;
			qS(settings.emailSuggestionCSSSelector).style.display = "none";
			return false;
		});
	}
	
	/* Call this on every validation */
	that.validate = function(settings = {}){
		var settings = that.defaultSettings(settings);
		var email 	 = qS(settings.emailFieldCSSSelector).value;
		
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