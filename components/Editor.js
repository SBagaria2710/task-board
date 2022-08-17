import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = ({ saveState }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Hello World! 🌎️</p>',
        onBlur({ editor, event }) {
            // The editor isn’t focused anymore.
            console.log("Here", editor, event.target);
            saveState(event)
        },
    })

    return (
        <EditorContent editor={editor} />
    )
}

export default Tiptap;
