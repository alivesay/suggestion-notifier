'use strict';

module.exports = {
  hapi: {
    serverOptions: {
      app: {
        notices: {
          fromAddress: 'example@gmail.com'
        }
      }
    },
    connectionOptions: {
      host: '0.0.0.0',
      port: 8080,
      routes: {
        json: {
          space: 2
        }
      }
    }
  },
  nodemailerOptions: {
    service: 'Gmail',
    auth: {
      user: 'example@gmail.com',
      pass: 'password'
    }
  },
  ilsOptions: {
    catalog: {
      hostname: 'localhost',
      patronAPISSLPort: 54620
    }
  }
};
