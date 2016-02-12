'use strict';

var _ = require('lodash');
var async = require('async');
var Handlebars = require('handlebars');
var Mentat = require('mentat');

var ilsapi = require('../lib/ilsapi');

function sendNotice(options, callback) {
  var noticeScope = {};

  var mailOptions = _.defaults({
    from: Mentat.server.settings.app.notices.fromAddress
  }, options.mailOptions);

  if (options.bibNumber) {
      async.parallel({
        patron: _getPatron ,
        suggestion: _getSuggestion,
        bib: _getBib
      }, _parallelTasksDone);
  } else {
    async.parallel({
      patron: _getPatron ,
      suggestion: _getSuggestion,
    }, _parallelTasksDone);
  }

  function _getPatron(_callback) {
    return ilsapi.getPatron(options.patronId, _callback);
  }

  function _getBib(_callback) {
    return ilsapi.getBib(options.bibNumber, _callback);
  }

  function _getSuggestion(_callback) {
    return Mentat.models.Suggestion
      .findById(options.suggestionId)
      .nodeify(_callback);
  }

  function _sendEmail(_callback) {
    var subjectPrefix = Mentat.server.settings.app.notices.subjectPrefix;

    mailOptions.to = noticeScope.patron.emailAddress;
    mailOptions.subject = subjectPrefix + noticeScope.patron.patronName;

    var textTemplate = Handlebars.compile(options.template.body); // TODO: errors?
    mailOptions.text = textTemplate(noticeScope);

    // if template requires bibnumber...
    return Mentat.transporter.sendMail(mailOptions, _callback);
  }

  function _deleteSuggestion(_callback) {
    Mentat.models.Suggestion
      .findById(noticeScope.suggestion.id)
      .then(function (template) {
        template
          .destroy()
          .nodeify(_callback);
      })
      .catch(function (err) {
        return _callback(err, null);
      });
  }

  function _sendNoticeDone(err, response) {
    if(err) {
      return callback(err, null);
    }

    Mentat.controllers.EventsController.log({
      event: {
        type: 'notices:sent',
        body: noticeScope.suggestion
      },
      logFields: [ 'title' ]
    });

    return callback(null, 'Sent.');
  }

  function _parallelTasksDone (err, results) {
    if (err) {
      Mentat.server.log(['error'], err);
      return callback(err, null);
    }

    noticeScope.patron = results['patron'];
    if (results['patron'] === null || results['patron'] === undefined) {
      return callback('Patron not found.', null);
    }

    if (!results['patron']['emailAddress']) {
      return callback('No email found for patron.', null);
    }

    if (results['suggestion'] === null || results['suggestion'] === undefined) {
      return callback('Suggestion not found.', null);
    }

    if (options.bibNumber && results['bib'] === null || results['bib'] === undefined) {
      return callback('Bib record not found.', null);
    }

    noticeScope.suggestion = results['suggestion'].dataValues;
    noticeScope.bib = results['bib'];

    async.series([ _sendEmail, _deleteSuggestion ], _sendNoticeDone);
  }
}

module.exports = new Mentat.Controller('Notices', {
  sendNotice: sendNotice
});
