'use strict';

//bcrypt
const bcrypt = require('bcryptjs/dist/bcrypt');

const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    toSafeObject() {
      const { id, username, email, firstName, lastName} = this;
      return { id, firstName, lastName, email, username}
    }

    validatePassword(password){
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static getCurrentUserById(id) {
      return User.scope('currentUser'.findByPk(id))
    }

    //Returning users:
    static async login({ credential, password}){
      const { Op } = require('sequelize')
      const user = await User.scope('loginUser'). findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if(user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ firstName, lastName, username, email, password}) {
      const hashedPassword = bcrypt.hashSync(password)
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword
      });

      return await User.scope('currentUser').findByPk(user.id);
    } 

    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len: [4, 30],
        isNotEmail(value) {
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len: [4, 30],
        isNotEmail(value) {
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    username:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        len: [4, 30],
        isNotEmail(value) {
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        len: [60,60]
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope:{
      attributes:{
        exclude: ['email', 'hashedPassword', 'createdAt', 'updatedAt']
      }
    },
    scopes:{
      currentUser: {
        attributes: { exclude: ['hashedPassword'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};
