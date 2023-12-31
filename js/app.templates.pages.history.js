app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.history = {
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


        var courseArray = [
			{
				header: 'Today',
				courses: ['', '', '', '', '', '']
			},
			{
				header: 'Yestarday',
				courses: ['', '', '', '', '', '']
			},
			{
				header: 'Sept 18',
				courses: ['', '', '', '', '', '']
			},
            {
				header: 'Sept 17',
				courses: ['', '', '', '', '', '']
			},
            {
				header: 'Sept 16',
				courses: ['', '', '', '', '', '']
			}
		]


        var html = `
            <div class="container-fluid" style=" padding-top: 0px;">
                <div class="row">   
                        <h2 class="materialHeaderBox materialThemeDark  materialTextCenter fontFamilyLato materialColorDarkGrey" style="padding-top: 79px; font-size: 25px;  margin-bottom: 40px;   font-weight: 300;  color: #c8c8c8; background: rgba(52, 52, 51, 0.85)">History</h2> 
                </div>
            </div>

            <main class="app_mainContainer">
                <section class="app_coursesCardsSection">

                    <div class="app_historySearch">
                        <div class="searchInput">
                            <input type="text" placeholder="Search Lesson History" class="">
                        </div>

                        <div class="clearHistoryDiv">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4.5" y="5.09985" width="15" height="18" rx="1.5" stroke="#F9F4DE" stroke-width="1.75"/>
                                <rect x="2.25" y="2.09985" width="19.5" height="3" rx="0.75" stroke="#F9F4DE" stroke-width="1.75" stroke-linejoin="round"/>
                                <path d="M9 0.900146L15 0.900146" stroke="#F9F4DE" stroke-width="1.75" stroke-linecap="round"/>
                                <path d="M12 9V19.5" stroke="#F9F4DE" stroke-width="1.75" stroke-linecap="round"/>
                                <path d="M15.75 9V19.5" stroke="#F9F4DE" stroke-width="1.75" stroke-linecap="round"/>
                                <path d="M8.25 9V19.5" stroke="#F9F4DE" stroke-width="1.75" stroke-linecap="round"/>
                            </svg>
                            <p>Clear History</p>
                        </div>
                    </div>

                    ${courseArray.map((course, index) => `
                        <div class="app_coursesCardsContainer">
                            <p>${course.header}</p>

                            <div class="materialCardsContainer">
                                <div class="materialCardsDiv">
                                    ${course.courses.map((course, index) => `
                                        <div class="">
                                            <div class="materialCard materialThemeDarkGold">
                                                <div class="materialCardTop" data-button="" data-href="#!/course/1000001">
                                                    <div class="materialCardImg">
                                                        <div class="materialCardImgInside" style="background-image: url(https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-the-ultimate-collection-of-piano-music/img/thumb/001.mid.jpg); background-color: grey;"></div>
                                                        <div class="materialCardImgOverlay materialOverlayShallowBlack"></div>
                                                        <div class="materialCardMediaType materialThemeDarkGold materialThemeFlat">
                                                            <i class="fa fa-clock-o" title="Course"></i>
                                                        </div>
                                                        <div class="materialCardNew materialThemeDarkGold materialThemeFlat">
                                                            <span data-progress="0">
                                                                <span data-new="" style="display: inline;"><i>COMING SOON</i></span>
                                                                <span data-incomplete="" style="display: none;">COMING SOON</span>
                                                                <span data-complete="" style="display: none;">COMING SOON</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="materialProgressBar materialThemeDarkGold">
                                                        <div class="materialProgressBarInside" style="width:0%; ">
                                                        </div>
                                                    </div>
                                                    <div class="materialCardInfo materialThemeDarkGold">
                                                        <h2 class="materialHeader" style="font-size: 1.9em">Fur Elise</h2>
                                                        <h6 class="materialHeader"><b>Genre:</b> Classical</h6>
                                                        <p class="materialParagraph materialThemeDarkGold"></p>
                                                    </div>
                                                </div>
                                                <div class="materialCardAction materialThemeDarkGold">
                                                    <p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i> Available Soon</p>
                                                </div>
                                            </div>
                                        </div>
                                    `)}
                                </div>
                            </div>
                        </div>
                    `)}
                </section>
            </main>
        `;

        html += `
                <script>
                    console.log("RUNNING");
                </script>
			`;
        return html;
    }

}