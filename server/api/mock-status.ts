import Express from 'express';
import fileSystem from 'node:fs';

let mock: null | Record<string, string> = null;
const mockPath = import.meta.dirname + '../../../mocks/status-mock.json';

function getMock() {
  if (!mock) {
    mock = JSON.parse(
      fileSystem.readFileSync(mockPath).toString('utf-8'),
    );
  }
  mock!.region = '';
  return mock!;
}

function handleMockStatus(request: Express.Request, response: Express.Response) {
  const { region } = request.query;
  if (!region) {
    response.writeHead(400, 'Bad Request');
    response.end('Missing region parameter');
  }
  const data = getMock();
  data.region = region as string;
  response.json(mock);
  console.log(`Mocked status was called with ${region}`);
}

export default handleMockStatus;
