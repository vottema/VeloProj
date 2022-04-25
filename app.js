const express = require('express'); // экспресс
const path = require('path'); // модуль path
const session = require('express-session');
// sessions
const FileStore = require('session-file-store')(session);
// хранение сессий папка sessions
const morgan = require('morgan'); // логер
const hbs = require('hbs'); // hbs
// дальше импортируем роутеры сюда!
const signupRouter = require('./routes/signup.route');
const signinRouter = require('./routes/singin.route');
const mainRouter = require('./routes/main.route');
const logoutRouter = require('./routes/logout.route');
const addRouter = require('./routes/add.route')
const infoRouter = require('./routes/info.route')

const app = express(); // создаем приложение экспресс
const port = process.env.PORT ?? 3000; // порт для деплоя либо 3000

// sessions
const sessionConfig = {
  store: new FileStore(),
  key: 'sid',
  secret: process.env.SECRET_KEY || 'secret',
  resave: false,
  saveUninitialized: false,
  httpOnly: true,
  cookie: { expires: 24 * 60 * 60e3 },
};
app.use(session(sessionConfig));
// set
app.set('view engine', 'hbs'); // движок hbs
app.set('views', path.join(process.env.PWD, 'views')); // путь
hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials'));// регистр партиалс

// use

app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
  }
  next();
});
// routing

app.use('/', mainRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/logout', logoutRouter);
app.use('/add', addRouter);
app.use('/info', infoRouter);

// listener
app.listen(port, () => console.log(`it works on port: ${port} !!!`));
