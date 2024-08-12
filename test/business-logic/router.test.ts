import { APIGatewayEvent } from 'aws-lambda';
import { router } from '../../src/business-logic/router';

describe('router', () => {
  const mockEvent = (httpMethod: string, path: string, queryStringParameters?: any) => ({
    httpMethod,
    path,
    queryStringParameters,
  } as unknown as APIGatewayEvent);

  it('should throw an error if the request path is missing', async () => {
    const event = mockEvent('GET', '');
    await expect(router(event)).rejects.toThrow('Missing request path');
  });

  it('should call createTask for POST /task', async () => {
    const event = mockEvent('POST', '/task');
    const createTaskMock = jest.spyOn(require('../../src/business-logic/task/create'), 'createTask').mockResolvedValue({});
    await router(event);
    expect(createTaskMock).toHaveBeenCalledWith(event);
  });

  it('should call indexTask for GET /task', async () => {
    const event = mockEvent('GET', '/task');
    const indexTaskMock = jest.spyOn(require('../../src/business-logic/task/index'), 'indexTask').mockResolvedValue({});
    await router(event);
    expect(indexTaskMock).toHaveBeenCalled();
  });

  it('should call getTask for GET /task with query parameters', async () => {
    const event = mockEvent('GET', '/task', { id: '1' });
    const getTaskMock = jest.spyOn(require('../../src/business-logic/task/get'), 'getTask').mockResolvedValue({});
    await router(event);
    expect(getTaskMock).toHaveBeenCalledWith(event);
  });

  it('should call updateTask for PUT /task with query parameters', async () => {
    const event = mockEvent('PUT', '/task', { id: '1' });
    const updateTaskMock = jest.spyOn(require('../../src/business-logic/task/update'), 'updateTask').mockResolvedValue({});
    await router(event);
    expect(updateTaskMock).toHaveBeenCalledWith(event);
  });

  it('should call deleteTask for DELETE /task with query parameters', async () => {
    const event = mockEvent('DELETE', '/task', { id: '1' });
    const deleteTaskMock = jest.spyOn(require('../../src/business-logic/task/delete'), 'deleteTask').mockResolvedValue({});
    await router(event);
    expect(deleteTaskMock).toHaveBeenCalledWith(event);
  });

  it('should throw an error for invalid HTTP method', async () => {
    const event = mockEvent('PATCH', '/task');
    try {
      await router(event);
    } catch (error) {
      const err = error as Error;
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Invalid method');
    }
  });

  it('should throw an error for invalid HTTP method (with querystring params)', async () => {
    const event = mockEvent('PATCH', '/task', { id: '1' });
    try {
      await router(event);
    } catch (error) {
      const err = error as Error;
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Invalid method');
    }
  });
});
