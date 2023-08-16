import { menuArrayfromFile } from "/data.js"
const menu = document.getElementById("menu")
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let menuArray = JSON.parse(localStorage.getItem("menuArray"))
let itemCart = []
const modal = document.getElementById('modal')
const paymentForm = document.getElementById("payment-form")

function main() {
    if (menuArray) {
        render()
    }
    else {
        menuArray = menuArrayfromFile
        render()
    }
}

document.addEventListener("click" ,function(e) {
    if(e.target.dataset.addBtn) {
        addItemtoCart(e.target.dataset.addBtn)
        if (itemCart.length > 0) {
            document.getElementById("order").style.display = "inline"
        }
    }
    else if (e.target.dataset.remove) {
        removeItemfromCart(e.target.dataset.remove)
        if (itemCart.length === 0) {
            document.getElementById("order").style.display = "none"
        }
    }
    else if (e.target.dataset.complete) {
        if (itemCart.length > 0) {
            modal.style.display = "inline"
        }
    }
    else if(e.target.dataset.closeModal) {
        modal.style.display = "none"
    }
})

paymentForm.addEventListener('submit', function (e){
    e.preventDefault()
    modal.style.display = "none"
    const paymentFormData = new FormData(paymentForm)
    const name = paymentFormData.get("name")
    document.getElementById("order").style.display = "none"
    showThanks(name)
})

function getMenuHTML() {
    let menuHTML = ``
    
    menuArray.forEach(function(menuItem) {
        let ingredientList = ``
        menuItem.ingredients.forEach(function(ingredient) {
            ingredientList += `
                <p class="item-title" id="item-title">${ingredient}</p>
            `
        })
        
        menuHTML += `
                <div class="menu-item" id="menu-item">
                    <p class="item-emoji">${menuItem.emoji}</p>
                    <div class="item-details" id="item-details">
                        <p class="item-title" id="item-title">${menuItem.name}</p>
                        <p class="ingredients" id="ingredients">${menuItem.ingredients}</p>
                        <p class="price" id="price">$${menuItem.price}</p>
                    </div>
                    <button class="add-btn" id="add-btn">
                        <img src="/assets/add-btn.png" data-add-btn="${menuItem.id}">
                    </button>
                </div>
        ` 
    })
    return menuHTML 
}

function addItemtoCart(itemId) {
    let tempItem = {}
    // console.log(itemId)
    const selectedItem = menuArray.filter(function(item) {
        return String(item.id) === itemId
    })[0]
    tempItem = structuredClone(selectedItem)
    tempItem.uuid = uuidv4()
    itemCart.push(tempItem)
    // console.log(itemCart)
    
    renderCart()
}

function removeItemfromCart(itemUuid) {
    itemCart = itemCart.filter(function(item) {
        return item.uuid != itemUuid
    })
    renderCart()
}

function updateCartPrice(totalCartPrice) {
    document.getElementById("total-price").innerHTML = totalCartPrice
}

function renderCart() {
    let orderHTML = ``
    let totalCartPrice = 0
    
    itemCart.forEach(function(item) {
        orderHTML += `
            <div class="order-item">
                <div class="order-details">
                    <p class="added-name">${item.name}</p>
                    <button class="remove-btn" id="remove-btn" data-remove="${item.uuid}">remove</button>
                </div>
                <p>${item.price}</p>
            </div>
        `
        totalCartPrice += item.price
    })

    updateCartPrice(totalCartPrice)    
    document.getElementById("order-items").innerHTML = ""
    document.getElementById("order-items").innerHTML += orderHTML
}

function render() {
    document.getElementById("menu").innerHTML += getMenuHTML()
}

function showThanks(name) {
    document.getElementById("show-thanks").innerHTML = `<p class="thanks">Thanks ${name} your order is on it's way!</p>`
} 

main()