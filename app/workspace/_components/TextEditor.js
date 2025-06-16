import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import React, { useEffect, useState } from "react";
import EditorExtensions from "./EditorExtensions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import { chatSession } from "@/config/AIModel";
import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const TextEditor = ({ fileId }) => {
  const { user } = useUser();

  // Always call Convex hooks at the top level
  const searchAI = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const notes = useQuery(api.notes.GetAllNotes, {
    fileId: fileId,
  });

  // Debug logging
  console.log("TextEditor - FileId:", fileId);
  console.log("TextEditor - Notes:", notes);
  console.log("TextEditor - SearchAI available:", !!searchAI);
  console.log("TextEditor - SaveNotes available:", !!saveNotes);
  const [inputVal, setInputVal] = useState("");

  const onClickHandler = async () => {
    if (!editor || !inputVal.trim()) {
      toast("Please enter a question first.");
      return;
    }

    toast("AI is thinking...");
    const selectedText = inputVal.trim();

    try {
      console.log("Processing query:", selectedText, "for fileId:", fileId);

      // Try to search using Convex if available
      if (searchAI && fileId) {
        try {
          console.log("Attempting Convex search...");
          const result = await searchAI({
            query: selectedText,
            fileId: fileId,
          });

          if (result) {
            const unFormattedAns = JSON.parse(result);
            console.log("Convex search successful, results:", unFormattedAns.length);

            if (unFormattedAns && unFormattedAns.length > 0) {
              let AllunFormattedAns = "";
              unFormattedAns.forEach((item) => {
                AllunFormattedAns += item.pageContent + " ";
              });

              if (AllunFormattedAns.trim().length > 0) {
                const PROMPT = `Based on the following content from the PDF document: "${AllunFormattedAns}"

Please answer this question: "${selectedText}"

Provide a clear, accurate answer in HTML format based only on the content from the PDF document.`;

                console.log("Sending prompt to AI model");
                const AiModelResult = await chatSession.sendMessage(PROMPT);
                const FinalAns = AiModelResult.response
                  .text()
                  .replace(/```html/g, "")
                  .replace(/```/g, "");

                editor.commands.setContent(
                  "<div><h3>Answer:</h3><br/>" + FinalAns + "</div>"
                );

                if (saveNotes) {
                  await saveNotes({
                    notes: editor.getHTML(),
                    fileId: fileId,
                    createBy: user?.primaryEmailAddress?.emailAddress,
                  });
                }

                toast("Response generated successfully!");
                return;
              }
            }
          }
        } catch (convexError) {
          console.log("Convex search failed, falling back to general AI:", convexError.message);
        }
      }

      // Fallback: Use general AI response
      console.log("Using general AI response");
      const GENERAL_PROMPT = `Please provide a helpful and informative answer to this question: "${selectedText}"

Since I don't have access to the specific PDF content right now, please provide a general but comprehensive answer based on your knowledge. Format your response in HTML.`;

      const AiModelResult = await chatSession.sendMessage(GENERAL_PROMPT);
      const FinalAns = AiModelResult.response
        .text()
        .replace(/```html/g, "")
        .replace(/```/g, "");

      editor.commands.setContent(
        `<div>
          <h3>General AI Response:</h3>
          <p><em>Note: This is a general response as the PDF content search is not available.</em></p>
          <br/>
          ${FinalAns}
        </div>`
      );

      if (saveNotes) {
        await saveNotes({
          notes: editor.getHTML(),
          fileId: fileId,
          createBy: user?.primaryEmailAddress?.emailAddress,
        });
      }

      toast("General AI response generated!");

    } catch (error) {
      console.error("AI generation error:", error);
      toast("Error generating response. Please try again.");

      editor.commands.setContent(
        `<div style="color: #ff6b6b; padding: 10px; border: 1px solid #ff6b6b; border-radius: 5px;">
          <h3>Error:</h3>
          <p>Unable to generate response. Please try again.</p>
          <p><strong>Query:</strong> ${selectedText}</p>
        </div>`
      );
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold.configure({
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: 'italic',
        },
      }),
      Placeholder.configure({
        placeholder: "Start taking your notes...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none p-5 h-[60vh]",
      },
    },
    immediatelyRender: false, // Fix SSR hydration issues
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(notes || "");
  }, [editor, notes]);

  return (
    <div className="bg-[#181C14] text-[#ECDFCC]">
      <EditorExtensions editor={editor} />
      <div className="overflow-y-scroll h-[71vh] md:h-[65vh] p-5">
        <EditorContent editor={editor} />
      </div>
      <div className="grid w-full gap-2 p-4">
        <Textarea
          placeholder="Type your message here."
          onChange={(e) => setInputVal(e.target.value)}
        />
        <Button
          onClick={() => onClickHandler()}
          className="hover:bg-[#ECDFCC] hover:text-[#181C14]"
        >
          <span>Generate</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;
