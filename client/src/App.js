import React from "react";
import { useState, useEffect } from "react";
import './style.css'
import './normal.css'

function App() {

  useEffect(() => {
    getEngines();
  } ,[])

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('text-davinci-003')
  const [chatLog, setChatLog] = useState([ {
    user:'gpt',
    message : 'Hi there! How can I help you?'
  } ] );
  function clearChat() {
    setChatLog([
      {user:'gpt', message : 'Hi there! How can I help you?'}]);
  }

  function getEngines () {
    fetch('http://localhost:3080/models')
    .then(res => res.json())
    .then(data => {
      // console.log(data.models)
      setModels(data.models)
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, {user:'me', message:`${input}`} ]; 
    setInput("");
    setChatLog(chatLogNew)
    const messages = chatLogNew.map((message)=>message.message).join("\n")
    const response = await fetch('http://localhost:3080/', {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        message: messages,
        currentModel, //
      })
    });
    const data = await response.json();
    await setChatLog([...chatLogNew, {user:'gpt', message:`${data.message}`}])
  } 
  return (
    <>

    <div className="app">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          Clear Chat
        </div>
        <h2 className="modelselect">Select Model:</h2>
        <div className="models">
          <select onChange={(e)=> {
            setCurrentModel(e.target.value);
          }}>
            {models.map((model, index) => (
              <option key={model.id} value={model.id}>{model.id}</option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => {
            return <ChatMessage key={index} message={message}/>
          }) }
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input placeholder="type your query here" name="" id="" cols="30" rows="1"  value = {input}   onChange = { (e) => setInput(e.target.value)} className="chat-input-textarea"></input>
          </form>    
        </div>
      </section>
    </div>
    </>
  );
}
const ChatMessage = ({message}) => {
  // console.log(message);
  const gptImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMaTr-ekeEofDBBMr3fMwz6Eb65GcdOVoYdgWO4mc&s";
  const userImage = "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg";
  return (
    <div className={ `chat-message ${message.user==='gpt' && 'chatgpt' }` }>
      <div className="chat-message-center">
        <div className="avatar chatgpt">
          <img src={message.user==='gpt'?gptImage:userImage} alt="" width='40px'/>
        </div>
        <div className="message">
          {message.message}
        </div>  
      </div>
    </div>
  )
} 
export default App;
