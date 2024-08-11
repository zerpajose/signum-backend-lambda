import { APIGatewayEvent } from "aws-lambda";
import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../config/dynamodb";

export async function getTask(event: APIGatewayEvent) {
  const { path } = event;

  const paths = path.split("/");
  const parameter = paths[2];

  if(!parameter) {
    throw new Error("Missing request path parameters");
  }

  const input: GetItemCommandInput = {
    TableName: "Task",
    Key: {
      'taskId': { S: parameter }
    },
  }
  
  const command = new GetItemCommand(input);
  const result = await documentClient.send(command);
  return result.Item;
}
