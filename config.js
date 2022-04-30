const path = require('path');

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  dbUrl: `mongodb+srv://sobolev:sobolev@cluster0.bubdx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  mongoOptions: {useNewUrlParser: true}
};
