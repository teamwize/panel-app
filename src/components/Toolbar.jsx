export default function Toolbar ({ title, children }) {

  return (
    <div className="items-center pb-4 mb-4 border-b border-gray-300 dark:border-gray-700 flex flex-row justify-between">
      <h1 className="md:text-lg font-semibold pl-2 text-gray-900 dark:text-gray-300">{title}</h1>
      <div className="buttons md:w-fit pr-2">{children}</div>
    </div>
  )
}