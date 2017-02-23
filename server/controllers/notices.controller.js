'use strict';

var _ = require('lodash');
var async = require('async');
var Handlebars = require('handlebars');
var Mentat = require('mentat');

var ilsapi = require('../lib/ilsapi');

function sendNotice(options, callback) {
  var noticeScope = {};

  var mailOptions = _.defaults({
    from: Mentat.settings.notices.email.fromAddress
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

  function _sendCopy(_callback) {
    if (options.template.sendCopy) {
        mailOptions.to = options.template.copyEmail;
        mailOptions.subject = "Suggestion: " + noticeScope.suggestion.patron;
        mailOptions.text = JSON.stringify(noticeScope.suggestion, null, 4).replace(/[{}",]/g,'');
        return Mentat.transporter.sendMail(mailOptions, _callback);
    }

    return _callback(null)
  }

  function _sendEmail(_callback) {
    var subjectPrefix = Mentat.settings.notices.email.subjectPrefix;

    mailOptions.to = noticeScope.suggestion.email || noticeScope.patron.emailAddress;

    if (!mailOptions.to) {
        return _callback('No email for sueggestion: ' + options.suggestionId, null);
    } 

    mailOptions.subject = subjectPrefix;

    try {
      var textTemplate = Handlebars.compile(options.template.body);
      mailOptions.text = textTemplate(noticeScope);

      if (options.template.html.length !== 0 && options.template.html.trim()) {
        var htmlTemplate = Handlebars.compile(options.template.html);
        mailOptions.html = htmlTemplate(noticeScope);
      }
    } catch (e) {
        Mentat.server.log(['error'], e);
        return callback('Parse error in template!', null);
    }

    return Mentat.transporter.sendMail(mailOptions, _callback);
  }

  function _deleteSuggestion(_callback) {
    Mentat.controllers.SuggestionsController.destroySuggestion({
        id: noticeScope.suggestion.id
    }, _callback);
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

    if (results['suggestion'] === null || results['suggestion'] === undefined) {
      return callback('Suggestion not found.', null);
    }
    
    if (options.bibNumber && (results['bib'] === null || results['bib'] === undefined)) {
      return callback('Bib record not found.', null);
    }

    noticeScope.suggestion = results['suggestion'].dataValues;
    noticeScope.bib = results['bib'];

    async.series([_sendCopy,  _sendEmail, _deleteSuggestion ], _sendNoticeDone);
  }
}

module.exports = new Mentat.Controller('Notices', {
  sendNotice: sendNotice
});
