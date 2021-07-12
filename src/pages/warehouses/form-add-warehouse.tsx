import { Button, Col, Form, Input, Row, Select } from 'antd';
import { get, map } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import locationApi from '../../api/location-api';
import { createWarehouse, updateWarehouse } from '../../reducers/warehouseState/warehouseAction';
import { disabledAutosuggestion } from '../../utils/disabled-autosuggestion';
import { validatePhone } from '../../utils/validate-phone';

const style = {
    width: '100%',
};

const size = 'middle';

interface Props {
    toggle: any;
    reloadTable: any;
    visible: boolean;
    warehouse?: any;
}

const FormAddWarehouse: FC<Props> = (props): JSX.Element => {
    const { toggle, reloadTable, visible, warehouse } = props;

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState<boolean>(false);
    const [dataForm, setDataForm] = useState<any>({});

    const resetForm = () => {
        setDataForm({});
        form.resetFields();
    };

    const onFinish = async (values: any) => {
        const data = {
            ...values,
        };
        let result;
        if (get(warehouse, '_id')) {
            result = await dispatch(updateWarehouse({ ...data, _id: warehouse._id }));
        } else {
            result = await dispatch(createWarehouse(data));
        }
        if (!!result) {
            resetForm();
            toggle();
            reloadTable();
        }
    };

    const onCancel = () => {
        resetForm();
        toggle();
    };

    const [provinces, setProvinces] = useState<any[]>([]);
    const [loadingProvince, setLoadingProvince] = useState<boolean>(true);

    const [districts, setDistricts] = useState<any[]>([]);
    const [loadingDistrict, setLoadingDistrict] = useState<boolean>(false);

    const [wards, setWards] = useState<any[]>([]);
    const [loadingWard, setLoadingWard] = useState<boolean>(false);

    useEffect(() => {
        setDataForm({
            ...dataForm,
            ...warehouse,
        });
        form.setFieldsValue(warehouse);
        // if (warehouse) {
        //     form.setFieldsValue(warehouse);
        // } else {
        //     form.setFieldsValue(dataForm);
        // }
    }, [warehouse]);

    const onChange = (e: any) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value,
        });
    };

    const onChangeProvince = (value: string) => {
        setDataForm({
            ...dataForm,
            province: value,
            district: undefined,
            ward: undefined,
        });
        form.setFieldsValue({
            district: undefined,
            ward: undefined,
        });
    };

    const onChangeDistrict = (value: string) => {
        setDataForm({
            ...dataForm,
            district: value,
            ward: undefined,
        });
        form.setFieldsValue({
            ward: undefined,
        });
    };

    const onChangeWard = (value: string) => {
        setDataForm({
            ...dataForm,
            ward: value,
        });
    };

    const dataInput = form.getFieldsValue();
    const isValidForm =
        dataInput.name &&
        dataInput.phoneNo &&
        dataInput.province &&
        dataInput.district &&
        dataInput.ward &&
        dataInput.address;

    useEffect(() => {
        const fixAutocomplete = () => {
            document.querySelectorAll('.ant-select-selector input').forEach((e) => {
                e.setAttribute('autocomplete', 'stopDamnAutocomplete');
            });
        };

        fixAutocomplete();
    }, []);

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
            if (!dataForm.province) return null;
            setLoadingDistrict(true);
            try {
                const response = await locationApi.getDistricts(dataForm.province);
                setDistricts(response);
                setLoadingDistrict(false);
            } catch (error) {
                setDistricts([]);
                setLoadingDistrict(false);
            }
        }
        getListDistricts();
    }, [dataForm.province]);

    useEffect(() => {
        async function getListWard() {
            if (!dataForm.district) return null;
            setLoadingWard(true);
            try {
                const response = await locationApi.getWards({
                    provinceId: dataForm.province,
                    districtId: dataForm.district,
                });
                setWards(response);
                setLoadingWard(false);
            } catch (error) {
                setWards([]);
                setLoadingWard(false);
            }
        }
        getListWard();
    }, [dataForm.district]);

    return (
        <Form layout='vertical' onFinish={onFinish} form={form} initialValues={dataForm}>
            <Form.Item
                name='name'
                label='Tên chi nhánh'
                rules={[{ required: true, message: 'Điền tên chi nhánh' }]}
            >
                <Input size={size} placeholder='Tên chi nhánh' onChange={onChange} autoFocus />
            </Form.Item>

            <Form.Item
                name='phoneNo'
                label='Số điện thoại'
                rules={[
                    { required: true, message: 'Điền số điện thoại' },
                    {
                        validator: validatePhone,
                    },
                ]}
            >
                <Input
                    style={style}
                    size={size}
                    placeholder='Số điện thoại chi nhánh'
                    onChange={onChange}
                />
            </Form.Item>

            <Row gutter={15}>
                <Col md={8}>
                    <Form.Item
                        name='province'
                        label='Tỉnh/thành phố'
                        rules={[
                            {
                                required: true,
                                message: 'Chọn tỉnh/thành phố',
                            },
                        ]}
                    >
                        <Select
                            size={size}
                            placeholder='Chọn tỉnh/thành phố'
                            onChange={onChangeProvince}
                            showSearch
                            filterOption={(input, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            loading={loadingProvince}
                            onFocus={disabledAutosuggestion}
                        >
                            <Select.Option value={'-1'} key={'-1'} disabled>
                                Chọn tỉnh/thành phố
                            </Select.Option>
                            {map(provinces, (province: any) => (
                                <Select.Option value={province.code} key={province.code}>
                                    {province.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col md={8}>
                    <Form.Item
                        name='district'
                        label='Quận/huyện'
                        rules={[{ required: true, message: 'Chọn quận/huyện' }]}
                    >
                        <Select
                            size={size}
                            placeholder='Chọn quận/huyện'
                            onChange={onChangeDistrict}
                            showSearch
                            filterOption={(input, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={!dataForm.province}
                            loading={loadingDistrict}
                            onFocus={disabledAutosuggestion}
                        >
                            <Select.Option value={'-2'} key={'-2'} disabled>
                                Chọn quận/huyện
                            </Select.Option>
                            {map(districts, (district: any) => (
                                <Select.Option value={district.code} key={district.code}>
                                    {district.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col md={8}>
                    <Form.Item
                        name='ward'
                        label='Phường/xã'
                        rules={[{ required: true, message: 'Chọn phường/xã' }]}
                    >
                        <Select
                            size={size}
                            placeholder='Chọn phường/xã'
                            onChange={onChangeWard}
                            showSearch
                            filterOption={(input, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={!dataForm.district}
                            loading={loadingWard}
                            onFocus={disabledAutosuggestion}
                        >
                            <Select.Option value={'-3'} key={'-3'} disabled>
                                Chọn phường/xã
                            </Select.Option>
                            {map(wards, (ward: any) => {
                                return (
                                    <Select.Option value={ward.code} key={ward.code}>
                                        {ward.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name='address'
                rules={[{ required: true, message: 'Điền địa chỉ chi nhánh' }]}
                label='Địa chỉ'
            >
                <Input.TextArea
                    autoComplete='off'
                    placeholder='Điền địa chỉ chi nhánh'
                    rows={4}
                    onChange={onChange}
                ></Input.TextArea>
            </Form.Item>

            <Form.Item style={{ textAlign: 'end' }}>
                <Button style={{ marginRight: 15 }} onClick={onCancel}>
                    Hủy
                </Button>
                <Button type='primary' htmlType='submit' loading={loading} disabled={!isValidForm}>
                    {warehouse && warehouse ? 'Cập nhật chi nhánh' : 'Tạo mới chi nhánh'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FormAddWarehouse;
