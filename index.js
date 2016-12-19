const commandMatches = /push/;

exports.middleware = (store) => (next) => (action) => {
  if ('SESSION_ADD_DATA' === action.type) {
    const {data} = action;
    const match = commandMatches.exec(data);

    console.log(data);

    if (match != null) {
      store.dispatch({
        type: 'DISPLAY_GIF',
        query: match[0]
      });

      next(action);
    } else {
      store.dispatch({
        type: 'DISPLAY_GIF',
        query: ''
      });
      next(action);
    }
  } else {
    next(action);
  }
};

exports.reduceUI = (state, action) => {
  switch (action.type) {
    case 'DISPLAY_GIF':
      return state.set('query', `${action.query}`);
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
      this._onTerminal = this._onTerminal.bind(this);
    }

    componentWillReceiveProps (next) {
      if (commandMatches.exec(next.query)) {
        this.showGif(next.query);
      }
    }

    showGif(query) {
      fetch(
        `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=dc6zaTOxFJmzC`
      )
      .then(response => response.json())
      .then(gifs => {
        const {data} = gifs;
        const count = data.length;
        const gif = Math.floor(Math.random() * (count - 0 + 1));

        this.div.style.cssText = `background:
          url('https://media.giphy.com/media/l0NwFpmhycSR8hYdi/200.gif');
          background-size: cover;
          background-repeat: no-repeat`;

        setTimeout(() => {this.div.style.background = '';}, 5000)
      });
    }

    _onTerminal(term) {
      if (this.props.onTerminal) this.props._onTerminal(term);

      console.log('term', term);

      this.div = term.div_;
    }

    render () {
      return React.createElement(
        Term,
        Object.assign({}, this.props, {onTerminal: this._onTerminal})
      );
    }
  }
};
