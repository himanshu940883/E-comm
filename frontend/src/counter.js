import { renderProducts } from './ui.js';

let currentPage = 1;
const itemsPerPage = 20;
let allProducts = [];
let totalPages = 1;

export function setupPagination(products) {
  allProducts = products;
  totalPages = Math.ceil(allProducts.length / itemsPerPage);
  currentPage = 1;
  renderCurrentPage();
  renderPaginationControls();
}

function renderCurrentPage() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = allProducts.slice(start, end);
  renderProducts(pageItems, setupPagination); 
}

function renderPaginationControls() {
  const paginationControls = document.getElementById('paginationControls');
  paginationControls.innerHTML = '';

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'pagination__btn';
    if (i === currentPage) btn.classList.add('active');

    btn.addEventListener('click', () => {
      currentPage = i;
      renderCurrentPage();
      renderPaginationControls();
    });

    paginationControls.appendChild(btn);
  }
}
