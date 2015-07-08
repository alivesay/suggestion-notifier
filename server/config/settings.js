'use strict';

module.exports = {
  hapi: {
    serverOptions: {
      app: {
        notices: {
          fromAddress: 'example@gmail.com',
          subjectPrefix: 'Purchase Suggestion Notice:'
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
      pass: '1234'
    }
  },
  ilsOptions: {
    catalog: {
      hostname: 'localhost',
      patronAPISSLPort: 54620
    }
  }
};
