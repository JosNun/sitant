/* global chrome */
import React, { Component } from 'react';
import styled from 'styled-components';

import './App.css';

import TodoForm from './TodoForm';
import TodoList from './TodoList';

const DEVMODE = !(window.chrome && chrome.runtime && chrome.runtime.id);

const dummyTodos = [
  {
    value: 'I’m a dummy todo',
    isComplete: false,
  },
  {
    value: 'I’m another dummy todo',
    isComplete: false,
  },
  {
    value: 'I’m a comlete todo',
    isComplete: true,
  },
  {
    value: 'I’m another complete todo',
    isComplete: true,
  },
];

const Container = styled.div`
  color: #707070;
`;

class App extends Component {
  constructor(props) {
    super(props);

    let todos;

    if (!DEVMODE) {
      todos = JSON.parse(localStorage.getItem('todos'));
      if (!todos) todos = [];
    } else {
      todos = dummyTodos;
    }

    this.state = {
      todos,
    };

    this.addTodo = this.addTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.moveTodo = this.moveTodo.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
  }

  addTodo(content) {
    const { todos: lastTodos } = this.state;
    const newTodo = {
      value: content,
      isComplete: false,
    };
    const newTodos = [newTodo, ...lastTodos];
    this.syncTodos(newTodos);
  }

  updateTodo(oldValue, newValue) {
    const { todos: currentTodos } = this.state;

    const newTodos = currentTodos;

    const todoIndex = currentTodos.findIndex(todo => todo.value === oldValue);
    if (newValue === '') {
      newTodos.splice(todoIndex, 1);
    } else {
      newTodos[todoIndex].value = newValue;
    }

    this.syncTodos(newTodos);
  }

  sortTodos(todos) {
    const undoneTodos = todos.filter(todo => !todo.isComplete);
    const doneTodos = todos.filter(todo => todo.isComplete);

    const newTodos = [...undoneTodos, ...doneTodos];

    return newTodos;
  }

  moveTodo(todo, count) {
    const { todos: currentTodos } = this.state;
    let newTodos = currentTodos;

    const todoIndex = currentTodos.indexOf(todo);
    if (todoIndex === 0 && count <= 0) return;
    newTodos.splice(todoIndex + count, 0, newTodos.splice(todoIndex, 1)[0]);

    newTodos = this.sortTodos(newTodos);

    this.syncTodos(newTodos);
  }

  toggleChecked(todo) {
    const { todos: currentTodos } = this.state;

    let newTodos = currentTodos;

    const todoIndex = currentTodos.indexOf(todo);
    newTodos[todoIndex].isComplete = !newTodos[todoIndex].isComplete;

    newTodos = this.sortTodos(newTodos);

    this.syncTodos(newTodos);
  }

  syncTodos(todos) {
    if (!DEVMODE) localStorage.setItem('todos', JSON.stringify(todos));
    this.setState({
      todos,
    });
  }

  render() {
    const { todos } = this.state;
    return (
      <Container className="App">
        <TodoForm addTodo={this.addTodo} />
        <TodoList
          todos={todos}
          updateTodo={this.updateTodo}
          moveTodo={this.moveTodo}
          toggleChecked={this.toggleChecked}
        />
      </Container>
    );
  }
}

export default App;
