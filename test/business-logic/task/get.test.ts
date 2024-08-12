import { APIGatewayEvent } from "aws-lambda";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../../src/config/dynamodb";
import { getTask } from "../../../src/business-logic/task/get";

jest.mock("../../../src/config/dynamodb");

describe("getTask", () => {
  const mockEvent = {
    queryStringParameters: { taskId: "1" },
  } as unknown as APIGatewayEvent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error when queryStringParameters is missing", async () => {
    const event = {} as APIGatewayEvent;

    await expect(getTask(event)).rejects.toThrow("Missing request path parameters");
  });

  it("should throw an error when taskId is missing", async () => {
    const event = { queryStringParameters: {} } as APIGatewayEvent;

    await expect(getTask(event)).rejects.toThrow("Missing request path parameters");
  });

  it("should return the result when documentClient.send succeeds", async () => {
    const mockResult = { Item: { taskId: { S: "1" }, title: { S: "Task 1" } } };
    (documentClient.send as jest.Mock).mockResolvedValue(mockResult);

    const result = await getTask(mockEvent);

    expect(result).toEqual(mockResult.Item);
    expect(documentClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
  });

  it("should throw an error when documentClient.send fails", async () => {
    const mockError = new Error("DynamoDB error");
    (documentClient.send as jest.Mock).mockRejectedValue(mockError);

    await expect(getTask(mockEvent)).rejects.toThrow("DynamoDB error");
  });
});
