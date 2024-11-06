'use client'
import React, { useState, useEffect, useRef } from 'react'

const ChartModule = ({ nodes }) => {
  const [toggle, setToggle] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const chatContainerRef = useRef(null)

  // Function to start chat and reset index
  const startChat = () => {
    setChatStarted(true)
    setCurrentNodeIndex(0)
    setMessages([]) // Clear messages when starting a new chat
  }

  // Function to move to the next node in the flow
  const handleNextMessage = () => {
    if (currentNodeIndex < nodes.length - 1) {
      setCurrentNodeIndex(currentNodeIndex + 1)
    } else {
      // Add "End of Chat" message when reaching the last node
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'End of Chat', type: 'bot' },
      ])
      setChatStarted(false) // End chat after the last node
    }
  }

  // Add a user message and the node response to the chat
  const addMessage = (message, type) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, type }])
  }

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  // Handle input keydown (Enter) and clicking the Send button
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Handle form submission (when the user presses the send button or Enter key)
  const handleSubmit = () => {
    if (!chatStarted) {
      startChat() // Start chat on first submission
    } else {
      addMessage(inputValue, 'user') // Add user message to the chat
      handleNextMessage() // Proceed to the next node
    }
    setInputValue('') // Clear input after submission
  }

  // Scroll to the bottom whenever a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="absolute right-0 bottom-0 p-10">
      {toggle && (
        <div className="lg:col-span-2 w-full bg-white rounded-t-lg">
          <div className="relative flex items-center p-3 border-b border-gray-300 bg-blue-400 rounded-t-lg">
            <span className="block ml-2 font-bold text-white">
              Chat Preview
            </span>
          </div>
          <div
            ref={chatContainerRef}
            className="relative w-full p-6 overflow-y-auto h-[300px] flex flex-col space-y-4"
          >
            {/* Display chat messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-2 max-w-xs rounded-md ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Show node response after user input */}
            {chatStarted && currentNodeIndex < nodes.length && (
              <div className="flex justify-start">
                <div className="p-2 max-w-xs bg-gray-200 text-black rounded-md">
                  {nodes[currentNodeIndex].data.components.map(
                    (Component, compIndex) => (
                      <div key={compIndex} className="mb-2">
                        <Component /> {/* Render node component preview */}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Input field and send button */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                id="chat-input"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Type a message"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown} // Trigger on Enter key press
              />
              <button
                type="button"
                onClick={handleSubmit} // Trigger on button click
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-[500px] flex items-end justify-end">
        <div
          className="bg-red-400 p-2 rounded-md cursor-pointer mt-4 w-[113px] text-white"
          onClick={() => {
            setToggle(!toggle)
            if (!chatStarted) {
              startChat() // Start the chat automatically when clicking the preview button
            }
          }}
        >
          Chat Preview
        </div>
      </div>
    </div>
  )
}

export default ChartModule
