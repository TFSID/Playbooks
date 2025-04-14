import { DataTypes } from "sequelize";

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @returns {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>}
 */

const defineUserModel = (sequelize) => {
    const User = sequelize.define('User', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        contact: DataTypes.BIGINT
    });

    User.associate = function (models) {

    }

    User.sync();

    return User
}

export default defineUserModel