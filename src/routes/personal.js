const express = require('express');
const auth = require('../middleware/auth')
const permit = require('../middleware/permit')
const router = express.Router()
const Auth = require('../schemas/Auth')
const roles = require('../utils/roles')

router.get('/', [auth, permit(roles.MANAGER, roles.ADMIN)], async (req, res) => {
  const {role, token} = req.user
  console.log(!!Object.keys(req.query).length);
  try {
    if (!!Object.keys(req.query).length) {
      const personal = await Auth.find()
      if (role.includes(roles.MANAGER)){
        const filterPerson = personal.filter(({role}) => (
          role.includes(roles.DEFAULT)
        ))
        res.status(200).json(filterPerson)
      }
      res.status(200).json(personal)
    }
    await Auth.findOne({token}).then(result => res.status(200).json(result))
  } catch (e) {

  }
})

router.get('/:id', [auth], async (req, res) => {
  await Auth.findOne({_id: req.params.id}).then((result) => {
    res.status(200).send(result)
  })
})

router.put('/:id', [auth], async (req, res) => {
  const body = {
    username: req.body.username || '',
    age: req.body.age || '',
    update_date: new Date().toISOString()
  }
  try {
    const result = await Auth.findByIdAndUpdate({_id: req.params.id}, body)
    await result.save()
    res.send(result)
  } catch (e) {

  }
})

module.exports = router
