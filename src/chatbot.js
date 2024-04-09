// Chatbot.js

import React, { useState ,useRef,useEffect} from 'react';
import axios from 'axios';
import user from './user.png';
import bot from './chatbot.png';
import { Player } from '@lordicon/react';
import man from './wired-outline-268-avatar-man.json';
import send from './send.png';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const playerRef = useRef<Player>(null);

  useEffect(() => {
    // Scroll to bottom of chat container when messages change
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText) return;
  
    setMessages(prevMessages => [...prevMessages, { text: inputText, sender: 'user' }]);
    setInputText('');
  
    try {
        setMessages(prevMessages => [...prevMessages, { text: "processing...", sender: 'bot' }]);
      const response = await fetch('https://chatbot-backend-beige.vercel.app/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });
  
      const reader = response.body.getReader();
      
      if(!response.ok) {
        throw new Error('Failed to send message');
      }

      let responseData = '';
  
      while (true) {
        const { done, value } = await reader.read();
  
        if (done) break;
  
        responseData += new TextDecoder().decode(value);
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            updatedMessages[prevMessages.length - 1].text = JSON.parse(responseData).text;
            return updatedMessages;
          });      }
  
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { text: 'Error sending message. Please try again later.', sender: 'bot' }]);
    }
  };
  
  return (
    <div className='parent' style={{
        display: 'flex',
        width: '100%',
        backgroundColor: '#383838',
        
        height: '100vh'
    }}>
      
  <div style={
        {
            display: 'flex',
            justifyContent: 'center',
          
            width: '100%',
            height: '85vh',
            overflow: 'auto',
            backgroundColor: '#383838',
            color: 'white',
            
          
        }
      }>
         
      <div className="chat-container" 
     >
       {messages.length > 0 ? messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
            style={{ alignSelf: message.sender === 'bot' ? 'flex-start' : 'flex-start' }} // Apply align-self inline
          >
            <div>
            {message.sender === 'bot' ? 
                <p style={{color: 'grey', display:'flex', justifyContent:'start',alignItems:'center',gap:'10px'}}>
                    <img src={bot} width={'16px'}
                 style={{padding:'10px'
                 , backgroundColor:'#383838',
                border:'none',
                borderRadius:'50%'    
            }}></img>ChatBot </p> :
                <p style={{color: 'grey',display:'flex', justifyContent:'start',alignItems:'center',gap:'10px'}}>
                   <img src={user} width={'16px'}
                 style={{padding:'10px'
                    , backgroundColor:'#383838',
                    border:'none',
                    borderRadius:'50%'
                 }}></img> User </p>}
            <p style={{paddingLeft:'48px', paddingTop:'0px'}}>
              {message.text}
            </p>
            </div>
           
          </div>

        )) : <div style={{
            display: 'flex',
            justifyContent: 'center', /* Center horizontally */
            alignItems: 'center', /* Center vertically */
            flexDirection: 'column',
            marginTop: '200px',
          }}>
            <img src={bot} width={150} />
            <div>
              <h2>
                Welcome to Chatbot
              </h2>
              
            </div>
          </div>
          }
      <div className='input'>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}><img src={send} width={20}></img></button>
      </div>
       
      </div>
      
    </div>
    </div>
  
  );
};

export default Chatbot;
