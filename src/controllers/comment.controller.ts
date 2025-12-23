import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service.js';

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user?.userId;

    const comment = await commentService.createComment(content, userId!, postId);

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    res.json({ comments });
  } catch (error) {
    next(error);
  }
};
