export interface Carpark {
    user: string;
    host: string;
    location: {
        lattitude: string;
        longtitude: string;
    };
    date: Date;
    status: boolean;
}