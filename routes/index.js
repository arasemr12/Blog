const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Blog = require('../models/post');
const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const postsPerPage = 3;

  const totalPosts = await Blog.find().countDocuments();

  const Posts = await Blog.find({})
    .sort('-dateCreated')
    .skip((page - 1) * postsPerPage)
    .limit(postsPerPage);

    res.render('index', {
      posts: Posts,
      current: page,
      pages: Math.ceil(totalPosts / postsPerPage),
      totalPosts,
      title:'Blog - Home'
    });
});

router.get('/login', (req, res) => {
  if(req.user){
    res.redirect(req.get('Referrer') || '/');
  }else{
    res.render('login', { title: 'Blog - Login' });
  }

});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureMessage: true
}),(req,res) => {
  if(req.body.remember){
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //30 days
  }else{
    req.session.cookie.expires = false;
  }
  res.redirect('/');
});

router.get('/register', (req, res) => {
  if(req.user){
    res.redirect(req.get('Referrer') || '/');
  }else{
    res.render('register', { title: 'Blog - Register', user: req.user });
  }
});

router.post('/register', async (req, res) => {
  User.find({ username: req.body.username }).then(async(result) => {
    if (result[0]) {
      res.render('register', { message: 'This usurname aldrey taken.',title:'Blog - Register',user: req.user })
    } else {
      await User.create({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        ip: req.ip,
        profile: '/uploads/blank-profile.webp',
      }).then((result) => {
        var user = {
          id: result._id,
          username: req.body.username,
          name: req.body.name,
          ip: req.ip,
          profile: '/uploads/blank-profile.webp',
        };
        req.login(user, function (err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      })
    }
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(req.get('Referrer') || '/');
});

module.exports = router;