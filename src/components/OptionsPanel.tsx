import React from "react";
import type { ChatOptions } from "../types";
import { Select } from "./ui/select";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Settings, Zap, BookOpen, FileText } from "lucide-react";

interface OptionsPanelProps {
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  options,
  onOptionsChange,
}) => {
  const handleOptionChange = (
    key: keyof ChatOptions,
    value: string | number | boolean
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group flex items-center space-x-2 hover:bg-amber-200/30 hover:text-amber-900 transition-colors text-amber-800 px-3 py-2"
        >
          <Settings className="w-4 h-4 text-amber-600 group-hover:text-amber-700" />
          <span className="hidden sm:inline text-sm font-medium">Options</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-amber-100/5 backdrop-blur-md border-amber-200/20">
        <DialogHeader>
          <DialogTitle className="text-amber-800 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Request Options</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-amber-800">
              <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Response Length</span>
            </label>
            <Select
              value={options.responseLength}
              onChange={(e) =>
                handleOptionChange("responseLength", e.target.value)
              }
              className="w-full text-sm"
            >
              <option value="short">Short (1-2 sentences)</option>
              <option value="medium">Medium (1-2 paragraphs)</option>
              <option value="long">Long (detailed response)</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-amber-800">
              <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Model Choice</span>
            </label>
            <Select
              value={options.model}
              onChange={(e) => handleOptionChange("model", e.target.value)}
              className="w-full text-sm"
            >
              <option value="gpt-4">GPT-4 (Most Capable)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
              <option value="claude-3">Claude-3 (Creative)</option>
              <option value="gemini-pro">Gemini Pro (Multimodal)</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-amber-800">
              <span className="w-4 h-4 text-amber-600 flex-shrink-0">🎭</span>
              <span>Tone</span>
            </label>
            <Select
              value={options.tone}
              onChange={(e) => handleOptionChange("tone", e.target.value)}
              className="w-full text-sm"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="technical">Technical</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-amber-800">
              <span className="w-4 h-4 text-amber-600 flex-shrink-0">🌡️</span>
              <span className="truncate">
                Temperature: {options.temperature}
              </span>
            </label>
            <Slider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={options.temperature}
              onChange={(e) =>
                handleOptionChange("temperature", parseFloat(e.target.value))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-amber-600">
              <span>Focused</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-amber-800">
              <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Reading Level</span>
            </label>
            <Select
              value={options.readingLevel}
              onChange={(e) =>
                handleOptionChange("readingLevel", e.target.value)
              }
              className="w-full text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm font-medium text-amber-800">
              <span className="w-4 h-4 text-amber-600 flex-shrink-0">📋</span>
              <span className="truncate">Include Outline</span>
            </label>
            <Switch
              checked={options.includeOutline}
              onChange={(e) =>
                handleOptionChange("includeOutline", e.target.checked)
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
