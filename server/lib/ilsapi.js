'use strict';


/*
 * This is a temporary mini ILS API layer and will be replaced by the full
 * modular API layer in the future.
 */

var _ = require('lodash');
var request = require('request');
var util = require('util');
var cheerio = require('cheerio');

var settings = require('../config/settings');
// https://catalog.library.edu:54620/PATRONAPI/21913000482538

var ILSApi = {
  _patronApiFieldMap: {
    'REC INFO'      : 'recordInfo',
    'EXP DATE'      : 'expirationDate',
    'PCODE1'        : 'patronCode1',
    'PCODE2'        : 'patronCode2',
    'PCODE3'        : 'patronCode3',
    'P TYPE'        : 'pType',
    'TOT CHKOUT'    : 'totalCheckouts',
    'TOT RENWAL'    : 'totalRenewals',
    'CUR CHKOUT'    : 'currentCheckouts',
    'BIRTH DATE'    : 'birthday',
    'HOME LIBR'     : 'homeLibrary',
    'PMESSAGE'      : 'patronMessage',
    'MBLOCK'        : 'mblock',
    'REC TYPE'      : 'recordType',
    'RECORD #'      : 'recordNumber',
    'REC LENG'      : 'recordLength',
    'CREATED'       : 'createdOn',
    'UPDATED'       : 'updatedOn',
    'REVISIONS'     : 'revisions',
    'AGENCY'        : 'agency',
    'CL RTRND'      : 'claimedReturned',
    'MONEY OWED'    : 'moneyOwed',
    'CUR ITEMA'     : 'currentItemA',
    'CUR ITEMB'     : 'currentItemB',
    'CUR ITEMC'     : 'currentItemC',
    'CUR ITEMD'     : 'currentItemD',
    'CIRCACTIVE'    : 'lastCircActivityOn',
    'NOTICE PREF'   : 'noticePreference',
    'PATRN NAME'    : 'patronName',
    'ADDRESS'       : 'address',
    'TELEPHONE'     : 'telephone',
    'P BARCODE'     : 'patronBarcode',
    'EMAIL ADDR'    : 'emailAddress',
    'PIN'           : 'pin',
    'HOLD'          : 'hold',
    'FINE'          : 'fine',
    'LINK REC'      : 'linkedRecord'
  },

  getPatron: function getPatron (record, callback) {
    // See: http://csdirect.iii.com/sierrahelp/Content/sril/sril_patronapi.html

    var self = this;
    var results = {};
    // TODO: hack
    record = record.length < 14 ? "211680" + record : record;
    var requestOptions = {
      uri:  util.format('https://%s:%d/PATRONAPI/%s/dump',
        settings.ilsOptions.catalog.hostname,
        settings.ilsOptions.catalog.patronAPISSLPort,
        record
      ),
      // TODO: hack
      strictSSL: false,
      rejectAuthorization: false
    };
 
    request(requestOptions, function (error, response, body) {
      if (error) {
        return callback(error, null);
      }

      _.each(body.split('\n'), function (line) {
        var pos = line.indexOf(']=');

        if (pos !== -1) {
          var data = line.substring(pos+2,line.length).match(/(.+)(?=<)/);
          data = data ? data[0].trim() : undefined;
          pos = line.indexOf('[');
          var field = line.substring(0,pos).trim();
          results[self._patronApiFieldMap[field]] = data;
        }
      });

      if (_.size(results) > 0) {
        results['emailAddress'] = undefined;
        return callback(null, results);
      }
      
      return callback('Patron not found: ' + record, null);
    });

  },

  getBib: function getBib (record, callback) {
    var self = this;
    var results = {};

    // scrape record from webpac
    var recordURI = util.format('https://%s/search~S1/,?%s',
        settings.ilsOptions.catalog.hostname,
        record
    );

    var requestOptions = {
      uri:  recordURI,
      // TODO: hack
      strictSSL: false,
      rejectAuthorization: false
    };
 
    request(requestOptions, function (error, response, body) {
      if (error) {
        return callback(error, null);
      }

      var $ = cheerio.load(body);

      results.recordURI = recordURI;
      results.bibNumber = record;

      // scrape isbn
      // TODO: refactor this...
      results.isbn = $('td.bibInfoLabel:contains("ISBN")').next('td').text().split(' ')[0];
      console.log('ISBN: ', results.isbn);

      // scrape title
      results.title = $("td.bibInfoData > strong").text();
      if (results.title) {
        return callback(null, results);
      }
      
      return callback('Bib record not found: ' + record, null);
    });
   
  }

};

module.exports = ILSApi;
