const { inlineKeyboard, keyboard } = require('telegraf').Markup
module.exports = {
    new_user: inlineKeyboard([
        [{ text: "🔗Selly.uz saytiga kirish", url: 'https://selly.uz/seller/settings' }]
    ]),
    menu: keyboard([
        ["💳Hisobim", "📈Statistika"],
        ["⚙️Sozlamalar", "🔗Oqimlar"],
        ["📨Aloqa", "👤Profil"],
    ]).resize(true),
    balance: inlineKeyboard([
        [{ text: "💸Pul yechish", url: "https://selly.uz/seller/balance" }],
        [{ text: "🕑To'lovlar tarixi", callback_data: 'history_balance' }]
    ]),
    statistics: inlineKeyboard([
        [{ text: "1️⃣ Kunlik", callback_data: 'stat_today' }, { text: "🕑 Kechagi", callback_data: 'stat_yesterday' }],
        [{ text: "📅 Haftalik", callback_data: 'stat_week' }, { text: "📆 O'tgan haftalik", callback_data: 'stat_lastweek' }],
        [{ text: "🗓️ Oylik", callback_data: 'stat_month' }, { text: "📅 O'tgan oylik", callback_data: 'stat_lastmonth' }],
        [{ text: "🔝 Yillik", callback_data: 'stat_year' }, { text: "🏆 Umumiy", callback_data: 'stat_total' }],
    ]),
    settings: ({ news, reject, recontact, archive, copy, success, sended, delivered }) => {
        function okNo(bool) {
            return (bool ? '✅' : '❌');
        }
        return inlineKeyboard([
            [{ text: `🆕 Yangi buyurtmalar: ${okNo(news)}`, callback_data: 'set_new' }],
            [{ text: `🔄️ Qayta aloqa: ${okNo(recontact)}`, callback_data: 'set_recontact' }],
            [{ text: `‼️ Kopiya( Dublikat ): ${okNo(copy)}`, callback_data: 'set_copy' }],
            [{ text: `📦 Arxivlar: ${okNo(archive)}`, callback_data: 'set_archive' }],
            [{ text: `🚫 Bekor qilingan: ${okNo(reject)}`, callback_data: 'set_reject' }],
            [{ text: `🕑 Qabul qilingan: ${okNo(success)}`, callback_data: 'set_success' }],
            [{ text: `🚚 Yuborilgan: ${okNo(sended)}`, callback_data: 'set_sended' }],
            [{ text: `🏁 Yetkazilgan: ${okNo(delivered)}`, callback_data: 'set_delivered' }],
        ])
    },
    profile: inlineKeyboard([
        [{ text: '🚫 Profilni telegramdan ajratish', callback_data: 'profile_unlink'}]
    ])
}