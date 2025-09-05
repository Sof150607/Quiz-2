const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;
const colors = ['note-yellow', "note-blue", "note-pink" ]; //faltaba azul y rosado

//en la parte de arriba lo que hace es que basicamente toma los elementos que tienen determinado id en el html y los guarda aca en el js como constante

function createNoteElement(text, colorClass) {
    //aca creo un div de la nota y el boton de eliminar 
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass); 
    noteDiv.textContent = text;

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';

    //meto dentro del div el boton de borrar

    noteDiv.appendChild(deleteButton);
    return noteDiv;
}

function loadNotes() {
    //intenta cargar las notas

    const storedNotes = [];
    console.log(storedNotes);
    //comprueba si hay notas para ponerlas
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);
            notesContainer.appendChild(newNote);
        });
    }
}

function setInitialTheme() {
    //cambia el texto de el boton de modo claro y oscuro, comprueba en esta primera parte si esta en modo oscuro
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro'; //aca cambia el contenido del texto
    }
}

noteInput.addEventListener('input', () => {

    //esto hace que cuando el input no tenga texto este desabilitado
    addButton.disabled = noteInput.value.trim() === '';
});

toggleThemeButton.addEventListener('click', () => {
    //comprueba si es modo claro o modo oscuro
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

notesContainer.addEventListener('dblclick', (event) => {

    //lo que hace esta funcion basicamente es que al darle dobleclick a la nota permite cambiar el texto que hay dentro de ella
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            //aca crea la nueva nota con el texto nuevo
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});
  
addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    //comprueba que si exista un texto para la nota y adentro del if lo que hace es sacar un color aleatorio para el fondo de la nueva nota
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        //se repetia lo de arriba (error)
        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

notesContainer.addEventListener('click', (event) => {

    //si el boton de borrar la nota es oprimido esta será removida
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

notesContainer.addEventListener('mouseover', (event) => {
    //al pasar el mouse sobre una nota aumenta la sombra
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

notesContainer.addEventListener('mouseout', (event) => {
    //cuando el mouse ya no esta en la nota vuelve al estado original
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

setInitialTheme();
loadNotes(); //aca llama a las funciones para ejecutarlas 