const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {type: DataTypes.STRING, unique: true },
    password: {type: DataTypes.STRING },
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false}, // is email confirmed
    activationLink: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER' }
})

const Token = sequelize.define('token', {
    refreshToken: {type: DataTypes.STRING}
    // refreshTokens: {type: DataTypes.ARRAY(DataTypes.TEXT)} // for access from multiply devices
})

const Profile = sequelize.define('profile', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    balance: {type: DataTypes.DOUBLE, defaultValue: 0.0},
    savings: {type: DataTypes.DOUBLE, defaultValue: 0.0},
    currency: {type: DataTypes.STRING, allowNull: false }
})

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: {type: DataTypes.DATE },
    type: {type: DataTypes.STRING, allowNull: false },
    isIncome: {type: DataTypes.BOOLEAN, defaultValue: false},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING },
    category: {type: DataTypes.STRING },
    amount: {type: DataTypes.DOUBLE, defaultValue: 0.0 },
    currency: {type: DataTypes.STRING }
})

const Note = sequelize.define('note', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: {type: DataTypes.DATE },
    description: {type: DataTypes.STRING }
})

const List = sequelize.define('list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: {type: DataTypes.ARRAY(DataTypes.TEXT) }
})

User.hasOne(Profile)
Profile.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

User.hasOne(List)
List.belongsTo(User)

User.hasMany(Item)
Item.belongsTo(User)

User.hasMany(Note)
Note.belongsTo(User)

module.exports = {
    User, Token, Profile, Item, Note, List
}