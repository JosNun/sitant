import React, { Component } from 'react';
import styled from 'styled-components';

import addButton from './assets/icons/add-button.svg';

const StyledForm = styled.form`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2em;

  border: 3px solid #909090;
  border-width: 0 0 3px 0;
  transform: translate(-50%, -50%);
`;

const Input = styled.input.attrs({
  type: 'text',
})`
  position: absolute;
  top: 0;
  bottom: 0;
  width: calc(100% - 2em);

  padding: 5px;

  background-color: transparent;
  border: none;
  color: #707070;
  font-size: 1.2em;
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

const AddButton = styled.input.attrs({
  type: 'submit',
  value: '',
})`
  position: absolute;
  right: 5px;
  top: 50%;
  width: 1.8em;
  height: 1.8em;
  padding: 0;

  background: url(${addButton});
  background-size: contain;
  border: none;
  outline: none;

  transform: translate(0, -50%);
`;

class TodoForm extends Component {
  constructor(props) {
    super(props);

    this.todoField = React.createRef();
  }

  render() {
    return (
      <StyledForm
        onSubmit={e => {
          const { addTodo } = this.props;

          e.preventDefault();
          if (this.todoField.value === '') return;
          addTodo(this.todoField.value);
          this.todoField.value = '';
        }}
      >
        <Input
          placeholder="Enter a todo..."
          innerRef={input => {
            this.todoField = input;
          }}
        />
        <AddButton />
      </StyledForm>
    );
  }
}

export default TodoForm;
