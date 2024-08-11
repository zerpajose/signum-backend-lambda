import { APIGatewayEvent } from "aws-lambda";
import { createTask } from "./task/create";
import { indexTask } from "./task/index";
import { getTask } from "./task/get";
import { deleteTask } from "./task/delete";
import { updateTask } from "./task/update";

export async function router(event: APIGatewayEvent) {
  if(!event.path) {
    throw new Error("Missing request path");
  }

  const { httpMethod, path, queryStringParameters } = event;

  const paths = path.split("/");
  const resource = paths[1];

  if (resource === "task") {
    if (!queryStringParameters) {
      switch (httpMethod) {
        case "POST":
          return createTask(event);
        case "GET":
          return indexTask();
        default:
          throw new Error("Invalid method");
      }
    } else {
       switch (httpMethod) {
         case "GET":
           return getTask(event);
         case "PUT":
           return updateTask(event);
         case "DELETE":
           return deleteTask(event);
         default:
           throw new Error("Invalid method");
      }
    }
  }
}
