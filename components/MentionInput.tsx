"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/store/storeInfos";
import { Employee, Store } from "@/types/store";

export function MentionInput({
  input,
  setInput,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Store["employees"]>([]);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { store } = useStore();
  const [users, setUsers] = useState<Store["employees"]>([]);

  useEffect(() => {
    if (store) {
      setUsers(store.employees);
    }
  }, [store]);

  useEffect(() => {
    if (searchTerm && users) {
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    const words = value.split(" ");
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("@")) {
      setSearchTerm(lastWord.slice(1) ?? "");
      setMentionIndex(e.target.selectionStart - lastWord.length);
    } else {
      setSearchTerm("");
      setMentionIndex(-1);
    }
  };

  const selectSuggestion = (user: Employee) => {
    const before = input.slice(0, mentionIndex);
    const after = input.slice(mentionIndex + searchTerm.length + 1);
    const newInput = `${before}@${user.name} ${after}`;
    setInput(newInput);
    setSearchTerm("");
    setMentionIndex(-1);

    if (textareaRef.current) {
      const newCursorPosition = mentionIndex + user.name.length + 2;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        newCursorPosition,
        newCursorPosition,
      );
    }
  };

  return (
    <div className="relative w-full ">
      <textarea
        ref={textareaRef}
        className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 bg-slate-50 focus:ring-blue-500"
        rows={4}
        value={input}
        onChange={handleInput}
        placeholder="Type your message here. Use @ to mention users."
      />
      {suggestions && suggestions?.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 mt-1 border rounded-md shadow-lg bg-popover">
          <ScrollArea className="h-[200px]">
            <div className="p-2">
              <h4 className="mb-2 text-sm font-medium leading-none">
                Suggestions
              </h4>
              {suggestions.map((user) => (
                <button
                  key={user.id}
                  className="flex items-center w-full space-x-2 hover:bg-accent hover:text-accent-foreground py-1 px-2 rounded-md"
                  onClick={() => selectSuggestion(user)}
                  type="button"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.imageUrl ?? ""} />
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">@{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
