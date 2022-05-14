
const express = require('express')
const nodemailer = require('nodemailer')
const dotenv = require("dotenv")
const {nanoid} = require('nanoid')
const router = express.Router()

const Auth = require('../schemas/Auth')
const env = dotenv.config().parsed

router.post('/registration', async (req, res) => {
  try {
    const user = new Auth ({
      ...req.body
    })
    user.createToken(req.body.email)
    await user.save()

    res.status(200).send(user)
  } catch (e) {
    console.log(e);
    res.status(409).send({message: 'Username has been taken'})
  }
})

router.post('/refresh_password', async (req, res) => {
  try {
    const {old_password, new_password, email} = req.body
    if (!username) return res.send(403).send({message: 'User is not in the database'})

    const user = await Auth.findOne({email})
    const isMatch = await user.checkPassword(old_password);
    if (!isMatch) return res.status(400).send({message: 'Password is wrong'})

    user.password = new_password

    await user.save()

    res.status(200).send({message: 'Password has changed'})

  } catch (e) {
    console.log(e);
  }
})

router.post('/email_refresh', async (req, res) => {
  const code = nanoid(5)
  const user = await Auth.findOne({email: req.body.email})
  console.log(user);

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: env.EMAIL,
      pass: env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: req.body.email,
    subject: "AutoMaster", // Subject line
    text: "Recovery code", // plain text body
    html: `
      <div>
        <h3>Recovery code</h3>
        <p>Please do not share this code with anyone for security reasons.</p>
        <p>Code: <strong>${code}</strong></p>
      </div>
    `, // html body
  });

  transporter.sendMail(info, (err, data) => {
    if (err) {
      console.log(e)
    } else {
      user.code = code
      user.save()
      res.send('Send to Email')
    }
  })
})

router.put('/email_refresh', async (req, res) => {
  const user = await Auth.findOne({code: req.body.code})
  if (!user) return res.status(403).send({message: 'not found'})
  user.password = req.body.password
  await user.save()
})

router.post('/login', async (req, res) => {
  const user = await Auth.findOne({email: req.body.email})
  if (!user) return res.status(403).send({message: 'User not found'})

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({error: `Password is wrong`});
  }

  user.createToken();
  await user.save();
  res.send(user)
})



module.exports = router
