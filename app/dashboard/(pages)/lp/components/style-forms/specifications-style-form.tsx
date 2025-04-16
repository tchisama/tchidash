"use client"

import type { PageElement } from "@/types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpecificationsStyleFormProps {
  element: PageElement
  onUpdate: (updates: Partial<PageElement>) => void
}

export function SpecificationsStyleForm({ element, onUpdate }: SpecificationsStyleFormProps) {
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
        <h3 className="font-medium mb-3">Table Styling</h3>

        <div className="space-y-2">
          <Label>Row Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.rowBgColor || "#f9fafb"}
              onChange={(e) => updateStyle("rowBgColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.rowBgColor || "#f9fafb"}
              onChange={(e) => updateStyle("rowBgColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Alternate Row Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.altRowBgColor || "#ffffff"}
              onChange={(e) => updateStyle("altRowBgColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.altRowBgColor || "#ffffff"}
              onChange={(e) => updateStyle("altRowBgColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Name Font Size (px)</Label>
          <Slider
            value={[style.nameFontSize || 14]}
            min={12}
            max={18}
            step={1}
            onValueChange={(value) => updateStyle("nameFontSize", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.nameFontSize || 14}px</div>
        </div>

        <div className="space-y-2">
          <Label>Name Font Weight</Label>
          <Select
            value={style.nameFontWeight || "medium"}
            onValueChange={(value) => updateStyle("nameFontWeight", value)}
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
          <Label>Name Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.nameColor || "#000000"}
              onChange={(e) => updateStyle("nameColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.nameColor || "#000000"}
              onChange={(e) => updateStyle("nameColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Value Font Size (px)</Label>
          <Slider
            value={[style.valueFontSize || 14]}
            min={12}
            max={18}
            step={1}
            onValueChange={(value) => updateStyle("valueFontSize", value[0])}
          />
          <div className="text-right text-sm text-muted-foreground">{style.valueFontSize || 14}px</div>
        </div>

        <div className="space-y-2">
          <Label>Value Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.valueColor || "#6b7280"}
              onChange={(e) => updateStyle("valueColor", e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={style.valueColor || "#6b7280"}
              onChange={(e) => updateStyle("valueColor", e.target.value)}
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
