const paymentModel = require("../models/payment.model");
const { SERVER_LINK } = require("../configs/env.config");
const moment = require("moment");
const fillModel = require("../models/fill.model");
const orderModel = require("../models/order.model");
const telegramModel = require("../models/telegram.model");
const bot = require("../bot/bot");
const text = require("../bot/text");
const userModel = require("../models/user.model");
module.exports = {
    getNavbar: async (req, res) => {
        try {
            const new_orders = await orderModel.find({ status: 'new', operator: null }).countDocuments();
            const my_orders = await orderModel.find({ status: 'new', operator: req?.user?._id }).countDocuments();
            const recontacts = await orderModel.find({ status: 'recontact', operator: req?.user?._id }).countDocuments();
            const success = await orderModel.find({ status: 'success', operator: req?.user?._id }).countDocuments();
            const delivereds = await orderModel.find({ status: 'delivered', operator: req?.user?._id, verified: true }).countDocuments();
            const rejecteds = await orderModel.find({ status: 'sended', operator: req?.user?._id, operator_verified: false, courier_status: 'reject' }).countDocuments();
            const archiveds = await orderModel.find({ status: 'archive', operator: req?.user?._id }).countDocuments();
            const sendeds = await orderModel.find({ status: 'sended', operator: req?.user?._id }).countDocuments();
            res.send({
                ok: true,
                data: {
                    new_orders,
                    my_orders,
                    recontacts,
                    success,
                    delivereds,
                    rejecteds,
                    archiveds,
                    sendeds
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
    getDashboard: async (req, res) => {
        try {
            const my_orders = await orderModel.find({ status: 'new', operator: req?.user?._id }).countDocuments();
            const recontacts = await orderModel.find({ status: 'recontact', operator: req?.user?._id }).countDocuments();
            const archiveds = await orderModel.find({ status: 'archive', operator: req?.user?._id }).countDocuments();
            const rejecteds = await orderModel.find({courier_status: 'reject', operator_verified: false, operator: req?.user?._id }).countDocuments();
            const success = await orderModel.find({ status: 'success', operator: req?.user?._id }).countDocuments();
            const $sendeds = await orderModel.find({ status: 'sended', operator: req?.user?._id });
            const $delivereds = await orderModel.find({ status: 'delivered', operator: req?.user?._id });
            const sendeds = $sendeds?.length;
            const delivereds = $delivereds?.length;
            // 
            let comming_balance = 0
            let balance = 0
            let payments = 0
            let comming_payments = 0
            // 
            const $payments = await paymentModel.find({ user: req?.user?._id, status: 'success', type: 'operator' });
            const $comming_payments = await paymentModel.find({ user: req?.user?._id, status: 'pending', type: 'operator' });
            // 
            $sendeds?.forEach(o => {
                comming_balance += o?.for_operator || 0;
            });
            $delivereds?.forEach(o => {
                balance += o?.for_operator || 0;
            });
            $payments?.forEach(o => {
                payments += o?.value || 0;
            });
            $comming_payments?.forEach(o => {
                comming_payments += o?.value || 0;
            });
            res.send({
                ok: true,
                data: {
                    my_orders,
                    recontacts,
                    archiveds,
                    rejecteds,
                    success,
                    comming_balance,
                    balance: balance - (comming_payments + payments),
                    payments,
                    comming_payments,
                    sendeds,
                    delivereds
                }
            });
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
            const $payments = await paymentModel.find({ user: req?.user?._id, type: 'operator' });
            const $orders = await orderModel.find({ operator: req?.user?._id, status: 'delivered' });
            let balance = 0;
            $orders?.forEach(o => {
                balance += o?.for_operator || 0;
            });
            $payments?.forEach(o => {
                if (o?.status === 'success' || o?.status === 'pending') {
                    balance -= o?.value || 0;
                }
            });
            res.send({
                ok: true,
                balance
            });
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
                const $lastPay = await paymentModel.findOne({ user: req?.user?._id, type: 'operator', status: 'pending' });
                if ($lastPay) {
                    res.send({
                        ok: false,
                        msg: `Sizda ${$lastPay?.value?.toLocaleString()} so'm miqdorda tekshiruvdagi to'lov mavjud! Iltimos tekshiruv tugashini kuting!`
                    });
                } else {
                    const delivered = await orderModel.find({ operator: req?.user?._id, status: 'delivered' });
                    const payments = await paymentModel.find({ user: req?.user?._id, status: 'success', type: 'operator' });
                    let balance = 0;
                    delivered?.forEach(d => {
                        balance += d?.for_operator || 0;
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
                            type: 'operator',
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
    // ORDERS
    getMyOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ operator: req?.user?._id, status: 'new' }).populate('product');
            const data = [];
            for (let o of $orders) {
                const $ordrs = await orderModel.find({ product: o?.product?._id }).populate('product');
                const $fill = await fillModel.find({ product: o?.product?._id });
                let value = 0;
                $ordrs?.forEach(ord => {
                    if (ord?.status === 'success' || ord?.status === 'sended' || ord?.status === 'delivered') {
                        value -= ord?.value;
                    }
                });
                $fill?.forEach(f => {
                    value += f?.value;
                });
                const history = [];
                $ordrs?.filter(ord => ord?.phone === o?.phone && ord?.id !== o?.id)?.forEach(ord => {
                    history.unshift({
                        id: ord?.id,
                        name: ord?.name,
                        phone: ord?.phone,
                        created: moment.unix(ord?.created)?.format('DD.MM.YYYY | HH:mm'),
                        value: ord?.value,
                        product: ord?.product?.title,
                        status: ord?.status,
                        price: ord?.price,
                        delivery_price: ord?.delivery_price,
                    });
                });
                data.push({
                    _id: o?._id,
                    id: o?.id,
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    for_operator: `~ ${o?.for_operator?.toLocaleString()} so'm`,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    created: moment.unix(o?.created)?.format('DD.MM.YYYY | HH:mm'),
                    product: {
                        title: o?.product?.title,
                        images: [...o?.product?.images?.map(img => SERVER_LINK + img)],
                        main_image: o?.product?.main_image,
                        about: o?.product?.about,
                        value
                    },
                    history,
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
    getNewOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ operator: null, status: 'new' }).populate('product');
            const data = [];
            const $operator = await userModel.findById(req?.user?._id);
            for (let o of $orders) {
                const $ordrs = await orderModel.find({ product: o?.product?._id }).populate('product');
                const $fill = await fillModel.find({ product: o?.product?._id });
                let value = 0;
                $ordrs?.forEach(ord => {
                    if (ord?.status === 'success' || ord?.status === 'sended' || ord?.status === 'delivered') {
                        value -= ord?.value;
                    }
                });
                $fill?.forEach(f => {
                    value += f?.value;
                });
                data.push({
                    _id: o?._id,
                    id: o?.id,
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    created: o?.created,
                    for_operator: `~ ${o?.for_operator?.toLocaleString()} so'm`,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    created: moment.unix(o?.created)?.format('DD.MM.YYYY | HH:mm'),
                    product: {
                        title: o?.product?.title,
                        images: [...o?.product?.images?.map(img => SERVER_LINK + img)],
                        main_image: o?.product?.main_image,
                        about: o?.product?.about,
                        value
                    },
                });
            }
            res.send({
                ok: true,
                data,
                operator_freedom: $operator?.operator_freedom
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    takeOrder: async (req, res) => {
        const { _id } = req?.params;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "Buyurtma topilmadi!"
            });
        } else {
            try {
                const $order = await orderModel.findById(_id);
                if (!$order) {
                    res.send({
                        ok: false,
                        msg: "Buyurtma topilmadi!"
                    })
                } else if ($order?.operator) {
                    res.send({
                        ok: false,
                        msg: "Buyurtma boshqa operatorga biriktirildi!",
                        owned: true
                    });
                } else {
                    const $orders = await orderModel.find({ operator: req?.user?._id, status: 'new' })?.countDocuments();
                    if ($orders >= 3) {
                        res.send({
                            ok: false,
                            msg: "Sizda 3 ta yangi buyurtma mavjud"
                        });
                    } else {
                        $order.set({ operator: req?.user?._id }).save().then(async () => {
                            res.send({
                                ok: true,
                                msg: "Buyurtma olindi! yana " + ((3 - 1) - $orders) + " ta yangi buyurtma olish mumkin!",
                                owned: true
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
    getRecontactOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ operator: req?.user?._id, status: 'recontact' }).populate('product');
            const data = [];
            for (let o of $orders) {
                const $ordrs = await orderModel.find({ product: o?.product?._id }).populate('product');
                const $fill = await fillModel.find({ product: o?.product?._id });
                let value = 0;
                $ordrs?.forEach(ord => {
                    if (ord?.status === 'success' || ord?.status === 'sended' || ord?.status === 'delivered') {
                        value -= ord?.value;
                    }
                });
                $fill?.forEach(f => {
                    value += f?.value;
                });
                const history = [];
                $ordrs?.filter(ord => ord?.phone === o?.phone && ord?.id !== o?.id)?.forEach(ord => {
                    history.unshift({
                        id: ord?.id,
                        name: ord?.name,
                        phone: ord?.phone,
                        created: ord?.created,
                        value: ord?.value,
                        product: ord?.product?.title,
                        status: ord?.status
                    });
                });
                data.push({
                    _id: o?._id,
                    id: o?.id,
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    created: o?.created,
                    for_operator: `~ ${o?.for_operator?.toLocaleString()} so'm`,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    comment: o?.comment,
                    created: moment.unix(o?.created)?.format('DD.MM.YYYY | HH:mm'),
                    up_time: moment.unix(o?.up_time)?.format('DD.MM.YYYY | HH:mm'),
                    product: {
                        title: o?.product?.title,
                        images: [...o?.product?.images?.map(img => SERVER_LINK + img)],
                        main_image: o?.product?.main_image,
                        about: o?.product?.about,
                        value
                    },
                    history,
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
    getSuccessOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ operator: req?.user?._id, status: 'success' }).populate('product');
            const data = [];
            $orders?.forEach(o => {
                data.push({
                    _id: o?._id,
                    id: o?.id,
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    region: o?.region,
                    city: o?.city,
                    created: o?.created,
                    for_operator: `~ ${o?.for_operator?.toLocaleString()} so'm`,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    comment: o?.comment,
                    created: moment.unix(o?.created)?.format('DD.MM.YYYY | HH:mm'),
                    up_time: moment.unix(o?.up_time)?.format('DD.MM.YYYY | HH:mm'),
                    product: {
                        title: o?.product?.title,
                        images: [...o?.product?.images?.map(img => SERVER_LINK + img)],
                        main_image: o?.product?.main_image,
                        about: o?.product?.about,
                    },
                });
            });
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
    getSendedOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ operator: req?.user?._id, status: 'sended' }).populate('product');
            const data = [];
            $orders?.forEach(o => {
                data.push({
                    _id: o?._id,
                    id: o?.id,
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    region: o?.region,
                    city: o?.city,
                    created: o?.created,
                    for_operator: `~ ${o?.for_operator?.toLocaleString()} so'm`,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    comment: o?.comment,
                    created: moment.unix(o?.created)?.format('DD.MM.YYYY | HH:mm'),
                    up_time: moment.unix(o?.up_time)?.format('DD.MM.YYYY | HH:mm'),
                    product: {
                        title: o?.product?.title,
                        images: [...o?.product?.images?.map(img => SERVER_LINK + img)],
                        main_image: o?.product?.main_image,
                        about: o?.product?.about,
                    },
                });
            });
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
    getRejectedOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ operator: req?.user?._id, courier_status: 'reject', operator_verified: false }).populate('product');
            const data = [];
            $orders?.forEach(o => {
                data.push({
                    _id: o?._id,
                    id: o?.id,
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    region: o?.region,
                    city: o?.city,
                    created: o?.created,
                    for_operator: `${o?.for_operator?.toLocaleString()} so'm`,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    comment: o?.comment,
                    created: moment.unix(o?.created)?.format('DD.MM.YYYY | HH:mm'),
                    up_time: moment.unix(o?.up_time)?.format('DD.MM.YYYY | HH:mm'),
                    product: {
                        title: o?.product?.title,
                        images: [...o?.product?.images?.map(img => SERVER_LINK + img)],
                        main_image: o?.product?.main_image,
                        about: o?.product?.about,
                    },
                });
            });
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
    // UPDATE STATUS
    setStatusSuccess: async (req, res) => {
        const { _id, name, value, price, delivery_price, comment, region, city } = req?.body;
        if (!_id || !name || !value || !price || !delivery_price || !comment || !region || !city) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (isNaN(value) || value < 1) {
            res.send({
                ok: false,
                msg: "Kamida 1 ta mahsulot soni yozilsin!"
            });
        } else if (isNaN(price) || price < 1) {
            res.send({
                ok: false,
                msg: "Narxni to'g'ri kiriting!"
            });
        } else if (isNaN(delivery_price) || delivery_price < 0) {
            res.send({
                ok: false,
                msg: "Yetkazib berish narxini to'g'ri kiriting!"
            });
        } else {
            try {
                const $order = await orderModel.findById(_id).populate('stream product');
                if (!$order) {
                    res.send({
                        ok: false,
                        msg: "Buyurtma topilmadi!"
                    })
                } else {
                    const $ordrs = await orderModel.find({ product: $order?.product?._id }).populate('product');
                    const $fill = await fillModel.find({ product: $order?.product?._id });
                    let basevalue = 0;
                    $ordrs?.forEach(ord => {
                        if (ord?.status === 'success' || ord?.status === 'sended' || ord?.status === 'delivered') {
                            basevalue -= ord?.value;
                        }
                    });
                    $fill?.forEach(f => {
                        basevalue += f?.value;
                    });
                    if (basevalue < value) {
                        res.send({
                            ok: false,
                            msg: "Mahsulot omborda qolmagan iltimos buyurtmani qayta aloqalarga o'tkazing!"
                        });
                    } else {
                        $order.set({ status: 'success', name, value, price, delivery_price, comment, region, city, up_time: moment.now() / 1000 }).save().then(async () => {
                            res.send({
                                ok: true,
                                msg: "Qadoqlashga yuborildi!"
                            });
                            const $tg = await telegramModel.findOne({ user: $order?.seller });
                            if ($tg && $tg?.success) {
                                bot.telegram.sendMessage($tg?.telegram, text['success']($order?.id, $order?.phone, $order?.product?.title, $order?.stream?.title), { parse_mode: 'HTML' }).catch(err => {
                                    console.log(err);
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            res.send({
                                ok: false,
                                msg: "Xatolik!"
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
    setStatusRecontact: async (req, res) => {
        const { _id, comment } = req?.body;
        if (!_id || !comment) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $order = await orderModel.findById(_id).populate('stream product');
                if (!$order) {
                    res.send({
                        ok: false,
                        msg: "Buyurtma topilmadi!"
                    })
                } else {
                    $order.set({ status: 'recontact', comment, up_time: moment.now() / 1000 }).save().then(async () => {
                        res.send({
                            ok: true,
                            msg: "Qayta aloqaga o'tkazildi!"
                        });
                        const $tg = await telegramModel.findOne({ user: $order?.seller });
                        if ($tg && $tg?.recontact) {
                            bot.telegram.sendMessage($tg?.telegram, text['recontact']($order?.id, $order?.phone, $order?.product?.title, $order?.stream?.title), { parse_mode: 'HTML' }).catch(err => {
                                console.log(err);
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Xatolik!"
                        })
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
    setStatusArchive: async (req, res) => {
        const { _id, comment } = req?.body;
        if (!_id || !comment) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $order = await orderModel.findById(_id).populate('stream product');
                if (!$order) {
                    res.send({
                        ok: false,
                        msg: "Buyurtma topilmadi!"
                    })
                } else {
                    $order.set({ status: 'archive', comment, up_time: moment.now() / 1000 }).save().then(async () => {
                        res.send({
                            ok: true,
                            msg: "Arxivlandi!"
                        });
                        const $tg = await telegramModel.findOne({ user: $order?.seller });
                        if ($tg && $tg?.archive) {
                            bot.telegram.sendMessage($tg?.telegram, text['archive']($order?.id, $order?.phone, $order?.product?.title, $order?.stream?.title), { parse_mode: 'HTML' }).catch(err => {
                                console.log(err);
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Xatolik!"
                        })
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
    setStatusCopy: async (req, res) => {
        const { _id, comment } = req?.body;
        if (!_id || !comment) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $order = await orderModel.findById(_id).populate('stream product');
                if (!$order) {
                    res.send({
                        ok: false,
                        msg: "Buyurtma topilmadi!"
                    })
                } else {
                    $order.set({ status: 'copy', comment, up_time: moment.now() / 1000 }).save().then(async () => {
                        res.send({
                            ok: true,
                            msg: "Arxivlandi!"
                        });
                        const $tg = await telegramModel.findOne({ user: $order?.seller });
                        if ($tg && $tg?.copy) {
                            bot.telegram.sendMessage($tg?.telegram, text['copy']($order?.id, $order?.phone, $order?.product?.title, $order?.stream?.title), { parse_mode: 'HTML' }).catch(err => {
                                console.log(err);
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Xatolik!"
                        })
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
    // UPDATE COURIER STATUS & OPERATOR VERIFIED
    setStatusRejectedOrder: async (req, res) => {
        const { _id, comment, status } = req?.body;
        if (!_id || !comment || !status) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $order = await orderModel.findById(_id);
                $order.set({ comment, courier_status: status, up_time: moment.now() / 1000, operator_verified: true }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Taxrirlandi!"
                    });
                })
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