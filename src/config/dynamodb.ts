import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
export const documentClient = DynamoDBDocumentClient.from(dynamoClient);
