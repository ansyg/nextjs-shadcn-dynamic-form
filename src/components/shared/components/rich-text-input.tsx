"use client"

import {Toggle} from "@/components/ui/toggle"
import {EditorContent, useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {Bold, Italic, List, ListOrdered, Strikethrough} from "lucide-react"
import {useEffect} from "react"
import {Placeholder} from "@tiptap/extension-placeholder"

const RichTextEditor = ({val, placeholder, label, onChange}: {
    val: string,
    onChange: (val: string) => void,
    placeholder?: string,
    label?: string
}) => {
    const editor = useEditor({
        extensions: [
            Placeholder.configure({
                placeholder: label || placeholder || "Add a longer description",
                emptyNodeClass:
                    "first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
            }),
            StarterKit.configure({
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal pl-4",
                    },
                },

                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc pl-4",
                    },
                },
            }),
        ],

        onUpdate: ({editor}) => {
            const content = editor.getHTML()

            onChange(content)

        },
        editorProps: {
            attributes: {
                class:
                    "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            },
        },
        content: val,
    })

    useEffect(() => {
        if (editor?.isEmpty) editor.commands.setContent(val)
    }, [val])

    return (
        <div className="flex flex-col gap-2">
            {editor && (
                <div className="border-input border rounded-md">
                    <Toggle
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        size={"sm"}
                    >
                        <Bold className="w-4 h-4"/>
                    </Toggle>
                    <Toggle
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        size={"sm"}
                    >
                        <Italic className="w-4 h-4"/>
                    </Toggle>
                    <Toggle
                        pressed={editor.isActive("strike")}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                        size={"sm"}
                    >
                        <Strikethrough className="w-4 h-4"/>
                    </Toggle>
                    <Toggle
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        size={"sm"}
                    >
                        <ListOrdered className="w-4 h-4"/>
                    </Toggle>
                    <Toggle
                        pressed={editor.isActive("bulletList")}
                        onPressedChange={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        size={"sm"}
                    >
                        <List className="w-4 h-4"/>
                    </Toggle>
                </div>
            )}
            <EditorContent placeholder="heyy" editor={editor}/>
        </div>
    )
}

export default RichTextEditor