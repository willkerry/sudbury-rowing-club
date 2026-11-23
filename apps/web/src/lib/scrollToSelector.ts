export const scrollToSelector = (selector: string) => {
  const inputElement = window.document.querySelector(selector);

  if (!inputElement) return;
  inputElement.parentElement?.scrollIntoView({ behavior: "smooth" });

  if (!("focus" in inputElement)) return;
  if (typeof inputElement.focus !== "function") return;

  inputElement.focus();
};
