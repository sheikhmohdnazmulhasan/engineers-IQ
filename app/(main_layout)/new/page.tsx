'use client'

import React, { useRef } from 'react'
import { Editor, IAllProps } from '@tinymce/tinymce-react'

interface EditorInstance {
    getContent: () => string;
}

export default function PostEditor() {
    const editorRef = useRef<EditorInstance | null>(null)

    const handleSave = async () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent()
            console.log(content)
        }
    }

    const handleEditorInit: IAllProps['onInit'] = (evt, editor) => {
        editorRef.current = editor
    }

    return (
        <div className="space-y-4">
            <Editor
                apiKey='3j1pmt7nz077ulhorf7nn2ry4gglzag9v36nedumtdoxezsq'
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onInit={handleEditorInit}
            />
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={handleSave}
            >
                Save
            </button>
        </div>
    )
}