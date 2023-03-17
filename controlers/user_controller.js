const { User } = require("../models");
const Checkout = require("../models/Checkout");

exports.users_get = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

exports.checkout_status_post = async (req, res, next) => {
  try {
    const admin = await User.findByPk(req.params.userId);
    if (admin.isAdmin === true) {
      const checkoutToModified = await Checkout.findByPk(req.params.checkoutId);
      const modifiedStatus = await checkoutToModified.update(req.body);
      res.status(204).send(modifiedStatus);
    } else {
      res.send({ message: "error updating checkout" });
    }
  } catch (err) {
    return next(err);
  }
};

exports.admin_all_get = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user.isAdmin === true) {
      const users = await User.findAll({ include: { model: Checkout } });
      return res.status(200).send(users);
    } else return res.status(401).send({ error: "Your account is not admin" });
  } catch (err) {
    return next(err);
  }
};

exports.admin_user_delete = async (req, res, next) => {
  try {
    const admin = await User.findByPk(req.params.userId);
    if (admin.isAdmin === true) {
      const userToDelete = await User.findByPk(req.params.DeleteUserID);
      const deletedUser = await userToDelete.destroy();
      return res.status(204).send(deletedUser);
    }
    return res.status(401).send({ error: "Your account is not admin" });
  } catch (err) {
    return next(err);
  }
};

exports.admin_new_admin_put = async (req, res, next) => {
  try {
    const admin = await User.findByPk(req.params.userId);
    if (admin.isAdmin === true && admin.id !== req.params.newAdminId) {
      const userToMakeAdmin = await User.findByPk(req.params.newAdminId);
      if (userToMakeAdmin.isAdmin === true) {
        const newAdmin = await userToMakeAdmin.update({ isAdmin: false });
      } else {
        const newAdmin = await userToMakeAdmin.update({ isAdmin: true });
        return res.status(200).send(newAdmin);
      }
    }
    return res.status(401).send({ error: "Your account is not admin" });
  } catch (err) {
    return next(err);
  }
};

exports.user_find_by_id_get = async (req, res, next) => {
  try {
    const userToFind = await User.findByPk(req.params.id);
    return res.status(200).send(userToFind);
  } catch (err) {
    return next(err);
  }
};

exports.user_create_post = async (req, res, next) => {
  try {
    const { name, lastName, email, uid } = req.body;
    const NewUser = await User.findOrCreate({
      where: { name, lastName, email, uid },
    });
    return res.status(201).send(NewUser);
  } catch (err) {
    return next(err);
  }
};

exports.user_edit_put = async (req, res, next) => {
  try {
    const { name, lastName, uid, isAdmin } = req.body;

    const userToUpdate = await User.findByPk(req.params.id);
    const updatedUser = await userToUpdate.update({
      name,
      lastName,
      uid,
      isAdmin,
    });
    return res.status(200).send(updatedUser);
  } catch (err) {
    return next(err);
  }
};

exports.user_find_by_uid_get = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { uid: req.params.uid.toString() },
    });
    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};
