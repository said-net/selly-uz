const { phone: ph } = require("phone");
const userModel = require("../models/user.model");
const md5 = require("md5");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { USER_SECRET, SERVER_LINK } = require("../configs/env.config");
const randomConfig = require("../configs/random.config");
const smsConfig = require("../configs/sms.config");
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const orderModel = require("../models/order.model");
const fillModel = require("../models/fill.model");
module.exports = {
  register: async (req, res) => {
    const { name, phone, password, repassword } = req?.body;
    if (!phone || !password || !repassword || !name) {
      res.send({
        ok: false,
        msg: "Qatorlarni to'ldiring!",
      });
    } else if (name?.length < 3) {
      res.send({
        ok: false,
        msg: "Ismingizni to'g'ri kiriting!",
      });
    } else if (!ph(phone, { country: "uz" }).isValid) {
      res.send({
        ok: false,
        msg: "Raqamni to'g'ri kiritng!",
      });
    } else if (password?.length < 6) {
      res.send({
        ok: false,
        msg: "Parol kamida 6 ta belgidan iborat bo'lsin!",
      });
    } else if (password !== repassword) {
      res.send({
        ok: false,
        msg: "Parollar bir xil emas!",
      });
    } else {
      try {
        const sms_code = randomConfig();
        const id = await userModel.find().countDocuments() + 1;
        new userModel({
          id,
          name,
          phone: ph(phone, { country: "uz" }).phoneNumber,
          password: md5(password),
          reg_time: moment.now() / 1000,
          sms_code,
          sms_duration: moment.now() / 1000 + 300,
        })
          .save()
          .then(($user) => {
            const access = jwt.sign({ _id: $user?._id }, USER_SECRET);
            $user
              .set({ access })
              .save()
              .then(() => {
                res.send({
                  ok: true,
                  msg: "SMS orqali tasdiqlash kodi yuborildi!",
                  access,
                });
              })
              .catch((err) => {
                console.log(err);
                res.send({
                  ok: false,
                  msg: "Xatolik!",
                });
              });
            smsConfig(
              ph(phone, { country: "uz" }).phoneNumber,
              `${sms_code}`,
              "activator"
            )
              .then(() => { })
              .catch(() => { });
          })
          .catch((err) => {
            console.log(err);
            res.send({
              ok: false,
              msg: "Ushbu raqam avval ro'yhatdan o'tgan!",
            });
          });
      } catch (error) {
        console.log(error);
        res.send({
          ok: false,
          msg: "Ushbu raqam avval ro'yhatdan o'tgan!",
        });
      }
    }
  },
  activate: async (req, res) => {
    const { sms_code } = req?.body;
    try {
      const $user = await userModel.findById(req?.user?._id);
      if (sms_code !== $user?.sms_code) {
        res.send({
          ok: false,
          msg: "SMS kod xato kiritildi!",
        });
      } else if ($user?.sms_duration < moment.now() / 1000) {
        res.send({
          ok: false,
          msg: "SMS kod eskirgan!",
        });
      } else {
        $user
          .set({ active: true })
          .save()
          .then(() => {
            res.send({
              ok: true,
              msg: "Profil aktivlashtirildi!",
            });
          });
      }
    } catch (error) {
      console.log(error);
      res.send({
        ok: false,
        msg: "Xatolik!",
      });
    }
  },
  resendSms: async (req, res) => {
    const { _id } = req?.user;
    try {
      const $user = await userModel.findById(_id);
      if ($user.sms_duration > moment.now() / 1000) {
        res.send({
          ok: false,
          msg: "SMS har 5 daqiqada qayta yuboriladi!",
        });
      } else {
        const sms_code = randomConfig();
        $user
          .set({ sms_code, sms_duration: moment.now() / 1000 + 300 })
          .save()
          .then(() => {
            smsConfig(
              ph($user?.phone, { country: "uz" })?.phoneNumber,
              `${sms_code}`,
              "resend"
            ).catch(() => { });
            res.send({
              ok: true,
              msg: "SMS kod qayta yuborildi!",
            });
          });
      }
    } catch (error) {
      console.log(error);
      res.send({
        ok: false,
        msg: "Xatolik!",
      });
    }
  },
  recoveryPass: async (req, res) => {
    try {
      const { phone } = req?.body;
      if (!ph(phone, { country: "uz" })?.isValid) {
        res.send({
          ok: false,
          msg: "Raqamni to'g'ri kiriting!",
        });
      } else {
        const $user = await userModel.findOne({
          phone: ph(phone, { country: "uz" })?.phoneNumber,
        });
        if (!$user) {
          res.send({
            ok: false,
            msg: "Foydalanuvchi topilmadi!",
          });
        } else if ($user.sms_duration > moment.now() / 1000) {
          res.send({
            ok: false,
            msg: "Ushbu raqamga 5 daqiqa ichida SMS xabar yuborilgan!",
          });
        } else {
          const password = randomConfig();
          $user
            .set({ password: md5(`${password}`) })
            .save()
            .then(() => {
              smsConfig(
                ph($user?.phone, { country: "uz" })?.phoneNumber,
                `${password}`,
                "recovery"
              ).catch(() => { });
              res.send({
                ok: true,
                msg: "Yangi parol SMS orqali yuborildi!",
              });
            });
        }
      }
    } catch (error) {
      console.log(error);
      res.send({
        ok: false,
        msg: "Xatolik!",
      });
    }
  },
  auth: async (req, res) => {
    const { phone, password } = req?.body;
    try {
      const $user = await userModel.findOne({
        phone: ph(phone, { country: "uz" }).phoneNumber,
        password: md5(password),
      });
      if (!$user) {
        res.send({
          ok: false,
          msg: "Raqam yoki parol xato!",
        });
      } else if ($user.block) {
        res.send({
          ok: false,
          msg: "Ushbu raqam tizimda bloklangansiz!",
        });
      } else {
        const access = jwt.sign({ _id: $user?._id }, USER_SECRET);
        $user
          .set({ access })
          .save()
          .then(() => {
            res.send({
              ok: true,
              msg: "Profilga yo'naltirildi!",
              access
            });
          });
      }
    } catch (error) {
      console.log(error);
      res.send({
        ok: false,
        msg: "Xatolik!",
      });
    }
  },
  verifySession: async (req, res) => {
    res.send({
      ok: true,
      data: req?.user,
    });
  },
  editName: async (req, res) => {
    const { name } = req?.body;
    if (!name) {
      res.send({
        ok: false,
        msg: "Ismingizni kiriting!"
      });
    } else {
      try {
        const $user = await userModel.findById(req?.user?._id);
        $user.set({ name }).save().then(() => {
          res.send({
            ok: true,
            msg: "Saqlandi!"
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
  },
  getMianMenu: async (req, res) => {
    try {
      const $products = await productModel.find({ active: true });
      const $categories = await categoryModel.find({ active: true });
      const products = [];
      const categories = [];
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
          _id: p?._id,
          title: p.title,
          price: p.price,
          category: p.category,
          image: SERVER_LINK + (p.images[p?.main_image] || p.images[0]),
          images: [...p.images?.map(img => SERVER_LINK + img)],
          video: SERVER_LINK + p?.video,
          about: p.about,
          delivery_price: p.delivery_price,
          // 
          value: value - solded,
        });
      }
      res.send({
        ok: true,
        products,
        categories
      })
    } catch (error) {
      console.log(error);
      res.send({ ok: false, msg: "Xatolik!" });
    }
  }
};
