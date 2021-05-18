//module
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

//database
const db=require('./Models/database');

//router
const loginRouter=require('./Routers/auth');
const authMiddleware=require('./Middlewares/auth');

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
app.use(authMiddleware);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);
// thêm template EJS (sử dụng để code giao diện)
app.set('views', './Views');
app.set('view engine','ejs');

app.use('/auth',loginRouter);

// folder Assets
app.use(express.static(__dirname + '/Assets'));


//homepage
app.get('/',function(req,res)
{
    res.render('index',{title: 'Home'});
});


//connect
db.sync().then(function(){

    const port=process.env.PORT||3000;
  
    console.log(`Server is listening on port ${port}`);

    app.listen(port);
  
  }).catch(console.error);
