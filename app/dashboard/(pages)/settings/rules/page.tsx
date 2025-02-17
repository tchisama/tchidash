"use client";

import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

import { sectionActions as sectionActionsGlobal } from "@/hooks/use-permission";

type Rule = {
  id: string;
  name: string;
  sections: {
    section: string;
    actions: string[];
  }[];
  storeId: string;
};

type SectionActions = {
  [key: string]: string[];
};

const sectionActions = sectionActionsGlobal as SectionActions;

export default function RulesPage() {
  const [newRule, setNewRule] = useState<Omit<Rule, "id">>({
    name: "",
    sections: [],
    storeId: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null); // Track the rule being edited
  const { storeId } = useStore();

  const { data: rules } = useQuery({
    queryKey: ["rules", storeId],
    queryFn: async () => {
      if (storeId) {
        const rulesData = getDocs(
          query(collection(db, "rules"), where("storeId", "==", storeId)),
        )
          .then((snapshot) => {
            return snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Rule[];
          })
          .catch((error) => {
            console.error("Error getting documents: ", error);
            return [];
          });
        return rulesData;
      } else {
        return [];
      }
    },
  });

  const handleAddRule = () => {
    if (newRule.name && newRule.sections.length > 0 && storeId) {
      addDoc(collection(db, "rules"), {
        storeId,
        name: newRule.name,
        sections: newRule.sections,
      });
      setNewRule({ name: "", sections: [], storeId: storeId });
    }
  };

  const handleEditRule = () => {
    if (
      editingRuleId &&
      newRule.name &&
      newRule.sections.length > 0 &&
      storeId
    ) {
      updateDoc(doc(db, "rules", editingRuleId), {
        name: newRule.name,
        sections: newRule.sections,
      }).then(() => {
        setNewRule({ name: "", sections: [], storeId: storeId });
        setIsEditing(false);
        setEditingRuleId(null);
      });
    }
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Are you sure you want to delete this rule?"))
      deleteDoc(doc(db, "rules", id));
  };

  const handleSectionChange = (section: string, isChecked: boolean) => {
    if (isChecked) {
      setNewRule({
        ...newRule,
        sections: [...newRule.sections, { section, actions: [] }],
      });
    } else {
      setNewRule({
        ...newRule,
        sections: newRule.sections.filter((s) => s.section !== section),
      });
    }
  };

  const handleActionChange = (
    section: string,
    action: string,
    isChecked: boolean,
  ) => {
    setNewRule({
      ...newRule,
      sections: newRule.sections.map((s) => {
        if (s.section === section) {
          if (isChecked) {
            return { ...s, actions: [...s.actions, action] };
          } else {
            return { ...s, actions: s.actions.filter((a) => a !== action) };
          }
        }
        return s;
      }),
    });
  };

  const handleEditClick = (rule: Rule) => {
    setIsEditing(true);
    setEditingRuleId(rule.id);
    setNewRule({
      name: rule.name,
      sections: rule.sections,
      storeId: rule.storeId,
    });
  };

  return (
    <div className="container mx-auto p-4 flex gap-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Rules Management</h1>

        <div className="mb-8 bg-white p-4 rounded-xl border">
          <h2 className="text-xl font-semibold mb-2">Current Rules</h2>
          <Accordion type="single" className="w-full">
            {rules &&
              rules.map((rule) => (
                <AccordionItem value={rule.name} key={rule.id}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">{rule.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditClick(rule)}
                          variant={"ghost"}
                          className=""
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteRule(rule.id)}
                          variant={"ghost"}
                          className=""
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 space-y-2">
                      {rule.sections.map((section) => (
                        <div key={section.section} className="flex gap-4">
                          <h3 className="font-semibold">
                            {section.section.charAt(0).toUpperCase() +
                              section.section.slice(1)}
                          </h3>
                          <ul className="flex gap-2">
                            {section.actions.map((action) => (
                              <li key={action}>
                                {action.charAt(0).toUpperCase() +
                                  action.slice(1)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border min-w-[400px]">
        <h2 className="text-xl font-semibold mb-2">
          {isEditing ? "Edit Rule" : "Create New Rule"}
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              placeholder="Enter rule name"
            />
          </div>

          <Accordion type="multiple" className="w-full">
            {Object.keys(sectionActions).map((section) => (
              <AccordionItem value={section} key={section}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center w-full space-x-2">
                    <Checkbox
                      id={`section-${section}`}
                      checked={newRule.sections.some(
                        (s) => s.section === section,
                      )}
                      onCheckedChange={(checked) =>
                        handleSectionChange(section, checked === true)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Label
                      htmlFor={`section-${section}`}
                      className="text-sm font-medium flex-1 text-left leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Label>
                    <Button
                      variant="ghost"
                      className="text-xs ml-auto"
                      onClick={() =>
                        setNewRule({
                          ...newRule,
                          sections: [
                            ...newRule.sections,
                            {
                              section,
                              actions: sectionActions[section],
                            },
                          ],
                        })
                      }
                    >
                      all
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6 space-y-2">
                    {sectionActions[section].map((action) => (
                      <div key={action} className="flex items-center space-x-2">
                        <Checkbox
                          id={`action-${section}-${action}`}
                          checked={newRule.sections.some(
                            (s) =>
                              s.section === section &&
                              s.actions.includes(action),
                          )}
                          onCheckedChange={(checked) =>
                            handleActionChange(
                              section,
                              action,
                              checked === true,
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Label
                          htmlFor={`action-${section}-${action}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button
            onClick={isEditing ? handleEditRule : handleAddRule}
            className="mt-4"
          >
            {isEditing ? (
              <Edit className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isEditing ? "Edit Rule" : "Create Rule"}
          </Button>
        </div>
      </div>
    </div>
  );
}
