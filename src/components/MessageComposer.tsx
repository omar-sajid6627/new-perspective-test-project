import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  ChatOptions,
  FileAttachment as FileAttachmentType,
} from "../types";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FileAttachment } from "./FileAttachment";
import { Send, Paperclip } from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (
    message: string,
    options: ChatOptions,
    attachments: FileAttachmentType[]
  ) => void;
  options: ChatOptions;
  attachments: FileAttachmentType[];
  onAttachmentsChange: (attachments: FileAttachmentType[]) => void;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  options,
  attachments,
  onAttachmentsChange,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), options, attachments);
      setMessage("");
      onAttachmentsChange([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: FileAttachmentType[] = [];
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach((file) => {
      if (attachments.length + newAttachments.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB`);
        return;
      }

      const attachment: FileAttachmentType = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      };

      newAttachments.push(attachment);
    });

    onAttachmentsChange([...attachments, ...newAttachments]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((att) => att.id !== id));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-amber-200/50 bg-amber-100/30">
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 sm:p-6 border-b border-amber-200/30"
          >
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <FileAttachment
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={removeAttachment}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div
          className={`relative rounded-2xl border transition-colors p-4 ${
            isDragOver
              ? "border-amber-400/40 bg-amber-500/15"
              : "border-white/20 bg-white/15"
          }`}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="h-[50px] sm:h-[60px] max-h-[200px] resize-y border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-16 sm:pr-20 pl-2 sm:pl-3 py-2 sm:py-3 leading-normal placeholder:text-amber-800/70 text-amber-900 font-medium"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            disabled={disabled}
          />

          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center space-x-1 sm:space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept="*/*"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={openFileDialog}
              disabled={disabled || attachments.length >= 5}
              className="h-7 w-7 sm:h-8 sm:w-8 text-amber-700/90 hover:text-amber-900 hover:bg-white/25 transition-all duration-200 rounded-full"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>

            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="h-7 sm:h-8 px-2 sm:px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg rounded-full border border-amber-400/20"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
              }}
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-amber-500/20 rounded-2xl pointer-events-none border border-amber-400/40"
            style={{
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              boxShadow: "0 8px 32px rgba(245, 158, 11, 0.2)",
            }}
          >
            <div className="text-amber-800 font-semibold text-center px-4">
              Drop files here to attach them
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};
