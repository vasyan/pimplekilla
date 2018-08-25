const NODE = document.querySelector(".js-console");

let count = 0;

export default function(message) {
  count++;

  if (NODE.children.length >= 5) {
    NODE.children[0].remove();
  }

  const item = document.createElement("li");

  item.className = "console-item";
  item.textContent = message + (count % 5 ? "" : " -----");

  NODE.appendChild(item);
}
