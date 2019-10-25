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
var url = 'mongodb://localhost:27017/admin';
var sess;
app.get('/', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
        axios.get('http://35.172.178.112:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/all', {
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
app.get('/loginpage',(req,res) => {
    res.render('admin/login');
});
 app.post('/login',urlencodedParser,function(req,res){
    sess = req.session;
    sess.username = req.body.username;
   MongoClient.connect(url, function(db,err) {
   req.db.collection('admin').findOne({ username: req.body.username}, function(err, user) {
             if(user ===null){
               res.render('admin/login');
             }else if (user.username === req.body.username && user.password === req.body.password){
            res.end("done");
          } else {
                res.render('admin/login');
          }
   });
 });
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
    if(sess.username) {
    axios.get('http://35.172.178.112:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
        title : 'Ditunda',
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
    if(sess.username) {
    axios.get('http://35.172.178.112:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
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
    if(sess.username) {
    axios.get('http://35.172.178.112:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
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
    if(sess.username) {
    axios.get('http://35.172.178.112:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
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
    if(sess.username) {
    axios.get('http://35.172.178.112:4000/me').then(response => {
      var getData = response.data.data;
      res.render('laporan/laporan', {
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
    if(sess.username) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/laporan/','');
   axios.get('http://35.172.178.112:4000/me').then(response => {
        var getData = response.data.data;
        res.render('laporan/showlaporan', {
            title : 'Laporan',
            id : id_laporan,
            data : getData
        })
        return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/keterima/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/keterima/','');
   axios.get('http://35.172.178.112:4000/me').then(response => {
        var getData = response.data.data;
        res.render('laporan/showlaporan', {
            title : 'Laporan',
            id : id_laporan,
            data : getData
        })
        return response;
    })
    return
    }else{
      res.redirect('loginpage');
    }
})
app.get('/ketunda/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/ketunda/','');
   axios.put('http://35.172.178.112:4000/pengaduan/'+id_laporan,{
    status : "Ditunda"});
    res.redirect('/');
    }else{
      res.redirect('loginpage');
    }
})
app.get('/ketolak/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/ketolak/','');
   axios.put('http://35.172.178.112:4000/pengaduan/'+id_laporan,{
    status : "Ditolak"});
    res.redirect('/');
    }else{
      res.redirect('loginpage');
    }
})
app.get('/keselesai/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/keselesai/','');
    axios.put('http://35.172.178.112:4000/pengaduan/'+id_laporan,{
    status : "Selesai"});
    res.redirect('/');
    }else{
      res.redirect('loginpage');
    }
})
app.get('/kerjakan/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/keselesai/','');
    axios.put('http://35.172.178.112:4000/pengaduan/'+id_laporan,{
    status : "Dikerjakan"});
    res.redirect('/');
    }else{
      res.redirect('loginpage');
    }
})
app.get('/kehapus/(:id)', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
   var laporan = req.url;
   var id_laporan = laporan.replace('/kehapus/','');
   axios.delete('http://35.172.178.112:4000/pengaduan/'+id_laporan);
   res.redirect('/');
    }else{
      res.redirect('loginpage');
    }
})


module.exports = app;