const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
require('dotenv').config()

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { content: 1 })
    response.json(blogs)
  })
  
blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => { 
  const body = request.body

  if (!body.title && !body.url) {
    return response.status(400).end()
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: []
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const recoveredBlog = await Blog.findById(savedBlog.id).populate("user", {
      username: 1,
      name: 1,
    });
    
    return response.json(recoveredBlog)
  } catch(exception) {
    next(exception)
  }
  
})

  blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    
    const user = request.user

   if (blog.user.toString() === user._id.toString()) {
    try {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } catch (exception) {
      next(exception);
    }
   } else {
    return response.status(401).json({ error: 'unauthorized user' })
   }

    
  })

  blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
    const body = request.body

    const user = request.user

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id 
    }

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true }
      ).populate("user", { username: 1, name: 1 });
      response.json(updatedBlog)
    } catch(exception) {
      next(exception)
    }
    
  })

  module.exports = blogsRouter