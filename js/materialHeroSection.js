var materialHeroSection = (function () {
    var that = {};
    that.created = false;
    that.data = [];

    that.create = function (settings) {
        that.data = settings.data;
        console.log('that.data', that.data)

        var htmlWrapper = `
            <div class="materialHeroSection help-animated-hero-section">
                <div class="carouselControl">
                    <button class="carouselControlPrev">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 4.5L7.5 12L15 19.5" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button class="carouselControlNext">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 19.5L16.5 12L9 4.5" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>

                <div class="heroSectionDiv">
                    <!-- Image BG Div added here -->
                </div>
            </div>
        `;
        that.created = true;

        return htmlWrapper;
    }

    that.init = function () {
        try {
            let i = 0;
            let interval = null;
            let heroSectionData = that.data;

            // Change background image
            const changeBGImage = () => {
                const heroSectionDiv = document.querySelector('.materialHeroSection .heroSectionDiv');

                if (!heroSectionDiv) { return }

                const imageIndex = (i + heroSectionData.length) % heroSectionData.length;

                // Remove heroBGImg div if it exists
                const heroBGImgExists = document.querySelector('.heroBGImg');
                if (heroBGImgExists) { heroSectionDiv.removeChild(heroBGImgExists) }

                // Create div with class "heroBGImg"
                const heroBGImg = document.createElement('div');
                heroBGImg.classList.add('heroBGImg');

                // Add it to the heroSectionDiv as the first child
                heroSectionDiv.insertBefore(heroBGImg, heroSectionDiv.firstChild);

                // Set the background image
                heroBGImg.style.backgroundImage = `url(${heroSectionData[imageIndex]?.image})`;

                // Set title and description
                heroBGImg.innerHTML = `
                    <div>
                        <h1 class="header">${heroSectionData[imageIndex]?.title}</h1>
                        <p class="headerSubText">${heroSectionData[imageIndex]?.description}</p>

                        <div class="buttonRow">
							<a href="${heroSectionData[imageIndex]?.buttonLink}"><button class="materialButtonFill materialThemeGoldDark">
                                ${heroSectionData[imageIndex]?.percentageComplete < 5 ? 'Start Learning' : 'Resume Learning'}
                            </button></a>
                            <p>${heroSectionData[imageIndex]?.percentageComplete}% Completed</p>
                        </div>
                    </div>
                `;
            };

            // // Create a function to start the interval
            // const startInterval = () => {
            //     interval = app.runTimer(
            //         () => {
            //             i++;
            //             changeBGImage();
            //         }, 5000)
            // };

            // Start the initial interval
            const startInterval = () => {
                interval = app.runTimer(
                    () => {
                        i++;
                        changeBGImage();
                    }, 9000
                )
            }

            // Set the initial background image
            changeBGImage();

            // Start the initial interval
            startInterval();

            const changeBGImageControl = function (type) {
                if (type === 'next') {
                    i++;
                } else {
                    i--;
                    if (i < 0) { i = heroSectionData.length - 1 } // If the index is less than 0, set it to the last index, so it will loop back
                }

                app.clearTimer(interval);

                changeBGImage();

                // Restart the interval
                startInterval();
            }

            const carouselControlNext = document.querySelector('.carouselControlNext');
            carouselControlNext.addEventListener('click', () => changeBGImageControl('next')); // Pass a function reference

            const carouselControlPrev = document.querySelector('.carouselControlPrev');
            carouselControlPrev.addEventListener('click', () => changeBGImageControl('prev')); // Pass a function reference
        } catch (error) {
            console.error(error);
        }
    }

    return that;
})();
