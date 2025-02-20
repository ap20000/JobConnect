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
  if (req.user.role === "jobSeeker") {
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
