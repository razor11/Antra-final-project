


// Api



const Api = (() => {
    const url = 'https://random-word-api.herokuapp.com/word';
    const getData = fetch(url).then((res) => {
        return res.json();
    });

    return {
        getData
    };

})();



// View


const View = (() => {
    let domSelector = {
        attendsDisplay: '#attempts',
        maxAttendsDisplay: '#max-attempts',
        word: '#word',
        guessInput: '#guess-input',
        guessBtn: '#guess-btn'
    };

    const Render = (hiddenWord, attempts, maxAttempts) => {
        document.querySelector(domSelector.word).textContent = hiddenWord;
        document.querySelector(domSelector.attendsDisplay).textContent = attempts;
        document.querySelector(domSelector.maxAttendsDisplay).textContent = maxAttempts;
    };



    return {
        domSelector,
        Render
    }


})();


// Model

const Model = ((View) => {
    const { domSelector, Render } = View;

    class State {
        constructor() {
            this._word = '';
            this._guessedLetters = [];
            this._attempts = 0;
            this._maxAttempts = 10;
        }

        get getGuessWord() {
            return this._word;
        }

        get guessLetters() {
            return this._guessedLetters;
        }

        get attempts() {
            return this._attempts;
        }

        get maxAttempts() {
            return this._maxAttempts;
        }

        set addguessLetter(letter) {
            this._guessedLetters.push(letter);

        }

        set addAttemt(attemp) {
            this._attempts += attemp;
        }

        set displayWord(newWord) {
            this._word = newWord;
            console.log(this._word)
            let guessWord = this.wordDisplay();
            let attempts = this._attempts;

            Render(guessWord, attempts, this._maxAttempts);

        }




        wordDisplay() {
            let wordDisplay = '';

            for (const letter of this._word) {
                if (this._guessedLetters.includes(letter)) {
                    wordDisplay += letter;
                }
                else {

                    wordDisplay += '_';
                }


                wordDisplay += ' ';
            }

            console.log(wordDisplay)


            return wordDisplay;
        }

    }

    return {
        State,

    }


})(View);



// Controller 


const Controller = ((View, Model, Api) => {

    const { domSelector, Render } = View;
    const { State } = Model;
    const { getData } = Api;

    const state = new State();

    const init = () => {
        getData.then((word) => {
            state.displayWord = word[0];
        })
    }

    const newGame = () => {
        const newbtn = document.querySelector(domSelector.guessBtn);
        newbtn.addEventListener('click', () => {
            location.reload();
        });
    }


    const guessAction = () => {
        const guessInput = document.querySelector(domSelector.guessInput);
        guessInput.addEventListener('keypress', () => {
            const letter = guessInput.value.trim().toLocaleLowerCase();
            if (letter) {
                makeGuess(letter);
                guessInput.value = '';
                Render(state.wordDisplay(), state.attempts, state.maxAttempts);
            }
        });


    }

    const makeGuess = (letter) => {
        if (!state._guessedLetters.includes(letter)) {
            state.addguessLetter = letter;
            if (!state.getGuessWord.includes(letter)) {
                state.addAttemt = 1;
            }
        }

        if (state.attempts === state.maxAttempts) {
            alert('wrong guesses equal max allowed chances')

        }





    }
    const isWordGuess = () => {
        const word = document.querySelector(domSelector.word);
        if (word.value === state.word) {
            return true;
        }
        return false
    }



    const bootstrap = () => {
        init();
        newGame();
        guessAction();


    }


    return {
        bootstrap
    }



})(View, Model, Api);

Controller.bootstrap();