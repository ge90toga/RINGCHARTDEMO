'use strict';
const crypto = require('crypto');

function s3Credentials(config, params) {
    return {
        endpoint_url: "https://" + config.bucket + ".s3.amazonaws.com",
        //endpoint_url: "https://s3-ap-southeast-2.amazonaws.com/upload-lq-bucket",
        params: s3Params(config, params)
    }
}

// Returns the parameters that must be passed to the API call
function s3Params(config, params) {
    let credential = amzCredential(config);
    let policy = s3UploadPolicy(config, params, credential);
    let policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');
    return {
        key: params.filename,
        acl: 'public-read',
        success_action_status: '201',
        policy: policyBase64,
        "content-type": params.contentType,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': credential,
        'x-amz-date': dateString() + 'T000000Z',
        'x-amz-signature': s3UploadSignature(config, policyBase64, credential)
    }
}

function dateString() {
    let date = new Date().toISOString();
    return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
}

function amzCredential(config) {
    return [config.accessKey, dateString(), config.region, 's3/aws4_request'].join('/')
}

// Constructs the policy
function s3UploadPolicy(config, params, credential) {
    return {
        // 5 minutes into the future
        expiration: new Date((new Date).getTime() + (5 * 60 * 1000)).toISOString(),
        conditions: [
            { bucket: config.bucket },
            { key: params.filename },
            { acl: 'public-read' },
            { success_action_status: "201" },
            // Optionally control content type and file size
            // A content-type clause is required (even if it's all-permissive)
            // so that the uploader can specify a content-type for the file
            ['starts-with', '$Content-Type',  ''],
            ['content-length-range', 0, 99999999999999999],
            { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
            { 'x-amz-credential': credential },
            { 'x-amz-date': dateString() + 'T000000Z' }
        ],
    }
}

function hmac(key, string) {
    let hmac = require('crypto').createHmac('sha256', key);
    hmac.end(string);
    return hmac.read();
}

// Signs the policy with the credential
function s3UploadSignature(config, policyBase64, credential) {
    let dateKey = hmac('AWS4' + config.secretKey, dateString());
    let dateRegionKey = hmac(dateKey, config.region);
    let dateRegionServiceKey = hmac(dateRegionKey, 's3');
    let signingKey = hmac(dateRegionServiceKey, 'aws4_request');
    return hmac(signingKey, policyBase64).toString('hex');
}

module.exports = {
    s3Credentials: s3Credentials
};
