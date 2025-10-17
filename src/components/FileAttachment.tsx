import React from "react";
import { motion } from "framer-motion";
import type { FileAttachment as FileAttachmentType } from "../types";
import { formatFileSize } from "../lib/utils";
import { X, File, Image, FileText, FileCode } from "lucide-react";

interface FileAttachmentProps {
  attachment: FileAttachmentType;
  onRemove: (id: string) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return Image;
  if (type.includes("text") || type.includes("document")) return FileText;
  if (
    type.includes("code") ||
    type.includes("javascript") ||
    type.includes("typescript")
  )
    return FileCode;
  return File;
};

export const FileAttachment: React.FC<FileAttachmentProps> = ({
  attachment,
  onRemove,
}) => {
  const IconComponent = getFileIcon(attachment.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center space-x-2 rounded-lg px-3 py-2 border bg-white/40 border-amber-200/60"
    >
      <IconComponent className="w-4 h-4 text-amber-600" />
      <div className="flex flex-col min-w-0">
        <span className="text-sm text-amber-900 truncate max-w-[150px]">
          {attachment.name}
        </span>
        <span className="text-xs text-amber-700">
          {formatFileSize(attachment.size)}
        </span>
      </div>
      <button
        onClick={() => onRemove(attachment.id)}
        className="ml-2 p-1 hover:bg-amber-200/40 rounded transition-colors"
      >
        <X className="w-3 h-3 text-amber-500 hover:text-amber-800" />
      </button>
    </motion.div>
  );
};
