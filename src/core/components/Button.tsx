type ButtonProps = {
  onClick: () => void;
  type: 'button' | 'submit' | 'reset';
  isProcessing: boolean;
  text?: string;
  className?: string;
}

export default function Button({ onClick, type, isProcessing, text, className }: ButtonProps) {
  return (
    <div dir='rtl'>
      <button type={type} onClick={onClick}
        className={`${className} rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700`}>
        {isProcessing ? "Waiting ..." : text}
      </button>
    </div>
  )
}