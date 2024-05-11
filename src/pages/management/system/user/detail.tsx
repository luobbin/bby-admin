import { USER_LIST } from '@/_mock/assets';
import Card from '@/components/card';
import { useParams } from '@/router/hooks';

import type { UserInfo } from '#/entity';

// @ts-ignore
const USERS: UserInfo[] = USER_LIST;

export default function UserDetail() {
  const { id } = useParams();
  const user = USERS.find((user) => user.id === id);
  return (
    <Card>
      <p>这是用户{user?.userName}的详情页面</p>
    </Card>
  );
}
