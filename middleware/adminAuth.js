export const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // Simple token check for demo
  if (token === process.env.ADMIN) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized: Admins only" });
  }
};
