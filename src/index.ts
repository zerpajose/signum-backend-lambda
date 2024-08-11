import { APIGatewayEvent } from "aws-lambda";
import { router } from "./business-logic/router";
  
export const handler = async (event: APIGatewayEvent) => {
  console.log(event);
  try {
    const result = await router(event);
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    return response;
  } catch (err) {
    const error = err as Error;
    return {
      statusCode: 500,
      body: error.message,
    }
  }
};
