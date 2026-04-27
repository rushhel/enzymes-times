/* ЭТРА v5 — Core product data for catalog preview + modal.
   Sourced from premium-v4-ru.html PRODUCTS object (lines 3197–3676).
   8 hero items; full catalog lives on catalog-ru.html (stub in v1). */

window.PRODUCTS = {
  praenzyme: {
    name: 'Закваска ПРАЭнзим',
    category: 'Закваски',
    segment: 'drinks',
    price: '€35',
    priceNum: 35,
    img: 'assets/img/starter-culture-new.png',
    tagline: 'Основа домашних энзимов',
    badge: 'hot',
    rating: 4.9,
    reviews: 24,
    description: 'Флагманская закваска ЭТРА для создания мощных энзимных напитков дома. Живые молочнокислые бактерии и Bacillus subtilis. Из 1 литра — до 10 литров готового напитка.',
    benefits: [
      'Восстанавливает микрофлору кишечника',
      'Укрепляет иммунитет',
      'Улучшает пищеварение',
      '10 л напитка из 1 л закваски'
    ],
    volume: '1 литр',
    taste: 'Кисло-солоноватая база, нейтральная — раскрывается вкусом того, на чём настаиваете'
  },
  energetic: {
    name: 'Полезный Энергетик',
    category: 'Напитки',
    segment: 'drinks',
    price: '€9',
    priceNum: 9,
    img: 'assets/img/energetic-new.png',
    tagline: 'Природная энергия без кофеина',
    badge: null,
    rating: 4.9,
    reviews: 18,
    description: 'Яркий цитрусовый напиток с женьшенем. Устойчивая энергия без кофеина и сахара. Живые культуры бактерий сохранены.',
    benefits: [
      'Устойчивая энергия без кофеина',
      'Экстракт женьшеня',
      'Живые культуры бактерий',
      'Без сахара и консервантов'
    ],
    volume: '1 литр / 0.5 литра',
    taste: 'Цитрус, лайм, лимон, мягкая горчинка женьшеня'
  },
  bifidumfanata: {
    name: 'Бифидум Фаната',
    category: 'Напитки',
    segment: 'drinks',
    price: '€8',
    priceNum: 8,
    img: 'assets/img/bifidumfanata.png',
    tagline: 'Восстановление микробиома',
    badge: 'new',
    rating: 4.8,
    reviews: 12,
    description: 'Концентрат бифидобактерий в ферментированном растительном коктейле. Для глубокой работы с микробиомом после антибиотиков или стресса.',
    benefits: [
      'Концентрат бифидобактерий',
      'После антибиотиков',
      'Снижает воспаления',
      'Улучшает всасывание витаминов'
    ],
    volume: '1 литр',
    taste: 'Мягкая ягодная кислинка, густая бархатная текстура'
  },
  twostarters: {
    name: 'Две Закваски',
    category: 'Закваски',
    segment: 'complex',
    price: '€65',
    priceNum: 65,
    img: 'assets/img/two-starters-new.png',
    tagline: 'Выгодный набор для семьи',
    badge: 'value',
    rating: 4.9,
    reviews: 15,
    description: 'Две ПРАЭнзим закваски по специальной цене. Идеально для семьи или длительного курса. Экономия €5.',
    benefits: [
      'Экономия €5 на наборе',
      'До 20 литров напитка',
      'Идеально для семьи',
      'Курс на 2–3 месяца'
    ],
    volume: '2 × 1 литр',
    taste: 'Та же база ПРАЭнзим, просто в удвоенном объёме'
  },
  parasiteoff: {
    name: 'ПАРАЗит OFF',
    category: 'Курсы',
    segment: 'cleanse',
    price: '€45',
    priceNum: 45,
    img: 'assets/img/parasiteoff.png',
    tagline: 'Чистка от паразитов',
    badge: null,
    rating: 4.7,
    reviews: 9,
    description: 'Комплексная программа с ферментированными травами, полынью и грецким орехом. 14-дневный курс для мягкой противопаразитарной чистки.',
    benefits: [
      'Мягкая противопаразитарная чистка',
      '14-дневный курс',
      'Без агрессивных средств',
      'Поддержка ЖКТ'
    ],
    volume: '2 × 1 литр',
    taste: 'Травяная горечь, полынь, анис — не для тех, кто любит сладкое'
  },
  etragenez: {
    name: 'ЭТРАГЕНЕЗ',
    category: 'Курсы',
    segment: 'drinks',
    price: '€120',
    priceNum: 120,
    img: 'assets/img/etragenez.png',
    tagline: 'Полная перезагрузка микробиома',
    badge: 'premium',
    rating: 5.0,
    reviews: 31,
    description: 'Флагманская 21-дневная программа. Очищение, восстановление и укрепление микробиома в трёх фазах. С поддержкой кураторов и методичкой.',
    benefits: [
      '21-дневная программа',
      'Трёхфазная методика',
      'Поддержка куратора',
      'Печатная методичка'
    ],
    volume: '6 × 1 литр + методичка',
    taste: 'Разные вкусы по дням: от ягодных до травяных'
  },
  biotarkhun: {
    name: 'Биотархун',
    category: 'Напитки',
    segment: 'bar',
    price: '€7',
    priceNum: 7,
    img: 'assets/img/biotarkhun.png',
    tagline: 'Освежающий летний напиток',
    badge: null,
    rating: 4.8,
    reviews: 14,
    description: 'Живая ферментация эстрагона на растительных пробиотиках. Вкус детства, сделанный правильно — без сахара и красителей.',
    benefits: [
      'Натуральный эстрагон',
      'Без сахара и красителей',
      'Живые пробиотики',
      'Освежает и утоляет жажду'
    ],
    volume: '0.5 литра',
    taste: 'Эстрагон, свежий, травянисто-сладковатый с лёгкой газацией'
  },
  twocourses: {
    name: 'Два Курса',
    category: 'Курсы',
    segment: 'courses',
    price: '€210',
    priceNum: 210,
    img: 'assets/img/two-courses-new.png',
    tagline: 'ЭТРАГЕНЕЗ × 2 — парная программа',
    badge: 'value',
    rating: 5.0,
    reviews: 7,
    description: 'Два курса ЭТРАГЕНЕЗ со скидкой. Для пар или чтобы пройти программу дважды подряд для максимального эффекта.',
    benefits: [
      'Скидка €30',
      'Для пар',
      '42 дня полной перезагрузки',
      '2 × методичка'
    ],
    volume: '12 × 1 литр',
    taste: 'Весь спектр вкусов программы ЭТРАГЕНЕЗ'
  }
};

/* Starter bundles used by the quiz recommendation engine */
window.QUIZ_RECOMMENDATIONS = {
  detox:   'etragenez',   // high symptom score → full reset
  energy:  'energetic',   // low energy primary → energy drink
  gut:     'bifidumfanata', // digestion primary → bifido
  starter: 'praenzyme'    // default entry
};
