ymaps.ready(init);

function init() {
  // 1. Инициализация карты
  const map = new ymaps.Map('map', {
    center: [53.9023, 27.5619], // Координаты Минска
    zoom: 12,
    controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
  });

  // 2. Настройка SuggestView (использует ключ API Геосаджеста)
  const suggestView = new ymaps.SuggestView('search', {
    provider: {
      suggest: (request, options) => {
        return ymaps.suggest(request, {
          apiKey: '1f17e8fd-8f09-45b1-85cf-a63c9184b9b4', // Вставьте сюда ключ из кабинета Yandex (раздел "API Геосаджеста")
          results: 5,
          boundedBy: map.getBounds(), // Ограничиваем подсказки видимой областью
          strictBounds: true
        });
      }
    },
    offset: [0, 5],
    container: document.body
  });

  // 3. Обработчик выбора подсказки (использует HTTP Геокодер)
  suggestView.events.add('select', function (e) {
    const selectedAddress = e.get('item').value;
    document.getElementById('search').value = selectedAddress;
    
    // Используем HTTP Геокодер для точного поиска
    ymaps.geocode(selectedAddress, {
      apiKey: 'e2f5e483-c251-4585-83b0-6c43d9f3dcfa', // Вставьте сюда ключ из кабинета Yandex (раздел "HTTP Геокодер")
      results: 1
    }).then(function (res) {
      const firstResult = res.geoObjects.get(0);
      if (firstResult) {
        map.setCenter(firstResult.geometry.getCoordinates());
        // Добавляем метку для найденного адреса
        new ymaps.Placemark(firstResult.geometry.getCoordinates(), {
          hintContent: selectedAddress
        }).addTo(map);
      }
    });
  });

  
  // 4. Остальной код (метки, кластеризатор и фильтры) остается без изменений
  const properties = [
    {
      id: 1,
      type: "flat",
      title: "3-комн. квартира",
      address: "Минск, ул. Ленина 15",
      price: "$120 000",
      area: "80 м²",
      rooms: 3,
      coords: [53.9023, 27.5619],
      photos: []
    }
    // ... остальные объекты
  ];

  const clusterer = new ymaps.Clusterer({
    preset: 'islands#invertedBlueClusterIcons',
    clusterDisableClickZoom: true
  });

  const placemarks = properties.map(property => {
    return new ymaps.Placemark(property.coords, {
      hintContent: property.title,
      balloonContent: `
        <strong>${property.title}</strong>
        <p>Адрес: ${property.address}</p>
        <p>Цена: ${property.price}</p>
        <button onclick="showPropertyDetails(${property.id})">Подробнее</button>
      `
    }, {
      preset: 'islands#blueHomeIcon'
    });
  });

  clusterer.add(placemarks);
  map.geoObjects.add(clusterer);

  // Обработчики фильтров и другие функции остаются без изменений
  // ...
}

function showPropertyDetails(id) {
  console.log(`Просмотр объекта ID: ${id}`);
  alert(`Детали объекта #${id} будут здесь!`);
}

