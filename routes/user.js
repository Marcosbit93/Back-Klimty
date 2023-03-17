const express = require("express");
const { User } = require("../models");
const router = express.Router();
const Checkout = require("../models/Checkout");
const user_controler = require("../controlers/user_controller")

// GET PARA TRAER TODOS LOS USUARIOS
router.get('/', user_controler.users_get)

// ruta para modificar el estado de una orden de compra o checkout, Post para que pueda agarra el req.body, 

router.post("/:userId/status/:checkoutId", user_controler.checkout_status_post)


router.get("/:userId/all", user_controler.admin_all_get)
    
router.delete("/:userId/delete/:DeleteUserID", user_controler.admin_user_delete)

router.put(`/:userId/edit/:newAdminId`, user_controler.admin_new_admin_put)


// GET PARA BUSCAR UN USUARIO POR ID

router.get(`/:id`, user_controler.user_find_by_id_get);


// POST PARA CREAR EL USUARIO

router.post("/", user_controler.user_create_post);

// POST PARA CREAR EL USUARIO DESDE PANEL DE ADMIN

router.post("/:id/add", user_controler.admin_create_new_user);

// PUT PARA EDITAR EL USUARIO

router.put(`/edit/:id`, user_controler.user_edit_put);

// GET USER UID
router.get("/uid/:uid", user_controler.user_find_by_uid_get);


module.exports = router;
