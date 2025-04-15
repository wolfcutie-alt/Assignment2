import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar } from '@mui/material';
import Navbar from '../components/Navbar';

const Container = styled(Box)({
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f8f9fa',
});

const MessagesList = styled(Box)({
  width: '350px',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e0e0e0',
  overflowY: 'auto',
});

const MessagesHeader = styled(Box)({
  padding: '20px',
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const MessageItem = styled(Box)(({ active }) => ({
  padding: '15px 20px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: active ? '#f0f7ff' : 'transparent',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const ConversationView = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const ConversationHeader = styled(Box)({
  padding: '20px',
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#ffffff',
});

const MessageArea = styled(Box)({
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
});

const MessageBubble = styled(Box)(({ isOwn }) => ({
  maxWidth: '70%',
  padding: '10px 15px',
  borderRadius: '15px',
  backgroundColor: isOwn ? '#0084ff' : '#e4e6eb',
  color: isOwn ? '#ffffff' : '#000000',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  margin: '5px 0',
}));

const InputArea = styled(Box)({
  padding: '20px',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const MessageInput = styled('input')({
  flex: 1,
  padding: '12px 20px',
  backgroundColor: '#f0f2f5',
  border: 'none',
  borderRadius: '20px',
  fontSize: '14px',
  '&:focus': {
    outline: 'none',
  },
});

const SendButton = styled('button')({
  padding: '8px 16px',
  backgroundColor: '#0084ff',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#0073e6',
  },
});

const Message = () => {
  const [selectedChat, setSelectedChat] = useState('Sebongs');
  const [newMessage, setNewMessage] = useState('');

  const chats = [
    { id: 1, name: 'Choi Seungcheol', message: 'Nakita mo ba yung ano kanina...', unread: true },
    { id: 2, name: 'Sebongs', message: 'papunta na bitterie sweetie, sabay tayo', unread: false },
    { id: 3, name: 'Vernon Chwe', message: 'haha gusto ko rin kuymain pero antok', unread: false },
    { id: 4, name: 'Jeonghan', message: 'kasama ko si cheol, wag nyo na tanungin, tapos yan', unread: true },
  ];

  const messages = [
    { id: 1, sender: 'Kim Mingyu', content: 'guyss, kumain na ba kayo? kain na kayo dito dali', isOwn: false },
    { id: 2, sender: 'Seungcheol', content: 'papunta na bitterie sweetie, sabay tayo', isOwn: false },
    { id: 3, sender: 'You', content: 'sige hyung, salamat. intayin ko si gyu', isOwn: true },
    { id: 4, sender: 'Vernon Chwe', content: 'haha gusto ko rin kuymain pero antok', isOwn: false },
    { id: 5, sender: 'Jeonghan', content: 'kasama ko si cheol, wag nyo na tanungin, tapos yan', isOwn: false },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message sending logic here
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
    <Navbar />
    <Container>
      <MessagesList>
        <MessagesHeader>
          <Typography variant="h6" fontWeight="bold">
            Messages
          </Typography>
        </MessagesHeader>
        {chats.map((chat) => (
          <MessageItem
            key={chat.id}
            active={selectedChat === chat.name}
            onClick={() => setSelectedChat(chat.name)}
          >
            <Avatar sx={{ width: 40, height: 40, marginRight: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {chat.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {chat.message}
              </Typography>
            </Box>
          </MessageItem>
        ))}
      </MessagesList>

      <ConversationView>
        <ConversationHeader>
          <Typography variant="h6">{selectedChat}</Typography>
        </ConversationHeader>

        <MessageArea>
          {messages.map((message) => (
            <MessageBubble key={message.id} isOwn={message.isOwn}>
              {!message.isOwn && (
                <Typography variant="caption" color="text.secondary">
                  {message.sender}
                </Typography>
              )}
              <Typography>{message.content}</Typography>
            </MessageBubble>
          ))}
        </MessageArea>

        <InputArea>
          <MessageInput
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SendButton onClick={handleSendMessage}>
            Send
          </SendButton>
        </InputArea>
      </ConversationView>
    </Container>
    </>
  );
};

export default Message;