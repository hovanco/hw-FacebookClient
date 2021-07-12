enum StatusLabel {
    OFF = 0,
    ON = 1,
}

export interface ILabel {
    _id: string;
    fbPageId: string;
    name: string;
    color: string;
    backgroundColor: string;
    order: number;
    status: StatusLabel;
}
