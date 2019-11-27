const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.login = req.body.login;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Найден повторяющийся адрес электронной почты']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // вызов паспорта аунтификации
    passport.authenticate('local', (err, user, info) => {       
        // ошибка 
        if (err) return res.status(400).json(err);
        // пользователь зарегистрирован
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // неправильный логин или пароль
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'Пользователь не найден.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','login']) });
        }
    );
}