ymaps.ready(init);

function init() {
  // Центрируем карту на Минске
  const map = new ymaps.Map('map', {
    center: [53.9023, 27.5619], // Координаты Минска
    zoom: 12
  });

  // Добавляем поиск
  const searchControl = new ymaps.control.SearchControl({
    options: {
      provider: 'yandex#search',
      noPlacemark: true
    }
  });
  map.controls.add(searchControl);

  // Метки
  const properties = [
    {
      id: 1,
      type: "flat",
      title: "3-комн. квартира",
      address: "Минск, ул. Ленина 15",
      price: "$120 000",
      area: "80 м²",
      coords: [53.9023, 27.5619] // Теперь в зоне видимости
    }
  ];

  properties.forEach(property => {
    const placemark = new ymaps.Placemark(property.coords, {
      hintContent: property.title,
      balloonContent: `
        <h4>${property.title}</h4>
        <p>${property.address}</p>
        <p>${property.area} · ${property.price}</p>
      `
    }, {
      iconColor: property.type === 'flat' ? '#4b8df8' : '#ff6b6b',
      preset: 'islands#dotIcon'
    });
    
    map.geoObjects.add(placemark);
  });

  // Автомасштабирование
  map.setBounds(map.geoObjects.getBounds(), {
    checkZoomRange: true
  });
}

function showPropertyDetails(id) {
    // Открытие детальной информации об объекте
    console.log(`Showing details for property ${id}`);
}