const { SERVER_LINK } = require("../configs/env.config");
const categoryModel = require("../models/category.model");
const fillModel = require("../models/fill.model");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");
const productModel = require("../models/product.model");
const moment = require('moment');
const streamModel = require("../models/stream.model");
const telegramModel = require("../models/telegram.model");
const bot = require("../bot/bot");
const path = require('path');
const userModel = require("../models/user.model");
module.exports = {
    getDashboard: async (req, res) => {
        try {
            const sended = await orderModel.find({ seller: req?.user?._id, status: 'sended' });
            const delivered = await orderModel.find({ seller: req?.user?._id, status: 'delivered' });
            const payments = await paymentModel.find({ user: req?.user?._id, type: 'seller' });
            // 
            let payment = 0;
            let comming_payment = 0;
            let hold_balance = 0;
            let balance = 0;
            // 
            sended?.forEach(s => {
                hold_balance += s?.for_seller || 0;
            });
            delivered?.forEach(d => {
                balance += d?.for_seller || 0;
            });
            payments?.forEach(p => {
                if (p?.status === 'success') {
                    payment += p?.value || 0;
                } else if (p?.status === 'pending') {
                    comming_payment += p?.value || 0;
                }
            });
            res.send({
                ok: true,
                data: {
                    sended: sended?.length,
                    delivered: delivered?.length,
                    payment,
                    hold_balance,
                    balance: balance - (payment + comming_payment),
                    comming_payment
                }
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getMarket: async (req, res) => {
        try {
            const $categories = await categoryModel.find({ active: true });
            const $products = await productModel.find({ active: true, verified: true })?.populate('supplier');
            const categories = [];
            const products = [];
            // MAPPING CATEGORIES
            $categories?.forEach(c => {
                categories.push({
                    _id: c?._id,
                    title: c?.title,
                    image: SERVER_LINK + c?.image,
                    color: c?.color,
                });
            });
            // MAPPING PRODUCTS
            for (let p of $products) {
                let value = 0;
                let solded = 0;
                const new_orders = await orderModel.find({ status: 'new', product: p?._id });
                const success = await orderModel.find({ status: 'success', product: p?._id });
                const sended = await orderModel.find({ status: 'sended', product: p?._id });
                const delivered = await orderModel.find({ status: 'delivered', product: p?._id });
                // 
                new_orders?.forEach(o => {
                    solded += o.value
                });
                success?.forEach(o => {
                    solded += o.value;
                });
                sended?.forEach(o => {
                    solded += o.value;
                });
                delivered?.forEach(o => {
                    solded += o.value;
                });
                const fill = await fillModel.find({ product: p?._id });
                fill?.forEach(f => {
                    value += f.value
                });
                // MAPPING
                products.unshift({
                    id: p.id,
                    _id: p?._id,
                    title: p.title,
                    price: p.price,
                    for_seller: p.for_seller,
                    category: p.category,
                    image: SERVER_LINK + (p.images[p?.main_image] || p.images[0]),
                    // 
                    value: value - solded,
                    supplier: {
                        id: p.supplier?.id,
                        name: p.supplier.name,
                    }
                });
            }
            res.send({
                ok: true,
                categories,
                products
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    createStream: async (req, res) => {
        const { _id, title, additional } = req?.body;
        if (!_id) {
            res.send({
                ok: false,
                msg: "ID topilmadi!"
            });
        } else {
            try {
                const $product = await productModel.findById(_id);
                if (!$product) {
                    res.send({
                        ok: false,
                        msg: "Mahsulot topilmadi!"
                    });
                } else {
                    const id = await streamModel.find().countDocuments() + 1;
                    new streamModel({
                        id,
                        title,
                        product: _id,
                        seller: req?.user?._id,
                        additional: additional || 0,
                        created: moment.now() / 1000,
                    }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Oqim ochildi"
                        });
                    });
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
    getStreams: async (req, res) => {
        try {
            const $streams = await streamModel.find({ seller: req?.user?._id, active: true }).populate('product');
            const data = [];
            for (let s of $streams) {
                let value = 0;
                let solded = 0;
                const new_orders = await orderModel.find({ status: 'new', product: s?.product?._id });
                const success = await orderModel.find({ status: 'success', product: s?.product?._id });
                const sended = await orderModel.find({ status: 'sended', product: s?.product?._id });
                const delivered = await orderModel.find({ status: 'delivered', product: s?.product?._id });
                // 
                new_orders?.forEach(o => {
                    solded += o.value
                });
                success?.forEach(o => {
                    solded += o.value;
                });
                sended?.forEach(o => {
                    solded += o.value;
                });
                delivered?.forEach(o => {
                    solded += o.value;
                });
                const fill = await fillModel.find({ product: s?.product?._id });
                fill?.forEach(f => {
                    value += f.value
                });
                data.unshift({
                    id: s?.id,
                    _id: s?._id,
                    title: s?.title,
                    product: s?.product?.title,
                    image: SERVER_LINK + (s?.product?.images[s?.product?.main_image] || s?.product?.images[0]),
                    price: s?.product?.price + s?.additional,
                    for_seller: s?.product?.for_seller + s?.additional,
                    created: moment.unix(s?.created).format('DD.MM.YYYY | HH:mm'),
                    value: value - solded
                });
            }
            res.send({
                ok: true,
                data
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    deleteStream: async (req, res) => {
        const { _id } = req?.params;
        if (!_id) {
            res.send({
                ok: false,
                msg: "ID topilmadi!"
            });
        } else {
            try {
                const $stream = await streamModel.findById(_id);
                if (!$stream) {
                    res.send({
                        ok: false,
                        msg: "Oqim topilmadi!"
                    });
                } else {
                    $stream.set({ active: false }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Oqim o'chirildi"
                        });
                    });
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
    setTelegram: async (req, res) => {
        const { telegram } = req?.body;
        try {
            const $telegram = await telegramModel.findOne({ telegram });
            if (!$telegram) {
                res.send({
                    ok: false,
                    msg: "Ushbu ID egasi telegram botga start bosmagan!"
                });
            } else if ($telegram?.user && $telegram?.user?._id !== req?.user?._id) {
                res.send({
                    ok: false,
                    msg: "Ushbu telegram ID boshqa foydalanuvchiga tegishli!"
                });
            } else {
                const $old = await telegramModel.findOne({ user: req?.user?._id });
                if ($old) {
                    $old.set({ user: null }).save();
                }
                $telegram.set({ user: req?.user?._id }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Telegram bot biriktirildi!"
                    });
                    bot.telegram.sendMessage(telegram, "✅Profilingiz botga biriktirildi!", {
                        reply_markup: {
                            keyboard: [
                                [{ text: "✅Tushunarli" }],
                            ],
                            resize_keyboard: true,
                        }
                    })
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getCreative: async (req, res) => {
        const { _id } = req?.params;
        if (!_id) {
            res.send({
                ok: false,
                msg: "ID topilmadi!"
            });
        } else {
            try {
                const $tg = await telegramModel.findOne({ user: req?.user?._id });
                if (!$tg) {
                    res.send({
                        ok: false,
                        msg: "Siz telegram botga ulanmagansiz!"
                    });
                } else {
                    const $stream = await streamModel.findById(_id).populate('product');
                    if (!$stream) {
                        res.send({
                            ok: false,
                            msg: "Mahsulot topilmadi!"
                        });
                    } else if (!$stream?.product?.video) {
                        res.send({
                            ok: false,
                            msg: "Video topilmadi!"
                        });
                    } else {

                        bot.telegram.sendVideo($tg?.telegram, { source: path?.join(__dirname, '../../', `${$stream?.product?.video}`) }, {
                            caption: `${$stream?.product?.title}\n\n${$stream?.product?.about}`, reply_markup: {
                                inline_keyboard: [
                                    [{ text: '🛒Sotib olish', url: `https://selly.uz/o/${$stream?.id}` }],
                                    [{ text: '📋Batafsil', url: `https://selly.uz/o/${$stream?.id}` }]
                                ]
                            },
                        }).then(() => {
                            res.send({
                                ok: true,
                                msg: "Telegramdan yuborildi!"
                            });
                        }).catch(err => {
                            console.log(err);
                            res.send({
                                ok: false,
                                msg: "Yuborishda xatolik!"
                            })
                        })
                    }
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
    getStats: async (req, res) => {
        try {
            const $streams = await streamModel.find({ seller: req?.user?._id, active: true }).populate('product');
            const data = [];
            for (let s of $streams) {
                const news = await orderModel.find({ status: 'new', stream: s?._id }).countDocuments();
                const reject = await orderModel.find({ status: 'reject', stream: s?._id }).countDocuments();
                const copy = await orderModel.find({ status: 'copy', stream: s?._id }).countDocuments();
                const archive = await orderModel.find({ status: 'archive', stream: s?._id }).countDocuments();
                const recontact = await orderModel.find({ status: 'recontact', stream: s?._id }).countDocuments();
                const success = await orderModel.find({ status: 'success', stream: s?._id }).countDocuments();
                const sended = await orderModel.find({ status: 'sended', stream: s?._id });
                const delivered = await orderModel.find({ status: 'delivered', stream: s?._id });
                // 
                let profit = 0;
                let comming_profit = 0;
                sended?.forEach(o => {
                    comming_profit += o?.for_seller;
                });
                delivered?.forEach(o => {
                    profit += o?.for_seller;
                });
                data.unshift({
                    id: s?.id,
                    _id: s?._id,
                    title: s?.title,
                    product: s?.product?.title,
                    image: SERVER_LINK + (s?.product?.images[s?.product?.main_image] || s?.product?.images[0]),
                    price: s?.product?.price + s?.additional,
                    for_seller: s?.product?.for_seller + s?.additional,
                    created: moment.unix(s?.created).format('DD.MM.YYYY | HH:mm'),
                    news,
                    reject,
                    copy,
                    archive,
                    recontact,
                    success,
                    sended: sended?.length,
                    delivered: delivered?.length,
                    profit,
                    comming_profit,
                    views: s?.views
                });
            }
            res.send({
                ok: true,
                data
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getBalance: async (req, res) => {
        try {
            const delivered = await orderModel.find({ seller: req?.user?._id, status: 'delivered' });
            const payments = await paymentModel.find({ user: req?.user?._id, type: 'seller' });
            let balance = 0;
            delivered?.forEach(d => {
                balance += d?.for_seller || 0;
            });
            payments?.forEach(p => {
                if (p?.status == 'success' || p?.status == 'pending') {
                    balance -= p?.value || 0;
                }
            });
            res.send({
                ok: true,
                balance
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    createPayment: async (req, res) => {
        const { value, card } = req?.body;
        if (!value || isNaN(value) || isNaN(card) || card?.length !== 16) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring yoki to'g'ri son kiriting!"
            });
        } else if (value < 0) {
            re.send({
                ok: false,
                msg: "Yetarli mablag' mavjud emas!"
            });
        } else {
            try {
                const $lastPay = await paymentModel.findOne({ user: req?.user?._id, type: 'seller', status: 'pending' });
                if ($lastPay) {
                    res.send({
                        ok: false,
                        msg: `Sizda ${$lastPay?.value?.toLocaleString()} so'm miqdorda tekshiruvdagi to'lov mavjud! Iltimos tekshiruv tugashini kuting!`
                    });
                } else {
                    const delivered = await orderModel.find({ seller: req?.user?._id, status: 'delivered' });
                    const payments = await paymentModel.find({ user: req?.user?._id, status: 'success', type: 'seller' });
                    let balance = 0;
                    delivered?.forEach(d => {
                        balance += d?.for_seller || 0;
                    });
                    payments?.forEach(p => {
                        balance -= p?.value || 0;
                    });
                    // CHECKING
                    if (balance < 1) {
                        res.send({
                            ok: false,
                            msg: "Yetarli mablag' mavjud emas!"
                        })
                    } else {
                        const id = await paymentModel.find().countDocuments() + 1;
                        new paymentModel({
                            id,
                            user: req?.user?._id,
                            value,
                            type: 'seller',
                            created: moment.now() / 1000,
                            card
                        }).save().then(res.send({
                            ok: true,
                            msg: "So'rov tekshiruvga yuborildi!"
                        })).catch((err) => {
                            console.log(err);
                            res.send({
                                ok: false,
                                msg: "Chiqarib olishda xatolik!"
                            });
                        })
                    }
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
    getOrders: async (req, res) => {
        const { page } = req?.params;
        const limit = 50;
        const start = Number((page * limit) - limit);
        const end = Number(page * limit);
        try {
            const $orders = await orderModel.find({ seller: req?.user?._id }).populate('product stream');
            const data = [];
            $orders?.slice(start, end)?.forEach(o => {
                const for_seller = (o?.status === 'delivered') ? o?.for_seller?.toLocaleString() : (o?.status === 'success' || o?.status === 'recontact' || o?.status === 'new' || o?.status === 'sended') ? `~ ${o?.for_seller?.toLocaleString()}` : 0;
                data.unshift({
                    id: o?.id,
                    product: o?.product?.title,
                    for_seller,
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    status: o?.status,
                    phone: o?.phone?.slice(0, 10) + '***'
                });
            });
            res.send({
                ok: true,
                data,
                pages: Math.ceil($orders?.length / limit),
                total: $orders?.length
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        }
    },
    getMarketPlace: async (req, res) => {
        const { id } = req?.params;
        if (!id || isNaN(id) || id < 1) {
            res.send({
                ok: false,
                msg: "ID xato!"
            });
        } else {
            try {
                const $supplier = await userModel.findOne({ id, supplier: true });
                if (!$supplier) {
                    res.send({
                        ok: false,
                        msg: "Sahifa topilmadi!"
                    });
                } else {
                    const $products = await productModel.find({ supplier: $supplier?._id, active: true });
                    const data = [];
                    for (let p of $products) {
                        let value = 0;
                        let solded = 0;
                        const new_orders = await orderModel.find({ status: 'new', product: p?._id });
                        const success = await orderModel.find({ status: 'success', product: p?._id });
                        const sended = await orderModel.find({ status: 'sended', product: p?._id });
                        const delivered = await orderModel.find({ status: 'delivered', product: p?._id });
                        // 
                        new_orders?.forEach(o => {
                            solded += o.value
                        });
                        success?.forEach(o => {
                            solded += o.value;
                        });
                        sended?.forEach(o => {
                            solded += o.value;
                        });
                        delivered?.forEach(o => {
                            solded += o.value;
                        });
                        const fill = await fillModel.find({ product: p?._id });
                        fill?.forEach(f => {
                            value += f.value
                        });
                        // 
                        data.unshift({
                            id: p.id,
                            _id: p?._id,
                            title: p.title,
                            price: p.price,
                            for_seller: p.for_seller,
                            category: p.category,
                            image: SERVER_LINK + (p.images[p?.main_image] || p.images[0]),
                            // 
                            value: value - solded,
                        });
                    }
                    res.send({
                        ok: true,
                        data,
                        supplier: {
                            id: $supplier?.id,
                            products: $products?.length,
                            name: $supplier?.name,
                            created: moment.unix($supplier?.reg_time)?.format('DD.MM.YYYY | HH:mm')
                        }
                    });
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                });
            }
        }
    }
}