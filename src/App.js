/* global chrome */
import React, { Component } from 'react';
import styled from 'styled-components';

import './App.css';

import TodoForm from './TodoForm';
import TodoList from './TodoList';
import ReviewPrompt from './ReviewPrompt';

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

    this.state = {
      todos: [],
    };

    this.addTodo = this.addTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.moveTodo = this.moveTodo.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this.hideReviewPrompt = this.hideReviewPrompt.bind(this);

    if (!DEVMODE) {
      chrome.storage.sync.get('openCount', result => {
        chrome.storage.sync.set({
          openCount: result.openCount + 1 || 1,
        });
      });
    }
  }

  componentDidMount() {
    if (!DEVMODE) {
      chrome.storage.sync.get(['todos', 'openCount', 'dontPrompt'], result => {
        const todos = result.todos || [];
        const showRatePrompt =
          !result.dontPrompt && result.openCount % 100 === 0;
        this.setState({
          todos,
          showRatePrompt,
        });
      });
    } else {
      this.setState({
        todos: dummyTodos,
      });

      window.promptReview = () => {
        this.setState({
          showRatePrompt: true,
        });
      };
    }
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

  hideReviewPrompt() {
    this.setState({
      showRatePrompt: false,
    });
  }

  preventReviewPrompt() {
    if (!DEVMODE) {
      chrome.storage.sync.set({ dontPrompt: true });
    } else {
      console.log('preventing prompt');
    }
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
    if (!DEVMODE) chrome.storage.sync.set({ todos });
    this.setState({
      todos,
    });
  }

  render() {
    const { todos } = this.state;
    return (
      <Container className="App">
        <ReviewPrompt
          pose={this.state.showRatePrompt ? 'open' : 'hidden'}
          hidePrompt={this.hideReviewPrompt}
          preventPrompt={this.preventReviewPrompt}
        />
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
