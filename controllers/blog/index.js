var express = require('express');
const blog = express.Router();
const find = require('../../functions/index');
const makeid = require('../../functions/number_gen');
const devModeCheck = require('../../functions/devmodecheck');
const config = require('../config');
const blogSchema = require('../../models/blog');
require('dotenv').config();

blog.use(express.static(__dirname + '.../public'));

function is_logged_in(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(403).send({ error: 'You are not logged in' });
    }
}

blog.get('/', devModeCheck, function(req, res) {
    res.render('blog')
});

blog.post('/post', function(req, res) {
const blog = new blogSchema({
    _id: makeid(32),
    title: req.body.title,
    body: req.body.body,
    author: req.session.user.username,
    date: new Date().toLocaleString(),
    comments: []
})
blog.save().then(() => {
    res.redirect('/blog')
}
).catch((err) => {
    console.log(err)
})
});

blog.get('/all', function(req, res) {
blogSchema.find().then((blogs) => {
    res.send(blogs)
}).catch((err) => {
    console.log(err)
})
});

/// not working atm
blog.get('/comments', function(req, res) {
blogSchema.find().then((blogs) => {
    info = {
        body: blogs.comments.body
    }
    res.send(info)
}).catch((err) => {
    console.log(err)
  })
});
        

blog.post('/comment/:id', function(req, res) {
    blogSchema.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: {
        _id: makeid(32),
        body: req.body.body,
        author: req.session.user.username
    } } }, { new: true }).then((blog) => {
        res.send(blog)
    }
    ).catch((err) => {
        console.log(err)
    }
    )
});

blog.delete('/:id', function(req, res) {
blogSchema.deleteOne({
    _id: req.params.id
}).then(() => {
    res.send('deleted')
}).catch((err) => {
    console.log(err)
})
});

blog.get('/:id', function(req, res) {
blogSchema.findOne({
    _id: req.params.id
}).then((blog) => {
    res.render('blog_one')
}
).catch((err) => {
    console.log(err)
})
});

blog.get('/id/:id', function(req, res) {
blogSchema.findOne({
    _id: req.params.id
}).then((blog) => {
    res.send(blog)
}
).catch((err) => {
    console.log(err)
})
});

module.exports = blog;