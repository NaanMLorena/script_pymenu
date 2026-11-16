import { allItems, CreateCards } from './products-cards.js';

export function setupCategories(itemsList) {
    const filtersContainer = document.getElementById("category-filters");
    if (!filtersContainer) return;

    const avaibleItems = itemsList.filter(
        (item) => String(item.disponivel).toLowerCase() === "sim"
    );

    const uniqueCategories = [...new Set(avaibleItems.map((item) => item.categoria))];

    filtersContainer.innerHTML = `
        <button class="btn-filter active" data-category="todos">Todos</button>
    `;

    uniqueCategories.forEach((category) => {
        if (category) {
            filtersContainer.innerHTML += `
                <button class="btn-filter" data-category="${category}">${category}</button>
            `;
        }
    });

    const buttonsFilter = document.querySelectorAll('.btn-filter');

    buttonsFilter.forEach((button) => {
        button.addEventListener('click', () => {
            buttonsFilter.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.dataset.category;

            if (selectedCategory.toLowerCase() === "todos") {
                CreateCards(allItems);
            } else {
                const filteredItems = allItems.filter(
                    (item) => item.categoria.toLowerCase() === selectedCategory.toLowerCase()
                );
                CreateCards(filteredItems);
            }
        });
    });
}