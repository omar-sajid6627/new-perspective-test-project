import type { AIResponse, ChatOptions, FileAttachment } from "../types";

export class AIAgent {
  private responseStyles: AIResponse["style"][] = [
    "summary",
    "bullets",
    "steps",
    "quip",
    "definition",
    "qa",
    "code",
  ];

  generateResponse(
    userMessage: string,
    options: ChatOptions,
    attachments: FileAttachment[]
  ): AIResponse {
    const hasAttachments = attachments.length > 0;

    // Determine response style based on message content and options
    const style: AIResponse["style"] = this.determineResponseStyle(
      userMessage,
      options,
      hasAttachments
    );

    // Generate content based on style and options
    const content = this.generateContentByStyle(
      userMessage,
      style,
      options,
      hasAttachments,
      attachments
    );

    return { content, style };
  }

  private determineResponseStyle(
    message: string,
    options: ChatOptions,
    hasAttachments: boolean
  ): AIResponse["style"] {
    const lowerMessage = message.toLowerCase();

    // Check for specific keywords to determine style
    if (
      lowerMessage.includes("how to") ||
      lowerMessage.includes("steps") ||
      lowerMessage.includes("process")
    ) {
      return "steps";
    }

    if (
      lowerMessage.includes("what is") ||
      lowerMessage.includes("define") ||
      lowerMessage.includes("explain")
    ) {
      return "definition";
    }

    if (
      lowerMessage.includes("list") ||
      lowerMessage.includes("bullets") ||
      lowerMessage.includes("items")
    ) {
      return "bullets";
    }

    if (
      lowerMessage.includes("code") ||
      lowerMessage.includes("programming") ||
      lowerMessage.includes("function")
    ) {
      return "code";
    }

    if (
      lowerMessage.includes("?") &&
      (lowerMessage.includes("why") ||
        lowerMessage.includes("what") ||
        lowerMessage.includes("how"))
    ) {
      return "qa";
    }

    if (hasAttachments) {
      return "summary";
    }

    // Default based on response length
    if (options.responseLength === "short") {
      return "quip";
    } else if (options.responseLength === "long") {
      return "summary";
    }

    return this.responseStyles[
      Math.floor(Math.random() * this.responseStyles.length)
    ];
  }

  private generateContentByStyle(
    message: string,
    style: AIResponse["style"],
    options: ChatOptions,
    hasAttachments: boolean,
    attachments: FileAttachment[]
  ): string {
    const baseResponse = this.getBaseResponse(message, options);

    switch (style) {
      case "summary":
        return this.generateSummary(
          baseResponse,
          options,
          hasAttachments,
          attachments
        );

      case "bullets":
        return this.generateBullets(baseResponse, options);

      case "steps":
        return this.generateSteps(baseResponse, options);

      case "quip":
        return this.generateQuip(baseResponse);

      case "definition":
        return this.generateDefinition(baseResponse, options);

      case "qa":
        return this.generateQA(baseResponse, options);

      case "code":
        return this.generateCode(baseResponse, options);

      default:
        return baseResponse;
    }
  }

  private getBaseResponse(message: string, options: ChatOptions): string {
    const tone = options.tone;
    const model = options.model;

    let baseResponse = `I understand you're asking about "${message}". `;

    if (tone === "professional") {
      baseResponse += "Let me provide you with a comprehensive analysis. ";
    } else if (tone === "casual") {
      baseResponse += "That's a great question! ";
    } else if (tone === "friendly") {
      baseResponse += "I'd be happy to help you with that! ";
    } else if (tone === "technical") {
      baseResponse += "From a technical perspective, ";
    }

    baseResponse += `Using the ${model} model, `;

    if (options.readingLevel === "beginner") {
      baseResponse += "I'll explain this in simple terms. ";
    } else if (options.readingLevel === "advanced") {
      baseResponse += "I'll provide a detailed technical explanation. ";
    }

    return baseResponse;
  }

