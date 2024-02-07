'use client'

import { useOptimistic, useTransition } from 'react'

import { Todo } from '@prisma/client'
import { updateTodoAction } from '@/app/actions'

import { formatDate } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from './ui/label'
import { toast } from 'sonner'

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTodo, updateTodo] = useOptimistic(
    todo,
    (
      todo,
      { isCompleted, updatedAt }: { isCompleted: boolean; updatedAt: Date }
    ) => {
      return { ...todo, isCompleted, updatedAt }
    }
  )

  async function handleChange(isCompleted: boolean) {
    const updatedAt = new Date()
    updateTodo({ isCompleted, updatedAt })

    const result = await updateTodoAction(optimisticTodo.id, isCompleted)

    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <li className='flex items-center gap-3'>
      <Checkbox
        id={optimisticTodo.id}
        className='peer'
        defaultChecked={optimisticTodo.isCompleted}
        checked={optimisticTodo.isCompleted}
        onCheckedChange={checked =>
          startTransition(() => handleChange(checked as boolean))
        }
      />
      <Label
        htmlFor={optimisticTodo.id}
        className='cursor-pointer peer-data-[state=checked]:text-gray-500 peer-data-[state=checked]:line-through'
      >
        {optimisticTodo.title}
      </Label>
      <span className='ml-auto text-sm text-gray-500 peer-data-[state=checked]:text-gray-500 peer-data-[state=checked]:line-through'>
        {formatDate(optimisticTodo.updatedAt)}
      </span>
    </li>
  )
}
