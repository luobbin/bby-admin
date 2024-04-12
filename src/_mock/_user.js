import { faker } from '@faker-js/faker';
import { rest } from 'msw';

import { UserApi } from '@/api/services/userService';

import { USER_LIST } from './assets';

const signIn = rest.post(`/api${UserApi.Login}`);

const userList = rest.get('/api/user', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(1000),
    ctx.json(
      Array.from({ length: 10 }).map(() => ({
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        address: faker.location.streetAddress(),
      })),
    ),
  );
});

export default [signIn, userList];
