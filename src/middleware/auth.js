const Users = require('../schemas/Auth')

const auth = async (req, res, next) => {
  const Token = req.get('Authorization')
  if (!Token) return res.status(401).send({'error': 'Token not provided'});

  const user = await Users.findOne({token: Token});
  console.log('token', user);
  if (!user) return res.status(401).send({'error': 'Token incorrect'});

  req.user = user;

  next()
}

module.exports = auth;
