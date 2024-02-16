const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.post('/:id/comments', async (request, response, next) => {
  const body = request.body
  const idBlog = request.params.id
  const blog = await Blog.findById(idBlog)

  if (!body.content) {
    return response.json('something went bad');
  }

  const comment = new Comment({
    content: body.content,
    blog: idBlog,
  });

  try {
    const savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment._id);
    await blog.save()
    return response.json(savedComment)
  } catch (exception) {
    next(exception)
  }
  
})

module.exports = commentsRouter