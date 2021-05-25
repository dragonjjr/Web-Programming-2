//module
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

//database
const db=require('./Models/database');

//middleware
const authMiddleware=require('./Middlewares/auth');

//router
const authRouter=require('./Routers/USER/auth');
const homePageRouter=require('./Routers/USER/homePage');
const movieRouter=require('./Routers/USER/movie');
const movieTheaterRouter=require('./Routers/USER/movieTheater');
const bookingRouter=require('./Routers/USER/booking');
const infoRouter=require('./Routers/USER/infoManagement');

//app
const app=express();

//session
app.use(cookieSession({
    name: 'session',
    //key để đảm bảo cookie này do server tạo ra, bí mật, nếu sửa cookie sẽ reload value
    keys: [process.env.COOKIE_KEY||'secret'],
    // Cookie Options (thời gian timeout)
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);

app.use(authMiddleware);

app.use('/auth',authRouter);
app.use('/',homePageRouter);
app.use('/information',infoRouter);
app.use('/movie',movieRouter);
app.use('/movietheater',movieTheaterRouter);
app.use('/booking',bookingRouter);

// thêm template EJS (sử dụng để code giao diện)
app.set('views', './Views');
app.set('view engine','ejs');
app.set('layout','./Layouts/layoutUser');


// folder Assets
app.use(express.static(__dirname + '/Assets'));


//connect
db.sync().then(function(){
    const port=process.env.PORT||3000;
    console.log(`Server is listening on port ${port}`);
    app.listen(port);
}).catch(console.error);