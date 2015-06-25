'use strict';

var _ = require('lodash');
var async = require('async');
var Mentat = require('mentat');

var ilsapi = require('../lib/ilsapi');

function sendNotice(patronId, suggestionId, template, options, callback) {
  var noticeScope = {};

  var mailOptions = _.defaults({
    from: Mentat.server.settings.app.notices.fromAddress
  }, options);

  async.parallel({
    patron: _getPatron ,
    suggestion: _getSuggestion
  }, _parallelTasksDone);

  function _getPatron(_callback) {
    return ilsapi.getPatron(patronId, _callback);
  }

  function _getSuggestion(_callback) {
    return Mentat.models.Suggestion
      .findById(suggestionId)
      .nodeify(_callback);
  }

  function _sendEmail(_callback) {
    var subjectPrefix = Mentat.server.settings.app.notices.subjectPrefix;

    mailOptions.to = noticeScope.patron.emailAddress;
    mailOptions.subject = subjectPrefix + noticeScope.patron.patronName;
    mailOptions.body = template.body;

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
      type: 'notices:sent',
      body: noticeScope.suggestion
    }, {
      logFields: [ 'title' ]
    });

    return callback(null, 'Sent.');
  }

  function _parallelTasksDone (err, results) {
    if (err) {
      return callback(err, null);
    }
    noticeScope.patron = results['patron'];
    noticeScope.suggestion = results['suggestion'].dataValues;

    async.series([ _sendEmail, _deleteSuggestion ], _sendNoticeDone);
  }
}

module.exports = new Mentat.Controller('Notices', {
  sendNotice: sendNotice
});