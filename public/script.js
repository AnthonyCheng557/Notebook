const saveBtn = document.getElementById("saveBtn");
const noteInput = document.getElementById("noteInput");
const status = document.getElementById("status");
const notesList = document.getElementById("notesList");

saveBtn.addEventListener("click", async () => {
  const content = noteInput.value.trim();
  if (!content) {
    status.textContent = "Please write something before saving.";
    status.style.color = "red";
    return;
  }

  const res = await fetch("/api/addNote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (res.ok) {
    status.textContent = "Note saved successfully!";
    status.style.color = "green";
    noteInput.value = "";
    loadNotes(); // Refresh the note list
  } else {
    status.textContent = "❌ Error saving note.";
    status.style.color = "red";
  }
});

// Function to load all notes
async function loadNotes() {
  const res = await fetch("/api/getNotes");
  const notes = await res.json();

  notesList.innerHTML = notes
    .map(
      (n) => `
      <div class="note">
        <p>${n.content}</p>
        <small>${new Date(n.created_at).toLocaleString()}</small>
      </div>
    `
    )
    .join("");
}

// Load notes when the page starts
loadNotes();
