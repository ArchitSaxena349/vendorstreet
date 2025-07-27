import { useState, useEffect } from 'react'
import { 
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'

const Chat = ({ user }) => {
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

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
    if (activeChat) {
      // Mock messages for active chat
      setMessages([
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
          senderName: user?.name,
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
          senderName: user?.name,
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
      ])
    }
  }, [activeChat, user])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: user?.id,
        senderName: user?.name,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      }
      setMessages([...messages, message])
      setNewMessage('')
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
    if (e.key === 'Enter') {
      sendMessage()
    }
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
                  onClick={() => setActiveChat(conversation.id)}
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
                  {messages.map((message) => (
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
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-600">Choose a conversation to start messaging</p>
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
