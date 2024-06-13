
let urlServer = 'https://striveschool-api.herokuapp.com/api/product/'
let tokenAuth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3M2M5NTdmNmI0YjAwMTU0MjhmYmIiLCJpYXQiOjE3MTgwNDE3NDksImV4cCI6MTcxOTI1MTM0OX0.cWXhY0IiDf_t2ETumzY24fHKfUkwU7xaKt_sXZeu7Bw"
let tbody = document.getElementsByTagName('tbody')[0]
let modal = new bootstrap.Modal(document.getElementById('newProductModal'))
let modalForEvent = document.getElementById('newProductModal')
let modalInputFields = document.querySelectorAll('#modalFormWrapper .inputField')
let modalTitle = document.getElementById('modalTitle')
let modalSaveButton = document.getElementById('modalSaveButton')
let searchInput = document.getElementById('searchBar')
let filterButton = document.getElementById('searchButton')
let refreshButton = document.getElementById('refreshButton')
let masterCheckbox = document.getElementById('checkAll');
let products = []
let productPropertyes = ['name', 'brand', 'price', 'description']

// (the f_ prefix means ther's a direct fetch inside)
// function to add products to the backend 
let f_addProduct = async function(product){
    try {
        const resp = await fetch(urlServer, {
            method: 'POST',
            body: JSON.stringify(product),
            headers:{
                "Authorization": tokenAuth,
                "Content-type": "application/json"
            }
        })
        if (resp.status >= 400 && resp.status <= 600){
            const data = await resp.text()  
            alert(`Warning, product not saved for the following reason:\n${data}`)
        }
        // else{
        //     alert(`Product correctly inserted.`)
        // }
    } catch (error) {
        console.log('sono in error: ', error)
    }
}

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
            products = data
            // console.log(data)
            return data
        }
    } catch (error) {
        console.log(error)
    }
}

// function to delete a product from the backend by it's id
let f_deleteProduct = async function(id){
    try {
        const resp = await fetch(urlServer+id,{
            method: 'DELETE',
            headers:{
                "Authorization": tokenAuth
            }
        })
    } catch (error) {
        
    }
}

// function to update a product in the backend by it's id
let f_updateProduct = async function(id, bod){
    try {
        const resp = await fetch(urlServer+id,{
            method: "PUT",
            headers: {
                "Authorization": tokenAuth,
                "Content-type": "application/json"
            },
            body: JSON.stringify(bod)
        })
        // console.log(resp)
    } catch (error) {
        console.log(error)
    }
}

// function to read data from modal and send the new product to the backend
let saveNewProduct = async function(){
    let tempProduct = {}
    modalInputFields.forEach(i => {
        tempProduct[i.name] = i.value
    })
    await f_addProduct(tempProduct)
    modal.toggle()
    clearForm()
    clearTable()
    refreshScreen()
}

// function to clear the new product modal form
let clearForm = function(){
    modalInputFields.forEach(i => {
        i.value = null
    })
}

// function to create a row for the table with the products
let createTableRows = function(product){
    let row = document.createElement('tr')
    row.innerHTML = 
    `
    <td class="tdCheck">
        <input type="checkbox" name="checkSingle" class="checkSingle" data-id="${product._id}">
    </td>
    <td class="tdImg">
        <div class="imgWrapper">
            <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid">
        </div>
    </td>
    <td class="tdBrand">${product.brand}</td>
    <td class="tdName">${product.name}</td>
    <td class="tdDescription">${product.description}</td>
    <td class="tdPrice">${product.price} €</td>
    <td>
        <button class="btn btn-success" onclick="editProduct('${product._id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
            </svg>
        </button>
    </td>
    <td>
        <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
        </button>
    </td>
    `
    tbody.appendChild(row)
}

// function to print rows on screen 
let printTable = function(dataArray){
    dataArray.forEach(p => {
        createTableRows(p)
    })
}

// function to clear rows on screen
let clearTable = function(){
    tbody.innerHTML = ''
}

// function to refresh the view (clean the table and reload rows)
let refreshScreen = async function(dataArray = []){
    products = await f_getProducts()
    // if dataArray is void, print products otherwise dataArray
    dataArray.length == 0 ? printTable(products) : printTable(dataArray)
}

// function called by the row to delete a product
let deleteProduct = async function(id){
    await f_deleteProduct(id)
    clearTable()
    refreshScreen()
}

// function to edit a product
let editProduct = async function(id){
    let product = await f_getProducts(id)
    // cycling throug modal input fields, for each one i assign it the 
    // value with the same key found in the fetch response
    modalInputFields.forEach(i => {
        i.value = product[i.name]
    })
    
    // changing modal title
    modalTitle.innerText = 'Edit Product'
    // changing modal function
    modalSaveButton.setAttribute('onclick', `callUpdateFetch("${id}")`)
    // showing the modal
    modal.toggle()
}

