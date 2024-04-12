import apiClient from '../apiClient';

import { Organization } from '#/entity';

export enum OrgApi {
  Org = '/org',
}

const getOrgList = () => apiClient.get<Organization[]>({ url: 'http://localhost:3001/api/org' });

export default {
  getOrgList,
};
