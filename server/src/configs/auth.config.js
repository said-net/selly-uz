const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { USER_SECRET } = require("./env.config");
const telegramModel = require("../models/telegram.model");
module.exports = {
  user: (req, res, next) => {
    const token = req?.headers["x-auth-token"];
    if (!token || !token?.startsWith("Bearer ")) {
      res.send({
        ok: false,
        msg: "Avtorizatsiya qilmagansiz!",
      });
    } else {
      const access = token?.replace("Bearer ", "");
      jwt.verify(access, USER_SECRET, async (err, decoded) => {
        if (err) {
          res.send({
            ok: false,
            msg: "Avtorizatsiya qilmagansiz!",
          });
        } else {
          try {
            const { _id } = decoded;
            const $user = await userModel.findById(_id);
            if (!$user) {
              res.send({
                ok: false,
                msg: "Foydalanuvchi topilmadi!",
              });
            } else if ($user.block) {
              res.send({
                ok: false,
                msg: "Siz bloklangansiz!",
              });
            } else {
              const $telegram = await telegramModel.findOne({ user: _id });
              const { name, phone, active, seller, admin, operator, courier,
                supplier } =
                $user;
              req.user = {
                _id,
                name,
                phone,
                active,
                seller,
                admin,
                operator,
                courier,
                supplier,
                telegram: !$telegram ? '' : $telegram?.telegram
              };
              next();
            }
          } catch (error) {
            res.send({
              ok: false,
              msg: "Xatolik!",
            });
          }
        }
      });
    }
  },
  supplier: (req, res, next) => {
    const token = req?.headers["x-auth-token"];
    if (!token || !token?.startsWith("Bearer ")) {
      res.send({
        ok: false,
        msg: "Avtorizatsiya qilmagansiz!",
      });
    } else {
      const access = token?.replace("Bearer ", "");
      jwt.verify(access, USER_SECRET, async (err, decoded) => {
        if (err) {
          res.send({
            ok: false,
            msg: "Avtorizatsiya qilmagansiz!",
          });
        } else {
          try {
            const { _id } = decoded;
            const $user = await userModel.findById(_id);
            if (!$user) {
              res.send({
                ok: false,
                msg: "Foydalanuvchi topilmadi!",
              });
            } else if ($user.block) {
              res.send({
                ok: false,
                msg: "Siz bloklangansiz!",
              });
            } else if (!$user.supplier) {
              res.send({
                ok: false,
                msg: "Siz ta'minotchi emassiz!",
              });
            } else {
              // const { name, phone, active, seller, admin, operator, courier,
              //   supplier } =
              //   $user;
              req.user = {
                _id,
                // name,
                // phone,
                // active,
                // seller,
                // admin,
                // operator,
                // courier,
                // supplier
              };
              next();
            }
          } catch (error) {
            res.send({
              ok: false,
              msg: "Xatolik!",
            });
          }
        }
      });
    }
  },
  admin: (req, res, next) => {
    const token = req?.headers["x-auth-token"];
    if (!token || !token?.startsWith("Bearer ")) {
      res.send({
        ok: false,
        msg: "Avtorizatsiya qilmagansiz!",
      });
    } else {
      const access = token?.replace("Bearer ", "");
      jwt.verify(access, USER_SECRET, async (err, decoded) => {
        if (err) {
          res.send({
            ok: false,
            msg: "Avtorizatsiya qilmagansiz!",
          });
        } else {
          try {
            const { _id } = decoded;
            const $user = await userModel.findById(_id);
            if (!$user) {
              res.send({
                ok: false,
                msg: "Foydalanuvchi topilmadi!",
              });
            } else if ($user.block) {
              res.send({
                ok: false,
                msg: "Siz bloklangansiz!",
              });
            } else if (!$user.admin) {
              res.send({
                ok: false,
                msg: "Siz admin emassiz!",
              });
            } else {
              // const { name, phone, active, seller, admin, operator, courier,
              //   supplier } =
              //   $user;
              req.user = {
                _id,
                // name,
                // phone,
                // active,
                // seller,
                // admin,
                // operator,
                // courier,
                // supplier
              };
              next();
            }
          } catch (error) {
            res.send({
              ok: false,
              msg: "Xatolik!",
            });
          }
        }
      });
    }
  },
  seller: (req, res, next) => {
    const token = req?.headers["x-auth-token"];
    if (!token || !token?.startsWith("Bearer ")) {
      res.send({
        ok: false,
        msg: "Avtorizatsiya qilmagansiz!",
      });
    } else {
      const access = token?.replace("Bearer ", "");
      jwt.verify(access, USER_SECRET, async (err, decoded) => {
        if (err) {
          res.send({
            ok: false,
            msg: "Avtorizatsiya qilmagansiz!",
          });
        } else {
          try {
            const { _id } = decoded;
            const $user = await userModel.findById(_id);
            if (!$user) {
              res.send({
                ok: false,
                msg: "Foydalanuvchi topilmadi!",
              });
            } else if ($user.block) {
              res.send({
                ok: false,
                msg: "Siz bloklangansiz!",
              });
            } else if (!$user.seller) {
              res.send({
                ok: false,
                msg: "Siz sotuvchi emassiz!",
              });
            } else {
              req.user = {
                _id,
              };
              next();
            }
          } catch (error) {
            res.send({
              ok: false,
              msg: "Xatolik!",
            });
          }
        }
      });
    }
  },
  operator: (req, res, next) => {
    const token = req?.headers["x-auth-token"];
    if (!token || !token?.startsWith("Bearer ")) {
      res.send({
        ok: false,
        msg: "Avtorizatsiya qilmagansiz!",
      });
    } else {
      const access = token?.replace("Bearer ", "");
      jwt.verify(access, USER_SECRET, async (err, decoded) => {
        if (err) {
          res.send({
            ok: false,
            msg: "Avtorizatsiya qilmagansiz!",
          });
        } else {
          try {
            const { _id } = decoded;
            const $user = await userModel.findById(_id);
            if (!$user) {
              res.send({
                ok: false,
                msg: "Operator topilmadi!",
              });
            } else if ($user.block) {
              res.send({
                ok: false,
                msg: "Siz bloklangansiz!",
              });
            } else if (!$user.operator) {
              res.send({
                ok: false,
                msg: "Siz operator emassiz!",
              });
            } else {
              req.user = {
                _id,
              };
              next();
            }
          } catch (error) {
            res.send({
              ok: false,
              msg: "Xatolik!",
            });
          }
        }
      });
    }
  },
  courier: (req, res, next) => {
    const token = req?.headers["x-auth-token"];
    if (!token || !token?.startsWith("Bearer ")) {
      res.send({
        ok: false,
        msg: "Avtorizatsiya qilmagansiz!",
      });
    } else {
      const access = token?.replace("Bearer ", "");
      jwt.verify(access, USER_SECRET, async (err, decoded) => {
        if (err) {
          res.send({
            ok: false,
            msg: "Avtorizatsiya qilmagansiz!",
          });
        } else {
          try {
            const { _id } = decoded;
            const $user = await userModel.findById(_id);
            if (!$user) {
              res.send({
                ok: false,
                msg: "Operator topilmadi!",
              });
            } else if ($user.block) {
              res.send({
                ok: false,
                msg: "Siz bloklangansiz!",
              });
            } else if (!$user.courier) {
              res.send({
                ok: false,
                msg: "Siz kuryer emassiz!",
              });
            } else {
              req.user = {
                _id,
              };
              next();
            }
          } catch (error) {
            res.send({
              ok: false,
              msg: "Xatolik!",
            });
          }
        }
      });
    }
  },
};
