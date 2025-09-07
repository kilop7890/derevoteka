document.addEventListener('DOMContentLoaded', () => {
  // Загрузка каталога данных
  fetch('catalog.json')
    .then((response) => response.json())
    .then((data) => {
      // Сохраняем данные глобально для фильтрации
      window.products = data;
      populateFilters(data);
      displayProducts(data);
    })
    .catch((err) => {
      console.error('Ошибка загрузки каталога', err);
    });

  // Привязка кнопки фильтрации
  const applyBtn = document.getElementById('applyFilters');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const filtered = filterProducts(window.products);
      displayProducts(filtered);
    });
  }
});

// Заполняет выпадающие списки уникальными значениями
function populateFilters(data) {
  const speciesSet = new Set();
  const typeSet = new Set();
  data.forEach((item) => {
    speciesSet.add(item.species);
    typeSet.add(item.type);
  });
  const speciesFilter = document.getElementById('speciesFilter');
  speciesSet.forEach((species) => {
    const option = document.createElement('option');
    option.value = species;
    option.textContent = species;
    speciesFilter.appendChild(option);
  });
  const typeFilter = document.getElementById('typeFilter');
  typeSet.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

// Фильтрует список товаров по выбранным критериям
function filterProducts(data) {
  const species = document.getElementById('speciesFilter').value;
  const type = document.getElementById('typeFilter').value;
  const minLen = parseFloat(
    document.getElementById('minLengthFilter').value
  );
  const maxLen = parseFloat(
    document.getElementById('maxLengthFilter').value
  );
  return data.filter((item) => {
    let match = true;
    if (species && item.species !== species) match = false;
    if (type && item.type !== type) match = false;
    if (!isNaN(minLen) && item.length < minLen) match = false;
    if (!isNaN(maxLen) && item.length > maxLen) match = false;
    return match;
  });
}

// Отображает карточки товаров
function displayProducts(data) {
  const container = document.getElementById('productList');
  if (!container) return;
  container.innerHTML = '';
  if (!data || data.length === 0) {
    container.textContent = 'Нет подходящих товаров.';
    return;
  }
  data.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p><strong>Порода:</strong> ${item.species}</p>
      <p><strong>Тип:</strong> ${item.type}</p>
      <p><strong>Длина:</strong> ${item.length} см, <strong>Ширина:</strong> ${item.width} см, <strong>Толщина:</strong> ${item.thickness} см</p>
      <p><strong>Цена:</strong> ${item.price} ₽</p>
      <a href="product.html?id=${item.id}">Подробнее</a>
    `;
    container.appendChild(card);
  });
}