const S = require("sequelize");
const db = require("../db");

class User extends S.Model { }
User.init(
  {
    name: {
      type: S.STRING,
      /* allowNull: false, */
    },
    lastName: {
      type: S.STRING,
   /*    allowNull: false, */
    },
    fullName: {
      type: S.VIRTUAL,
      get() {
        return `${this.name} ${this.lastName}`;
      },
    },
    uid: {
      type: S.STRING,
    },
    isAdmin: {
      type: S.BOOLEAN,
      defaultValue: false 
    },
    address: {
      type: S.STRING
    },
    email: {
      type: S.STRING,
     /*  allowNull: false, */
      unique: true,
      validate: {
        isEmail: true,
      },
    }
  },
  { sequelize: db, modelName: "user" }
);


module.exports = User;