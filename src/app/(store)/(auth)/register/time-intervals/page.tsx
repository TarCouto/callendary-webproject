import { WeekdayScheduleForm } from '@/components/time-intervalsForm'

export default function TimeIntervalsPage() {
  return (
    <div className="h-screen px-4 py-0 antialiased">
      <div className="max-w-[540px] mx-auto flex flex-col">
        <div className="text-white">
          <h1 className="text-[24px]">Quase la!</h1>
          <p className="text-[13px] mt-3">
            defina o intervalo de horarios que voce esta disponivel em cada dia
            da semana.
          </p>
        </div>
        <div className="flex flex-col items-start my-5">
          <span className="text-sm text-gray-300 mb-1">Passo 2 de 4</span>
          <div className="flex w-full space-x-1">
            <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
            <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
            <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
            <div className="h-1 bg-gray-600 flex-1 rounded-md"></div>
          </div>
        </div>

        <WeekdayScheduleForm />
      </div>
    </div>
  )
}
