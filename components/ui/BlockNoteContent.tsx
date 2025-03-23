import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface BlockNoteContentProps {
  content: string;
}

export default function BlockNoteContent({ content }: BlockNoteContentProps) {
  const [html, setHtml] = useState<string>("");

  const editor = useCreateBlockNote({
    initialContent: JSON.parse(content),
  });

  useEffect(() => {
    async function loadHtml() {
      const result = await editor.blocksToFullHTML(editor.document);
      setHtml(DOMPurify.sanitize(result));
    }
    loadHtml();
  }, [editor.document]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
