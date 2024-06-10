
let urlServer = 'https://striveschool-api.herokuapp.com/api/product/'
let tokenAuth = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY3M2M5NTdmNmI0YjAwMTU0MjhmYmIiLCJpYXQiOjE3MTgwNDE3NDksImV4cCI6MTcxOTI1MTM0OX0.cWXhY0IiDf_t2ETumzY24fHKfUkwU7xaKt_sXZeu7Bw"
let testProduct = {
    name: "nomeProdotto6",
    description: "descProdotto2",
    brand: "brandProdotto2",
    imageUrl: "imageProdotto2",
    price: 100
}

// function to authenticate 
let auth = async function(){
    let keyData = await fetch(urlAuthentication)
    let data = await keyData.json()
    console.log(data)
}

// function to add products
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
            alert(`Product correctly inserted. Status resp: ${data.status}`)
        }
    } catch (error) {
        console.log('sono in error: ', error)
    }
    

}
// fastload
onload = (e) => {
    addProduct(testProduct)
}