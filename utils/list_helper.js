const dummy = (blogs) => {

}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + (blog.likes || 0), 0)
}

const favouriteBlog = (blogs) => {
    max = {'likes':0};
    blogs.map(blog => {
        blog.likes > max.likes 
           ? max = blog
           : 0
    })
    return max
}

const mostBlogs = (blogs) => {
    const autores = {};

    const addAutorPublication = (author, number) => {
        if (autores[author]) {
            autores[author] += number
        } else {
            autores[author] = number
        }
    }

    blogs.map(blog => {
        blog.author
        ? addAutorPublication(blog.author, 1)
        : 0
    })

    let maxPublications = 0;
    let maxAuthorPublications = null;

    for (const auth in autores) {
        if(autores[auth] > maxPublications){
            maxPublications = autores[auth];
            maxAuthorPublications = auth;
        }
    }
    return {'author': maxAuthorPublications, 'blogs':maxPublications}
}

const mostLikes = (blogs) => {
    const maxLikes = {};

    blogs.map(blog => {
        maxLikes[blog.author]
        ? maxLikes[blog.author] += blog.likes
        : maxLikes[blog.author] = blog.likes
    })

    mostLikedAuthor = null;
    likesByAuthor = 0;

    for (const liked in maxLikes){
        if(maxLikes[liked] > likesByAuthor){
            likesByAuthor = maxLikes[liked]
            mostLikedAuthor = liked
        } 
    }
    
    return {'author': mostLikedAuthor, 'likes': likesByAuthor}
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}