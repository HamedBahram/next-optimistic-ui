import { getTodos } from '@/lib/todos'
import Todos from '@/components/todos'

export default async function Page() {
  const { todos = [] } = await getTodos()

  return (
    <section className='py-20'>
      <div className='container md:max-w-2xl'>
        <h1 className='mb-10 bg-gray-100 px-2 font-serif text-3xl font-bold'>
          Todos
        </h1>

        <Todos todos={todos} />
      </div>
    </section>
  )
}
