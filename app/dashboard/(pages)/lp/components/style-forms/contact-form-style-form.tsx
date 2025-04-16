"use client"

import type { PageElement } from "@/types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactFormStyleFormProps {
  element: PageElement
  onUpdate: (updates: Partial<PageElement>) => void
}

export function ContactFormStyleForm({ element, onUpdate }: ContactFormStyleFormProps) {
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
        <Label>Title Font Size (px)</Label>
        <Slider
          value={[style.titleFontSize || 24]}
          min={16}
          max={36}
          step={1}
          onValueChange={(value) => updateStyle("titleFontSize", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.titleFontSize || 24}px</div>
      </div>

      <div className="space-y-2">
        <Label>Title Font Weight</Label>
        <Select
          value={style.titleFontWeight || "bold"}
          onValueChange={(value) => updateStyle("titleFontWeight", value)}
        >
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
        <Label>Title Alignment</Label>
        <Select value={style.titleAlign || "center"} onValueChange={(value) => updateStyle("titleAlign", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Title Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.titleColor || "#000000"}
            onChange={(e) => updateStyle("titleColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.titleColor || "#000000"}
            onChange={(e) => updateStyle("titleColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Subtitle Font Size (px)</Label>
        <Slider
          value={[style.subtitleFontSize || 16]}
          min={12}
          max={24}
          step={1}
          onValueChange={(value) => updateStyle("subtitleFontSize", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.subtitleFontSize || 16}px</div>
      </div>

      <div className="space-y-2">
        <Label>Subtitle Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.subtitleColor || "#6b7280"}
            onChange={(e) => updateStyle("subtitleColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.subtitleColor || "#6b7280"}
            onChange={(e) => updateStyle("subtitleColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Button Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.buttonColor || "#000000"}
            onChange={(e) => updateStyle("buttonColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.buttonColor || "#000000"}
            onChange={(e) => updateStyle("buttonColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Button Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.buttonTextColor || "#ffffff"}
            onChange={(e) => updateStyle("buttonTextColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.buttonTextColor || "#ffffff"}
            onChange={(e) => updateStyle("buttonTextColor", e.target.value)}
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
          value={[style.padding || 24]}
          min={0}
          max={48}
          step={1}
          onValueChange={(value) => updateStyle("padding", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.padding || 24}px</div>
      </div>

      <div className="space-y-2">
        <Label>Margin (px)</Label>
        <Slider
          value={[style.margin || 0]}
          min={0}
          max={48}
          step={1}
          onValueChange={(value) => updateStyle("margin", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.margin || 0}px</div>
      </div>

      <div className="space-y-2">
        <Label>Border Radius (px)</Label>
        <Slider
          value={[style.borderRadius || 8]}
          min={0}
          max={20}
          step={1}
          onValueChange={(value) => updateStyle("borderRadius", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.borderRadius || 8}px</div>
      </div>

      <div className="space-y-2">
        <Label>Border Width (px)</Label>
        <Slider
          value={[style.borderWidth || 1]}
          min={0}
          max={5}
          step={1}
          onValueChange={(value) => updateStyle("borderWidth", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.borderWidth || 1}px</div>
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
