import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/post.service.js';
import AppError from '../utils/AppError.js';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) throw new AppError('Unauthorized', 401);

    // ✅ El middleware 'validate' ya hizo el parseo.
    // Solo toma el contenido de req.body
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
    const posts = await postService.getFeed(page);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Verificación de usuario (ya manejada usualmente por el middleware authenticate)
    if (!req.user?.userId) throw new AppError('Unauthorized', 401);

    // 2. EXTRAE DIRECTAMENTE.
    // No uses .parse() aquí, el middleware 'validate' ya lo hizo por ti.
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
