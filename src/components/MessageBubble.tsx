import React from "react";
import { motion } from "framer-motion";
import type { Message } from "../types";
import { formatTime } from "../lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
  isFirst?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isTyping = false,
  isFirst = false,
}) => {
  const isUser = message.sender === "user";
  const isAI = message.sender === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 ${
        isFirst ? "mt-20" : ""
      }`}
    >
      <div
        className={`flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[80%] ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-amber-600" : "bg-amber-700"
          }`}
        >
          {isUser ? (
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          ) : (
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          )}
        </div>

        <div
          className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
        >
          <div
            className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 max-w-[90%] sm:max-w-[80%] shadow-lg ${
              isUser
                ? "bg-amber-600 text-white"
                : "bg-white text-black border border-amber-200"
            }`}
          >
            {isTyping ? (
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            ) : isAI ? (
              <MarkdownRenderer content={message.content} />
            ) : (
              <p className="whitespace-normal">{message.content}</p>
            )}
          </div>
          <span
            className={`text-xs text-amber-600 mt-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
