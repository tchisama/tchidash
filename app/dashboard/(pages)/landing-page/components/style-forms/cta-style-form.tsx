"use client"

import type { PageElement } from "../../types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CTAStyleFormProps {
  element: PageElement
  onUpdate: (updates: Partial<PageElement>) => void
}

export function CTAStyleForm({ element, onUpdate }: CTAStyleFormProps) {
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
          value={[style.titleFontSize || 28]}
          min={18}
          max={48}
          step={1}
          onValueChange={(value) => updateStyle("titleFontSize", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.titleFontSize || 28}px</div>
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
            value={style.titleColor || "#ffffff"}
            onChange={(e) => updateStyle("titleColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.titleColor || "#ffffff"}
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
            value={style.subtitleColor || "#f9fafb"}
            onChange={(e) => updateStyle("subtitleColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={style.subtitleColor || "#f9fafb"}
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
        <h3 className="font-medium mb-3">Button Styling</h3>

        <div className="space-y-2">
          <Label>Primary Button Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.buttonColor || "#ffffff"}
              onChange={(e) => updateStyle("buttonColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.buttonColor || "#ffffff"}
              onChange={(e) => updateStyle("buttonColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Primary Button Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.buttonTextColor || "#000000"}
              onChange={(e) => updateStyle("buttonTextColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.buttonTextColor || "#000000"}
              onChange={(e) => updateStyle("buttonTextColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Secondary Button Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.secondaryButtonColor || "transparent"}
              onChange={(e) => updateStyle("secondaryButtonColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.secondaryButtonColor || "transparent"}
              onChange={(e) => updateStyle("secondaryButtonColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Secondary Button Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.secondaryButtonTextColor || "#ffffff"}
              onChange={(e) => updateStyle("secondaryButtonTextColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.secondaryButtonTextColor || "#ffffff"}
              onChange={(e) => updateStyle("secondaryButtonTextColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Secondary Button Border Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.secondaryButtonBorderColor || "#ffffff"}
              onChange={(e) => updateStyle("secondaryButtonBorderColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.secondaryButtonBorderColor || "#ffffff"}
              onChange={(e) => updateStyle("secondaryButtonBorderColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-3">Container Styling</h3>

        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.backgroundColor || "#000000"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.backgroundColor || "#000000"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Background Overlay Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.backgroundOverlay?.replace(/[^#\d]/g, "#") || "#000000"}
              onChange={(e) => {
                // Convert hex to rgba with 0.5 opacity
                const hex = e.target.value
                const r = Number.parseInt(hex.slice(1, 3), 16)
                const g = Number.parseInt(hex.slice(3, 5), 16)
                const b = Number.parseInt(hex.slice(5, 7), 16)
                updateStyle("backgroundOverlay", `rgba(${r}, ${g}, ${b}, 0.5)`)
              }}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.backgroundOverlay || "rgba(0, 0, 0, 0.5)"}
              onChange={(e) => updateStyle("backgroundOverlay", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content Width (px)</Label>
          <Slider
            value={[style.contentWidth || 800]}
            min={400}
            max={1200}
            step={10}
            onValueChange={(value) => updateStyle("contentWidth", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.contentWidth || 800}px</div>
        </div>

        <div className="space-y-2">
          <Label>Padding (px)</Label>
          <Slider
            value={[style.padding || 48]}
            min={0}
            max={96}
            step={1}
            onValueChange={(value) => updateStyle("padding", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.padding || 48}px</div>
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
            value={[style.borderWidth || 0]}
            min={0}
            max={5}
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
    </div>
  )
}
