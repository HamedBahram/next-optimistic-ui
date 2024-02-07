'use server'

import { createTodo, updateTodo } from '@/lib/todos'
import { revalidatePath } from 'next/cache'

export async function createTodoAction(title: string) {
  try {
    await createTodo(title)
  } catch (error: any) {
    return { error: error?.message || 'Failed to add todo.' }
  } finally {
    revalidatePath('/')
  }
}

export async function updateTodoAction(id: string, isCompleted: boolean) {
  try {
    await updateTodo(id, isCompleted)
  } catch (error: any) {
    return { error: error?.message || 'Failed to update todo.' }
  } finally {
    revalidatePath('/')
  }
}
