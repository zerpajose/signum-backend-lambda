import { APIGatewayEvent } from "aws-lambda";
import { DeleteItemCommand, DeleteItemCommandInput } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../config/dynamodb";

export async function deleteTask(event: APIGatewayEvent) {
  const { queryStringParameters } = event;

  if(!queryStringParameters || !queryStringParameters.taskId) {
    throw new Error("Missing request path parameters");
  }

  const input: DeleteItemCommandInput = {
    TableName: "Task",
    Key: {
      'taskId': { S: queryStringParameters.taskId },
    },
  }
  
  const command = new DeleteItemCommand(input);
  const result = await documentClient.send(command);
  return result.Attributes;
}
