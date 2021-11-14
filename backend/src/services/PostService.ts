import { Types } from 'mongoose';

import { Post, Image } from 'src/models';
import { Enums } from 'src/utils';
import { CommentService, PostLikeService } from 'src/services/index';
import ImageService from 'src/services/ImageService';
import FollowService from 'src/services/FollowService';
import { PostType } from 'src/types';

class PostService {
  async getPost(postID: Types.ObjectId) {
    const results = await Promise.all([
      CommentService.findComments(postID.toString()),
      PostLikeService.findPostLikes(postID.toString()),
      ImageService.findPostImage(postID.toString()),
    ]);
    return { comments: results[0], likes: results[1], images: results[2] };
  }

  async getPostArray(posts: PostType[]) {
    return Promise.all(
      posts.map(async (post) => {
        const newPost = { ...post };
        delete newPost.userID;
        const results = await this.getPost(post._id!);
        return { ...newPost, ...results };
      }),
    );
  }

  async createPost(data: any) {
    let { images } = data;
    const post = await Post.create(data);

    if (images?.length > 0) {
      images = images.map((v: any) => ({
        url: v,
        targetID: post._id,
      }));
      if (images) await Image.insertMany(images);
    }
    return {};
  }

  async findRandomPost() {
    const randomPosts = await Post.aggregate([
      { $sample: { size: 20 } },
      { $lookup: { from: 'users', localField: 'userID', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      {
        $project: {
          'user._id': true,
          'user.username': true,
          'user.profileImage': true,
          title: true,
          content: true,
          tags: true,
          link: true,
        },
      },
    ]);
    return this.getPostArray(randomPosts);
  }

  async findUserTimeline(userID: string) {
    const posts = await Post.find({ userID })
      .populate({ path: 'user', select: Enums.select.USER })
      .lean();
    return this.getPostArray(posts);
  }

  async findTimeline(userID: string, offset: string) {
    const follows = await FollowService.findFollowsID(userID);
    const containsArray = !follows ? [userID] : [...follows, userID];
    const posts = await Post.find({ userID: { $in: containsArray } })
      .populate({ path: 'user', select: Enums.select.USER })
      .lean();
    return this.getPostArray(posts);
  }

  async findPost(postID: string) {
    const post = await Post.findOne({ _id: postID })
      .populate({
        path: 'user',
        select: Enums.select.USER,
      })
      .lean();
    if (!post) throw new Error(Enums.error.NO_POSTS);
    delete post!.userID;
    return post;
  }

  async findPostCount(userID: Types.ObjectId) {
    return Post.countDocuments({ userID }).exec();
  }
}

export default new PostService();
