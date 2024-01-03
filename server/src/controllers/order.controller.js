const { SERVER_LINK } = require("../configs/env.config");
const fillModel = require("../models/fill.model");
const orderModel = require("../models/order.model");
const streamModel = require("../models/stream.model");
const { phone: ph } = require('phone');
const moment = require('moment');
const telegramModel = require("../models/telegram.model");
const bot = require("../bot/bot");
const { new_order } = require("../bot/text");
const productModel = require("../models/product.model");
module.exports = {
    getStream: async (req, res) => {
        const { id } = req?.params;
        if (!id || isNaN(id) || id < 1) {
            res.send({
                ok: false,
                msg: "Id topilmadi!"
            });
        } else {
            try {
                const s = await streamModel.findOne({ id }).populate({
                    path: 'product',
                    populate: {
                        path: 'category',
                    }
                });
                if (!s || !s?.product?.active) {
                    res.send({
                        ok: false,
                        msg: "Mahsulot mavjud emas!"
                    });
                } else {
                    const { product: p } = s;
                    const $fill = await fillModel.find({ product: p?._id });
                    const $new = await orderModel.find({ product: p?._id, status: 'new' });
                    const $success = await orderModel.find({ product: p?._id, status: 'success' });
                    const $sended = await orderModel.find({ product: p?._id, status: 'sended' });
                    const $delivered = await orderModel.find({ product: p?._id, status: 'delivered' });
                    // 
                    let value = 0;
                    let solded = 0;
                    // 
                    $fill.forEach(f => {
                        value += f?.value || 0;
                    });
                    $new?.forEach((o => {
                        solded += o?.value || 0;
                    }));
                    $success?.forEach((o => {
                        solded += o?.value || 0;
                    }));
                    $sended?.forEach((o => {
                        solded += o?.value || 0;
                    }));
                    $delivered?.forEach((o => {
                        solded += o?.value || 0;
                    }));
                    // 
                    res.send({
                        ok: true,
                        data: {
                            _id: s?._id,
                            title: p?.title,
                            about: p?.about,
                            images: [...p?.images?.map(i => SERVER_LINK + i)],
                            video: SERVER_LINK + p?.video,
                            main_image: p?.main_image,
                            price: p?.price + s?.additional,
                            category: p?.category?.title,
                            value: value - solded,
                            delivery_price: p?.delivery_price
                        }
                    });
                    s.set({ views: s?.views + 1 }).save().catch(() => { });
                    p.set({ views: p?.views + 1 }).save().catch(() => { });
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    createOrder: async (req, res) => {
        const { _id, name, phone } = req?.body;
        if (!_id || !name || !phone) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (name?.length < 3) {
            res.send({
                ok: false,
                msg: "Ismingizni to'g'ri kiriting!"
            });
        } else if (!ph(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Telefon raqamingizni to'g'ri kiriting!"
            });
        } else {
            try {
                const $orders = await orderModel.find({ phone: ph(phone, { country: 'uz' }).phoneNumber, status: 'new' }).populate('product');
                const s = await streamModel.findById(_id).populate('product');
                const { product: p } = s;
                // CHEKING
                if ($orders[0] && (($orders?.reverse()[0].created + 300) > (moment.now() / 1000)) && ($orders?.reverse()[0]?.product.id === p.id)) {
                    res.send({
                        ok: false,
                        msg: "Siz ushbu mahsulotga so'ngi 5 daqiqa ichida buyurtma bergansiz! Operator javobini kuting!"
                    });
                } else {
                    const id = await orderModel.find().countDocuments() + 1;
                    new orderModel({
                        id,
                        title: p?.title,
                        phone: ph(phone, { country: 'uz' }).phoneNumber,
                        name,
                        product: p?._id,
                        price: p?.price + s?.additional,
                        for_seller: s?.active ? p?.for_seller + s?.additional : 0,
                        seller: s?.active ? s?.seller : null,
                        supplier: p?.supplier,
                        for_supplier: p?.for_supplier,
                        for_operator: p?.for_operator,
                        delivery_price: p?.delivery_price,
                        comission: s?.active ? p?.comission : p?.comission + (p?.for_seller + s?.additional),
                        stream: s?.active ? s?._id : null,
                        day: new Date().getDate(),
                        month: new Date().getMonth(),
                        week: moment().week(),
                        year: new Date().getFullYear(),
                        created: moment.now() / 1000,
                        up_time: moment.now() / 1000
                    }).save().then(async ($o) => {
                        res.send({
                            ok: true,
                            msg: "Buyurtmangiz qabul qilindi!"
                        });
                        const $tg = await telegramModel.findOne({ user: s?.seller });
                        if ($tg && $tg?.new && s?.active) {
                            bot.telegram.sendMessage($tg?.telegram, new_order($o?.id, $o?.phone, p?.title, s?.title), { parse_mode: 'HTML' }).catch(err => {
                                console.log(err);
                            });
                        }
                    })
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    createOrderNoStream: async (req, res) => {
        const { _id, name, phone } = req?.body;
        if (!_id || !name || !phone) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (name?.length < 3) {
            res.send({
                ok: false,
                msg: "Ismingizni to'g'ri kiriting!"
            });
        } else if (!ph(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Telefon raqamingizni to'g'ri kiriting!"
            });
        } else {
            try {
                const $orders = await orderModel.find({ phone: ph(phone, { country: 'uz' }).phoneNumber, status: 'new' }).populate('product');
                const p = await productModel.findById(_id)
                // CHEKING
                if ($orders[0] && (($orders?.reverse()[0].created + 300) > (moment.now() / 1000)) && ($orders?.reverse()[0]?.product.id === p.id)) {
                    res.send({
                        ok: false,
                        msg: "Siz ushbu mahsulotga so'ngi 5 daqiqa ichida buyurtma bergansiz! Operator javobini kuting!"
                    });
                } else {
                    const id = await orderModel.find().countDocuments() + 1;
                    new orderModel({
                        id,
                        title: p?.title,
                        phone: ph(phone, { country: 'uz' }).phoneNumber,
                        name,
                        product: p?._id,
                        price: p?.price,
                        for_seller: 0,
                        seller: null,
                        supplier: p?.supplier,
                        for_supplier: p?.for_supplier,
                        for_operator: p?.for_operator,
                        delivery_price: p?.delivery_price,
                        comission: p?.comission + p?.for_seller,
                        stream: null,
                        day: new Date().getDate(),
                        month: new Date().getMonth(),
                        week: moment().week(),
                        year: new Date().getFullYear(),
                        created: moment.now() / 1000,
                        up_time: moment.now() / 1000
                    }).save().then(async ($o) => {
                        res.send({
                            ok: true,
                            msg: "Buyurtmangiz qabul qilindi!"
                        });
                    })
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    }
}