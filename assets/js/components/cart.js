let restaurantTelephone = "";

export function getTelephone(telephone) {
    restaurantTelephone = telephone;
}

let cart = [];

export function addToCart(product) {
    const existingItem = cart.find((item) => String(item.id) === String(product.id));

    if (existingItem) {
        existingItem.quantidade += 1;
    } else {
        cart.push({
            id: product.id,
            nome: product.nome,
            preco: parseFloat(String(product.preco).replace(',', '.')),
            imagem: product.imagem ? product.imagem : "https://thumbs.dreamstime.com/b/nenhuma-imagem-da-unha-do-polegar-placeholder-para-f%C3%B3runs-blogues-e-web-site-148010362.jpg",
            quantidade: 1
        });
    }

    updateCartDisplay();
}

function changeQuantity(productId, delta) {
    const itemIndex = cart.findIndex((item) => String(item.id) === String(productId));
    if (itemIndex === -1) return;

    cart[itemIndex].quantidade += delta;
    if (cart[itemIndex].quantidade <= 0) {
        cart.splice(itemIndex, 1);
    }

    updateCartDisplay();
}

export function updateCartDisplay() {
    const cartListContainer = document.getElementById("cart-items-list");
    const cartTotalElement = document.getElementById("cart-total-price");
    const mobileBar = document.getElementById("mobile-cart-bar");
    const mobileSummary = document.getElementById("mobile-cart-summary");

    if (!cartListContainer || !cartTotalElement) return;

    if (cart.length === 0) {
        cartListContainer.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.<br>Escolha algo delicioso ao lado!</p>';
        cartTotalElement.textContent = "R$ 0,00";
        if (mobileBar) mobileBar.classList.remove("has-items");

        const sidebar = document.getElementById("cart-sidebar");
        if (sedebar) sidebar.classList.remove("open-mobile");
        return;
    }

    cartListContainer.innerHTML = "";
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach((item) => {
        const subtotal = item.preco * item.quantidade;
        totalPrice += subtotal;
        totalItems += item.quantidade;

        const itemHTML = `
            <div class="cart-item">
                <img class="cart-item-img" src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.nome}</h4>
                    <span class="cart-item-price">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-qty minus" data-id="${item.id}">-</button>
                    <span>${item.quantidade}</span>
                    <button class="btn-qty plus" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        cartListContainer.innerHTML += itemHTML;
    });

    const formattedTotal = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    cartTotalElement.textContent = formattedTotal;

    if (mobileBar && mobileSummary) {
        mobileSummary.textContent = `${totalItems} item(ns) • ${formattedTotal}`;
        mobileBar.classList.add("has-items");
    }
}

const cartListElement = document.getElementById("cart-items-list");
if (cartListElement) {
    cartListElement.addEventListener("click", (event) => {
        const productId = event.target.dataset.id;
        if (!productId) return;

        if (event.target.classList.contains("plus")) {
            changeQuantity(productId, 1);
        } else if (event.target.classList.contains("minus")) {
            changeQuantity(productId, -1);
        }
    });
}

document.addEventListener("click", (event) => {
    const cartSidebar = document.getElementById("cart-sidebar");
    if (!cartSidebar) return;

    if (event.target.id === "btn-open-cart" || event.target.closest("#btn-open-cart")) {
        cartSidebar.classList.add("open-mobile");
    }

    if (event.target.id === "btn-close-cart" || event.target.closest("#btn-close-cart")) {
        cartSidebar.classList.remove("open-mobile");
    }
});

document.addEventListener("change", (event) => {
    if (event.target.id === "payment-method") {
        const changeInput = document.getElementById("change-for");
        if (changeInput) {
            changeInput.style.display = event.target.value.toLowerCase() === "dinheiro" ? "block" : "none";
        }
    }
});

export function finalizeOrderWhatsApp() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.");
        return;
    }

    const name = document.getElementById("customer-name")?.value.trim();
    const adress = document.getElementById("customer-address")?.value.trim();
    const payment = document.getElementById("payment-method")?.value;
    const change = document.getElementById("change-for")?.value.trim();
    const notes = document.getElementById("order-notes")?.value.trim();

    if (!name || !adress || !payment) {
        alert("Por favor, preenche seu Nome, Endereço e a Forma de Pagamento.");
        return;
    }

    let message = "NOVO PEDIDO\n\n";
    message += `Nome: ${name}\n`;
    message += `Endereço: ${adress}\n`;
    message += `Forma de Pagamento: ${payment}\n`;
    if (payment.toLowerCase() === "dinheiro" && change) {
        message += `Troco para: R$ ${change}\n`;
    }
    message += "\nItens do Pedido:\n";

    let totalPrice = 0;

    cart.forEach((item) => {
        const subtotal = item.preco * item.quantidade;
        totalPrice += subtotal;
        message += `${item.quantidade} x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });

    if (notes) {
        message += `\nObservações: ${notes}\n`;
    }

    message += `\nTOTAL: R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${restaurantTelephone}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
}
