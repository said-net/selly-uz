const { SERVER_LINK } = require("../configs/env.config");
const fillModel = require("../models/fill.model");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");
const productModel = require("../models/product.model")
const moment = require("moment");
module.exports = {
    getNavbar: async (req, res) => {
        try {
            const products = await productModel.find({ supplier: req?.user?._id, active: true })?.countDocuments();
            const orders = await orderModel.find({ supplier: req?.user?._id });
            let new_orders = 0;
            let recontacts=0;
            let success = 0;
            let sendeds = 0;
            let delivereds = 0;
            let rejecteds = 0;
            let archiveds = 0;
            orders?.filter(o=>o?.status !== 'copy')?.forEach((o)=>{
                if(o?.status === 'new'){
                    new_orders+=o?.value
                }else if(o?.status === 'recontact'){
                    recontacts+=o?.value
                }else if(o?.status === 'success'){
                    success+=o?.value
                }else if(o?.status === 'sended'){
                    sendeds+=o?.value
                }else if(o?.status === 'delivered'){
                    delivereds+=o?.value
                }else if(o?.status === 'reject'){
                    rejecteds+=o?.value
                }else if(o?.status === 'archive'){
                    archiveds+=o?.value
                }
            })
            res.send({
                ok: true,
                data: {
                    products,
                    new_orders,
                    recontacts,
                    success,
                    sendeds,
                    delivereds,
                    rejecteds,
                    archiveds,
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
            const products = await productModel.find({ supplier: req?.user?._id }).countDocuments();
            // 
            const sended = await orderModel.find({ supplier: req?.user?._id, status: 'sended' });
            const delivered = await orderModel.find({ supplier: req?.user?._id, status: 'delivered' });
            // 
            const $success_payments = await paymentModel.find({ user: req?.user?._id, type: 'supplier', status: 'success' });
            const $pending_payments = await paymentModel.find({ user: req?.user?._id, type: 'supplier', status: 'pending' });
            // 
            let balance = 0;
            let hold_balance = 0;
            let payments = 0;
            let comming_payments = 0;
            let sended_orders = 0;
            let delivered_orders = 0;
            // CALC
            delivered?.forEach(s => {
                balance += (s?.for_supplier * s?.value) || 0;
                delivered_orders += (s?.value) || 0;
            });
            sended?.forEach(s => {
                hold_balance += (s?.for_supplier * s?.value) || 0;
                sended_orders += s?.value || 0;
            });
            $success_payments?.forEach(s => {
                payments += (s?.value) || 0;
            });
            $pending_payments?.forEach(s => {
                comming_payments += (s?.value) || 0;
            });
            // 
            res.send({
                ok: true,
                data: {
                    balance: balance - (payments + comming_payments),
                    hold_balance,
                    comming_payments,
                    payments,
                    sended: sended_orders,
                    delivered: delivered_orders,
                    products
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
    createProduct: async (req, res) => {
        try {
            const images = req?.files['images[]'];
            const video = req?.files?.video;
            const { title, about, price, for_seller, for_operator, comission, value, category, main_image, for_supplier } = req?.body;
            if (!title) {
                res.send({
                    ok: false,
                    msg: "Mahsulot nomini kiriting!"
                });
            } else if (!about) {
                res.send({
                    ok: false,
                    msg: "Mahsulot tavsifini kiriting!"
                });
            } else if (!for_seller || for_seller < 25000) {
                res.send({
                    ok: false,
                    msg: "Sotuvchi uchun summa belgilang ( MIN: 25 000 SO'M )"
                });
            } else if (!price || price < 10000) {
                res.send({
                    ok: false,
                    msg: "Sotuv narxini belgilang ( MIN: 10 000 SO'M )"
                });
            } else if (!value || value < 20) {
                res.send({
                    ok: false,
                    msg: "Eng kam mahsulot soni 20 ta bo'lishi kerak!"
                });
            } else if (!images[1]) {
                res.send({
                    ok: false,
                    msg: "Rasm tanlang!"
                });
            } else if (!video) {
                res.send({
                    ok: false,
                    msg: "Video tanlang!"
                });
            } else if (!category) {
                res.send({
                    ok: false,
                    msg: "Kategoriya tanlang!"
                });
            } else {
                const imgs = [];
                const videoPath = `/uploads/creatives/${video?.md5}.mp4`;
                video?.mv(`.${videoPath}`);
                images?.forEach(img => {
                    const filePath = `/uploads/products/${img?.md5}.png`;
                    imgs.push(filePath);
                    img?.mv(`.${filePath}`);
                });
                const id = await productModel.find().countDocuments() + 1;
                new productModel({
                    id,
                    title,
                    about,
                    price,
                    for_seller,
                    for_operator,
                    for_supplier,
                    comission,
                    value,
                    category,
                    main_image,
                    images: imgs,
                    video: videoPath,
                    supplier: req?.user?._id,
                    created: moment.now() / 1000
                }).save().then(async product => {
                    const fid = await fillModel.find().countDocuments() + 1;
                    new fillModel({
                        id: fid,
                        product: product?._id,
                        value,
                        created: moment.now() / 1000
                    }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Tekshiruvga yuborildi!"
                        });
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Xatolik!"
                        });
                    });
                }).catch(err => {
                    console.log(err);
                    res.send({
                        ok: false,
                        msg: "Xatolik!"
                    });
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        }
    },
    getProducts: async (req, res) => {
        try {
            const $products = await productModel.find({ active: true, supplier: req?.user?._id }).populate('category');
            const data = [];
            for (let p of $products) {
                let value = 0;
                let profit = 0;
                let comming_profit = 0;
                const new_orders = await orderModel.find({ status: 'new', product: p?._id });
                const success = await orderModel.find({ status: 'success', product: p?._id });
                const sended = await orderModel.find({ status: 'sended', product: p?._id });
                const delivered = await orderModel.find({ status: 'delivered', product: p?._id });
                // 
                let new_orderss = 0;
                let success_orders = 0;
                let sended_orders = 0;
                let delivered_orders = 0;
                new_orders?.forEach(o => {
                    value -= (o.value || 0);
                    new_orderss+=o?.value
                });
                success?.forEach(o => {
                    value -= o.value;
                    comming_profit += (o?.for_supplier * o?.value) || 0;
                    success_orders += o?.value || 0;
                });
                sended?.forEach(o => {
                    value -= o.value;
                    comming_profit += o?.for_supplier * o?.value;
                    sended_orders += o?.value || 0;
                });
                delivered?.forEach(o => {
                    value -= o.value;
                    profit += o?.for_supplier * o?.value;
                    delivered_orders += o?.value || 0;
                });
                const fill = await fillModel.find({ product: p?._id });
                fill?.forEach(f => {
                    value += f.value
                });
                // MAPPING
                data.push({
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    for_seller: p.for_seller,
                    for_operator: p.for_operator,
                    for_supplier: p.for_supplier,
                    comission: p.comission,
                    category: p.category.title,
                    category_image: SERVER_LINK + p.category.image,
                    category_color: p.category.color,
                    image: SERVER_LINK + (p.images[p?.main_image] || p.images[0]),
                    created: moment.unix(p.created).format('DD.MM.YYYY | HH:mm'),
                    new_orders: new_orderss,
                    sended: sended_orders,
                    delivered: delivered_orders,
                    success: success_orders,
                    // 
                    profit: profit,
                    comming_profit: comming_profit,
                    value,
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
    getOrders: async (req, res) => {
        const { status } = req?.params;
        try {
            const $orders = await orderModel.find({ status, supplier: req?.user?._id }).populate('product');
            const data = [];
            $orders?.forEach((o) => {
                const for_supplier = o?.for_supplier || 0;
                data.unshift({
                    id: o?.id,
                    product: o?.product?.title,
                    created: moment.unix(o?.created).format('DD.MM.YYYY | HH:mm'),
                    for_supplier: `${Number(for_supplier * o?.value)?.toLocaleString()}`,
                    phone: o?.phone?.slice(0, 10) + '***',
                    value: o?.value
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
            });
        }
    },
    getBalance: async (req, res) => {
        try {
            const delivered = await orderModel.find({ supplier: req?.user?._id, status: 'delivered' });
            const payments = await paymentModel.find({ user: req?.user?._id, type: 'supplier' });
            let balance = 0;
            delivered?.forEach(d => {
                balance += (d?.for_supplier * d?.value) || 0;
            });
            payments?.forEach(p => {
                if (p?.status === 'pending' || p?.status === 'success') {
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
                const $lastPay = await paymentModel.findOne({ user: req?.user?._id, type: 'supplier', status: 'pending' });
                if ($lastPay) {
                    res.send({
                        ok: false,
                        msg: `Sizda ${$lastPay?.value?.toLocaleString()} so'm miqdorda tekshiruvdagi to'lov mavjud! Iltimos tekshiruv tugashini kuting!`
                    });
                } else {
                    const delivered = await orderModel.find({ supplier: req?.user?._id, status: 'delivered' });
                    const payments = await paymentModel.find({ user: req?.user?._id, type: 'supplier' });
                    let balance = 0;
                    delivered?.forEach(d => {
                        balance += (d?.for_supplier * d?.value) || 0;
                    });
                    payments?.forEach(p => {
                        if (p?.status === 'pending' || p?.status === 'success') {
                            balance -= p?.value || 0;
                        }
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
                            type: 'supplier',
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
}