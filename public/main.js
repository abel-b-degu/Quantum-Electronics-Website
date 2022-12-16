const navstring= () =>{
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    //toggle nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');    

    });
  
    
}



navstring();


class CartItem{
    constructor(name, desc, img , price){   
        this.name = name 
        this.desc = desc
        this.img = img
        this.price = price  
        this.quantity = 1
    }
}



class LocalCart{
    static key = "cartItems"

    static getLocalCartItems(){
        let cartMap = new Map()
        const cart = localStorage.getItem(LocalCart.key)
        if(cart===null || cart.length===0)  return cartMap
            return new Map(Object.entries(JSON.parse(cart)))

    }
    static addItemToLocalCart(id,item){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            mapItem.quantity +=1 
            cart.set(id, mapItem)
        }
        else
            cart.set(id, item)
            localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
            updateCartUI()
    }


    static removeItemFromCart(id){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            if(mapItem.quantity>1)
            {
                mapItem.quantity -=1
                cart.set(id, mapItem)
            }
            else
                cart.delete(id)
        }    
            if(cart.length===0)
                localStorage.clear()
            else
                localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
                updateCartUI()
            
    }
    
}





const cartIcon = document.querySelector('.fa-cart-shopping')
const wholeCartWindow = document.querySelector('.whole-cart-window')

wholeCartWindow.inWindow = 0
const addToCartBtns = document.querySelectorAll('.add-to-cart-button')
addToCartBtns.forEach( (btn) =>{
    btn.addEventListener('click', addItemFunction)
})





function addItemFunction(e){
    const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id")
    const img = e.target.parentElement.parentElement. previousElementSibling.src
    const name = e.target.parentElement .previousElementSibling.textContent
    const desc = e.target.parentElement.children[0].textContent

    let price = e.target.parentElement.children[1].textContent
    price = price.replace("Price: $", '');
    const item = new CartItem(name, desc, img, price)
    LocalCart.addItemToLocalCart(id, item)
    console.log(price)
}

cartIcon.addEventListener('mouseover', () =>{
    if(wholeCartWindow.classList.contains('hide'))
    wholeCartWindow.classList.remove('hide',)
});



cartIcon.addEventListener('mouseleave', ()=>{
    setTimeout( ()=>{
        if(wholeCartWindow.inWindow===0){
            wholeCartWindow.classList.add('hide')
        }
    },500)
})

wholeCartWindow.addEventListener('mouseover', ()=>{
    wholeCartWindow.inWindow=1
    
});

wholeCartWindow.addEventListener('mouseleave', ()=>{
    wholeCartWindow.inWindow = 0
    wholeCartWindow.classList.add('hide')
    
});

function updateCartUI(){
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML=""
    const items = LocalCart.getLocalCartItems()
    if(items === null) return

    let count = 0
    let total = 0
    for(const [key, value] of items.entries()) {
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')

        let price = value.price*value.quantity
        price = Math.round(price*100)/100
        count+=1
        total += price
        total =  Math.round(total*100)/100
        cartItem.innerHTML =
    ` 
        <img src="${value.img}">
        <div class="details">
            <h5>${value.name}</h5>
            <p>${value.desc}
                <span class="quantity">Quantity: ${value.quantity}</span>
                <span class="price">Price: $ ${price}</span> 
            </p>
        </div>
        <div class="cancel"><i class="fa-sharp fa-solid fa-xmark"></i></div>
    `

    cartItem.lastElementChild.addEventListener('click', ()=>{
        LocalCart.removeItemFromCart(key)
    })
    cartWrapper.append(cartItem) 
    }

    if(count > 0){
        cartIcon.classList.add('non-empty')
        let root = document.querySelector(':root')
        root.style.setProperty('--after-content', `"${count}"`)
        const subtotal = document.querySelector('.subtotal')
        subtotal.innerHTML = `Subtotal: $${total}`
    }
    else
    cartIcon.classList.remove('non-empty')
}

document.addEventListener('DOMContentLoaded', ()=>{updateCartUI})