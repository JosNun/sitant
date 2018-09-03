import React, { Component } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';

import chevron from './assets/icons/chevron.svg';
import check from './assets/icons/check.svg';

const StyledTodoItem = styled.li`
  position: relative;
  width: 80%;
  height: 1em;

  margin: 1em auto;
  padding-bottom: 5px;

  border: none;
  border-bottom: 0.05em solid #707070;
  font-weight: 300;

  /* &:before {
    content: '';
    position: absolute;
    bottom: -0.2em;
    left: 0;
    width: 100%;
    height: 0.05em;

    background-color: #707070;
  } */

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: calc(2.5px + 1.15em);
    width: 0;
    height: 1px;
    background-color: #707070;

    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${props =>
    props.isComplete
      ? `
      
      opacity: 0.8;
      
      &:after {
        width: calc(100% - 4em);
      }
      
  `
      : ''};
`;

const PosedTodo = posed(StyledTodoItem)({
  open: { y: 0, opacity: 1 },
  closed: { y: '50%', opacity: 0 },
});

const Input = styled.input.attrs({
  type: 'text',
})`
  position: absolute;
  top: 0;
  bottom: 0.1em;
  left: calc(5px + 1.5em);
  width: calc(100% - 4em - 5px);

  background-color: transparent;
  border: none;
  color: #707070;
  outline: none;

  transition-duration: 0.3s;

  &:focus {
    border-color: #707070;
  }

  &::placeholder {
    color: #909090;
    font-size: 1em;
  }
`;

const Checkbox = styled.button`
  position: absolute;
  left: 5px;
  top: 50%;
  width: 1.15em;
  height: 1.15em;

  box-sizing: border-box;
  padding: 0;

  background-color: transparent;
  border: 0.05em solid #707070;
  border-radius: 0.2em;
  outline: none;
  transform: translate(0, -50%);
`;

const PosedCheck = posed.div({
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
});

const Check = styled(PosedCheck)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;

  background-image: url(${check});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transform: translate(-35%, -60%);
`;

const MovementChevrons = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;

  height: 100%;

  transform: translate(0, -50%);
`;

const UpChevron = styled.div`
  float: left;
  width: 1em;
  height: 1em;

  background: url(${chevron});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 0 0.3em;
`;

const DownChevron = styled(UpChevron)`
  float: right;

  transform: rotate(180deg);
`;

class TodoItem extends Component {
  constructor(props) {
    super(props);
    const { todo } = this.props;

    this.state = {
      value: todo.value,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const {
      todo,
      updateTodo,
      moveTodo,
      toggleChecked,
      hostRef,
      style,
    } = this.props;
    const { value } = this.state;
    return (
      <PosedTodo isComplete={todo.isComplete} innerRef={hostRef} style={style}>
        <Checkbox
          onClick={() => {
            toggleChecked(todo);
          }}
        >
          <Check pose={todo.isComplete ? 'visible' : 'hidden'} />
        </Checkbox>
        <Input
          value={value}
          onChange={e => {
            this.handleChange(e);
          }}
          onKeyUp={e => {
            if (e.keyCode === 13) {
              updateTodo(todo.value, value);
            }
          }}
          onBlur={() => {
            updateTodo(todo.value, value);
          }}
        />
        <MovementChevrons>
          <UpChevron
            onClick={() => {
              moveTodo(todo, -1);
            }}
          />
          <DownChevron
            onClick={() => {
              moveTodo(todo, 1);
            }}
          />
        </MovementChevrons>
      </PosedTodo>
    );
  }
}

export default TodoItem;
