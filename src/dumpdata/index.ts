import tinh_thanhpho from './tinh_thanhpho.json';
import quan_huyen from './quan_huyen.json';
import xa_phuong from './xa_phuong.json';

import ghn from '../assets/ghn.png';
import ghtk from '../assets/ghtk.png';

const getAddress = (jsonData: any, idParent?: string): any[] => {
    const arr = Object.keys(jsonData).map((q) => jsonData[q]);
    if (!idParent) {
        return arr;
    }
    const result = arr.filter((q) => q.parent_code === idParent);
    return result;
};

const getAdressShip = (districtName: string) => {
    // const district = ship_address.find(d => {
    //   const index = d.DistrictName.toLowerCase().indexOf(
    //     districtName.toLowerCase()
    //   );

    //   if (index >= 0) return true;

    //   return false;
    // });

    // return district;
    return {
        DistrictID: null,
    };
};

const shipers = {
    giaohangnhanh: {
        no: 1,
        id: 'giaohangnhanh',
        name: 'Giao hàng nhanh',
        logo: ghn,
    },
    giaohangtietkiem: {
        no: 2,
        id: 'giaohangtietkiem',
        name: 'Giao hàng tietkiem',
        logo: ghtk,
    },
};

const getTinhTP = () => getAddress(tinh_thanhpho);
const getQuanHuyen = (idCity: string) => getAddress(quan_huyen, idCity);
const getXaPhuong = (idDistrict: string) => getAddress(xa_phuong, idDistrict);

export {
    tinh_thanhpho,
    quan_huyen,
    xa_phuong,
    getTinhTP,
    getQuanHuyen,
    getXaPhuong,
    getAdressShip,
    shipers,
};
