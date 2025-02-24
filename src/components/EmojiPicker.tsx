import React, {useMemo, useRef, useState} from 'react';
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ChevronDown, Search} from "lucide-react";

interface Emoji {
    symbol: string;
    name: string;
    keywords: string[];
}

interface EmojiPickerProps {
    onEmojiSelect?: (emoji: Emoji) => void;
    defaultEmoji?: Emoji | null;
}

export const emojis: Emoji[] = [
    // Vacation & Travel
    {symbol: "🏖️", name: "Beach", keywords: ["vacation", "summer", "holiday", "beach"]},
    {symbol: "🌴", name: "Palm Tree", keywords: ["vacation", "tropical", "beach"]},
    {symbol: "✈️", name: "Airplane", keywords: ["travel", "vacation", "flight"]},
    {symbol: "🏝️", name: "Desert Island", keywords: ["vacation", "tropical", "holiday"]},
    {symbol: "🏕️", name: "Camping", keywords: ["outdoor", "vacation", "nature"]},
    {symbol: "⛰️", name: "Mountain", keywords: ["hiking", "outdoor", "adventure"]},
    {symbol: "🚗", name: "Car", keywords: ["travel", "road trip", "driving"]},
    {symbol: "🏨", name: "Hotel", keywords: ["accommodation", "stay", "vacation"]},
    {symbol: "🎡", name: "Theme Park", keywords: ["fun", "vacation", "entertainment"]},
    {symbol: "🏰", name: "Castle", keywords: ["sightseeing", "tourism", "vacation"]},

    // Health & Medical
    {symbol: "🤒", name: "Sick Face", keywords: ["sick", "illness", "medical"]},
    {symbol: "🤧", name: "Sneezing", keywords: ["sick", "cold", "allergy"]},
    {symbol: "🤢", name: "Nauseous", keywords: ["sick", "illness", "unwell"]},
    {symbol: "🏥", name: "Hospital", keywords: ["medical", "health", "emergency"]},
    {symbol: "💊", name: "Medicine", keywords: ["health", "medical", "treatment"]},
    {symbol: "🩺", name: "Stethoscope", keywords: ["doctor", "medical", "health"]},
    {symbol: "🦠", name: "Virus", keywords: ["sick", "covid", "illness"]},
    {symbol: "🤕", name: "Injury", keywords: ["hurt", "medical", "bandage"]},

    // Family & Personal
    {symbol: "👶", name: "Baby", keywords: ["parental", "family", "newborn"]},
    {symbol: "👨‍👩‍👦", name: "Family", keywords: ["parental", "family", "personal"]},
    {symbol: "💑", name: "Couple", keywords: ["marriage", "relationship", "personal"]},
    {symbol: "👰", name: "Wedding", keywords: ["marriage", "celebration", "personal"]},
    {symbol: "🤰", name: "Pregnant", keywords: ["maternity", "parental", "family"]},
    {symbol: "👨‍👩‍👧‍👦", name: "Extended Family", keywords: ["family", "personal", "home"]},

    // Education & Work
    {symbol: "🎓", name: "Graduation", keywords: ["education", "study", "school"]},
    {symbol: "📚", name: "Books", keywords: ["study", "education", "learning"]},
    {symbol: "👨‍🏫", name: "Teacher", keywords: ["education", "training", "learning"]},
    {symbol: "💻", name: "Laptop", keywords: ["work", "remote", "computer"]},
    {symbol: "🏡", name: "Home Office", keywords: ["remote", "work", "home"]},
    {symbol: "📝", name: "Study", keywords: ["education", "exam", "learning"]},

    // Activities & Hobbies
    {symbol: "⚽", name: "Sports", keywords: ["activity", "exercise", "game"]},
    {symbol: "🎨", name: "Art", keywords: ["creative", "hobby", "personal"]},
    {symbol: "🎭", name: "Performance", keywords: ["art", "entertainment", "culture"]},
    {symbol: "🎮", name: "Gaming", keywords: ["entertainment", "hobby", "recreation"]},
    {symbol: "🎪", name: "Circus", keywords: ["entertainment", "show", "performance"]},
    {symbol: "🎯", name: "Target", keywords: ["goal", "aim", "focus"]},

    // Other
    {symbol: "🧘", name: "Meditation", keywords: ["wellness", "mental health", "relaxation"]},
    {symbol: "🏆", name: "Achievement", keywords: ["success", "award", "winning"]},
    {symbol: "🎉", name: "Celebration", keywords: ["party", "event", "special"]},
    {symbol: "⭐", name: "Special", keywords: ["star", "important", "priority"]},
    {symbol: "🔋", name: "Energy", keywords: ["power", "recharge", "break"]}
];

export default function EmojiPicker({onEmojiSelect, defaultEmoji = null}: EmojiPickerProps) {
    const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(defaultEmoji);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const triggerRef = useRef<HTMLDivElement>(null);

    const filteredEmojis = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return emojis;

        return emojis.filter(emoji =>
            emoji.name.toLowerCase().includes(query) ||
            emoji.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    const handleEmojiSelect = (emoji: Emoji): void => {
        setSelectedEmoji(emoji);
        onEmojiSelect?.(emoji);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    ref={triggerRef}
                    onClick={() => setOpen(!open)}
                    className='inline-flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent hover:text-accent-foreground'
                >
                    <div className="flex-1 flex items-center gap-2">
                        {selectedEmoji ? (
                            <span className="text-lg">{selectedEmoji.symbol}</span>
                        ) : (
                            <span className="">Symbol</span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50"/>
                </div>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="p-0 w-[var(--trigger-width)] max-w-[calc(100vw-2rem)]"
                style={{'--trigger-width': triggerRef.current ? `${triggerRef.current.offsetWidth}px` : 'auto'} as React.CSSProperties}
            >
                <div className="p-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search symbols..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div
                        className="grid grid-cols-6 gap-2 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                        {filteredEmojis.map((emoji) => (
                            <Button
                                key={emoji.name}
                                variant="ghost"
                                className="h-10 text-xl hover:bg-slate-100 transition-colors"
                                onClick={() => handleEmojiSelect(emoji)}
                                title={emoji.name}
                                type="button"
                            >
                                {emoji.symbol}
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};