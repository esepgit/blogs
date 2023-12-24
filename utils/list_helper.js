const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((acc, act) => {
        return acc + act.likes
    }, 0)

    return blogs.length === 0 ? 0: total
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return 'no blogs found'
    } else if(blogs.length === 1) {
        return {title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes}
    } else {
        result = {title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes}
        for(let i = 1; i < blogs.length; i++) {
            if(blogs[i].likes > result.likes) {
                result = {title: blogs[i].title, author: blogs[i].author, likes: blogs[i].likes}
            }
        }
        return result
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
