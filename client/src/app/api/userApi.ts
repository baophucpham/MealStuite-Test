import { User } from '@acme/shared-models';
import axiosClient from './axiosClient';

export const userApi = {
  getListUser: (): Promise<User[]> => {
    const url = '/users';
    return axiosClient.get(url);
  },
  getDetailUser: (id: number): Promise<User> => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
};
