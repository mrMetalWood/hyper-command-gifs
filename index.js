const commands = '/push|pull|start|checkout|test|build|status|deposit|registration|/'

exports.middleware = (store) => (next) => (action) => {
	if ('SESSION_ADD_DATA' === action.type) {
		store.dispatch({
			type: 'UPDATE_QUERY',
			query: action.data
		})
	}

	next(action)
}

exports.reduceUI = (state, action) => {
	switch (action.type) {
	case 'UPDATE_QUERY': {
		const {query} = action

		if (!state.query) {
			return state.set('query', ' ')
		}

		if (query.length <= 1) {
			return state.set('query', `${state.query}${query}`)
		}

		if (query.length > 1 && /^[a-zA-Z]*$/.exec(query)) {
			return state.set('query', query)
		}

		return state
	}

	case 'SET_QUERY': {
		return state.set('query', action.query)
	}
	}
	return state
}

exports.mapTermsState = (state, map) => {
	return Object.assign(map, {
		query: state.ui.query
	})
}

exports.getTermGroupProps = (uid, parentProps, props) => {
	return Object.assign(props, {
		query: parentProps.query,
	})
}

exports.getTermProps = (uid, parentProps, props) => {
	return Object.assign(props, {
		query: parentProps.query,
	})
}

exports.decorateTerm = (Term, { React }) => {
	return class extends React.Component {
		constructor (props, context) {
			super(props, context)

			this.state = {gifInProgress: false}

			this.onTerminal = this.onTerminal.bind(this)

			const defaultConfig = {disabledCommands: []}
			const userConfig = config.getConfig().hyperCommandGifs || {}

			this.config = Object.assign({}, defaultConfig, userConfig)
		}

		shouldComponentUpdate(nextProps) {
			if (nextProps.query && nextProps.query !== this.props.query) {
				return true
			}
			return false
		}

		getUrl(text) {
			return `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${text}`
		}

		fillTerm(res) {
			this.div.style.cssText = `
				background: url('${res.data.image_original_url}');
				background-size: cover;
				background-position: center;
				background-repeat: no-repeat;
			`

			this.setState({gifInProgress: true})

			setTimeout(() => this.clearGif(), this.config.timeout || 5000)
		}


		showGif() {
			const match = commands.exec(this.props.query)
			const validations = match &&
				!this.config.disabledCommands.includes(match[0]) &&
				!this.state.gifInProgress

			if (validations) {
				fetch(this.getUrl(this.props.query))
        .then((res) => res.json())
        .then((res) => this.fillTerm(res))
			}
		}

		clearGif() {
			this.div.style.background = ''
			this.setState({gifInProgress: false})
		}

		onTerminal(term) {
			this.div = term.div_

			term.document_.addEventListener(
        'keyup', event => this.handleKeyUp(event),
        false
      )
		}

		handleKeyUp(event) {
			const {keyCode} = event

			if(keyCode === 13) {
				this.showGif()

				store.dispatch({
					type: 'SET_QUERY',
					query: ' '
				})
			} else if (keyCode === 8) {
				store.dispatch({
					type: 'SET_QUERY',
					query: this.props.query.slice(0, -1)
				})
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
      )
		}
  }
}
