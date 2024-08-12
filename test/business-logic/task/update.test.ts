import { APIGatewayEvent } from "aws-lambda";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../../src/config/dynamodb";
import { updateTask } from "../../../src/business-logic/task/update";

jest.mock("../../../src/config/dynamodb");

describe("updateTask", () => {
  const mockEvent = {
    body: JSON.stringify({ title: "Task 1", description: "Description 1", stage: "TODO" }),
    queryStringParameters: { taskId: "1" },
  } as unknown as APIGatewayEvent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if request body is missing", async () => {
    const eventWithoutBody = { ...mockEvent, body: null } as unknown as APIGatewayEvent;

    await expect(updateTask(eventWithoutBody)).rejects.toThrow("Missing request body");
  });

  it("should throw an error if query string parameters are missing", async () => {
    const eventWithoutQueryParams = { ...mockEvent, queryStringParameters: null } as unknown as APIGatewayEvent;

    await expect(updateTask(eventWithoutQueryParams)).rejects.toThrow("Missing request path parameters");
  });

  it("should return updated attributes on successful update", async () => {
    const mockResult = { Attributes: { taskId: { S: "1" }, title: { S: "Task 1" }, description: { S: "Description 1" }, stage: { S: "TODO" } } };
    (documentClient.send as jest.Mock).mockResolvedValue(mockResult);

    const result = await updateTask(mockEvent);

    expect(result).toEqual(mockResult.Attributes);
    expect(documentClient.send).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
  });

  it("should throw an error if DynamoDB update fails", async () => {
    const mockError = new Error("DynamoDB error");
    (documentClient.send as jest.Mock).mockRejectedValue(mockError);

    await expect(updateTask(mockEvent)).rejects.toThrow("DynamoDB error");
  });
});
