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
    }
  }
};