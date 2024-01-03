const { SERVER_LINK } = require("../configs/env.config");
const orderModel = require("../models/order.model");
const partyModel = require("../models/party.model");
const paymentModel = require("../models/payment.model");
const moment = require('moment');
module.exports = {
    getNavbar: async (req, res) => {
        try {
            const my_orders = await orderModel.find({ courier: req?.user?._id, courier_status: 'sended', verified: false }).countDocuments();
            const recontacts = await orderModel.find({ courier: req?.user?._id, courier_status: 'recontact', verified: false }).countDocuments();
            const delivereds = await orderModel.find({ courier: req?.user?._id, courier_status: 'delivered', verified: false }).countDocuments();
            const rejecteds = await orderModel.find({ courier: req?.user?._id, courier_status: 'reject', verified: false }).countDocuments();
            // 
            const parties = await partyModel.find({ courier: req?.user?._id })?.countDocuments();
            res.send({
                ok: true,
                data: {
                    my_orders,
                    recontacts,
                    delivereds,
                    rejecteds,
                    parties
                }
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        }
    },
    getDashboard: async (req, res) => {
        try {
            const my_orders = await orderModel.find({ courier_status: 'sended', status: 'sended', verified: false, courier: req?.user?._id });
            const recontacts = await orderModel.find({ courier_status: 'recontact', status: 'sended', verified: false, courier: req?.user?._id });
            const rejecteds = await orderModel.find({ courier_status: 'reject', verified: false, courier: req?.user?._id }).countDocuments();
            const $delivereds = await orderModel.find({ status: 'delivered', courier_status: 'delivered', verified: true, courier: req?.user?._id });
            // 
            const delivereds = await orderModel.find({ status: 'sended', courier_status: 'delivered', verified: false, courier: req?.user?._id });
            // 
            let comming_balance = 0
            let balance = 0
            let payments = 0
            let comming_payments = 0
            // 
            const $payments = await paymentModel.find({ user: req?.user?._id, status: 'success', type: 'courier' });
            const $comming_payments = await paymentModel.find({ user: req?.user?._id, status: 'pending', type: 'courier' });
            // 
            my_orders?.forEach(o => {
                comming_balance += o?.delivery_price || 0;
            });
            recontacts?.forEach(o => {
                comming_balance += o?.delivery_price || 0;
            });
            delivereds?.forEach(o => {
                comming_balance += o?.delivery_price || 0;
            });
            $delivereds?.forEach(o => {
                balance += o?.delivery_price || 0;
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
                    my_orders: my_orders?.length,
                    recontacts: recontacts?.length,
                    rejecteds,
                    delivereds: delivereds?.length,
                    comming_balance,
                    balance: balance - (comming_payments + payments),
                    payments,
                    comming_payments,

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
            const $payments = await paymentModel.find({ user: req?.user?._id, type: 'courier' });
            const $orders = await orderModel.find({ courier: req?.user?._id, status: 'delivered', verified: true, courier_status: 'delivered' });
            let balance = 0;
            $orders?.forEach(o => {
                balance += o?.delivery_price || 0;
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
        } else if (value < 1) {
            re.send({
                ok: false,
                msg: "Yetarli mablag' mavjud emas!"
            });
        } else {
            try {
                const $lastPay = await paymentModel.findOne({ user: req?.user?._id, type: 'courier', status: 'pending' });
                if ($lastPay) {
                    res.send({
                        ok: false,
                        msg: `Sizda ${$lastPay?.value?.toLocaleString()} so'm miqdorda tekshiruvdagi to'lov mavjud! Iltimos tekshiruv tugashini kuting!`
                    });
                } else {
                    const delivered = await orderModel.find({ courier: req?.user?._id, status: 'delivered', courier_status: 'delivered', verified: true });
                    const payments = await paymentModel.find({ user: req?.user?._id, status: 'success', type: 'courier' });
                    let balance = 0;
                    delivered?.forEach(d => {
                        balance += d?.delivery_price || 0;
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
                            type: 'courier',
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
    getMyOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ courier: req?.user?._id, status: 'sended', courier_status: 'sended' })?.populate('product operator party');
            const orders = [];
            $orders?.forEach((o) => {
                orders?.unshift({
                    id: o?.id,
                    _id: o?._id,
                    party: {
                        id: o?.party?.id,
                        created: moment.unix(o?.party?.created)?.format('DD.MM.YYYY | HH:mm'),
                    },
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    region: o?.region,
                    city: o?.city,
                    comment: o?.comment
                });
            });
            res.send({
                ok: true,
                data: orders
            })
        } catch (error) {
            console.log(error);
        }
    },
    setStatusToOrder: async (req, res) => {
        try {
            const { status, _id } = req.body;
            const $order = await orderModel.findById(_id);
            $order.set({ courier_status: status, up_time: moment.now() / 1000 }).save().then(() => {
                res.send({
                    ok: true,
                    msg: `${$order?.id} - buyurtma ${status === 'recontact' ? "QAYTA ALOQAGA O'TKAZILDI" : status === 'reject' ? "BEKOR QILINDI" : "YETKAZILDI"}`
                });
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getRecontactOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ courier: req?.user?._id, status: 'sended', courier_status: 'recontact' })?.populate('product operator party');
            const orders = [];
            $orders?.forEach((o) => {
                orders?.unshift({
                    id: o?.id,
                    _id: o?._id,
                    party: {
                        id: o?.party?.id,
                        created: moment.unix(o?.party?.created)?.format('DD.MM.YYYY | HH:mm'),
                    },
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    region: o?.region,
                    city: o?.city,
                    comment: o?.comment,
                    up_time: moment.unix(o?.up_time).format('DD.MM.YYYY | HH:mm'),
                });
            });
            res.send({
                ok: true,
                data: orders
            })
        } catch (error) {
            console.log(error);
        }
    },
    getDeliveredOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ courier: req?.user?._id, status: 'sended', courier_status: 'delivered' })?.populate('product operator party');
            const orders = [];
            $orders?.forEach((o) => {
                orders?.unshift({
                    id: o?.id,
                    _id: o?._id,
                    party: {
                        id: o?.party?.id,
                        created: moment.unix(o?.party?.created)?.format('DD.MM.YYYY | HH:mm'),
                    },
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    region: o?.region,
                    city: o?.city,
                    comment: o?.comment,
                    up_time: moment.unix(o?.up_time).format('DD.MM.YYYY | HH:mm'),
                });
            });
            res.send({
                ok: true,
                data: orders
            })
        } catch (error) {
            console.log(error);
        }
    },
    getRejectedOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ courier: req?.user?._id, status: 'sended', courier_status: 'reject' })?.populate('product operator party');
            const orders = [];
            $orders?.forEach((o) => {
                orders?.unshift({
                    id: o?.id,
                    _id: o?._id,
                    party: {
                        id: o?.party?.id,
                        created: moment.unix(o?.party?.created)?.format('DD.MM.YYYY | HH:mm'),
                    },
                    name: o?.name,
                    phone: o?.phone,
                    price: o?.price,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    title: o?.title,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    region: o?.region,
                    city: o?.city,
                    comment: o?.comment,
                    up_time: moment.unix(o?.up_time).format('DD.MM.YYYY | HH:mm'),
                });
            });
            res.send({
                ok: true,
                data: orders
            })
        } catch (error) {
            console.log(error);
        }
    },
    getParties: async (req, res) => {
        try {
            const $parties = await partyModel.find({ courier: req?.user?._id }).populate('courier');
            const parties = [];
            for (let p of $parties) {
                const delivered = await orderModel.find({ party: p?._id, status: 'delivered', verified: true });
                const reject = await orderModel.find({ party: p?._id, status: 'reject', verified: true });
                const total = await orderModel.find({ party: p?._id });
                // 
                let price = 0;
                let delivery_price = 0;
                let profit = 0;
                let courier_profit = 0;
                let not_come_profit = 0;
                // 
                let verified = 0;

                total?.forEach(o => {
                    price += o?.price;
                    delivery_price += o?.delivery_price;
                    verified += o?.verified ? 1 : 0;
                });
                delivered?.forEach(o => {
                    profit += o?.price;
                    courier_profit += o?.delivery_price;
                });
                reject?.forEach(o => {
                    not_come_profit += o?.price;
                });
                parties.unshift({
                    id: p?.id,
                    _id: p?._id,
                    created: moment.unix(p?.created).format('DD.MM.YYYY | HH:mm'),
                    courier: p?.courier?.name,
                    courier_phone: p?.courier?.phone,
                    courier_id: p?.courier?.id,
                    courierId: p?.courier?._id,
                    region: p?.courier?.region,
                    // 
                    reject: reject?.length,
                    delivered: delivered?.length,
                    total: total?.length,
                    // 
                    price,
                    delivery_price,
                    profit,
                    courier_profit,
                    not_come_profit,
                    // 
                    verified: verified === total?.length,
                });
            }
            res.send({
                ok: true,
                parties,
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getPartyOrders: async (req, res) => {
        const { id } = req?.params;
        if (!id || isNaN(id) || id < 1) {
            res.send({
                ok: false,
                msg: "ID Xato!"
            })
        } else {
            const $party = await partyModel.findOne({ id, courier: req?.user?._id }).populate('courier');
            const $orders = await orderModel.find({ party: $party?._id }).populate('operator courier');
            const orders = [];
            $orders?.forEach(o => {
                orders.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    value: o?.value,
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    comment: o?.comment,
                    region: o?.region,
                    city: o?.city,
                    price: o?.price + o?.delivery_price,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    // STATUS
                    status: o?.status,
                    courier_status: o?.courier_status,
                    verified: o?.verified,
                });
            });
            res.send({
                ok: true,
                data: orders,
            })
        }
    },
}