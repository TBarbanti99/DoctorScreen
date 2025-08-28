
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, PaperclipIcon, Search } from "lucide-react";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Thank you, doctor. I'll follow your advice.",
      time: "10:30 AM",
      unread: true,
      messages: [
        {
          sender: "patient",
          content: "Hello Dr. Reed, I've been experiencing headaches for the past few days.",
          time: "10:00 AM"
        },
        {
          sender: "doctor",
          content: "Hi John, have you been getting enough sleep? How's your water intake?",
          time: "10:10 AM"
        },
        {
          sender: "patient",
          content: "I've been working late, so probably not enough sleep. Water intake is normal.",
          time: "10:15 AM"
        },
        {
          sender: "doctor",
          content: "I recommend you try to get at least 7-8 hours of sleep and stay hydrated. Take a break from screens before bedtime.",
          time: "10:20 AM"
        },
        {
          sender: "patient",
          content: "Thank you, doctor. I'll follow your advice.",
          time: "10:30 AM"
        },
      ]
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "",
      lastMessage: "Is there anything I need to prepare for the appointment?",
      time: "Yesterday",
      unread: false,
      messages: [
        {
          sender: "patient",
          content: "Hi Dr. Reed, I've scheduled an appointment for next week.",
          time: "Yesterday"
        },
        {
          sender: "doctor",
          content: "Hello Jane, that's great. I'll see you then.",
          time: "Yesterday"
        },
        {
          sender: "patient",
          content: "Is there anything I need to prepare for the appointment?",
          time: "Yesterday"
        },
      ]
    },
    {
      id: 3,
      name: "Michael Johnson",
      avatar: "",
      lastMessage: "I'll send my recent blood test results before our consultation.",
      time: "2 days ago",
      unread: false,
      messages: [
        {
          sender: "patient",
          content: "Good morning Dr. Reed. I wanted to discuss my recent test results.",
          time: "2 days ago"
        },
        {
          sender: "doctor",
          content: "Good morning Michael. Yes, let's discuss them during our next consultation.",
          time: "2 days ago"
        },
        {
          sender: "patient",
          content: "I'll send my recent blood test results before our consultation.",
          time: "2 days ago"
        },
      ]
    }
  ];

  const filteredConversations = conversations.filter(
    (convo) => convo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the backend
      setMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="pb-6">
        <h1 className="text-3xl font-bold text-[#062D46]">Messages</h1>
        <p className="text-slate-500">Communicate with your patients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-80px)]">
        <Card className="lg:col-span-1 overflow-hidden flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="px-4 pt-2 pb-3 font-medium text-sm text-muted-foreground">
              Conversations
            </div>
            <div className="space-y-1">
              {filteredConversations.map((conversation, index) => (
                <button
                  key={conversation.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors ${
                    selectedChat === index ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedChat(index)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>
                        {conversation.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unread && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 text-left truncate">
                    <div className="font-medium">{conversation.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{conversation.time}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden flex flex-col h-full">
          {filteredConversations.length > 0 ? (
            <>
              <CardHeader className="flex flex-row items-center border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={filteredConversations[selectedChat].avatar}
                      alt={filteredConversations[selectedChat].name}
                    />
                    <AvatarFallback>
                      {filteredConversations[selectedChat].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {filteredConversations[selectedChat].name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {filteredConversations[selectedChat].messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === "doctor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "doctor"
                          ? "bg-[#062D46] text-white"
                          : "bg-accent"
                      }`}
                    >
                      <div>{msg.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender === "doctor" ? "text-white/70" : "text-muted-foreground"
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="icon" className="shrink-0 bg-[#062D46]" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No conversations</h3>
                <p className="text-muted-foreground">
                  Select a conversation or start a new one
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
