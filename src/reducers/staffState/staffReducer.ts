import types from './staffType';

export interface IStaff {
    _id: string;
    role: number;
    storeId: string;
    userId: string;
    name: string;
}

export interface IStaffState {
    loading: boolean;
    staffs: IStaff[];
}

export interface IAction {
    type: string;
    payload: any;
}

const initialState = {
    loading: true,
    staffs: [],
};

const staffReducer = (state: IStaffState = initialState, action: IAction): IStaffState => {
    switch (action.type) {
        case types.LOADING:
            return { ...state, loading: true };
        case types.LOAD_STAFF_SUCCESS:
            return { ...state, staffs: action.payload, loading: false };

        case types.ADD_STAFF: {
            const newStaffs = [action.payload, ...state.staffs];

            return { ...state, staffs: newStaffs };
        }

        case types.UPDATE_STAFF: {
            const staffs = state.staffs.map((staff: any) => {
                if (staff._id === action.payload._id) return { ...staff, ...action.payload };
                return staff;
            });
            return { ...state, staffs };
        }

        case types.DELETE_STAFF: {
            const staffs = state.staffs.filter((staff: any) => staff._id !== action.payload);

            return { ...state, staffs };
        }

        default:
            return state;
    }
};

export default staffReducer;
