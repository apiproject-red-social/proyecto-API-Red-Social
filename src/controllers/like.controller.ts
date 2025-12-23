import { Request, Response, NextFunction } from 'express';
import * as LikeService from '../services/like.service.js';

export const handleToggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;

    const userId = req.user!.userId;

    const result = await LikeService.toggleLike(postId, userId);
    res.status(result.liked ? 201 : 200).json(result);
  } catch (error) {
    next(error);
  }
};
