export const makeId = () => Math.random().toString(36).slice(2, 9);


export const AUTHOR_POOL = [
    { name: "Соня 🌈", avatar: "👩‍🦲", color: "#FF922B" },
    { name: "Лёша 🎮", avatar: "🧑", color: "#845EC2" },
    { name: "Ты ✨", avatar: "🙋", color: "#4D96FF" },
];

export type Post = {
    id: string;
    author: string;
    avatar: string;
    color: string;
    time: string;
    text: string;
    image: null | {
        bg: string;
        label: string;
    };
    likes: number;
    liked: boolean;
    comments: {
        id: string;
        author: string;
        avatar: string;
        color: string;
        text: string;
    }[];
}

export const INITIAL_POSTS: Post[] = [
    {
        id: makeId(),
        author: "Маша 🌸",
        avatar: "👩‍🦰",
        color: "#FF6B6B",
        time: "2 мин назад",
        text: "Сегодня испекла тыквенный пирог по бабушкиному рецепту. Дом пахнет корицей и счастьем!",
        image: null,
        likes: 14,
        liked: false,
        comments: [
            {
                id: makeId(),
                author: "Дима 🎸",
                avatar: "🧑",
                color: "#4D96FF",
                text: "Оставь кусочек!! 🥺",
            },
            {
                id: makeId(),
                author: "Аня 🌻",
                avatar: "👩‍🦳",
                color: "#e5a100",
                text: "Мм, рецепт скинь пожалуйста 🙏",
            },
        ],
    },
    {
        id: makeId(),
        author: "Дима 🎸",
        avatar: "🧑",
        color: "#4D96FF",
        time: "15 мин назад",
        text: "Наконец-то прошёл тот уровень, на котором застрял три дня. ТРИДЦАТЬ ДВА НОКТЮРНА СПУСТЯ 🎮",
        image: null,
        likes: 9,
        liked: false,
        comments: [
            {
                id: makeId(),
                author: "Лёша 🎮",
                avatar: "🧑",
                color: "#845EC2",
                text: "ЛЕГЕНДА! Как?! Я до сих пор не могу 😭",
            },
        ],
    },
    {
        id: makeId(),
        author: "Аня 🌻",
        avatar: "👩‍🦳",
        color: "#FFD93D",
        time: "1 час назад",
        text: "Гуляла в парке — листья такие красивые, что хочется просто стоять и смотреть бесконечно. Осень всё-таки лучший сезон!",
        image: {
            bg: "linear-gradient(135deg,#f6d365,#fda085)",
            label: "🌿 парк осенью",
        },
        likes: 21,
        liked: false,
        comments: [],
    },
    {
        id: makeId(),
        author: "Петя 🐻",
        avatar: "🧔",
        color: "#6BCB77",
        time: "3 часа назад",
        text: "Взял кота с собой на дачу. Он сидит под яблоней и делает вид, что он дикая пантера. Мы с ним оба довольны.",
        image: null,
        likes: 33,
        liked: false,
        comments: [
            {
                id: makeId(),
                author: "Маша 🌸",
                avatar: "👩‍🦰",
                color: "#FF6B6B",
                text: "Фото кота!!! Немедленно!!! 😻",
            },
            {
                id: makeId(),
                author: "Соня 🌈",
                avatar: "👩‍🦲",
                color: "#FF922B",
                text: "Пантера на пенсии 😂",
            },
        ],
    },
];