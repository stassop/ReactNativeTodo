const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors({
  'origin': '*',
  'allowedHeaders': ['Content-Type', 'Accept'],
  'methods': ['GET, POST']
}));

const port = 3000;
const file = path.join(__dirname, './todos.json');

const createTodo = (text) => ({
  text,
  id: String(Date.now()),
  complete: false
});

const readTodos = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, todos) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(JSON.parse(todos));
      }
    });
  });
};

const writeTodos = (todos) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(todos), err => {
      if (err) {
        reject(err);
      }
      else {
        resolve(todos);
      }
    });
  });
};

const getTodos = async (req, res, next) => {
  try {
    const todos = await readTodos();
    setTimeout(() => res.json(todos), 1000);
  }
  catch (err) {
    next(err);
  }
};

const addTodo = async (req, res, next) => {
  const { text } = req.body;
  try {
    if (!text) {
      throw new Error('No todo provided!');
    }
    let todos = await readTodos();
    let todo = todos.find(todo => todo.text === text);
    if (!todo) {
      todo = createTodo(text);
      todos.push(todo);
      await writeTodos(todos);
      setTimeout(() => res.json(todo), 1000);
    }
    else {
      throw new Error('Todo already exists!');
    }
  }
  catch (err) {
    next(err);
  }
};

const deleteTodo = async (req, res, next) => {
  const { id } = req.body;
  try {
    let todos = await readTodos();
    let todo = todos.find(todo => todo.id === id);
    if (todo) {
      todos = todos.filter(todo => todo.id !== id);
      await writeTodos(todos);
      setTimeout(() => res.json(todo), 1000);
    }
    else {
      throw new Error('Todo not found!');
    }
  }
  catch (err) {
    next(err);
  }
};

const completeTodo = async (req, res, next) => {
  const { id, complete } = req.body;
  try {
    let todos = await readTodos();
    let todo = todos.find(todo => todo.id === id);
    if (todo) {
      todo.complete = complete;
      await writeTodos(todos);
      setTimeout(() => res.json(todo), 1000);
    }
    else {
      throw new Error('Todo not found!');
    }
  }
  catch (err) {
    next(err);
  }
};

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({error: err.toString()});
};

app.get('/', getTodos);
app.post('/add', addTodo);
app.post('/delete', deleteTodo);
app.post('/complete', completeTodo);
app.use(handleError);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
