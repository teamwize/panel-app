export default function Toolbar ({ title, children }) {

  return (
    <div className="items-center px-4 pb-4 mb-4 border-b border-gray-300 dark:border-gray-700 flex flex-row justify-between">
      <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">{title}</h1>
      <div className="buttons md:w-fit">{children}</div>
    </div>
  )
}