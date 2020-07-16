import { Api, LOCALHOST, GET, POST } from '../../api/Api';

fetch = jest.fn();

describe('Api async request', () => {
  it('Calls fetch() with correct params', () => {
    const method = POST;
    const path = 'add';
    const url = `http://${LOCALHOST}:3000/${path}`;
    const body = {text: 'New todo'};
    const params = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    Api.asyncRequest(method, path, body);

    expect(fetch).toHaveBeenCalledWith(url, params);
  });
});

describe('Api methods', () => {
  let asyncRequestMock;

  beforeAll(() => {
    asyncRequestMock = jest.spyOn(Api, 'asyncRequest').mockImplementation(jest.fn());
  });

  afterAll(() => {
    asyncRequestMock.mockRestore();
  });

  it('fetchTodos() calls asyncRequest() with correct params', () => {
    Api.fetchTodos();

    expect(asyncRequestMock).toHaveBeenCalledWith(GET, '');
  });

  it('addTodo() calls asyncRequest() with correct params', () => {
    const text = 'New todo';

    Api.addTodo(text);

    expect(asyncRequestMock).toHaveBeenCalledWith(POST, 'add', {text});
  });

  it('deleteTodo() calls asyncRequest() with correct params', () => {
    const id = '123';

    Api.deleteTodo(id);

    expect(asyncRequestMock).toHaveBeenCalledWith(POST, 'delete', {id});
  });

  it('completeTodo() calls asyncRequest() with correct params', () => {
    const id = '123';
    const complete = true;

    Api.completeTodo(id, complete);

    expect(asyncRequestMock).toHaveBeenCalledWith(POST, 'complete', {id, complete});
  });
});
