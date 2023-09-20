export default function Toolbar ({ title, children }) {

  return (
    <div className="items-center px-4 pb-4 mb-4 border-b border-gray-200 dark:border-gray-800 flex flex-row justify-between">
      <h1 className="md:text-xl text-lg font-semibold text-indigo-900 dark:text-indigo-200">{title}</h1>
      <div className="buttons md:w-fit">{children}</div>
    </div>
  )
}