import { Bot } from "grammy";
import botConfig from "./index.js";

const bot = new Bot(process.env.BOT_API_KEY);

// Налаштування вебхука (переходьте в налаштування вашого проєкту, щоб виконати цей код лише один раз)
async function setupWebhook() {
    const webhookUrl = "https://grammy-bot-test-qggegt19f-maks-it-devs-projects.vercel.app/api/webhook";
    await bot.api.setWebhook(webhookUrl);
}

// Викликайте цю функцію лише під час ініціалізації вашого проекту, а не при кожному запиті
setupWebhook().catch(console.error);

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

export default handler;