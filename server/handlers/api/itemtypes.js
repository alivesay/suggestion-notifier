'use strict';

var Boom = require('boom');

module.exports = {
  all: function (request, reply) {
    var itemtypes = {
      book: 'Book',
      audiobook: 'Audiobook',
      ebook: 'Ebook',
      largeprint: 'Large Print',
      music: 'Music',
      dvd: 'DVD',
      bluray: 'Blu-ray',
      periodical: 'Periodical',
      zine: 'Zine',
      database: 'Database',
      other: 'Other'
    };

    reply(itemtypes).code(200);
  }
};