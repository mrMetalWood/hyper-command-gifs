let commands = require('./gifs.js').commands;
let gifs = require('./gifs.js').gifs;

exports.middleware = (store) => (next) => (action) => {
    if ('SESSION_ADD_DATA' === action.type) {
        store.dispatch({
            type: 'UPDATE_QUERY',
            query: action.data
        });
    }

    next(action);
};

exports.reduceUI = (state, action) => {
    switch (action.type) {
        case 'UPDATE_QUERY': {
            const {query} = action;

            if (!state.query) {
                return state.set('query', ' ');
            }

            if (query.length <= 1) {
                return state.set('query', `${state.query}${query}`);
            }

            if (query.length > 1 && /^[a-zA-Z]*$/.exec(query)) {
                return state.set('query', query);
            }

            return state;
        }

        case 'SET_QUERY': {
            return state.set('query', action.query);
        }
    }
    return state;
};

exports.mapTermsState = (state, map) => {
    return Object.assign(map, {
        query: state.ui.query
    });
};

exports.getTermGroupProps = (uid, parentProps, props) => {
    return Object.assign(props, {
        query: parentProps.query,
    });
}

exports.getTermProps = (uid, parentProps, props) => {
    return Object.assign(props, {
        query: parentProps.query,
    });
}

exports.decorateTerm = (Term, { React, notify }) => {
    return class extends React.Component {
        constructor (props, context) {
            super(props, context);

            this.state = {gifInProgress: false};

            this.onTerminal = this.onTerminal.bind(this);

            const defaultConfig = {disabledCommands: [], gifTimeout : 3000, gifHello : true,customGifs:{},deleteDefaultGifs : false}
            const userConfig = config.getConfig().hyperCommandGifs || {};

            this.config = Object.assign({}, defaultConfig, userConfig);
        }

        shouldComponentUpdate(nextProps) {
            if (nextProps.query && nextProps.query !== this.props.query) {
                return true;
            }

            return false;
        }

        helloGif(){

            if (
                this.config.gifHello &&
                gifs['hello'] !== undefined
            ){
                const gifCategory = gifs['hello']
                const gifCount = gifCategory.length - 1;
                const gif = Math.floor(Math.random() * (gifCount + 1));

                this.div.style.cssText = `
          background: url('${gifCategory[gif]}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        `;

                this.setState({gifInProgress: true})

                const gifTimeout = this.config.gifTimeout;

                setTimeout(() => this.clearGif(), gifTimeout)
            }

        }

        showGif() {
            const match = commands.exec(this.props.query);

            if (
                match &&
                this.config.disabledCommands.indexOf(match[0]) === -1 &&
                !this.state.gifInProgress
            ) {
                const gifCategory = gifs[match[0]]
                const gifCount = gifCategory.length - 1;
                const gif = Math.floor(Math.random() * (gifCount + 1));

                this.div.style.cssText = `
          background: url('${gifCategory[gif]}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        `;

                this.setState({gifInProgress: true})

                const gifTimeout = this.config.gifTimeout;

                setTimeout(() => this.clearGif(), gifTimeout)
            }
        }


        clearGif() {
            this.div.style.background = '';
            this.setState({gifInProgress: false});
        }

        addGifs(){
            for (var prop in this.config.customGifs) {
                if(gifs[prop] === undefined){
                    gifs[prop] = this.config.customGifs[prop];
                    commands = new RegExp(commands.toString().replace(new RegExp("/", "g"), '')+"|"+prop);
                }else{
                    gifs[prop] = gifs[prop].concat(this.config.customGifs[prop]);
                }
            }
        }

        onTerminal(term) {
            this.div = term.div_;

            this.helloGif();

            if(this.config.deleteDefaultGifs){
                gifs = {};
                commands = new RegExp();
            }

            this.addGifs();

            term.document_.addEventListener(
                'keyup', event => this.handleKeyUp(event),
                false
        );

        }

        handleKeyUp(event) {
            const {keyCode} = event;

            if(keyCode === 13) {
                this.showGif();

                store.dispatch({
                    type: 'SET_QUERY',
                    query: ' '
                });
            } else if (keyCode === 8) {
                store.dispatch({
                    type: 'SET_QUERY',
                    query: this.props.query.slice(0, -1)
                });
            }
        }

        render () {
            return React.createElement(
                Term,
                Object.assign(
                    {},
                    this.props,
                    {onTerminal: this.onTerminal}
                )
            );
        }
    }
};