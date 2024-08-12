import { APIGatewayEvent } from "aws-lambda";
import { handler } from "../src/index";
import { router } from "../src/business-logic/router";

jest.mock("../src/business-logic/router");

describe("handler", () => {
  const mockEvent = {
    path: "/task",
    httpMethod: "PUT",
    body: JSON.stringify({ title: "Task 1", description: "Description 1", stage: "TODO" }),
    queryStringParameters: { taskId: "1" },
  } as unknown as APIGatewayEvent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 500 and the error message when router throws an error", async () => {
    const mockError = new Error("Something went wrong");
    (router as jest.Mock).mockRejectedValue(mockError);

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(mockError.message);
    expect(router).toHaveBeenCalledWith(mockEvent);
  });

  it("should return 200 and the result when router succeeds", async () => {
    const mockResult = { message: "success" };
    (router as jest.Mock).mockResolvedValue(mockResult);

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(mockResult));
    expect(router).toHaveBeenCalledWith(mockEvent);
  });
});
