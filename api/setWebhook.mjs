import { Bot } from "grammy";
import { serve } from "vercel-serverless"; // використовується для розгортання на Vercel

// Імпортуємо вашого бота з конфігурацією
import botConfig from "./index.js";

// Створюємо екземпляр бота
const bot = new Bot(botConfig.token);

// Встановлюємо обробник для запитів
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

// Налаштування вебхука
await bot.api.setWebhook("https://grammy-bot-test-qggegt19f-maks-it-devs-projects.vercel.app");

// Експортуємо функцію обробника як API
export default handler;