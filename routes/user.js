const express = require("express");
const { User } = require("../models");
const router = express.Router();

// GET PARA TRAER TODOS LOS USUARIOS

router.get("/", (req, res) => {
    User.findAll().then((users) => res.status(200).send(users))
})


router.get("/:userId/all", (req, res) => {
    const userId = req.params.userId
    User.findByPk(userId).then((user) => {
        if (user.isAdmin === true) {
            User.findAll()
                .then((allUsers) => {
                    res.status(201).send(allUsers);
                })
                .catch((err) => res.status(400).send(err));
        } else {
            res.status(401).send({ error: "the user is not admin" })
        }
    })
        .catch(() => ({ error: "failed to find the admin user" }))
})
    
router.delete("/:userId/delete/:DeleteUserID", (req, res, next) => {
    const userId = req.params.userId
    const DeleteUserID = req.params.DeleteUserID
    User.findByPk(userId).then((user) => {
        if (user.isAdmin === true) {
            User.findByPk(DeleteUserID).then((user) => {
                user.destroy().then((date) => res.status(200).send(date))
            })
                .catch(() => ({ error: "failed to find the user to delete" }))
        } else {
            res.status(401).send({ error: "the user is not admin" })
        }
    })
    .catch((next))
})

router.put(`/:userId/edit/:newAdminId`, (req, res, next) => {
    const userId = req.params.userId
    const newAdminId = req.params.newAdminId
    const isAdmin = true
    User.findByPk(userId).then((user) => {
        if (user.isAdmin === true) {
            User.findByPk(newAdminId).then((user) => {
                user.update({isAdmin}).then((newAdmin) => res.status(200).send(newAdmin))
            })
                .catch(() => ({ error: "failed to find the user to make admin" }))
        } else {
            res.status(401).send({ error: "the user is not admin" })
        }
    })
    .catch((next))
  });

           
// GET PARA BUSCAR UN USUARIO POR ID

router.get(`/:id`, (req, res) => {
  const { id } = req.params;
  User.findOne({ where: { id: id } })
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(404).send({ error: "failed to find the user" }));
});

router.get(`/:uid`, (req, res) => {
    const { uid } = req.params;
    User.findOne({ where: { uid } })
      .then((user) => res.status(200).send(user))
      .catch((err) => res.status(404).send({ error: "failed to find the user" }));
  });

// POST PARA CREAR EL USUARIO

router.post("/", (req, res, next) => {
  console.log("CONSOLE LOG DEL REQ BODY", req.body);
  const { name, lastName, email, uid } = req.body;
  User.findOrCreate({ where: { name, lastName, email, uid } })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch(next);
});

// PUT PARA EDITAR EL USUARIO

router.put(`/edit/:id`, (req, res, next) => {
  const { name, lastName, uid, email, isAdmin } = req.body;
  User.findByPk(req.params.id)
    .then((user) => {
      user
        .update({ name, lastName, uid, email, isAdmin })
        .then((editUser) => res.status(201).send(editUser))
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
