export default function PageToolbar ({ title, children }) {

  return (
    <div className="items-center pb-4 mb-4 border-b border-gray-300 flex flex-row justify-between">
      <h1 className="md:text-2xl font-semibold md:font-bold pl-2">{title}</h1>
      <div className="buttons md:w-fit pr-2">{children}</div>
    </div>
  )
}