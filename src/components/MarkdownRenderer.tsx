import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`prose max-w-none ai-message-text ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ className, children, ...props }: CodeProps) => {
            const isInline = !className?.includes("language-");
            if (isInline) {
              return (
                <code
                  className="bg-amber-200 text-amber-900 px-1.5 sm:px-2 py-0.5 rounded text-xs sm:text-sm font-mono break-words"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-amber-100 rounded-lg p-3 sm:p-4 overflow-x-auto my-3 sm:my-4 text-xs sm:text-sm leading-relaxed">
                <code className="font-mono text-amber-900" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 underline"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-black">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2 pl-2 sm:pl-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 pl-2 sm:pl-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-black text-sm sm:text-base">{children}</li>
          ),
          p: ({ children }) => (
            <p className="mb-2 sm:mb-3 text-black leading-relaxed text-sm sm:text-base">
              {children}
            </p>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4 mt-4 sm:mt-6">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3 mt-3 sm:mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold text-black mb-2 mt-3 sm:mt-4">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-500 pl-3 sm:pl-4 italic text-amber-800 my-3 sm:my-4 text-sm sm:text-base">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
