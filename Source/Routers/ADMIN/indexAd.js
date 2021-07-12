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

    //lấy ngày hiện tại và ngày cách 2 năm trước
    const now=new Date();
    const MonthDay=String(now.getMonth() + 1).padStart(2, '0')+'-'+String(now.getDate()).padStart(2, '0');
    const beforeDate=(now.getFullYear()-2)+'-'+ MonthDay;
    const today=now.getFullYear()+'-'+ MonthDay;

    const RevenueByLocations= await Bookings.getRevenueByLocation(beforeDate,today);
    const RevenueByMovies= await Bookings.getRevenueByMovie(beforeDate,today);

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

    const RevenueByLocations_Total = RevenueByLocations.map(function (obj){
        return obj.doanhthu;
    });

    const RevenueByLocations_Label = RevenueByLocations.map(function (obj){
        return obj.namelocation;
    });

    const RevenueByMovies_Total = RevenueByMovies.map(function (obj){
        return obj.doanhthu;
    });

    const RevenueByMovies_Label = RevenueByMovies.map(function (obj){
        return obj.namemovie;
    });

    res.locals.TongDoanhThuTheoThang = TongDoanhThuTheoThang.slice().reverse();
    res.locals.LabelTongDoanhThuTheoThang = LabelTongDoanhThuTheoThang.slice().reverse();
    res.locals.TongDoanhThuTheoNgay = TongDoanhThuTheoNgay.slice().reverse();
    res.locals.LabelTongDoanhThuTheoNgay = LabelTongDoanhThuTheoNgay.slice().reverse();

    res.locals.Today=today;
    res.locals.beforeDate=beforeDate;

    res.locals.ListRevenueByLocation=RevenueByLocations;
    res.locals.RevenueByLocations_Total=RevenueByLocations_Total.slice();
    res.locals.RevenueByLocations_Label=RevenueByLocations_Label.slice();

    res.locals.ListRevenueByMovie=RevenueByMovies;
    res.locals.RevenueByMovies_Total=RevenueByMovies_Total.slice();
    res.locals.RevenueByMovies_Label=RevenueByMovies_Label.slice();

    //lấy thông tin phân trang cho bảng doanh thu theo cụm và theo phim
    var pageSize=5;

    var lenLocation=RevenueByLocations.length;
    var numPageLocation=Math.floor(lenLocation/pageSize);
    if(lenLocation%pageSize>0)
    {
      numPageLocation+=1;
    }

    var lenMovie=RevenueByMovies.length;
    var numPageMovie=Math.floor(lenMovie/pageSize);
    if(lenMovie%pageSize>0)
    {
      numPageMovie+=1;
    }
    
    res.locals.pageSize=pageSize;
    res.locals.numPageLocation=numPageLocation;
    res.locals.numPageMovie=numPageMovie;
    res.render('ADMIN/index');
}));

router.get('/getRevenueByLocation',expressAsyncHandler(async function(req,res){
    try
    {
        const start=req.query.start;
        const end=req.query.end;
    
        const RevenueByLocations= await Bookings.getRevenueByLocation(start,end);

        res.send(JSON.stringify(RevenueByLocations));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
   
}));

router.get('/getRevenueByMovie',expressAsyncHandler(async function(req,res){
    try
    {
        const start=req.query.start;
        const end=req.query.end;
    
        const RevenueByMovies= await Bookings.getRevenueByMovie(start,end);
        res.send(JSON.stringify(RevenueByMovies));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
   
}));

module.exports=router;