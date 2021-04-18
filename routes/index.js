var express = require('express');
var router = express.Router();
var dbConnect='mongodb+srv://admin:admin@cluster0.axqha.mongodb.net/tinder?retryWrites=true&w=majority';
/* GET home page. */
const  mongoose =require('mongoose');
mongoose.connect(dbConnect,{useNewUrlParser:true,useUnifiedTopology:true});
var multer=require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        var chuoi=file.originalname;
        var duoi=file.originalname.slice(chuoi.length-4,chuoi.length);
        if(duoi=='.jpg'){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix+duoi)
        }else {
            cb('khong phải file jpg',null)
        }
    }
})
var upload1=multer({
    storage:storage,
}).single('avatar11')
const  db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function (){
  console.log('connection')
});
var user=new mongoose.Schema(
    {
      userName:String,
      mon:String,
        avatar:String,
    }
)
router.get('/', function(req, res, next) {
var type=req.query.type;
if(type=='json') {
    res.send(user)
}
    var userConnect1=db.model('users',user);
    userConnect1.find({},function (err,users) { //lay tat ca
        if(err){
            res.render('index',{title:'Express :err'+err})
        }
        res.render('index',{title:'Express :Success',users:users})
    })
});


//josn
router.get('/getUser',function (req,res){
    db.model('users',user).find({},function (err,users) {
        res.send(users);
    })
})


router.post('/',function (req,res){
    var userConnect=db.model('users',user);
    upload1(req, res, function (err){
        if(err){
            console.log(err)
            return;
        }else {
            userConnect({
                userName:req.body.userName,
                mon:req.body.mon,
                avatar:req.file.filename,
            }).save(function (err) {
                if(err){
                    res.render('index',{title:'Express :err'})
                }else {
                    var userConnect1=db.model('users',user);
                    userConnect1.find({},function (err,users) { //lay tat ca
                        if(err){
                            res.render('index',{title:'Express :err'+err})
                        }

                        res.render('index',{title:'Express :Success',users:users})
                    })
                }
            })
        }
    });
})


router.get('/deleteUsers/:id',function (req,res) {

    db.model('users',user).deleteOne({ _id: req.params.id}, function (err) {
        if (err) {
            console.log('Lỗi')
        }

            res.redirect('../')

    });
})



router.get('/updateUser/:id',function (req,res) {
    console.log('id:'+req.params.id)
    db.model('users',user).findById(req.params.id,function (err,data) {
        if(err){
            console.log("loi")
        }else {
            res.render("updateUser",{dulieu: data})

        }
    })
})
router.post('/updateUser',function (req,res) {
    var userConnect=db.model('users',user);
    console.log('name:'+req.body._id)

    upload1(req, res, function (err){
        if(err){
            console.log(err)

        }else {
            if(!req.file){
                console.log('name:'+req.body.userNameUd)
                userConnect.updateOne(req.body._id,{
                    userName:req.body.userNameUd,
                    mon:req.body.monUd,
                },function (err) {
                    if(err){
                        console.log(err)
                    }else {
                        res.redirect('../')
                    }
                }  )
            }else {

                console.log('name2:'+req.body.userNameUd)
                userConnect.updateOne(req.body._id,{

                    userName:req.body.userNameUd,
                    mon:req.body.monUd,
                    avatar:req.file.filename,
                },function (err) {
                    if(err){
                        console.log(err)
                    }else {
                        res.redirect('../')
                    }
                }  )
            }
            }

    });



})

module.exports = router;
