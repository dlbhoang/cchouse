import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { ETableName } from "@/lib/core/enum";
import { fileServices } from "@/services/api/services/fileServices";

if (typeof window !== "undefined") {
  require("tinymce/tinymce");
  require("tinymce/themes/silver");
  require("tinymce/plugins/advlist");
  require("tinymce/plugins/autolink");
  require("tinymce/plugins/lists");
  require("tinymce/plugins/link");
  require("tinymce/plugins/image");
  require("tinymce/plugins/charmap");
  require("tinymce/plugins/preview");
  require("tinymce/plugins/anchor");
  require("tinymce/plugins/searchreplace");
  require("tinymce/plugins/visualblocks");
  require("tinymce/plugins/code");
  require("tinymce/plugins/fullscreen");
  require("tinymce/plugins/insertdatetime");
  require("tinymce/plugins/media");
  require("tinymce/plugins/table");
  require("tinymce/plugins/code");
  require("tinymce/plugins/help");
  require("tinymce/plugins/wordcount");
}

const TinyEditor = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const editorRef = useRef<any>(null);
  const handleEditorChange = (content: string) => {
    onChange?.(content);
  };

  const options = {
    height: 500,
    menubar: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "anchor",
      "searchreplace",
      "visualblocks",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "help",
    ],
    toolbar:
      "undo redo | formatselect | " +
      "bold italic backcolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist table | " +
      "link image removeformat | preview help",
    content_style:
      "body { font-family:Roboto,Arial,sans-serif; font-size:14px }",

    file_picker_types: "file image media",
    file_picker_callback: (cb: any) => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");

      input.addEventListener("change", async (e: Event) => {
        if (e.target && editorRef?.current) {
          const file = (e.target as HTMLInputElement).files?.[0];

          if (file) {
            const isValid = fileServices.validateFileUpload({
              ...file,
              uid: file.name,
              name: file.name,
              size: file.size,
              type: file.type,
            });
            if (isValid) {
              const result = await fileServices.uploadOriginImages(
                [file],
                ETableName.News,
                false,
                false
              );
              cb(result.toString(), { title: file.name });
            }
          }
        }
      });

      input.click();
    },
  };

  return (
    <Editor
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      init={options}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TinyEditor;
