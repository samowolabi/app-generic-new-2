var materialCardScrolling = (function () {
    var that = {};
    that.created = false;

    var getHtml = function (settings) {
        var html = '';

        const { data, list } = settings

        console.error('data', data)
        console.error('list', list)

        list.forEach(function (item) {
            if(data.lesson.hasOwnProperty(item)) {
                html += `
                    <div style="width: 430px" class="">
                        <div style="width: 100%" class="materialCard materialThemeDarkGold">
                            <div class="materialCardTop" data-button="" data-href="#!/course/1000001">
                                <div class="materialCardImg">
                                    <div class="materialCardImgInside" style="background-image: url(${data.lesson[item]?.image}); background-color: grey;"></div>
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
                                    <h2 class="materialHeader" style="font-size: 1.9em">${data.lesson[item]?.title}</h2>
                                    <h6 class="materialHeader"><b>Genre:</b> Classical</h6>
                                    <p class="materialParagraph materialThemeDarkGold"></p>
                                </div>
                            </div>
                            <div class="materialCardAction materialThemeDarkGold">
                                <p class="coming" style="font-weight: bold;"><i class="fa fa-clock-o"></i> Available Soon</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        return html;
    }


    that.create = function (settings) {
        var htmlWrapper = `
            <div class="materialCardsScrolling">
                <div class="overlay scrollLeft">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4.5L7.5 12L15 19.5" stroke="#F9F4DE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

                <div class="overlay scrollRight">
                    <svg width="25" height="25" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.99121 4.88672L17.9911 12.8866L9.99121 20.8864" stroke="#F9F4DE" stroke-width="1.59997" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <div class="materialCardsDiv">
                    ${getHtml(settings)}
                </div>
            </div>
        `;
        that.created = true;

        return htmlWrapper;
    }

    that.init = function () {
        try {
            document.querySelectorAll(".app_coursesCardsContainer").forEach(function (parentDiv) {
                const cardsScrollingDiv = parentDiv.querySelector('.materialCardsDiv');
                const containerWidth = cardsScrollingDiv.scrollWidth;
                const scrollAmount = 800;

                // Hide Left Carousel at first
                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').addEventListener('click', function (event) {
                    cardsScrollingDiv.scrollLeft -= scrollAmount;
                    if (cardsScrollingDiv.scrollLeft <= 0) {
                        cardsScrollingDiv.scrollLeft = containerWidth - cardsScrollingDiv.clientWidth;
                    }
                });

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').addEventListener('click', function (event) {
                    cardsScrollingDiv.scrollLeft += scrollAmount;

                    if (cardsScrollingDiv.scrollLeft + cardsScrollingDiv.clientWidth >= containerWidth) {
                        cardsScrollingDiv.scrollLeft = 0;
                    } else {
                        // Show Left Carousel
                        parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'flex';
                    }
                });
            })
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();