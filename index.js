const commandMatches = /push/;

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

    }

    shouldComponentUpdate(nextProps) {
      if (nextProps.query && nextProps.query !== this.props.query) {
        return true;
      }

      return false;
    }


    showGif() {
      const match = commandMatches.exec(this.props.query);

      if (match && !this.state.gifInProgress) {

        fetch(
          `http://api.giphy.com/v1/gifs/search?q=${match[0]}&api_key=dc6zaTOxFJmzC`
        )
        .then(response => response.json())
        .then(gifs => {
          const {data} = gifs;
          const gifCount = data.length - 1;
          const gif = Math.floor(Math.random() * (gifCount - 0 + 1));

          this.div.style.cssText = `
            background:
              url('https://media.giphy.com/media/${data[gif].id}/200.gif');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          `;

          this.setState({gifInProgress: true})

          setTimeout(() => this.clearGif(), 5000)
        });
      }
    }

    clearGif() {
      this.div.style.background = '';
      this.setState({gifInProgress: false});
    }

    onTerminal(term) {
      this.div = term.div_;

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
