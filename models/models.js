const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    uuid: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    email: {type: DataTypes.STRING, unique: true },
    password: {type: DataTypes.STRING },
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false}, // is email confirmed
    activationLink: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER' }
    // devices: {type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: '' }
})

const Token = sequelize.define('token', {
    refreshToken: {type: DataTypes.TEXT}
    // refreshTokens: {type: DataTypes.ARRAY(DataTypes.TEXT)} // for access from multiply devices
})

const Profile = sequelize.define('profile', {
    uuid: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    balance: {type: DataTypes.DOUBLE, defaultValue: 0.0},
    savings: {type: DataTypes.DOUBLE, defaultValue: 0.0},
    currency: {type: DataTypes.STRING, allowNull: false }
})

const Item = sequelize.define('item', {
    uuid: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    type: {type: DataTypes.STRING, allowNull: false },  // EXPENSE, INCOME, SAVINGS
    isIncome: {type: DataTypes.BOOLEAN, defaultValue: false},  // IF SAVINGS: TRUE OR FALSE, IF EXPENSE: FALSE, IF INCOME: TRUE
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING },
    category: {type: DataTypes.STRING }, // IF SAVINGS: NONE
    amount: {type: DataTypes.DOUBLE, defaultValue: 0.0 },
    currency: {type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, field: 'createdAt' },
    updatedAt: { type: DataTypes.DATE, field: 'updatedAt' }
})

const Note = sequelize.define('note', {
    uuid: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    date: {type: DataTypes.DATE },
    content: {type: DataTypes.STRING }
})

const List = sequelize.define('list', {
    uuid: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
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