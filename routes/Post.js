const express = require('express');
const User = require('../models/user');
const Blog = require('../models/post');
const router = express.Router();

router.get('/add',(req,res) => {
    if(req.user){
        res.render('new_post',{title:'Blog - New Post',user:req.user});
    }else{
        res.redirect('/login');
    }
});

router.post('/add',async(req,res) => {
    let file = {name:''};
    let uploadPath;

    if(req.files) file = req.files.file;

    if(req.user){
        await User.findOne({_id:req.user._id}).then(async(author) => {
            await Blog.create({
                title:req.body.title,
                details:req.body.details,
                author:author,
                filename:file.name
            }).then((result) => {
                uploadPath = './files/' + result._id + file.name;

                if(file.mv){
                    file.mv(uploadPath, (err) => {
                        if (err) return res.status(500).send(err);
                        res.redirect(`/posts/${result._id}`);
                    });
                }else res.redirect(`/posts/${result._id}`);
            })
        });
    }else{
        res.redirect('/login');
    }
})

router.get('/:id',async(req,res) => {
    await Blog.findOne({_id:req.params.id}).then(async(result) => {
        if(result){
            res.render('post',{title:`Blog - ${req.originalUrl}`,post:result})
        }else{
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    })
});

router.get('/:id/delete',async(req,res) => {
    await Blog.find({_id:req.params.id}).then(async(result) => {
        if(result[0] && req.user && result[0].author[0]._id == req.user.id || result[0] && req.user && req.user.username === "admin"){
            await Blog.findByIdAndDelete({_id:req.params.id}).then((result) => {
                res.redirect('/');
            })
        }else{
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    })
});

router.get('/:id/uptade',async(req,res) => {
    console.log(req.user);
    await Blog.find({_id:req.params.id}).then(async(result) => {
        if(result[0] && req.user && result[0].author[0]._id == req.user.id || result[0] && req.user && req.user.username === "admin"){
            res.render('uptade_post',{title:'Blog - Uptade post',user:req.user,post:result[0]})
        }else{
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    })
});

router.post('/:id/uptade',async(req,res) => {
    await Blog.find({_id:req.params.id}).then(async(result) => {
        if(result[0] && req.user && result[0].author[0]._id == req.user.id || result[0] && req.user && req.user.username === "admin"){
            const post = await Blog.findOne({_id: req.params.id});
            if(req.body.title && req.body.details){
                post.title = req.body.title;
                post.details = req.body.details;
                post.save();
                res.redirect(`/posts/${post._id}`);
            }else{
                res.redirect('/');
            }
        }else{
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    })
});

module.exports = router;