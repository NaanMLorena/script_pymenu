let restaurantTelephone = "";

let cart = [];
let deliveryFee = 0;
let deliveryType = "entrega"

export function getTelephone(telephoneFromSheet) {
    restaurantTelephone = telephoneFromSheet;
}

export function setDeliveryFee(feeFromSheet) {
    deliveryFee = parseFloat(String(feeFromSheet || 0).replace(',', '.')) || 0;
    updateCartDisplay();
}

export function addToCart(product) {
    const existingItem = cart.find((item) => String(item.id) === String(product.id));
    
    let productPrice = product.preco_promocao
        ? product.preco_promocao
        : product.preco;


    if (existingItem) {
        existingItem.quantidade += 1;
    } else {
        cart.push({
            id: product.id,
            nome: product.nome,
            preco: parseFloat(String(productPrice).replace(',', '.')),
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
    const feeDisplay = document.getElementById("delivery-fee-display");

    if (!cartListContainer || !cartTotalElement) return;

    const currentFee = deliveryType === "entrega" ? deliveryFee : 0;
    if (feeDisplay) {
        feeDisplay.textContent = deliveryType === "entrega"
            ? `R$ ${currentFee.toFixed(2).replace('.', ',')}`
            : "Grátis (Retirada)";
    }

    if (cart.length === 0) {
        cartListContainer.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.<br>Escolha algo delicioso ao lado!</p>';
        cartTotalElement.textContent = `R$ ${currentFee.toFixed(2).replace('.', ',')}`;
        if (mobileBar) mobileBar.classList.remove("has-items");

        const sidebar = document.getElementById("cart-sidebar");
        if (sidebar) sidebar.classList.remove("open-mobile");
        return;
    }

    cartListContainer.innerHTML = "";
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach((item) => {
        let productPrice = item.preco_promocao
            ? item.preco_promocao
            : item.preco;

        const subtotal = productPrice * item.quantidade;
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

    const finalTotal = totalPrice + currentFee;
    const formattedTotal = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
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

document.addEventListener("click", (event) => {
    const btnDelivery = event.target.closest(".btn-delivery");
    if (btnDelivery) {
        document.querySelectorAll(".btn-delivery").forEach((btn) => btn.classList.remove("active"));
        btnDelivery.classList.add("active");

        deliveryType = String(btnDelivery.dataset.type || "entrega").toLowerCase().trim();

        const addressInput = document.getElementById("customer-address");
        if (addressInput) {
            addressInput.style.display = deliveryType === "entrega" ? "block" : "none";
        }

        updateCartDisplay();
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

    // Parênteses corrigidos na validação do endereço
    if (!name || (deliveryType === "entrega" && !adress) || !payment) {
        alert("Por favor, preencha os campos obrigatórios antes de finalizar.");
        return;
    }

    let message = "NOVO PEDIDO\n\n";
    message += `Tipo: ${deliveryType === "entrega" ? "Entrega" : "Retirada no Local"}\n`;
    message += `Nome: ${name}\n`;
    if (deliveryType === "entrega") {
        message += `Endereço: ${adress}\n`;
    }
    message += `Forma de Pagamento: ${payment}\n`;
    if (payment.toLowerCase() === "dinheiro" && change) {
        message += `Troco para: R$ ${change}\n`;
    }
    message += "\nItens do Pedido:\n";

    let totalPrice = 0;

    cart.forEach((item) => {
        let productPrice = item.preco_promocao
            ? item.preco_promocao
            : item.preco;

        const subtotal = productPrice * item.quantidade;
        totalPrice += subtotal;
        message += `${item.quantidade} x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });

    if (notes) {
        message += `\nObservações: ${notes}\n`;
    }

    const currentFee = deliveryType === "entrega" ? deliveryFee : 0;
    const finalTotal = totalPrice + currentFee;

    if (deliveryType === "entrega") {
        message += `\nTaxa de Entrega: R$ ${currentFee.toFixed(2).replace('.', ',')}`;
    }

    message += `\nTOTAL: R$ ${finalTotal.toFixed(2).replace('.', ',')}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${restaurantTelephone}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
}


