import InputForm from "@/components/input-form";
import dbConnect from "@/lib/connection";
import Note from "@/models/Note";

async function getNotes() {
  await dbConnect()
  const notes = await Note.find().sort({ createdAt: -1 })
  return notes.map((note) => ({
    id: note._id.toString(),             
    title: note.title,
    content: note.content,
    createdAt: note.createdAt.toISOString(), 
    updatedAt: note.updatedAt.toISOString(),
  }));
}

export default async function Home() {
  const notes = await getNotes()
  return (
    <div>
      <InputForm notes={notes} />
    </div>
  );
}
