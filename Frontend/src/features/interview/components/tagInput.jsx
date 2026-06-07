import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function TagInput({
  tags = [],
  setTags,
  placeholder = "Type and press Enter",
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim();

    if (!value) return;

    if (!tags.includes(value)) {
      setTags([...tags, value]);
    }

    setInput("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }

    if (
      e.key === "Backspace" &&
      input === "" &&
      tags.length > 0
    ) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="border rounded-lg p-3 min-h-[52px] flex flex-wrap gap-2 items-center">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {tag}

          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[150px]"
      />
    </div>
  );
}