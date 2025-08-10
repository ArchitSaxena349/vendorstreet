import { useState, useEffect, useRef } from 'react'
import { 
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const Chat = ({ user }) => {
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [allMessages, setAllMessages] = useState({}) // Store messages for all conversations
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock conversations
    setConversations([
      {
        id: 1,
        name: 'Fresh Spices Co.',
        type: 'vendor',
        lastMessage: 'Thank you for your order!',
        timestamp: '2 min ago',
        unread: 2,
        avatar: '/api/placeholder/40/40',
        online: true
      },
      {
        id: 2,
        name: 'Restaurant Paradise',
        type: 'buyer',
        lastMessage: 'When can you deliver?',
        timestamp: '1 hour ago',
        unread: 0,
        avatar: '/api/placeholder/40/40',
        online: false
      },
      {
        id: 3,
        name: 'Grain Masters Ltd.',
        type: 'vendor',
        lastMessage: 'Your rice order is ready',
        timestamp: '3 hours ago',
        unread: 1,
        avatar: '/api/placeholder/40/40',
        online: true
      }
    ])

    // Set first conversation as active
    setActiveChat(1)
  }, [])

  useEffect(() => {
    // Initialize messages for all conversations
    const initialMessages = {
      1: [
        {
          id: 1,
          senderId: 'vendor',
          senderName: 'Fresh Spices Co.',
          message: 'Hello! Thank you for your interest in our turmeric powder.',
          timestamp: '10:30 AM',
          isOwn: false
        },
        {
          id: 2,
          senderId: user?.id,
          senderName: user?.name || 'You',
          message: 'Hi! Can you tell me more about the quality and pricing?',
          timestamp: '10:32 AM',
          isOwn: true
        },
        {
          id: 3,
          senderId: 'vendor',
          senderName: 'Fresh Spices Co.',
          message: 'Sure! Our turmeric is sourced directly from Kerala farms. It has high curcumin content and is lab tested.',
          timestamp: '10:35 AM',
          isOwn: false
        },
        {
          id: 4,
          senderId: user?.id,
          senderName: user?.name || 'You',
          message: 'That sounds great! What\'s the minimum order quantity?',
          timestamp: '10:36 AM',
          isOwn: true
        },
        {
          id: 5,
          senderId: 'vendor',
          senderName: 'Fresh Spices Co.',
          message: 'The minimum order is 5kg. For bulk orders above 50kg, we offer special pricing.',
          timestamp: '10:38 AM',
          isOwn: false
        }
      ],
      2: [
        {
          id: 1,
          senderId: 'buyer',
          senderName: 'Restaurant Paradise',
          message: 'Hi! I need fresh vegetables for my restaurant.',
          timestamp: '9:15 AM',
          isOwn: false
        },
        {
          id: 2,
          senderId: user?.id,
          senderName: user?.name || 'You',
          message: 'Hello! What quantities do you need?',
          timestamp: '9:20 AM',
          isOwn: true
        },
        {
          id: 3,
          senderId: 'buyer',
          senderName: 'Restaurant Paradise',
          message: 'When can you deliver?',
          timestamp: '9:25 AM',
          isOwn: false
        }
      ],
      3: [
        {
          id: 1,
          senderId: 'vendor',
          senderName: 'Grain Masters Ltd.',
          message: 'Your rice order is ready for pickup!',
          timestamp: '8:45 AM',
          isOwn: false
        },
        {
          id: 2,
          senderId: user?.id,
          senderName: user?.name || 'You',
          message: 'Great! What time can I collect it?',
          timestamp: '8:50 AM',
          isOwn: true
        },
        {
          id: 3,
          senderId: 'vendor',
          senderName: 'Grain Masters Ltd.',
          message: 'Anytime between 10 AM to 6 PM. Please bring your order confirmation.',
          timestamp: '8:52 AM',
          isOwn: false
        }
      ]
    }
    setAllMessages(initialMessages)
    setIsLoading(false)
  }, [user])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [allMessages, activeChat, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = () => {
    if (newMessage.trim() && activeChat) {
      const currentMessages = allMessages[activeChat] || []
      const message = {
        id: currentMessages.length + 1,
        senderId: user?.id,
        senderName: user?.name || 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      }
      
      // Update messages for the active conversation
      setAllMessages(prev => ({
        ...prev,
        [activeChat]: [...currentMessages, message]
      }))
      
      // Update conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === activeChat 
          ? { ...conv, lastMessage: newMessage, timestamp: 'now' }
          : conv
      ))
      
      setNewMessage('')
      
      // Simulate typing indicator and auto-response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        simulateResponse()
      }, 2000)
    }
  }

  const simulateResponse = () => {
    if (activeChat) {
      const activeConversation = conversations.find(c => c.id === activeChat)
      if (!activeConversation) return

      const responses = [
        "Thank you for your message! I'll get back to you shortly.",
        "That's a great question. Let me check and respond.",
        "I appreciate your interest. Can you provide more details?",
        "Sure, I can help you with that.",
        "Let me check our current stock and pricing for you.",
        "I'll send you the details via WhatsApp for faster communication.",
        "That sounds perfect! When would you like to proceed?",
        "Let me prepare a quote for you right away.",
        "I have some great options that might interest you.",
        "Thanks for reaching out! I'm here to help."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const currentMessages = allMessages[activeChat] || []
      const responseMessage = {
        id: Date.now(), // Use timestamp for unique ID
        senderId: 'other',
        senderName: activeConversation.name,
        message: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      }
      
      setAllMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), responseMessage]
      }))
      
      // Update conversation's last message and timestamp
      setConversations(prev => prev.map(conv => 
        conv.id === activeChat 
          ? { 
              ...conv, 
              lastMessage: randomResponse.length > 50 ? randomResponse.substring(0, 50) + '...' : randomResponse,
              timestamp: 'now',
              unread: 0 // Mark as read since we're in the conversation
            }
          : conv
      ))
    }
  }

  const openWhatsApp = () => {
    const activeConversation = conversations.find(c => c.id === activeChat)
    if (activeConversation) {
      const message = `Hi ${activeConversation.name}! I'm contacting you from VendorStreet.`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setActiveChat(conversation.id)
                    // Mark conversation as read when opened
                    setConversations(prev => prev.map(conv => 
                      conv.id === conversation.id 
                        ? { ...conv, unread: 0 }
                        : conv
                    ))
                  }}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                    activeChat === conversation.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        conversation.type === 'vendor' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {conversation.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {conversations.find(c => c.id === activeChat)?.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {conversations.find(c => c.id === activeChat)?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={openWhatsApp}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Open in WhatsApp"
                    >
                      <PhoneIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <VideoCameraIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(allMessages[activeChat] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows="1"
                        style={{
                          minHeight: '40px',
                          maxHeight: '120px',
                          height: 'auto'
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto'
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                        }}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      title="Send message"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Press Enter to send • Shift+Enter for new line
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-600 mb-4">Choose a conversation from the left to start messaging</p>
                  <div className="text-sm text-gray-500">
                    <p>💬 Send messages instantly</p>
                    <p>📱 Continue on WhatsApp</p>
                    <p>🔔 Get real-time notifications</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Integration Notice */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <PhoneIcon className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="text-sm font-medium text-green-900">WhatsApp Integration</h3>
              <p className="text-sm text-green-700 mt-1">
                Click the phone icon in any conversation to continue chatting on WhatsApp for faster communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
