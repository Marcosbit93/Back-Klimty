const express = require("express");
const { Cart, User, Product } = require("../models");
const nodemailer = require("nodemailer")
const smtpTransport = require('nodemailer-smtp-transport');

const router = express.Router();

// SOLO SE CREAN CARRITOS AL DESPACHAR ORDEN DE COMPRA Y REGISTRO DE USUARIO NUEVO

// Get all carts
// historial => findAll solo carritos con status false
router.get("/", (req, res, next) => {
  Cart.findAll()
    .then((carts) => res.send(carts))
    .catch(next);
});

// Get cart by ID ??????????
router.get("/:id", (req, res, next) => {
  Cart.findByPk(req.params.id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }
      res.send(cart);
    })
    .catch(next);
});

// Create a new cart
router.post("/:userId", (req, res, next) => {
  Cart.create({ userId: req.params.userId, state: true })
    .then((cart) => res.status(201).send(cart))
    .catch(next);
});

// Add product to cart
//FRONT!! mandar dentro de la ruta el ID del USER y el ID del PRODUCT a agregar

router.post("/:userId/add/:productId", (req, res, next) => {
  const { userId, productId } = req.params;

  User.findByPk(userId).then((user) => {
    if (!user) res.status(404).send("User not found");
  });
  Product.findByPk(productId).then((product) => {
    if (!product) res.status(404).send("User not found");
  });

  Cart.findOne({
    where: { userId, state: true },
  })
    .then((cart) => {
      const productIndex = cart.products.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex === -1) {
        cart.update({
          products: [...cart.products, { quantity: 1, productId }],
        });
      } else {
        const updatedProducts = cart.products.map((product, index) => {
          if (index === productIndex) {
            return { ...product, quantity: product.quantity + 1 };
          } else {
            return product;
          }
        });

        cart.update({ products: updatedProducts });
      }

      res.send(cart);
    })
    .catch(next);
});

// Delete product by ID from cart
//FRONT!! mandar dentro de la ruta el ID del USER y el ID del PRODUCT a eliminar
router.post("/:userId/delete/:productId", (req, res, next) => {
  const { userId, productId } = req.params;

  User.findByPk(userId).then((user) => {
    if (!user) res.status(404).send("User not found");
  });
  Product.findByPk(productId).then((product) => {
    if (!product) res.status(404).send("User not found");
  });

  Cart.findOne({
    where: { userId, state: true },
  })
    .then((cart) => {
      const productIndex = cart.products.findIndex(
        (item) => item.productId === productId
      );

      if (cart.products[productIndex].quantity > 1) {
        const updatedProducts = cart.products.map((product, index) => {
          if (index === productIndex) {
            return { ...product, quantity: product.quantity - 1 };
          } else {
            return product;
          }
        });
        cart.update({ products: updatedProducts });
      } else {
        const updatedProducts = cart.products.filter(
          (product) => product.productId !== productId
        );
        cart.update({ products: updatedProducts });
      }

      res.send(cart);
    })
    .catch(next);
});

// EDIT THE AMOUNT OF PRODUCT IN CART
router.post("/:userId/edit/:productId", (req, res, next) => {
    const { userId, productId } = req.params;
    const { amount } = req.query;
  
    User.findByPk(userId).then((user) => {
      if (!user) res.status(404).send("User not found");
    });
    Product.findByPk(productId).then((product) => {
      if (!product) res.status(404).send("Product not found");
    });
  
    Cart.findOne({
      where: { userId, state: true },
    })
      .then((cart) => {
        const productIndex = cart.products.findIndex(
          (item) => item.productId === productId
        );
        if (amount > 0) {
          const updatedProducts = cart.products.map((product, index) => {
            if (index === productIndex) {
              return { ...product, quantity: parseInt(amount) };
            } else {
              return product;
            }
          });
          cart.update({ products: updatedProducts });
        } else {
          const updatedProducts = cart.products.filter(
            (product) => product.productId !== productId
          );
          cart.update({ products: updatedProducts });
        }
        res.status(204).send(cart);
      })
      .catch(next);
  });



// IGNORAR =>

router.post("/:userId/checkout", async(req, res, next) => {
  const userId = req.params.userId;
   const cart = await Cart.findOne({ where: { userId, state: true } })
    const totalCart = cart.dataValues.products
    console.log("CONSOLE LOG ", totalCart)

    const list = totalCart.map((item) => item.productId)
    const AmountOfProduct = totalCart.map((item) => item.quantity)

    const ListOfProduts = await list.map((item) => Product.findByPk(item) )

   console.log("I HOPE YOU ARE FULL ", ListOfProduts)

    console.log("CONSOLE LOG DE LISTA", list)

    console.log("CONSOLE LOG DE AmountOfProduct", AmountOfProduct)

   



    cart.state = false
  /*   console.log("CONSOLE LOG DE CART, TENDRIA QUE SER FALSE -->", cart) */

  const newCart = await Cart.create({ userId: req.params.userId, state: true })
     
      res.status(201).send(cart)

     let transport = nodemailer.createTransport(smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "klimtyecommerce@gmail.com",
        pass: "auaboiqezvqpvulg",
      },
    })); 

    User.findByPk(userId).then((user) => {
      const { name, lastName, email } = user

/*       
  const address2 = localStorage.getItem("address2");
  const name = localStorage.getItem("name");
  const lastName = localStorage.getItem("lastName");
  const address1 = localStorage.getItem("address1");
 */
      
       const message = {
        from: "klimtyecommerce@gmail.com",
        to: email,
        subject: `Your purchased all the items on your cart.`,
        text: "Don't really have much to say",
        html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer'
      };
      transport.sendMail(message, (err, data) => {
        if (err) {
           console.log(err)
        } else {
          console.log("Message sent: ", data.messageId)
        }
        }) 
      }); 
    

/* 
    localStorage.removeItem("address2");
    localStorage.removeItem("name");
    localStorage.removeItem("lastName");
    localStorage.removeItem("address1"); */
  
});

router.get("/:userId/historial", (req, res, next) => {
  const userId = req.params.userId
  Cart.findAll({ where: { userId, state: false } }).then((pastCarts) => {
    const carts = pastCarts
    const exProducts = pastCarts.map((item) => item.products)
    res.status(200).send(exProducts)
  })
})



module.exports = router;
