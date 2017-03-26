(function reactApp() {

  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        messages: []
      };
      this.handler = this.handler.bind(this);
      this.send = this.send.bind(this);
    }

    handler(content) {
      this.setState({
        messages: [
          content,
          ...this.state.messages,
        ],
      });
    }

    send() {
      this.props.sendMessage(this.input.value);
      this.input.value = '';
      this.input.focus();
    }

    componentDidMount() {
      this.props.reconnect(this.handler);
    }

    componentWillUnmount() {
      this.props.disconnect();
    }

    render() {
      const {messages} = this.state;
      const {online, reconnect, disconnect} = this.props;
      return (
        <Container>
          <div>{online && 'connected'}</div>
          <button onClick={() => reconnect(this.handler)}>(re)connect</button>
          &nbsp;
          <button onClick={() => disconnect()}>disconnect</button>
          &nbsp;
          <input type="text" ref={input => this.input = input}/>
          <button onClick={this.send}>log is connected</button>
          <ChildClient
            messages={messages}
          />
        </Container>
      );
    }
  }

  App.propTypes = {
    messages: React.PropTypes.array.isRequired,
  };

  const Container = props => <div style={{
    padding: '1%',
  }} {...props}/>;

  const ChildClient = ({messages}) => {
    return (
      <ul style={{listStyleType: 'none'}}>
        {messages && messages.map((message, index) =>
          <li key={index}>{message}</li>
        )}
      </ul>
    );
  };

  const {ReactAppWS} = window;

  if (!ReactAppWS
    || !ReactAppWS.reconnect
    || !ReactAppWS.disconnect
    || !ReactAppWS.sendMessage
    || !ReactAppWS.isConnected) {

    const err = 'please provide ReactAppWS object withing required public api...';
    console.error(err);
    document.querySelector('#app').innerHTML = err;
    return;
  }

  const {render} = ReactDOM;

  render(
    <App online={() => window.ReactAppWS.isConnected()} {...window.ReactAppWS}/>,
    document.getElementById('app')
  );

})();
