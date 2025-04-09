"use client"

import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  id: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ id, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: value }} />
      <Input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-24 font-mono" />
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 p-0 overflow-hidden"
      />
    </div>
  )
}
