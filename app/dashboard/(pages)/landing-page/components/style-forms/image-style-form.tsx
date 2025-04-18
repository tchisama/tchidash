"use client"

import type { PageElement } from "../../types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FilesystemExplorer from "@/components/FilesystemExplorer"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface ImageStyleFormProps {
  element: PageElement
  onUpdate: (updates: Partial<PageElement>) => void
}

export function ImageStyleForm({ element, onUpdate }: ImageStyleFormProps) {
  const { style, content } = element

  const updateStyle = (key: string, value: unknown) => {
    onUpdate({
      style: {
        ...element.style,
        [key]: value,
      },
    })
  }

  const updateContent = (key: string, value: unknown) => {
    onUpdate({
      content: {
        ...element.content,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>
        <FilesystemExplorer
          callback={(url) => {
            updateContent("src", url)
          }}
        >
          <Button variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {content.src ? "Change Image" : "Upload Image"}
          </Button>
        </FilesystemExplorer>
      </div>

      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input
          type="text"
          value={content.alt || ""}
          onChange={(e) => updateContent("alt", e.target.value)}
          placeholder="Image description"
        />
      </div>

      <div className="space-y-2">
        <Label>Height (px)</Label>
        <Input
          type="number"
          value={style.height || 300}
          onChange={(e) => updateStyle("height", Number.parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Max Width (px)</Label>
        <Input
          type="number"
          value={style.maxWidth || 600}
          onChange={(e) => updateStyle("maxWidth", Number.parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Object Fit</Label>
        <Select value={style.objectFit || "cover"} onValueChange={(value) => updateStyle("objectFit", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select object fit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Border Radius (px)</Label>
        <Slider
          value={[style.imageBorderRadius || 0]}
          min={0}
          max={50}
          step={1}
          onValueChange={(value) => updateStyle("imageBorderRadius", value[0])}
        />
        <div className="text-right text-sm text-muted-foreground">{style.imageBorderRadius || 0}px</div>
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
