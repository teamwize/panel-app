export default function Button({onClick, type, isProcessing, text, className}) {
  return (
    <div dir='rtl'>
      <button type={type} onClick={onClick} className={`${className} rounded-xl bg-indigo-600 py-2 px-3 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700`}>
        {isProcessing ? "Waiting ..." : text}
      </button>
    </div>
  )
}
