
let urlServer = 'https://striveschool-api.herokuapp.com/api/product/'
let tokenAuth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3M2M5NTdmNmI0YjAwMTU0MjhmYmIiLCJpYXQiOjE3MTgwNDE3NDksImV4cCI6MTcxOTI1MTM0OX0.cWXhY0IiDf_t2ETumzY24fHKfUkwU7xaKt_sXZeu7Bw"

let products = []

// function to add products to the backend
let addProduct = async function(product){
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
        else{
            alert(`Product correctly inserted. Status resp: ${resp.status}`)
        }
    } catch (error) {
        console.log('sono in error: ', error)
    }
}

// function to get a specific product via it's id, or all the products if ther's no id
let getProducts = async function(id=''){
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
            return data
        }
    } catch (error) {
        console.log(error)
    }
}

// function to delete a product by it's id
let deleteProduct = async function(id){
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

// function to update a product by it's id
let updateProduct = async function(id, bod){
    try {
        const resp = await fetch(urlServer+id,{
            method: "PUT",
            headers: {
                "Authorization": tokenAuth,
                "Content-type": "application/json"
            },
            body: JSON.stringify(bod)

        })
        console.log(resp)
    } catch (error) {
        console.log(error)
    }
}


// fastload
onload = (e) => {
    getProducts()    
}