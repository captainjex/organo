var express = require('express');
var crypto = require('crypto')

var User = require('../models/user')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'codepolitan'
var session_store

var default_password = crypto.createHmac('sha256', secret)
                              .update('default')
                              .digest('hex')

/* GET users listing. */
router.get('/', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
  session_store = req.session

  User.find({}, function(err, user) {
    console.log(user);
    res.render('users/index', { session_store: session_store, users: user })
  }).select('username email firstname lastname admin createdAt updatedAt')
});

router.get('/create', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
  session_store = req.session

  res.render('users/create', { session_store: session_store })
})

router.post('/', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
  session_store = req.session

  req.assert('username', 'Nama diperlukan. Wajib!').isAlpha().withMessage('Username cuma boleh huruf dan angka').notEmpty()
  req.assert('email', 'Email ndak bener').notEmpty().withMessage('Email diperlukan. Wajib!').isEmail()
  req.assert('firstname', 'Nama depan cuma boleh angka sama huruf').isAlpha()
  req.assert('lastname', 'Nama Belakang cuma boleh angka sama huruf').isAlpha()

  var errors = req.validationErrors()
  console.log(errors);

  if (!errors) {
    v_username  = req.sanitize('username').escape().trim()
    v_email     = req.sanitize('email').escape().trim()
    v_firstname = req.sanitize('firstname').escape().trim()
    v_lastname  = req.sanitize('lastname').escape().trim()
    v_admin     = req.sanitize('admin').escape().trim()

    User.find({ username: req.body.username }, function(err, user) {
      if (user.length == 0) {
        var admin = new User({
          username: v_username,
          email: v_email,
          password: default_password,
          firstname: v_firstname,
          lastname: v_lastname,
          admin: v_admin,
        })
        admin.save(function(err) {
          if (err) {
            console.log(err);

            req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
            res.redirect('/users')
          } else {
            req.flash('msg_info', 'User telah berhasil dibuat')
            res.redirect('/users')
          }
        })
      } else {
        req.flash('msg_error', 'Maaf, username sudah ada....')
        res.render('users/create', {
          session_store: session_store,
          username: req.body.username,
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        })
      }
    })
  } else {
    // nampilkan pesan error
    errors_detail = '<p>Maaf, sepertinya ada salah pengisian, tulung check lagi formnyah!</p><ul>'

    for (i in errors) {
      errors = errors[i]
      errors_detail += '<li>'+error.msg+'</li>'
    }

    errors_detail += '</ul>'

    req.flash('msg_error', errors_detail)
    res.render('users.create', {
      session_store: session_store,
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    })
  }
})

router.get('/:id/edit', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
  session_store = req.session

  User.findOne({ _id: req.params.id }, function(err, user) {
    if (user) {
      console.log(user);

      res.render('users/edit', { session_store: session_store, user: user })
    } else {
      req.flash('msg_error', 'Maaf, user tidak ditemukan')
      res.redirect('/users')
    }
  })
})

router.put('/:id', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
  session_store = req.session

  req.assert('username', 'Nama diperlukan, Wajib!').isAlpha().withMessage('Username kudu angka dan huruf').notEmpty();
  req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
  req.assert('firstname', 'Nama depan kudu angka dan huruf').isAlpha();
  req.assert('lastname', 'Nama belakang kudu angka dan huruf').isAlpha();

  var errors = req.validationErrors();
  console.log(errors);

  if (!errors) {
    v_username = req.sanitize('username').escape().trim();
    v_email = req.sanitize('email').escape().trim();
    v_firstname = req.sanitize('firstname').escape().trim();
    v_lastname = req.sanitize('lastname').escape().trim();
    v_admin = req.sanitize('admin').escape().trim();


    User.findById(req.params.id, function(err, user) {
      user.username = req.body.username;
      user.email = req.body.email;
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.admin = req.body.admin;

      user.save(function(err, user) {
        if (err) {
          req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
        } else {
          req.flash('msg_info', 'Edit user berhasil!');
        }

        res.redirect('/users/' + req.params.id + '/edit');

      });
    });
  } else {
    // menampilkan pesan error
    errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";

    for (i in errors) {
      error = errors[i];
      errors_detail += '<li>' + error.msg + '</li>';
    }

    errors_detail += "</ul>";

    req.flash('msg_error', errors_detail);
    res.render('users/edit', {
      _id: req.params.id,
      session_store: session_store,
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  }
})

router.delete('/:id', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
  User.findById(req.params.id, function(err, user){
       user.remove(function(err, user){
           if (err)
           {
               req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
           }
           else
           {
               req.flash('msg_info', 'User berhasil dihapus!');
           }
           res.redirect('/users');
       })
   })
})

module.exports = router;
