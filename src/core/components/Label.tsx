type LabelProps = {
  type: 'GREEN' | 'RED' | 'BLUE' | 'YELLOW';
  text?: string;
  className?: string;
}

export default function Label({ type, text, className }: LabelProps) {
  let labelClassNames = className + " text-xs py-0.5 px-2 rounded-2xl w-fit ";

  switch (type.toUpperCase()) {
    case 'GREEN':
      labelClassNames += 'text-green-500 bg-green-200 dark:bg-green-900 dark:text-green-300';
      break;
    case 'RED':
      labelClassNames += 'text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300';
      break;
    case 'BLUE':
      labelClassNames += 'text-blue-500 bg-blue-200 dark:bg-blue-900 dark:text-blue-300';
      break;
    case 'YELLOW':
      labelClassNames += 'text-yellow-500 bg-yellow-100 dark:bg-yellow-600 dark:text-yellow-200';
      break;
  }

  return (
    <p className={labelClassNames}>{text}</p>
  )
}