export function updateStoreStatus(statusFromSheet) {
    const statusBadge = document.getElementById('store-status');
    if (!statusBadge) return;

    const status = String(statusFromSheet || automatico).trim().toLowerCase();
    let isOpen = false;

    if (status === 'aberto') {
        isOpen = true;
    } else if (status === 'fechado') {
        isOpen = false;
    } else {
        isOpen = checkOpeningHours();
    }

    if (isOpen) {
        statusBadge.textContent = '● Aberto no momento';
        statusBadge.classList.remove('closed');
        statusBadge.classList.add('open');
    } else {
        statusBadge.textContent = '● Fechado no momento';
        statusBadge.classList.remove('open');
        statusBadge.classList.add('closed');
    }
}

function checkOpeningHours() {
    const now = new Date();
    const weekDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const hour = now.getHours();
    const minutes = now.getMinutes();

    const currentMinutes = hour * 60 + minutes;

    if (weekDay === 0 || weekDay === 6) return false; // Closed on weekends

    const openingHours = (18 * 60) + 0; // 18:00 in minutes
    const closingHours = (23 * 60) + 30; // 23:30 in minutes

    return currentMinutes >= openingHours && currentMinutes <= closingHours;
}