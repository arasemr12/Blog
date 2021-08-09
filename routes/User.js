const express = require('express');
const User = require('../models/user');
const Blog = require('../models/post');
const router = express.Router();

router.get('/:id', (req, res) => {
    User.find({ _id: req.params.id }).then((result) => {
        if (result[0]) {
            res.render('user', { title: `${result[0].username}`, user: req.user, userde: result[0] })
        } else {
            res.redirect('/');
        }
    }).catch((err) => {
        res.redirect('/');
    })
});

router.get('/:id/delete', async(req, res) => {
    await User.find({ _id: req.params.id }).then(async(result) => {
        if (result[0] && req.user && result[0]._id == req.user.id || result[0] && req.user && req.user.username === "admin") {
            await User.findByIdAndDelete({ _id: req.params.id }).then(async(result) => {
                req.logout();
                res.redirect('/');
            })
        } else {
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err)
        res.redirect('/');
    })
});

router.get('/:id/uptade', async(req, res) => {
    await User.find({ _id: req.params.id }).then(async(result) => {
        if (result[0] && req.user && result[0]._id == req.user.id || result[0] && req.user && req.user.username === "admin") {
            res.render('uptade_user',{title:'Uptade',user:req.user,user:result[0]})
        } else {
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err)
        res.redirect('/');
    })
});

router.post('/:id/uptade', async(req, res) => {
    await User.find({ _id: req.params.id }).then(async(result) => {
        if (result[0] && req.user && result[0]._id == req.user.id || result[0] && req.user && req.user.username === "admin") {
            result[0].username = req.body.username;
            result[0].name = req.body.name;
            result[0].password = req.body.password;
            result[0].save();
            req.logout();
            res.redirect(`/users/${result[0]._id}`);
        } else {
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err)
        res.redirect('/');
    })
});

module.exports = router;