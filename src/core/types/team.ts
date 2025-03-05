export type TeamCompactResponse = {
    id: number;
    name: string;
}

export type TeamCreateRequest = {
    name: string;
    metadata: Record<string, object>;
    teamApprovers?: string[];
    approvalMode?: "ALL" | "ANY";
}

export type TeamResponse = {
    id: number;
    name: string;
    metadata: Record<string, object>;
}