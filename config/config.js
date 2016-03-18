var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'pdfexportdatamongo'
    },
    port: 3000,
    db: 'mongodb://54.165.63.70/editorDb'
  },

  test: {
    root: rootPath,
    app: {
      name: 'pdfexportdatamongo'
    },
    port: 3000,
    db: 'mongodb://localhost/pdfexportdatamongo-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'pdfexportdatamongo'
    },
    port: 3000,
    db: 'mongodb://localhost/pdfexportdatamongo-production'
  }
};

module.exports = config[env];
