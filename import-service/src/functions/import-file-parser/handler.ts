import { formatJSONResponse } from "@libs/api-gateway";

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4'
});

const sqs = new AWS.SQS();

const importFileParser = async (event) => {
  const bucket = process.env.BUCKET_NAME;
  const fileName = event.Records[0].s3.object.key;
  const params = {
      Bucket: bucket,
      Key: fileName
  }

  const paramsForCoping = {
    Bucket: bucket,
    Key: fileName.replace(process.env.UPLOADED_FOLDER, process.env.PARSED_FOLDER),
    CopySource: `${bucket}/${fileName}`,
  }

    const res = s3.getObject(params).createReadStream();

  const streamToString = (stream): Promise<any[]> => new Promise((resolve, reject) => {
      const chunks = [];
      stream
          .pipe(require('csv-parser')())
          .on('data', (chunk) => chunks.push(chunk))
          .on('error', reject)
          .on('end', async  () => {
              await s3.copyObject(paramsForCoping).promise();
              await s3.deleteObject(params).promise();
              try {
                  console.log(chunks, 'chunks');

                  for (const chunk of chunks) {
                      await sqs.sendMessage({
                          QueueUrl: 'https://sqs.us-east-1.amazonaws.com/274922047683/catalogItemsQueue',
                          MessageBody: JSON.stringify(chunk),
                      }).promise()
                  }
              } catch(error) {
                  console.log(JSON.stringify(error))
              }

              resolve(chunks);
          });
  });

  await streamToString(res)

  return formatJSONResponse({
    message: `${res}`
  });
};

export const main = importFileParser;
