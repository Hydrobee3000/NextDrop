import { Locale } from '../models/locale';

export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  ru: {
    'nav.home': 'Главная',
    'nav.search': 'Поиск',
    'nav.favorites': 'Мой список',

    'home.title': 'Скоро выходят',
    'home.sectionTitle': 'Все ожидаемые',
    'home.empty': 'Ничего не нашлось :(',

    'search.title': 'Поиск игры',
    'search.placeholder': 'Введите название игры',
    'search.empty': 'Ничего не нашлось :(',

    'favorites.title': 'Мой список',
    'favorites.empty': 'Тут тоже пусто :(',

    'hero.badge': 'Самое ожидаемое',

    'favorite.add': 'В избранное',
    'favorite.remove': 'Убрать из избранного',

    'filter.all': 'Все',
    'filter.pc': 'PC',
    'filter.playstation': 'PlayStation',
    'filter.xbox': 'Xbox',
    'filter.switch': 'Switch',

    'days.today': 'Сегодня',
    'days.tomorrow': 'Завтра',
    'days.dayAfterTomorrow': 'Послезавтра',
    'days.released': 'Уже вышла',
    'day.one': 'день',
    'day.few': 'дня',
    'day.many': 'дней',

    'date.tba': 'Дата уточняется',
  },
  en: {
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.favorites': 'My List',

    'home.title': 'Coming soon',
    'home.sectionTitle': 'All upcoming',
    'home.empty': 'Nothing found :(',

    'search.title': 'Search games',
    'search.placeholder': 'Enter a game name',
    'search.empty': 'Nothing found :(',

    'favorites.title': 'My List',
    'favorites.empty': 'Empty here too :(',

    'hero.badge': 'Most anticipated',

    'favorite.add': 'Add to favorites',
    'favorite.remove': 'Remove from favorites',

    'filter.all': 'All',
    'filter.pc': 'PC',
    'filter.playstation': 'PlayStation',
    'filter.xbox': 'Xbox',
    'filter.switch': 'Switch',

    'days.today': 'Today',
    'days.tomorrow': 'Tomorrow',
    'days.dayAfterTomorrow': 'Day after tomorrow',
    'days.released': 'Already out',
    'day.one': 'day',
    'day.other': 'days',

    'date.tba': 'Release date TBA',
  },
};
