const { Product, Artist, User } = require("../models");
const {
  charlesWhite,
  GeorgiaOKeeffe,
  JohnSingerSargent,
  GeorgesSeurat,
  IvanAlbright,
  MariaHelenaVieira,
  andyWarhol,
  grantWood,
} = require("../config/seedProducts");

exports.find_all_get = async (req, res, next) => {
  try {
    const allProducts = await Product.findAll({ include: { model: Artist } });
    return res.status(200).send(allProducts);
  } catch (err) {
    return next(err);
  }
};

const artists = [
  charlesWhite,
  GeorgiaOKeeffe,
  JohnSingerSargent,
  GeorgesSeurat,
  IvanAlbright,
  MariaHelenaVieira,
  grantWood,
  andyWarhol,
];

exports.create_bulk_by_artist_post = async (req, res, next) => {
  const createdProducts = [];
  let artistId = 1;

  for (const artist of artists) {
    try {
      const products = await Product.bulkCreate(
        artist.map((artwork) => ({ ...artwork, artistId }))
      );
      createdProducts.push(...products);
      artistId++;
      if (artistId > artists.length) {
        return res.status(201).send(createdProducts);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

exports.find_by_id_get = async (req, res, next) => {
  try {
    const productFound = await Product.findOne({
      where: { id: req.params.id },
      include: { model: Artist },
    });
    if (productFound) {
      return res.status(200).send(productFound);
    } else {
      return res.status(404).send({ error: "product not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.admin_by_product_id_delete = async (req, res, next) => {
  try {
    const AdminUser = await User.findByPk(req.params.userId);
    if (AdminUser.isAdmin === true) {
      const productToDelete = await Product.findByPk(req.params.productId);
      await productToDelete.destroy();
      return res.status(204).send("product deleted from database");
    } else {
      return res.status(401).send({ error: "Your account is not admin" });
    }
  } catch (err) {
    return next(err);
  }
};

exports.admin_add_post = async (req, res, next) => {
  try {
    const { name, price, description, category, photo_url, artistId } =
      req.body;
    const AdminUser = await User.findByPk(req.params.userId);
    if (AdminUser.isAdmin === true) {
      const newProduct = await Product.create({
        name,
        price,
        description,
        category,
        photo_url,
        artistId,
      });
      console.log("NUEVO PRODUCT", newProduct);
      return res.status(201).send(newProduct);
    } else {
      return res.status(401).send({ error: "Your account is not admin" });
    }
  } catch (err) {
    return next(err);
  }
};

exports.admin_edit_product_put = async (req, res, next) => {
  console.log("QUE LLEGA AL BACK", req.body.updatedItem);
  try {
    const { name, price, description, category } = req.body.updatedItem;
    const AdminUser = await User.findByPk(req.params.userId);
    if (AdminUser.isAdmin === true) {
      const productToEdit = await Product.findByPk(req.params.productId);
      const editedProduct = await productToEdit.update({
        name,
        price,
        description,
        category,
      });
      return res.status(200).send(editedProduct);
    } else {
      return res.status(401).send({ error: "Your account is not admin" });
    }
  } catch (err) {
    return next(err);
  }
};
