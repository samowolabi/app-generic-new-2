app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.newHome = {
	loading: function (target) {
		var html = `
					<div class="container"> 
						<div id="page-lesson-lesson" style="margin-top: 65px;">${app.templates.modules.lesson.loading()}</div>
						<div id="page-lesson-cards" class="row">${app.templates.modules.actionCards.loading()}</div>
						<div id="page-lesson-cards" class="row" style="margin-bottom: 30px;">${app.templates.modules.lessonsOutline.loading()}</div>
					</div>
					`;

		return html;
	},
	content: function () {
		var data = app.data;
		var name = data.user.profile.name ? (data.user.profile.name + ",") : "";

		//Create rewards Sections
		// var rewardsSectionResult = app.templates.modules.rewardsLevel.content({ linkToRewardsPage: true });
		var htmlRewardsSection1 = app.templates.modules.rewardsLevel.content('section1');
		var htmlRewardsSection2 = app.templates.modules.rewardsLevel.content('section2'); //Not used


		// Create Profile Card
		var genresCompleteness 	   = app.data.user.profile.genres 	  ? app.data.user.profile.genres.length    : 0;
		var interestsCompleteness  = app.data.user.profile.interests  ? app.data.user.profile.interests.length : 0; 
		var pianoLevelCompleteness = app.data.user.profile.pianoLevel ? 1 : 0; 

		var completenessScore = genresCompleteness + interestsCompleteness + pianoLevelCompleteness;
		var total 		 	  = 3 + 3 + 1;
		var completenessPorcentage =  Math.round(completenessScore / total * 100);

		var text, action; 

		if(!pianoLevelCompleteness){
			text   = "<b>What is your piano level?</b>";
		}else{ 
			if(interestsCompleteness<3){
				text = "<b>What are your learning interests?</b>";
			}else{
				if(genresCompleteness<3){
					text = "<b>What are your favorite music genres?</b>";		
				} 
				else{
					text = "";
				}
			}
		}


		const formatAndValidateData = (data) => {
			if (!Array.isArray(data)) { return [] }

			const combinedArray = []
			data.forEach(item => {
				if (Array.isArray(item.lesson.ids) && item.lesson.ids.length > 0) {
					combinedArray.push({
						header: item.header,
						lesson: item.lesson
					})
				}
			})
			return combinedArray;
		}

		var lessonArray = [
			{
				header: 'Resume Your Lessons',
				lesson: { 
					ids: app.data.user.recommendations.data.toResume.lessonsIds,
					type: 'lesson'
				}
			},
			{
				header: 'Resume Your Courses',
				lesson: { 
					ids: app.data.user.recommendations.data.toResume.coursesIds,
					type: 'course'
				},
			},
			{
				header: 'NEW LESSONS',
				lesson: { 
					ids: app.data.user.recommendations.data.newest.lessonsIds,
					type: 'lesson'
				}
			},
			{
				header: 'NEW COURSES',
				lesson: { 
					ids: app.data.user.recommendations.data.newest.coursesIds,
					type: 'course'
				},
			},
			{
				header: 'Lessons about to Expire',
				lesson: { 
					ids: app.data.user.recommendations.data.expiring.lessonsIds,
					type: 'lesson'
				},
			},
			{
				header: 'Courses about to Expire',
				lesson: { 
					ids: app.data.user.recommendations.data.expiring.coursesIds,
					type: 'course'
				},
			},
			{
				header: 'Diversify your learning with these Lessons',
				lesson: { 
					ids: app.data.user.recommendations.data.toDiversifyType.lessonsIds,
					type: 'lesson'
				},
			},
			{
				header: 'Diversify your learning with these Courses',
				lesson: { 
					ids: app.data.user.recommendations.data.toDiversifyType.coursesIds,
					type: 'course'
				},
			}
		]

		// Lesson Type
		let typeArray = Object.keys(app.data.user.recommendations.data.types).map((type, index) => {
			let data = app.data.user.recommendations.data.types[type]
			
			return {
				header: `Recommended ${data.displayName} for You`,
				lesson: {
					ids: data.lessonsIds,
					type: 'lesson'
				},
			}
		})

		// Merge both arrays (lessonArray and typeArray)
		var mergedArrays = [...lessonArray, ...typeArray]


		let heroSectionArrayCourseIds = app.data.user.recommendations.data.thisWeekTopRecommendations.coursesIds.map((courseId, index) => {
			var course = app.data.course[courseId];
			if (course) {
				return {
					title: course.title,
					description: course.subtitle || 'The Piano Encyclopedia',
					image: course.image,
					buttonLink: `#!/course/${courseId}`,
					percentageComplete: course.stats.lessons.totalProgress
				}
			} else {
				return null
			}
		}).filter(item => item !== null)


		let heroSectionArrayLessonIds = app.data.user.recommendations.data.thisWeekTopRecommendations.lessonsIds.map((lessonId, index) => {
			var lesson = app.data.lesson[lessonId];
			if (lesson) {
				return {
					title: lesson.title,
					description: lesson.subtitle || 'The Piano Encyclopedia',
					image: lesson.image,
					buttonLink: `#!/lesson/${lessonId}`,
					percentageComplete: lesson.progress
				}
			} else {
				return null
			}
		}).filter(item => item !== null)

		// Merge both arrays (heroSectionArrayCourseIds and heroSectionArrayLessonIds)
		var heroSectionArray = [...heroSectionArrayCourseIds, ...heroSectionArrayLessonIds]
		

		var html = `
			<style>
				body {
					/* background: #120d0d !important; */
				}
				.materialBarDashboardNavigation {
					display: none !important;
				}
			</style>


			<main class="app_mainContainer">
				<header class="app_headerContainer">
					<div class="app_headerDiv">
						<div><img src="images/logo.png" alt="logo" class="logo"></div>

						<div class="materialSearchBar">
							<div class="materialSearchInputDiv">
								<!--	
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9.90039" cy="9.90015" r="9" stroke="white" stroke-width="1.5"/><path d="M16.5 16.5L22.864 22.864" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>	
								-->	
								
								<div class="materialSearchInputWithBtn">
									<input type="text" class="materialInputTextArea materialThemeDark searchBarInput" placeholder="${config.text.searchBarPlaceholder}" class="">
									
									<div>
										<svg class="clearBtn" width="13" height="13" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1.5L22.8627 22.5627" stroke="#d4d4e3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.8623 1.5L1.49961 22.5627" stroke="#d4d4e3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
										<button class="materialButtonIcon materialThemeDark searchBtn"><i class="fa fa-search"></i></button>
									</div>
								</div>

								<div class="filterSwitchBtn">
									<svg width="18" height="18" viewBox="0 0 23 24" fill="#B6B6B6" xmlns="http://www.w3.org/2000/svg">
										<path d="M19.3716 4.63118V6.68328C19.3716 7.4295 18.9052 8.36228 18.4388 8.82866L14.4279 12.3732C13.8682 12.8396 13.4951 13.7724 13.4951 14.5186V18.5295C13.4951 19.0892 13.122 19.8354 12.6556 20.1152L11.3497 20.9547C10.1371 21.701 8.45811 20.8615 8.45811 19.369V14.4253C8.45811 13.7724 8.085 12.9329 7.71189 12.4665L7.27348 12.0094C6.98432 11.7016 6.92835 11.2352 7.16155 10.8714L11.9374 3.20403C12.1053 2.93352 12.4037 2.76562 12.7302 2.76562H17.506C18.5321 2.76562 19.3716 3.60512 19.3716 4.63118Z" />
										<path d="M9.80994 4.19277L6.49858 9.50026C6.18144 10.0133 5.45388 10.0879 5.03413 9.64951L4.16665 8.73539C3.70026 8.269 3.32715 7.4295 3.32715 6.86984V4.72445C3.32715 3.60512 4.16665 2.76562 5.1927 2.76562H9.01708C9.74464 2.76562 10.1924 3.56781 9.80994 4.19277Z" />
									</svg>
								</div>
							</div>

							<div class="filterFormsContainer">
								<div class="filterFormsDiv">
									<!-- Created dynamically -->
								</div>

								<div class="clearFilterButtonDiv">
									<button class="materialButtonText materialThemeDark">Clear Filters</button>
								</div>
							</div>
						</div>

						
						<div class="mobileNavRightContainer">
							<div class="mobileFilterDivTrigger">
								<svg width="32" height="32" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16.7744" cy="17.2744" r="5.25" stroke="#CFCFCF" stroke-width="1.16667"/><path d="M20.625 21.125L24.3373 24.8373" stroke="#CFCFCF" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/></svg>
							</div>

							<a class="materialBarDashboardNavLink" href="#" data-button="" data-script="if(!app.sidebarOn){ materialDrawer.show('appSidebarMenu',{direction: 'right', initCallback:function(component){ app.updateUI(); app.sidebarOn = true; }, hideCallback: function(){ app.sidebarOn = false;}});}">
								<div class="userProfileDiv">
									<svg width="15.5" height="15.5" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M9.50033 9.49967C11.6865 9.49967 13.4587 7.72747 13.4587 5.54134C13.4587 3.35521 11.6865 1.58301 9.50033 1.58301C7.3142 1.58301 5.54199 3.35521 5.54199 5.54134C5.54199 7.72747 7.3142 9.49967 9.50033 9.49967Z" fill="#A2A2A2" />
										<path d="M9.49996 11.4795C5.53371 11.4795 2.30371 14.1395 2.30371 17.417C2.30371 17.6387 2.47788 17.8128 2.69954 17.8128H16.3004C16.522 17.8128 16.6962 17.6387 16.6962 17.417C16.6962 14.1395 13.4662 11.4795 9.49996 11.4795Z" fill="#A2A2A2" />
									</svg>
									<p>Rod</p>
								</div>
							</a>
						</div>
					</div>
				</header>

				<section class="heroSectionContainer">
					${materialHeroSection.create({
						data: heroSectionArray
					})}
				</section>

				<input type="hidden" class="addPaginationValue" value="1">
				<section class="container marginTop20">
					<div class="row infiniteScrollingContainer">
						<!-- Infinite Scroll Cards -->  
					</div>

					<div class="row">
						<div class="col-sm-12 noResultsDiv" style="display: none;">
							<h3 class='marginTop8 marginBottom8' style='color: #ffffff; text-align: center;'>No results found</h3>
						</div>
					</div>
				</section>
				

				<div class="homeContentContainer">

					<section class="app_ratingsSection">
						${text ? `
							<div class="app_ratingsSectionCard ratingsContent">
								<div class="pianoLevelDiv">
									<div>
										<h2>${data.user.stats.profile.complete}%</h2>
										<span>Complete</span>
									</div>
									<div>
										<h4>${text}</h4>
										<p>Customize your learning experience</p>
									</div>
								</div>
								<button onclick="dialogsCompleteProfileFlow();" class="materialButtonOutline materialThemeGoldDark">Complete</button>
							</div>
						` : ` `
						}
					
						<div class="rewardPointsContainer marginTop4">
							<div class="app_ratingsSectionCard rewardPoints">
								<div>
									<div>
										<!-- <img src="images/newimages/cup.svg"> -->
										<svg width="40" height="40" id="Isolation_Mode" data-name="Isolation Mode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 383.22 384" fill="#cfb647"><path d="M306.9,0c10.71,4.33,7.82,13.9,8.22,22.51h55.53c8.27,0,12.66,4.37,12.57,12.74-.15,13.11.36,26.29-.81,39.31-2.58,28.52-15.05,52.56-35.68,72.19s-45,30.3-73.3,32.53a5.17,5.17,0,0,0-3.35,1.75c-11.55,15.26-25.25,27.9-42.7,36.18-.87.42-1.54,2.36-1.47,3.54,1.56,26.7,9.91,51.28,23.73,74,4.13,6.8,9,13.17,13.58,19.9H119.63c.81-1.09,1.41-2,2.06-2.79C142.5,285.11,154.92,255,157.41,221c.15-2.06,0-3.33-2.25-4.36-16.07-7.46-28.92-18.92-39.68-32.84-2.23-2.88-4.37-4.51-8.39-4.84C54.29,174.72,9.91,133.16,1.42,80.39,1,77.83.48,75.3,0,72.75v-42c2.76-6.21,7.48-8.47,14.26-8.34,16.55.32,33.11.1,49.67.1h4.19C68.54,13.87,65.65,4.32,76.35,0ZM214.51,144.55c7.16-.34,12.26-6.26,11.18-13.29-.89-5.8-2-11.56-2.68-17.38a6.25,6.25,0,0,1,1.41-4.44c3.9-4.2,8.11-8.12,12.16-12.2,3.37-3.39,4.56-7.44,2.85-12-1.63-4.36-4.94-6.69-9.55-7.33-5.43-.75-10.83-1.68-16.26-2.41a5.11,5.11,0,0,1-4.43-3.29c-2.21-4.88-4.79-9.59-7.1-14.43a11.63,11.63,0,0,0-20.92,0c-2.29,4.85-4.9,9.55-7.08,14.45a5.42,5.42,0,0,1-4.79,3.41c-5.18.71-10.33,1.62-15.52,2.25-4.92.61-8.42,3-10.06,7.7s-.05,8.78,3.44,12.2c3.92,3.84,7.92,7.62,11.65,11.65a6.31,6.31,0,0,1,1.44,4.43c-.62,5.44-1.48,10.88-2.51,16.26-1,4.9.2,9,4.2,12,4.17,3.07,8.61,2.67,13,.34,4.73-2.5,9.43-5.09,14.29-7.33a6.31,6.31,0,0,1,4.7,0c5,2.3,9.73,5,14.65,7.46A48.36,48.36,0,0,0,214.51,144.55ZM286,155c24.84-6.38,43.85-19.28,58-39.35,15-21.25,18.46-45.19,16.49-70.43H313.86C310.65,83.09,303.05,119.73,286,155ZM22.82,45.11C20.43,74.3,25.87,101,45.41,123.52c13.68,15.8,30.64,26.15,51.81,31.36C80.16,119.7,72.58,83,69.37,45.11Z"/><path d="M98.81,384c-4.67-2.37-8.28-5.49-8.23-11.32a11.09,11.09,0,0,1,10.8-11.14c3.72-.11,7.44,0,11.58,0v-23.8H270v23.79h10c6.79,0,11.31,3.24,12.51,8.93,1.16,5.43-1.52,10-7.57,13-.2.11-.33.35-.5.53Z"/><path d="M191.63,87.55c2.6,6,6.9,8.92,14,9.14-5.82,4.44-7.33,9.52-5.48,16.31-5.9-3.82-11.18-3.86-17,0,1.7-6.69.42-11.86-5.38-16.18C184.72,96.38,189.14,93.49,191.63,87.55Z"/></svg>
									</div>

									<div>
										<h4>Reward Level ${app.getCurrentRewardLevel() + 1}</h4>
										<p class="paddingTop7">You have ${data.user.stats.lessons.total - data.user.stats.lessons.complete} unfinished lessons.</p>
									</div>
								</div>

								<div>
									<div>
										<!--<img src="images/newimages/medal.svg">-->
										<svg width="40" height="40" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1_7)"><path d="M204.279 0.665817C214.59 3.85062 222.485 10.8995 230.615 17.4473C238.577 23.8726 247.318 27.0017 257.574 26.4449C264.434 26.0774 271.327 26.0886 278.197 26.2779C289.578 26.6008 296.905 31.9014 300.758 42.6918C303.141 49.3732 305.212 56.2439 307.094 63.1035C309.398 71.8354 314.894 79.3854 322.495 84.2613C328.341 88.092 334.098 92.0563 339.666 96.3546C349.131 103.582 351.915 112.089 348.575 123.47C346.526 130.419 344.065 137.256 341.615 144.082C338.575 152.314 338.575 161.362 341.615 169.594C344.031 176.42 346.448 183.269 348.619 190.184C352.082 201.253 349.042 210.417 339.822 217.366C334.224 221.575 328.497 225.603 322.64 229.448C314.939 234.427 309.379 242.105 307.05 250.973C304.823 258.69 302.016 266.218 299.745 273.902C299.411 275.633 299.617 277.425 300.335 279.035C310.127 304.276 319.971 329.517 329.867 354.758C333.207 363.377 329.644 368.399 320.479 367.464C308.223 366.194 295.992 364.709 283.787 363.009C279.689 362.441 276.917 363.176 274.155 366.628C266.36 376.35 258.12 385.704 250.013 395.158C244.501 401.606 237.819 400.537 234.724 392.641C225.024 367.92 215.281 343.21 205.86 318.378C204.19 313.979 202.107 311.975 197.04 313.467C194.635 319.58 192.074 326.072 189.524 332.576C181.744 352.486 173.949 372.397 166.139 392.307C162.798 400.715 156.384 401.806 150.549 394.935C142.453 385.459 134.258 376.072 126.396 366.417C123.846 363.277 121.318 362.475 117.432 363.009C104.971 364.735 92.4765 366.205 79.96 367.53C71.419 368.432 67.6217 363.232 70.7619 355.181C80.6356 329.821 90.5538 304.484 100.516 279.169C100.985 278.063 101.227 276.874 101.227 275.672C101.227 274.471 100.985 273.282 100.516 272.176C97.9775 265.26 95.7727 258.189 93.8351 251.085C91.4975 242.075 85.8153 234.294 77.9445 229.326C72.1873 225.584 66.5749 221.531 61.0962 217.444C51.887 210.495 48.847 201.364 52.2767 190.273C54.3591 183.591 56.5417 176.91 58.9581 170.396C62.2257 161.835 62.2614 152.377 59.0584 143.793C56.2967 135.998 53.691 128.114 51.5863 120.118C48.9583 110.43 52.9671 102.78 60.4837 96.9226C66.2075 92.4683 72.1873 88.3147 78.3008 84.3281C85.8605 79.4011 91.3517 71.8735 93.7348 63.1703C96.1736 54.9968 98.7682 46.8343 101.986 38.9503C105.594 30.1531 113.122 26.701 122.231 26.3558C129.748 26.122 137.286 26.2222 144.803 26.4783C153.58 26.9193 162.199 24.0277 168.934 18.3827C170.95 16.7457 173.076 15.2535 175.092 13.6166C181.584 8.26034 188.332 3.29384 196.495 0.665817H204.279ZM136.785 41.9457H123.122C119.191 41.9457 116.44 43.7275 115.115 47.5136C113.378 52.6694 111.463 57.7918 110.216 63.1035C106.418 79.0387 97.688 91.2545 83.6348 99.829C78.891 102.724 74.4701 106.165 70.0047 109.495C67.0204 111.722 65.7954 114.662 67.076 118.403C68.9357 123.793 70.4167 129.294 72.6439 134.572C75.6325 141.713 77.1631 149.38 77.1459 157.121C77.1287 164.862 75.564 172.522 72.5437 179.649C70.5058 184.683 69.0025 189.928 67.2097 195.061C65.8177 199.059 67.0204 202.233 70.2943 204.627C74.6817 207.856 79.0023 211.208 83.6571 214.025C97.5098 222.488 106.24 234.571 110.093 250.394C111.429 255.962 113.434 261.274 115.249 266.675C115.66 268.199 116.577 269.537 117.85 270.47C119.124 271.403 120.676 271.875 122.253 271.808C128.211 271.808 134.191 272.064 140.07 271.686C156.184 270.661 170.237 275.349 182.386 285.984C185.404 288.634 188.711 290.962 191.929 293.367C198.811 298.512 201.795 298.545 208.633 293.512C211.762 291.195 214.98 288.968 217.886 286.396C230.292 275.427 244.612 270.461 261.193 271.675C266.761 272.087 272.329 271.842 277.897 271.897C282.117 271.897 284.7 269.726 285.959 265.884C287.607 260.84 289.422 255.862 290.658 250.673C294.5 234.715 303.252 222.488 317.384 213.925C322.027 211.108 326.359 207.767 330.746 204.515C333.831 202.21 335.123 199.181 333.764 195.295C331.76 189.549 330.045 183.692 327.84 178.035C322.312 164.407 322.344 149.156 327.929 135.552C330.101 129.984 331.749 124.272 333.697 118.648C334.378 117.007 334.457 115.178 333.919 113.484C333.381 111.79 332.261 110.342 330.758 109.394C326.303 106.054 321.849 102.635 317.105 99.751C303.175 91.2545 294.511 79.1166 290.725 63.2928C289.522 58.2706 287.685 53.3932 286.17 48.4378C284.767 43.8277 281.638 41.7564 276.883 41.8567C271.171 41.9792 265.458 41.8567 259.757 42.1239C247.953 42.5805 236.683 40.8879 226.762 33.9615C222.085 30.6876 217.608 27.1464 213.076 23.6721C200.704 14.1957 200.225 14.2736 187.709 23.6721C181.514 28.577 175.021 33.0919 168.266 37.1908C158.867 42.6362 148.333 42.5471 136.785 41.9457Z" fill="#CFB647"/><path d="M302.918 157.122C302.584 213.814 256.616 259.57 200.225 259.392C143.578 259.18 97.5098 212.979 97.8439 156.81C98.2336 100.018 144.191 54.2395 200.515 54.4288C256.839 54.6181 303.252 101.02 302.918 157.122ZM160.638 202.834C160.515 210.629 166.395 214.159 172.82 210.963C180.615 207.088 188.321 203.168 195.871 198.825C199.045 197.01 201.506 196.876 204.78 198.725C211.973 202.834 219.457 206.453 226.75 210.395C230.158 212.232 233.521 213.235 236.951 210.751C240.38 208.268 240.503 204.471 239.801 200.562C238.254 191.888 236.928 183.168 235.269 174.516C235.015 173.605 235.033 172.639 235.322 171.739C235.611 170.838 236.158 170.042 236.895 169.449C243.576 163.091 250.113 156.599 256.75 150.207C259.389 147.668 260.759 144.773 259.601 141.12C258.443 137.468 255.436 136.02 251.906 135.552C242.931 134.216 233.966 132.779 224.958 131.71C223.883 131.638 222.852 131.256 221.99 130.609C221.128 129.963 220.473 129.081 220.102 128.069C216.339 120.274 212.397 112.479 208.644 104.684C206.907 101.076 204.702 98.1475 200.325 98.1809C195.949 98.2143 193.989 101.11 192.319 104.562C188.41 112.613 184.524 120.642 180.37 128.581C180 129.27 179.494 129.878 178.884 130.368C178.274 130.857 177.571 131.219 176.818 131.432C167.91 132.935 158.878 134.205 149.892 135.43C146.084 135.942 142.687 137.011 141.306 140.998C139.859 145.151 141.908 148.191 144.803 150.953C150.894 156.788 156.763 162.857 163.021 168.514C165.504 170.741 165.972 172.868 165.393 175.941C163.6 185.162 162.097 194.504 160.638 202.834Z" fill="#CFB647"/><path d="M221.906 190.039C216.194 187.055 211.083 184.605 206.205 181.765C204.474 180.621 202.445 180.01 200.37 180.01C198.295 180.01 196.266 180.621 194.535 181.765C189.735 184.571 184.724 186.977 178.945 189.994C179.78 184.828 180.059 180.217 181.317 175.886C183.332 168.915 181.695 163.636 175.972 159.126C172.453 156.342 169.58 152.757 165.95 149.104C172.085 148.169 177.854 147.133 183.655 146.476C185.534 146.353 187.341 145.702 188.867 144.599C190.393 143.496 191.578 141.986 192.286 140.24C194.724 134.984 197.397 129.828 200.359 123.837C203.132 129.405 205.782 134.216 207.976 139.227C209.936 143.681 212.875 146.176 217.898 146.61C223.387 147.089 228.833 148.18 234.412 149.026C230.715 152.946 227.463 156.955 223.632 160.296C219.178 164.137 217.664 168.358 219.078 174.07C220.314 179.026 220.893 184.182 221.906 190.039Z" fill="#CFB647"/></g><defs><clipPath id="clip0_1_7"><rect width="299.26" height="398.768" fill="white" transform="translate(50.74 0.665817)"/></clipPath></defs></svg>
									</div>

									<div>
										<h4>You have ${data.user.profile.rewardPoints} Reward Points</h4>
										<a href="javascript: void(0)" onclick="materialDialog.alert('Reward Points', 'You can gain Reward Points by completing lessons, rating them, and using The Piano Encyclopedia. With more Reward Points you can gain free access to additional premium content.', {buttonCaption: 'See Rewards', href:'#!/rewards/'})">Learn how you can use your Reward Points</a>
									</div>
								</div>

								<div>
									<div>
										<!-- <img width="200" src="images/newimages/music_note.svg"> -->
										<svg width="40" height="40" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1_16)"><path d="M135.588 391.869C122.848 391.869 113.191 388.787 106.616 382.623C100.041 376.048 96.7529 367.623 96.7529 357.349C96.7529 346.254 99.8351 335.98 105.999 326.528C112.575 316.665 120.999 308.857 131.273 303.103C141.547 297.35 152.232 294.473 163.327 294.473C168.259 294.473 173.19 295.09 178.122 296.323C183.464 297.145 188.601 298.583 193.532 300.638V1.05278H216.34V302.487C216.34 320.158 212.436 335.774 204.628 349.336C197.231 362.486 187.368 372.966 175.04 380.774C163.122 388.171 149.971 391.869 135.588 391.869ZM255.175 304.953C262.162 288.926 267.299 273.515 270.586 258.72C273.874 243.515 275.518 229.543 275.518 216.803C275.518 197.488 272.025 181.256 265.038 168.105C258.463 154.544 250.039 143.859 239.765 136.051C229.491 128.243 219.012 123.517 208.327 121.873V22.6278C213.258 32.0798 219.012 40.9153 225.587 49.1343C232.162 56.9424 238.737 64.7506 245.313 72.5587C254.764 82.8325 263.805 93.9282 272.435 105.846C281.065 117.764 288.052 131.53 293.394 147.147C299.147 162.763 302.024 181.256 302.024 202.625C302.024 221.94 299.353 240.022 294.011 256.871C289.079 273.72 281.271 289.747 270.586 304.953H255.175Z" fill="#CFB647"/></g><defs><clipPath id="clip0_1_16"><rect width="400" height="400" fill="white"/></clipPath></defs></svg>
									</div>

									<div>
										<h4>${app.wallet.getUserBalance()} Coins</h4>
										<p>Your Melody Coins Balance</p>
									</div>
								</div>
							</div>	

							${htmlRewardsSection1}
							
							<!--
							<div class="app_ratingsSectionCard rewardLevel">
								<h4>70 points needed to reach Reward Level 3</h4>
								<div class="rewardLevelProgress"><div style="width: 60%"></div></div>

								<div class="rewardLevelStats">
									<div>
										<svg width="42" height="42" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect x="1.05566" y="1" width="38.0805" height="36.3229" rx="18.1615" fill="#614F00" fill-opacity="0.34" />
											<path d="M19.1659 24.4531H17.2086C16.2516 24.4531 15.4687 25.2361 15.4687 26.193V26.4105H14.5987C14.2421 26.4105 13.9463 26.7063 13.9463 27.0629C13.9463 27.4196 14.2421 27.7154 14.5987 27.7154H25.038C25.3947 27.7154 25.6905 27.4196 25.6905 27.0629C25.6905 26.7063 25.3947 26.4105 25.038 26.4105H24.1681V26.193C24.1681 25.2361 23.3852 24.4531 22.4282 24.4531H20.4708V22.4609C20.2534 22.487 20.0359 22.4957 19.8184 22.4957C19.6009 22.4957 19.3834 22.487 19.1659 22.4609V24.4531Z" fill="#F5B400" />
											<path d="M25.4554 18.7036C26.0295 18.4861 26.5341 18.1295 26.9343 17.7293C27.7433 16.8332 28.274 15.7632 28.274 14.5105C28.274 13.2578 27.2909 12.2748 26.0382 12.2748H25.551C24.9856 11.1177 23.8025 10.3174 22.428 10.3174H17.2083C15.8338 10.3174 14.6507 11.1177 14.0852 12.2748H13.5981C12.3453 12.2748 11.3623 13.2578 11.3623 14.5105C11.3623 15.7632 11.893 16.8332 12.702 17.7293C13.1022 18.1295 13.6068 18.4861 14.1809 18.7036C15.0857 20.9307 17.2605 22.4966 19.8181 22.4966C22.3758 22.4966 24.5506 20.9307 25.4554 18.7036ZM22.2888 15.9285L21.7494 16.5897C21.6624 16.6854 21.6015 16.8767 21.6102 17.0072L21.6624 17.8598C21.6972 18.3817 21.3231 18.6514 20.836 18.46L20.0443 18.1469C19.9225 18.1034 19.7137 18.1034 19.5919 18.1469L18.8003 18.46C18.3131 18.6514 17.9391 18.3817 17.9739 17.8598L18.0261 17.0072C18.0348 16.8767 17.9739 16.6854 17.8869 16.5897L17.3475 15.9285C17.0082 15.5283 17.1561 15.0847 17.6607 14.9542L18.4871 14.7454C18.6176 14.7106 18.7742 14.5888 18.8438 14.4757L19.3049 13.7624C19.5919 13.3187 20.0443 13.3187 20.3314 13.7624L20.7925 14.4757C20.8621 14.5888 21.0187 14.7106 21.1491 14.7454L21.9756 14.9542C22.4802 15.0847 22.628 15.5283 22.2888 15.9285Z" fill="#F5B400" />
											<rect x="1.05566" y="1" width="38.0805" height="36.3229" rx="18.1615" stroke="#F5B400" stroke-width="1.05779" />
										</svg>
										<p>Reward Level 1</p>
									</div>

									<div>
										<svg width="42" height="42" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g style="mix-blend-mode:luminosity">
												<rect x="1.14844" y="1" width="37.4546" height="35.7259" rx="17.8629" fill="#614F00" fill-opacity="0.34" />
												<path d="M18.961 24.0688H17.0358C16.0946 24.0688 15.3245 24.8389 15.3245 25.7801V25.994H14.4689C14.1181 25.994 13.8271 26.2849 13.8271 26.6357C13.8271 26.9865 14.1181 27.2775 14.4689 27.2775H24.7366C25.0874 27.2775 25.3783 26.9865 25.3783 26.6357C25.3783 26.2849 25.0874 25.994 24.7366 25.994H23.8809V25.7801C23.8809 24.8389 23.1109 24.0688 22.1697 24.0688H20.2445V22.1094C20.0306 22.135 19.8166 22.1436 19.6027 22.1436C19.3888 22.1436 19.1749 22.135 18.961 22.1094V24.0688Z" fill="#F5B400" />
												<path d="M25.1475 18.4144C25.7123 18.2005 26.2085 17.8497 26.6021 17.4561C27.3979 16.5748 27.9198 15.5223 27.9198 14.2902C27.9198 13.0581 26.9529 12.0912 25.7208 12.0912H25.2417C24.6855 10.9532 23.5218 10.166 22.1699 10.166H17.036C15.6841 10.166 14.5205 10.9532 13.9643 12.0912H13.4851C12.253 12.0912 11.2861 13.0581 11.2861 14.2902C11.2861 15.5223 11.8081 16.5748 12.6038 17.4561C12.9974 17.8497 13.4937 18.2005 14.0584 18.4144C14.9483 20.6049 17.0874 22.145 19.603 22.145C22.1186 22.145 24.2577 20.6049 25.1475 18.4144ZM22.033 15.6849L21.5025 16.3352C21.4169 16.4293 21.357 16.6176 21.3656 16.7459L21.4169 17.5844C21.4512 18.0978 21.0832 18.3631 20.6041 18.1748L19.8254 17.8668C19.7057 17.824 19.5003 17.824 19.3805 17.8668L18.6019 18.1748C18.1227 18.3631 17.7548 18.0978 17.789 17.5844L17.8404 16.7459C17.8489 16.6176 17.789 16.4293 17.7034 16.3352L17.173 15.6849C16.8393 15.2913 16.9847 14.8549 17.481 14.7266L18.2938 14.5212C18.4222 14.487 18.5762 14.3672 18.6447 14.256L19.0981 13.5544C19.3805 13.118 19.8254 13.118 20.1078 13.5544L20.5613 14.256C20.6297 14.3672 20.7838 14.487 20.9121 14.5212L21.725 14.7266C22.2212 14.8549 22.3667 15.2913 22.033 15.6849Z" fill="#F5B400" />
												<rect x="1.14844" y="1" width="37.4546" height="35.7259" rx="17.8629" stroke="#F5B400" stroke-width="1.0404" />
											</g>
										</svg>
										<p>Reward Level 2</p>
									</div>
								</div>
							</div>
							-->
						</div>
					</section>	

					<div class="container marginTop10">
						<div class="row action-cards-top">  
							${app.templates.modules.actionCards.content([])} 
						</div>
					</div>
				
					<section class="app_coursesCardsSection">
						<div class="app_coursesCardsFilterPills">	
							${
								materialFilterPills.create({
								list: [
									{ name: 'All', value: '', active: true },
									{ name: 'Beethoven', value: 'Beethoven' },
									{ name: 'Impressionism', value: 'Impressionism' },
									{ name: 'Neo Classicism', value: 'Neo Classicism' },
									{ name: 'Impressionism', value: 'Impressionism' },
									{ name: 'Romantic', value: 'Romantic' },
									{ name: 'Intermediate', value: 'Intermediate' },
									{ name: 'Beethoven', value: 'Beethoven' },
									{ name: 'Impressionism', value: 'Impressionism' },
									{ name: 'Neo Classicism', value: 'Neo Classicism' },
									{ name: 'Impressionism', value: 'Impressionism' },
									{ name: 'Romantic', value: 'Romantic' },
									{ name: 'Intermediate', value: 'Intermediate' }
									]
								})
							}
						</div>


						${formatAndValidateData(mergedArrays).map((item, index) => `
							<div class="app_coursesCardsContainer">
								<p>${item.header}</p>

								${materialCardScrolling.create({
									data: app.data,
									list: item.lesson
								})}
							</div>
						`)}
					</section>

				</div>
			</main>

			<script>
				// Create filters based on current data.
				if(app.createFiltersHtmlNew()) {
					$(".filterFormsContainer .filterFormsDiv").html(app.createFiltersHtmlNew());
				} else {
					$(".filterSwitchBtn").hide();
				}
			</script>

			<script>
				console.log('materialFilterPills', materialFilterPills)

				function toggleMaterialSearchbar(event) {
					event.stopPropagation();
					let materialSearchBar = document.querySelector('.materialSearchBar')
					materialSearchBar.classList.toggle('active');

					if(materialSearchBar.classList.contains('active')) {
						document.querySelector('body').style.overflow = 'hidden'
					} else {
						document.querySelector('body').style.overflow = 'unset'
					}
				}

				function closeMaterialSearchBarOutClick(event) {
					let materialSearchBar = document.querySelector('.materialSearchBar')

					if (!materialSearchBar.contains(event.target) && event.target !== materialSearchBar) {
						console.log('Yes')
						materialSearchBar.classList.remove('active');
					} else {
						console.log('No')
					}

					if(materialSearchBar.classList.contains('active')) {
						document.querySelector('body').style.overflow = 'hidden'
					} else {
						document.querySelector('body').style.overflow = 'unset'
					}
				}

				document.querySelector('.materialSearchBar .filterSwitchBtn').addEventListener('click', toggleMaterialSearchbar)
				document.querySelector('.mobileFilterDivTrigger').addEventListener('click', toggleMaterialSearchbar)
			
				document.querySelector('body').addEventListener('click', closeMaterialSearchBarOutClick);
			</script>
		`;


		html += `
					<script>
						console.log("RUNNING");
						dashboardInfiniteScrollingNew.load();  
						materialHeroSection.init(); 
						materialFilterPills.init()
						materialCardScrolling.init()
					</script>
				`;
		return html;
	}
};




