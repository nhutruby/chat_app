import React from "react"
import { Socket } from "phoenix"
import UserMessage from "../presentationals/UserMessage"
import ServerMessage from "../presentationals/ServerMessage"
class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      inputMessage: "",
      messages: []
    }
    let socket = new Socket("/socket", { params: { token: window.userToken } })
    console.log(window.userToken)
    socket.connect()
    this.handleInputMessage = this.handleInputMessage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.channel = socket.channel("room:lobby", {})
  }
  componentDidMount() {
    this.channel.join().receive("ok", response => {
      console.log("Joined successfully", response)
    })
    this.channel.on("new_msg", payload => {
      this.setState({
        messages: this.state.messages.concat(payload.body)
      })
    })
  }
  handleSubmit(event) {
    event.preventDefault()
    this.channel.push("new_msg", { body: this.state.inputMessage })
  }
  handleInputMessage(event) {
    this.setState({
      inputMessage: event.target.value
    })
  }
  render() {
    const messages = this.state.messages.map((message, index) => {
      if (index % 2 == 0) {
        return (
          <UserMessage
            key={index}
            username={"GenericUsername"}
            message={message}
          />
        )
      } else {
        return (
          <ServerMessage key={index} username={"Server"} message={message} />
        )
      }
    })
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label
              className="label"
              style={{
                textAlign: "left"
              }}
            >
              GenericUsername:
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                style={{
                  marginTop: "10px"
                }}
                value={this.state.inputMessage}
                onChange={this.handleInputMessage}
              />
            </div>
          </div>
          <button
            type="submit"
            value="Submit"
            className="button is-primary"
            style={{
              marginTop: "10px"
            }}
          >
            Submit
          </button>
        </form>
        <div
          className="flex-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flexStart",
            justifyContent: "flexStart",
            margin: "auto",
            width: "100%"
          }}
        >
          {messages}
        </div>
      </div>
    )
  }
}
export default Chat
