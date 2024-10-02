import { render, screen, fireEvent } from '@testing-library/react';
import GameUI from './GameUI';

const mockOnRestart = jest.fn();

const renderGameUI = (props) => {
  return render(<GameUI onRestart={mockOnRestart} {...props} />);
};

describe('GameUI Component', () => {
  it('renders without crashing', () => {
    renderGameUI({});
    expect(screen.getByText('Make your move')).toBeInTheDocument();
  });

  it('displays the correct result text when user wins', () => {
    renderGameUI({
      roundWinner: 'user',
      userChoice: 'Rock',
      compChoice: 'Scissors',
    });
    expect(screen.getByText('Rock beats Scissors. User wins!')).toBeInTheDocument();
  });

  it('displays the correct result text when computer wins', () => {
    renderGameUI({
      roundWinner: 'comp',
      userChoice: 'Paper',
      compChoice: 'Scissors',
    });
    expect(screen.getByText('Scissors beats Paper. User loses!')).toBeInTheDocument();
  });

  it('displays the correct result text for a draw', () => {
    renderGameUI({
      roundWinner: 'draw',
      userChoice: 'Rock',
      compChoice: 'Rock',
    });
    expect(screen.getByText("It's a draw. Try again.")).toBeInTheDocument();
  });

  it('displays the endgame modal when the user wins the game', () => {
    renderGameUI({
      gameWinner: 'user',
      userChoice: 'Rock',
      compChoice: 'Scissors',
    });
    expect(screen.getByText('YOU WON 🙌')).toBeInTheDocument();
    expect(screen.getByText('PLAY AGAIN')).toBeInTheDocument();
  });

  it('displays the endgame modal when the computer wins the game', () => {
    renderGameUI({
      gameWinner: 'comp',
      userChoice: 'Rock',
      compChoice: 'Paper',
    });
    expect(screen.getByText('YOU LOST 😔')).toBeInTheDocument();
    expect(screen.getByText('PLAY AGAIN')).toBeInTheDocument();
  });

  it('calls the onRestart function when the "PLAY AGAIN" button is clicked', () => {
    renderGameUI({
      gameWinner: 'user',
      userChoice: 'Rock',
      compChoice: 'Scissors',
    });
    fireEvent.click(screen.getByText('PLAY AGAIN'));
    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  it('displays the initial score correctly', () => {
    renderGameUI({
      userScore: 0,
      compScore: 0,
    });
    expect(screen.getByText('0:0')).toBeInTheDocument();
  });

  it('displays the correct score when the user is winning', () => {
    renderGameUI({
      roundWinner: 'user',
      userChoice: 'Rock',
      compChoice: 'Scissors',
      userScore: 2,
      compScore: 1,
    });
    expect(screen.getByText('2:1')).toBeInTheDocument();
  });

  it('displays the correct score when the computer is winning', () => {
    renderGameUI({
      roundWinner: 'comp',
      userChoice: 'Paper',
      compChoice: 'Scissors',
      userScore: 2,
      compScore: 3,
    });
    expect(screen.getByText('2:3')).toBeInTheDocument();
  });

  it('displays the correct score for a draw', () => {
    renderGameUI({
      roundWinner: 'draw',
      userChoice: 'Rock',
      compChoice: 'Rock',
      userScore: 1,
      compScore: 1,
    });
    expect(screen.getByText('1:1')).toBeInTheDocument();
  });
});
