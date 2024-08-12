import { createTask } from '../../../src/business-logic/task/create';
import { APIGatewayEvent } from 'aws-lambda';
import { documentClient } from '../../../src/config/dynamodb';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../../src/config/dynamodb');
jest.mock('uuid');

describe('createTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the request body is missing', async () => {
    const event: APIGatewayEvent = {
      body: null,
      // other properties can be mocked as needed
    } as any;

    await expect(createTask(event)).rejects.toThrow('Missing request body');
  });

  it('should create a task successfully', async () => {
    const mockUuid = '1234-5678-91011';
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const event: APIGatewayEvent = {
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
        stage: 'Test Stage',
      }),
      // other properties can be mocked as needed
    } as any;

    const mockResult = {
      $metadata: {
        requestId: 'mockRequestId',
      },
    };
    (documentClient.send as jest.Mock).mockResolvedValue(mockResult);

    const result = await createTask(event);

    expect(result).toEqual({
      taskId: mockUuid,
      requestId: 'mockRequestId',
    });

    expect(documentClient.send).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should handle errors from documentClient.send', async () => {
    const mockUuid = '1234-5678-91011';
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const event: APIGatewayEvent = {
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
        stage: 'Test Stage',
      }),
      // other properties can be mocked as needed
    } as any;

    (documentClient.send as jest.Mock).mockRejectedValue(new Error('DynamoDB error'));

    await expect(createTask(event)).rejects.toThrow('DynamoDB error');
  });
});
