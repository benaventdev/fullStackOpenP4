const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const total = blogs.reduce((likes, blog) => {
        return likes + blog.likes
    }, 0)

    return total
}

const mostVoted = (blogs) => {
    const higher = blogs.reduce((max, current) => {
        return (current.likes > max)
            ? current.likes
            : max    
    }, 0)

    return higher
}

module.exports = {
    dummy,
    totalLikes,
    mostVoted
}