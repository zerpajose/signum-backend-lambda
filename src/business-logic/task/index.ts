import { ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../config/dynamodb";

export async function indexTask() {
  const limit = 10;
  const input: ScanCommandInput = {
    TableName: "Task",
    Limit: limit,
    FilterExpression: "stage <> :stage",
    ExpressionAttributeValues: {
      ":stage": { "S": 'DONE' },
    },
  }
  
  const command = new ScanCommand(input);
  const result = await documentClient.send(command);
  return result.Items;
}
