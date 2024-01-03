const { SERVER_LINK } = require("../configs/env.config");
const categoryModel = require("../models/category.model");
const fillModel = require("../models/fill.model");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const moment = require("moment");
const fs = require("fs");
const bot = require("../bot/bot");
const telegramModel = require("../models/telegram.model");
const text = require("../bot/text");
const partyModel = require("../models/party.model");
module.exports = {
    getNavbar: async (req, res) => {
        try {
            const suppliers = await userModel.find({ supplier: true }).countDocuments();
            const categories = await categoryModel.find({ active: true }).countDocuments();
            const products = await productModel.find({ active: true }).countDocuments();
            const operators = await userModel.find({ operator: true }).countDocuments();
            const couriers = await userModel.find({ courier: true }).countDocuments();
            const sellers = await userModel.find({ seller: true }).countDocuments();
            const new_orders = await orderModel.find({ status: 'new', operator: null }).countDocuments();
            const in_operators = await orderModel.find({ status: 'new' }).countDocuments() - new_orders;
            const recontacts = await orderModel.find({ status: 'recontact' }).countDocuments();
            const success = await orderModel.find({ status: 'success' }).countDocuments();
            const sendeds = await orderModel.find({ status: 'sended', courier_status: 'sended' }).countDocuments();
            const delivereds = await orderModel.find({ status: 'sended', verified: false, courier_status: 'delivered' }).countDocuments();
            const rejecteds = await orderModel.find({ status: 'sended', verified: false, courier_status: 'reject' }).countDocuments();
            const archiveds = await orderModel.find({ status: 'archive' }).countDocuments();
            const orders = await orderModel.find().countDocuments();
            const parties = await partyModel.find().countDocuments();
            const payments = await paymentModel.find({ status: 'pending' }).countDocuments();
            res.send({
                ok: true,
                data: {
                    payments,
                    suppliers,
                    categories,
                    products,
                    operators,
                    couriers,
                    sellers,
                    new_orders,
                    in_operators,
                    recontacts,
                    success,
                    sendeds,
                    delivereds,
                    rejecteds,
                    archiveds,
                    orders,
                    parties
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
        const sellers = await userModel.find({ seller: true })?.countDocuments();
        const suppliers = await userModel.find({ supplier: true })?.countDocuments();
        const operators = await userModel.find({ operator: true })?.countDocuments();
        const success_orders = await orderModel.find({ status: 'delivered' })?.countDocuments();
        // STATS
        const d = new Date();
        const day = d?.getDate();
        const month = d?.getMonth();
        const year = d?.getFullYear();
        const week = moment().week();
        // 
        let operator_balance = 0;
        let sellers_balance = 0;
        // 
        const today_delivered = await orderModel.find({ status: 'delivered', day, month, year });
        let today_profit = 0;
        today_delivered?.forEach(d => {
            today_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
        });
        // 
        const yesterday_delivered = await orderModel.find({ status: 'delivered', day: day - 1, month, year });
        let yesterday_profit = 0;
        yesterday_delivered?.forEach(d => {
            yesterday_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
        });
        // 
        const weekly_delivered = await orderModel.find({ status: 'delivered', week, month, year });
        let weekly_profit = 0;
        weekly_delivered?.forEach(d => {
            weekly_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
        });
        // 
        const last_weekly_delivered = await orderModel.find({ status: 'delivered', week: week - 1, month, year });
        let last_weekly_profit = 0;
        last_weekly_delivered?.forEach(d => {
            last_weekly_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
        });
        // 
        const monthly_delivered = await orderModel.find({ status: 'delivered', month, year });
        let monthly_profit = 0;
        monthly_delivered?.forEach(d => {
            monthly_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
        });
        // 
        const last_monthly_delivered = await orderModel.find({ status: 'delivered', month: month === 0 ? 11 : month - 1, year: month === 0 ? year - 1 : year });
        let last_monthly_profit = 0;
        last_monthly_delivered?.forEach(d => {
            last_monthly_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
        });
        // 
        const yearly_delivered = await orderModel.find({ status: 'delivered', year });
        let yearly_profit = 0;
        yearly_delivered?.forEach(d => {
            yearly_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
        });
        // 
        const all_delivered = await orderModel.find({ status: 'delivered', });
        let all_profit = 0;

        all_delivered?.forEach(d => {
            all_profit += (d?.comission || 0) + (!d?.seller ? d?.for_seller : 0) + (!d?.operator ? d?.for_operator : 0);
            sellers_balance += d?.seller ? d?.for_seller : 0;
            operator_balance += d?.operator ? d?.for_operator : 0;
        });
        const $payments_operators = await paymentModel.find({ status: 'success', type: 'operator' });
        const $payments_sellers = await paymentModel.find({ status: 'success', type: 'seller' });
        $payments_operators?.forEach((p) => {
            operator_balance -= p?.value;
        });
        $payments_sellers?.forEach((p) => {
            sellers_balance -= p?.value;
        });
        // 
        res.send({
            ok: true,
            data: {
                sellers,
                suppliers,
                operators,
                operator_balance,
                sellers_balance,
                orders: success_orders,
                // STATS
                today_delivered: today_delivered?.length,
                today_profit,
                // 
                yesterday_delivered: yesterday_delivered?.length,
                yesterday_profit,
                // 
                weekly_delivered: weekly_delivered?.length,
                weekly_profit,
                // 
                last_weekly_delivered: last_weekly_delivered?.length,
                last_weekly_profit,
                // 
                monthly_delivered: monthly_delivered?.length,
                monthly_profit,
                // 
                last_monthly_delivered: last_monthly_delivered?.length,
                last_monthly_profit,
                // 
                yearly_delivered: yearly_delivered?.length,
                yearly_profit,
                // 
                all_delivered: all_delivered?.length,
                all_profit,
            }
        })
    },
    getSuppliers: async (req, res) => {
        const $suppliers = await userModel.find({ supplier: true });
        const data = [];
        for (let s of $suppliers) {
            const products = await productModel.find({ supplier: s?._id })?.countDocuments();
            const orders = await orderModel.find({ supplier: s?._id, status: 'delivered' });
            const payments = await paymentModel.find({ user: s?._id, type: 'supplier' });
            let profit = 0;
            let comission = 0;
            let success_pays = 0;
            let comming_pays = 0;
            let payments_count = 0;
            let delivered_orders = 0;
            // 
            orders?.forEach((o) => {
                profit += o?.for_supplier * o?.value;
                comission += (o?.comission || 0) + (!o?.seller ? o?.for_seller : 0);
                delivered_orders += o?.value || 0;
            });
            payments?.forEach((p) => {
                if (p?.status === 'success') {
                    success_pays += p?.value;
                    payments_count += 1;
                } else if (p?.status === 'pending') {
                    comming_pays += p?.value;
                }
            });
            // 
            data.push({
                _id: s?._id,
                id: s?.id,
                name: s?.name,
                phone: s?.phone,
                products,
                profit,
                orders: delivered_orders,
                comission: 0,
                payments: payments_count,
                block: s?.block,
                comming_pays,
                success_pays,
                balance: profit - (success_pays + comming_pays),
                reg_time: moment.unix(s?.reg_time).format('DD.MM.YYYY | HH:mm')
            });
        }
        res.send({
            ok: true,
            data
        });
    },
    blockUser: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ block: !$user?.block }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: u?.block ? `${u?.name} Bloklandi!` : `${u?.name} Blokdan olindi!`
                        })
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
    setSupplier: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ supplier: true, operator: false, courier: false }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: `${u?.name} ta'minotchi etib tayinlandi!`
                        });
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
    removeSupplier: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ supplier: false, operator: false, courier: false }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: `${u?.name} ta'minotchi safidan olindi!`
                        });
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
    getSellers: async (req, res) => {
        const $suppliers = await userModel.find({ seller: true });
        const data = [];
        for (let s of $suppliers) {
            const orders = await orderModel.find({ seller: s?._id, status: 'delivered' });
            const payments = await paymentModel.find({ user: s?._id, type: 'seller' });
            let profit = 0;
            let success_pays = 0;
            let comming_pays = 0;
            let count_pays = 0;
            // 
            orders?.forEach((o) => {
                profit += o?.for_seller;
            });
            payments?.forEach((p) => {
                if (p?.status === 'success') {
                    success_pays += p?.value;
                    count_pays += 1;
                } else if (p?.status === 'pending') {
                    comming_pays += p?.value;
                }
            });
            // 
            data.push({
                _id: s?._id,
                id: s?.id,
                name: s?.name,
                phone: s?.phone,
                profit,
                orders: orders?.length,
                payments: count_pays,
                block: s?.block,
                supplier: s?.supplier,
                comming_pays,
                success_pays,
                balance: profit - (success_pays + comming_pays),
                reg_time: moment.unix(s?.reg_time).format('DD.MM.YYYY | HH:mm')
            });
        }
        res.send({
            ok: true,
            data
        });
    },
    // 
    getOperators: async (req, res) => {
        const $operators = await userModel.find({ operator: true });
        const data = [];
        for (let s of $operators) {
            const orders = await orderModel.find({ operator: s?._id, status: 'delivered' });
            const payments = await paymentModel.find({ user: s?._id, type: 'operator' });
            let profit = 0;
            let success_pays = 0;
            let comming_pays = 0;
            let count_pays = 0;
            // 
            orders?.forEach((o) => {
                profit += o?.for_operator;
            });
            payments?.forEach((p) => {
                if (p?.status === 'success') {
                    success_pays += p?.value;
                    count_pays += 1;
                } else if (p?.status === 'pending') {
                    comming_pays += p?.value;
                }
            });
            // 
            data.push({
                _id: s?._id,
                id: s?.id,
                name: s?.name,
                phone: s?.phone,
                profit,
                orders: orders?.length,
                payments: count_pays,
                block: s?.block,
                operator_freedom: s?.operator_freedom,
                comming_pays,
                success_pays,
                balance: profit - (success_pays + comming_pays),
                reg_time: moment.unix(s?.reg_time).format('DD.MM.YYYY | HH:mm')
            });
        }
        res.send({
            ok: true,
            data
        });
    },
    setOperator: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ supplier: false, operator: true, courier: false, seller: false }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: `${u?.name} operator etib tayinlandi!`
                        });
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
    removeOperator: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ supplier: false, operator: false, courier: false, seller: true }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: `${u?.name} operatorlikdan olindi!`
                        });
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
    setFreedomOperator: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ operator_freedom: !$user?.operator_freedom }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: u?.operator_freedom ? `${u?.name} ga erkin ishga ruhsat berildi!` : `${u?.name} dan erkin ish huquqi olindi!`
                        })
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
    // 
    getCouriers: async (req, res) => {
        const $couriers = await userModel.find({ courier: true });
        const data = [];
        for (let s of $couriers) {
            const orders = await orderModel.find({ courier: s?._id, status: 'delivered' });
            const payments = await paymentModel.find({ user: s?._id, type: 'courier' });
            let profit = 0;
            let success_pays = 0;
            let comming_pays = 0;
            let count_pays = 0;
            // 
            orders?.forEach((o) => {
                profit += o?.delivery_price;
            });
            payments?.forEach((p) => {
                if (p?.status === 'success') {
                    success_pays += p?.value;
                    count_pays += 1;
                } else if (p?.status === 'pending') {
                    comming_pays += p?.value;
                }
            });
            // 
            data.push({
                _id: s?._id,
                id: s?.id,
                name: s?.name,
                phone: s?.phone,
                profit,
                orders: orders?.length,
                payments: count_pays,
                block: s?.block,
                region: s?.region,
                comming_pays,
                success_pays,
                balance: profit - (success_pays + comming_pays),
                reg_time: moment.unix(s?.reg_time).format('DD.MM.YYYY | HH:mm')
            });
        }
        res.send({
            ok: true,
            data
        });
    },
    setCourier: async (req, res) => {
        const { _id, region } = req?.body;
        if (!_id || _id?.length !== 24 || !region || isNaN(region)) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi yoki Hudud tanlanmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ supplier: false, operator: false, courier: true, region, seller: false }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: `${u?.name} kuryer etib tayinlandi!`
                        });
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
    removeCourier: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || _id?.length !== 24) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ supplier: false, operator: false, courier: false, seller: true }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: `${u?.name} kuryerlikdan olindi!`
                        });
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
    setRegionCourier: async (req, res) => {
        const { _id, region } = req?.body;
        if (!_id || _id?.length !== 24 || !region || isNaN(region)) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi yoki Hudud tanlanmadi!"
            })
        } else {
            try {
                const $user = await userModel.findById(_id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Foydalanuvchi topilmadi!"
                    });
                } else {
                    $user.set({ region }).save().then(u => {
                        res.send({
                            ok: true,
                            msg: `Hudud o'zgartirildi!`
                        });
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
    // PRODUCT
    getProducts: async (req, res) => {
        try {
            const $products = await productModel.find({ active: true }).populate('category supplier');
            const data = [];
            for (let p of $products) {
                let value = 0;
                let solded = 0;
                let profit = 0;
                let comming_profit = 0;
                const new_orders = await orderModel.find({ status: 'new', product: p?._id });
                const success = await orderModel.find({ status: 'success', product: p?._id });
                const sended = await orderModel.find({ status: 'sended', product: p?._id });
                const delivered = await orderModel.find({ status: 'delivered', product: p?._id });
                // 
                // new_orders?.forEach(o => {
                //     solded += o.value
                // });
                let success_orders = 0;
                let sended_orders = 0;
                let delivered_orders = 0;
                success?.forEach(o => {
                    solded += o.value;
                    comming_profit += o?.comission;
                    success_orders += o?.value;
                });
                sended?.forEach(o => {
                    solded += o.value;
                    comming_profit += o?.comission;
                    sended_orders += o?.value;
                });
                delivered?.forEach(o => {
                    solded += o.value;
                    profit += o?.comission;
                    delivered_orders += o?.value;
                });
                const fill = await fillModel.find({ product: p?._id });
                fill?.forEach(f => {
                    value += f.value
                });
                // MAPPING
                data.push({
                    id: p?.id,
                    _id: p?._id,
                    title: p?.title,
                    active: p?.active,
                    price: p?.price,
                    for_seller: p?.for_seller,
                    for_operator: p?.for_operator,
                    for_supplier: p?.for_supplier,
                    comission: p?.comission,
                    category: p?.category.title,
                    category_image: SERVER_LINK + p?.category.image,
                    category_color: p?.category.color,
                    supplier: p?.supplier?.name,
                    supplier_phone: p?.supplier?.phone,
                    supplier_id: p?.supplier?.id,
                    image: SERVER_LINK + (p?.images[p?.main_image] || p?.images[0]),
                    // images: [...p?.images?.map(img => SERVER_LINK + img)],
                    // main_image: p?.main_image,
                    // video: SERVER_LINK + p?.video,
                    created: moment.unix(p?.created).format('DD.MM.YYYY | HH:mm'),
                    new_orders: new_orders?.length,
                    sended: sended_orders,
                    delivered: delivered_orders,
                    success: success_orders,
                    // 
                    profit: profit,
                    comming_profit: comming_profit,
                    value: value - solded,
                    verified: p?.verified
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
            });
        }
    },
    setActiveProduct: async (req, res) => {
        const { _id, active } = req?.body;
        if (!_id) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
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
                    $product.set({ active }).save().then(p => {
                        res.send({
                            ok: true,
                            msg: `${p?.title} mahsuloti ${active ? 'aktivlandi' : 'deaktivlandi'}!`
                        });
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
                });
            }
        }
    },
    getProductInfo: async (req, res) => {
        const { _id } = req?.params;
        if (!_id) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            })
        } else {
            try {
                const $product = await productModel.findById(_id);
                if (!$product) {
                    res.send({
                        ok: false,
                        msg: "Mahsulot topilmadi!"
                    })
                } else {
                    const {
                        _id,
                        about,
                        id,
                        title,
                        price,
                        for_seller,
                        for_operator,
                        for_supplier,
                        category,
                        delivery_price,
                        comission,
                    } = $product;
                    const $categories = await categoryModel.find({ active: true });
                    const categories = [];
                    $categories?.forEach(c => {
                        categories.unshift({
                            _id: c?._id,
                            title: c.title,
                            color: c.color,
                            image: SERVER_LINK + c.image,
                        });
                    });
                    res.send({
                        ok: true,
                        data: {
                            _id,
                            id,
                            about,
                            title,
                            price,
                            for_seller,
                            for_operator,
                            for_supplier,
                            category,
                            delivery_price,
                            comission,
                        },
                        categories
                    });
                }
            } catch (err) {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    setProductInfo: async (req, res) => {
        const { _id, title, price, for_seller, for_operator, for_supplier, category, delivery_price, comission } = req?.body;
        if (!_id) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
            });
        } else if (!title || !price || !for_seller || !for_operator || !for_supplier || !category || !delivery_price || !comission) {
            re.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
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
                    $product.set({
                        title,
                        price,
                        for_seller,
                        for_operator,
                        for_supplier,
                        category,
                        delivery_price,
                        comission
                    }).save().then(p => {
                        res.send({
                            ok: true,
                            msg: `${p?.title} mahsuloti o'zgartirildi!`
                        });
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
            }
        }
    },
    getProductMedia: async (req, res) => {
        const { _id } = req?.params;
        if (!_id) {
            res.send({
                ok: false,
                msg: "ID biriktirilmadi!"
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
                    res.send({
                        ok: true,
                        data: {
                            images: [...$product?.images?.map(img => SERVER_LINK + img)],
                            main_image: $product?.main_image + 1 > $product?.images?.length ? 0 : $product?.main_image,
                            video: SERVER_LINK + $product?.video
                        }
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
    editProductImage: async (req, res) => {
        const { _id, index } = req?.body;
        const image = req?.files?.image;
        if (!image || !_id) {
            res.send({
                ok: false,
                msg: "ID yoki rasm topilmadi!"
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
                    const images = $product.images;
                    if (!images[index]) {
                        res.send({
                            ok: false,
                            msg: "Rasmni o'chirib bo'lmaydi!"
                        });
                    } else {
                        fs.unlink('.' + images[index], () => { });
                        const filePath = `/uploads/products/${image?.md5}.png`;
                        images[index] = filePath;
                        $product.set({ images }).save().then(() => {
                            image.mv(`.${filePath}`);
                            res.send({
                                ok: true,
                                msg: "Rasmni o'zgartirildi!"
                            });
                        });
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
    deleteProductImage: async (req, res) => {
        const { _id, index } = req?.params;
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
                } else if (!$product?.images[1]) {
                    res.send({
                        ok: false,
                        msg: "Oxirgi rasmni o'chirib bo'lmaydi!"
                    });
                } else {
                    const images = $product.images;
                    fs.unlink('.' + images[index], () => { });
                    images.splice(index, 1);
                    $product.set({ images }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Rasm o'chirildi!"
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
    addProductImage: async (req, res) => {
        const { _id } = req?.body;
        const image = req?.files?.image;
        if (!image || !_id) {
            res.send({
                ok: false,
                msg: "Id yoki rasm topilmadi!"
            });
        } else {
            try {
                const $product = await productModel.findById(_id);
                if (!$product) {
                    res.send({
                        ok: false,
                        msg: "Mahsulot topilmadi!"
                    });
                } else if ($product?.images?.length >= 5) {
                    res.send({
                        ok: false,
                        msg: "5 tadan ko'p rasm qo'shib bo'lmaydi!"
                    })
                } else {
                    const images = $product.images;
                    const filePath = `/uploads/products/${image?.md5}.png`;
                    $product.set({ images: [...images, filePath] }).save().then(() => {
                        image.mv(`.${filePath}`);
                        res.send({
                            ok: true,
                            msg: "Rasmni saqlandi!"
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
    editProductMainImage: async (req, res) => {
        const { _id, main_image } = req?.body;
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
                    $product.set({ main_image }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Asosiy rasm o'zgartirildi!"
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
    editProductVideo: async (req, res) => {
        const { _id } = req?.body;
        const video = req?.files?.video;
        if (!_id || !video) {
            res.send({
                ok: false,
                msg: "ID yoki Video topilmadi!"
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
                    fs.unlink('.' + $product?.video, () => { });
                    const filePath = `/uploads/creatives/${video?.md5}.mp4`;
                    $product.set({ video: filePath }).save().then(() => {
                        video.mv(`.${filePath}`);
                        res.send({
                            ok: true,
                            msg: "Video o'zgartirildi!"
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
    verifyProduct: async (req, res) => {
        const { _id } = req?.body;
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
                    $product.set({ verified: true }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Mahsulot tasdiqlandi!"
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
    rejectProduct: async (req, res) => {
        const { _id } = req?.body;
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
                    const { images, video } = $product;
                    images?.forEach(img => {
                        fs.unlink(`.${img}`, () => { });
                    });
                    fs.unlink(`.${video}`, () => { });
                    const fill = await fillModel.findOne({ product: $product?._id });
                    fill.deleteOne().then(() => {
                        $product.deleteOne().then(() => {
                            res.send({
                                ok: true,
                                msg: "Mahsulot o'chirildi!"
                            });
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
    // ORDERS
    getNewOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ status: 'new', operator: null }).populate('product stream supplier seller');
            const data = [];
            $orders?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                operators,
                couriers
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getInOperatorOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ status: 'new' }).populate('product stream supplier seller operator');
            const data = [];
            $orders?.filter(o => o?.operator)?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                operators,
                couriers
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
            const $orders = await orderModel.find({ status: 'recontact' }).populate('product stream supplier seller operator');
            const data = [];
            $orders?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    comment: o?.comment,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                operators,
                couriers
            })
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
            const $orders = await orderModel.find({ status: 'success' }).populate('product stream supplier seller operator');
            const data = [];
            $orders?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    comment: o?.comment,
                    region: o?.region,
                    city: o?.city,
                    delivery_price: o?.delivery_price,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                operators,
                couriers
            })
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
            const $orders = await orderModel.find({ status: 'sended', courier_status: 'sended' }).populate('product stream supplier seller operator courier party');
            const data = [];
            $orders?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    status: o?.status,
                    party: o?.party?.id,
                    region: o?.region,
                    city: o?.city,
                    delivery_price: o?.delivery_price,
                    comment: o?.comment,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // COURIER
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                    courier_id: o?.courier?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                operators,
                couriers
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    // COMMING
    getDeliveredOrders: async (req, res) => {
        try {
            const $orders = await orderModel.find({ courier_status: 'delivered', verified: false }).populate('product stream supplier seller operator courier party');
            const data = [];
            $orders?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    region: o?.region,
                    city: o?.city,
                    comment: o?.comment,
                    delivery_price: o?.delivery_price,
                    party: o?.party?.id,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // COURIER
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                    courier_id: o?.courier?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                couriers
            })
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
            const $orders = await orderModel.find({ courier_status: 'reject', verified: false }).populate('product stream supplier seller operator courier party');
            const data = [];
            $orders?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    region: o?.region,
                    city: o?.city,
                    comment: o?.comment,
                    delivery_price: o?.delivery_price,
                    party: o?.party?.id,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // COURIER
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                    courier_id: o?.courier?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                couriers
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    // 
    getArchivedOrders: async (req, res) => {
        try {
            const { page } = req?.params;
            const limit = 50;
            const start = Number((page * limit) - limit);
            const end = Number(page * limit);
            const $orders = await orderModel.find({ status: 'archive' }).populate('product stream supplier seller operator');
            const data = [];
            $orders?.slice(start, end)?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                operators,
                couriers,
                pages: Math.ceil($orders?.length / limit),
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getHistoryOrders: async (req, res) => {
        try {
            const { page } = req?.params;
            const limit = 50;
            const start = Number((page * limit) - limit);
            const end = Number(page * limit);
            const $orders = await orderModel.find().populate('product stream supplier seller operator party courier');
            const data = [];
            $orders?.slice(start, end)?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    status: o?.status,
                    region: o?.region,
                    comment: o?.comment,
                    city: o?.city,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // COURIER
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                    courier_id: o?.operator?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                    // party
                    party_id: o?.party?.id,
                    party_date: o?.party ? moment?.unix(o?.party?.created)?.format('HH.MM.YYYY | HH:MM') : ''
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            res.send({
                ok: true,
                data,
                operators,
                couriers,
                pages: Math.ceil($orders?.length / limit),
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    searchOrder: async (req, res) => {
        try {
            const { param, type } = req.params
            const $orders = await orderModel.find().populate('product stream supplier seller operator party courier');
            const data = [];
            $orders?.filter(o => type === 'id' ? o?.id === Number(param) : o?.phone?.includes(param))?.forEach(o => {
                data.unshift({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.title,
                    price: o?.price,
                    value: o?.value,
                    delivery_price: o?.delivery_price,
                    image: SERVER_LINK + (o?.product?.images[o?.product?.main_image] || o?.product?.images[0]),
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    status: o?.status,
                    region: o?.region,
                    city: o?.city,
                    product_price: o?.product?.price,
                    comment: o?.comment,
                    // CLIENT
                    name: o?.name,
                    phone: o?.phone,
                    // SUPPLIER
                    supplier: o?.supplier?.name,
                    supplier_phone: o?.supplier?.phone,
                    supplier_id: o?.supplier?.id,
                    // SELLER
                    seller: o?.seller?.name,
                    seller_phone: o?.seller?.phone,
                    seller_id: o?.seller?.id,
                    // OPERATOR
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    operator_id: o?.operator?.id,
                    // COURIER
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                    courier_id: o?.operator?.id,
                    // STREAM
                    stream_id: o?.stream?.id,
                    // COMISSION
                    comission: o?.comission,
                    // party
                    party_id: o?.party?.id,
                    party_date: o?.party ? moment?.unix(o?.party?.created)?.format('HH.MM.YYYY | HH:MM') : ''
                });
            });
            // OPERS
            const $operators = await userModel.find({ operator: true });
            const operators = [];
            $operators?.forEach((o) => {
                operators.unshift({
                    id: o?.id,
                    _id: o?._id,
                    name: o?.name,
                    phone: o?.phone,
                })
            });
            // COURIERS
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach((c) => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                })
            });
            // PARTIES
            const $parties = await partyModel.find().populate('courier')
            const parties = [];
            $parties?.forEach(p => {
                parties?.unshift({
                    id: p?.id,
                    _id: p?._id,
                    created: moment.unix(p?.created).format('DD.MM.YYYY - HH:mm'),
                    courier_name: p?.courier?.name,
                    courier_phone: p?.courier?.phone,
                    region: p?.courier?.region
                });
            })
            res.send({
                ok: true,
                data,
                operators,
                couriers,
                parties
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        }
    },
    getParties: async (req, res) => {
        try {
            const $parties = await partyModel.find().populate('courier');
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
            const $couriers = await userModel.find({ courier: true });
            const couriers = [];
            $couriers?.forEach(c => {
                couriers.unshift({
                    id: c?.id,
                    _id: c?._id,
                    name: c?.name,
                    phone: c?.phone,
                    region: c?.region,
                });
            })
            res.send({
                ok: true,
                parties,
                couriers
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
            const $party = await partyModel.findOne({ id }).populate('courier');
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
                    // COURIER
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                });
            });
            res.send({
                ok: true,
                data: orders,
            })
        }
    },
    // 
    setOperatorToOrders: async (req, res) => {
        const { _id, orders } = req?.body;
        if (!_id || !orders[0]) {
            res.send({
                ok: false,
                msg: "Operator yoki buyurtma tanlanmadi!"
            });
        } else {
            try {
                for (let o of [...orders]) {
                    const $order = await orderModel.findById(o);
                    if ($order) {
                        $order.set({ operator: _id, up_time: moment.now() / 1000 }).save();
                    }
                }
                res.send({
                    ok: true,
                    msg: `${orders?.length} ta buyurtma uchun operator biriktirildi!`
                });
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    setCourierToOrders: async (req, res) => {
        const { _id, orders } = req?.body;
        if (!_id || !orders[0]) {
            res.send({
                ok: false,
                msg: "Kuryer yoki buyurtma tanlanmadi!"
            });
        } else {
            try {
                for (let o of [...orders]) {
                    const $order = await orderModel.findById(o);
                    if ($order) {
                        $order.set({ courier: _id, up_time: moment.now() / 1000 }).save();
                    }
                }
                res.send({
                    ok: true,
                    msg: `${orders?.length} ta buyurtma uchun kuryer biriktirildi!`
                });
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    setStatusToOrders: async (req, res) => {
        const { status, orders, courier } = req?.body;
        if (!status || !orders[0]) {
            res.send({
                ok: false,
                msg: "Status yoki buyurtma tanlanmadi!"
            });
        } else if (status === 'sended' && !courier) {
            res.send({
                ok: false,
                msg: "Kuryer tanlanmadi!"
            });
        } else {
            try {
                if (status === 'sended') {
                    const pid = await partyModel.find().countDocuments() + 1;
                    const $courier = await userModel.findById(courier);
                    if (!$courier?.courier) {
                        res.send({
                            ok: false,
                            msg: "Ushbu kuryer mavjud emas!"
                        })
                    } else {
                        new partyModel({
                            id: pid,
                            created: moment.now() / 1000,
                            courier,
                            uptime: moment.now() / 1000,
                        }).save().then(async $s => {
                            for (let o of [...orders]) {
                                const $o = await orderModel.findById(o)?.populate('stream product');
                                if ($o) {
                                    $o.set({ status: 'sended', up_time: moment.now() / 1000, party: $s?._id, courier, region: $courier?.region }).save().then(async ($s) => {
                                        const $tg = await telegramModel.findOne({ user: $o?.seller });
                                        if ($o?.stream?.active && $tg && $tg[status]) {
                                            bot.telegram.sendMessage($tg?.telegram, text['sended']($o?.id, $o?.phone, $o?.product?.title, $o?.stream?.title), { parse_mode: 'HTML' }).catch(err => {
                                                console.log(err);
                                            });
                                        }
                                    });
                                }
                            }
                            res.send({
                                ok: true,
                                msg: `${orders?.length} ta buyurtma uchun status biriktirildi!`
                            });
                        })
                    }
                } else {
                    for (let o of [...orders]) {
                        const $o = await orderModel.findById(o)?.populate('stream product');
                        if ($o) {
                            $o.set({ status, up_time: moment.now() / 1000 }).save().then(async ($s) => {
                                const $tg = await telegramModel.findOne({ user: $o?.seller });
                                if (status === 'delivered') {
                                    $s.set({ verified: true, courier_status: 'delivered' }).save();
                                } else if (status === 'reject') {
                                    $s.set({ verified: true, courier_status: 'reject' }).save();
                                }
                                if (status !== 'new' && $o?.stream?.active && $tg && $tg[status]) {
                                    bot.telegram.sendMessage($tg?.telegram, text[status]($o?.id, $o?.phone, $o?.product?.title, $o?.stream?.title), { parse_mode: 'HTML' }).catch(err => {
                                        console.log(err);
                                    }).then(() => {
                                        if (status === 'delivered') {
                                            bot.telegram.sendMessage($tg?.telegram, text.add_balance($o?.for_seller), { parse_mode: 'HTML' }).catch(err => {
                                                console.log(err);
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    }
                    res.send({
                        ok: true,
                        msg: `${orders?.length} ta buyurtma uchun status biriktirildi!`
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
    getCheques: async (req, res) => {
        const { page } = req?.params;
        if (!page || page < 1) {
            res.send({
                ok: false,
                msg: "Cheklar topilmadi"
            });
        } else {
            try {
                const limit = 18;
                const skip = (page - 1) * limit;
                const $orders = await orderModel.find({ status: 'success' }).skip(skip).limit(limit).populate('operator');
                const pages = Math.ceil(await orderModel.find({ status: 'success' }).countDocuments() / limit);
                const data = [];
                $orders?.forEach(o => {
                    data.unshift({
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
                    });
                });
                res.send({
                    ok: true,
                    data,
                    pages
                })
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    // 
    editParty: async (req, res) => {
        const { _id, party_id } = req?.body;
        if (!party_id || !_id) {
            res.send({
                ok: false,
                msg: "ID topilmadi"
            });
        } else {
            try {
                const $party = await partyModel.findById(party_id);
                if (!$party) {
                    res.send({
                        ok: false,
                        msg: "Partiya topilmadi!"
                    });
                } else {
                    const $order = await orderModel.findById(_id);
                    if (!$order) {
                        res.send({
                            ok: false,
                            msg: "Buyurtma topilmadi"
                        });
                    } else {
                        $order.set({
                            party: $party?._id,
                            courier: $party?.courier,
                            up_time: moment.now() / 1000
                        }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "Saqlandi!"
                            });
                        }).catch((err) => {
                            console.error(err);
                            res.send({
                                ok: false,
                                msg: "Xatolik!"
                            });
                        })
                    }
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                });
            }
        }
    },
    editInfoOrder: async (req, res) => {
        const { _id, name, phone, comment, city, price, delivery_price, value } = req?.body;
        if (!_id || !name || !phone || !comment || !city || !price || !delivery_price || !value) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $order = await orderModel.findById(_id);
                $order.set({ _id, name, phone, comment, city, price, delivery_price, value, up_time: moment.now() / 1000 }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    });
                }).catch(err => {
                    console.log(err);
                    res.send({
                        ok: false,
                        msg: "Xatolik!"
                    });
                });
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                });
            }
        }
    },
    // PAYMENTS
    getPayments: async (req, res) => {
        try {
            const $payments = await paymentModel.find({ status: 'pending' }).populate('user')
            const payments = [];
            $payments.forEach(p => {
                payments.push({
                    id: p?.id,
                    _id: p._id,
                    created: moment.unix(p?.created).format('DD.MM.YYYY | HH:mm'),
                    name: p?.user?.name,
                    user_id: p?.user?.id,
                    phone: p?.user?.phone,
                    type: p?.type,
                    value: p?.value,
                    card: p?.card
                });
            });
            res.send({
                ok: true,
                data: payments
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    setStatusPayment: async (req, res) => {
        const { _id, status } = req?.body;
        try {
            if (!_id || !status) {
                res.send({
                    ok: false,
                    msg: "ID yoki STATUS tanlanmadi!"
                });
            } else {
                const $payment = await paymentModel.findById(_id);
                if (!$payment) {
                    res.send({
                        ok: false,
                        msg: "To'lov topilmadi!"
                    });
                } else {
                    $payment.set({ status }).save().then(async () => {
                        res.send({
                            ok: true,
                            msg: status === 'success' ? "TO'LANDI!" : "RAD ETILDI!"
                        });
                        if ($payment?.type === 'seller') {
                            const $tg = await telegramModel.findOne({ user: $payment?.user });
                            if ($tg) {
                                bot.telegram.sendMessage($tg?.telegram, `<b>👀 To'ov uchun ariza ko'rib chiqildi!</b>\n💳 Karta: <b>${$payment?.card}</b>\n💰 Qiymat: <b>${$payment?.value?.toLocaleString()}</b> so'm\n🕑 Holat: <b>${status === 'success' ? "✅ To'landi" : "🚫 Rad etildi"}</b>`, { parse_mode: 'HTML' }).catch((err) => {
                                    console.log(err);
                                });
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        }
    }
}