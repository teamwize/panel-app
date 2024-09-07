import { Badge } from "@/components/ui/badge";

type LabelProps = {
  type: 'GREEN' | 'RED' | 'BLUE' | 'YELLOW';
  text?: string;
  className?: string;
}

export default function Label({ type, text, className }: LabelProps) {
  let labelClassNames;

  switch (type.toUpperCase()) {
    case 'GREEN':
      labelClassNames = 'bg-[#088636]';
      break;
    case 'RED':
      labelClassNames = 'bg-[#ef4444]';
      break;
    case 'BLUE':
      labelClassNames = 'bg-[#3b87f7]';
      break;
    case 'YELLOW':
      labelClassNames = 'bg-yellow-500';
      break;
  }

  return (
    <Badge className={labelClassNames}>{text}</Badge>
  )
}