  private generateSummary(
    baseResponse: string,
    options: ChatOptions,
    hasAttachments: boolean,
    attachments: FileAttachment[]
  ): string {
    let response = baseResponse;

    if (hasAttachments) {
      response += `I've reviewed the ${attachments.length} file(s) you've attached: `;
      response += attachments.map((f) => f.name).join(", ") + ". ";
    }

    response += "Here's a comprehensive overview:\n\n";
    response +=
      "This topic encompasses several key aspects that are important to understand. ";
    response +=
      "The main concepts involve understanding the fundamental principles and their practical applications. ";
    response +=
      "When considering this subject, it's essential to take into account various factors that can influence the outcome. ";
    response +=
      "The implementation typically involves several steps that build upon each other to create a cohesive solution. ";
    response +=
      "It's worth noting that this approach has been proven effective in similar contexts and can be adapted to various scenarios.";

    if (options.includeOutline) {
      response += "\n\n**Key Points Outline:**\n";
      response += "• Fundamental concepts and principles\n";
      response += "• Practical applications and use cases\n";
      response += "• Implementation considerations\n";
      response += "• Best practices and recommendations\n";
      response += "• Potential challenges and solutions";
    }

    return response;
  }

  private generateBullets(baseResponse: string, options: ChatOptions): string {
    let response = baseResponse + "Here are the key points:\n\n";

    const bullets = [
      "**Primary Concept**: The core idea that drives the entire approach",
      "**Implementation Strategy**: A systematic method for putting ideas into practice",
      "**Key Benefits**: The main advantages and positive outcomes you can expect",
      "**Considerations**: Important factors to keep in mind during execution",
      "**Best Practices**: Proven methods that lead to successful outcomes",
      "**Common Pitfalls**: Things to avoid and potential challenges to watch for",
    ];

    response += bullets.map((bullet) => `• ${bullet}`).join("\n");

    if (options.responseLength === "long") {
      response += "\n\n**Additional Details:**\n";
      response +=
        "• **Technical Specifications**: Detailed requirements and specifications\n";
      response +=
        "• **Integration Points**: How this connects with other systems\n";
      response +=
        "• **Performance Metrics**: Ways to measure success and effectiveness\n";
      response +=
        "• **Future Considerations**: Long-term implications and scalability";
    }

    return response;
  }

  private generateSteps(baseResponse: string, options: ChatOptions): string {
    let response = baseResponse + "Here's a step-by-step approach:\n\n";

    const steps = [
      "**Step 1: Initial Assessment**\n   Begin by evaluating the current situation and identifying your specific needs.",
      "**Step 2: Planning Phase**\n   Create a detailed plan that outlines your objectives and the resources required.",
      "**Step 3: Preparation**\n   Gather all necessary materials and ensure you have the right tools for the job.",
      "**Step 4: Implementation**\n   Execute your plan systematically, following the established guidelines.",
      "**Step 5: Testing & Validation**\n   Verify that everything is working as expected and meets your requirements.",
      "**Step 6: Review & Optimization**\n   Analyze the results and make any necessary adjustments for improvement.",
    ];

    response += steps
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n\n");

    if (options.responseLength === "long") {
      response += "\n\n**Pro Tips:**\n";
      response += "• Take your time with each step to ensure quality\n";
      response += "• Document your process for future reference\n";
      response +=
        "• Don't hesitate to seek help if you encounter difficulties\n";
      response += "• Regular checkpoints help maintain progress and quality";
    }

    return response;
  }

  private generateQuip(baseResponse: string): string {
    const quips = [
      "That's a brilliant question! Here's the quick answer:",
      "Great question! Let me give you the essential info:",
      "Ah, I love this question! Here's what you need to know:",
      "Perfect timing for this question! Here's the scoop:",
      "Excellent question! Here's the key insight:",
    ];

    const quip = quips[Math.floor(Math.random() * quips.length)];
    return (
      `${quip}\n\n${baseResponse}The short answer is that this is a fascinating topic with many interesting aspects. ` +
      `The key thing to remember is that understanding the fundamentals makes everything else much clearer. ` +
      `It's one of those topics that seems complex at first but becomes intuitive once you get the hang of it!`
    );
  }

