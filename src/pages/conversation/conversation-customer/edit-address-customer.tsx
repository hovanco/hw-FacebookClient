import { Button, Col, Form, Input, message, Row, Select, Space } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { map, omit } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import locationApi from '../../../api/location-api';
import storeApi from '../../../api/store-api';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { District, Province } from '../../create-store/create-store-form';
import { useOrder } from './context-order';
import { validatePhone } from '../../../utils/validate-phone';
import { disabledAutosuggestion } from '../../../utils/disabled-autosuggestion';
import useHiddenModalExpired from '../../../hooks/use-hidden-modal-expired';

interface Props {
    dataCustomer: any;
    isEditForm: boolean;
    toggleSetIsEditForm: () => void;
    changeDataCustomer: (value: any) => void;
}

const styleField = {
    marginBottom: 10,
};

const EditAddressCustomer: FC<Props> = ({
    dataCustomer,
    toggleSetIsEditForm,
    changeDataCustomer,
}: Props) => {
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation,
    );

    const { setInfoCustomer } = useOrder();

    const [form] = Form.useForm();
    const [edit, setEdit] = useState(false);

    const [loading, setLoading] = useState(false);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [loadingProvince, setLoadingProvince] = useState<boolean>(true);
    const [province, setProvince] = useState<string | null>(dataCustomer.province);

    const [districts, setDistricts] = useState<District[]>([]);
    const [loadingDistrict, setLoadingDistrict] = useState<boolean>(false);
    const [district, setDistrict] = useState<string | null>(dataCustomer.district);

    const [wards, setWards] = useState<District[]>([]);
    const [loadingWard, setLoadingWard] = useState<boolean>(false);
    const [ward, setWard] = useState<string | null>(null);
    const { hiddenModalExpired } = useHiddenModalExpired();

    const onChangeProvince = (value: string) => {
        setProvince(value);
    };

    const onChangeDistrict = (value: string) => {
        setDistrict(value);
    };

    const onChangeWard = (value: string) => {
        setWard(value);
    };

    const toggleEdit = () => {
        setEdit(!edit);
        toggleSetIsEditForm();
    };

    const cancelEdit = () => {
        if (!dataCustomer._id) {
            const data = {
                _id: '',
                fbUserId: '',
                name: '',
                phoneNo: '',
                address: '',
                province: undefined,
                district: undefined,
                ward: undefined,
                note: '',
            };

            form.setFieldsValue(data);
        } else {
            setProvince(dataCustomer.province);
            setDistrict(dataCustomer.district);
            setWard(dataCustomer.ward);

            form.setFieldsValue(dataCustomer);
        }

        setEdit(false);
        toggleSetIsEditForm();
    };

    const onFinish = async (values: Store) => {
        try {
            const data = {
                ...omit(dataCustomer, ['_id']),
                ...values,
                fbPageId: store.activePage._id,
                fbUserId: conversation.fbUserId,
            };

            let res;

            if (!dataCustomer._id || dataCustomer._id.length === 0) {
                res = await storeApi.createCustomer({
                    token: token.accessToken,
                    storeId: store._id,
                    data: omit(data, ['note']),
                });

                message.success('Đã tạo thành công khách hàng');
            } else {
                res = await storeApi.updateCustomer({
                    token: token.accessToken,
                    storeId: store._id,
                    customerId: dataCustomer._id,
                    data,
                });

                message.success('Cập nhật thành công khách hàng');
            }

            setInfoCustomer({
                ...res,
            });

            setLoading(false);
            changeDataCustomer({
                _id: res._id,
                fbUserId: res.fbUserId,
                name: res.name,
                phoneNo: res.phoneNo,
                address: res.address,
                province: res.province,
                district: res.district,
                ward: res.ward,
                note: res.note,
            });
            toggleEdit();
        } catch (error) {
            const errorStatusDupplicateTel = error.response?.data?.statusCode;
            setLoading(false);
            message.error(
                errorStatusDupplicateTel === 409
                    ? 'Số điện thoại đã được sử dụng!'
                    : 'Đã có lỗi xảy ra!',
            );
        }
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
            if (!province) return null;
            setLoadingDistrict(true);
            form.setFieldsValue({
                district: undefined,
                ward: undefined,
            });
            try {
                const response = await locationApi.getDistricts(province);
                setDistricts(response);
                setLoadingDistrict(false);
            } catch (error) {
                setDistricts([]);
                setLoadingDistrict(false);
            }
        }
        getListDistricts();
    }, [province]);

    useEffect(() => {
        async function getListWard() {
            if (!district) return null;
            setLoadingWard(true);
            form.setFieldsValue({
                ward: undefined,
            });
            try {
                const response = await locationApi.getWards({
                    provinceId: province,
                    districtId: district,
                });

                setWards(response);
                setLoadingWard(false);
            } catch (error) {
                setWards([]);
                setLoadingWard(false);
            }
        }
        getListWard();
    }, [district]);

    const renderContent = () => {
        if (!edit) {
            const addressCustomer = `${dataCustomer.address}  ${
                (wards && wards[dataCustomer.ward] && wards[dataCustomer.ward].path_with_type) || ''
            }`;

            if (dataCustomer.phoneNo.trim().length === 0 && addressCustomer.trim().length === 0) {
                return <div>Chưa có địa chỉ giao hàng</div>;
            }

            return (
                <div>
                    {dataCustomer.phoneNo}
                    <br />
                    {addressCustomer}
                </div>
            );
        }

        return (
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name='name'
                    rules={[{ required: true, message: 'Tên khách hàng không để trống' }]}
                    style={styleField}
                    initialValue={dataCustomer.name}
                >
                    <Input placeholder='Nhập tên khách hàng' />
                </Form.Item>
                <Form.Item
                    name='phoneNo'
                    rules={[
                        { required: true, message: 'Số điện thoại không để trống' },
                        {
                            validator: validatePhone,
                        },
                    ]}
                    style={styleField}
                    initialValue={dataCustomer.phoneNo}
                >
                    <Input placeholder='Nhập số điện thoại' />
                </Form.Item>

                <Form.Item
                    name='province'
                    initialValue={dataCustomer.province}
                    rules={[{ required: true, message: 'Chọn tỉnh/ thành phố' }]}
                    style={styleField}
                >
                    <Select
                        placeholder='Tỉnh/thành phố'
                        onChange={onChangeProvince}
                        showSearch
                        value={dataCustomer.province}
                        filterOption={(input, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        // disabled={!!customerId && !isEditForm}
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

                <Form.Item
                    name='district'
                    initialValue={dataCustomer.district}
                    rules={[{ required: true, message: 'Chọn quận/ huyện' }]}
                    style={styleField}
                >
                    <Select
                        placeholder='Quận/huyện'
                        onChange={onChangeDistrict}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={dataCustomer.district}
                        // disabled={!dataCustomer.province || (!!customerId && !isEditForm)}
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

                <Form.Item
                    name='ward'
                    initialValue={dataCustomer.ward}
                    rules={[{ required: true, message: 'Chọn xã/ phường' }]}
                    style={styleField}
                >
                    <Select
                        placeholder='Xã/phường'
                        onChange={onChangeWard}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={dataCustomer.ward}
                        // disabled={!dataCustomer.district || (!!customerId && !isEditForm)}
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

                <Form.Item
                    name='address'
                    rules={[{ required: true, message: 'Địa chỉ không để trống' }]}
                    style={styleField}
                    initialValue={dataCustomer.address}
                >
                    <Input.TextArea rows={3} placeholder='Nhập địa chỉ' />
                </Form.Item>

                <Form.Item style={{ margin: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={cancelEdit}>Hủy</Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={loading}
                            disabled={hiddenModalExpired}
                        >
                            Lưu
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        );
    };

    return (
        <div>
            {!edit && (
                <Row justify='space-between' align='middle'>
                    <Col>
                        <span className='customer-address-title'>Địa chỉ giao hàng</span>
                    </Col>

                    <Col>
                        <a onClick={toggleEdit}>Thay đổi</a>
                    </Col>
                </Row>
            )}
            <div style={{ marginTop: 5 }}>{renderContent()}</div>
        </div>
    );
};

export default EditAddressCustomer;
