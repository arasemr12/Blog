const express = require('express');
const Blog = require('../models/post');
const router = express.Router();

router.get('/add',(req,res) => {
    if(req.user){
        res.render('new_post',{title:'New Post',user:req.user});
    }else{
        res.redirect('/login');
    }
});

router.post('/add',async(req,res) => {
    if(req.user){
        await Blog.create({
            title:req.body.title,
            details:req.body.details,
            author:{
                username: req.user.username,
                id: req.user.id,
                name: req.user.name
            },
        }).then((result) => {
            res.redirect(`/posts/${result._id}`);
        })
    }else{
        res.redirect('/login');
    }
})

router.get('/:id',async(req,res) => {
    await Blog.find({_id:req.params.id}).then((result) => {
        if(result[0]){
            res.render('post',{title:req.params.id,user:req.user,post:result[0]})
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
        if(result[0] && req.user && result[0].author[0].id === req.user.id || result[0] && req.user && req.user.username === "admin"){
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
    await Blog.find({_id:req.params.id}).then(async(result) => {
        if(result[0] && req.user && result[0].author[0].id === req.user.id || result[0] && req.user && req.user.username === "admin"){
            res.render('uptade_post',{title:'Uptade',user:req.user,post:result[0]})
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
        if(result[0] && req.user && result[0].author[0].id === req.user.id || result[0] && req.user && req.user.username === "admin"){
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