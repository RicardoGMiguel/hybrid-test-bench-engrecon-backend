export const UserRoles: { ADMIN: 'ADMIN'; OPERATOR: 'OPERATOR' } = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
};

export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];
