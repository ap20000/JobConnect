import React, { useState } from "react";
import CompanyRegisterForm from "./CompanyRegisterForm";
import RegisterHR from "./RegisterHR";

const CompanyHRRegistration = () => {
  const [companyId, setCompanyId] = useState(null);

  const handleCompanyRegistered = (id) => {
    console.log("Company ID after registration:", id);
    setCompanyId(id); // You can store or do something with the company ID here
  };

  return (
    <div>
      <h1>Company Registration</h1>
      <CompanyRegisterForm onCompanyRegistered={handleCompanyRegistered} />
      {companyId && <p>Company ID: {companyId}</p>}
    </div>
  );
};
export default CompanyHRRegistration;