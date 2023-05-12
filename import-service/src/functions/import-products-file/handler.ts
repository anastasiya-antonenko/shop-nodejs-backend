import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from "@libs/api-gateway";

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4'
});

const importProductsFile = async (event) => {
  const fileName = event.queryStringParameters.fileName;
  const folder = process.env.UPLOADED_FOLDER;
  const bucket = process.env.BUCKET_NAME;

  const res = await s3.getSignedUrlPromise('putObject', {
      "Bucket": bucket,
      "Key": `${folder}/${fileName}`
  });

  return formatJSONResponse({
    message: `${res}`
  });
};

export const main = middyfy(importProductsFile );
