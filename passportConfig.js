  
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'login' },
        (username, password, done) => {
            User.findOne({ login: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // Если логин не найден в бд
                    else if (!user)
                        return done(null, false, { message: 'Логин не найден' });
                    // неправильный пароль
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Неправильный пароль.' });
                    // если все ок
                    else
                        return done(null, user);
                });
        })
);