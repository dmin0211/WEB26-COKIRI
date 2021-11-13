import { Request, Response } from 'express';
import { Controller, Req, Res, Post, Delete, Get, UseBefore } from 'routing-controllers';

import { PostService, CommentService, PostLikeService } from 'src/services';
import { Enums } from 'src/utils';
import * as passport from 'passport';

@Controller('/posts')
export default class PostsRouter {
  @Get('/')
  async getRandomPostOrTimeline(@Req() request: Request, @Res() response: Response) {
    const { type, user_id: userID, offset } = request.query;
    if (type === 'random') return response.json(await PostService.findRandomPost());
    const timelineResult = await PostService.findTimeline(userID as string, offset as string);
    return response.json(timelineResult);
  }

  @Get('/:postId/likes')
  async getPostLikeList(@Req() request: Request, @Res() response: Response) {
    const { postId } = request.params;
    return response.json(await PostService.findPostLikeList(postId));
  }

  @Get('/:postId')
  async getPost(@Req() request: Request, @Res() response: Response) {
    const { postId } = request.params;
    return response.json(await PostService.findPost(postId));
  }

  @Post('/')
  async postPost(@Req() request: Request, @Res() response: Response) {
    const data = request.body;
    const result = await PostService.createPost(data);
    return response.json(result);
  }

  @Post('/:postId/comments')
  async postComment(@Req() request: Request, @Res() response: Response) {
    const { postId } = request.params;
    const data = request.body;
    const result = await CommentService.createComment(data, postId);
    return response.json(result);
  }

  @Post('/:postId/comments/:commentId/likes')
  async postCommentLike(@Req() request: Request, @Res() response: Response) {
    const { postId, commentId } = request.params;
    const data = request.body;
    const result = await CommentService.createCommentLike(data.userID, postId, commentId);
    return response.json(result);
  }

  @Post('/:postID/likes')
  @UseBefore(passport.authenticate('jwt-registered', { session: false }))
  async postPostLike(@Req() request: Request, @Res() response: Response) {
    const { postID } = request.params;
    const { userID } = request.body;
    if (!userID) {
      throw new Error(Enums.error.WRONG_BODY_TYPE);
    }
    if (userID !== request.user?.userID) {
      throw new Error(Enums.error.PERMISSION_DENIED);
    }
    const result = await PostLikeService.createPostLike(userID, postID);
    const responseJSON = result.upsertedId
      ? { code: Enums.responseCode.SUCCESS, _id: result.upsertedId }
      : { code: Enums.responseCode.OVERLAP };
    return response.json(responseJSON);
  }

  @Delete('/:postId/comments/:commentId')
  async deleteComment(@Req() request: Request, @Res() response: Response) {
    const { postId, commentId } = request.params;
    const result = await CommentService.removeComment(postId, commentId);
    return response.json(result);
  }

  @Delete('/:postId/comments/:commentId/likes/:likeId')
  async deleteCommentLike(@Req() request: Request, @Res() response: Response) {
    const { postId, commentId, likeId } = request.params;
    const result = await CommentService.removeCommentLike(postId, commentId, likeId);
    return response.json(result);
  }

  @Delete('/:postID/likes/:likeID')
  @UseBefore(passport.authenticate('jwt-registered', { session: false }))
  async deletePostLike(@Req() request: Request, @Res() response: Response) {
    const { postID, likeID } = request.params;
    const { userID } = request.user!;
    if (!postID || !likeID) {
      throw new Error(Enums.error.WRONG_PARAMS_TYPE);
    }
    const result = await PostLikeService.removePostLike(userID, postID, likeID);
    const responseCode = result.deletedCount
      ? Enums.responseCode.SUCCESS
      : Enums.responseCode.OVERLAP;
    return response.json({ code: responseCode });
  }
}
