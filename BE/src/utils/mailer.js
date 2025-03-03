const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "violahello2@gmail.com", 
    pass: "pmpl itpa avug tnuw", 
  },
});

// Function to send emails
const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: "violahello2@gmail.com",
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;

