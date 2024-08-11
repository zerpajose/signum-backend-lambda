import { APIGatewayEvent } from "aws-lambda";
import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../config/dynamodb";

export async function getTask(event: APIGatewayEvent) {
  const { queryStringParameters } = event;

  // const paths = path.split("/");
  // const parameter = paths[2];

  if(!queryStringParameters || !queryStringParameters.taskId) {
    throw new Error("Missing request path parameters");
  }

  const input: GetItemCommandInput = {
    TableName: "Task",
    Key: {
      'taskId': { S: queryStringParameters.taskId },
    },
  }
  
  const command = new GetItemCommand(input);
  const result = await documentClient.send(command);
  return result.Item;
}
