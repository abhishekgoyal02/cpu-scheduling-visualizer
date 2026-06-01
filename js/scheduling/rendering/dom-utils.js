export function clearElement(element) {
  if (element) {
    element.replaceChildren();
  }
}

export function createElement(tagName, className, textContent = "") {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

export function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}
