"use client";

import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"; // Using shadcn sidebar component [^1]
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Pencil, Save } from "lucide-react";
import { PageCanvas } from "@/components/page-canvas";
import { ElementEditor } from "@/components/element-editor";
import { SectionLibrary } from "@/components/section-library";
import { ElementLibrary } from "@/components/element-library";

export type Section = {
  id: string;
  type: string;
  name: string;
  elements: Element[];
};

export type Element = {
  id: string;
  type: string;
  content: any;
  props?: any;
};

export function LandingPageBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [editMode, setEditMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );

  const addSection = (
    sectionType: string,
    sectionName: string,
    elements: Element[] = [],
  ) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: sectionType,
      name: sectionName,
      elements,
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setSelectedElementId(null);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section,
      ),
    );
  };

  const addElement = (
    sectionId: string,
    elementType: string,
    content: any = {},
    props: any = {},
  ) => {
    const newElement: Element = {
      id: `element-${Date.now()}`,
      type: elementType,
      content,
      props,
    };

    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, elements: [...section.elements, newElement] }
          : section,
      ),
    );

    setSelectedElementId(newElement.id);
  };

  const updateElement = (
    sectionId: string,
    elementId: string,
    updates: Partial<Element>,
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              elements: section.elements.map((element) =>
                element.id === elementId ? { ...element, ...updates } : element,
              ),
            }
          : section,
      ),
    );
  };

  const removeElement = (sectionId: string, elementId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              elements: section.elements.filter(
                (element) => element.id !== elementId,
              ),
            }
          : section,
      ),
    );

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    setSections(newSections);
  };

  const moveElement = (
    sectionId: string,
    fromIndex: number,
    toIndex: number,
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id !== sectionId) return section;

        const newElements = [...section.elements];
        const [movedElement] = newElements.splice(fromIndex, 1);
        newElements.splice(toIndex, 0, movedElement);

        return { ...section, elements: newElements };
      }),
    );
  };

  const selectedSection = sections.find(
    (section) => section.id === selectedSectionId,
  );
  const selectedElement = selectedSection?.elements.find(
    (element) => element.id === selectedElementId,
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center justify-between p-2">
              <h2 className="text-lg font-semibold">Page Builder</h2>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="elements">Elements</TabsTrigger>
              </TabsList>
              <TabsContent value="sections" className="mt-0">
                <SidebarGroup>
                  <SidebarGroupLabel>Add Sections</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SectionLibrary onAddSection={addSection} />
                  </SidebarGroupContent>
                </SidebarGroup>
              </TabsContent>
              <TabsContent value="elements" className="mt-0">
                <SidebarGroup>
                  <SidebarGroupLabel>Add Elements</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <ElementLibrary
                      onAddElement={(type, content, props) => {
                        if (selectedSectionId) {
                          addElement(selectedSectionId, type, content, props);
                        }
                      }}
                      disabled={!selectedSectionId}
                    />
                  </SidebarGroupContent>
                </SidebarGroup>
              </TabsContent>
            </Tabs>

            {sections.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Page Structure</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sections.map((section, index) => (
                      <SidebarMenuItem key={section.id}>
                        <SidebarMenuButton
                          isActive={selectedSectionId === section.id}
                          onClick={() => {
                            setSelectedSectionId(section.id);
                            setSelectedElementId(null);
                          }}
                        >
                          <LayoutGrid className="h-4 w-4" />
                          <span>{section.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Landing Page Builder</h1>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={editMode === "desktop" ? "default" : "outline"}
                    onClick={() => setEditMode("desktop")}
                  >
                    Desktop
                  </Button>
                  <Button
                    size="sm"
                    variant={editMode === "tablet" ? "default" : "outline"}
                    onClick={() => setEditMode("tablet")}
                  >
                    Tablet
                  </Button>
                  <Button
                    size="sm"
                    variant={editMode === "mobile" ? "default" : "outline"}
                    onClick={() => setEditMode("mobile")}
                  >
                    Mobile
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div
                className={`flex-1 overflow-auto p-4 ${
                  editMode === "desktop"
                    ? "max-w-full"
                    : editMode === "tablet"
                      ? "max-w-[768px] mx-auto"
                      : "max-w-[375px] mx-auto"
                }`}
              >
                <PageCanvas
                  sections={sections}
                  selectedSectionId={selectedSectionId}
                  selectedElementId={selectedElementId}
                  onSelectSection={setSelectedSectionId}
                  onSelectElement={setSelectedElementId}
                  onRemoveSection={removeSection}
                  onMoveSection={moveSection}
                  onMoveElement={moveElement}
                />
              </div>

              {(selectedSectionId || selectedElementId) && (
                <div className="w-80 border-l overflow-auto">
                  <ElementEditor
                    section={selectedSection}
                    element={selectedElement}
                    onUpdateSection={(updates) => {
                      if (selectedSectionId) {
                        updateSection(selectedSectionId, updates);
                      }
                    }}
                    onUpdateElement={(updates) => {
                      if (selectedSectionId && selectedElementId) {
                        updateElement(
                          selectedSectionId,
                          selectedElementId,
                          updates,
                        );
                      }
                    }}
                    onRemoveElement={() => {
                      if (selectedSectionId && selectedElementId) {
                        removeElement(selectedSectionId, selectedElementId);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
