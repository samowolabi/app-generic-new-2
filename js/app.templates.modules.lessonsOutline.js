app.templates = app.templates || {};
app.templates.modules = app.templates.modules || {};
app.templates.modules.lessonsOutline = {
	loading: function () {

		var html = `
				<h5 class="materialOutlineHeaderTitle materialThemeDark">
					<span class="materialPlaceHolder materialThemeDark" style="height:30px;width:250px;margin:0 auto;margin-bottom:10px;display:block"> </span>
					<span class="materialPlaceHolder materialThemeDark" style="height:25px;width:150px;margin:0 auto;display:block"> </span>
				</h5>
				<div class="materialProgressBar materialThemeDark">
					<div style="width:10px" class="materialProgressBarInside"></div>
				</div>
				<div class="materialOutlineLearn">
					<h5 class="materialOutlineTitle" style="height:40px;width:100%;padding:10px"> 
						<span class="materialPlaceHolder materialThemeDark" style="height:19px;width:150px;margin:0 auto;display:block;float:left"> </span>
					</h5>
					<ul class="materialOutlineList">
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
						<li class="materialOutlineView">
							<div class="materialOutlineListBody">
								<a href="#">
									<div class="materialOutlineThumbnail materialPlaceHolder">
										<div class="materialProgressBar">
											<div class="materialProgressBarInside" style="width:10px"></div>
										</div>
									</div>
									<h6 class="materialPlaceHolder" style="width:25%;height:20px;display:flex"></h6>
									<p class="materialPlaceHolder" style="width:200px;height:20px;display:flex"></p>
								</a>
							</div>
							<div class="materialOutlineIcon"> </div>
						</li>
					</ul>
				</div> `;

		return html;
	},

	content: function (courseId, progressPercent) {

		var data = app.data;

		var completenessPorcentage_1 = Math.round(app.data.user.stats.lessons.complete / app.data.user.stats.lessons.total * 100);
		var completenessPorcentage_2 = 0;

		var url;

		if (app.data.offer.isDataAvailable()) {
			url = "https://pianoencyclopedia.com/en/" + app.data.offer.general.availability.urlPathStartArray[0] + "/" + app.data.offer.general.availability.urlPathEnd + "/";
		}
		else {
			url = "https://pianoencyclopedia.com/en/piano-courses/the-logic-behind-music/";
		}

		var html = `
            <section class="app_lessonContentSection">
				<div class="courseProgress help-course-progress">
					<h4>Course Progress</h4>

					<div class="circleChatProgress">
						${materialMiniCircleProgress.create({
			percentage: Number(progressPercent)
		})
			}
						<p>${Number(progressPercent)}% Completed</p>
					</div>
				</div>

                <div id="accordion1">
				${materialAccordion.create({
				list: data.course[courseId].chapterIds.map(function (chapterId, index) {
					return {
						header: data.chapter[chapterId].title,
						subHeader: `${data.chapter[chapterId].stats.lessons.complete}/${data.chapter[chapterId].stats.lessons.total}`,
						onInitOpenAccordion: true,
						content: `
                                    <div class="materialOutlineLearn help-lessons-accordion-content">
                                        <ul class="materialOutlineList"> 
                                            ${data.chapter[chapterId].lessonIds.map(function (lessonId) {
							return `
                                                        <li class="materialOutlineView materialOutlineViewComplete"> 
                                                            <div class="materialOutlineListBody">
                                                                <a href="#!/lesson/${lessonId}"> 
                                                                    <div class="materialOutlineThumbnail" style="background-image: url(${data.lesson[lessonId].image});">
                                                                        <div class="materialProgressBar">
                                                                            <div class="materialProgressBarInside " style="width: ${data.lesson[lessonId].progress}%;"></div>
                                                                        </div>
                                                                    </div>
                                                                    <h6>${data.lesson[lessonId].title}</h6>
                                                                    <p>${data.lesson[lessonId].subtitle}</p>
                                                                    ${data.lesson[lessonId].dateStatus === 'expiredAsap' ? `
                                                                            <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring in <span data-countdown="${data.lesson[lessonId].deadlineDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'expiringSoon' ? `
                                                                            <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring Soon</p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'comingAsap' ? `
                                                                            <p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Available in <span data-countdown="${data.lesson[lessonId].availableDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'comingSoon' ? `
                                                                            <p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Coming Soon</p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'expired' ? `
                                                                            <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Locked</p>
                                                                        ` : ``
								}
                                                                </a>
                                                            </div>
                                                            <div class="materialOutlineIcon ${data.lesson[lessonId].progress >= 94 ? ' active ' : ' '}">${data.lesson[lessonId].progress >= 94 ? '<i class="fa fa-check"></i>' : '<i class="fa fa-circle"></i>'}</div>
                                                        </li>
                                                    `
						}).join('')
							}
                                        </ul>
                                    </div>
                                `
					}
				})
			})
			}
			</div>

				<div class="materialAccordionContent" style="max-height: unset;">
					<div class="materialOutlineLearn materialThemeDark">
						<h5 class="materialOutlineTitle" style="color: #ffffff; font-size: 1.78rem; text-transform: capitalize; background-color: #1C1C1C; letter-spacing: 0px; font-weight: normal;">More Lessons</h5>
						<ul class="materialOutlineList"> 
							<li data-progress="${completenessPorcentage_1}" data-progress-affects-class="materialOutlineViewComplete" class="materialOutlineView">
								<div class="materialOutlineListBody">
									<a href="#!/">
										<div class="materialOutlineThumbnail" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png);">
											<div class="materialProgressBar ">
												<div class="materialProgressBarInside" data-progress="${completenessPorcentage_1}" data-progress-affects-width style="width:10px;"></div>
											</div>
										</div>
										<h6>Go Back To Your Lessons Dashboard</h6>
										<p>You have ${app.data.user.stats.lessons.incomplete} unfinished lessons</p> 
									</a>
								</div>
								<div class="materialOutlineIcon default"><i class="fa fa-circle"></i></div>
							</li>
						</ul> 
					</div>
				</div>


				<div class="materialAccordionContent" style="max-height: unset;">
					<div class="materialOutlineLearn materialThemeDark">
						<h5 class="materialOutlineTitle" style="color: #ffffff; font-size: 1.78rem; text-transform: capitalize; background-color: #1C1C1C; letter-spacing: 0px; font-weight: normal;">Upgrade Your Experience</h5>
						<ul class="materialOutlineList"> 
							<li data-progress="${completenessPorcentage_2}" data-progress-affects-class="materialOutlineViewComplete" class="materialOutlineView">
								<div class="materialOutlineListBody">
									<a target="_blank" href="${url}?source=nativeAd">
										<div class="materialOutlineThumbnail" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/webpage-premium/images/showcase-shelf/logo-3d.min.png);">
											<div class="materialProgressBar ">
												<div class="materialProgressBarInside" data-progress="${completenessPorcentage_2}" data-progress-affects-width style="width:10px;"></div>
											</div>
										</div>
										<h6>Discover our Digital Home-Study Course "The Logic Behind Music"</h6>
										<p>The most comprehensive course in the world, with a 2-year curriculum of multimedia lessons, including  25,000 interactive piano graphics, animated sheet music, and interactive 3D hands that will show exactly what fingers to use. Quickly learn how to play your favorite songs, play by ear, improvise, and even create your own music - by discovering how music truly works.</p> 
									</a>
								</div>
								<div class="materialOutlineIcon default"><i class="fa fa-circle"></i></div>
							</li>
						</ul> 
					</div>
				</div>
            </section>
        `;

		html += `
            <script>
                console.log("RUNNING");
				materialAccordion.init('accordion1');
            </script>
		`;

		return html;
	}
}