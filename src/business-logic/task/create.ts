import { APIGatewayEvent } from "aws-lambda";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../config/dynamodb";
import { v4 as uuidv4 } from 'uuid';

export async function createTask(event: APIGatewayEvent) {
  if(!event.body) {
    throw new Error("Missing request body");
  }

  const { title, description, state } = JSON.parse(event.body);
  const input = {
    "TableName": "Task",
    "Item": {
      "taskId": {
        "S": uuidv4(),
      },
      "title": {
        "S": title,
      },
      "description": {
        "S": description,
      },
      "state": {
        "S": state,
      },
    },
  };
  
  const command = new PutItemCommand(input);
  const result = await documentClient.send(command);
  return result;
}
