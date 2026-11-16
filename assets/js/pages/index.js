import { SearchDataAndCreateCards } from '../components/products-cards.js';
import { finalizeOrderWhatsApp } from '../components/cart.js';

SearchDataAndCreateCards();

const finalizeButton = document.getElementById("btn-finalizar-whatsapp");
if (finalizeButton) {
    finalizeButton.addEventListener("click", finalizeOrderWhatsApp);
}