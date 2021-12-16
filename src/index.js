// User Stories:
// - Quand je clique sur ajouter, je veux pouvoir avoir le focus sur le champ de texte
// - Quand le formulaire est soumis, je veux que le champ de texte soit vidé
// - Quand je clique sur une todo, je veux pouvoir supprimer celle-ci

const todoForm = window.document.getElementById("todo");
const todos = window.document.getElementById("todos");

todoForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const input = window.document.getElementById("description");
  const value = input.value;
  const todo = window.document.createElement("li");

  todo.innerText = value;

  todos.appendChild(todo);
});
