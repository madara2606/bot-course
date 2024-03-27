const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '6665919051:AAF1lB-XwIOH3XPwIk-qe0KZoR0Iu6Wy06s';

const bot = new TelegramApi(token, {polling: true})
const chats = {};


const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Отгадай цифру от 0 до 9');
    const randomNumber = Math.floor(Math.random() * 10);
    console.log(randomNumber);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'отгадывай !', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие.'}, 
        {command: '/info', description: 'Получить информацию о пользователе.'},
        {command: '/game', description: 'Угадать число.'}
    ]);
    bot.on('message', async(msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendPhoto(chatId, './Аска.png');
            return bot.sendMessage(chatId, "Добро пожаловать в телеграм бот pc Akhmedov!");
        };
        if (text === '/info') {
            return bot.sendMessage(chatId, 'Тебя зовут ' + msg.from.first_name)
        };
        if (text === '/game') {
           return startGame(chatId);
        };
        return bot.sendMessage(chatId, 'Я вас не понимаю :(')
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') { 
            return startGame(chatId);
        };
        if(Number(data) === chats[chatId]) {
            return await bot.sendMessage(chatId, 'Ты угадал! Я и в правду загадал число ' + data + '.', againOptions)
        } else{
            return await bot.sendMessage(chatId, 'Нет! Я загадал число ' + chats[chatId] + '.', againOptions)
        }

    });
}

start();