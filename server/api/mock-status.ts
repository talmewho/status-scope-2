import type { TStatusData } from 'common/backend.types';
import Express from 'express';
import fileSystem from 'node:fs';

let mocks: null | TStatusData[] = null;
const mockPaths = [
  import.meta.dirname + '../../../mocks/status-mock.json',
  import.meta.dirname + '../../../mocks/status-mock-with-issues.json',
  import.meta.dirname + '../../../mocks/status-mock-with-non-ok-status.json',
];

function getMock() {
  if (!mocks) {
    mocks = mockPaths.map(path => JSON.parse(fileSystem.readFileSync(path).toString('utf-8')));
  }
  const mock = { ...mocks[Math.round(Math.random() * 2)] };
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
  response.json(data);
  console.log(`Mocked status was called with ${region}`);
}

export default handleMockStatus;
