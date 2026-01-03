"use client"
import { useState } from "react"

export default function InputForm({ notes }) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [inotes, setNotes] = useState(notes)
    const [editing, setEdit] = useState(null)
    const [editingtitle, setEdittitle] = useState("")
    const [editingcontent, setEditingcontent] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) return
        try {
            const result = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content })
            })
            const data = await result.json()

            if (data.success) {
                setNotes([...inotes, data.data])
                setTitle("")
                setContent("")
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            const result = await fetch(`/api/notes/${id}`, {
                method: "DELETE"
            })
            const response = await result.json()
            if (response.status) {
                setNotes(inotes.filter((note) => (
                    note.id !== id
                )))
            }


        }
        catch (error) {
            console.log(error)
        }
    }

    const startedit = (note) => {
        setEdit(note.id)
        setEdittitle(note.title)
        setEditingcontent(note.content)
    }

    const canceledit = () => {
        setEdit(null)
        setEdittitle("")
        setEditingcontent("")
    }

    const updateedit = async (id) => {
        if (!editingtitle.trim() || !editingcontent.trim()) return;

        try {
            const request = await fetch(`/api/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: editingtitle, content: editingcontent }),
            });

            const response = await request.json();

            const updatedNote = {
                ...response.data,
                id: response.data._id,
            };

            setNotes(
                inotes.map((note) =>
                    note.id === id ? updatedNote : note
                )
            );

            setEdit(null);
            setEdittitle("");
            setEditingcontent("");

        } catch (error) {
            console.log("Update failed:", error);
        }
    };


    return (
        <>
            <div className="max-w-lg mx-auto mt-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0f0f0f] p-6 shadow-sm">
                <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Enter Your Notes
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            value={title}
                            onChange={(e) => (setTitle(e.target.value))}
                            type="text"
                            placeholder="Enter note title"
                            className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => (setContent(e.target.value))}
                            rows="4"
                            placeholder="Write your note here..."
                            className="w-full resize-none rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-600 hover:to-purple-700 active:scale-[0.97]">
                        Submit
                    </button>
                </form>
            </div>
            <div className="flex justify-center">
                {inotes.length !== 0 ?
                    <div className="w-full max-w-5xl px-4 space-y-4">
                        <div className="mt-10">
                            <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
                                YOUR NOTES ({inotes.length})
                            </h2>
                        </div>
                        {inotes.map((note) => (
                            note.id !== editing ?
                                < div
                                    key={note.id || note._id}
                                    className="rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#0f0f0f] p-5 shadow-sm transition hover:shadow-md flex justify-between"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {note.title}
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                            {note.content}
                                        </p>

                                        <div className="mt-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Created: {note.createdAt}</span>
                                            <span>Updated: {note.updatedAt}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <button onClick={() => handleDelete(note.id)} className="rounded-lg bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-500/20 active:scale-95">
                                            Delete
                                        </button>

                                        <button onClick={() => startedit(note)} className="rounded-lg bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-500/20 active:scale-95">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                : <div key={note.id}>
                                    <div
                                        className="w-full max-w-xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-md space-y-4"
                                        style={{ WebkitAppearance: "none" }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Enter title"
                                            value={editingtitle}
                                            onChange={(e) => setEdittitle(e.target.value)}
                                            className="w-full min-w-0 px-4 py-3 rounded-xl bg-gray-900 text-white  placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500 appearance-none box-border"
                                        />

                                        <textarea
                                            placeholder="Enter content"
                                            value={editingcontent}
                                            onChange={(e) => setEditingcontent(e.target.value)}
                                            rows={5}
                                            className="w-full min-w-0 px-4 py-3 rounded-xl bg-gray-900 text-white  placeholder-gray-400 border border-gray-700focus:outline-none focus:border-blue-500resize-none appearance-none box-border"
                                        />

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                className="px-5 py-2 rounded-xl bg-gray-600 text-white  hover:bg-gray-700 transition appearance-none"
                                                onClick={canceledit}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                className="px-5 py-2 rounded-xl bg-blue-600 text-white  hover:bg-blue-700 transition appearance-none"
                                                onClick={() => updateedit(note.id)}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>


                        )
                        )
                        }
                    </div> : <>
                        <div className="mt-10 flex justify-center">
                            <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/15 bg-black/2 dark:bg-white/3 px-6 py-4">
                                <h3 className="text-center text-base font-medium text-white dark:text-gray-100">
                                    No notes yet. Create one above 👆
                                </h3>
                            </div>
                        </div>
                    </>}
            </div >
        </>
    )
}
