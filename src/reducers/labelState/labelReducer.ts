import { keyBy, filter, find } from 'lodash';
import { ILabel } from '../../collections/label';
import types from './types';

export interface ILabelState {
    loading: boolean;
    labels: any;
}

export interface IActionLabel {
    type: string;
    payload: any;
}

const initialState = {
    loading: true,
    labels: {},
};

const labelReducer = (state: ILabelState = initialState, action: IActionLabel): ILabelState => {
    switch (action.type) {
        case types.LOADING:
            return { ...state, loading: true };

        case types.LOAD_LABEL_SUCCESS: {
            const labels = keyBy(action.payload, '_id');
            return { ...state, labels, loading: false };
        }

        case types.REMOVE_LABEL: {
            const labels = filter(state.labels, (label: ILabel) => label._id !== action.payload);
            return { ...state, labels };
        }

        case types.UPDATE_ORDER_LABEL: {
            const newLabels = Object.keys(state.labels).map((key: string) => {
                const label = JSON.parse(JSON.stringify(state.labels))[key];
                if (label._id === action.payload.labelId) {
                    label.order = action.payload.order;
                }
                return label;
            });
            return {
                ...state,
                labels: keyBy(newLabels, '_id'),
            };
        }

        default:
            return state;
    }
};

export default labelReducer;
