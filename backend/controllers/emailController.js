import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send job application success email
export const sendApplicationSuccessEmail = async (user, job) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Application Successful for ${job.title}`,
    text: `Dear ${user.name},

Congratulations! Your application for the position of ${job.title} at ${job.companyName} has been successfully submitted.

Here are your application details:

- Full Name: ${user.name}
- Job Title: ${job.title}
- Company: ${job.companyName}
- Applied Position: ${job.position}

We will review your application and update you soon.

Best regards,  
JobConnect Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Application success email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
