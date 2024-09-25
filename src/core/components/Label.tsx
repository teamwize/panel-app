import {Badge} from "@/components/ui/badge";
import {LabelType} from "@/constants/types/enums";

type LabelProps = {
    type: LabelType;
    text?: string;
}

export default function Label({type, text}: LabelProps) {
    const colorClasses: { [key in LabelType]: string } = {
        [LabelType.GREEN]: 'bg-[#088636]',
        [LabelType.RED]: 'bg-[#ef4444]',
        [LabelType.BLUE]: 'bg-[#3b87f7]',
        [LabelType.YELLOW]: 'bg-yellow-500',
    };

    const labelClassNames = `text-white ${colorClasses[type]}`;

    return (
        <Badge className={labelClassNames}>{text}</Badge>
    )
}