var express = require('express')
var app = express()
var http = require('http');
var url = require('url');
var fs = require('fs');
var axios = require('axios').default;
var ObjectId = require('mongodb').ObjectId
var session = require('express-session')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended:false});
var MongoClient = require('mongodb').MongoClient;
var sess;
app.get('/', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status) {
        axios.get('http://54.167.107.139:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/all', {
            name : sess.username,
            status : sess.status, 
            title : 'Semua',
            subtitle : 'Dashboard Semua Data',
        data : getData
      })      
      return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/registeradmin', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin") {
      res.render('admin/register', {
            name : sess.username,
            status : sess.status, 
            title : 'Register Admin',
            subtitle : 'Dashboard Register Admin'
      })      
    }else{
      res.redirect('loginpage');
    }
})
app.post('/register',urlencodedParser,function(req,res){
    sess = req.session;
    if(sess.username &&  sess.status == "SuperAdmin") {
    var username = req.body.username; 
    var password =req.body.password; 
    var status = req.body.status; 
  
    var data = { 
        "username": username, 
        "status":status, 
        "password":password
    } 
   MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function(db,err) {
   req.db.collection('admin').findOne({ username: username}, function(err, user) {
             if(user ===null){
req.db.collection('admin').insertOne(data,function(err, collection){ 
        if (err) throw err; 
            return res.end("done");
              
    }); 
             }else if (user.username === username){
            return res.end("done");
          } else {
            return res.end("done");
          }
   });
 });
           }else{
      res.redirect('loginpage');
    }

});
app.get('/admin', function(req, res, next) {
    // fetch and sort users collection by id in descending order
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin") {
    req.db.collection('admin').find().sort({"_id": -1}).toArray(function(err, result) {
        //if (err) return console.log(err)
        if (err) {
            req.flash('error', err)
            res.render('admin/admin', {
            name : sess.username,
            status : sess.status, 
              title : 'Admin',
              subtitle : 'Dashboard Admin',
                data: ''
            })
        } else {
            // render to views/user/list.ejs template file
            res.render('admin/admin', {
            name : sess.username,
            status : sess.status, 
              title : 'Admin',
              subtitle : 'Dashboard Admin',
                data: result
            })
        }
    })
   }else{
      res.redirect('loginpage');
    }
})
app.get('/editadmin/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin") {
      var o_id = new ObjectId(req.params.id)
    req.db.collection('admin').find({"_id": o_id}).toArray(function(err, result) {
        if(err) return console.log(err)
        
        // if user not found
        if (!result) {
            res.redirect('/admin')
        }
        else { // if user found
            // render to views/user/edit.ejs template file
            res.render('admin/editadmin', {
                title: 'Edit Admin', 
            name : sess.username,
            status : sess.status, 
                id: result[0]._id,
                username: result[0].username              
            })
        }
    })}    
