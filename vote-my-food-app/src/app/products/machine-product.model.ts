export interface MachineProduct {
    id: string;
    name: string;
    manufacturer: string;
    shortDescription: string;
    description: string;
    price: number;
    category: Category;
    imageSet: ImageSet[];
    quantity: number;
    vote: VoteEnum;
}

export interface VotingHistory {
    name: string;
    shortDescription: string;
    vote: VoteEnum;
}

export enum VoteEnum {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE'
}

export interface Category {
    name: string;
}

export interface ImageSet {
    url: string;
}