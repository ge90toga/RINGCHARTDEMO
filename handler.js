'use strict';
const shiftCoverage = require('./shiftCoverage.json');
const shiftEfficiency = require('./shiftEfficiency.json');
const shiftOnTimePerf = require('./shiftOnTimePerf.json');
const crypto = require('crypto');
const path = require('path');
const s3 = require('./s3');

// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://dbadmin:Password1@ds127883.mlab.com:27883/tracker_test_db';

module.exports.endpoint = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
            message: `Hello, the current time is ${new Date().toTimeString()}.`,
        }),
    };
    callback(null, response);
};

module.exports.getShiftCoverage = (event, context, callback) => {
    const response = {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(shiftCoverage),
    };
    callback(null, response);
};

module.exports.getShiftEfficiency = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(shiftEfficiency),
    };
    callback(null, response);
};

module.exports.getShiftOnTimePerf = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(shiftOnTimePerf),
    };
    callback(null, response);
};


module.exports.getS3Credentials = (event, context, callback) => {
    // const data = event.queryStringParameters; // parse the request body
    //console.log('handler.register:: received data ', data);
    // console.log(requestFileName);
    const fileName = event.queryStringParameters.filename;
    const contentType = event.queryStringParameters.content_type;

    let s3Config = {
        accessKey: 'AKIAJA7OXDM25MON2KLQ',
        secretKey: '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',
        bucket: 'upload-lq-bucket',
        region: 'ap-southeast-2'
    };

    let filename =
        crypto.randomBytes(16).toString('hex') +
        path.extname(fileName);

    let body = JSON.stringify(s3.s3Credentials(s3Config, {filename: filename, contentType: contentType}));
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: body,
    };
    callback(null, response);
};

// module.exports.connectMLab = (event, context, callback) => {
//     const response = {
//         statusCode: 200,
//         headers: {
//             "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
//             "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
//         },
//         body: JSON.stringify(shiftOnTimePerf),
//     };
//     callback(null, response);
// };

// function testMongoConnect () {
//     MongoClient.connect(url, function(err, db) {
//         if(err){
//             console.log('error', err);
//         }
//         console.log("Connected successfully to server");
//
//         let collection = db.collection('airside_posts');
//         collection.find({"userid": "DAN.ZHU"}).toArray(function(err, docs) {
//             console.log("Found the following records");
//             console.log(docs);
//         });
//
//
//         db.close();
//     });
// }
//
// testMongoConnect();