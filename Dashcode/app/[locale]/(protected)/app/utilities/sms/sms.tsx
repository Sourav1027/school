"use client"

import React, { useState, useRef } from 'react'
import { 
  Camera, 
  Paperclip, 
  Send, 
  Smile, 
  UserCircle, 
  PhoneCall, 
  Video, 
  Info, 
  ImageIcon, 
  X 
} from 'lucide-react'

// Types
interface User {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline'
  lastSeen?: Date
}

interface Message {
  id: string
  text?: string
  image?: string
  sender: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

const users: User[] = [
  {
    id: '1',
    name: 'Rana Singh',
    avatar: '/images/users/user-1.jpg',
    status: 'online'
  },
  {
    id: '2', 
    name: 'Kapil Sharma',
    avatar: '/images/users/user-2.jpg',
    status: 'offline',
    lastSeen: new Date()
  }
]

const SMS: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User>(users[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedImage) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        sender: 'me',
        timestamp: new Date(),
        status: 'sent'
      }

      setMessages([...messages, message])
      setNewMessage('')
      setSelectedImage(null)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const openImageModal = (imageUrl: string) => {
    setShowImageModal(imageUrl)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Users Sidebar */}
      <div className="w-1/4 bg-white border-r">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Chats</h2>
          <UserCircle size={28} className="text-blue-500" />
        </div>
        
        {users.map(user => (
          <div 
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`
              flex items-center p-4 cursor-pointer hover:bg-gray-50 
              ${selectedUser.id === user.id ? 'bg-blue-50' : ''}
            `}
          >
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-12 h-12 rounded-full mr-4"
              />
              <span 
                className={`
                  absolute bottom-0 right-4 w-3 h-3 rounded-full
                  ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            </div>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">
                {user.status === 'online' 
                  ? 'Online' 
                  : `Last seen ${user.lastSeen?.toLocaleTimeString()}`
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <img 
              src={selectedUser.avatar} 
              alt={selectedUser.name} 
              className="w-12 h-12 rounded-full mr-4" 
            />
            <div>
              <h2 className="font-semibold text-lg">{selectedUser.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedUser.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <PhoneCall size={24} className="text-green-500 cursor-pointer" />
            <Video size={24} className="text-blue-500 cursor-pointer" />
            <Info 
              size={24} 
              className="text-gray-500 cursor-pointer"
              onClick={() => setShowProfile(!showProfile)}
            />
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[70%] p-3 rounded-2xl 
                  ${message.sender === 'me' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-black'
                  }
                `}
              >
                {message.text && <p>{message.text}</p>}
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="Attached" 
                    onClick={() => openImageModal(message.image!)}
                    className="max-w-full rounded-lg mt-2 cursor-pointer hover:opacity-80 transition" 
                  />
                )}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="p-4 bg-gray-100 flex items-center space-x-4">
            <img 
              src={URL.createObjectURL(selectedImage)} 
              alt="Preview" 
              className="w-20 h-20 object-cover rounded" 
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="text-red-500 flex items-center"
            >
              <X size={16} className="mr-1" /> Remove
            </button>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 bg-white border-t flex items-center space-x-3">
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            className="hidden" 
            onChange={handleImageUpload}
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
          >
            <Paperclip size={24} />
          </button>

          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <Smile size={24} />
          </button>

          <input 
            type="text" 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button 
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Profile Sidebar */}
      {showProfile && (
        <div className="w-1/4 bg-white border-l p-6">
          <div className="text-center">
            <img 
              src={selectedUser.avatar} 
              alt={selectedUser.name} 
              className="w-32 h-32 rounded-full mx-auto mb-4" 
            />
            <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            <p className="text-gray-500">
              {selectedUser.status === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setShowImageModal(null)}
        >
          <img 
            src={showImageModal} 
            alt="Full Image" 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      )}
    </div>
  )
}

export default SMS