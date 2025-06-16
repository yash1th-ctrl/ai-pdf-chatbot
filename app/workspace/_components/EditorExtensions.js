import { chatSession } from "@/config/AIModel";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useAction, useMutation } from "convex/react";
import { Bold, Italic, SparklesIcon, Underline, List, ListOrdered } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const EditorExtensions = ({ editor }) => {
  const { fileId } = useParams();
  const searchAI = useAction(api.myActions.search);
  const { user } = useUser();
  const saveNotes = useMutation(api.notes.AddNotes);

  const onAiClick = async () => {
    toast("AI is thinking...");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );
    const result = await searchAI({
      query: selectedText,
      fileId: fileId,
    });
    const unFormattedAns = JSON.parse(result);
    let AllunFormattedAns = "";
    unFormattedAns &&
      unFormattedAns.forEach((item) => {
        AllunFormattedAns = AllunFormattedAns + item.pageContent;
      });
    const PROMPT =
      "FOR Question : " +
      selectedText +
      " and with the given context as answer " +
      AllunFormattedAns +
      ", please give appropriate answer in HTML formate. the answer content is " +
      AllunFormattedAns;
    const PROMPT1 = `Generate an appropriate answer in HTML format for the question: "${selectedText}" using the provided context: "${AllunFormattedAns}". don't genertate any other content outside the answer.`;

    const AiModelResult = await chatSession.sendMessage(PROMPT);
    const FinalAns = AiModelResult.response
      .text()
      .replace("```", "")
      .replace("html", "")
      .replace("```", "");

    const AllText = editor.getHTML();
    editor.commands.setContent(
      AllText + "<p> <storong>" + FinalAns + "</strong> </p>"
    );
    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createBy: user?.primaryEmailAddress?.emailAddress,
    });
  };

  return (
    editor && (
      <>
        <div className="p-5 mt-12">
          <div className="control-group flex ">
            <div className="flex flex-col">
              <div className="button-group">
                <button
                  onClick={() => {
                    editor.chain().focus().toggleBold().run();
                    console.log("Bold button clicked, active:", editor.isActive("bold"));
                  }}
                  className={
                    editor.isActive("bold")
                      ? "bg-slate-300 rounded-lg p-2 mx-1 text-black hover:bg-slate-400 transition-colors"
                      : "rounded-lg p-2 mx-1 hover:bg-slate-200 hover:text-black transition-colors"
                  }
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleItalic().run();
                    console.log("Italic button clicked, active:", editor.isActive("italic"));
                  }}
                  className={
                    editor.isActive("italic")
                      ? "bg-slate-300 rounded-lg p-2 mx-1 text-black hover:bg-slate-400 transition-colors"
                      : "rounded-lg p-2 mx-1 hover:bg-slate-200 hover:text-black transition-colors"
                  }
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                    console.log("Bullet list button clicked, active:", editor.isActive("bulletList"));
                  }}
                  className={
                    editor.isActive("bulletList")
                      ? "bg-slate-300 rounded-lg p-2 mx-1 text-black hover:bg-slate-400 transition-colors"
                      : "rounded-lg p-2 mx-1 hover:bg-slate-200 hover:text-black transition-colors"
                  }
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                    console.log("Ordered list button clicked, active:", editor.isActive("orderedList"));
                  }}
                  className={
                    editor.isActive("orderedList")
                      ? "bg-slate-300 rounded-lg p-2 mx-1 text-black hover:bg-slate-400 transition-colors"
                      : "rounded-lg p-2 mx-1 hover:bg-slate-200 hover:text-black transition-colors"
                  }
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAiClick()}
                  className="p-2 mx-1 hover:text-blue-500 transition-colors"
                  title="AI Assistant"
                >
                  <SparklesIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default EditorExtensions;
