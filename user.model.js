const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Поле ФИО обязательно к заполнению.'
    },
    login: {
        type: String,
        required: 'Поле логин обязательно к заполнению.',
        unique: true
    },
    password: {
        type: String,
        required: 'Поле пароль обязательно к заполнению.',
        minlength: [4, 'Длина пароля минимум 4 символа.']
    },
    saltSecret: String
});

// Валидация
userSchema.path('login').validate((val) => {
    loginRegex = /^((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\[0-9]{1,3}\])|(([a-zA-Z\-0-9])+[a-zA-Z\-0-9]{2,}))$/;
    return loginRegex.test(val);
}, 'Некорректный логин.');

// Хеширование
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Метод верификации
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



mongoose.model('User', userSchema);