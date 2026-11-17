import { setupCategories } from './category-buttons.js';
import { getTelephone, setDeliveryFee, addToCart } from './cart.js';
import { updateStoreStatus } from './store-status.js';

const urlDoScript = "https://script.google.com/macros/s/AKfycby2Sx3u4vCPEx8yTlnBmvIVnxN5l8AOFwoK7M1mwJV80qUUC10ic3q5h9D_XHUEm98Z/exec";
const container = document.getElementById("products-list");

export let allItems = [];

export async function SearchDataAndCreateCards() {
    const loadingScreen = document.getElementById("loading-screen");

    try {
        const response = await fetch(urlDoScript);
        const data = await response.json();

        allItems = data.produtos;

        getTelephone(data.telefone);
        setDeliveryFee(data.taxaEntrega);
        updateStoreStatus(data.status);
        setupCategories(allItems);
        CreateCards(allItems);

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        container.innerHTML = "<p>Erro ao carregar os cards. Verifique o console (F12).</p>";
    } finally {
        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }
    }
}

export function CreateCards(itemsList) {
    container.innerHTML = "";

    itemsList.forEach((item) => {
        if (String(item.disponivel).toLowerCase() === "sim") {
            const urlImagem = item.imagem ? item.imagem : "https://thumbs.dreamstime.com/b/nenhuma-imagem-da-unha-do-polegar-placeholder-para-f%C3%B3runs-blogues-e-web-site-148010362.jpg";

            // NOVO: Cria a etiqueta HTML apenas se a coluna 'destaque' estiver preenchida
            const badgeHTML = item.destaque 
                ? `<span class="card-badge">${item.destaque}🔥</span>` 
                : "";

            const cardHTML = `
            <div class="card">
                <div class="card-img-wrapper">
                    ${badgeHTML}
                    <img class="card-img" src="${urlImagem}" alt="${item.nome}">
                </div>
                <div class="card-conteudo">
                    <div class="card-header">
                        <h3 class="card-title">${item.nome}</h3>
                        <p class="preco">R$ ${item.preco}</p>
                    </div>
                    <p class="descricao">${item.descricao}</p>
                </div>
                <div class="card-footer">
                    <div class="card-info"></div>
                    <button class="card-button" data-id="${item.id}">+ Adicionar</button>
                </div>
            </div>
            `;

            container.innerHTML += cardHTML;
        }
    });
}

container.addEventListener("click", (event) => {
    if (event.target.classList.contains("card-button")) {
        const clickedId = event.target.dataset.id;
        const foundedItem = allItems.find((item) => String(item.id) === String(clickedId));

        if (foundedItem) {
            addToCart(foundedItem);
        }
    }
});