// function from edit modal called to save the updated data
let callUpdateFetch = async function(id){
    let editedProduct = {}
    modalInputFields.forEach(i => {
        editedProduct[i.name] = i.value
    })
    await f_updateProduct(id, editedProduct)
    // after the fetch, hide the modal then reset it to the original function 
    // and title, to be ready  to insert new products or edit again
    modal.toggle()
    clearTable()
    refreshScreen()
    
}

// function to filter products based on the search input
let filterProducts = async function (){
    toggleFilterButtons()
    filterDom()
}

// function to remove products not filtered from the dom
let filterDom = function(){
    let filteredProducts = []
    // for each product
    products.forEach(p => {
        // cycle through keys
        Object.keys(p).forEach(key => {
            // if the key is one that i need to evaluate
            if(productPropertyes.includes(key)){
                // if the searched value is inside the key value
                if(p[key].toString().toLowerCase().includes(searchInput.value.toLowerCase())){
                    // if the product isn't already in the array i push it
                    !filteredProducts.includes(p) ? filteredProducts.push(p) : null
                } 
            }
        })
    })
    clearTable()
    printTable(filteredProducts)
}

// function to reset the filter on products
let resetFilter = async function(){
    searchInput.value = ''
    toggleFilterButtons()
    clearTable()
    refreshScreen()
}

// function to toggle filter and refresh button visibility
let toggleFilterButtons = function(){
    if(filterButton.classList.contains('d-none')){
        filterButton.classList.remove('d-none')
        refreshButton.classList.add('d-none')
    }
    else{
        filterButton.classList.add('d-none')
        refreshButton.classList.remove('d-none')
    }
        
}

// event listener for modal hiding + reset form to initial state
modalForEvent.addEventListener('hidden.bs.modal', event => {
    // after the modal has hidden, reset it to the original function 
    // and title, to be ready  to insert new products or edit again
    modalTitle.innerText = 'New Product Details'
    modalSaveButton.setAttribute('onclick', 'saveNewProduct()')
    clearForm()
})

// event listener for main checkbox
masterCheckbox.addEventListener('change', function() {
    let checkboxes = document.getElementsByClassName('checkSingle')
    if (this.checked){
        for (c of checkboxes) {
            c.checked = true
        }
    }
    else{
        for (c of checkboxes) {
            c.checked = false
        }
    }
});

// function to delete all the products selected
let deleteSelectedProducts = async function(){
    let checkboxes = document.getElementsByClassName('checkSingle')
    for(c of checkboxes){
        // for every checked checkbox i get it's id from the dataset and delete the product
        c.checked ? await f_deleteProduct(c.dataset.id) : null
    }
    // then i clear the table and get the remaining products
    clearTable()
    await refreshScreen()
}


// fastload
onload = async (e) => {
    //initializeBackEndProducts(baseProducts)
    refreshScreen()
}


// array to fast load products in the backend
let baseProducts = [
    {
        "name": "Fluffy ball with puppy eyes",
        "description": "What else ther's to say?",
        "brand": "Dogghibus",
        "imageUrl": "https://picsum.photos/id/237/200/200",
        "price": 99999,
    },
    {
        "name": "Picsum4k",
        "description": "For photos on steroids!",
        "brand": "PhotoRoid",
        "imageUrl": "https://picsum.photos/id/250/200/200",
        "price": 150,
    },
    {
        "name": "The Wall",
        "description": "Lots of bricks",
        "brand": "Beatles",
        "imageUrl": "https://picsum.photos/id/210/200/200",
        "price": 50,
    },
    {
        "name": "A field of weath",
        "description": "Alooooo shaloooooom",
        "brand": "Gladiator",
        "imageUrl": "https://picsum.photos/id/33/200/200",
        "price": 200,
    },
    {
        "brand": "Motha Natureh",
        "name": "Rocks and Stones",
        "description": "Paradise fot dwarven",
        "imageUrl": "https://picsum.photos/id/15/200/200",
        "price": 500,
    },
    {
        "brand": "LonelyWorld",
        "name": "Solitary Bench",
        "description": "For lonely people (bread for ducks not included)",
        "imageUrl": "https://picsum.photos/id/87/200/200",
        "price": 15,
    },
    {
        "brand": "Brains",
        "name": "Land-Boat",
        "description": "A boat to go on rails. Pretty useless.",
        "imageUrl": "https://picsum.photos/id/69/200/200",
        "price": 0,
    },
    {
        "brand": "Dogghibus",
        "name": "Herbivore Dogs",
        "description": "Not sure this is ethical...",
        "imageUrl": "https://picsum.photos/id/169/200/200",
        "price": 5000.99,
    },
    {
        "brand": "Gandalf",
        "name": "The Shire",
        "description": "New Zeland more affected by dwarfism place is for sale! Go get your diggyhole!",
        "imageUrl": "https://picsum.photos/id/251/200/200",
        "price": 9000,
    }
]
// function to add a set of basic products
let initializeBackEndProducts = function(productArray){
    productArray.forEach(p => {
        f_addProduct(p)
    })
} 