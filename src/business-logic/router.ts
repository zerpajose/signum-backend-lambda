import { APIGatewayEvent } from "aws-lambda";
import { createTask } from "./task/create";
import { indexTask } from "./task/index";

export async function router(event: APIGatewayEvent) {
  if(!event.path) {
    throw new Error("Missing request path");
  }

  const { httpMethod, path } = event;

  const paths = path.split("/");
  const resource = paths[1];
  const parameter = paths[2];

  if (resource === "task") {
    if (parameter === undefined) {
      switch (httpMethod) {
        case "POST":
          return createTask(event);
        case "GET":
          return indexTask();
        default:
          throw new Error("Invalid method");
      }
    }
    // else {
    //   switch (httpMethod) {
    //     case "GET":
    //       return getTask(event);
    //     case "PUT":
    //       return updateTask(event);
    //     case "DELETE":
    //       return deleteTask(event);
    //     default:
    //       throw new Error("Invalid method");
    //   }
    // }
  }
}

// Task
// createTask (POST) /task { title, description, state }
// getTask (GET) /task/1
// indexTasks (GET) /task
// updateTask (PUT) /task/1 { title, description, state }
// deleteTask (DELETE) /task/1
