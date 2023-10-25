var materialAccordion = (function () {
    var that = {};
    that.created = false;

    var getHtml = function (settings) {
        var html = '';

        settings.list.forEach(function (item) {
            html += `
                <div class="materialAccordionHeader" data-active=${item.onInitOpenAccordion ? 'active' : ''}>
                    <div>
                        <h4>${item.header}</h4>
                        <p>${item.subHeader}</p>
                    </div>
                    <div class="dropdownIcon">
                        <svg width="24" height="24" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.27539 13.0817L16.7345 23.5408L27.1937 13.0817" stroke="#C8C8C8" stroke-width="2.09183" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                </div>

                <div class="materialAccordionContent">
                    ${item.content}      
                </div>
            `;
        })

        return html;
    }

    that.create = function (settings) {
        var htmlWrapper = `
            <div class="materialAccordion">
                ${getHtml(settings)}
            </div>
        `;

        that.created = true;

        return htmlWrapper;
    }

    that.init = function () {
        try {
            const accordionButtons = document.querySelectorAll('.materialAccordionHeader');

            // Function to toggle Accordion
            function toggleAccordion(button, content) {
                button.classList.toggle('active');
                content.classList.toggle('active');

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }

            accordionButtons.forEach(button => {
                // Set Default Accordion
                if(button.dataset.active === 'active') {
                    toggleAccordion(button, button.nextElementSibling);
                }
                
                button.addEventListener('click', () => {
                    const content = button.nextElementSibling;
                    toggleAccordion(button, content);
                });
            });
        } catch (error) {
            console.error(error); // Print the actual error message
        }
    }
    return that;
})();