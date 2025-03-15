import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { ZonedDateTime } from "@internationalized/date";


const taskTypes = ["Bug", "Feature", "Improvement"];
const priorities = ["Low", "Medium", "High", "Critical"];
const epicTasks = ["Epic 1", "Epic 2", "Epic 3"];

interface CreateTaskModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateTaskModal({ isOpen, onOpenChange }: CreateTaskModalProps) {
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [taskDescription, setTaskDescription] = useState<string>("");
    const [selectedTaskType, setSelectedTaskType] = useState(taskTypes[0]);
    const [selectedEpicTask, setSelectedEpicTask] = useState(epicTasks[0]);
    const [selectedPriority, setSelectedPriority] = useState(priorities[0]);
    const [startDate, setStartDate] = useState<ZonedDateTime | null>(null);
    const [dueDate, setDueDate] = useState<ZonedDateTime | null>(null);

    console.log("startDate", startDate);
    console.log("dueDate", dueDate);

    return (
        <Modal
            className="w-full max-w-3xl mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 mb-4"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            inert={false}
        >
            <ModalContent className="p-6">
                {(onClose) => (
                    <>
                        <ModalHeader>Create Task</ModalHeader>
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="Title"
                                placeholder="Enter task title"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                            />
                            <Input
                                label="Description"
                                placeholder="Enter task description"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <Select
                                    label="Task Type"
                                    selectedKeys={[selectedTaskType]}
                                    onChange={(e) => setSelectedTaskType(e.target.value || taskTypes[0])}
                                >
                                    {taskTypes.map((taskType) => (
                                        <SelectItem key={taskType} value={taskType}>
                                            {taskType}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Epic Task"
                                    selectedKeys={[selectedEpicTask]}
                                    onChange={(e) => setSelectedEpicTask(e.target.value || epicTasks[0])}
                                >
                                    {epicTasks.map((epic) => (
                                        <SelectItem key={epic} value={epic}>
                                            {epic}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Priority"
                                    selectedKeys={[selectedPriority]}
                                    onChange={(e) => setSelectedPriority(e.target.value || priorities[0])}
                                >
                                    {priorities.map((priority) => (
                                        <SelectItem key={priority} value={priority}>
                                            {priority}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <DatePicker
                                    label="Start Date"
                                    variant="bordered"
                                    value={startDate}
                                    onChange={(value) => setStartDate(value as ZonedDateTime)}
                                    showMonthAndYearPickers
                                    inert={false}
                                />
                                <DatePicker
                                    label="Due Date"
                                    variant="bordered"
                                    value={dueDate}
                                    onChange={(value) => setDueDate(value as ZonedDateTime)}
                                    showMonthAndYearPickers
                                    inert={false}
                                />
                            </div>
                        </div>
                        <ModalFooter className="mt-4 flex justify-end gap-2">
                            <Button onPress={onClose}>Cancel</Button>
                            <Button>Create Task</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
