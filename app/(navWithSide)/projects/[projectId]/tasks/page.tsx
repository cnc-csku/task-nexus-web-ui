"use client";
import Header from '@/components/ui/Header'
import React from 'react'
import TasksTable from './_components/TasksTable'
import CreateTaskModal from './_components/CreateTaskModal'
import { useDisclosure } from '@heroui/modal'
import { Button } from '@heroui/button'

export default function ProjectTaskPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Header>
        Tasks
      </Header>
      <div className="flex mb-2 justify-between items-center">
        <div>
          <Button
            variant="flat"
            color="primary"
            onPress={onOpen}
          >
            Create Task
          </Button>
        </div>
      </div>
      <TasksTable />
      <CreateTaskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}
