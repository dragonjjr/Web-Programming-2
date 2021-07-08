const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../../Models/users');
const Bookings = require('../../Models/booking');
const router = express.Router();

//set layout
router.use(function (req,res,next){
    res.locals.layout='Layouts/layoutAdmin';
    next();
})

router.use(function (req,res,next){
    res.locals.title='Home';
    next();
})

router.get('/',expressAsyncHandler(async function(req,res){
    const TotalRevenueByMonth = await Bookings.getTotalRevenueByMonth();
    const TotalRevenueByDay = await Bookings.getTotalRevenueByDay();

    const TongDoanhThuTheoThang = TotalRevenueByMonth.map(function (obj) {
        return obj.doanhthu;
      });
    const LabelTongDoanhThuTheoThang = TotalRevenueByMonth.map(function (obj) {
        return 'Tháng '+ obj.thang+'/'+obj.nam;
    });

    const TongDoanhThuTheoNgay = TotalRevenueByDay.map(function (obj){
        return obj.doanhthu;
    });
    const LabelTongDoanhThuTheoNgay = TotalRevenueByDay.map(function (obj) {
        return obj.ngay + '/' + obj.thang + '/' + obj.nam;
    });

    res.locals.TongDoanhThuTheoThang = TongDoanhThuTheoThang.slice().reverse();
    res.locals.LabelTongDoanhThuTheoThang = LabelTongDoanhThuTheoThang.slice().reverse();
    res.locals.TongDoanhThuTheoNgay = TongDoanhThuTheoNgay.slice().reverse();
    res.locals.LabelTongDoanhThuTheoNgay = LabelTongDoanhThuTheoNgay.slice().reverse();

    res.render('ADMIN/index');
}));


module.exports=router;