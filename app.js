// StackOverFlow API URL with parameters set
function advancedSearchURLFromForm(data) {
    const baseURL = `https://api.stackexchange.com/2.2/search/advanced`
    let url = `?page=${data.pageNo}`
    url += `&pagesize=${data.pageSize}`
    url += `&fromdate=${data.fromDate}`
    url += `&todate=${data.toDate}`
    url += `&min=${data.minDate}`
    url += `&max=${data.maxDate}`
    url += `&order=${data.selectedOrder}`
    url += `&sort=${data.selectedSort}`
    url += `&q=${data.searchedForText}`
    url += `&accepted=${data.selectedAccepted}`
    url += `&answers=${data.answerNo}`
    url += `&body=${data.bodyText}`
    url += `&closed=${data.selectedClosed}`
    url += `&migrated=${data.selectedMigrated}`
    url += `&notice=${data.selectedNotice}`
    url += `&nottagged=${data.notTagText}`
    url += `&tagged=${data.tagText}`
    url += `&title=${data.titleText}`
    url += `&user=${data.userNo}`
    url += `&url=${data.urlLink}`
    url += `&views=${data.viewsNo}`
    url += `&wiki=${data.selectedWiki}`
    url += `&site=stackoverflow`

    return baseURL + url
}

function parseDataFromForm(pageNo) {
    // Get all the parameter elements and store values in data.
    let data = {}
    data.searchedForText = document.querySelector('#search-param').value;
    data.pageSize = document.querySelector('#pageSize-param').value;
    data.viewsNo = document.querySelector('#views-param').value;
    data.userNo = document.querySelector('#user-param').value;
    data.answerNo = document.querySelector('#answers-param').value;
    data.bodyText = document.querySelector('#body-param').value;
    data.titleText = document.querySelector('#title-param').value;
    data.urlLink = document.querySelector('#url-param').value;
    data.fromDate = document.querySelector('#fromdate-param').value;
    data.toDate = document.querySelector('#todate-param').value;
    data.minDate = document.querySelector('#min-param').value;
    data.maxDate = document.querySelector('#max-param').value;
    data.notTagText = document.querySelector('#nottagged-param').value;
    data.tagText = document.querySelector('#tagged-param').value;
    data.selectedOrder = document.querySelector('#order-param').value;
    data.selectedSort = document.querySelector('#sort-param').value;
    data.selectedAccepted = document.querySelector('#accepted-param').value;
    data.selectedClosed = document.querySelector('#closed-param').value;
    data.selectedMigrated = document.querySelector('#migrated-param').value;
    data.selectedNotice = document.querySelector('#notice-param').value;
    data.selectedWiki = document.querySelector('#wiki-param').value;


    // Convert Dates using Date.Parse and remove two zeros, else if no Date is selected, then return no value.
    data.fromDate = data.fromDate ? Date.parse(data.fromDate) / 1000 : "";
    data.toDate = data.toDate ? Date.parse(data.toDate) / 1000 : "";
    data.maxDate = data.maxDate ? Date.parse(data.maxDate) / 1000 : "";
    data.minDate = data.minDate ? Date.parse(data.minDate) / 1000 : "";

    data.pageNo = pageNo;

    return data
}

// Display fetched results on page
function displayResults(responseJson, responseContainer, pagination_element, data) {
    let hasMore = responseJson.has_more;
    var results = responseJson.items;

    // Used StackOverFlow PageSize parameter to set the amount of results to be shown in a page
    let rows = data.pageSize;

    // Function to display the page
    function displayPage(items) {
        responseContainer.innerHTML = "";

        let resultsListItems = items.map(post =>
            `<li class="article">
                   <a href="${post.link}">
                     <h2>${post.title}</h2>
                     <p>${data.searchedForText} by ${post.owner.display_name}</p>
                   </a>
            </li>`
        ).join('')

        let htmlContent = `<ul>` + resultsListItems + `</ul>`

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
    
    // Function to Append pagination buttons
    function createButton(items, hasMore) {
        pagination_element.innerHTML = ''

        for (let i = 1; i < data.pageNo + 1; i++) {
            let btn = paginationButton(i, items);
            pagination_element.appendChild(btn);
        }

        if (hasMore) {
            let moreBtn = paginationButton(data.pageNo + 1, items);
            pagination_element.appendChild(moreBtn);

            let dotsButton = document.createElement('button');
            dotsButton.innerText = "...";
            pagination_element.appendChild(dotsButton);
        }

    }

    // Function to create pagination buttons and send it to createButton function
    function paginationButton(page, items) {
        let button = document.createElement('button');
        button.innerText = page;

        if (data.pageNo == page) button.classList.add('active');

        button.addEventListener('click', function () {
            data.pageNo = page;
            fetch(advancedSearchURLFromForm(data))
            .then(
                (response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    alert('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
            
                // Examine the text in the response
                response.json().then(json => displayResults(json, responseContainer, pagination_element, data))
                .catch(err => console.log(err, 'article'));
                }
            )   

            let current_btn = document.querySelector('.pagenumbers button.active');
            current_btn.classList.remove('active');

            button.classList.add('active');
        });
        return button;
    };

    // Calling the displayPage function and createButton functiom
    displayPage(results, rows, data.pageNo);
    createButton(results, hasMore);
}

(function () {

    // Get main search form
    const form = document.querySelector('#search-form');

    // Get elements where we have to append recieved data
    const responseContainer = document.querySelector('#response-container');
    const pagination_element = document.querySelector('.pagenumbers')

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Empty Container everytime a new search is done.
        responseContainer.innerHTML = '';

        pageNo = 1;
        data = parseDataFromForm(pageNo);

        // Fetch from StackOver Flow api    
        fetch(advancedSearchURLFromForm(data))
            .then(
                (response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    alert('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                response.json().then(json => displayResults(json, responseContainer, pagination_element, data))
                .catch(err => console.log(err, 'article'));
                }
            )     
    });
})();