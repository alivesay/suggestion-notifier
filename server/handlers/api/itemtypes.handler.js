'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Itemtypes', {
  routes: [
    { method: 'GET', path: '/api/itemtypes' }
  ],

  GET: function (request, reply) {
    var itemtypes = {
      book: 'Book',
      audiobook: 'Audiobook',
      downloadable_audio: 'Downloadable Audio',
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
});