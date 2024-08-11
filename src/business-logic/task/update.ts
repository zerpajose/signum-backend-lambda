import { APIGatewayEvent } from "aws-lambda";
import { UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../config/dynamodb";

export async function updateTask(event: APIGatewayEvent) {
  const { body, queryStringParameters } = event;

  if(!body) {
    throw new Error("Missing request body");
  }

  if(!queryStringParameters || !queryStringParameters.taskId) {
    throw new Error("Missing request path parameters");
  }

  const { title, description, stage } = JSON.parse(body);
  const input: UpdateItemCommandInput = {
    TableName: "Task",
    Key: {
      'taskId': { S: queryStringParameters.taskId },
    },
    UpdateExpression:
      'SET title=:title, description=:description, stage=:stage',
    ExpressionAttributeValues: {
      ':title': { S: title },
      ':description': { S: description },
      ':stage': { S: stage },
    },
    ReturnValues: "ALL_NEW",
  };
  
  const command = new UpdateItemCommand(input);
  const result = await documentClient.send(command);
  return result.Attributes;
}
