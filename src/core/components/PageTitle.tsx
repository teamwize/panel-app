import { ReactNode } from "react"

type ToolbarProps = {
  title: string;
  children?: ReactNode
}

export default function PageTitle({ title, children }: ToolbarProps) {
  return (
    <div className="flex flex-wrap justify-between text-lg font-medium px-4 pt-4">
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      {children}
    </div>
  )
}