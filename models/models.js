const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const bcrypt = require("bcrypt");

/** ---------- MODELS ---------- **/
// User Model
const User = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
            isEmail: true
        }
    },
    type : {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user" // admin, topo, dg = 'directeurG', dq = 'directeurQ', user
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    hooks: {
        beforeCreate: async (user) => {
            if(user.password)
            {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if(user.password)
            {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    },

    timestamps: true
});

// GeoDatas Model
const GeoJsonData = sequelize.define("geojsondata", {
    filename: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mimetype : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    editing : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

// Workspace Model
/*const Workspace = sequelize.define("workspace", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});*/

GeoJsonData.belongsTo(User, { foreignKey: { name: 'userId', allowNull: true } });
User.hasMany(GeoJsonData, { foreignKey: { name: 'userId', allowNull: true } });
/*Workspace.belongsTo(User, { foreignKey: 'owner' });
User.hasMany(Workspace, { foreignKey: 'owner' });*/

/*GeoJsonData.belongsTo(Workspace, { foreignKey: 'workspaceId' });
Workspace.hasMany(GeoJsonData, { foreignKey: 'workspaceId' });*/

/** ---------- OPERATIONS ---------- **/
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = {
    User,
    GeoJsonData,
    sequelize
};