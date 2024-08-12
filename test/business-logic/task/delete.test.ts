// FILEPATH: /mnt/c/Users/cotuo/Projects/signum/backend-lambda/test/business-logic/task/delete.test.ts

import { APIGatewayEvent } from "aws-lambda";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../../src/config/dynamodb";
import { deleteTask } from "../../../src/business-logic/task/delete";

jest.mock("../../../src/config/dynamodb");

describe("deleteTask", () => {
    let event: APIGatewayEvent;

    beforeEach(() => {
      event = {
          httpMethod: "DELETE",
          path: "/task",
          queryStringParameters: { taskId: "123" },
      } as unknown as APIGatewayEvent;

      jest.clearAllMocks();
    });

    it("should delete a task successfully", async () => {
      (documentClient.send as jest.Mock).mockResolvedValueOnce({});

      const result = await deleteTask(event);

      expect(documentClient.send).toHaveBeenCalledTimes(1);
      expect(documentClient.send).toHaveBeenCalledWith(expect.any(DeleteItemCommand));
      expect(result.success).toBe(true);
    });

    it("should return an error if taskId is not provided", async () => {
      event.queryStringParameters = null;
      try {
        await deleteTask(event);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe("Missing request path parameters");
      }
    });

    it("should return an error if DynamoDB delete fails", async () => {
      (documentClient.send as jest.Mock).mockRejectedValueOnce(new Error("DynamoDB error"));
      try {
        await deleteTask(event);
      }
      catch (error) {
        const err = error as Error;
        expect(err.message).toBe("DynamoDB error");
      }
    });
});
