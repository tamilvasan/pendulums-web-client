export const userRoleInProject = (project, userId) => {
  let role = 'team member';
  if (project.owner.id === userId) {
    role = 'owner';
  } else {
    project.admins.map(user => {
      if (user.id === userId) {
        role = 'admin';
      }
    });
  }
  return role;
};