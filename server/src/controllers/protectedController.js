export const getProfile = async (req, res) => {
  const user = req.user;

  return res.json({
    user,
    stats: {
      lastLogin: new Date().toISOString(),
      projects: 3,
      notifications: 5,
    },
  });
};