else{
      res.redirect('/loginpage');
    }
})
app.post('/editadm/(:id)',urlencodedParser,function(req,res,next){
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin") {
    var aid = new ObjectId(req.params.id)
    var username = req.body.username; 
    var password =req.body.password; 
    var status = req.body.status; 
  
    var data = { 
        username: username, 
        status:status, 
        password:password
    } 
   MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function(db,err) {
req.db.collection('admin').updateOne({"_id": aid}, data,function(err, collection){ 
        if (err) throw err; 
          return res.end("done");              
    }); 
 });
           }else{
      res.redirect('loginpage');
    }

});
app.get('/deleteadmin/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin") {
        var o_id = new ObjectId(req.params.id)
    req.db.collection('admin').deleteOne({"_id": o_id}, function(err, result) {
        if (err) {
            res.redirect('/admin')
        } else {
            // redirect to users list page
            res.redirect('/admin')
        }
    })    
}else{
      res.redirect('/loginpage');
    }
})
app.get('/loginpage',(req,res) => {
    res.render('admin/login');
});
 app.post('/login',urlencodedParser,function(req,res){
    sess = req.session;
    if (req.body.username == "admin" && req.body.password == "admin"){
          sess.username = "admin";
          sess.status = "SuperAdmin";
          return res.end("done");
          }
   MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function(db,err) {
   req.db.collection('admin').findOne({ username: req.body.username}, function(err, user) {
             if(user ===null){
               res.render('admin/login');
             }else if (user.username === req.body.username && user.password === req.body.password){
          sess.username = user.username;
            sess.status = user.status;
            return res.end("done");
          } else {
                res.render('admin/login');
          }
   });});
});
app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/loginpage');
    });

});
app.get('/ditunda', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status) {
    axios.get('http://54.167.107.139:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
        title : 'Ditunda',
            name : sess.username,
            status : sess.status, 
        subtitle : 'Dashboard Ditunda',
            data : getData
      })
      return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/diterima', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status) {
    axios.get('http://54.167.107.139:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
            name : sess.username,
            status : sess.status, 
        title : 'Diterima',
        subtitle : 'Dashboard Diterima',
            data : getData
      })
      return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/dikerjakan', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status) {
    axios.get('http://54.167.107.139:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
            name : sess.username,
            status : sess.status, 
        title : 'Dikerjakan',
        subtitle : 'Dashboard Diterima',
            data : getData
      })
      return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/ditolak', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status) {
    axios.get('http://54.167.107.139:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
            name : sess.username,
            status : sess.status, 
        title : 'Ditolak',
        subtitle : 'Dashboard Ditolak',
            data : getData
      })
      return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/selesai', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status) {
    axios.get('http://54.167.107.139:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
            name : sess.username,
            status : sess.status, 
        title : 'Selesai',
        subtitle : 'Dashboard Selesai',
            data : getData
      })
      return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/laporan/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/laporan/','');
   axios.get('http://54.167.107.139:4000/me').then(response => {
        var getData = response.data.data;
        res.render('laporan/showlaporan', {
            name : sess.username,
            status : sess.status, 
            title : 'Laporan',
            id : id_laporan,
            data : getData
        })
        return response;
    })
    return
    }else{
      res.redirect('/loginpage');
    }
})
app.get('/ketunda/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin" || sess.status == "Admin1") {
   var laporan = req.url;
   var id_laporan = laporan.replace('/ketunda/','');
   const date = Date(Date.now());
   axios.put('http://54.167.107.139:4000/pengaduan/'+id_laporan,{
    status : "Ditunda",date : date});
    res.redirect('/ditunda');
    }else{
      res.redirect('/loginpage');
    }
})
app.get('/keterima/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin" || sess.status == "Admin1") {
   var laporan = req.url;
   var id_laporan = laporan.replace('/keterima/','');
   const date = Date(Date.now());
   axios.put('http://54.167.107.139:4000/pengaduan/'+id_laporan,{
    status : "Diterima",date : date});
    res.redirect('/diterima');
    }else{
      res.redirect('/loginpage');
    }
})
app.get('/ketolak/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin" || sess.status == "Admin1") {
   var laporan = req.url;
   var id_laporan = laporan.replace('/ketolak/','');
   const date = Date(Date.now());
   axios.put('http://54.167.107.139:4000/pengaduan/'+id_laporan,{
    status : "Ditolak",date : date});
    res.redirect('/ditolak');
    }else{
      res.redirect('/loginpage');
    }
})
app.get('/keselesai/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin" || sess.status == "Admin1") {
   var laporan = req.url;
   var id_laporan = laporan.replace('/keselesai/','');
   const date = Date(Date.now());
    axios.put('http://54.167.107.139:4000/pengaduan/'+id_laporan,{
    status : "Selesai",date : date});
    res.redirect('/selesai');
    }else{
      res.redirect('/loginpage');
    }
})
app.get('/kerjakan/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin" || sess.status == "Admin1") {
   var laporan = req.url;
   var id_laporan = laporan.replace('/kerjakan/','');
   const date = Date(Date.now());
    axios.put('http://54.167.107.139:4000/pengaduan/'+id_laporan,{
    status : "Dikerjakan",date : date});
    res.redirect('/dikerjakan');
    }else{
      res.redirect('/loginpage');
    }
})
app.get('/kehapus/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username && sess.status == "SuperAdmin" || sess.status == "Admin1") {
   var laporan = req.url;
   var id_laporan = laporan.replace('/kehapus/','');
   axios.delete('http://54.167.107.139:4000/pengaduan/'+id_laporan);
   res.redirect('/');
    }else{
      res.redirect('/loginpage');
    }
})
module.exports = app;
