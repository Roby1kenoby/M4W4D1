let urlServer = 'https://striveschool-api.herokuapp.com/api/product/'
let tokenAuth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3M2M5NTdmNmI0YjAwMTU0MjhmYmIiLCJpYXQiOjE3MTgwNDE3NDksImV4cCI6MTcxOTI1MTM0OX0.cWXhY0IiDf_t2ETumzY24fHKfUkwU7xaKt_sXZeu7Bw"
let cardContainer = document.getElementById('cardsContainer')
let nav = document.getElementById('navigation')
console.log(nav.offsetTop)
let products = []

// function to get a specific product via it's id, or all the products if ther's no id
let f_getProducts = async function(id=''){
    try {
        const resp = await fetch(urlServer+id,{
            method: 'GET',
            headers: {
                'Authorization': tokenAuth,
            }
        })
        if (resp.status >= 400 && resp.status <= 600){
            alert('Warning, product not found')
        }
        else{
            let data = await resp.json()    
            console.log(data)
            products = data
            // console.log(data)
            return data
        }
    } catch (error) {
        console.log(error)
    }
}

// script to create a card
let createCard = function(product){
    let cardWrapper = document.createElement('div')
    cardWrapper.classList.add('cardWrapper')
    cardWrapper.innerHTML = 
    `
    <div class="card" data-id="${product._id}">
        <div class="imgWrapper">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
            <div class="bottomButtonWrapper">
                <button class="btn btn-primary">Add</button>
                <button class="btn btn-danger d-none">Remove</button>
            </div>
        </div>
        <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <div class="d-flex justify-content-between">
                    <a href="#"><h5 class="name card-title">${product.name}</h5></a>
                    <p class="price">${product.price} €</p>
                </div>
                <p class="brand">${product.brand}</p>
                <hr>
                <p class="description card-text">${product.description}</p>
            </div>
            <hr>
            
        </div>
    </div>
    `
    cardContainer.appendChild(cardWrapper)
}

// function to print cards on screen
let printCards = function(dataArray){
    dataArray.forEach(p => {
        createCard(p)
    })
}


function stickynavbar() {
    if (window.scrollY >= nav.offsetHeight) {    
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');    
    }
}
window.addEventListener('scroll', stickynavbar);

// fastload
onload = async (e) => {
    products = await f_getProducts()
    printCards(products)
}