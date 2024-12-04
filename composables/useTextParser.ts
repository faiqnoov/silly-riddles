export default function useTextParser() {
  // Escape special HTML characters
  const escapeHTML = (text: string): string =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  // Parse bold text (e.g., **bold**)
  const formatBold = (text: string): string =>
    text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Parse list items (e.g., * item)
  const formatLists = (text: string): string =>
    text
      .split("\n")
      .map((line) => {
        if (line.trim().startsWith("* ")) {
          return `<li>${line.trim().slice(2)}</li>`;
        }
        return line;
      })
      .join("\n");

  // Add paragraph tags and join formatted lines
  const formatParagraphs = (text: string): string => {
    const lines = text.split("\n");
    let html = "";
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("<li>")) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += trimmed;
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        if (trimmed) {
          html += `<p>${trimmed}</p>`;
        }
      }
    }
    if (inList) {
      html += "</ul>";
    }
    return html;
  };

  // Main function to parse response text to HTML
  const parseResponseTextToHTML = (response: string): string => {
    const escaped = escapeHTML(response);
    const bolded = formatBold(escaped);
    const listed = formatLists(bolded);
    return formatParagraphs(listed);
  };

  // Return the main function
  return {
    parseResponseTextToHTML,
  };
}
