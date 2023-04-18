import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/httpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import passport from 'passport';
import { roleRights } from '@/config/constants';

const AUTH_ERR_MSG = 'Please authenticate';

const verifyCallback = (req: RequestWithUser, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new HttpException(httpStatus.UNAUTHORIZED, AUTH_ERR_MSG));
  }

  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new HttpException(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

export const AuthMiddleware =
  (...requiredRights) =>
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch(err => next(err));
  };
