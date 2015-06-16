'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');

var settings = require('../config/settings');
// https://catalog.library.edu:54620/PATRONAPI/21913000482538


var testData = "<HTML>\n<BODY>\nEXP DATE[p43]=12-31-97<BR>\nPCODE1[p44]=-<BR>\nPCODE2[p45]=-<BR>\nPCODE3[p46]=0<BR>\nP TYPE[p47]=1<BR>\n  TOT CHKOUT[p48]=56<BR>\nTOT RENWAL[p49]=17<BR>\n  CUR CHKOUT[p50]=3<BR>\n  HOME LIBR[p53]=0000<BR>\nPMESSAGE[p54]=<BR>\nMBLOCK[p56]=-<BR>\n  REC TYPE[p80]=p<BR>\n  RECORD #[p81]=110220<BR>\nREC LENG[p82]=1126<BR>\nCREATED[p83]=01-09-97<BR>\nUPDATED[p84]=06-05-97<BR>\nREVISIONS[p85]=139<BR>\nAGENCY[p86]=1<BR>\n  CL RTRND[p95]=0<BR>\n  MONEY OWED[p96]=$1.35<BR>\nBLK UNTIL[p101]=  -  -  <BR>\n  CUR ITEMA[p102]=0<BR>\n  CUR ITEMB[p103]=0<BR>\nPIUSE[p104]=0<BR>\n  OD PENALTY[p105]=0<BR>\n  ILL CHKOUT[p122]=3<BR>\n  PATRN NAME[pn]=Jackson, Richard<BR>\nADDRESS[pa]=322 San Diego St<BR>\nADDRESS2[ph]=El Cerrito, CA 99999<BR>\nTELEPHONE[pt]=510-555-1212<BR>\n  UNIV ID[pu]=111111111<BR>\n  P BARCODE[pb]=21913000482538<BR>\n  </BODY>  </HTML>";

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
    'PIN'           : 'pin',
    'HOLD'          : 'hold',
    'FINE'          : 'fine',
    'LINK REC'      : 'linkedRecord'
  },

  getPatron: function getPatron (record, callback) {
    // See: http://csdirect.iii.com/sierrahelp/Content/sril/sril_patronapi.html

    var self = this;
    var results = {};

    var patronApiDumpUri = util.format('https://%s:%d/PATRONAPI/{%s}/dump',
      settings.ilsOptions.catalog.hostname,
      settings.ilsOptions.catalog.patronAPISSLPort,
      record
    );

    request(patronApiDumpUri, function (error, response, body) {
      console.log('TODO: fetching patron dump')
      if (error) {
        return callback(error, null);
      }

      var response = testData;  // TODO: get real data

      _.each(response.split('\n'), function (line) {
        var pos = line.indexOf(']=');

        if (pos !== -1) {
          var data = line.substring(pos+2,line.length).match(/(.+)(?=<)/);
          data = data ? data[0].trim() : undefined;
          pos = line.indexOf('[');
          var field = line.substring(0,pos).trim();
          results[self._patronApiFieldMap[field]] = data;
        }
      });

      return callback(null, results);

    });

  }

};

module.exports = ILSApi;