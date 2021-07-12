import { Col, Collapse, Form, Input, Row, Select } from 'antd';
import { isNil, map, trim } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import locationApi from '../../../api/location-api';
import { DownIcon } from '../../../assets/icon';
import { Loading } from '../../../components';
import { disabledAutosuggestion } from '../../../utils/disabled-autosuggestion';
import { validatePhone } from '../../../utils/validate-phone';
import { District, Province } from '../../create-store/create-store-form';
import { useOrder } from './context-order';
import './order-customer-info.less';

const style = { marginBottom: 10 };

interface Props {
    defaultActiveKey?: string[];
    dataCustomer?: any;
}

const OrderCustomerInfo: FC<Props> = ({ defaultActiveKey, dataCustomer }) => {
    const [loading, setLoading] = useState(true);
    const { order, setOrder, infoCustomer } = useOrder();
    const [formOrderCustomerInfo] = Form.useForm();
    const [customer, setCustomer] = useState<any>({
        ...order.customer,
        ...infoCustomer,
    });

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [loadingProvince, setLoadingProvince] = useState<boolean>(true);

    const [districts, setDistricts] = useState<District[]>([]);
    const [loadingDistrict, setLoadingDistrict] = useState<boolean>(false);

    const [wards, setWards] = useState<District[]>([]);
    const [loadingWard, setLoadingWard] = useState<boolean>(false);

    const [addressWarning, setAddressWarning] = useState<boolean>(false);

    const onChange = (e: any) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
    };

    const changeLocationCustomer = ({ field, value }: { field: string; value: string }) => {
        setCustomer({
            ...customer,
            [field]: value,
        });
    };

    const onChangeProvince = (value: string) => {
        setCustomer({
            ...customer,
            province: value,
            district: undefined,
            ward: undefined,
        });
    };

    const onChangeDistrict = (value: string) => {
        setCustomer({
            ...customer,
            district: value,
            ward: undefined,
        });
    };

    const onChangeWard = (value: string) => {
        changeLocationCustomer({ field: 'ward', value });
    };

    useEffect(() => {
        async function initCustomer() {
            setLoading(true);
            await setCustomer({
                ...order.customer,
                ...infoCustomer,
            });
            setLoading(false);
        }
        initCustomer();
    }, [infoCustomer]);

    useEffect(() => {
        setOrder({ ...order, customer });
    }, [customer]);

    useEffect(() => {
        if (!isNil(customer.ward) && !trim(customer.address)) {
            setAddressWarning(true);
            return;
        }
        setAddressWarning(false);
    }, [customer.ward, customer.address]);

    // load province
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

        if (dataCustomer) {
            setCustomer({
                ...customer,
                ...dataCustomer,
            });
        }
    }, []);

    // load districts
    useEffect(() => {
        async function getListDistricts() {
            if (!customer.province) return null;
            setLoadingDistrict(true);
            try {
                const response = await locationApi.getDistricts(customer.province);
                setDistricts(response);
                setLoadingDistrict(false);
            } catch (error) {
                setDistricts([]);
                setLoadingDistrict(false);
            }
        }
        getListDistricts();
    }, [customer.province]);

    // load wards
    useEffect(() => {
        async function getListWard() {
            if (!customer.district) return null;
            setLoadingWard(true);
            try {
                const response = await locationApi.getWards({
                    provinceId: customer.province,
                    districtId: customer.district,
                });
                setWards(response);
                setLoadingWard(false);
            } catch (error) {
                setWards([]);
                setLoadingWard(false);
            }
        }
        getListWard();
    }, [customer.district, customer.province]);

    if (loading) return <Loading />;

    return (
        <Collapse ghost defaultActiveKey={defaultActiveKey}>
            <Collapse.Panel
                className='panel-customer'
                showArrow={false}
                key='customer'
                header={
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
                        <span style={{ marginRight: 4, color: '#ff0000', fontSize: 10 }}>*</span>
                        <span>Thông tin khách hàng</span>

                        <DownIcon style={{ fontSize: 20, marginLeft: 2 }} />
                    </div>
                }
            >
                <Form
                    layout='vertical'
                    form={formOrderCustomerInfo}
                    className='box-gray order-customer-info-form'
                >
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item
                                style={style}
                                name='name'
                                rules={[
                                    { required: true, message: 'Vui lòng nhập Tên khách hàng' }
                                ]}
                                initialValue={customer.name}
                            >
                                <Input
                                    value={customer.name}
                                    placeholder='Tên khách hàng'
                                    name='name'
                                    onChange={onChange}
                                />
                            </Form.Item>

                            <Form.Item
                                name='phoneNo'
                                style={style}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập Số điện thoại' },
                                    {
                                        validator: validatePhone,
                                    },
                                ]}
                                initialValue={customer.phoneNo}
                            >
                                <Input
                                    value={customer.phoneNo}
                                    placeholder='Số điện thoại'
                                    name='phoneNo'
                                    onChange={onChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item style={style}>
                                <Select
                                    placeholder='Tỉnh/thành phố'
                                    onChange={onChangeProvince}
                                    showSearch
                                    value={customer.province}
                                    filterOption={(input, option: any) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={loadingProvince}
                                    onFocus={disabledAutosuggestion}
                                >
                                    {map(provinces, (province: Province) => (
                                        <Select.Option value={province.code} key={province.code}>
                                            {province.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item style={style}>
                                <Select
                                    placeholder='Quận/huyện'
                                    onChange={onChangeDistrict}
                                    showSearch
                                    filterOption={(input, option: any) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    value={customer.district}
                                    disabled={!customer.province}
                                    loading={loadingDistrict}
                                    onFocus={disabledAutosuggestion}
                                >
                                    {map(districts, (district: District) => (
                                        <Select.Option value={district.code} key={district.code}>
                                            {district.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item style={style}>
                                <Select
                                    placeholder='Xã/phường'
                                    onChange={onChangeWard}
                                    showSearch
                                    filterOption={(input, option: any) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    value={customer.ward}
                                    disabled={!customer.district}
                                    loading={loadingWard}
                                    onFocus={disabledAutosuggestion}
                                >
                                    {map(wards, (district: District) => (
                                        <Select.Option value={district.code} key={district.code}>
                                            {district.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                style={style}
                                hasFeedback
                                validateStatus={addressWarning ? `warning` : ''}
                            >
                                <Input.TextArea
                                    name='address'
                                    placeholder='Địa chỉ khách hàng '
                                    value={customer.address}
                                    onChange={onChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Collapse.Panel>
        </Collapse>
    );
};

export default OrderCustomerInfo;
