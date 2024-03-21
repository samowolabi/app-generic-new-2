var materialCardScrollingGeneric = (function () {
    var that = {};
    that.created = false;

    var getHtml = function (settings) {
        const { list, items } = settings
        var html = '';

        list.forEach(function (element) {
            html += `
                <div class="" tab-id="${element.tab_id}">
                    ${element.content}
                </div>
            `;
        });

        return html;
    }

    that.create = function (settings) {
        var htmlWrapper = `
            <div class="materialCardScrollingParentContainer">    
                <div class="materialCardsScrolling">
                    <div class="overlay scrollLeft">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 4.5L7.5 12L15 19.5" stroke="#F9F4DE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>

                    <div class="overlay scrollRight">
                        <svg viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.99121 4.88672L17.9911 12.8866L9.99121 20.8864" stroke="#F9F4DE" stroke-width="1.59997" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    
                    <div class="materialCardsDiv" style="width: auto">
                        ${getHtml(settings)}
                    </div>
                </div>
            </div>
        `;

        that.created = true;
        return htmlWrapper;
    }

    that.init = function () {
        try {
            document.querySelectorAll(".materialCardScrollingParentContainer").forEach(function (parentDiv) {
                console.log('parentDiv', parentDiv);

                const cardsScrollingDiv = parentDiv.querySelector('.materialCardsDiv');
                const scrollAmount = 354;

                // Function to calculate the snap position based on card width
                function calculateSnapPosition() {
                    const cardWidth = parentDiv.querySelector('.materialCard').offsetWidth;
                    console.log('cardWidth', cardWidth);
                    
                    const snapIndex = Math.round(cardsScrollingDiv.scrollLeft / cardWidth);
                    return snapIndex * cardWidth;
                }

                // Hide Left Carousel at first
                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';

                // Show left Carousel if there is scroll
                cardsScrollingDiv.addEventListener('scroll', function (event) {
                    if (cardsScrollingDiv.scrollLeft > 0) {
                        parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'flex';
                    } else {
                        parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';
                    }
                });

                // Hide Right Carousel if there is no scroll
                // if (cardsScrollingDiv.scrollWidth <= cardsScrollingDiv.clientWidth) {
                //     parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').style.display = 'none';
                // }

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').addEventListener('click', function (event) {
                    // cardsScrollingDiv.scrollLeft -= scrollAmount;
                    // if (cardsScrollingDiv.scrollLeft <= 0) {
                    //     cardsScrollingDiv.scrollLeft = containerWidth - cardsScrollingDiv.clientWidth;
                    // }

                    const snapPosition = calculateSnapPosition() - scrollAmount;
                    cardsScrollingDiv.scrollTo({
                        left: snapPosition,
                        behavior: 'smooth'
                    });
                });

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').addEventListener('click', function (event) {
                    // console.log('scrollRight');
                    // cardsScrollingDiv.scrollLeft += scrollAmount;

                    // if (cardsScrollingDiv.scrollLeft + cardsScrollingDiv.clientWidth >= containerWidth) {
                    //     cardsScrollingDiv.scrollLeft = 0;
                    // } else {
                    //     // Show Left Carousel
                    //     parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'flex';
                    // }

                    console.log('scrollRight');

                    const snapPosition = calculateSnapPosition() + scrollAmount;
                    cardsScrollingDiv.scrollTo({
                        left: snapPosition,
                        behavior: 'smooth'
                    });
                });
            });
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    that.scrollToDiv = function (tabId) {
        // tabId is the index of the div to scroll to
        try {
            const cardScrollingTabId = document.querySelector(`.materialCardScrollingParentContainer .materialCardsDiv div[tab-id="${tabId}"]`);
            if (!cardScrollingTabId) { return; }

            cardScrollingTabId.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();