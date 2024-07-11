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
        var parentChapterId    = app.data.lesson[lessonId].parentChapter;
        var parentChapterTitle = app.data.chapter[parentChapterId].title;

        var parentCourseId 	   = app.data.chapter[parentChapterId].parentCourse;
        var parentCourseTitle  = app.data.course[parentCourseId].title;	

        var lessonSubtitle 	   = app.data.lesson[lessonId].subtitle;

        var dataLesson = app.data.lesson[lessonId];    

        dataLesson.breadcrumb = [
            {
                title: lessonSubtitle,
                link: '#!/lesson/' + lessonId
            },
            {
                title: parentChapterTitle,
                link: '#!/chapter/' + parentChapterId
            },
            {
                title: parentCourseTitle,
                link: '#!/course/' + parentCourseId
            }
        ]

        var getLessonIDModuleData = app.templates.modules.lesson.content(lessonId);


        var html =`
            <main class="app_mainContainer maxWidthContainer marginBottom20">
                ${
                    materialTopBar.create({
                        text: 'Black Friday in June: Get 90% Off',
                        icon: 'images/newImages/gift.webp',
                        countdownTime: '2024-07-07T23:59:59-04:00',
                        color: '#fff',
                        link: '#'
                    })
                }

                <ul class="materialBreadCrumbs help-lesson-breadcrumbs">
                    ${dataLesson.breadcrumb.map(function(item){
                        return `
                            <li><a style="text-decoration: none;" href="${item.link}">${item.title}</a></li>
                        `;
                    }).join("")}
                </ul>

                <div class="app_LessonContainer">
                    <div>
					
						<div>
							${getLessonIDModuleData.html}
						</div>
						
					</div>
					
                    <div>
                        ${app.templates.modules.lessonsOutline.content(parentCourseId, getLessonIDModuleData.progressPercent, lessonId)}
                    </div>
                </div>

				<div class="container marginTop10">
					<div class="row action-cards-top">  
						${app.templates.modules.actionCards.content(app.data.user.cards, false, false)} 
					</div>
				</div>

                <div class="container marginTop10">
                    <div class="row action-cards-bottom">  
                        ${app.templates.modules.actionCards.content(app.data.user.cards, true, true)} 
                    </div>
                </div>
            </main>
        `;

        html += `
            <script>
                console.log("RUNNING");
                materialTopBar.init();
            </script>
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