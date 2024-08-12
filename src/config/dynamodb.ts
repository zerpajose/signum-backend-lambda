import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const isTest = process.env.JEST_WORKER_ID;
let config;
if(isTest) {
  config = {
    ...(isTest && {
      convertEmptyValues: true,
      endpoint: 'localhost:8000',
      sslEnabled: false,
      region: 'local-env',
    }),
  };
} else {
  config = {
    region: "us-east-1",
  };
}

const dynamoClient = new DynamoDBClient(config);
export const documentClient = DynamoDBDocumentClient.from(dynamoClient);