  private generateDefinition(
    baseResponse: string,
    options: ChatOptions
  ): string {
    let response = baseResponse + "Let me break this down for you:\n\n";

    response += "**Definition:**\n";
    response +=
      "This concept refers to a fundamental principle or methodology that serves as the foundation for understanding and implementing related practices.\n\n";

    response += "**Key Characteristics:**\n";
    response +=
      "• **Core Principle**: The essential idea that defines the concept\n";
    response +=
      "• **Scope**: The range of applications and contexts where it applies\n";
    response += "• **Purpose**: The main goal or objective it serves\n";
    response +=
      "• **Context**: The situations where it's most relevant and useful\n\n";

    response += "**Example:**\n";
    response +=
      "Think of it like learning to ride a bicycle. At first, it seems impossible to balance, but once you understand the basic principles of momentum and balance, it becomes second nature. The same applies here - the concept provides the foundational understanding that makes everything else click into place.\n\n";

    if (options.responseLength === "long") {
      response += "**Related Concepts:**\n";
      response += "• Similar methodologies that complement this approach\n";
      response += "• Advanced techniques that build upon this foundation\n";
      response += "• Common variations and alternative approaches\n\n";

      response += "**When to Use:**\n";
      response +=
        "This concept is particularly valuable when you need a solid foundation for more complex tasks or when you want to ensure consistency across different implementations.";
    }

    return response;
  }

  private generateQA(baseResponse: string, options: ChatOptions): string {
    let response = baseResponse + "Let me address this with a Q&A format:\n\n";

    response += "**Q: What is the main concept here?**\n";
    response +=
      "A: The main concept involves understanding the fundamental principles and applying them systematically to achieve desired outcomes.\n\n";

    response += "**Q: Why is this important?**\n";
    response +=
      "A: It's important because it provides a structured approach that increases the likelihood of success and helps avoid common pitfalls.\n\n";

    response += "**Q: How do you implement this?**\n";
    response +=
      "A: Implementation typically involves several phases: planning, preparation, execution, and review. Each phase builds upon the previous one.\n\n";

    response += "**Q: What are the key benefits?**\n";
    response +=
      "A: The main benefits include improved efficiency, better outcomes, reduced risk, and a clearer understanding of the process.\n\n";

    if (options.responseLength === "long") {
      response += "**Q: Are there any common challenges?**\n";
      response +=
        "A: Yes, common challenges include resource constraints, timeline pressures, and the need for specialized knowledge. However, these can be managed with proper planning.\n\n";

      response += "**Q: How do you measure success?**\n";
      response +=
        "A: Success can be measured through various metrics such as completion time, quality of results, user satisfaction, and achievement of predefined objectives.";
    }

    return response;
  }

  private generateCode(baseResponse: string, options: ChatOptions): string {
    let response =
      baseResponse + "Here's a technical breakdown with code examples:\n\n";

    response += "**Core Implementation:**\n";
    response += "```typescript\n";
    response += "interface ExampleConfig {\n";
    response += "  property: string;\n";
    response += "  value: number;\n";
    response += "  enabled: boolean;\n";
    response += "}\n\n";
    response += "function processData(config: ExampleConfig): string {\n";
    response += "  if (!config.enabled) {\n";
    response += "    return 'Processing disabled';\n";
    response += "  }\n\n";
    response += "  const result = `${config.property}: ${config.value}`;\n";
    response += "  return result;\n";
    response += "}\n";
    response += "```\n\n";

    response += "**Usage Example:**\n";
    response += "```typescript\n";
    response += "const config: ExampleConfig = {\n";
    response += "  property: 'example',\n";
    response += "  value: 42,\n";
    response += "  enabled: true\n";
    response += "};\n\n";
    response += "const result = processData(config);\n";
    response += "console.log(result); // Output: 'example: 42'\n";
    response += "```\n\n";

    response += "**Key Features:**\n";
    response +=
      "• **Type Safety**: TypeScript interfaces ensure data integrity\n";
    response +=
      "• **Error Handling**: Proper validation and error management\n";
    response += "• **Modularity**: Clean separation of concerns\n";
    response += "• **Extensibility**: Easy to extend and modify\n\n";

    if (options.responseLength === "long") {
      response += "**Advanced Implementation:**\n";
      response += "```typescript\n";
      response += "class AdvancedProcessor {\n";
      response += "  private config: ExampleConfig;\n\n";
      response += "  constructor(config: ExampleConfig) {\n";
      response += "    this.config = config;\n";
      response += "  }\n\n";
      response += "  async process(): Promise<string> {\n";
      response += "    // Advanced processing logic here\n";
      response += "    return 'Processed successfully';\n";
      response += "  }\n";
      response += "}\n";
      response += "```\n\n";

      response += "**Best Practices:**\n";
      response += "• Always validate input parameters\n";
      response += "• Use proper error handling and logging\n";
      response += "• Write comprehensive unit tests\n";
      response += "• Follow consistent coding standards\n";
      response += "• Document your code thoroughly";
    }

    return response;
  }
}
