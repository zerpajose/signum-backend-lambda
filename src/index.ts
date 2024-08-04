import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
  
export const handler = async (event: APIGatewayEvent) => {
  console.log(event);
  try {
    const { title, description, status } = JSON.parse(event.body ?? "{}");
    const uniqueId = "2";
    const input = {
      "TableName": "Task",
      "Item": {
        "taskId": {
          "S": uniqueId,
        },
        "title": {
          "S": title,
        },
        "description": {
          "S": description,
        },
        "status": {
          "S": status,
        },
      },
    };
    
    const command = new PutItemCommand(input);
    const result = await docClient.send(command);
  
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    return response;
  } catch (err) {
    const error = err as Error;
    return {
      statusCode: 500,
      body: error.message,
    }
  }
};
