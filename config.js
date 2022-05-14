const path = require('path');

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  dbUrl: process.env.DB_URL,
  mongoOptions: {useNewUrlParser: true}
};
