const express = require('express')
const nodemailer = require('nodemailer')
const {nanoid} = require('nanoid')
const router = express.Router()

const Auth = require('../schemas/Auth')

router.post('/registration', async (req, res) => {
  try {
    const user = new Auth ({
      ...req.body
    })
    user.createToken(req.body.username)
    await user.save()

    res.status(200).send(user)
  } catch (e) {
    console.log(e);
    res.status(409).send({message: 'Username has been taken'})
  }
})

router.post('/refresh_password', async (req, res) => {
  try {
    const {old_password, new_password, username} = req.body
    if (!username) return res.send(403).send({message: 'User is not in the database'})

    const user = await Auth.findOne({username})
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
  let testAccount = await nodemailer.createTestAccount();
  const user = await Auth.findOne({username: req.body.username})

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sobolezm@gmail.com',
      pass: 'sobolev1337',
    },
  });

  let info = await transporter.sendMail({
    from: 'sobolezm@gmail.com', // sender address
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
  const user = await Auth.findOne({username: req.body.username})
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