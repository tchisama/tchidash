"use client"

import type { PageElement } from "@/types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ParagraphStyleFormProps {
  element: PageElement
  onUpdate: (updates: Partial<PageElement>) => void
}

export function ParagraphStyleForm({ element, onUpdate }: ParagraphStyleFormProps) {
  const { style } = element

  const updateStyle = (key: string, value: any) => {
    onUpdate({
      style: {
        ...element.style,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Font Size (px)</Label>
        <Slider
          value={[style.fontSize || 16]}
          min={12}
          max={24}
          step={1}
          onValueChange={(value) => updateStyle("fontSize", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.fontSize || 16}px</div>
      </div>

      <div className="space-y-2">
        <Label>Font Weight</Label>
        <Select value={style.fontWeight || "normal"} onValueChange={(value) => updateStyle("fontWeight", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select font weight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="semibold">Semibold</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Text Align</Label>
        <Select value={style.textAlign || "left"} onValueChange={(value) => updateStyle("textAlign", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select text alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="justify">Justify</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Line Height</Label>
        <Slider
          value={[Number.parseFloat(style.lineHeight) || 1.5]}
          min={1}
          max={2}
          step={0.1}
          onValueChange={(value) => updateStyle("lineHeight", value[0].toString())}
        />
        <div className="text-right text-sm text-muted-foreground">{style.lineHeight || 1.5}</div>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.textColor || "#000000"}
            onChange={(e) => updateStyle("textColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.textColor || "#000000"}
            onChange={(e) => updateStyle("textColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.backgroundColor || "#ffffff"}
            onChange={(e) => updateStyle("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.backgroundColor || "#ffffff"}
            onChange={(e) => updateStyle("backgroundColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Padding (px)</Label>
        <Slider
          value={[style.padding || 0]}
          min={0}
          max={50}
          step={1}
          onValueChange={(value) => updateStyle("padding", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.padding || 0}px</div>
      </div>

      <div className="space-y-2">
        <Label>Margin (px)</Label>
        <Slider
          value={[style.margin || 0]}
          min={0}
          max={50}
          step={1}
          onValueChange={(value) => updateStyle("margin", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.margin || 0}px</div>
      </div>

      <div className="space-y-2">
        <Label>Border Width (px)</Label>
        <Slider
          value={[style.borderWidth || 0]}
          min={0}
          max={10}
          step={1}
          onValueChange={(value) => updateStyle("borderWidth", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.borderWidth || 0}px</div>
      </div>

      {style.borderWidth > 0 && (
        <div className="space-y-2">
          <Label>Border Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.borderColor || "#e5e7eb"}
              onChange={(e) => updateStyle("borderColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.borderColor || "#e5e7eb"}
              onChange={(e) => updateStyle("borderColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  )
}
