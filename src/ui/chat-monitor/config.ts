import { clone } from "remeda";
import { UIColors } from "../colors.js";
import * as st from "../config.js";
import { MessageTypeEnum } from "./runtime-handler.js";

/**
 * Styling functions specific to the chat monitor
 */

/**
 * Format user message for display
 * @param message The user message content
 * @returns Formatted user message
 */
export function formatUserMessage(
  message: string,
  highlighted?: boolean,
): string {
  return st.input(message, undefined, highlighted);
}

/**
 * Format system message for display
 * @param message The system message content
 * @returns Formatted system message
 */
export function formatSystemMessage(
  message: string,
  highlighted?: boolean,
): string {
  return message.includes("Error")
    ? st.error(message, highlighted)
    : st.system(message, highlighted);
}

/**
 * Format agent or task message for display
 * @param message The agent/task message content
 * @returns Formatted agent/task message
 */
export function formatAgentMessage(
  message: string,
  highlighted?: boolean,
): string {
  return st.output(message, undefined, highlighted);
}

/**
 * Format role/sender display text
 * @param role The role/sender (You, System, Agent, etc.)
 * @returns Formatted role text
 */
export function formatRole(role: string): string {
  if (role === "You") {
    return `{bold}{#88ff88}${role}{/}`;
  } else if (role === "System") {
    return `{bold}{#ffcc00}${role}{/}`;
  } else if (role.startsWith("🤖") || role.startsWith("📋")) {
    // This is already formatted for agent/task
    return role;
  } else {
    return role;
  }
}

/**
 * Format a complete message with timestamp, role and content
 * @param timestamp The message timestamp
 * @param role The sender role
 * @param content The message content
 * @returns A completely formatted message
 */
export function formatCompleteMessage(
  timestamp: Date | string,
  role: string,
  content: string,
  type: MessageTypeEnum,
  highlighted: boolean,
): string {
  const formattedTimestamp = st.timestamp(timestamp);
  const formattedRole = formatRole(role);

  // Format content based on role
  let formattedContent;
  switch (type) {
    case MessageTypeEnum.INPUT:
      formattedContent = formatUserMessage(content, highlighted);
      break;
    case MessageTypeEnum.PROGRESS:
    case MessageTypeEnum.ERROR:
    case MessageTypeEnum.ABORT:
    case MessageTypeEnum.SYSTEM:
      formattedContent = formatSystemMessage(content, highlighted);
      break;
    case MessageTypeEnum.FINAL:
      formattedContent = formatAgentMessage(content, highlighted);
      break;
  }
  return `${formattedTimestamp} ${formattedRole}: ${formattedContent}`;
}

/**
 * Get UI styling for the messages box
 * @returns Object with UI configuration for the messages box
 */
export function getMessagesContainerStyle() {
  const border = clone(st.UIConfig.borders) as any;
  return {
    border,
    label: " Messages ",
    style: {
      focus: border.focus,
    },
  };
}

export function getMessagesBoxStyle() {
  return {
    scrollbar: st.UIConfig.scrollbar,
    style: {
      focus: {
        bg: UIColors.green.dartmouth_green,
      },
    },
  };
}

export function getInputContainerBoxStyle() {
  const border = clone(st.UIConfig.borders) as any;
  return {
    border: border,
    label: " Input ",
    style: {
      focus: border.focus,
    },
  };
}

export function getInputBoxStyle() {
  return {
    style: {
      ...st.UIConfig.input,
    },
  };
}

/**
 * Get UI styling for the abort button
 * @param isAbort Whether the system is currently processing
 * @returns Object with UI configuration for the abort button
 */
export function getSendButtonStyle(disabled = false) {
  return {
    content: "SEND",
    align: "center" as any,
    valign: "middle" as any,
    style: {
      fg: disabled ? UIColors.gray.cool_gray : UIColors.white.white,
      bg: disabled ? UIColors.gray.gray : UIColors.blue.blue,
      focus: {
        bg: disabled ? UIColors.gray.gray : UIColors.blue.cyan,
      },
      hover: {
        bg: disabled ? UIColors.gray.gray : UIColors.blue.cyan,
      },
    },
  };
}
export function getAbortButtonStyle(disabled = false) {
  return {
    content: "ABORT",
    align: "center" as any,
    valign: "middle" as any,
    style: {
      fg: disabled ? UIColors.gray.cool_gray : UIColors.white.white,
      bg: disabled ? UIColors.gray.cool_gray : UIColors.red.dark_red,
      focus: {
        bg: disabled ? UIColors.gray.cool_gray : UIColors.red.electric_red,
      },
      hover: {
        bg: disabled ? UIColors.gray.cool_gray : UIColors.red.red,
      },
    },
  };
}
