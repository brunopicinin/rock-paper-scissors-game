import { render } from '@testing-library/react';
import Game from './Game';
import { calcRoundWinner } from './Game';

jest.mock('./components/RoboflowModel', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-roboflow-model"></div>,
  };
});

describe('Game component', () => {
  it('renders without crashing', () => {
    render(<Game />);
  });

  it('initializes with the loading state', () => {
    const { container } = render(<Game />);
    const loadingElement = container.querySelector('.loading');
    expect(loadingElement).toBeInTheDocument();
  });
});

describe('calcRoundWinner function', () => {
  test('user wins with rock vs. scissors', () => {
    expect(calcRoundWinner('Rock', 'Scissors')).toBe('user');
  });

  test('computer wins with scissors vs. rock', () => {
    expect(calcRoundWinner('Scissors', 'Rock')).toBe('comp');
  });

  test('it is a draw with scissors vs. scissors', () => {
    expect(calcRoundWinner('Scissors', 'Scissors')).toBe('draw');
  });
});
