import { HomeOutlined } from '@ant-design/icons';
import { Button, Col, message, Modal, Row, Tooltip } from 'antd';
import { push } from 'connected-react-router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPackagesActive } from '../../api/billing-api';
import { validateToken } from '../../api/fanpage';
import { IPackage } from '../../collections/billing';
import { LoginFacebookBtn } from '../../components';
import ExpiredStore from '../../components/expired-store';
import constants from '../../constants';
import { CustomerLayout } from '../../layout';
import { loginActionWithService } from '../../reducers/authState/authAction';
import { IAuthState } from '../../reducers/authState/authReducer';
import { IFacebookState } from '../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../reducers/storeState/storeReducer';
import { checkRestrictAction } from '../../utils/get-time';
import { useNotification } from '../customer/notfication-context';
import ConversationCustomer from './conversation-customer';
import ConversationDetail from './conversation-detail';
import CoversationList from './conversation-list';
import './style.less';
import TabPages from './tab-pages';
import useHiddenModalExpired from '../../hooks/use-hidden-modal-expired';

const Conversation: FC = (): JSX.Element => {
    const { title } = useNotification();
    const dispatch = useDispatch();

    const page = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.page);
    const loading = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.loading);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);
    const loadingStore = useSelector(({ store }: { store: IStoreState }) => store.loading);
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const loadingAuth: boolean = useSelector(({ auth }: { auth: IAuthState }) => auth.loading);

    const [isValidToken, setIsValidToken] = useState(true);
    const [visible, setVisible] = useState(false);
    const { hiddenModalExpired, setValueHidden } = useHiddenModalExpired();

    const handleCancelPopup = () => {
        setVisible(false);
        dispatch(push('/customer/conversation'));
        setValueHidden('true');
    };

    const handleBuyPackage = () => {
        window.open(`${constants.URL_STORE}setting/billings/list`, '_blank');
    };

    const getPackages = async () => {
        const packages: IPackage[] = await getPackagesActive(store._id);
        const pkgsActive = packages.filter((item: any) => item.active);
        setVisible(checkRestrictAction(pkgsActive));
    };

    const handleSocialLogin = (response: any, service?: string): void => {
        const { accessToken } = response;
        if (accessToken) {
            dispatch(loginActionWithService({ accessToken }, service));
        } else {
            message.error('Đăng nhập không thành công.');
        }
    };

    const loginFacebook = (data: any) => {
        handleSocialLogin(data, 'facebook');
    };

    const title_page = `${title} Conversation`;

    useEffect(() => {
        if (!loading && !loadingAuth && !loadingStore && page) {
            const callApiCheckToken = async () => {
                try {
                    await validateToken({
                        storeId: store._id,
                        fbPageId: page.fbObjectId,
                        token: token.accessToken,
                    });
                    setIsValidToken(true);
                } catch (error) {
                    setIsValidToken(false);
                }
            };
            callApiCheckToken();
        }
        getPackages();
    }, []);
    return (
        <>
            {!hiddenModalExpired && (
                <ExpiredStore
                    visible={visible}
                    onCancel={handleCancelPopup}
                    onBuyPackage={handleBuyPackage}
                />
            )}
            <CustomerLayout title={title_page}>
                <div className='conversation'>
                    <TabPages />
                    <div className='conversation-main'>
                        <Row className='content'>
                            <Col style={{ width: 350 }} className='column conversation-wrap'>
                                <CoversationList />
                            </Col>
                            <Col className='column' style={{ flex: 1, overflow: 'hidden' }}>
                                <ConversationDetail />
                            </Col>
                            <Col style={{ maxWidth: 400, width: '33.33%' }} className='column'>
                                <ConversationCustomer />
                            </Col>
                        </Row>
                    </div>
                </div>
                {!loading && !isValidToken ? (
                    <Modal
                        visible={true}
                        footer={null}
                        closeIcon={null}
                        closable={false}
                        bodyStyle={{ padding: 10, textAlign: 'center' }}
                        width={400}
                        title={
                            <Row align='middle' justify='space-between'>
                                <Col>Thông báo</Col>
                                <Col>
                                    <Tooltip placement='left' title='Trang chủ' color='blue'>
                                        <Button
                                            icon={<HomeOutlined />}
                                            onClick={() => dispatch(push('/'))}
                                        ></Button>
                                    </Tooltip>
                                </Col>
                            </Row>
                        }
                    >
                        <div style={{ marginBottom: 10 }}>
                            <span>Facebook token của bạn đã hết hạn hoặc đã bị thay đổi.</span>
                            <br />
                            <span>Vui lòng kết nối lại tài khoản facebook của bạn.</span>
                        </div>
                        <LoginFacebookBtn
                            loginFacebook={loginFacebook}
                            title=' Kết nối lại với facebook'
                        />
                    </Modal>
                ) : (
                    <></>
                )}
            </CustomerLayout>
        </>
    );
};

export default Conversation;
