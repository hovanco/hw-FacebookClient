import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';

import authReducer from '../reducers/authState/authReducer';
import fanpageReducer from '../reducers/fanpageState/fanpageReducer';
import { storeReducer } from '../reducers/storeState';
import settingReducer from '../reducers/setting/settingReducer';
import labelReducer from '../reducers/labelState/labelReducer';
import productReducer from '../reducers/productState/productReducer';
import staffReducer from '../reducers/staffState/staffReducer';
import orderReducer from '../reducers/orderState/orderReducer';
import orderDraftReducer from '../reducers/orderDraftState/orderDraftReducer';
import imagesReducer from '../reducers/imagesState/imagesReducer';
import warehouseReducer from '../reducers/warehouseState/warehouseReducer';
import livestreamReducer from '../reducers/livestreamState/livestreamReducer';

import Types from '../reducers/authState/authTypes';

export default (history: any): Reducer => {
    const appReducer = combineReducers({
        router: connectRouter(history),
        auth: authReducer,
        fanpage: fanpageReducer,
        store: storeReducer,
        setting: settingReducer,
        label: labelReducer,
        product: productReducer,
        staff: staffReducer,
        order: orderReducer,
        orderDraft: orderDraftReducer,
        images: imagesReducer,
        warehouse: warehouseReducer,
        livestream: livestreamReducer,
    });

    const rootReducer = (state: any, action: any) => {
        if (action.type === Types.LOGOUT) {
            state.store.store = null;
            state.fanpage.conversation = null;
            state.fanpage.conversations = [];
            state.fanpage.allPages = [];
            state.fanpage.page = null;
        }

        return appReducer(state, action);
    };

    return rootReducer;
};
