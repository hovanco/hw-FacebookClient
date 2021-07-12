import { EnvironmentOutlined } from '@ant-design/icons';
import { Avatar, Col, Form, Row } from 'antd';
import { isEmpty } from 'lodash';
import querystring from 'querystring';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import storeApi from '../../../api/store-api';
import { IFacebookConversation } from '../../../collections/facebook-conversation';
import { Loading } from '../../../components';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';
import { useOrder } from './context-order';
import CustomerNote from './customer-note';
import EditAddressCustomer from './edit-address-customer';
import EditField from './edit-field';

const CustomerTab: FC = (): JSX.Element => {
    const conversation: IFacebookConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const page = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.page);

    const [form] = Form.useForm();
    const [loadingForm, setLoadingForm] = useState<boolean>(true);
    const [customerId, setCustomerId] = useState<string>('');
    const [dataCustomer, setDataCustomer] = useState<any>({});
    const [isEditForm, setIsEditForm] = useState<boolean>(false);

    const toggleSetIsEditForm = () => setIsEditForm(!isEditForm);

    const { setInfoCustomer, customerObjectId } = useOrder();

    const getCustomers = async () => {
        setLoadingForm(true);
        const fbUserId = conversation.fbUserId;
        const query = querystring.stringify({ fbUserId });
        const response = await storeApi.getListCustomers({
            storeId: store._id,
            token: token.accessToken,
            page: 1,
            limit: 1,
            query,
        });
        let data;
        if (response.data.length > 0) {
            setCustomerId(response.data[0]._id);
            data = {
                _id: response.data[0]._id,
                fbUserId: response.data[0].fbUserId,
                name: response.data[0].name,
                phoneNo: response.data[0].phoneNo,
                address: response.data[0].address,
                province: response.data[0].province,
                district: response.data[0].district,
                ward: response.data[0].ward,
                note: response.data[0].note,
            };
            setInfoCustomer(data);
        } else {
            form.resetFields();
            data = {
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

            setInfoCustomer(data);
            setCustomerId('');
        }
        form.resetFields();
        setDataCustomer(data);
        setLoadingForm(false);
        setIsEditForm(false);
    };

    useEffect(() => {
        getCustomers();
    }, [conversation.fbUserId]);

    useEffect(() => {
        if (!isEmpty(customerObjectId) && customerObjectId !== customerId) {
            getCustomers();
        }
    }, [customerObjectId]);

    const onChangeField = (field: string, value: any) => {};

    if (loadingForm) return <Loading full />;

    return (
        <div className='customer-tab'>
            <div className='tab-content-inner'>
                {!isEditForm && (
                    <Row gutter={15}>
                        <Col>
                            <Avatar
                                size={42}
                                src={generateUrlImgFb(conversation.fbUserId, page.accessToken)}
                            />
                        </Col>
                        <Col style={{ flex: 1 }}>
                            <div>
                                <EditField
                                    field='name'
                                    value={dataCustomer.name}
                                    onChange={onChangeField}
                                    dataCustomer={dataCustomer}
                                />

                                <EditField
                                    field='phoneNo'
                                    value={dataCustomer.phoneNo}
                                    onChange={onChangeField}
                                    empty='Chưa có số điện thoại'
                                    dataCustomer={dataCustomer}
                                />
                            </div>
                        </Col>
                    </Row>
                )}

                <div className='customer-address'>
                    <Row gutter={10}>
                        {!isEditForm && (
                            <Col>
                                <EnvironmentOutlined style={{ fontSize: 17 }} />
                            </Col>
                        )}

                        <Col style={{ flex: 1 }}>
                            <EditAddressCustomer
                                dataCustomer={dataCustomer}
                                isEditForm={isEditForm}
                                toggleSetIsEditForm={toggleSetIsEditForm}
                                changeDataCustomer={(value: any) => setDataCustomer(value)}
                            />
                        </Col>
                    </Row>
                </div>
            </div>

            <CustomerNote
                customer={dataCustomer}
                onChange={(value: string) => setDataCustomer({ ...dataCustomer, note: value })}
            />
        </div>
    );
};

export default CustomerTab;
