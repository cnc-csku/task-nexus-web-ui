import { Task } from "@/interfaces/Task";
import { Listbox, ListboxItem } from "@heroui/listbox";
import React, { Dispatch, Key, SetStateAction } from "react";
import type { Selection } from "@heroui/table";
import { Button } from "@heroui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { formatDateAsMMMDDYYYY } from "@/utils/timeUtils";
import { useDisclosure } from "@heroui/modal";
import CreateEpicModal from "./CreateEpicModal";

export interface SideEpicsProps {
  projectId: string;
  epics: Task[];
  selectedEpic: string | null;
  setSelectedEpic: Dispatch<SetStateAction<string | null>>;
}

export default function SideEpics({
  epics,
  selectedEpic,
  setSelectedEpic,
  projectId,
}: SideEpicsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSelectEpic = (keys: Selection): void => {
    const data = keys as Set<Key>;

    setSelectedEpic(data.values().next().value as string);
  };

  return (
    <>
      <CreateEpicModal
        projectId={projectId}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <h1 className=" mb-4 px-1 flex justify-between items-center">
        <div className="text-xl font-semibold">Epics</div>
        <Button
          isIconOnly
          variant="light"
          color="primary"
          onPress={onOpen}
        >
          <AiOutlinePlus className="text-lg" />
        </Button>
      </h1>
      <Listbox
        aria-label="epics"
        inputMode="text"
        selectionMode="single"
        onSelectionChange={onSelectEpic}
        emptyContent="No epics"
      >
        <>
          <ListboxItem
            key="WITH_NO_EPIC"
            textValue={"WITH_NO_EPIC"}
            className={"border py-3 px-4 mb-2"}
          >
            <div>Task without epic</div>
          </ListboxItem>
          {epics.map((epic) => (
            <ListboxItem
              key={epic.id}
              textValue={epic.title}
              className={"border py-3 px-4 mb-2"}
            >
              <div>{epic.title}</div>
              {selectedEpic === epic.id && (
                <div className="text-xs">
                  <div>
                    <span>Start Date:</span>{" "}
                    {epic.startDate ? (
                      <span className="">{formatDateAsMMMDDYYYY(epic.startDate)}</span>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </div>
                  <div>
                    <span>Due Date:</span>{" "}
                    {epic.dueDate ? (
                      <span className="">{formatDateAsMMMDDYYYY(epic.dueDate)}</span>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </div>
                </div>
              )}
            </ListboxItem>
          ))}
        </>
      </Listbox>
      <Button
        variant="light"
        color="primary"
        onPress={onOpen}
        fullWidth
        className="justify-start"
        startContent={<AiOutlinePlus className="text-lg" />}
      >
        Create Epic
      </Button>
    </>
  );
}
