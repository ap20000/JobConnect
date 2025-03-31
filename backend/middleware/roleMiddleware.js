const isManagerOrCompany = (req, res, next) => {
  if ( req.user.companyRole === "manager") {
    return next();
  }
  return res.status(403).json({ message: "Access Denied: Only managers can register HR." });
};

const isEmployer = (req, res, next) => {
  if (req.user.companyRole === "hr") {
    return next();
  }
  return res.status(403).json({ message: "Access Denied: Only company users can create jobs." });
};

const isJobSeeker = (req, res, next) => {
  if (req.user.role === "job_seeker") {
    return next();
  }
  return res.status(403).json({ message: "Access Denied: Only job seekers can apply for jobs." });
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access Denied: Only admins can perform this action." });
};

export { isManagerOrCompany, isEmployer, isJobSeeker, isAdmin };


export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token." });
      }

      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token." });
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { userId: user._id, role: user.role, companyRole: user.companyRole || null },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });

  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Failed to refresh token" });
  }
};
