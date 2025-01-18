import React from "react";
import { useNavigate } from "react-router-dom";

const CompanyManagerRegister = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/CompanyManagerRegister");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Company Manager Register</h2>
      <button onClick={handleButtonClick} className="btn btn-primary">
        Go to Job Manager Dashboard
      </button>
    </div>
  );
};

export default CompanyManagerRegister;
