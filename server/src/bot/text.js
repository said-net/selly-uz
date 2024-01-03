module.exports = {
    new_user: (id, name) => {
        return `<b>✌️ Salom ${name?.replaceAll('<', '')?.replaceAll('/', '')?.replaceAll('>', '')?.replaceAll('\\', '')}</b>\n🤖 Botdan to'liq foydalana olish uchun selly.uz saytiga <code>${id}</code> id raqamingizni biriktiring!`
    },
    menu: "<b>📋 Kerakli bo'limni tanlang!</b>",
    block: "<b>🚫 Siz loyihada bloklangansiz!</b>",
    // 
    balance: (balance) => {
        return `💳 Hisobingiz: <b>${balance?.toLocaleString()} so'm</b>`
    },
    // 
    statistics: ({ news, recontact, copy, reject, archive, success, sended, delivered, hold_profit, profit }, title) => {
        return `<b>📈 ${title} - statistika</b>\n\n🆕 Yangi buyurtmalar: <b>${news}</b> ta\n🔄️ Qayta aloqa: <b>${recontact}</b> ta\n‼️ Kopiya( Dublikat ): <b>${copy}</b> ta\n📦 Arxivlar: <b>${archive}</b> ta\n🚫 Bekor qilingan: <b>${reject}</b> ta\n🕑 Qabul qilingan: <b>${success}</b> ta\n🚚 Yuborilgan: <b>${sended}</b> ta\n🏁 Yetkazilgan: <b>${delivered}</b> ta\n\n----------💳 HISOB 💳----------\n\n🕑 Kutilayotgan foyda: <b>${hold_profit?.toLocaleString()}</b> so'm\n💰 Kelgan foyda: <b>${profit?.toLocaleString()}</b> so'm`
    },
    // 
    settings: ({ news, reject, recontact, archive, copy, success, sended, delivered }) => {
        function okNo(bool) {
            return (bool ? '✅' : '❌');
        }
        return `<b>⚙️ Xabar sozlamalari</b>\n\n🆕 Yangi buyurtmalar: <b>${okNo(news)}</b>\n🔄️ Qayta aloqa: <b>${okNo(recontact)}</b>\n‼️ Kopiya( Dublikat ): <b>${okNo(copy)}</b>\n📦 Arxivlar: <b>${okNo(archive)}</b>\n🚫 Bekor qilingan: <b>${okNo(reject)}</b>\n🕑 Qabul qilingan: <b>${okNo(success)}</b>\n🚚 Yuborilgan: <b>${okNo(sended)}</b>\n🏁 Yetkazilgan: <b>${okNo(delivered)}</b>`
    },
    // 
    streams: (streams) => {
        let txt = `<b>🔗Oqimlar: ${streams?.length} ta</b>\n\n`;
        streams?.forEach((s) => {
            txt += `----------ID: ${s?.id}----------\n📋Nomi: <b>${s?.title}</b>\n📦Mahsulot: <b>${s?.product?.title}</b>\n🛒Sotuv narxi: <b>${Number(s?.product?.price + s?.additional)?.toLocaleString()}</b> so'm\n💰Sotuvchi bonusi: <b>${Number(s?.product?.for_seller + s?.additional)?.toLocaleString()}</b> so'm\n🔗Havola: <code>https://selly.uz/o/${s?.id}</code>\n\n`
        });
        return txt
    },
    // 
    contacts: "<b>📨 Aloqa markazi</b>\n\n✉️ Telegram: <b>@Sellyuzb</b>\n👥 Gurux: <b>@Sellyuz_gr</b>",
    profile: (id, name, phone) => {
        return `<b>👤 Selly.uz - Profil</b>\n\nUser 🆔: <b>${id}</b>\n📋Ismingiz: <b>${name}</b>\n📞Raqamingiz: <b>${phone?.slice(0, 10)}***</b>\n`;
    },
    // ORDERS
    new_order: (id, phone, product, stream) => {
        return `<b>🆕 Yangi buyurtma</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    copy: (id, phone, product, stream) => {
        return `<b>‼️ Kopiya( Dublikat )</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    recontact: (id, phone, product, stream) => {
        return `<b>🔄️ Qayta aloqa</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    reject: (id, phone, product, stream) => {
        return `<b>🚫 Bekor qilindi( Qaytib keldi )</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    archive: (id, phone, product, stream) => {
        return `<b>📦 Arxiv</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    success: (id, phone, product, stream) => {
        return `<b>🕑Buyurtma qabul qilnidi( Upakovkada )</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    sended: (id, phone, product, stream) => {
        return `<b>🚚 Buyurtma yuborildi</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    delivered: (id, phone, product, stream) => {
        return `<b>🏁 Buyurtma yetkazildi</b>\n🆔 Buyurtma uchun ID: <b>#${id}</b>\n📞 Buyurtmachi raqami: <b>${phone?.slice(0, 10)}***</b>\n🔗 Oqim: <b>${stream}</b>\n📦 Mahsulot: <b>${product}</b>`
    },
    add_balance: (balance) => {
        return `💳 Hisobingizga <b>+${balance?.toLocaleString()}</b> so'm qo'shildi!`
    }
}