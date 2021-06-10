import * as Api from '../../api';

const { GET, POST } = Api;

describe('asyncRequest()', () => {
  const fetchMock = global.fetch = jest.fn();

  it('Handles GET requests', () => {
    const url = 'http://localhost:3000/';
    const params = {
      method: GET,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
    Api.asyncRequest();
    expect(fetchMock).toHaveBeenCalledWith(url, params);
  });

  it('Handles POST requests', () => {
    const todo = { text: 'Todo' };
    const url = 'http://localhost:3000/create';
    const params = {
      method: POST,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    };
    Api.asyncRequest(POST, 'create', todo);
    expect(fetchMock).toHaveBeenCalledWith(url, params);
  });
});

describe('Api methods', () => {
  const asyncRequestMock = jest.spyOn(Api, 'asyncRequest');

  it('fetchTodos()', () => {
    Api.fetchTodos();
    expect(asyncRequestMock).toHaveBeenCalledWith(); // Called with no arguments
  })

  it('createTodo()', () => {
    Api.createTodo('Todo');
    expect(asyncRequestMock).toHaveBeenCalledWith(POST, 'create', { text: 'Todo' });
  });

  it('deleteTodo()', () => {
    Api.deleteTodo(123);
    expect(asyncRequestMock).toHaveBeenCalledWith(POST, 'delete', { id: 123 });
  });

  it('toggleTodo()', () => {
    Api.toggleTodo(123, true);
    expect(asyncRequestMock).toHaveBeenCalledWith(POST, 'toggle', { id: 123 , done: true });
  });
});
