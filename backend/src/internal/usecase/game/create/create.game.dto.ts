export interface InputCreateGameDto {
    name: string;
    consoleId: string;
    genreId: string;
    typeId: string;
    finishedDate: Date;
    finishedTime: number;
    betCondition: string;
    rating: number;
    isActive: boolean;
}

export interface OutputCreateGameDto {
    id: string;
}