import { Button, Col, message, Row, Table } from 'antd';
import { push } from 'connected-react-router';
import { get, maxBy, some } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EBillingPackageType, getPackagesActive } from '../../api/billing-api';
import { loadConversation } from '../../api/conversation-api';
import { updatePageStatus } from '../../api/fanpage';
import { IPackage } from '../../collections/billing';
import { LoginFacebookBtn } from '../../components';
import { BaseLayout } from '../../layout';
import { loginActionWithService } from '../../reducers/authState/authAction';
import { loadFanpageAction } from '../../reducers/fanpageState/fanpageAction';
import { IFacebookState } from '../../reducers/fanpageState/fanpageReducer';
import ModalLoadData from './modal-load-data';
import './style.less';
const size = 'large';

/**
 * 1. Load page
 * 2. Select page
 * 3. Subscribe page
 */

function TableListPages(): JSX.Element {
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const pagesData = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.allPages);
    const arrPage = Object.keys(pagesData).map((keyName: string) => {
        return { ...pagesData[keyName], key: pagesData[keyName].fbObjectId };
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState<any>(
        arrPage
            .map((item) => {
                if (item.active) {
                    return item.fbObjectId;
                }
                return;
            })
            .filter((item) => !!item),
    );
    const [loading, setLoading] = useState(false);
    const [loading_sub, setLoadingSub] = useState(false);
    const [pages, selectPages] = useState(arrPage);
    const [period, setPeriod] = useState<number>();
    const [selectRows, setSelectRows] = useState([]);
    const [checkYealyPackage, setCheckYealyPackage] = useState<boolean>(false);
    const yearly = 12;
    const yearlyPackage = 10;
    const monthPackage = 5;

    const handleFindPackageType = (packages: any) => {
        let selectedRows: any = [];
        packages.filter((element: any) => {
            if (
                element.packageType & EBillingPackageType.Omni ||
                element.packageType & EBillingPackageType.Trial ||
                element.packageType & EBillingPackageType.Facebook
            )
                selectedRows.push(element);
        });
        return maxBy(selectedRows, 'period');
    };

    const getPackages = async () => {
        const packages: IPackage[] = await getPackagesActive(store._id);
        const periodPackage = handleFindPackageType(packages)?.period;
        setPeriod(periodPackage);
    };
    useEffect(() => {
        getPackages();
    }, []);

    useEffect(() => {
        const checkYealyPackage =
            (period >= yearly && selectRows.length === yearlyPackage) ||
            (period < yearly && selectRows.length === monthPackage)
                ? true
                : false;

        setCheckYealyPackage(checkYealyPackage);
    }, [selectRows, period]);

    const hancleCheckYearlyPackage = (record: any) => {
        if (
            period &&
            ((period >= yearly && selectRows.length === yearlyPackage) ||
                (period < yearly && selectRows.length === monthPackage)) &&
            !some(selectRows, record)
        ) {
            return true;
        }

        return false;
    };

    const dispatch = useDispatch();

    const handleSubscride = async () => {
        try {
            setLoadingSub(true);
            const activeFbPageIds = selectedRowKeys;
            delete store.activePage;
            const inactiveFbPageIds: string[] = [];
            arrPage.map((item: any) => {
                if (item.active && !activeFbPageIds.includes(item.fbObjectId)) {
                    inactiveFbPageIds.push(item.fbObjectId);
                }
            });

            localStorage.removeItem('pages-setting');

            for (const fbPageId of activeFbPageIds) {
                const infoPage: any = arrPage.find((item: any) => item.fbObjectId === fbPageId);
                await updatePageStatus({
                    fbPageId,
                    payload: { active: true },
                    storeId: store._id,
                    token: token.accessToken,
                }).catch((err) => {
                    if (get(err, 'response.data.message') === 'DUPLICATE_ACTIVE_PAGE') {
                        message.error(
                            `Fanpage ${infoPage.name} đã được sử dụng trên tài khoản khác!`,
                        );
                    } else {
                        message.error(`Kích hoạt fanpage ${infoPage.name} thất bại!`);
                    }
                });
            }

            for (const fbPageId of inactiveFbPageIds) {
                const infoPage: any = arrPage.find((item: any) => item.fbObjectId === fbPageId);
                await updatePageStatus({
                    fbPageId,
                    payload: { active: false },
                    storeId: store._id,
                    token: token.accessToken,
                }).catch((err) => message.error(`Vô hiệu hóa fanpage ${infoPage.name} thất bại!`));
            }

            await loadConversation({
                storeId: store._id,
                token: token.accessToken,
                fbPageIds: activeFbPageIds,
            });
            await setLoadingSub(false);
            await dispatch(loadFanpageAction());
            await dispatch(push('/customer/conversation'));
            await message.success('Đã đồng bộ dữ liệu');
        } catch (error) {
            message.error('Đã có lỗi xảy ra!');
            setLoadingSub(false);
        }
    };

    const columns = [
        {
            title: <b>Tên fanpage</b>,
            dataIndex: 'name',
        },
    ];

    const selectRow = (record: any) => {
        const newSelectedRowKeys = [...selectedRowKeys];
        if (newSelectedRowKeys.indexOf(record.key) >= 0) {
            newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(record.key), 1);
        } else {
            newSelectedRowKeys.push(record.key);
        }
        let selectedRows: any = [];
        newSelectedRowKeys.forEach((x) => {
            pages.filter((element) => {
                if (element.key === x) selectedRows.push(element);
            });
        });

        setSelectRows(selectedRows);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const onSelectedRowKeysChange = (newSelectedRowKeys: any, selectedRows: any) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectRows(selectedRows);
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

    return (
        <BaseLayout title='Chọn fanpage'>
            <div className='page-wrap'>
                <div className='header-title-active'>
                    <h3 className='title'>Chọn fanpage cần quản lý</h3>
                    <span className={checkYealyPackage ? '' : 'hidden-sub-header'}>
                        Đã chọn tối đa số page!
                    </span>
                </div>
                <Table
                    columns={columns}
                    onRow={(record: any) => {
                        return {
                            onClick: () => selectRow(record),
                        };
                    }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys: any, selectedRows: any) => {
                            onSelectedRowKeysChange(selectedRowKeys, selectedRows);
                        },
                        getCheckboxProps: (record) => ({
                            disabled: hancleCheckYearlyPackage(record),
                        }),
                    }}
                    dataSource={pages}
                    pagination={false}
                    loading={loading}
                    rowClassName={(record) => hancleCheckYearlyPackage(record) && 'disabled-row'}
                />

                <Row gutter={15}>
                    <Col xs={24} sm={12} style={{ marginTop: 15 }}>
                        <Button
                            block
                            size={size}
                            type='primary'
                            onClick={handleSubscride}
                            loading={loading_sub}
                            disabled={selectedRowKeys.length === 0}
                        >
                            Truy cập
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} style={{ marginTop: 15 }}>
                        <Link to='/customer/conversation'>
                            <Button size={size} block>
                                Trở lại
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col xs={24} sm={24} style={{ marginTop: 15 }}>
                        <LoginFacebookBtn
                            loginFacebook={loginFacebook}
                            title=' Nhập thêm fanpage'
                        />
                    </Col>
                </Row>
            </div>
            {loading_sub && <ModalLoadData visible={loading_sub} />}
        </BaseLayout>
    );
}

export default TableListPages;
