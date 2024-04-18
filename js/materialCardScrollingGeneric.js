var materialCardScrollingGeneric = (function () {
    var that = {};
    that.created = false;
    that.onCardsScrollCallback = null;

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
        that.onCardsScrollCallback = settings.onCardsScrollCallback;

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

    that.init = function () {
        try {
            document.querySelectorAll(".materialCardScrollingParentContainer").forEach(function (parentDiv) {
                const cardsScrollingDiv = parentDiv.querySelector('.materialCardsDiv');

                // Hide Left Carousel at first
                // parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').style.display = 'none';


                cardsScrollingDiv.addEventListener('scroll', function (event) {
                    const cardWidth = parentDiv.querySelector('.materialCard').offsetWidth;
                    const cardIndex = Math.round(cardsScrollingDiv.scrollLeft / cardWidth);

                    // Call the callback function
                    if (that.onCardsScrollCallback) {
                        that.onCardsScrollCallback(cardIndex);
                    }
                });

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollLeft').addEventListener('click', function (event) {
                    const cardWidth = parentDiv.querySelector('.materialCard').offsetWidth;
                    const scrollPos = cardsScrollingDiv.scrollLeft;
                    let cardIndex = Math.floor((scrollPos + cardsScrollingDiv.offsetWidth) / cardWidth) - 1;

                    console.log('cardIndexA', cardIndex);

                    if (cardIndex < 0) {
                        return;
                    }

                    if (cardIndex === 0) {
                        cardIndex = 1;
                    } else {
                        cardIndex = cardIndex + 1;
                    }

                    // Now scroll into view of cardscrollingdiv child
                    cardsScrollingDiv.children[cardIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });

                parentDiv.querySelector('.materialCardsScrolling .overlay.scrollRight').addEventListener('click', function (event) {
                    const cardWidth = parentDiv.querySelector('.materialCard').offsetWidth;
                    const scrollPos = cardsScrollingDiv.scrollLeft;
                    let cardIndex = Math.ceil((scrollPos + cardsScrollingDiv.offsetWidth) / cardWidth) - 1; // Adjusted to the end of the next card

                    if (cardIndex === 0) {
                        cardIndex = 1;
                    }

                    if (cardIndex >= cardsScrollingDiv.children.length) {
                        return;
                    }

                    console.log('cardIndexB', cardIndex);

                    // Now scroll into view of cardscrollingdiv child 
                    cardsScrollingDiv.children[cardIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
            });
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }

    return that;
})();