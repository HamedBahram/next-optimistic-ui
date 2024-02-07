'use client'

import { useFormStatus } from 'react-dom'
import { useOptimistic, useRef } from 'react'

import { toast } from 'sonner'
import type { Todo } from '@prisma/client'
import { createTodoAction } from '@/app/actions'

import { Input } from '@/components/ui/input'
import TodoItem from '@/components/todo-item'
import { Button } from '@/components/ui/button'

export default function Todos({ todos }: { todos: Todo[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => {
      return [...state, newTodo]
    }
  )

  async function action(data: FormData) {
    const title = data.get('title')
    if (typeof title !== 'string' || !title) return

    const newTodo = {
      id: crypto.randomUUID(),
      title,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    formRef.current?.reset()
    addOptimisticTodo(newTodo)
    const result = await createTodoAction(title)

    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div>
      <form ref={formRef} action={action} className='flex'>
        <Input type='text' name='title' placeholder='Add a new todo' />
        <SubmitButton />
      </form>

      <h2 className='mt-10 border-b pb-2 font-serif text-lg font-medium'>
        Previous todos:
      </h2>

      <ul className='mt-4 flex flex-col gap-1'>
        {optimisticTodos?.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      </ul>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' className='ml-2' disabled={pending}>
      Add Todo
    </Button>
  )
}
