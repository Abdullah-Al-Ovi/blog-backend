import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res,next) => {
  const fileUrl = "http://localhost:8080";  
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const fileUrlWithPath = req.file 
    ? `${fileUrl}/images/${req.file.filename}`  
    : 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png';

  let slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  // Append current timestamp to the slug
  slug = `${slug}-${Date.now()}`;
  

  const newPost = new Post({
    ...req.body,
    slug,
    image: fileUrlWithPath,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
}
export const getPostsByUserEmail = async (req, res, next) => {
  try {
    const userEmail = req.query?.userEmail;  // Accessing the userEmail from the URL parameter
    // console.log("getpostbyemail",userEmail);
    
    if (!userEmail) {
      return next(errorHandler(400, 'Email is required'));
    }

    const posts = await Post.find({ email: userEmail });

    if (!posts.length) {
      return next(errorHandler(404, 'No posts found for this user'));
    }

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  // console.log(req.query.userEmail);
  
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userEmail && { email: req.query.userEmail }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
}

export const deletepost = async (req, res, next) => {
  if ( req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
}

export const updatepost = async (req, res, next) => {
  console.log(req.body);
  console.log(req?.file?.filename);
  const fileUrl = "http://localhost:8080"; 
  let fileUrlWithPath = '';  
  if(req.file){
     fileUrlWithPath = `${fileUrl}/images/${req.file.filename}`  
  }
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: fileUrlWithPath ? fileUrlWithPath : req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
}