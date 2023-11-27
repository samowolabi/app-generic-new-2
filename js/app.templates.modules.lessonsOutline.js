app.templates = app.templates || {}; 
app.templates.modules = app.templates.modules  || {}; 
app.templates.modules.lessonsOutline = {
	loading : function() {
			var html =`
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

    content : function (lessonId) {
        var data = app.data;

        let activeLessonId = lessonId;
        let parentChapterId = app.data.lesson[activeLessonId].parentChapter;
        let parentCourseId = app.data.chapter[parentChapterId].parentCourse;
        let activeCourseId = parentCourseId;

        var html = `
            <section class="app_lessonContentSection">
                ${
                    materialAccordion.create({
                        list: data.course[activeCourseId].chapterIds.map(function(chapterId, index) {
                            return {
                                header: data.chapter[chapterId].title,
                                subHeader: `${data.chapter[chapterId].stats.lessons.incomplete}/${data.chapter[chapterId].stats.lessons.total}  |  -hr -min`,
                                onInitOpenAccordion: true,
                                content: `
                                    <div class="materialOutlineLearn">
                                        <ul class="materialOutlineList"> 
                                            ${
                                                data.chapter[chapterId].lessonIds.map(function(lessonId){
                                                    return `
                                                        <li class="materialOutlineView materialOutlineViewComplete"> 
                                                            <div class="materialOutlineListBody">
                                                                <a href="#!/lesson/${lessonId}"> 
                                                                    <div class="materialOutlineThumbnail" style="background-image: url(${data.lesson[lessonId].image});">
                                                                        <div class="materialProgressBar">
                                                                            <div class="materialProgressBarInside " style="width:30%;"></div>
                                                                        </div>
                                                                    </div>
                                                                    <h6>${data.lesson[lessonId].title}</h6>
                                                                    <p>${data.lesson[lessonId].subtitle}</p>
                                                                    ${
                                                                        data.lesson[lessonId].dateStatus === 'expiredAsap' ? `
                                                                            <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring in <span data-countdown="${data.lesson[lessonId].deadlineDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'expiringSoon' ? `
                                                                            <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expiring Soon</p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'comingAsap' ? `
                                                                            <p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Available in <span data-countdown="${data.lesson[lessonId].availableDateString}"><span data-days>00</span><span data-days-caption> Days </span><span data-hours>00</span>:<span data-minutes >00</span>:<span data-seconds>00</span></span></p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'comingSoon' ? `
                                                                            <p class="materialOutlineComingSoon"><i class="fa fa-clock-o"></i>Coming Soon</p>
                                                                        ` : data.lesson[lessonId].dateStatus === 'expired' ? `
                                                                            <p class="materialOutlineExpire"><i class="fa fa-lock"></i>Expired</p>
                                                                        ` : ``
                                                                    }
                                                                </a>
                                                            </div>
                                                            <div class="materialOutlineIcon"><i class="fa fa-check"></i></div>
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
            </section>
        `;

        html += `
            <script>
                console.log("RUNNING");
                materialAccordion.init();
            </script>
		`;

        return html;
    }
}