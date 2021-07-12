import { Select, Form } from 'antd';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import locationApi from '../../api/location-api';
import { disabledAutosuggestion } from '../../utils/disabled-autosuggestion';
import { Province, District, Ward } from '../create-store/create-store-form';
import { formItemLayout, style } from './form-update-order';

interface Props {
    changeAddress: (order: any) => void;
    order: any;
    disabled?: boolean;
}

const OrderAddress = ({ changeAddress, order, disabled = false }: Props): JSX.Element => {
    const [loadingProvince, setLoadingProvince] = useState(true);
    const [provinceId, setProvinceId] = useState<string | undefined>(
        order ? (order as any).customer.province : undefined
    );
    const [provinces, setProvinces] = useState<Province[]>([]);

    const [districtId, setDistrictId] = useState<string | undefined>(
        order ? (order as any).customer.district : undefined
    );
    const [loadingDistrict, setLoadingDistrict] = useState<boolean>(false);
    const [districts, setDistricts] = useState<District[]>([]);

    const [wardId, setWardId] = useState<string | undefined>(
        order ? (order as any).customer.ward : undefined
    );
    const [wards, setWards] = useState<District[]>([]);
    const [loadingWard, setLoadingWard] = useState<boolean>(false);

    const [form] = Form.useForm();

    const onChangeProvince = (value: string) => {
        setProvinceId(value);
        setDistrictId(undefined);
        setWardId(undefined);
        form.setFieldsValue({
            districtId: undefined,
            wardId: undefined,
        });
        const newOrder = {
            ...(order as any),
            customer: {
                ...(order as any).customer,
                province: value,
                district: undefined,
                ward: undefined,
            },
        };
        changeAddress(newOrder);
    };

    const onChangeDistrict = (value: string) => {
        setDistrictId(value);
        setWardId(undefined);
        form.setFieldsValue({
            wardId: undefined,
        });
        const newOrder = {
            ...(order as any),
            customer: {
                ...(order as any).customer,
                district: value,
                ward: undefined,
            },
        };
        changeAddress(newOrder);
    };

    const onChangeWard = (value: string) => {
        setWardId(value);

        const newOrder = {
            ...(order as any),
            customer: {
                ...(order as any).customer,
                ward: value,
            },
        };
        changeAddress(newOrder);
    };

    useEffect(() => {
        async function getListProvinces() {
            try {
                const response = await locationApi.getProvinces();

                setProvinces(response);
                setLoadingProvince(false);
            } catch (error) {
                setProvinces([]);
                setLoadingProvince(false);
            }
        }
        getListProvinces();
    }, []);

    useEffect(() => {
        async function getListDistricts() {
            if (!provinceId) return null;
            setLoadingDistrict(true);
            try {
                const response = await locationApi.getDistricts(provinceId);
                setDistricts(response);
                setLoadingDistrict(false);
            } catch (error) {
                setDistricts([]);
                setLoadingDistrict(false);
            }
        }
        getListDistricts();
    }, [provinceId]);

    useEffect(() => {
        async function getListWard() {
            if (!districtId) return null;
            setLoadingWard(true);
            try {
                const response = await locationApi.getWards({
                    provinceId,
                    districtId,
                });
                setWards(response);
                setLoadingWard(false);
            } catch (error) {
                setWards([]);
                setLoadingWard(false);
            }
        }
        getListWard();
    }, [districtId]);

    return (
        <Form form={form}>
            <Form.Item
                label='Tỉnh/TP'
                {...formItemLayout}
                style={style}
                rules={[{ required: true, message: 'Chọn Tỉnh/thành phố' }]}
                name='provinceId'
                initialValue={provinceId}
            >
                <Select
                    loading={loadingProvince}
                    placeholder='Tỉnh/thành phố'
                    value={provinceId}
                    onChange={onChangeProvince}
                    disabled={disabled}
                    onFocus={disabledAutosuggestion}
                >
                    {map(provinces, (province: Province) => (
                        <Select.Option key={province.code} value={province.code}>
                            {province.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label='Quận/Huyện'
                {...formItemLayout}
                style={style}
                rules={[{ required: true, message: 'Chọn Quận/Huyện' }]}
                name='districtId'
                initialValue={districtId}
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder='Quận/Huyện'
                    value={districtId}
                    loading={loadingDistrict}
                    onChange={onChangeDistrict}
                    disabled={disabled}
                    onFocus={disabledAutosuggestion}
                >
                    {map(districts, (district: District) => (
                        <Select.Option value={district.code} key={district.code}>
                            {district.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label='Xã/Phường'
                {...formItemLayout}
                style={style}
                rules={[{ required: true, message: 'Chọn Phường/Xã' }]}
                name='wardId'
                initialValue={wardId}
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder='Phường/Xã'
                    value={wardId}
                    loading={loadingWard}
                    onChange={onChangeWard}
                    disabled={disabled || !order.customer.district}
                    onFocus={disabledAutosuggestion}
                >
                    {map(wards, (ward: Ward) => (
                        <Select.Option value={ward.code} key={ward.code}>
                            {ward.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};

export default OrderAddress;
