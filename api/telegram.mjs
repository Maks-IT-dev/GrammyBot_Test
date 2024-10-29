import { Bot } from "grammy";
import { serve } from "vercel-serverless"; // Використовується для Vercel

// Імпортуємо конфігурацію бота з токеном
import botConfig from "./index.js";

// Створюємо екземпляр бота
const bot = new Bot(botConfig.token);

// Обробник команд (опційно)
bot.command("start", (ctx) => ctx.reply("Бот запущено!"));

// Встановлюємо обробник для вебхука на Vercel
const handler = serve(async (req, res) => {
    if (req.method === "POST") {
        try {
            await bot.handleUpdate(await req.json());
            res.status(200).send("Update processed");
        } catch (error) {
            console.error("Error handling update:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
});

// Встановлення вебхука (замість `start` у telebot-vercel)
await bot.api.setWebhook("https://grammy-bot-test-jz3ux08b2-maks-it-devs-projects.vercel.app");

// Експортуємо обробник
export default handler;