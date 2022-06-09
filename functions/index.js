const fetch = require('node-fetch');

function check(link) {
    /// check if link ends with .jpg or .png or .gif
    if (link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.gif') || link.endsWith('.jpeg') || link.endsWith('.gifv')) {
        /// check if link is a video
        if (link.endsWith('.gifv')) {
            return '<video controls><source src="' + link + '" type="video/mp4"></video>';
        }
        return true
    }
    return false
}

function nsfw_check(subreddit) {
    /// check if subreddit is nsfw
    list = ['nsfw', 'nsfw_gifs', 'nsfw_gif', 'nsfw_nsfw', 'nsfw', 'gonewild']
    for (i = 0; i < list.length; i++) {
        if (subreddit.toLowerCase().includes(list[i])) { 
            return true
        }
    }
    return false
}

function find(params) {
    /// returns a single image from a subreddit
    if (params.limit === undefined) {
        params.limit = 100
    }
    const iamge = `https://www.reddit.com/r/${params.subreddit}.json?sort=top&t=week&limit=${params.limit}`;
    return fetch(iamge)
        .then(res => res.json())
        /// get the first image
        .then(json => {
            const posts = json.data.children;
            const post = posts[Math.floor(Math.random() * posts.length)];
            const link = post.data.url;
            if (check(link)) {
                if (nsfw_check(params.subreddit)) {
                    return "NSFW is is not allowed"
                }
                else {
                    return link
                }
            }
            return find(params)
        })
        .catch(err => {
            console.log(err);
            return 'We are having trouble finding a image for you. Please try again later.'
        });
}

module.exports = find;