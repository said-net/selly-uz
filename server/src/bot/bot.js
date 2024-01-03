const { Telegraf } = require('telegraf');
const { BOT_TOKEN } = require('../configs/env.config');
const telegramModel = require('../models/telegram.model');
const text = require('./text');
const buttons = require('./buttons');
const orderModel = require('../models/order.model');
const paymentModel = require('../models/payment.model');
const moment = require('moment');
const streamModel = require('../models/stream.model');
const bot = new Telegraf(BOT_TOKEN);
bot.start(async msg => {
    const { id, first_name } = msg.from;
    const $user = await telegramModel.findOne({ telegram: id });
    if (!$user) {
        new telegramModel({
            telegram: id,
        }).save().catch(() => { });
    }
    function sm(txt, btn) {
        msg.replyWithHTML(txt, { ...btn })
    }
    if (!$user || !$user?.user) {
        sm(text.new_user(id, first_name), buttons.new_user);
    } else {
        sm(text.menu, buttons.menu);
    }
});
bot.on('text', async msg => {
    const { id } = msg.from;
    const tx = msg.message.text;
    // 
    function sm(txt, btn = buttons?.menu) {
        msg.replyWithHTML(txt, { ...btn })
    }
    // 
    const $user = await telegramModel.findOne({ telegram: id }).populate('user')
    if (!$user) {
        new telegramModel({
            telegram: id,
        }).save().then(() => {
            sm(text.new_user(id, msg?.from?.first_name), buttons.new_user);
        }).catch(() => { });
    } else if (!$user?.user) {
        sm(text.new_user(id, msg?.from?.first_name), buttons.new_user);
    } else if ($user?.user?.block) {
        sm(text.block);
    } else if ($user?.user?.admin) {
        // ADMIN PANEL
    } else if ($user?.user?.seller) {
        if (tx === "💳Hisobim") {
            const $orders = await orderModel.find({ seller: $user?.user?._id, status: 'delivered' });
            const $payments = await paymentModel.find({ user: $user?.user?._id, type: 'seller' });
            let balance = 0;
            $orders.forEach(order => {
                balance += order?.for_seller;
            });
            $payments.forEach(payment => {
                if (payment?.status === 'success' || payment?.status === 'pending') {
                    balance -= payment?.value;
                }
            });
            sm(text.balance(balance), buttons?.balance);
        } else if (tx === '📈Statistika') {
            const news = await orderModel.find({ status: 'new', seller: $user?.user?._id })?.countDocuments();
            const recontact = await orderModel.find({ status: 'recontact', seller: $user?.user?._id })?.countDocuments();
            const copy = await orderModel.find({ status: 'copy', seller: $user?.user?._id })?.countDocuments();
            const reject = await orderModel.find({ status: 'reject', seller: $user?.user?._id })?.countDocuments();
            const archive = await orderModel.find({ status: 'archive', seller: $user?.user?._id })?.countDocuments();
            const success = await orderModel.find({ status: 'success', seller: $user?.user?._id })?.countDocuments();
            const sended = await orderModel.find({ status: 'sended', seller: $user?.user?._id });
            const delivered = await orderModel.find({ status: 'delivered', seller: $user?.user?._id });
            // calculate
            let hold_profit = 0;
            let profit = 0;

            delivered?.forEach((o) => {
                profit += o?.for_seller;
            });
            sended?.forEach((o) => {
                hold_profit += o?.for_seller;
            });
            sm(text?.statistics({ news, recontact, copy, reject, archive, success, sended: sended?.length, delivered: delivered?.length, hold_profit, profit }, 'Umumiy'), buttons?.statistics)
        } else if (tx === "⚙️Sozlamalar") {
            const { new: news, reject, archive, copy, success, sended, delivered, recontact } = $user;
            sm(text.settings({ news, recontact, reject, archive, copy, success, sended, delivered }), buttons?.settings({ news, recontact, reject, archive, copy, success, sended, delivered }));
        } else if (tx === "🔗Oqimlar") {
            const $streams = await streamModel.find({ seller: $user?.user?._id, active: true }).populate('product');
            sm(text.streams($streams))
        } else if (tx === "📨Aloqa") {
            sm(text.contacts)
        } else if (tx === "👤Profil") {
            sm(text.profile($user?.user?.id, $user?.user?.name, $user?.user?.phone), buttons.profile)
        } else {
            sm(text.menu, buttons.menu);
        }
    }
});
bot.on('callback_query', async msg => {
    const { id } = msg.from;
    const data = msg.callbackQuery.data;
    // 
    function sm(txt, btn = buttons?.menu) {
        msg.editMessageText(txt, { ...btn, parse_mode: "HTML" }).catch(() => { });
    }
    // 
    const $user = await telegramModel.findOne({ telegram: id }).populate('user');
    if (!$user) {
        new telegramModel({
            telegram: id,
        }).save().then(() => {
            sm(text.new_user(id), buttons.new_user);
        }).catch(() => { });
    } else if ($user?.user?.block) {
        sm(text.block);
    } else if ($user?.user?.admin) {
        // ADMIN PANEL
    } else if ($user?.user?.seller) {
        if (data?.startsWith('stat_')) {
            const type = data.split('_')[1];
            // GETTING DATE
            function getDate() {
                const d = new Date();
                if (type === 'today') {
                    return {
                        day: d.getDate(),
                        month: d.getMonth(),
                        year: d.getFullYear()
                    }
                } else if (type === 'yesterday') {
                    return {
                        day: d.getDate() - 1,
                        month: d.getMonth(),
                        year: d.getFullYear()
                    }
                } else if (type === 'week') {
                    return {
                        year: d.getFullYear(),
                        week: moment().week()
                    }
                } else if (type === 'lastweek') {
                    return {
                        year: d.getFullYear(),
                        week: moment().week() - 1
                    }
                } else if (type === 'month') {
                    return {
                        year: d.getFullYear(),
                        month: d.getMonth(),
                    }
                } else if (type === 'lastmonth') {
                    return {
                        year: d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear(),
                        month: d.getMonth() === 0 ? 11 : (d.getMonth() - 1),
                    }
                } else if (type === 'year') {
                    return {
                        year: d.getFullYear(),
                    }
                } else if (type === 'total') {
                    return {}
                }
            }
            function getTitle() {
                const d = new Date();
                if (type === 'today') {
                    return "Kunlik"
                } else if (type === 'yesterday') {
                    return "Kechagi"
                } else if (type === 'week') {
                    return "Haftalik"
                } else if (type === 'lastweek') {
                    return "O'tgan haftalik"
                } else if (type === 'month') {
                    return "Oylik"
                } else if (type === 'lastmonth') {
                    return "O'tgan oylik"
                } else if (type === 'year') {
                    return "Yillik"
                } else if (type === 'total') {
                    return "Umumiy"
                }
            }
            // 
            const news = await orderModel.find({ status: 'new', ...getDate(), seller: $user?.user?._id })?.countDocuments();
            const recontact = await orderModel.find({ status: 'recontact', ...getDate(), seller: $user?.user?._id })?.countDocuments();
            const copy = await orderModel.find({ status: 'copy', ...getDate(), seller: $user?.user?._id })?.countDocuments();
            const reject = await orderModel.find({ status: 'reject', ...getDate(), seller: $user?.user?._id })?.countDocuments();
            const archive = await orderModel.find({ status: 'archive', ...getDate(), seller: $user?.user?._id })?.countDocuments();
            const success = await orderModel.find({ status: 'success', ...getDate(), seller: $user?.user?._id })?.countDocuments();
            const sended = await orderModel.find({ status: 'sended', ...getDate(), seller: $user?.user?._id });
            const delivered = await orderModel.find({ status: 'delivered', ...getDate(), seller: $user?.user?._id });
            // calculate
            let hold_profit = 0;
            let profit = 0;

            delivered?.forEach((o) => {
                profit += o?.for_seller;
            });
            sended?.forEach((o) => {
                hold_profit += o?.for_seller;
            });

            sm(text?.statistics({ news, recontact, copy, reject, archive, success, sended: sended?.length, delivered: delivered?.length, hold_profit, profit }, getTitle()), buttons?.statistics)
        } else if (data?.startsWith('set_')) {
            const type = data.split('_')[1];
            function setSettings(type) {
                if (type === 'new') {
                    $user.new = !$user.new
                } else if (type === 'recontact') {
                    $user.recontact = !$user.recontact
                } else if (type === 'reject') {
                    $user.reject = !$user.reject
                } else if (type === 'archive') {
                    $user.archive = !$user.archive
                } else if (type === 'copy') {
                    $user.copy = !$user.copy
                } else if (type === 'success') {
                    $user.success = !$user.success
                } else if (type === 'sended') {
                    $user.sended = !$user.sended
                } else if (type === 'delivered') {
                    $user.delivered = !$user.delivered
                }
                return $user.save();
            }
            setSettings(type).then(($saved) => {
                sm(text.settings({ ...$saved._doc, news: $saved?.new }), buttons.settings({ ...$saved._doc, news: $saved?.new }));
            }).catch((err) => { console.log(err) });
        } if (data?.startsWith('profile_')) {
            const type = data.split('_')[1];
            if (type === 'unlink') {
                $user.user = null;
                $user.save().then(() => {
                    msg.editMessageReplyMarkup([]).catch(() => { });
                    sm(text.new_user(id, msg?.from?.first_name), buttons.new_user)
                })

            }
        }
    }
})
module.exports = bot;