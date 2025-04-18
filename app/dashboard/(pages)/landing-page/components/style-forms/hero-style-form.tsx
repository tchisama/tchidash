"use client"

import type { PageElement } from "../../types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HeroStyleFormProps {
  element: PageElement
  onUpdate: (updates: Partial<PageElement>) => void
}

export function HeroStyleForm({ element, onUpdate }: HeroStyleFormProps) {
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
        <Label>Height (px)</Label>
        <Input
          type="number"
          value={style.height || 500}
          onChange={(e) => updateStyle("height", Number.parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Content Width (px)</Label>
        <Input
          type="number"
          value={style.contentWidth || 800}
          onChange={(e) => updateStyle("contentWidth", Number.parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Padding (px)</Label>
        <Slider
          value={[style.padding || 48]}
          min={0}
          max={100}
          step={4}
          onValueChange={(value) => updateStyle("padding", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.padding || 48}px</div>
      </div>

      <div className="space-y-2">
        <Label>Margin (px)</Label>
        <Slider
          value={[style.margin || 0]}
          min={0}
          max={100}
          step={4}
          onValueChange={(value) => updateStyle("margin", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.margin || 0}px</div>
      </div>

      <div className="space-y-2">
        <Label>Border Radius (px)</Label>
        <Slider
          value={[style.borderRadius || 0]}
          min={0}
          max={50}
          step={1}
          onValueChange={(value) => updateStyle("borderRadius", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.borderRadius || 0}px</div>
      </div>

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
        <Label>Background Size</Label>
        <Select value={style.backgroundSize || "cover"} onValueChange={(value) => updateStyle("backgroundSize", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select background size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Background Position</Label>
        <Select value={style.backgroundPosition || "center"} onValueChange={(value) => updateStyle("backgroundPosition", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select background position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
            <SelectItem value="left">Left</SelectItem>
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
        <Label>Title Font Size (px)</Label>
        <Input
          type="number"
          value={style.titleFontSize || 48}
          onChange={(e) => updateStyle("titleFontSize", Number.parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Title Font Weight</Label>
        <Select value={style.titleFontWeight || "bold"} onValueChange={(value) => updateStyle("titleFontWeight", value)}>
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
        <Label>Subtitle Font Size (px)</Label>
        <Input
          type="number"
          value={style.subtitleFontSize || 20}
          onChange={(e) => updateStyle("subtitleFontSize", Number.parseInt(e.target.value))}
        />
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
  )
} 