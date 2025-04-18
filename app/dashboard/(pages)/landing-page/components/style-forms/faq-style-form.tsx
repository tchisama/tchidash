"use client"

import type { PageElement } from "../../types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FAQStyleFormProps {
  element: PageElement
  onUpdate: (updates: Partial<PageElement>) => void
}

export function FAQStyleForm({ element, onUpdate }: FAQStyleFormProps) {
  const { style } = element

  const updateStyle = (key: string, value: unknown) => {
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
        <Label>Subtitle Alignment</Label>
        <Select value={style.subtitleAlign || "center"} onValueChange={(value) => updateStyle("subtitleAlign", value)}>
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

      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-3">FAQ Item Styling</h3>

        <div className="space-y-2">
          <Label>Question Font Size (px)</Label>
          <Slider
            value={[style.questionFontSize || 16]}
            min={14}
            max={24}
            step={1}
            onValueChange={(value) => updateStyle("questionFontSize", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.questionFontSize || 16}px</div>
        </div>

        <div className="space-y-2">
          <Label>Question Font Weight</Label>
          <Select
            value={style.questionFontWeight || "medium"}
            onValueChange={(value) => updateStyle("questionFontWeight", value)}
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
          <Label>Question Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.questionColor || "#000000"}
              onChange={(e) => updateStyle("questionColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.questionColor || "#000000"}
              onChange={(e) => updateStyle("questionColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Answer Font Size (px)</Label>
          <Slider
            value={[style.answerFontSize || 14]}
            min={12}
            max={18}
            step={1}
            onValueChange={(value) => updateStyle("answerFontSize", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.answerFontSize || 14}px</div>
        </div>

        <div className="space-y-2">
          <Label>Answer Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.answerColor || "#6b7280"}
              onChange={(e) => updateStyle("answerColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.answerColor || "#6b7280"}
              onChange={(e) => updateStyle("answerColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Item Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.itemBgColor || "#f9fafb"}
              onChange={(e) => updateStyle("itemBgColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.itemBgColor || "#f9fafb"}
              onChange={(e) => updateStyle("itemBgColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Item Border Radius (px)</Label>
          <Slider
            value={[style.itemBorderRadius || 8]}
            min={0}
            max={16}
            step={1}
            onValueChange={(value) => updateStyle("itemBorderRadius", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.itemBorderRadius || 8}px</div>
        </div>

        <div className="space-y-2">
          <Label>Item Padding (px)</Label>
          <Slider
            value={[style.itemPadding || 16]}
            min={8}
            max={32}
            step={1}
            onValueChange={(value) => updateStyle("itemPadding", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.itemPadding || 16}px</div>
        </div>

        <div className="space-y-2">
          <Label>Space Between Items (px)</Label>
          <Slider
            value={[style.itemSpacing || 8]}
            min={4}
            max={24}
            step={1}
            onValueChange={(value) => updateStyle("itemSpacing", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.itemSpacing || 8}px</div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-3">Container Styling</h3>

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
            value={[style.margin || 16]}
            min={0}
            max={48}
            step={1}
            onValueChange={(value) => updateStyle("margin", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.margin || 16}px</div>
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
    </div>
  )
}
