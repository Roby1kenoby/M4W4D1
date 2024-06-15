let urlServer = 'https://striveschool-api.herokuapp.com/api/product/'
let tokenAuth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3M2M5NTdmNmI0YjAwMTU0MjhmYmIiLCJpYXQiOjE3MTgwNDE3NDksImV4cCI6MTcxOTI1MTM0OX0.cWXhY0IiDf_t2ETumzY24fHKfUkwU7xaKt_sXZeu7Bw"
let nav = document.getElementById('navigation')
let cartList = document.querySelector('#cartList ul')
let cartBadge = document.getElementsByClassName('badge')[0]
let cartTotal = document.getElementById('cartTotal')
let productPropertyes = ['name', 'brand', 'price', 'description']
let productName = document.getElementById('productName')
let productBrand = document.getElementById('productBrand')
let productDescription = document.getElementById('productDescription')
let productPrice = document.getElementById('productPrice')
let productImage = document.getElementById('productImage')
let btnWrapper = document.getElementsByClassName('bottomButtonWrapper')[0]
let btnAdd = document.getElementById('btnAdd')
let btnRemove = document.getElementById('btnRemove')
let cart = []
let productId = ''

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
            // console.log(data)
            // products = data
            // console.log(data)
            return data
        }
    } catch (error) {
        console.log(error)
    }
}

// function to add rows to cart list
let addCartRow = function(product){
    let listElement = document.createElement('li')
    listElement.classList.add('productList', 'w-100', 'd-flex', 'align-items-center')
    listElement.dataset.id = product._id
    listElement.innerHTML = 
    `
    <div class="productInfos d-flex">
        <p class="fw-bold">${product.name}</p>
        <p class="fw-bold">${product.price.toLocaleString('it-IT')} €</p>
    </div>
    <button class="btn btn-danger" onclick="removeFromCart('${product._id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
        </svg>
    </button>
    `
    let hr = document.createElement('hr')
    cartList.appendChild(listElement)
    cartList.appendChild(hr)
}

// function to add a product to the cart
let addToCart = async function(id){
    let p = await f_getProducts(id)
    // adding to cart only if not already present
    if (!cart.find(c => c._id === id)){
        cart.push(p)
        clearCartRows()
        updateCartValues()
        printRows(cart)
        // chaging from add to remove
        toggleBuyButton(id)
        // saving cart to localstorage
        storeCart()
    }
}

// function to calculate total of cart and update badge and total
let updateCartValues = function(){
    let tot = 0
    // sum of each price value of every element in the cart 
    cart.forEach(p => {tot += p.price})
    // nr of elements in cart is the nr of products
    cartBadge.innerHTML = cart.length
    // showing badge if ther's at least one product
    cart.length > 0 ? cartBadge.classList.remove('d-none') : cartBadge.classList.add('d-none') 
    cartTotal.innerHTML = tot.toLocaleString('it-IT') + ' €'
}

// function to clear the cartRows
let clearCartRows = function(){
    cartList.innerHTML = ''
}

// function to remove product from cart
let removeFromCart = function(id){
    // if element is in cart i remove it
    cart.forEach((p, i) => {
        p._id === id ? cart.splice(i,1) : null
    })
    // refreshing the cart rows
    clearCartRows()
    printRows(cart)
    // toggling the corresponding button
    toggleBuyButton(id)
    // saving cart to localstorage
    storeCart()
}

// function to toggle add\remove buttons on click
let toggleBuyButton = function(id){
    // searching the buttons inside the wrapper with the correct id
    let btns = document.querySelectorAll(`.bottomButtonWrapper[data-id="${id}"] button`)
    // adding or removing d-none 
    btns.forEach(b => {
        b.classList.contains('d-none') ? b.classList.remove('d-none') : b.classList.add('d-none')
    })
}

// function to draw rows for products in cart
let printRows = function (cartArray){
    cartArray.forEach(p => {
        addCartRow(p)
    })
    updateCartValues()
}

// function to update buttons on cards based on the cart
let updateButtons = function(){
    cart.forEach(p => {
        toggleBuyButton(p._id)
    })
}

// function to buy things and empty the cart
let buy = function(){
    if (cart.length > 0){
        alert(`Thank you for purchasing our experiences!\nYour total is: ${cartTotal.innerHTML}€\nSee you soon!`)
        updateButtons()
        cart = []
        clearCartRows()
        updateCartValues()
        // clearing local storage
        localStorage.clear()
    }
}

// function to add cart to local storage
let storeCart = function(){
    localStorage.setItem('cart', JSON.stringify(cart))
}

// function to get cart items from localstorage
let getCart = function(){
    let tempCart = localStorage.getItem('cart')
    // if ther's no cart saved, i skip this step
    // otherwise, cart is filled with items in localStorage
    tempCart ? cart = JSON.parse(tempCart) : null
}

// function to update page after reading the cart
let updateFromCart = function(){
    if(cart.length>0){
        clearCartRows()
        printRows(cart)
    }
}

// function to read queryString parameters
let getQsParameters = function(){
    const params = new URLSearchParams(window.location.search)
    productId = params.get("id")
}

// function to update the product details
let updateProductPage = async function(){
    let productDetails = await f_getProducts(productId)
    productName.innerHTML = productDetails.name
    productBrand.innerHTML = productDetails.brand
    productDescription.innerHTML = productDetails.description
    productPrice.innerHTML = `${productDetails.price.toLocaleString('it-IT')}€ `
    productImage.src = productDetails.imageUrl
    btnWrapper.dataset.id = productDetails._id
    btnAdd.setAttribute('onclick','addToCart("'+productDetails._id+'")') 
    btnRemove.setAttribute('onclick','removeFromCart("'+productDetails._id+'")')
}

// fastload
onload = async (e) => {
    getQsParameters()
    getCart()
    updateFromCart()
    // need to wait for the update before eventually toggle buttons
    await updateProductPage()
    updateButtons()
}