const { DataTypes } = require('sequelize');
const db=require('./database');

const User = db.define('User', {
    // Model attributes are defined here
    Email: {
      type: DataTypes.STRING,
       allowNull: true,
    },
    Password: {
        type: DataTypes.STRING,
         allowNull: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    Phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },   
    Role:{
        type: DataTypes.STRING,
        allowNull: true,
    },  
      //mã xác thực
    Token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  },{
       // Other model options go here
  });

User.createUser = async function(name,email,pwd,phone,role,token) {
    await User.create({
        Email:email,
        Password:pwd,
        Name: name,
        Phone: phone,
        Role: role,
        Token:token
    });

}

User.findByEmail= async function(email)
{
    return await User.findOne({
        where: {
            Email: email
        },
    });
};

User.findById= async function(id)
{
    return await User.findByPk(id);
};

User.activate= async function(emailActivate,token)
{
    const user= await User.findOne({
        where: {
            Email: emailActivate,
        },
      });

    //kiểm tra người dùng có tồn tại và kiểm mã xác thực
    if(user!=null)
    {
        if(user.Token===token)
        {
            user.Token=null;
            await user.save();
            return true;
        }
    }
    return false;

};
module.exports=User;