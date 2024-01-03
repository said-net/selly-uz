const moment = require("moment");
const { SERVER_LINK } = require("../configs/env.config");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const fs = require("fs");
module.exports = {
    create: async (req, res) => {
        const { title, color } = req?.body;
        const image = req?.files?.image
        if (!title || !image || !color) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring yoki rasm yuklang!"
            });
        } else {
            try {
                const id = await categoryModel.find()?.countDocuments() + 1;
                const filePath = `/uploads/categories/${image?.md5}.png`;
                new categoryModel({
                    id,
                    title,
                    image: filePath,
                    color,
                    created: moment.now() / 1000
                }).save().then((c) => {
                    image?.mv(`.${filePath}`);
                    res.send({
                        ok: true,
                        msg: "Saqlandi!",
                    });
                })
            } catch (error) {
                console.log(error);
                res.send({ ok: false, msg: "Xatolik!" })
            }
        }
    },
    getAllToAdmin: async (req, res) => {
        try {
            const $categories = await categoryModel.find();
            const data = [];
            for (let c of $categories) {
                const products = await productModel.find({ category: c?._id, active: true }).countDocuments();
                data.unshift({
                    _id: c?._id,
                    id: c.id,
                    title: c.title,
                    color: c.color,
                    created: moment.unix(c.created)?.format('DD.MM.YYYY | HH:mm'),
                    image: SERVER_LINK + c.image,
                    active: c.active,
                    products
                });
            }
            res.send({
                ok: true,
                data
            })
        } catch (error) {
            console.log(error);
            res.send({ ok: false, msg: "Xatolik!" })
        }
    },
    editTitle: async (req, res) => {
        const { title, _id } = req?.body;
        if (!title || !_id) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $category = await categoryModel.findById(_id);
                if (!$category) {
                    res.send({
                        ok: false,
                        msg: "Kategoriya topilmadi!"
                    });
                } else {
                    $category.set({ title }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Saqlandi!",
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
    editImage: async (req, res) => {
        const { _id } = req?.body;
        const image = req?.files?.image;
        if (!_id || !image) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $category = await categoryModel.findById(_id);
                if (!$category) {
                    res.send({
                        ok: false,
                        msg: "Kategoriya topilmadi!"
                    });
                } else {
                    const filePath = `/uploads/categories/${image?.md5}.png`;
                    fs.unlink(`.${$category?.image}`, () => { });
                    $category.set({ image: filePath }).save().then(() => {
                        image?.mv(`.${filePath}`);
                        res.send({
                            ok: true,
                            msg: "Saqlandi!",
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
    editColor: async (req, res) => {
        const { color, _id } = req?.body;
        if (!color || !_id) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $category = await categoryModel.findById(_id);
                if (!$category) {
                    res.send({
                        ok: false,
                        msg: "Kategoriya topilmadi!"
                    });
                } else {
                    $category.set({ color }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Saqlandi!",
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
    setActive: async (req, res) => {
        const { _id, active } = req?.body;
        if (!_id) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $category = await categoryModel.findById(_id);
                if (!$category) {
                    res.send({
                        ok: false,
                        msg: "Kategoriya topilmadi!"
                    });
                } else {
                    $category.set({ active }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Saqlandi!",
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
    // ALL
    getAll: async (req, res) => {
        try {
            const $categories = await categoryModel.find({ active: true });
            const data = [];
            $categories?.forEach(c => {
                data.unshift({
                    _id: c?._id,
                    title: c.title,
                    color: c.color,
                    image: SERVER_LINK + c.image,
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
    }
}