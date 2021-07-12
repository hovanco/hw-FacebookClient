import { IImage } from '../../collections/image';
import types from './imagesTypes';

export interface IAction {
    type: string;
    payload: any;
}

const initialState = {
    loading: true,
    text_search: '',
    images: [],
    gallery: [],
};

const imagesReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.FETCH_IMAGES_LOADING:
            return {
                ...state,
                loading: true,
            };

        case types.FETCH_IMAGES_SUCCESS:
            return {
                ...state,
                images: action.payload,
                loading: false,
            };

        case types.ADD_IMAGES_SUCCESS:
            return {
                ...state,
                images: [...state.images, ...action.payload],

                loading: false,
            };

        case types.TOOGLE_LIKE_IMAGE: {
            const images = state.images.map((image: IImage) => {
                if (image._id === action.payload) return { ...image, star: !image.star };
                return image;
            });

            return {
                ...state,
                images,
            };
        }

        case types.DELETE_IMAGE: {
            const images = state.images.filter((image: IImage) => image._id !== action.payload);

            return {
                ...state,
                images,
            };
        }

        case types.SEARCH:
            return {
                ...state,
                text_search: action.payload,
            };

        case types.CREATE_GALLERY_SUCCESS:
            return {
                ...state,
                gallery: state.gallery.concat(action.payload),
                loading: false,
            };

        case types.FETCH_GALLERY_SUCCESS:
            return {
                ...state,
                gallery: action.payload,
                loading: false,
            };

        case types.DELETE_GALLERY: {
            const gallery = state.gallery.filter((g: any) => g._id !== action.payload);
            return {
                ...state,
                gallery,
            };
        }

        default:
            return state;
    }
};

export default imagesReducer;
