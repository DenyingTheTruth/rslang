import React from 'react';
import {
  Button,
  Modal,
  Row,
  Image,
  Nav,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import classNames from 'classnames';
import Voice from '../../../assets/images/voice.svg';
import routes from '../../../constants/routes';

const StatsModal = (props) => {
  const {
    score, guessedWords, round, showStats,
  } = props.stats;

  const {
    closeModalStats, restartRound, nextRound, allWords,
  } = props;

  const NavLink = (link, text) => (
    <LinkContainer to={link} exact>
      <Nav.Link eventKey={link}>{text}</Nav.Link>
    </LinkContainer>
  );

  const restart = () => {
    closeModalStats();
    restartRound();
  };

  const next = () => {
    closeModalStats();
    nextRound();
  };

  const repeatAudio = (audio) => (new Audio(audio)).play();

  const checkWord = (word) => guessedWords.find((item) => item.id === word.id) || 0;

  return (
    <>
      <Modal
        show={showStats}
        onHide={next}
        backdrop="static"
        keyboard={false}
        className="audiocall-stats"
      >
        <Modal.Header closeButton>
          <Modal.Title>Stats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {`Score - ${score} / 10`}
          </p>
          <p>
            {`Round - ${round}`}
          </p>
          {
            allWords.map((word) => (
              <Row className="row-word" key={word.id}>
                <Image
                  onClick={() => repeatAudio(word.audio)}
                  src={Voice}
                  alt={Voice}
                  className="stats-voice-repeat"
                />
                <p
                  className={
                    classNames({
                      'guessed-word': checkWord(word),
                    })
                  }
                >
                  {`- ${word.word} - ${word.wordTranslate}`}
                </p>
              </Row>
            ))
          }
        </Modal.Body>
        <Modal.Footer className="stats-footer">
          {NavLink(routes.MINI_GAMES, 'In menu')}
          <Button variant="primary" onClick={restart} width={80}>
            Restart
          </Button>
          <Button variant="primary" onClick={next} width={120}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StatsModal;
