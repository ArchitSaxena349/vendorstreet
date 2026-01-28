import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

import { useSocket } from '../context/SocketContext'

const Chat = ({ user }) => {
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [allMessages, setAllMessages] = useState({}) // Store messages for all conversations
  const [newMessage, setNewMessage] = useState('')
  // const [isTyping, setIsTyping] = useState(false) // Removed due to unused var lint error. Re-add when real-time typing is implemented.

  const messagesEndRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const socket = useSocket()

  useEffect(() => {
    fetchConversations()
    // Reduced polling frequency as fallback
    const interval = setInterval(fetchConversations, 30000)
    return () => clearInterval(interval)
  }, [user, fetchConversations])

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat)
      // Reduced polling frequency as fallback
      const interval = setInterval(() => fetchMessages(activeChat), 15000)
      return () => clearInterval(interval)
    }
  }, [activeChat, fetchMessages])

  // Socket.io Event Listeners
  useEffect(() => {
    if (!socket) return

    socket.on('new_message', (message) => {
      // Find which conversation this message belongs to
      // In a real app, you might want to check if the message matches the current active chat
      // usage of recipientId was conceptual. Logic below uses activeChat directly.

      // We need to identify the chat/conversation ID. 
      // Since our message object from backend might not satisfy all frontend needs immediately,
      // and we store messages by conversation ID (activeChat), we need to find the conversation.
      // However, the backend emits 'new_message' with message data.

      // A simpler approach for this demo:
      // If the message belongs to the ACTIVE chat, append it.
      // We need to know who sent it.

      setAllMessages(prev => {
        // This is a bit tricky because we key by Conversation ID, but the message tells us Sender/Receiver.
        // We need to find the conversation ID that matches this pair.
        // For now, let's trigger a refresh or use the conversation_updated event to guide us.
        // BUT, for immediate UI feedback in the active window:

        const isForCurrentChat = activeChat &&
          conversations.find(c => c.id === activeChat && (c.otherUserId === message.senderId || user.id === message.senderId))

        if (isForCurrentChat) {
          return {
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), {
              id: message._id || 'socket-' + Date.now(),
              senderId: message.senderId,
              message: message.content, // Backend sends 'content', frontend expects 'message' in some places or vice versa? verified: frontend uses .message
              timestamp: message.timestamp,
              isOwn: message.senderId === user.id
            }]
          }
        }
        return prev
      })
    })

    socket.on('conversation_updated', (updatedConv) => {
      setConversations(prev => {
        const exists = prev.find(c => c.id === updatedConv.id)
        if (exists) {
          return prev.map(c => c.id === updatedConv.id ? {
            ...c,
            lastMessage: updatedConv.lastMessage,
            timestamp: updatedConv.timestamp,
            unread: activeChat === updatedConv.id ? 0 : updatedConv.unread // Don't increment unread if chat is open
          } : c)
        } else {
          // New conversation started by someone else
          // We'd need to fetch it or construct it. For now, fetch all.
          fetchConversations()
          return prev
        }
      })
    })

    return () => {
      socket.off('new_message')
      socket.off('conversation_updated')
    }
  }, [socket, activeChat, conversations, user, fetchConversations])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [allMessages, activeChat])

  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('https://vendorstreet.onrender.com/api/chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success) {
        setConversations(result.data)
        setIsLoading(false)

        // If no active chat and we have conversations, select the first one
        // Only do this on initial load to avoid jumping
        if (!activeChat && result.data.length > 0 && isLoading) {
          setActiveChat(result.data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setIsLoading(false)
    }
  }, [activeChat, isLoading]) // Added dependencies

  const fetchMessages = useCallback(async (chatId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://vendorstreet.onrender.com/api/chat/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success) {
        setAllMessages(prev => ({
          ...prev,
          [chatId]: result.data
        }))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      try {
        const token = localStorage.getItem('token')
        // Optimistic update
        const currentMessages = allMessages[activeChat] || []
        const optimisticMessage = {
          id: 'temp-' + Date.now(),
          senderId: user?.id,
          senderName: user?.name,
          message: newMessage,
          timestamp: new Date().toISOString(), // Use ISO for consistency
          isOwn: true
        }

        setAllMessages(prev => ({
          ...prev,
          [activeChat]: [...currentMessages, optimisticMessage]
        }))
        setNewMessage('')

        // Find recipient ID
        const conversation = conversations.find(c => c.id === activeChat)
        if (!conversation) return // Should not happen

        const response = await fetch('https://vendorstreet.onrender.com/api/chat/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipientId: conversation.otherUserId,
            content: optimisticMessage.message
          })
        })

        const result = await response.json()
        if (result.success) {
          // Replace optimistic message with real one or just refetch
          fetchMessages(activeChat)
          fetchConversations() // Update last message in list
        }
      } catch (error) {
        console.error('Error sending message:', error)
        // Ideally revert optimistic update here
      }
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
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${activeChat === conversation.id ? 'bg-green-50 border-r-2 border-green-500' : ''
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
                      <span className="text-xs text-gray-500">{new Date(conversation.timestamp).toLocaleDateString()}</span>
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
                      <span className={`text-xs px-2 py-1 rounded-full ${conversation.type === 'vendor'
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
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isOwn
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                        }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? 'text-green-100' : 'text-gray-500'
                          }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}



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
                      disabled={!newMessage.trim()}
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

