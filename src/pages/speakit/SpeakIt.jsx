import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import WordsSet from '../../components/wordsSet/WordsSet';
import GameResults from '../../components/gameResults/GameResults';
import StoreContext from '../../app/store';
import getRandomInt from '../../helper/randomValue';
import './speakIt.scss';

const maxWordsItem = 10;
const maxPagesCount = 30;
const SpeechRecognition = window.SpeechRecognition 
    || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';


class SpeakIt extends Component {

    static contextType = StoreContext;

    constructor(props, context) {
        super(props, context);
        const { speakItGameState } = this.context;
        this.state = {...speakItGameState, recognition: recognition};
  }

  getWords = async (page, group) => {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
    const res = await fetch(url);
    const data = await res.json();
    if(data && data.length > 10) {
        const randomData = Array.from(data).sort(() => 0.5 - Math.random());
        this.setState({
            words: randomData.slice(0, 10),
            currentImage: data[0].image
        });
    }
  };

  handleGroupChange = async ({target: { innerText }}) => {
    this.getWords(this.state.activePage,  Number(innerText) - 1);
    this.setState({ 
        activeGroup: Number(innerText) - 1,
        skip: 0,
        currentTranslate: ''
     });
     this.restart();
  };

  getTranslate = async(englishWord) => {
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200426T115419Z.97bb9a32a36038b3.031a34722fc5dd5a26a8dd0a1871ea5dcdf6db29&text=${englishWord}&lang=en-ru`;
    const res = await fetch(url);
    const json = await res.json();
    this.setState({currentTranslate: json.text[0]})
    console.log(JSON.stringify(json))
  }
  
  onTrainingClick= (e) => {
    if(!this.state.isSpeakMode) {
        e.currentTarget.querySelector('audio')?.play();
        if(this.state.words[e.currentTarget.dataset.index] && this.state.words[e.currentTarget.dataset.index].word) {
            this.getTranslate(this.state.words[e.currentTarget.dataset.index].word)
        }
        this.setState({ currentImage: this.state.words[e.currentTarget.dataset.index]?.image})
    }
  }

  clearResults = () => {
    this.setState({
        knownWords: []
    })
  }

  recognitionResultEventHandler = (e) => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
      .toLowerCase();
      console.log(transcript)
    const wordMatch = this.state.words.find((x) => x.word.toLowerCase() === transcript && !this.state.knownWords.includes(x));
    if(wordMatch) {
        const knownWords = Array.from(this.state.knownWords);
        knownWords.push(wordMatch);
        this.setState({
            currentTranscript: transcript,
            knownWords: knownWords,
            currentImage: wordMatch.image
        });
      if(knownWords.length === 10) {
        this.setState({
            isGameStopped: true
        })
      }
    } else {
        this.setState({currentTranscript: transcript});
    }
  }

  recognitionEndEventHandler = () => {
    if(this.state.isSpeakMode)
      this.state.recognition.start();
  }

  start = () => {
    this.setState({
        isSpeakMode: true,
        knownWords: []
    });
    this.state.recognition.addEventListener('result', this.recognitionResultEventHandler)
    this.state.recognition.addEventListener('end', this.recognitionEndEventHandler);
    this.state.recognition.start();
  }
  
  restart = () => {
    this.setState({
        isSpeakMode: false,
        isGameStopped: false
    })
    this.clearResults();
    this.state.recognition.stop();
    this.state.recognition.abort();
    this.getWords(getRandomInt(maxPagesCount), this.state.activeGroup);
    //this.props.state.updateStats(this.state);
  }

  pause = () => {
    this.setState({
        isSpeakMode: false,
        isGameStopped: true
    })
  }

  continue = () => {
    this.setState({
        isSpeakMode: true,
        isGameStopped: false
    })
  }

  onGetResults = () => {
    this.props.state.changeParentState(this.state);
    this.state.recognition.stop();
    this.state.recognition.removeEventListener('result', this.recognitionResultEventHandler)
    this.state.recognition.removeEventListener('end', this.recognitionEndEventHandler);
  }

  componentDidMount = () => {
    if(this.state.words.length === 0) {
      this.getWords(getRandomInt(maxPagesCount), this.state.activeGroup);
    }
    if(this.state.words.length > 0 && this.state.isSpeakMode) {
        this.state.recognition.addEventListener('result', this.recognitionResultEventHandler)
        this.state.recognition.addEventListener('end', this.recognitionEndEventHandler);
        this.state.recognition.start();
    }
  }

  render = () => {
    return !this.state.isGameStopped ? (
        <Container fluid>
      <span className="close__game">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path fill="currentColor" d="M.974 0L0 .974 5.026 6 0 11.026.974 12 6 6.974 11.026 12l.974-.974L6.974 6 12 .974 11.026 0 6 5.026z"></path></svg>
      </span>
      <div className="game">
        <div className="game__info">
        <div className="game__level">
            <p>Level</p>
            <Pagination>
                {
                    Array.from({length: 6}, (x, i) => i + 1).map((x) => {
                        return (
                            <Pagination.Item key={x} active={x === (this.state.activeGroup + 1)} onClick={this.handleGroupChange}>
                                {x}
                            </Pagination.Item>
                        );
                    })
                }
            </Pagination>
        </div>
        <div className="progress__container">
            <label>Score {this.state.knownWords.length}/10</label>  
            <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: (this.state.knownWords.length/10 * 100) + '%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </div>
        </div>
        <div className="game-image-container">
          <img alt="" src={`https://raw.githubusercontent.com/ildar107/rslang-data/master/data/${this.state.currentImage?.replace('files/', '')}`}  crossOrigin = "Anonymous"/>
          <div className="form-group">
                <fieldset >
                <span className={`micro ${this.state.isSpeakMode ? 'micro_active' : ''}`}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" ><path fill="#4ae49e" d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path></svg> 
                    </span>
                <input 
                    className={`form-control ${this.state.isSpeakMode ? 'input_active' : ''}`}
                    id="disabledInput"
                    type="text"
                    value={this.state.isSpeakMode ? this.state.currentTranscript : this.state.currentTranslate} 
                    disabled
                    />
                </fieldset>
            </div>
        </div>
        <WordsSet words={this.state.words} trainingClick={this.onTrainingClick} isSpeakMode={this.state.isSpeakMode} knownWords={this.state.knownWords}/>
        <div className="control">
          <button type="button" id="restart" className="btn btn-outline-success btn-lg" onClick={this.restart}>Restart</button>
          <button 
            type="button" 
            id="speak" 
            className={`btn btn-outline-success btn-lg ${this.state.isSpeakMode ? 'speak_active' : ''}`}
            disabled={this.state.isSpeakMode}
            onClick={this.start}>
                Start
          </button>
          <button type="button" id="stop" className="btn btn-outline-success btn-lg" 
            onClick={this.pause}
            disabled={!this.state.isSpeakMode}>
                Finish
          </button>
        </div>
      </div>
      </Container>
       )
    : ( 
        <div className="results results_active">
            <GameResults state={this.state} restart={this.restart} continueGame={this.continue}/>
        </div>
    )
  }
}

export default SpeakIt;