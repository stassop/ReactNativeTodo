import * as Api from './';

export const GET = 'GET', POST = 'POST';

export const asyncRequest = (method = GET, path = '', body = {}) => {
  const url = `http://localhost:3000/${ path }`;
  const params = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ...(method === POST && { body: JSON.stringify(body) }),
  };

  return new Promise((resolve, reject) => {
    fetch(url, params)
      .then(response => response.json())
      .then(data => data.error ? reject(data.error) : resolve(data))
      .catch(error => reject(error));
  });
};

// Use Api.asyncRequest() so it can be mocked in tests

export const fetchTodos = () => Api.asyncRequest();

export const createTodo = (text) => Api.asyncRequest(POST, 'create', { text });

export const deleteTodo = (id) => Api.asyncRequest(POST, 'delete', { id });

export const toggleTodo = (id, done) => Api.asyncRequest(POST, 'toggle', { id, done });
