app.templates = app.templates || {};
app.templates.pages = app.templates.pages || {};
app.templates.pages.lesson = {
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

    content : function (lessonId){
        console.log('app.templates.modules.lessonsOutline', app.templates.modules.lessonsOutline)
        // var dataLesson = app.data.lesson[lessonId];

        var html =`
            <main class="app_mainContainer maxWidthContainer">
                <ul class="materialBreadCrumbs marginTop24 marginBottom3">
                    <li>Exclusive Gifts</li>
                    <li>Lessons</li>
                    <li>The Hidden Patterns of Music</li>
                </ul>

                <div class="app_LessonContainer">
                    <div>
                        ${app.templates.modules.lesson.content(lessonId)}
                    </div>

                    <div>
                         ${app.templates.modules.lessonsOutline.content(lessonId)}
                    </div>
                </div>

                <div class="container marginTop20">
                    <div class="row action-cards-top">  
                        ${app.templates.modules.actionCards.content(app.data.user.cards, false, false)} 
                    </div>
                </div>

                <div class="container marginTop10">
                    <div class="row action-cards-top">  
                        ${app.templates.modules.actionCards.content(app.data.user.cards, true, true)} 
                    </div>
                </div>
            </main>
        `;

        return html;
    },
    notFound : function (lessonId){
	
		materialDialog.alert("Oops!", 
			`There is no lesson number ${lessonId}. Press 'OK' to be taken to the dashboard where you will be able to access more lessons.`,
			{
				hideCallback: function(){
					router.navigate('/');
				}
			}
		);	 
				
		return app.templates.pages.lesson.loading();
	}
}