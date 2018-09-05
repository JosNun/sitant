import React from 'react';
import styled from 'styled-components';
import posed from 'react-pose';

const StyledPrompt = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;

  max-width: 20em;
  padding: 1em;

  border-bottom: 1px solid #707070;
  border-left: 1px solid #707070;
`;

const Prompt = posed(StyledPrompt)({
  hidden: {
    x: 50,
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 1,
  },
  transition: {
    type: 'tween',
    ease: 'circOut',
  },
});

const ButtonContainer = styled.div`
  display: flex;

  padding-top: 1em;
  justify-content: space-around;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #707070;
  color: #707070;
  cursor: pointer;
  font-size: 1em;
  font-weight: ${props => (props.primary ? 'bold' : 'auto')};
  outline: none;
  text-decoration: none;
`;

const NavButton = Button.withComponent('a');

export default ({ hidePrompt, preventPrompt, pose }) => (
  <Prompt pose={pose}>
    Hey there, it seems that you are enjoying Sitant. Would you mind providing
    some feedback so we can make it better?
    <ButtonContainer>
      <Button onClick={hidePrompt}>Dismiss</Button>
      <Button
        onClick={() => {
          preventPrompt();
          hidePrompt();
        }}
      >
        Don’t ask me again
      </Button>
      <NavButton
        href="https://chrome.google.com/webstore/detail/sitant-simple-tasks-in-ne/koggochfeennbhkkjmbpbhfhociingae/reviews"
        target="_blank noopener noreferrer"
        primary
      >
        Sure!
      </NavButton>
    </ButtonContainer>
  </Prompt>
);
