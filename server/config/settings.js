'use strict';

module.exports = {
    auth: {
        key: '0x123456789',
        tokenTTL: 86400,
        useLDAP: true,
        ldap: {
            server: 'auth.multco.us',
            port: 636,
            rootDN: 'DC=yourlibrary,DC=or',
            serviceAccountDN: 'ldap_query',
            serviceAccountPassword: 'ldap_query_password',
            ldapFilterAttribute: 'sAMAccountName',
            rejectUnauthorized: false
        }
    },
    hapi: {
        connectionOptions: {
            host: '0.0.0.0',
            port: 8080,
            routes: {
                json: {
                    space: 2
                }
            }
        },
        pluginOptions: {
            'good': {
                opsInterval: 1000,
                reporters: [
                    {   reporter: require('good-console'),
                        events: { response: '*', log: '*' }
                    },
                    {   reporter: require('good-file'),
                        events: { error: '*' },
                        config: {
                            path: 'mentat',
                            rotate: 'daily' 
                        }
                    }
                ]
            }
        }
    },
    notices: {
        email: {
          fromAddress: 'notifer@yourlibrary.org',
          subjectPrefix: 'Purchase Suggestion Notice:'
        }
    },
    nodemailerOptions: {
        host: '127.0.0.1',
    	port: 25
    },
    ilsOptions: {
        catalog: {
            hostname: 'catalog.yourlibrary.org',
            patronAPISSLPort: 54620
        },
        itemTypes: {
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
        },
        locations: {
            central: 'Central',
            east: 'East'
        }
    }
};
