const swiper = new Swiper('.swiper', {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
   

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});


// let cart = [
//     {
//         name: "Pizza 1",
//         price: 123,
//         amount:1
//     },
//     {
//         name: "Desert 1",
//         price: 60,
//         amount: 2
//     }
// ]

let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

//выводит количество товаров
function shouwCount() {
    $("header .btn .amount").text(cart.length);
}

shouwCount();



// клик по кнопке в корзину
$(".products .btn").click(function () {
 let price = parseFloat($(this).prev().text())//цена    
 let name = $(this).parent().prev().text()//название
    let picture = $(this).parents(".product").find("img").attr("src")

let findProduct = cart.find(product => product.name == name)

    if (findProduct) {
        findProduct.amount++;
    }
    else {
        cart.push({
            name,
            price,
            picture,
            amount: 1
        })
    }
    shouwCount();

localStorage.setItem("cart",JSON.stringify(cart))

});


// вывод товаров в корзине
cart.forEach(product => {
    $(".cart").append(`
    <div class="cart-product">
    <div><img src="${product.picture}" alt=""> </div>
    <div>${product.name}</div>
    <div class="cart-amount">
    <div class="minus" onclick="minus(this)"> - </div>
    <div>${product.amount}</div>
    <div class="plus"  onclick="plus(this)"> + </div>
    </div>
    <div>${product.price}</div>
</div>`)
});
    
function plus(elem) {
    let amount = $(elem).prev().text();
    amount++;
    $(elem).prev().text(amount);

    let name = $(elem).parent().prev().text();
    let findProduct = cart.find(product => product.name == name);
    findProduct.amount = amount;
    localStorage.setItem("cart", JSON.stringify(cart));
}


function minus(elem) {
    let amount = $(elem).next().text();
    amount--;
    $(elem).next().text(amount);

    let name = $(elem).parent().prev().text();
    let findProduct = cart.find(product => product.name == name);
    findProduct.amount = amount;

    if (amount <= 0) {
        cart = cart.filter(product => product.name != name)
        $(elem).parents(".cart-product").remove();
 }
    localStorage.setItem("cart", JSON.stringify(cart));
}

$("input[name=phone]").inputmask({ "mask": "+38(999)999-99-99" })

$(".order").submit(function (e) {
    e.preventDefault();
    let city = $(".order [name=city]").val();
    let address = $(".order [name=address]").val();
    let phone = $(".order [name=phone]").val();
    if (address != "" && phone != ""){
    let token = "6599005960:AAHSVMQsfFcpkToW4O796k37Nph2xPHiedY";
    let chat = "1124848055"


    let massage = `Город: ${city}, Адрес: ${address}, Телефон: ${phone}`;
    
    massage+= "%0A"
    
    massage +="Заказ: %0A"

    cart.forEach(product => { 
        massage += `${product.name}, ${ product.amount}, ${product.price} %0A`
    })
    let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${massage}`

    fetch(url)

    cart = [];
    $(".cart").text("")
    shouwCount();
    localStorage.clear()
        $(".bg").removeClass("hidden")
    }
    else {
        if (address == "") {
            $(".error-address").removeClass("hidden")
        }
        if (phone == "") {
            $(".error-phone").removeClass("hidden")
        }
    }
})



$(".close").click(function () {
    $(".bg").addClass("hidden")
})