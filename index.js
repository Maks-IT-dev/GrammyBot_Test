require("dotenv").config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require("grammy");
const { hydrate } = require("@grammyjs/hydrate")

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate())

bot.api.setMyCommands([
    {
        command: "start",
        description: "Запуск бота",
    },
    {
        command: "menu",
        description: "Отримати меню",
    },
    // {
    //     command: "mood",
    //     description: "Оцінити настрій",
    // },
    // {
    //     command: "share",
    //     description: "Поділитися данними",
    // },
    // {
    //     command: "inline_keyboard",
    //     description: "Інлайн клавіатура",
    // },
])

// bot.command("start", async (ctx) => {
//     await ctx.reply("Привіт! Я - бот. Тг канал: <a href='https://t.me//TestBotLearn'>силка</a>", {
//         // reply_parameters: {message_id: ctx.msg.message_id}    відповідь на повідомлення
//         parse_mode: "HTML"
//     })
// })

bot.command("start", async (ctx) => {
    await ctx.react("🔥")
    await ctx.reply("Привіт\\! Я \\- бот\\. Тг канал: [це силка](https://t.me//TestBotLearn)", {
        parse_mode: "MarkdownV2",
        disable_web_page_prewiew: true     //показати прев'ю з силкою
    })
})


const menuKeyboard = new InlineKeyboard()
    .text("Дізнатися статус замовлення", "order-status")
    .text("Звернутись в підтримку", "support")
const backKeyboard = new InlineKeyboard().text("< Назад в меню", "back")

bot.command("menu", async (ctx) => {
    await ctx.reply("Виберіть пункт меню", {
        reply_markup: menuKeyboard,
    })
})

bot.callbackQuery("order-status", async (ctx) => {
    await ctx.callbackQuery.message.editText("Статус замовлення: в дорозі", {
        reply_markup: backKeyboard,
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery("support", async (ctx) => {
    await ctx.callbackQuery.message.editText("Напишіть Ваш запит", {
        reply_markup: backKeyboard,
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery("back", async (ctx) => {
    await ctx.callbackQuery.message.editText("Виберіть пункт меню", {
        reply_markup: menuKeyboard,
    })
    await ctx.answerCallbackQuery()
})


// Клавіатура
bot.command("mood", async (ctx) => {
    const moodKeyboard = new Keyboard().text("Добре").row().text("Норм").row().text("Погано").resized()

    // const moodLabels = ["Добре", "Норм", "Погано"]
    // const rows = moodLabels.map((label) => {
    //     return [
    //         Keyboard.text(label)
    //     ]
    //})
    // const moodKeyboard2 = Keyboard.from(rows).resized()
    await ctx.reply("Який настрій?", {
        reply_markup: moodKeyboard
    })
})

bot.command("share", async (ctx) => {
    shareKeyboard = new Keyboard().requestLocation("Геолокація").requestContact("Контакт").
        requestPoll("Опитування").placeholder("Вкажи данні...").resized()

    await ctx.reply("Чим хочеш поділитись?", {
        reply_markup: shareKeyboard
    })
})

bot.command("inline_keyboard", async (ctx) => {
    // const inlineKeyboard = new InlineKeyboard()
    //     .text("1", "button-1").row()
    //     .text("2", "button-2").row()
    //     .text("3", "button-3")
    
    // 2 спосіб
    const inlineKeyboard2 = new InlineKeyboard().url("Перейти в тг-канал", "https://t.me//TestBotLearn")
    await ctx.reply("Нажміть кнопку", {
        reply_markup: inlineKeyboard2,
    })
})

// bot.callbackQuery(/button-[1-3]/, async (ctx) => {
//     await ctx.answerCallbackQuery()
//     await ctx.reply(`Ви нажали кнопку ${ctx.callbackQuery.data}`)
// })

// bot.on("callback_query:data", async (ctx) => {
//     await ctx.answerCallbackQuery()
//     await ctx.reply(`Ви нажали кнопку ${ctx.callbackQuery.data}`)
// })

// bot.on(":contact", async (ctx) => {
//     await ctx.reply("Дякую за контакт!")
// })

// bot.hears("Добре", async (ctx) => {
//     await ctx.reply("Класс!", {
//         reply_markup: { remove_keyboard: true }
//     })
// })

// bot.command("start", async (ctx) => {
//     await ctx.reply("Привіт\\! Я \\- бот\\. Тг канал: *жирний* _курсив_", {                    Жирний і курсив
//         parse_mode: "MarkdownV2"
//     })
// })

// bot.on(":media", "::url", async (ctx) => {
//     await ctx.reply("Отримав силку");                      Силка
// });

// bot.on("msg").filter((ctx) => {
//     return ctx.from.id === 608375269 //мій id
// }, async (ctx) => {                                   Фільтер
//     await ctx.reply("Привіт, адмін!")
// })

// bot.on("msg", async (ctx) => {
//     console.log(ctx.msg)                         інфа про користувача в терміналі
// })

// bot.hears("ID",  async (ctx) => {
//     await ctx.reply(`Ваш ID: ${ctx.from.id}`)       ID
// })

// bot.hears(/капець/,  async (ctx) => {             слово в тексті
//     await ctx.reply("Сваримся?")
// })


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handing update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.start();