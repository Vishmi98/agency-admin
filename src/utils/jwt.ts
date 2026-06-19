import jwt from 'jsonwebtoken';

import { AdminTypeJwt, UserStoreUserType } from '@/type/common.types';


export const generateUserToken = (user: UserStoreUserType) => {
  return jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: '48h',
  });
};

export const generateAdminToken = (user: AdminTypeJwt) => {
  return jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: '48h',
  });
};