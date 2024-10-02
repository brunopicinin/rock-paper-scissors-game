import compImg from '../images/comp.png';
import faceFullImg from '../images/face-full.png';
import faceHitImg from '../images/face-hit.png';
import handEmptyImg from '../images/hand-empty.png';
import handRockImg from '../images/hand-rock.png';
import handPaperImg from '../images/hand-paper.png';
import handScissorsImg from '../images/hand-scissors.png';
import './GameUI.css';
import { ROCK, PAPER, SCISSORS, USER, COMP, DRAW, MAX_LIVES } from '../constants';

const CHOICE_IMAGES = {
  [ROCK]: handRockImg,
  [PAPER]: handPaperImg,
  [SCISSORS]: handScissorsImg,
};

function GameUI({
  userChoice,
  compChoice,
  userScore,
  compScore,
  roundWinner,
  gameWinner,
  onRestart,
}) {
  let resultText;
  if (roundWinner === USER) {
    resultText = `${userChoice} beats ${compChoice}. User wins!`;
  } else if (roundWinner === COMP) {
    resultText = `${compChoice} beats ${userChoice}. User loses!`;
  } else if (roundWinner === DRAW) {
    resultText = "It's a draw. Try again.";
  } else {
    resultText = 'Make your move';
  }

  const endgameModal = (
    <div className="modal">
      <div className="game-result">
        <p>{gameWinner === USER ? 'YOU WON 🙌' : 'YOU LOST 😔'}</p>
        <div>
          <img
            className="face"
            src={gameWinner === USER ? faceFullImg : faceHitImg}
            alt="user avatar"
          />
        </div>
        <button onClick={onRestart}>PLAY AGAIN</button>
      </div>
    </div>
  );

  return (
    <div className="game">
      <div className="scoreboard">
        <div className="badge user-label">user</div>
        <div className="badge comp-label">comp</div>
        <span>
          {userScore}:{compScore}
        </span>
      </div>

      <div className="main">
        <div>
          <img className="face" src={faceFullImg} alt="user avatar" />
          <div className="hits">
            <p>❤️ {MAX_LIVES - compScore}</p>
          </div>
        </div>

        <div className="hand">
          <img
            className={
              (roundWinner === USER ? 'green-glow ' : '') +
              (roundWinner === COMP ? 'red-glow ' : '') +
              (roundWinner === DRAW ? 'grey-glow ' : '')
            }
            src={CHOICE_IMAGES[userChoice] || handEmptyImg}
            alt="user choice"
          />
        </div>

        <div className="hand comp-choice">
          <img
            className={
              (roundWinner === COMP ? 'green-glow ' : '') +
              (roundWinner === USER ? 'red-glow ' : '') +
              (roundWinner === DRAW ? 'grey-glow ' : '')
            }
            src={CHOICE_IMAGES[compChoice] || handEmptyImg}
            alt="computer choice"
          />
        </div>

        <div>
          <img className="face" src={compImg} alt="computer avatar" />
          <div className="hits">
            <p>❤️ {MAX_LIVES - userScore}</p>
          </div>
        </div>
      </div>

      <div className="round-result">
        <p>{resultText}</p>
        <p className="small">(move your hand outside viewport and inside again to play)</p>
      </div>

      {gameWinner ? endgameModal : null}
    </div>
  );
}

export default GameUI;
