// Лёгкая система интернационализации (ru/en).
// Сохраняет язык в localStorage.
// Элементы с атрибутом data-i18n="ключ" обновляются автоматически.

window.NegroniI18n = (function () {
  'use strict';

  var STORAGE_KEY = 'negroni-lang';
  var DEFAULT_LANG = 'ru';

  var strings = {
    ru: {
      // Навигация
      'nav.about': 'О проекте',
      'nav.collection': 'Коллекция',
      'nav.map': 'Карта',
      'nav.history': 'История',
      'nav.partners': 'Партнёры',
      'nav.favorites': 'Избранное',
      // Лого
      'logo': 'Музей Негрони',
      // Главная — hero cover
      'hero.label': 'Онлайн-коллекция',
      'hero.title': 'Негрони',
      'hero.subtitle': 'Музей Негрони',
      'hero.desc': 'Классические рецепты и современные твисты по всей России',
      'hero.cta': 'Открыть карту рецептов',
      'hero.secondary': 'Смотреть полную коллекцию',
      // Главная — article
      'hero.meta': 'онлайн-коллекция, коктейли | Негрони • 2025',
      'hero.articleTitle': 'Музей Негрони — 100+ вариаций по всей России',
      'hero.articleSubtitle': 'The Negroni Museum — Bitter, Sweet, Timeless',
      'hero.articleP1': 'Музей Негрони родился как большой офлайн-стенд на барном фестивале, где команда собрала более ста версий легендарного коктейля со всей России. Теперь вся коллекция переезжает в онлайн, чтобы жить дольше одного события.',
      'hero.articleP2': 'На интерактивной карте вы найдёте вариации Негрони из Москвы, Санкт-Петербурга, Сибири, Юга, Урала, Дальнего Востока и не только. Каждый рецепт привязан к городу и отражает локальные продукты, сезон и характер региона.',
      'hero.articleP3': 'Выберите точку на карте или откройте полную коллекцию, чтобы вдохновиться новыми подачами, твистами и сервисами для барной карты или домашнего бара.',
      'hero.articleFooter': 'Музей Негрони • 100+ напитков • Проект команды BAR BOSS ONLINE, основатель — Виталий Аршук',
      // Главная — секция история
      'index.historyLabel': 'История',
      'index.historyTitle': 'Негрони',
      'index.historyBody': 'История коктейля началась в 1919 году, когда граф Камилло Негрони зашёл в свой любимый бар во Флоренции и попросил усилить американский коктейль «Americano» джином — так родился эталон горького, сладкого и сухого вкуса.',
      'index.historyLink': 'Полная история Негрони →',
      // Главная — мини-коллекция
      'index.collectionTitle': 'Коллекция',
      // Главная — about
      'about.title': 'О музее и команде',
      'about.p1': 'Музей Негрони начался с офлайн-стенда на профессиональном барном событии, где команда собрала более 100 рецептов Негрони из баров и команд по всей стране. Каждый участник привозил свою интерпретацию классики — с локальными биттерами, ягодами, медом, травами и сезонными ингредиентами.',
      'about.p2': 'Этот сайт — цифровое продолжение стенда. Здесь рецепты живут дольше одного фестиваля, становятся доступными барменам и гостям баров в любом городе и помогают находить новые идеи для коктейльных карт и домашних экспериментов.',
      'about.p3': 'Проект создан командой <strong>BAR BOSS ONLINE</strong> под руководством основателя <strong>Виталия Аршука</strong>. Мы развиваем Музей Негрони как открытый музей вкусов: собираем новые вариации, аккуратно оформляем рецепты и в будущем будем дополнять коллекцию партнёрскими проектами и образовательными материалами.',
      'about.partnerLink': 'Стать партнёром музея →',
      // Коллекция
      'collection.title': 'Коллекция Негрони',
      'collection.desc': 'Все рецепты музея, собранные по регионам России и миру. 100+ вариаций — одна формула.',
      'collection.search': 'Поиск по названию...',
      'collection.allRegions': 'Все регионы',
      'collection.allTags': 'Все теги',
      'collection.empty': 'По вашему запросу рецептов не найдено.',
      'collection.ingredients': 'Поиск по ингредиентам...',
      'collection.flavor': 'Фильтр по вкусу',
      'collection.recipesCount': 'рецептов',
      'collection.citiesCount': 'городов',
      'collection.found': 'Найдено',
      // Вкусы
      'flavor.bitter': 'Горечь',
      'flavor.sweet': 'Сладость',
      'flavor.sour': 'Кислотность',
      'flavor.spicy': 'Пряность',
      'flavor.strong': 'Крепость',
      'flavor.bitterShort': 'Гор.',
      'flavor.sweetShort': 'Слад.',
      'flavor.sourShort': 'Кисл.',
      'flavor.spicyShort': 'Прян.',
      'flavor.strongShort': 'Креп.',
      'flavor.profile': 'Вкусовой профиль',
      'flavor.caption': 'Горечь, сладость, кислотность, пряность, крепость — шкала 0–10',
      // Рецепт
      'recipe.ingredients': 'Рецепт',
      'recipe.steps': 'Приготовление',
      'recipe.prebatch': 'Рецепт заготовок',
      'recipe.flavor': 'Вкусовой профиль',
      'recipe.related': 'Похожие рецепты',
      'recipe.relatedSubtitle': 'Другие вариации Негрони из этого региона и коллекции музея.',
      'recipe.share': 'Поделиться рецептом',
      'recipe.copyLink': 'Скопировать ссылку',
      'recipe.linkCopied': 'Ссылка скопирована в буфер обмена.',
      'recipe.linkCopyFailed': 'Не удалось скопировать ссылку. Попробуйте вручную.',
      'recipe.export': 'Экспорт / Печать',
      'recipe.addFavorite': 'В избранное',
      'recipe.inFavorites': 'В избранном',
      'recipe.removeFavorite': 'Убрать из избранного',
      'recipe.author': 'Автор',
      'recipe.bar': 'Бар',
      'recipe.notFound': 'Рецепт не найден',
      'recipe.backToCollection': 'Вернуться к коллекции',
      'recipe.noPrebatch': 'Для этого рецепта не требуется отдельная заготовка.',
      'recipe.prebatchDefault': 'Заготовка',
      'recipe.prebatchIngredients': 'Ингредиенты заготовки',
      'recipe.prebatchSteps': 'Шаги подготовки',
      'recipe.showOnMap': 'Показать этот рецепт на карте',
      // Избранное
      'favorites.title': 'Моя барная карта',
      'favorites.subtitle': 'Рецепты, которые вы сохранили для быстрого доступа.',
      'favorites.empty': 'Вы ещё не добавили ни одного рецепта в избранное.',
      'favorites.clear': 'Очистить всё',
      'favorites.export': 'Экспортировать список',
      'favorites.goToCollection': 'Перейти к коллекции →',
      'favorites.removeConfirm': 'Удалить все рецепты из избранного?',
      'favorites.remove': 'Удалить из избранного',
      'favorites.exportHeader': 'МОЯ БАРНАЯ КАРТА — Музей Негрони',
      'favorites.exportIngredients': 'Ингредиенты',
      'favorites.exportFooter': '— Музей Негрони • museynegroni.ru',
      // История
      'history.title': 'История Негрони',
      'history.desc': 'От флорентийского бара до более чем 100 вариаций по всей России — путешествие длиной больше века.',
      'history.1860.title': 'Рождение Americano',
      'history.1860.desc': 'В барах Милана появляется коктейль Americano — Кампари с красным вермутом и содовой. Он становится основой для будущего Негрони.',
      'history.1919.title': 'Граф Камилло Негрони',
      'history.1919.desc': 'Во Флоренции граф Камилло Негрони просит бармена Фоско Скарселли заменить содовую в Americano на джин. Так рождается коктейль, названный в его честь.',
      'history.1919.link': 'Классический рецепт →',
      'history.1920.title': 'Распространение по Италии',
      'history.1920.desc': 'Рецепт Негрони передаётся из бара в бар. Коктейль становится символом итальянского аперитива и европейской культуры пития.',
      'history.1947.title': 'Негрони Сбальято',
      'history.1947.desc': 'В Милане бармен случайно заменяет джин на просекко — так появляется «ошибочный» Негрони (Sbagliato), ставший самостоятельной классикой.',
      'history.2000.title': 'Мировой ренессанс',
      'history.2000.desc': 'Волна крафтовых баров возвращает интерес к классическим коктейлям. Негрони становится одним из самых заказываемых коктейлей в мире.',
      'history.2013.title': 'Negroni Week',
      'history.2013.desc': 'Imbibe Magazine и Campari запускают Negroni Week — ежегодную международную неделю Негрони, объединяющую бары по всему миру для благотворительности.',
      'history.2024.title': 'Музей Негрони — офлайн-стенд',
      'history.2024.desc': 'Команда BAR BOSS ONLINE собирает более 100 вариаций Негрони из баров по всей России на профессиональном барном фестивале. Каждый рецепт — интерпретация классики с локальными ингредиентами.',
      'history.2025.title': 'Музей уходит в онлайн',
      'history.2025.desc': 'Коллекция переезжает в цифровой формат: интерактивная карта, детальные рецепты, вкусовые профили. Музей Негрони становится живым справочником для барменов и энтузиастов.',
      'history.2025.link': 'Смотреть коллекцию →',
      'history.quote': '«Негрони — это не просто коктейль. Это формула: горечь, сладость и сухость в идеальном равновесии. Больше века — и ни одного лишнего ингредиента.»',
      'history.quoteAuthor': '— Дух Музея Негрони',
      // Партнёры
      'partners.title': 'Стать партнёром',
      'partners.heroLabel': 'Партнёрская программа',
      'partners.heroTitle': 'Станьте частью <span>Музея Негрони</span>',
      'partners.heroDesc': 'Музей Негрони — растущая онлайн-платформа с аудиторией барменов, владельцев баров и коктейльных энтузиастов по всей России. Мы предлагаем партнёрам прямой доступ к целевой аудитории через брендированный контент, рецепты и события.',
      'partners.statRecipes': 'рецептов',
      'partners.statCities': 'городов',
      'partners.statRegions': 'регионов',
      'partners.statVisitors': 'посетителей / мес.',
      'partners.whyTitle': 'Почему Музей Негрони',
      'partners.whySubtitle': 'Мы создали уникальную платформу на стыке барной культуры, образования и digital-контента. Вот что мы предлагаем партнёрам:',
      'partners.benefit1.title': 'Целевая аудитория',
      'partners.benefit1.desc': 'Наши посетители — профессиональные бармены, бар-менеджеры, владельцы заведений и увлечённые домашние миксологи. Это люди, принимающие решения о закупках.',
      'partners.benefit2.title': 'Интеграция в контент',
      'partners.benefit2.desc': 'Ваш бренд становится частью рецепта: ингредиент, рекомендация, история. Не баннер, а органичный контент, который читают и сохраняют.',
      'partners.benefit3.title': 'География России',
      'partners.benefit3.desc': 'Рецепты привязаны к городам от Калининграда до Владивостока. Партнёрство позволяет адресно работать с конкретными регионами или покрывать всю страну.',
      'partners.benefit4.title': 'Аналитика и отчётность',
      'partners.benefit4.desc': 'Прозрачные метрики: просмотры рецептов, клики, сохранения в избранное, география пользователей. Вы видите реальный эффект интеграции.',
      'partners.benefit5.title': 'Образовательный формат',
      'partners.benefit5.desc': 'Каждый рецепт — это мини-мастер-класс с техникой, заготовками, вкусовым профилем. Идеальная площадка для брендов, которые хотят обучать рынок.',
      'partners.benefit6.title': 'Эксклюзивные события',
      'partners.benefit6.desc': 'Совместные офлайн-дегустации на барных фестивалях, коллаборации с барменами, конкурсы рецептов — всё это с упоминанием и участием партнёра.',
      'partners.tiersTitle': 'Форматы партнёрства',
      'partners.tiersSubtitle': 'Три уровня интеграции — от присутствия на платформе до полноценного брендированного контента и событий.',
      'partners.tierPopular': 'Популярный',
      'partners.tier1.name': 'Дегустация',
      'partners.tier1.price': 'Базовое размещение',
      'partners.tier1.desc': 'Идеально для брендов, которые хотят познакомить аудиторию с продуктом и получить первые интеграции.',
      'partners.tier1.f1': 'Логотип на странице партнёров',
      'partners.tier1.f2': 'Упоминание в 1–2 рецептах как рекомендованный ингредиент',
      'partners.tier1.f3': 'Ссылка на сайт партнёра',
      'partners.tier1.f4': 'Квартальный отчёт по просмотрам',
      'partners.tier2.name': 'Коллекция',
      'partners.tier2.price': 'Контентная интеграция',
      'partners.tier2.desc': 'Ваш бренд становится рекомендуемым ингредиентом и со-автором рецептов. Максимальное присутствие в контенте.',
      'partners.tier2.f1': 'Всё из тарифа «Дегустация»',
      'partners.tier2.f2': 'Брендированный рецепт с вашим продуктом (создаём совместно)',
      'partners.tier2.f3': 'Логотип на главной странице',
      'partners.tier2.f4': 'Приоритетное размещение в коллекции',
      'partners.tier2.f5': 'Интеграция в карту (отдельная точка)',
      'partners.tier2.f6': 'Публикация в соцсетях проекта',
      'partners.tier2.f7': 'Ежемесячная аналитика',
      'partners.tier3.name': 'Меценат',
      'partners.tier3.price': 'Стратегическое партнёрство',
      'partners.tier3.desc': 'Полноценное партнёрство с со-брендингом, эксклюзивными событиями и приоритетным доступом к аудитории.',
      'partners.tier3.f1': 'Всё из тарифа «Коллекция»',
      'partners.tier3.f2': 'Серия из 3–5 брендированных рецептов',
      'partners.tier3.f3': 'Выделенный раздел на сайте «Рецепты от [Партнёр]»',
      'partners.tier3.f4': 'Со-организация офлайн-дегустации на фестивале',
      'partners.tier3.f5': 'Конкурс рецептов среди барменов с призами от партнёра',
      'partners.tier3.f6': 'Интеграция в образовательные материалы',
      'partners.tier3.f7': 'Еженедельная аналитика + доступ к дашборду',
      'partners.tier3.f8': 'Упоминание как генеральный партнёр',
      'partners.discuss': 'Обсудить',
      'partners.choose': 'Выбрать',
      'partners.audienceTitle': 'Наша аудитория',
      'partners.audienceSubtitle': 'Кто посещает Музей Негрони и почему это важно для вашего бренда.',
      'partners.aud1': 'Профессиональные бармены',
      'partners.aud2': 'Владельцы баров и ресторанов',
      'partners.aud3': 'Домашние миксологи',
      'partners.aud4': 'Бренд-амбассадоры и дистрибьюторы',
      'partners.processTitle': 'Как стать партнёром',
      'partners.processSubtitle': 'Простой процесс в четыре шага — от заявки до запуска интеграции.',
      'partners.step1.title': 'Заполните заявку',
      'partners.step1.desc': 'Расскажите о бренде, продукте и целях. Мы свяжемся с вами в течение 2 рабочих дней.',
      'partners.step2.title': 'Обсуждаем формат',
      'partners.step2.desc': 'Подбираем тариф и формат интеграции под ваши цели: контент, событие, конкурс или комбинированный пакет.',
      'partners.step3.title': 'Создаём контент',
      'partners.step3.desc': 'Наша команда совместно с вами разрабатывает рецепты, тексты и визуал. Согласуем каждый шаг.',
      'partners.step4.title': 'Запуск и аналитика',
      'partners.step4.desc': 'Публикуем интеграцию, отслеживаем метрики и предоставляем прозрачную отчётность по результатам.',
      'partners.formTitle': 'Оставить заявку',
      'partners.formSubtitle': 'Заполните форму — мы свяжемся с вами, чтобы обсудить детали партнёрства.',
      'partners.formName': 'Имя *',
      'partners.formCompany': 'Компания / Бренд *',
      'partners.formEmail': 'Email *',
      'partners.formPhone': 'Телефон',
      'partners.formTier': 'Интересующий формат',
      'partners.formTierDefault': 'Выберите формат',
      'partners.formTierTasting': 'Дегустация (базовое)',
      'partners.formTierCollection': 'Коллекция (контентная интеграция)',
      'partners.formTierPatron': 'Меценат (стратегическое)',
      'partners.formTierCustom': 'Индивидуальный формат',
      'partners.formMessage': 'Сообщение',
      'partners.formSubmit': 'Отправить заявку',
      'partners.faqTitle': 'Частые вопросы',
      'partners.faq1.q': 'Сколько стоит партнёрство?',
      'partners.faq1.a': 'Стоимость зависит от формата и объёма интеграции. Мы обсуждаем условия индивидуально. Базовый формат «Дегустация» доступен для большинства брендов.',
      'partners.faq2.q': 'Какие бренды подходят?',
      'partners.faq2.a': 'Производители спиртных напитков (джин, вермут, биттеры, ликёры), барное оборудование, сиропы, стаканы, посуда, образовательные проекты в сфере HoReCa, а также любые бренды, связанные с барной культурой.',
      'partners.faq3.q': 'Как быстро появится интеграция?',
      'partners.faq3.a': 'Обычно от заявки до публикации проходит 2–4 недели. Всё зависит от формата: простое размещение логотипа — 3–5 дней, создание брендированного рецепта — 2–3 недели.',
      'partners.faq4.q': 'Можно ли разместить свой рецепт?',
      'partners.faq4.a': 'Да! Мы приветствуем рецепты от партнёров. Наша команда поможет адаптировать рецепт под формат музея: добавит вкусовой профиль, технологическую карту и привяжет к городу на карте.',
      'partners.faq5.q': 'Какие метрики вы предоставляете?',
      'partners.faq5.a': 'Просмотры страницы рецепта, клики на ссылку партнёра, добавления в избранное, география посетителей, время на странице. Для тарифа «Меценат» — доступ к live-дашборду.',
      'partners.faq6.q': 'Есть ли офлайн-форматы?',
      'partners.faq6.a': 'Да. Музей Негрони участвует в барных фестивалях. В рамках тарифов «Коллекция» и «Меценат» мы организуем совместные дегустационные стенды, конкурсы и мастер-классы с участием партнёра.',
      'partners.ctaTitle': 'Готовы обсудить?',
      'partners.ctaDesc': 'Напишите нам — мы подберём формат, который принесёт результат вашему бренду и обогатит коллекцию Музея Негрони.',
      'partners.ctaBtn': 'Оставить заявку',
      'partners.errName': 'Пожалуйста, укажите ваше имя.',
      'partners.errCompany': 'Пожалуйста, укажите название компании или бренда.',
      'partners.errEmail': 'Пожалуйста, укажите корректный email.',
      'partners.formSending': 'Отправляем...',
      'partners.formSuccess': 'Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 2 рабочих дней.',
      // Карта
      'map.title': 'Рецепты Негрони по регионам России',
      'map.desc': 'Выберите город или точку на карте — откроются вариации коктейля из этой локации.',
      'map.cities': 'Города',
      'map.openRecipe': 'Открыть рецепт',
      // Общие
      'footer.rights': '© 2025 Музей Негрони. Все права защищены.',
      'theme.light': 'Светлая тема',
      'theme.dark': 'Тёмная тема',
      'lang.switch': 'EN'
    },
    en: {
      // Навигация
      'nav.about': 'About',
      'nav.collection': 'Collection',
      'nav.map': 'Map',
      'nav.history': 'History',
      'nav.partners': 'Partners',
      'nav.favorites': 'Favorites',
      // Лого
      'logo': 'Negroni Museum',
      // Главная — hero cover
      'hero.label': 'Online collection',
      'hero.title': 'Negroni',
      'hero.subtitle': 'The Negroni Museum',
      'hero.desc': 'Classic recipes and modern twists from all over Russia',
      'hero.cta': 'Open recipes map',
      'hero.secondary': 'Browse full collection',
      // Главная — article
      'hero.meta': 'online collection, cocktails | Negroni • 2025',
      'hero.articleTitle': 'The Negroni Museum — 100+ variations across Russia',
      'hero.articleSubtitle': 'The Negroni Museum — Bitter, Sweet, Timeless',
      'hero.articleP1': 'The Negroni Museum was born as a large offline stand at a bar festival, where the team collected over a hundred versions of the legendary cocktail from all over Russia. Now the entire collection is moving online to live beyond a single event.',
      'hero.articleP2': 'On the interactive map you will find Negroni variations from Moscow, Saint Petersburg, Siberia, the South, the Urals, the Far East and beyond. Each recipe is tied to a city and reflects local products, season and regional character.',
      'hero.articleP3': 'Choose a point on the map or open the full collection to get inspired by new presentations, twists and services for your bar menu or home bar.',
      'hero.articleFooter': 'The Negroni Museum • 100+ drinks • A project by BAR BOSS ONLINE, founded by Vitaly Arshuk',
      // Главная — секция история
      'index.historyLabel': 'History',
      'index.historyTitle': 'Negroni',
      'index.historyBody': 'The history of the cocktail began in 1919, when Count Camillo Negroni walked into his favorite bar in Florence and asked to strengthen the American cocktail "Americano" with gin — thus creating the benchmark of bitter, sweet and dry taste.',
      'index.historyLink': 'Full history of Negroni →',
      // Главная — мини-коллекция
      'index.collectionTitle': 'Collection',
      // Главная — about
      'about.title': 'About the museum and team',
      'about.p1': 'The Negroni Museum started as an offline stand at a professional bar event, where the team collected over 100 Negroni recipes from bars and teams across the country. Each participant brought their own interpretation of the classic — with local bitters, berries, honey, herbs and seasonal ingredients.',
      'about.p2': 'This website is the digital continuation of the stand. Here, recipes live beyond a single festival, become accessible to bartenders and bar guests in any city, and help discover new ideas for cocktail menus and home experiments.',
      'about.p3': 'The project was created by the <strong>BAR BOSS ONLINE</strong> team under the leadership of founder <strong>Vitaly Arshuk</strong>. We develop the Negroni Museum as an open museum of flavors: collecting new variations, carefully curating recipes, and in the future supplementing the collection with partner projects and educational materials.',
      'about.partnerLink': 'Become a museum partner →',
      // Коллекция
      'collection.title': 'Negroni Collection',
      'collection.desc': 'All museum recipes collected by regions of Russia and the world. 100+ variations — one formula.',
      'collection.search': 'Search by name...',
      'collection.allRegions': 'All regions',
      'collection.allTags': 'All tags',
      'collection.empty': 'No recipes found for your query.',
      'collection.ingredients': 'Search by ingredients...',
      'collection.flavor': 'Filter by flavor',
      'collection.recipesCount': 'recipes',
      'collection.citiesCount': 'cities',
      'collection.found': 'Found',
      // Вкусы
      'flavor.bitter': 'Bitterness',
      'flavor.sweet': 'Sweetness',
      'flavor.sour': 'Acidity',
      'flavor.spicy': 'Spiciness',
      'flavor.strong': 'Strength',
      'flavor.bitterShort': 'Bit.',
      'flavor.sweetShort': 'Swt.',
      'flavor.sourShort': 'Acd.',
      'flavor.spicyShort': 'Spc.',
      'flavor.strongShort': 'Str.',
      'flavor.profile': 'Flavor profile',
      'flavor.caption': 'Bitterness, sweetness, acidity, spiciness, strength — scale 0–10',
      // Рецепт
      'recipe.ingredients': 'Recipe',
      'recipe.steps': 'Preparation',
      'recipe.prebatch': 'Pre-batch recipe',
      'recipe.flavor': 'Flavor profile',
      'recipe.related': 'Related recipes',
      'recipe.relatedSubtitle': 'Other Negroni variations from this region and the museum collection.',
      'recipe.share': 'Share recipe',
      'recipe.copyLink': 'Copy link',
      'recipe.linkCopied': 'Link copied to clipboard.',
      'recipe.linkCopyFailed': 'Failed to copy link. Please try manually.',
      'recipe.export': 'Export / Print',
      'recipe.addFavorite': 'Add to favorites',
      'recipe.inFavorites': 'In favorites',
      'recipe.removeFavorite': 'Remove from favorites',
      'recipe.author': 'Author',
      'recipe.bar': 'Bar',
      'recipe.notFound': 'Recipe not found',
      'recipe.backToCollection': 'Back to collection',
      'recipe.noPrebatch': 'No separate pre-batch is required for this recipe.',
      'recipe.prebatchDefault': 'Pre-batch',
      'recipe.prebatchIngredients': 'Pre-batch ingredients',
      'recipe.prebatchSteps': 'Preparation steps',
      'recipe.showOnMap': 'Show this recipe on the map',
      // Избранное
      'favorites.title': 'My Bar Card',
      'favorites.subtitle': 'Recipes you saved for quick access.',
      'favorites.empty': 'You haven\'t added any recipes to favorites yet.',
      'favorites.clear': 'Clear all',
      'favorites.export': 'Export list',
      'favorites.goToCollection': 'Go to collection →',
      'favorites.removeConfirm': 'Remove all recipes from favorites?',
      'favorites.remove': 'Remove from favorites',
      'favorites.exportHeader': 'MY BAR CARD — The Negroni Museum',
      'favorites.exportIngredients': 'Ingredients',
      'favorites.exportFooter': '— The Negroni Museum • museynegroni.ru',
      // История
      'history.title': 'History of Negroni',
      'history.desc': 'From a Florentine bar to over 100 variations across Russia — a journey spanning more than a century.',
      'history.1860.title': 'Birth of the Americano',
      'history.1860.desc': 'The Americano cocktail appears in Milan bars — Campari with red vermouth and soda. It becomes the foundation for the future Negroni.',
      'history.1919.title': 'Count Camillo Negroni',
      'history.1919.desc': 'In Florence, Count Camillo Negroni asks bartender Fosco Scarselli to replace the soda in the Americano with gin. Thus the cocktail named after him is born.',
      'history.1919.link': 'Classic recipe →',
      'history.1920.title': 'Spreading across Italy',
      'history.1920.desc': 'The Negroni recipe passes from bar to bar. The cocktail becomes a symbol of the Italian aperitivo and European drinking culture.',
      'history.1947.title': 'Negroni Sbagliato',
      'history.1947.desc': 'In Milan, a bartender accidentally replaces gin with prosecco — thus creating the "mistaken" Negroni (Sbagliato), which became a classic in its own right.',
      'history.2000.title': 'World Renaissance',
      'history.2000.desc': 'The craft bar wave revives interest in classic cocktails. The Negroni becomes one of the most ordered cocktails in the world.',
      'history.2013.title': 'Negroni Week',
      'history.2013.desc': 'Imbibe Magazine and Campari launch Negroni Week — an annual international Negroni week, uniting bars around the world for charity.',
      'history.2024.title': 'The Negroni Museum — offline stand',
      'history.2024.desc': 'The BAR BOSS ONLINE team collects over 100 Negroni variations from bars across Russia at a professional bar festival. Each recipe is an interpretation of the classic with local ingredients.',
      'history.2025.title': 'The Museum goes online',
      'history.2025.desc': 'The collection moves to digital format: interactive map, detailed recipes, flavor profiles. The Negroni Museum becomes a living reference for bartenders and enthusiasts.',
      'history.2025.link': 'Browse the collection →',
      'history.quote': '"The Negroni is not just a cocktail. It is a formula: bitterness, sweetness and dryness in perfect balance. More than a century — and not a single unnecessary ingredient."',
      'history.quoteAuthor': '— The Spirit of the Negroni Museum',
      // Партнёры
      'partners.title': 'Become a partner',
      'partners.heroLabel': 'Partnership program',
      'partners.heroTitle': 'Become part of <span>The Negroni Museum</span>',
      'partners.heroDesc': 'The Negroni Museum is a growing online platform with an audience of bartenders, bar owners and cocktail enthusiasts across Russia. We offer partners direct access to a targeted audience through branded content, recipes and events.',
      'partners.statRecipes': 'recipes',
      'partners.statCities': 'cities',
      'partners.statRegions': 'regions',
      'partners.statVisitors': 'visitors / month',
      'partners.whyTitle': 'Why the Negroni Museum',
      'partners.whySubtitle': 'We have created a unique platform at the intersection of bar culture, education and digital content. Here is what we offer partners:',
      'partners.benefit1.title': 'Target audience',
      'partners.benefit1.desc': 'Our visitors are professional bartenders, bar managers, venue owners and passionate home mixologists. These are the people making purchasing decisions.',
      'partners.benefit2.title': 'Content integration',
      'partners.benefit2.desc': 'Your brand becomes part of the recipe: ingredient, recommendation, story. Not a banner, but organic content that people read and save.',
      'partners.benefit3.title': 'Geography of Russia',
      'partners.benefit3.desc': 'Recipes are tied to cities from Kaliningrad to Vladivostok. Partnership allows targeted work with specific regions or coverage of the entire country.',
      'partners.benefit4.title': 'Analytics and reporting',
      'partners.benefit4.desc': 'Transparent metrics: recipe views, clicks, favorites, user geography. You see the real effect of the integration.',
      'partners.benefit5.title': 'Educational format',
      'partners.benefit5.desc': 'Each recipe is a mini-masterclass with technique, pre-batches, flavor profile. The ideal platform for brands that want to educate the market.',
      'partners.benefit6.title': 'Exclusive events',
      'partners.benefit6.desc': 'Joint offline tastings at bar festivals, collaborations with bartenders, recipe contests — all with partner mention and participation.',
      'partners.tiersTitle': 'Partnership formats',
      'partners.tiersSubtitle': 'Three levels of integration — from platform presence to full branded content and events.',
      'partners.tierPopular': 'Popular',
      'partners.tier1.name': 'Tasting',
      'partners.tier1.price': 'Basic placement',
      'partners.tier1.desc': 'Ideal for brands wanting to introduce their product to the audience and get their first integrations.',
      'partners.tier1.f1': 'Logo on the partners page',
      'partners.tier1.f2': 'Mention in 1–2 recipes as a recommended ingredient',
      'partners.tier1.f3': 'Link to partner website',
      'partners.tier1.f4': 'Quarterly views report',
      'partners.tier2.name': 'Collection',
      'partners.tier2.price': 'Content integration',
      'partners.tier2.desc': 'Your brand becomes a recommended ingredient and recipe co-author. Maximum content presence.',
      'partners.tier2.f1': 'Everything from the "Tasting" plan',
      'partners.tier2.f2': 'Branded recipe with your product (co-created)',
      'partners.tier2.f3': 'Logo on the main page',
      'partners.tier2.f4': 'Priority placement in collection',
      'partners.tier2.f5': 'Map integration (separate point)',
      'partners.tier2.f6': 'Social media publication',
      'partners.tier2.f7': 'Monthly analytics',
      'partners.tier3.name': 'Patron',
      'partners.tier3.price': 'Strategic partnership',
      'partners.tier3.desc': 'Full partnership with co-branding, exclusive events and priority audience access.',
      'partners.tier3.f1': 'Everything from the "Collection" plan',
      'partners.tier3.f2': 'Series of 3–5 branded recipes',
      'partners.tier3.f3': 'Dedicated section "Recipes by [Partner]"',
      'partners.tier3.f4': 'Co-organization of offline tasting at festival',
      'partners.tier3.f5': 'Bartender recipe contest with partner prizes',
      'partners.tier3.f6': 'Integration into educational materials',
      'partners.tier3.f7': 'Weekly analytics + dashboard access',
      'partners.tier3.f8': 'Mention as general partner',
      'partners.discuss': 'Discuss',
      'partners.choose': 'Choose',
      'partners.audienceTitle': 'Our audience',
      'partners.audienceSubtitle': 'Who visits the Negroni Museum and why it matters for your brand.',
      'partners.aud1': 'Professional bartenders',
      'partners.aud2': 'Bar and restaurant owners',
      'partners.aud3': 'Home mixologists',
      'partners.aud4': 'Brand ambassadors and distributors',
      'partners.processTitle': 'How to become a partner',
      'partners.processSubtitle': 'A simple four-step process — from application to integration launch.',
      'partners.step1.title': 'Fill out the application',
      'partners.step1.desc': 'Tell us about your brand, product and goals. We will contact you within 2 business days.',
      'partners.step2.title': 'Discuss the format',
      'partners.step2.desc': 'We select the plan and integration format for your goals: content, event, contest or a combined package.',
      'partners.step3.title': 'Create content',
      'partners.step3.desc': 'Our team works with you to develop recipes, texts and visuals. We coordinate every step.',
      'partners.step4.title': 'Launch and analytics',
      'partners.step4.desc': 'We publish the integration, track metrics and provide transparent reporting on results.',
      'partners.formTitle': 'Submit an application',
      'partners.formSubtitle': 'Fill out the form — we will contact you to discuss partnership details.',
      'partners.formName': 'Name *',
      'partners.formCompany': 'Company / Brand *',
      'partners.formEmail': 'Email *',
      'partners.formPhone': 'Phone',
      'partners.formTier': 'Interested format',
      'partners.formTierDefault': 'Select format',
      'partners.formTierTasting': 'Tasting (basic)',
      'partners.formTierCollection': 'Collection (content integration)',
      'partners.formTierPatron': 'Patron (strategic)',
      'partners.formTierCustom': 'Custom format',
      'partners.formMessage': 'Message',
      'partners.formSubmit': 'Submit application',
      'partners.faqTitle': 'Frequently asked questions',
      'partners.faq1.q': 'How much does partnership cost?',
      'partners.faq1.a': 'The cost depends on the format and scope of integration. We discuss terms individually. The basic "Tasting" format is available for most brands.',
      'partners.faq2.q': 'What brands are suitable?',
      'partners.faq2.a': 'Spirit producers (gin, vermouth, bitters, liqueurs), bar equipment, syrups, glassware, tableware, educational projects in HoReCa, and any brands related to bar culture.',
      'partners.faq3.q': 'How quickly will the integration appear?',
      'partners.faq3.a': 'Usually 2–4 weeks from application to publication. It depends on the format: simple logo placement — 3–5 days, creating a branded recipe — 2–3 weeks.',
      'partners.faq4.q': 'Can I place my own recipe?',
      'partners.faq4.a': 'Yes! We welcome recipes from partners. Our team will help adapt the recipe to the museum format: add a flavor profile, tech card and tie it to a city on the map.',
      'partners.faq5.q': 'What metrics do you provide?',
      'partners.faq5.a': 'Recipe page views, partner link clicks, favorites additions, visitor geography, time on page. For the "Patron" plan — access to a live dashboard.',
      'partners.faq6.q': 'Are there offline formats?',
      'partners.faq6.a': 'Yes. The Negroni Museum participates in bar festivals. Under the "Collection" and "Patron" plans we organize joint tasting stands, contests and master classes with partner participation.',
      'partners.ctaTitle': 'Ready to discuss?',
      'partners.ctaDesc': 'Write to us — we will find a format that delivers results for your brand and enriches the Negroni Museum collection.',
      'partners.ctaBtn': 'Submit application',
      'partners.errName': 'Please enter your name.',
      'partners.errCompany': 'Please enter company or brand name.',
      'partners.errEmail': 'Please enter a valid email.',
      'partners.formSending': 'Sending...',
      'partners.formSuccess': 'Thank you! Your application has been received. We will contact you within 2 business days.',
      // Карта
      'map.title': 'Negroni recipes across Russian regions',
      'map.desc': 'Select a city or point on the map — cocktail variations from that location will open.',
      'map.cities': 'Cities',
      'map.openRecipe': 'Open recipe',
      // Общие
      'footer.rights': '© 2025 The Negroni Museum. All rights reserved.',
      'theme.light': 'Light theme',
      'theme.dark': 'Dark theme',
      'lang.switch': 'RU'
    }
  };

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* no-op */ }
  }

  function t(key) {
    var lang = getLang();
    var dict = strings[lang] || strings[DEFAULT_LANG];
    return dict[key] || (strings[DEFAULT_LANG][key]) || key;
  }

  function applyToDOM() {
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var translation = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    });
    // Обновить кнопку переключения языка
    var langBtns = document.querySelectorAll('.lang-toggle-btn');
    langBtns.forEach(function (btn) {
      btn.textContent = t('lang.switch');
    });
    // Обновить логотипы
    var logos = document.querySelectorAll('.logo, .footer-logo');
    logos.forEach(function (el) {
      el.textContent = t('logo');
    });
    // Обновить бейдж "Популярный" в партнёрах
    var featuredTier = document.querySelector('.partners-tier.featured');
    if (featuredTier) {
      featuredTier.setAttribute('data-popular-label', t('partners.tierPopular'));
    }
    // Обновить lang на html
    document.documentElement.lang = getLang() === 'en' ? 'en' : 'ru';
  }

  function toggle() {
    var current = getLang();
    var next = current === 'ru' ? 'en' : 'ru';
    setLang(next);
    applyToDOM();
    if (window.NegroniAnalytics) {
      window.NegroniAnalytics.track('lang_toggle', { lang: next });
    }
  }

  function init() {
    applyToDOM();
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-toggle-btn');
      if (btn) {
        e.preventDefault();
        toggle();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { t: t, getLang: getLang, setLang: setLang, toggle: toggle, applyToDOM: applyToDOM };
})();
