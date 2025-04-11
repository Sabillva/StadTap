import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store for OTPs (use Redis or DB in production)
const otpStore = {};

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to email
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOTP();
  otpStore[email] = otp; // store OTP for the email
  console.log(`OTP for ${email}: ${otp}`);

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nahidisayev147@gmail.com",
        pass: "hlxj hvzb hlyh einr",
      },
    });

    await transporter.sendMail({
      from: '"My App" <nahidisayev147@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      text:` Your OTP code is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(404).json({ message: "No OTP found for this email" });
  }

  if (storedOtp !== otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // OTP matched – you can proceed with registration, etc.
  res.json({ message: "OTP verified successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});