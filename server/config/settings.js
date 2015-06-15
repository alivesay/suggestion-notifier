'use strict';

module.exports = {
  hapi: {
    connection: {
      host: '0.0.0.0',
      port: 8080,
      routes: {
        json: {
          space: 2
        }
      }
    },
    app: {
      notices: {
        fromAddress: 'noreply@example.com'
      }
    }
  },
  nodemailerOptions: {
    service: 'Gmail',
    auth: {
      user: 'sender@example.com',
      pass: 'password'
    }
  }
};