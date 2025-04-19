const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const bcrypt = require("bcrypt");

/** ---------- MODELS ---------- **/
// User Model
const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
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
const GeoJsonData = sequelize.define("GeojsonData", {
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
const Workspace = sequelize.define("Workspace", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

// Layer Model
const Layer = sequelize.define("Layer", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
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
});

/** ---------- RELATIONS ---------- **/
Workspace.belongsTo(User, { foreignKey: 'owner', allowNull: true });
User.hasMany(Workspace, { foreignKey: 'owner', allowNull: true });

Layer.belongsTo(User, { foreignKey: 'owner' });
User.hasMany(Layer, { foreignKey: 'owner' });

Layer.belongsTo(Workspace, { foreignKey: 'workspaceId' });
Workspace.hasMany(Layer, { foreignKey: 'workspaceId' });

Layer.hasOne(GeoJsonData, { foreignKey: { name : "layerId", allowNull: true }, onDelete: 'CASCADE' });
GeoJsonData.belongsTo(Layer, { foreignKey: { name : "layerId", allowNull: true } });

User.belongsToMany(Workspace, { through: "UserWorkspaces" });
Workspace.belongsToMany(User, { through: "UserWorkspaces" });

/** ---------- OPERATIONS ---------- **/
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = {
    User,
    GeoJsonData,
    Workspace,
    Layer,
    sequelize
};