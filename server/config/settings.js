'use strict';

module.exports = {
    auth: {
        key: '0x123456789',
        tokenTTL: 1440
    },
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
                            path: 'mentat.log',
                            rotate: 'daily' 
                        }
                    }
                ]
            }
        }
    },
    nodemailerOptions: {
        service: 'Gmail',
        auth: {
            user: 'something@example.com  ',
            pass: 'somepassword'
        }
    },
    ilsOptions: {
        catalog: {
            hostname: 'localhost',
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
            albina: 'Albina',
            belmont: 'Belmont',
            capitol_hill: 'Capitol Hill',
            central: 'Central',
            fairview: 'Fairview',
            gregory_heights: 'Gregory Heights',
            gresham: 'Gresham',
            hillsdale: 'Hillsdale',
            holgate: 'Holgate',
            hollywood: 'Hollywood',
            kenton: 'Kenton',
            los: 'Library Outreach Services',
            midland: 'Midland',
            north_portland: 'North Portland',
            northwest: 'Northwest',
            rockwood: 'Rockwood',
            st_johns: 'St. Johns',
            sellwood: 'Sellwood',
            troutdale: 'Troutdale',
            woodstock: 'Woodstock'
        }
    }
};
