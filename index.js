const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const { contactForm } = require('./src/contactForm');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// app.use(cors({ origin: process.env.ALLOWED_ORIGINS, credentials: true}));
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
console.log("EMAIL:", process.env.EMAIL_USER, process.env.EMAIL_PASS);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('Backend is running!'));
app.post('/api/contact', contactForm);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));