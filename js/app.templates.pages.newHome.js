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
					description: course.description,
					image: course.image,
					buttonLink: `/#!/newCourse/${courseId}`,
					percentageComplete: course.stats.lessons.totalProgress
				}
			}
		})


		let heroSectionArrayLessonIds = app.data.user.recommendations.data.thisWeekTopRecommendations.lessonsIds.map((lessonId, index) => {
			var lesson = app.data.lesson[lessonId];
			if (lesson) {
				return {
					title: lesson.title,
					description: lesson.description,
					image: lesson.image,
					buttonLink: `/#!/newLesson/${lessonId}`,
					percentageComplete: lesson.progress
				}
			}
		})

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
							<div class="materialSearchInputDiv infiniteScrollingCardsSearchBar">
								<!--	
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9.90039" cy="9.90015" r="9" stroke="white" stroke-width="1.5"/><path d="M16.5 16.5L22.864 22.864" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>	
								-->	
								<input type="text" class="materialInputTextArea materialThemeDark" placeholder="${config.text.searchBarPlaceholder}" class="">

								<div class="filterSwitchBtn">
									<svg width="21" height="21" viewBox="0 0 23 24" fill="#B6B6B6" xmlns="http://www.w3.org/2000/svg">
										<path d="M19.3716 4.63118V6.68328C19.3716 7.4295 18.9052 8.36228 18.4388 8.82866L14.4279 12.3732C13.8682 12.8396 13.4951 13.7724 13.4951 14.5186V18.5295C13.4951 19.0892 13.122 19.8354 12.6556 20.1152L11.3497 20.9547C10.1371 21.701 8.45811 20.8615 8.45811 19.369V14.4253C8.45811 13.7724 8.085 12.9329 7.71189 12.4665L7.27348 12.0094C6.98432 11.7016 6.92835 11.2352 7.16155 10.8714L11.9374 3.20403C12.1053 2.93352 12.4037 2.76562 12.7302 2.76562H17.506C18.5321 2.76562 19.3716 3.60512 19.3716 4.63118Z" />
										<path d="M9.80994 4.19277L6.49858 9.50026C6.18144 10.0133 5.45388 10.0879 5.03413 9.64951L4.16665 8.73539C3.70026 8.269 3.32715 7.4295 3.32715 6.86984V4.72445C3.32715 3.60512 4.16665 2.76562 5.1927 2.76562H9.01708C9.74464 2.76562 10.1924 3.56781 9.80994 4.19277Z" />
									</svg>
								</div>
							</div>

							<div class="filterFormsContainer">
								<!-- Created dynamically -->
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
						<div class="app_ratingsSectionCard ratingsContent">
							<div class="pianoLevelDiv">
								<div>
									<h2>${data.user.stats.profile.complete}%</h2>
									<span>Complete</span>
								</div>
								<div>
									<h4>What's your piano level?</h4>
									<p>Customize your learning experience</p>
								</div>
							</div>
							<button class="materialButtonOutline materialThemeGoldDark">Complete</button>
						</div>
					

						<div class="rewardPointsContainer marginTop4">
							<div class="app_ratingsSectionCard rewardPoints">
								<div>
									<h4>You have ${data.user.stats.lessons.total - data.user.stats.lessons.complete} unfinished lessons</h4>

									<p class="paddingTop7">You completed ${data.user.stats.lessons.complete}.</p>
									<p>Complete more to gain more Reward Points</p>
								</div>

								<div>
									<h4>You have ${data.user.profile.rewardPoints} Reward Points</h4>
									<p>Learn how to use Rewards Points &raquo;</p>
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
				$(".filterFormsContainer").html(app.createFiltersHtmlNew()); 
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

					if (!event.target.closest('.materialSearchBar')) {
						materialSearchBar.classList.remove('active');
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




