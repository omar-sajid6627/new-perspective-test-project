import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  Message,
  ChatOptions,
  FileAttachment as FileAttachmentType,
} from "./types";
import { AIAgent } from "./lib/aiAgent";
import { MessageBubble } from "./components/MessageBubble";
import { MessageComposer } from "./components/MessageComposer";
import { OptionsPanel } from "./components/OptionsPanel";
import { Bot } from "lucide-react";

const aiAgent = new AIAgent();

const defaultOptions: ChatOptions = {
  responseLength: "medium",
  model: "gpt-4",
  tone: "friendly",
  temperature: 0.7,
  includeOutline: false,
  readingLevel: "intermediate",
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant. I can help you with various topics and questions. Feel free to ask me anything!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [options, setOptions] = useState<ChatOptions>(defaultOptions);
  const [attachments, setAttachments] = useState<FileAttachmentType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (
    message: string,
    options: ChatOptions,
    attachments: FileAttachmentType[]
  ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const typingDelay = Math.random() * 500 + 300;
    await new Promise((resolve) => setTimeout(resolve, typingDelay));

    const aiResponse = aiAgent.generateResponse(message, options, attachments);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse.content,
      sender: "ai",
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-4 bg-white/20 backdrop-blur-md rounded-t-2xl border border-amber-200">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h1 className="text-sm sm:text-lg font-bold text-amber-800">
                AI
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-amber-700 font-medium">Online</span>
            </div>
            <div>
              <OptionsPanel options={options} onOptionsChange={setOptions} />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto h-screen flex flex-col bg-amber-50 rounded-t-2xl border border-amber-200">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 pt-16 space-y-4 sm:space-y-6 scrollbar-hide relative z-10">
          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isFirst={index === 0}
              />
            ))}
          </AnimatePresence>
          {isTyping && (
            <MessageBubble
              message={{
                id: "typing",
                content: "",
                sender: "ai",
                timestamp: new Date(),
              }}
              isTyping={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
        <MessageComposer
          onSendMessage={handleSendMessage}
          options={options}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

export default App;
