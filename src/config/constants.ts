const allRoles: { [key: string]: string[] } = {
  user: [],
  admin: ['getUsers'],
};

const roles = Object.keys(allRoles);

const roleRights = new Map(Object.entries(allRoles)) as Map<keyof typeof allRoles, string[]>;

export { roles, roleRights };
