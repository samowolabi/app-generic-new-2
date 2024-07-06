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

		// Create rewards Sections
		var htmlRewardsSection1 = app.templates.modules.rewardsIndicator.content('section1');

		// Create Profile Card
		var genresCompleteness = app.data.user.profile.genres ? app.data.user.profile.genres.length : 0;
		var interestsCompleteness = app.data.user.profile.interests ? app.data.user.profile.interests.length : 0;
		var pianoLevelCompleteness = app.data.user.profile.pianoLevel ? 1 : 0;

		var completenessScore = genresCompleteness + interestsCompleteness + pianoLevelCompleteness;
		var total = 3 + 3 + 1;
		var completenessPorcentage = Math.round(completenessScore / total * 100);

		var text, action;

		if (!pianoLevelCompleteness) {
			text = "<b>What is your piano level?</b>";
		} else {
			if (interestsCompleteness < 3) {
				text = "<b>What are your learning interests?</b>";
			} else {
				if (genresCompleteness < 3) {
					text = "<b>What are your favorite music genres?</b>";
				}
				else {
					text = "";
				}
			}
		}

		// Lesson Array
		function lessonArray() {
			return [
				{
					header: 'Featured Courses',
					lesson: {
						ids: config.content.featuredCourses,
						type: 'course'
					}
				},
				{
					header: 'Featured Lessons',
					lesson: {
						ids: config.content.featuredLessons,
						type: 'lesson'
					}
				},
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
					header: 'Featured Lessons',
					lesson: {
						ids: [],
						type: 'lesson'
					}
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
		}


		// Recommended Lesson Type
		function recommendedLessonArray() {
			let returnedData = Object.keys(app.data.user.recommendations.data.types).map((type, index) => {
				let data = app.data.user.recommendations.data.types[type]

				return {
					header: `Recommended ${data.displayName} for You`,
					lesson: {
						ids: data.lessonsIds,
						type: 'lesson'
					},
				}
			})

			return returnedData;
		}


		// Config Lesson Array
		function configLessonArray() {
			if(config['featuredCarousels']){
				let returnedData = config['featuredCarousels'].map((item, index) => {
					let itemIds = app.data.explore.coursesIds[item];
					if (!itemIds) { return null }

					return {
						header: item,
						lesson: {
							ids: itemIds,
							type: 'course'
						},
					}
				}).filter(item => item !== null)

				return returnedData;
			}
			else{
				console.error('configLessonArray', 'WARNING: config.featuredCarousels is not defined and needs to be defined for every app');
				return [];
			}
		}

		//console.error('configLessonArray', configLessonArray());



		// Merge both arrays (lessonArray and recommendedLessonArray)
		var mergedArrays = []
		if (app.data.user.recommendations.data && Object.keys(app.data.user.recommendations.data).length > 0) {
			mergedArrays = [...lessonArray(), ...recommendedLessonArray()]
		}

		// Merge both arrays (mergedArrays and configLessonArray)
		mergedArrays = [ ...configLessonArray(), ...mergedArrays]

		const formatAndValidateData = (data) => {
			if (!Array.isArray(data)) { return [] }

			const combinedArray = []

			// Check if any of item.lessons.id is in app.data.lesson
			const validateData = (item) => {
				if (!Array.isArray(item.lesson.ids)) { return false }
				if (item.lesson.ids.length <= 0) { return false }

				let appData = '';
				if (item.lesson.type === 'lesson') {
					appData = app.data.lesson;
				} else if (item.lesson.type === 'course') {
					appData = app.data.course;
				}


				const validatedItems = item.lesson.ids.some(lessonId => {
					if (appData.hasOwnProperty(lessonId)) {
						return true
					} else {
						return false
					}
				})

				return validatedItems
			}

			data.forEach(item => {
				if (validateData(item)) {
					combinedArray.push({
						header: item.header,
						lesson: item.lesson
					})
				}
			})

			return combinedArray;
		}

		// Hero Section Array
		let heroSectionArrayCourseIds = function () {
			if (!app.data.user.recommendations.data || Object.keys(app.data.user.recommendations.data).length <= 0) { return [] }

			let courseIds = app.data.user.recommendations.data.thisWeekTopRecommendations.coursesIds
			if (!courseIds || !Array.isArray(courseIds)) { return [] }

			let courseIdsData = courseIds.map((courseId, index) => {
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

			return courseIdsData
		}


		// Hero Section Array Lesson Ids
		let heroSectionArrayLessonIds = function () {
			if (!app.data.user.recommendations.data || Object.keys(app.data.user.recommendations.data).length <= 0) { return [] }

			let lessonIds = app.data.user.recommendations.data.thisWeekTopRecommendations.lessonsIds
			if (!lessonIds || !Array.isArray(lessonIds)) { return [] }

			let lessonIdsData = lessonIds.map((lessonId, index) => {
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

			return lessonIdsData
		}

		// Merge both arrays (heroSectionArrayCourseIds and heroSectionArrayLessonIds)
		var heroSectionArray = [...heroSectionArrayCourseIds(), ...heroSectionArrayLessonIds()]

		// Filter Pills
		let filterPillsData = Object.keys(app.data.explore['coursesIds']).map((item, index) => {
			return {
				name: item, value: item, active: false
			}
		})

		// Push "All" filter pill to the beginning of the array
		filterPillsData.unshift({
			name: 'All', value: '', active: true
		})

		var html = `
			<style>
				body {
					/* background: #120d0d !important; */
				}
				.materialBarDashboardNavigation.materialBarDashboard:nth-child(1) {
					display: none !important;
				}
			</style>


			<main class="app_mainContainer">
				${
					materialTopBar.create({
						text: 'Black Friday in June: Get 90% Off',
						icon: 'images/newImages/gift.webp',
						countdownTime: '2024-07-07T23:59:59-04:00',
						color: '#fff',
						link: '#'
					})
				}

				<section class="heroSectionContainer" style="position: relative;">
					<header class="app_headerContainer" style="position: absolute; top: 35px; width: 100%;">
						${app.templates.modules.appHeader.content({
							getSearchandFilterValueCallback: (data) => getValueAndRedirectToSearchPage(data)
						})}
					</header>

					${materialHeroSection.create({
						data: heroSectionArray
					})}
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
								<div class="help-lesson-completed-container">
									<div class="iconDiv">
										${
											materialMiniCircleProgress.create({
												percentage: (Number(data.user.stats.lessons.complete) * 100) / Number(data.user.stats.lessons.total)
											})
										}
									</div>

									<div class="contentDiv">
										<h4>${data.user.stats.lessons.complete}/${data.user.stats.lessons.total} Lessons Completed</h4>
										<p class="paddingTop7">You have ${data.user.stats.lessons.total - data.user.stats.lessons.complete} unfinished lessons to explore and get more reward points.</p>
									</div>
								</div>

								<div class="help-view-reward-points-container">
									<div class="iconDiv">
										<svg width="40" height="40" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1_7)"><path d="M204.279 0.665817C214.59 3.85062 222.485 10.8995 230.615 17.4473C238.577 23.8726 247.318 27.0017 257.574 26.4449C264.434 26.0774 271.327 26.0886 278.197 26.2779C289.578 26.6008 296.905 31.9014 300.758 42.6918C303.141 49.3732 305.212 56.2439 307.094 63.1035C309.398 71.8354 314.894 79.3854 322.495 84.2613C328.341 88.092 334.098 92.0563 339.666 96.3546C349.131 103.582 351.915 112.089 348.575 123.47C346.526 130.419 344.065 137.256 341.615 144.082C338.575 152.314 338.575 161.362 341.615 169.594C344.031 176.42 346.448 183.269 348.619 190.184C352.082 201.253 349.042 210.417 339.822 217.366C334.224 221.575 328.497 225.603 322.64 229.448C314.939 234.427 309.379 242.105 307.05 250.973C304.823 258.69 302.016 266.218 299.745 273.902C299.411 275.633 299.617 277.425 300.335 279.035C310.127 304.276 319.971 329.517 329.867 354.758C333.207 363.377 329.644 368.399 320.479 367.464C308.223 366.194 295.992 364.709 283.787 363.009C279.689 362.441 276.917 363.176 274.155 366.628C266.36 376.35 258.12 385.704 250.013 395.158C244.501 401.606 237.819 400.537 234.724 392.641C225.024 367.92 215.281 343.21 205.86 318.378C204.19 313.979 202.107 311.975 197.04 313.467C194.635 319.58 192.074 326.072 189.524 332.576C181.744 352.486 173.949 372.397 166.139 392.307C162.798 400.715 156.384 401.806 150.549 394.935C142.453 385.459 134.258 376.072 126.396 366.417C123.846 363.277 121.318 362.475 117.432 363.009C104.971 364.735 92.4765 366.205 79.96 367.53C71.419 368.432 67.6217 363.232 70.7619 355.181C80.6356 329.821 90.5538 304.484 100.516 279.169C100.985 278.063 101.227 276.874 101.227 275.672C101.227 274.471 100.985 273.282 100.516 272.176C97.9775 265.26 95.7727 258.189 93.8351 251.085C91.4975 242.075 85.8153 234.294 77.9445 229.326C72.1873 225.584 66.5749 221.531 61.0962 217.444C51.887 210.495 48.847 201.364 52.2767 190.273C54.3591 183.591 56.5417 176.91 58.9581 170.396C62.2257 161.835 62.2614 152.377 59.0584 143.793C56.2967 135.998 53.691 128.114 51.5863 120.118C48.9583 110.43 52.9671 102.78 60.4837 96.9226C66.2075 92.4683 72.1873 88.3147 78.3008 84.3281C85.8605 79.4011 91.3517 71.8735 93.7348 63.1703C96.1736 54.9968 98.7682 46.8343 101.986 38.9503C105.594 30.1531 113.122 26.701 122.231 26.3558C129.748 26.122 137.286 26.2222 144.803 26.4783C153.58 26.9193 162.199 24.0277 168.934 18.3827C170.95 16.7457 173.076 15.2535 175.092 13.6166C181.584 8.26034 188.332 3.29384 196.495 0.665817H204.279ZM136.785 41.9457H123.122C119.191 41.9457 116.44 43.7275 115.115 47.5136C113.378 52.6694 111.463 57.7918 110.216 63.1035C106.418 79.0387 97.688 91.2545 83.6348 99.829C78.891 102.724 74.4701 106.165 70.0047 109.495C67.0204 111.722 65.7954 114.662 67.076 118.403C68.9357 123.793 70.4167 129.294 72.6439 134.572C75.6325 141.713 77.1631 149.38 77.1459 157.121C77.1287 164.862 75.564 172.522 72.5437 179.649C70.5058 184.683 69.0025 189.928 67.2097 195.061C65.8177 199.059 67.0204 202.233 70.2943 204.627C74.6817 207.856 79.0023 211.208 83.6571 214.025C97.5098 222.488 106.24 234.571 110.093 250.394C111.429 255.962 113.434 261.274 115.249 266.675C115.66 268.199 116.577 269.537 117.85 270.47C119.124 271.403 120.676 271.875 122.253 271.808C128.211 271.808 134.191 272.064 140.07 271.686C156.184 270.661 170.237 275.349 182.386 285.984C185.404 288.634 188.711 290.962 191.929 293.367C198.811 298.512 201.795 298.545 208.633 293.512C211.762 291.195 214.98 288.968 217.886 286.396C230.292 275.427 244.612 270.461 261.193 271.675C266.761 272.087 272.329 271.842 277.897 271.897C282.117 271.897 284.7 269.726 285.959 265.884C287.607 260.84 289.422 255.862 290.658 250.673C294.5 234.715 303.252 222.488 317.384 213.925C322.027 211.108 326.359 207.767 330.746 204.515C333.831 202.21 335.123 199.181 333.764 195.295C331.76 189.549 330.045 183.692 327.84 178.035C322.312 164.407 322.344 149.156 327.929 135.552C330.101 129.984 331.749 124.272 333.697 118.648C334.378 117.007 334.457 115.178 333.919 113.484C333.381 111.79 332.261 110.342 330.758 109.394C326.303 106.054 321.849 102.635 317.105 99.751C303.175 91.2545 294.511 79.1166 290.725 63.2928C289.522 58.2706 287.685 53.3932 286.17 48.4378C284.767 43.8277 281.638 41.7564 276.883 41.8567C271.171 41.9792 265.458 41.8567 259.757 42.1239C247.953 42.5805 236.683 40.8879 226.762 33.9615C222.085 30.6876 217.608 27.1464 213.076 23.6721C200.704 14.1957 200.225 14.2736 187.709 23.6721C181.514 28.577 175.021 33.0919 168.266 37.1908C158.867 42.6362 148.333 42.5471 136.785 41.9457Z" fill="#CFB647"/><path d="M302.918 157.122C302.584 213.814 256.616 259.57 200.225 259.392C143.578 259.18 97.5098 212.979 97.8439 156.81C98.2336 100.018 144.191 54.2395 200.515 54.4288C256.839 54.6181 303.252 101.02 302.918 157.122ZM160.638 202.834C160.515 210.629 166.395 214.159 172.82 210.963C180.615 207.088 188.321 203.168 195.871 198.825C199.045 197.01 201.506 196.876 204.78 198.725C211.973 202.834 219.457 206.453 226.75 210.395C230.158 212.232 233.521 213.235 236.951 210.751C240.38 208.268 240.503 204.471 239.801 200.562C238.254 191.888 236.928 183.168 235.269 174.516C235.015 173.605 235.033 172.639 235.322 171.739C235.611 170.838 236.158 170.042 236.895 169.449C243.576 163.091 250.113 156.599 256.75 150.207C259.389 147.668 260.759 144.773 259.601 141.12C258.443 137.468 255.436 136.02 251.906 135.552C242.931 134.216 233.966 132.779 224.958 131.71C223.883 131.638 222.852 131.256 221.99 130.609C221.128 129.963 220.473 129.081 220.102 128.069C216.339 120.274 212.397 112.479 208.644 104.684C206.907 101.076 204.702 98.1475 200.325 98.1809C195.949 98.2143 193.989 101.11 192.319 104.562C188.41 112.613 184.524 120.642 180.37 128.581C180 129.27 179.494 129.878 178.884 130.368C178.274 130.857 177.571 131.219 176.818 131.432C167.91 132.935 158.878 134.205 149.892 135.43C146.084 135.942 142.687 137.011 141.306 140.998C139.859 145.151 141.908 148.191 144.803 150.953C150.894 156.788 156.763 162.857 163.021 168.514C165.504 170.741 165.972 172.868 165.393 175.941C163.6 185.162 162.097 194.504 160.638 202.834Z" fill="#CFB647"/><path d="M221.906 190.039C216.194 187.055 211.083 184.605 206.205 181.765C204.474 180.621 202.445 180.01 200.37 180.01C198.295 180.01 196.266 180.621 194.535 181.765C189.735 184.571 184.724 186.977 178.945 189.994C179.78 184.828 180.059 180.217 181.317 175.886C183.332 168.915 181.695 163.636 175.972 159.126C172.453 156.342 169.58 152.757 165.95 149.104C172.085 148.169 177.854 147.133 183.655 146.476C185.534 146.353 187.341 145.702 188.867 144.599C190.393 143.496 191.578 141.986 192.286 140.24C194.724 134.984 197.397 129.828 200.359 123.837C203.132 129.405 205.782 134.216 207.976 139.227C209.936 143.681 212.875 146.176 217.898 146.61C223.387 147.089 228.833 148.18 234.412 149.026C230.715 152.946 227.463 156.955 223.632 160.296C219.178 164.137 217.664 168.358 219.078 174.07C220.314 179.026 220.893 184.182 221.906 190.039Z" fill="#CFB647"/></g><defs><clipPath id="clip0_1_7"><rect width="299.26" height="398.768" fill="white" transform="translate(50.74 0.665817)"/></clipPath></defs></svg>
									</div>

									<div class="contentDiv">
										<h4>You have ${data.user.profile.rewardPoints} Reward Points</h4>
										<a href="javascript: void(0)" onclick="materialDialog.alert('Reward Points', 'You can gain Reward Points by completing lessons, rating them, and using The Piano Encyclopedia. With more Reward Points you can gain free access to additional premium content.', {buttonCaption: 'See Rewards', href:'#!/rewards/'})">Learn how you can use your Reward Points and get to the next Rewards Level &raquo;</a>
									</div>
								</div>

								<div class="help-view-melody-coins-container">
									<div class="iconDiv">
										<!-- <img width="200" src="images/newimages/music_note.svg"> -->
										<svg width="40" height="40" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1_16)"><path d="M135.588 391.869C122.848 391.869 113.191 388.787 106.616 382.623C100.041 376.048 96.7529 367.623 96.7529 357.349C96.7529 346.254 99.8351 335.98 105.999 326.528C112.575 316.665 120.999 308.857 131.273 303.103C141.547 297.35 152.232 294.473 163.327 294.473C168.259 294.473 173.19 295.09 178.122 296.323C183.464 297.145 188.601 298.583 193.532 300.638V1.05278H216.34V302.487C216.34 320.158 212.436 335.774 204.628 349.336C197.231 362.486 187.368 372.966 175.04 380.774C163.122 388.171 149.971 391.869 135.588 391.869ZM255.175 304.953C262.162 288.926 267.299 273.515 270.586 258.72C273.874 243.515 275.518 229.543 275.518 216.803C275.518 197.488 272.025 181.256 265.038 168.105C258.463 154.544 250.039 143.859 239.765 136.051C229.491 128.243 219.012 123.517 208.327 121.873V22.6278C213.258 32.0798 219.012 40.9153 225.587 49.1343C232.162 56.9424 238.737 64.7506 245.313 72.5587C254.764 82.8325 263.805 93.9282 272.435 105.846C281.065 117.764 288.052 131.53 293.394 147.147C299.147 162.763 302.024 181.256 302.024 202.625C302.024 221.94 299.353 240.022 294.011 256.871C289.079 273.72 281.271 289.747 270.586 304.953H255.175Z" fill="#CFB647"/></g><defs><clipPath id="clip0_1_16"><rect width="400" height="400" fill="white"/></clipPath></defs></svg>
									</div>

									<div class="contentDiv">
										<h4>${app.wallet.getUserBalance()} Melody Coins</h4>
										<p>Instantly unlock premium content with Melody Coins</p>
									</div>
								</div>
							</div>	

							${htmlRewardsSection1}
						</div>
					</section>

					<section class="app_coursesCardsFilterPills marginTop20">	
						${
							materialFilterPills.create({
								list: filterPillsData,
								getClickedPillData: (data) => populateCards(data)
							})
						}
					</section>
				
					<section class="app_coursesCardsSection">
						${formatAndValidateData(mergedArrays).map((item, index) => `
							<div class="app_coursesCardsContainer">
								<p class="sectionHeader">${item.header}</p>
								${
									materialCardScrollingV2.create({
										data: app.data,
										list: item.lesson,
										limit: 20
									})
								}
							</div>
						`)}
					</section>

				</div>
			</main>
		`;

		html += `
			<script>
                function getValueAndRedirectToSearchPage(data) {
					if (!data) { return; }
					let windowLocationHref = window.location.href;

					window.location.hash = ''; // Clear the url
					router.navigate('#!/' + windowLocationHref.split('#!/')[1]);
                }

				function populateCards(data) {
					if (!data) { return; }
					let windowLocationHref = window.location.href;

					window.location.hash = ''; // Clear the url

					router.navigate('#!/filter' + windowLocationHref.split('#!/filter')[1]);
				}
            </script>
		`

		html += `
					<script>
						console.log("RUNNING");
						materialHeroSection.init(); 
						materialFilterPills.init();
						materialTopBar.init();
						// materialCardScrolling.init();
						materialCardScrollingV2.init();
					</script>
				`;
		return html;
	}
};




