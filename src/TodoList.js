import React, { Component } from 'react';
import styled from 'styled-components';
import posed, { PoseGroup } from 'react-pose';

import TodoItem from './TodoItem';

const StyledTodoList = styled.div`
  position: absolute;
  top: calc(50% + 2em);
  height: calc(50% - 2em);
  left: 50%;
  width: 40%;

  transform: translate(-50%);
`;

const Todos = styled.ul`
  width: 100%;

  padding: 0;

  list-style-type: none;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #707070;
  margin: 35px 0;
`;

const DoneTodos = styled(Todos)``;

const PosedTodos = posed(Todos)({
  open: { opacity: 1, delay: 200, staggerChildren: 200 },
  closed: { opacity: 0 },
});

const PosedTodoItem = posed(TodoItem)({
  enter: {
    opacity: 1,
    padding: '0 0 5px 0',
    height: '1em',
    transition: {
      type: 'tween',
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    padding: '0 0 0px 0',
    height: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
    },
  },
});

export default class TodoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    this.setState({
      isOpen: true,
    });
  }

  renderTodoList(todos, filter) {
    const { updateTodo, moveTodo, toggleChecked } = this.props;
    const { isOpen } = this.state;
    const filterFunc = typeof filter === 'function' ? filter : () => true;

    return todos
      .filter(filterFunc)
      .map(todo => (
        <PosedTodoItem
          key={todo.value}
          isOpen={isOpen}
          todo={todo}
          updateTodo={updateTodo}
          moveTodo={moveTodo}
          toggleChecked={toggleChecked}
        />
      ));
  }

  render() {
    const { todos } = this.props;
    return (
      <StyledTodoList>
        <PosedTodos pose={this.state.isOpen ? 'open' : 'closed'}>
          <PoseGroup flipMove="false">
            {this.renderTodoList(todos, todo => !todo.isComplete)}
          </PoseGroup>
        </PosedTodos>
        <Divider />
        <DoneTodos>
          <PoseGroup>
            {this.renderTodoList(todos, todo => todo.isComplete)}
          </PoseGroup>
        </DoneTodos>
      </StyledTodoList>
    );
  }
}
