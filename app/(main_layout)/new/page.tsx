'use client'

import React, { useRef } from 'react'
import { Editor, IAllProps } from '@tinymce/tinymce-react'
import { Input } from '@nextui-org/input';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';

import { categoriesData } from '@/const/article/categories';
import { topicsData } from '@/const/article/topics';

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
        <form className="space-y-4">
            <h1 className='text-3xl'>Publish New Article</h1>
            <p>EngineersIQ is more than just a platform; it&apos;s a thriving community of engineers, professionals, and curious learners. Our diverse user base contributes to a rich ecosystem of knowledge, where everyone has something to learn and something to teach.</p>
            <div className='pt-5 space-y-4'>
                <Input isRequired label='Title' size='sm' type='text' />
                <div className=" md:flex gap-4 space-y-4 md:space-y-0">
                    <Select
                        isRequired
                        items={categoriesData}
                        label="Category"
                        size='sm'
                    >
                        {(category) => <SelectItem key={category.key}>{category.label}</SelectItem>}
                    </Select>
                    <Select
                        isRequired
                        items={topicsData}
                        label="Select Topics"
                        selectionMode='multiple'
                        size='sm'
                    >
                        {(topic) => <SelectItem key={topic.key}>{topic.label}</SelectItem>}
                    </Select>
                </div>
            </div>
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCA_API_KEY}
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
            <div className="flex justify-between">
                <Checkbox>Publish Premium</Checkbox>
                <div className="flex gap-4">
                    <Button color="primary" variant="bordered">Save Draft</Button>
                    <Button color="primary">Publish Now</Button>
                </div>
            </div>
        </form>
    )
}