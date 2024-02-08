import logo from "./assets/logo-nlw-expert.svg";
import { NoteCard } from "./components/note-card";
import { NewNoteCard } from "./components/new-note-card";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

interface notesDefault {
  id: number;
  date: number;
  content: string;
}

export default function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<notesDefault[]>(() => {
    const notesInStorage = localStorage.getItem("notes");

    if (notesInStorage) {
      return JSON.parse(notesInStorage);
    }

    return [];
  });

  const onNoteCreated = (content: string) => {
    const newNote = {
      id: Math.random(),
      date: Date.now(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setSearch(query);
  };

  const removeNote = (id: number) => {
    const removeNote = notes.filter((note) => note.id !== id);

    setNotes(removeNote);

    localStorage.setItem("notes", JSON.stringify(removeNote));

    toast.message("Nota deletada!");
  };

  const filteredNote =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search)
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      <img src={logo} />

      <form action="/" className="w-full">
        <input
          type="text"
          placeholder="Search Notes..."
          className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNote.map((note) => {
          return <NoteCard key={note.id} note={note} removeNote={removeNote} />;
        })}
      </div>
    </div>
  );
}
