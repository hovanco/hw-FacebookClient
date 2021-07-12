export interface Shift {
    id: string;
    name: string;
}

export interface Member {
    displayName: string;
    fullname: string;
    shift: Shift[];
    phoneNumber: string;
    birthday: string;
    address: string;
    status: boolean;
    shifts: Shift[];
}
