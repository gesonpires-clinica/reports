"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  onSave?: () => Promise<void>;
  onClick?: () => void;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Digite seu texto aqui...",
  autoSave = true,
  autoSaveInterval = 30000,
  onSave,
  onClick,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S para salvar
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // Esc para sair do modo tela cheia
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
      // F11 para alternar tela cheia
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, isFullscreen]);

  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      if (editor && editor.getHTML() !== content) {
        handleSave();
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [editor, content, autoSave, autoSaveInterval]);

  const handleSave = async () => {
    if (!editor) return;
    onChange(editor.getHTML());
    if (onSave) {
      await onSave();
    }
    setLastSaved(new Date());
    toast.success("Alterações salvas");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!editor) return null;

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      <div className="border rounded-lg overflow-hidden">
        <div className="border-b p-2 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-gray-200" : ""}
          >
            Negrito
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-gray-200" : ""}
          >
            Itálico
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
          >
            Lista
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
          >
            Lista Numerada
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
          </Button>
        </div>
        <div onClick={onClick}>
          <EditorContent editor={editor} />
        </div>
      </div>
      {lastSaved && (
        <div className="text-sm text-gray-500 mt-2">
          Último salvamento: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
} 