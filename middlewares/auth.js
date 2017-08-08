var Auth = {
  check_login: function(req, res, next) {
    if (!req.session.logged_in) {
      return res.redirect('/login')
    }

    next()
  },
  is_admin: function(req, res, next) {
    if (!req.session.admin) {
      req.flash('info', 'Maaf, Anda mengakses halaman terlarang')
      return res.redirect('/')
    }

    next()
  }
}

module.exports = Auth
