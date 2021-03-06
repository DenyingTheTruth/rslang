import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ResultWordItem from '../gameResultItem/GameResultItem';
import routes from '../../../constants/routes';
import './gameResults.scss';

class GameResults extends Component {
  playAudio = (e) => {
    e.currentTarget.querySelector('.result__container audio')?.play();
  }

  setNewGame = (e) => {
    e.preventDefault();
    this.props.restart();
  }

  returnToGame = (e) => {
    e.preventDefault();
    this.props.continueGame();
  }

  render = () => (
    <div className="result__container speak-it">
      <div className="error__title">
        <p>
          Ошибок
          <span className="badge badge-primary">
            {' '}
            {this.props.state.words.filter((x) => !this.props.state.knownWords.includes(x)).length}
          </span>
        </p>
      </div>
      <div className="error__words">
        {this.props.state.words.filter((x) => !this.props.state.knownWords.includes(x))
          .map((x, i) => (
            <ResultWordItem
              playAudio={this.playAudio}
              audio={x.audio}
              word={x.word}
              transcription={x.transcription}
              key={i}
            />
          ))}
      </div>
      <div className="success__title">
        <p>
          Знаю
          <span className="badge badge-success">
            {' '}
            {this.props.state.knownWords.length}
          </span>
        </p>
      </div>
      <div className="success__words">
        {this.props.state.knownWords.map((x, i) => (
          <ResultWordItem
            playAudio={this.playAudio}
            audio={x.audio}
            word={x.word}
            transcription={x.transcription}
            key={i}
          />
        ))}
      </div>
      <div className="result__control">
        <a href="" className="btn btn-outline-success btn-lg" onClick={this.returnToGame}>Return</a>
        <Link to={routes.SPEAKIT} className="btn btn-outline-success btn-lg" onClick={this.setNewGame}>New game</Link>
        <Link to={routes.MINI_GAMES} className="btn btn-outline-success btn-lg" onClick={this.props.stopRecognition}>Main page</Link>
      </div>
    </div>
  )
}

export default GameResults;
