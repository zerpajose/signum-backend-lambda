import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { documentClient } from "../../../src/config/dynamodb";
import { indexTask } from "../../../src/business-logic/task/index";

jest.mock("../../../src/config/dynamodb");

describe("indexTask", () => {
  const mockItems = [{ id: "1", title: "Task 1" }, { id: "2", title: "Task 2" }];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return items when documentClient.send resolves successfully", async () => {
    (documentClient.send as jest.Mock).mockResolvedValue({ Items: mockItems });

    const result = await indexTask();

    expect(result).toEqual(mockItems);
    expect(documentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
  });

  it("should throw an error when documentClient.send rejects", async () => {
    const mockError = new Error("DynamoDB error");
    (documentClient.send as jest.Mock).mockRejectedValue(mockError);

    await expect(indexTask()).rejects.toThrow(mockError);
    expect(documentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
  });
});
