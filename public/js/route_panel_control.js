const form = document.querySelector('#mybestform');

function getUrlParams(search) {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params = {};
  hashes.map((hash) => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params;
}

ymaps.ready(() => {
  const coordinates = getUrlParams(window.location.search);
  console.log(coordinates.a);
  const myMap = new ymaps.Map('map', {
    center: [59.979351, 30.260321],
    zoom: 15,
    // Добавим панель маршрутизации.
    controls: ['routePanelControl'],
  });

  var control = myMap.controls.get('routePanelControl');

  // Зададим состояние панели для построения машрутов.
  if (coordinates.a !== undefined) {
    const a = coordinates.a.split(',');
    const b = coordinates.b.split(',');
    control.routePanel.state.set({
      // Тип маршрутизации.
      type: 'bicycle',
      // Выключим возможность задавать пункт отправления в поле ввода.
      fromEnabled: true,
      // Адрес или координаты пункта отправления.
      from: [+b[0], +b[1]],
      // Включим возможность задавать пункт назначения в поле ввода.
      toEnabled: true,
      // Адрес или координаты пункта назначения.
      to: [+a[0], +a[1]],
      // to: 'Петербург'
    });
  }
  control.routePanel.state.set({
    // Тип маршрутизации.
    type: 'bicycle',
    // Выключим возможность задавать пункт отправления в поле ввода.
    fromEnabled: true,
    // Адрес или координаты пункта отправления.
    // Включим возможность задавать пункт назначения в поле ввода.
    toEnabled: true,
    // Адрес или координаты пункта назначения.
    // to: 'Петербург'
  });

  // Зададим опции панели для построения машрутов.
  control.routePanel.options.set({
    // Запрещаем показ кнопки, позволяющей менять местами начальную и конечную точки маршрута.
    allowSwitch: false,
    // Включим определение адреса по координатам клика.
    // Адрес будет автоматически подставляться в поле ввода на панели, а также в подпись метки маршрута.
    reverseGeocoding: true,
    // Зададим виды маршрутизации, которые будут доступны пользователям для выбора.
    types: { bicycle: true, pedestrian: true },
  });

  // Создаем кнопку, с помощью которой пользователи смогут менять местами начальную и конечную точки маршрута.
  const switchPointsButton = new ymaps.control.Button({
    data: { content: 'Поменять местами', title: 'Поменять точки местами' },
    options: { selectOnClick: false, maxWidth: 160 },
  });
    // Объявляем обработчик для кнопки.
  switchPointsButton.events.add('click', () => {
    // Меняет местами начальную и конечную точки маршрута.
    control.routePanel.switchPoints();
  });

  myMap.controls.add(switchPointsButton);

  // Получение ссылки на панель.
  var control = myMap.controls.get('routePanelControl');

  // Получение мультимаршрута.
  const multiRoutePromise = control.routePanel.getRouteAsync();
  multiRoutePromise.then((multiRoute) => {
    // Подписка на событие обновления мультимаршрута.
    multiRoute.model.events.add('requestsuccess', () => {
      // Получение ссылки на активный маршрут.
      const activeRoute = multiRoute.getActiveRoute();
      // Когда панель добавляется на карту, она
      // создает маршрут с изначально пустой геометрией.
      // Только когда пользователь выберет начальную и конечную точки,
      // маршрут будет перестроен с непустой геометрией.
      // Поэтому для избежания ошибки нужно добавить проверку,
      // что маршрут не пустой.
      if (activeRoute) {
        // Вывод информации об активном маршруте.

        // Выводим в форму точку А:
        const r = activeRoute.properties.get('boundedBy');

        form.pointA.value = r[0];

        // Выводим в форму точку в:

        form.pointB.value = r[1];

        // Выводим в форму длину маршрута:
        form.lengthRoute.value = activeRoute.properties.get('distance').text;

        // Выводим в форму время:
        form.timeRoute.value = activeRoute.properties.get('duration').text;

        // логаем
        console.log(`Длина: ${activeRoute.properties.get('distance').text}`);
        console.log(`Время прохождения: ${activeRoute.properties.get('duration').text}`);
        console.log(activeRoute.properties.get('boundedBy'));
        // console.log(activeRoute.properties);
        // console.log(control)
      }
    });
  }, (err) => {
    console.log(err);
  });
});
