import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/post.service.js';
import { prisma } from '../lib/prisma.js'; // Necesario para el conteo
import AppError from '../utils/AppError.js';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) throw new AppError('Unauthorized', 401);
    const { content } = req.body;
    const post = await postService.createPost({ content }, req.user.userId);
    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Ejecutamos ambas consultas en paralelo para máxima eficiencia
    const [posts, total] = await Promise.all([
      postService.getFeed(page, limit),
      prisma.post.count(),
    ]);

    // Devolvemos el objeto con posts y el total real
    res.json({ posts, total });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) throw new AppError('Unauthorized', 401);
    const { content } = req.body;
    const { id } = req.params;
    const updated = await postService.updatePost(id, content, req.user.userId);
    res.json({ post: updated });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) throw new AppError('Unauthorized', 401);
    await postService.deletePost(req.params.id, req.user.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
