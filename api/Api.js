export const LOCALHOST = 'localhost';
export const GET = 'GET';
export const POST = 'POST';

const asyncRequest = (method, path, body) => {
  const url = `http://${LOCALHOST}:3000/${path}`;
  const params = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  };

  return new Promise((resolve, reject) => {
    fetch(url, params)
      .then(response => response.json())
      .then(data => data.error ? reject(data.error) : resolve(data))
      .catch(error => reject(error.toString()));
  });
};

const fetchTodos = () => Api.asyncRequest(GET, '');

const addTodo = (text) => Api.asyncRequest(POST, 'add', {text});

const deleteTodo = (id) => Api.asyncRequest(POST, 'delete', {id});

const completeTodo = (id, complete) => Api.asyncRequest(POST, 'complete', {id, complete});

// We export the Api methods as an object to provide context for test mocks
export const Api = { asyncRequest, fetchTodos, addTodo, deleteTodo, completeTodo };
