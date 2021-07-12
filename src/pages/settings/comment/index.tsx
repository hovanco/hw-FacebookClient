import React, { useState, useEffect } from 'react';
import { Switch, message, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getFacebookPageSetting, updateFacebookPageSetting } from '../../../api/setting';
import { useSelector } from 'react-redux';
import SelectPage from '../../report/form-filter/select-page';
import useHiddenModalExpired from '../../../hooks/use-hidden-modal-expired';

const style = { marginBottom: 5, marginRight: 10 };

const Comment = (): JSX.Element => {
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);
    const pages = useSelector((state: any) => state.fanpage.pages);
    const page = useSelector((state: any) => state.fanpage.page);

    const [hideAllComments, setHideAllComment] = useState(false);
    const [hidePhoneComments, setHidePhoneComments] = useState(false);
    const [pageId, setPageId] = useState(page._id);
    const [dataPage, setDataPage] = useState(page);
    const { hiddenModalExpired } = useHiddenModalExpired();

    useEffect(() => {
        async function fetchFacebookPageSetting() {
            try {
                const res = await getFacebookPageSetting({
                    storeId: store._id,
                    fbPageId: dataPage.fbObjectId,
                    token: token.accessToken,
                });
                if (res) {
                    setHideAllComment(res.hideAllComments || false);
                    setHidePhoneComments(res.hidePhoneComments || false);
                } else {
                    setHideAllComment(false);
                    setHidePhoneComments(false);
                }
            } catch (error) {
                message.error('Lỗi tải trang!');
            }
        }
        fetchFacebookPageSetting();
    }, [pageId]);

    const onChangeHideAllComment = async (value: boolean) => {
        try {
            setHideAllComment(value);
            if (value) {
                setHidePhoneComments(!value);
            }
            await updateFacebookPageSetting({
                storeId: store._id,
                fbPageId: dataPage.fbObjectId,
                token: token.accessToken,
                data: {
                    hideAllComments: value,
                    hidePhoneComments: false,
                },
            });
            message.success('Cài đặt thành công');
        } catch (error) {
            message.error('Cài đặt thất bại');
        }
    };

    const onChangeHidePhoneComments = async (value: boolean) => {
        try {
            setHidePhoneComments(value);
            if (value) {
                setHideAllComment(!value);
            }
            await updateFacebookPageSetting({
                storeId: store._id,
                fbPageId: dataPage.fbObjectId,
                token: token.accessToken,
                data: {
                    hideAllComments: false,
                    hidePhoneComments: value,
                },
            });
            message.success('Cài đặt thành công');
        } catch (error) {
            message.error('Cài đặt thất bại');
        }
    };

    const selectPage = (pageId: string) => {
        setPageId(pageId);
        const pageSelected = Object.keys(pages)
            .map((key: string) => pages[key])
            .find((p: any) => p._id === pageId);
        setDataPage(pageSelected);
    };

    const renderContent = () => {
        return (
            <div>
                <Row gutter={15} style={style}>
                    <Col>
                        <p style={{ color: 'red', marginTop: 5 }}>
                            Cài đặt tự động ẩn bình luận cho trang
                        </p>
                    </Col>
                    <Col>
                        <SelectPage selectPage={selectPage} valuePage={pageId} />
                    </Col>
                </Row>
                <p style={style}>
                    <Switch
                        disabled={hiddenModalExpired}
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        onChange={onChangeHideAllComment}
                        checked={hideAllComments}
                        style={style}
                    />
                    <span>Ẩn tất cả bình luận</span>
                </p>
                <p>
                    <Switch
                        disabled={hiddenModalExpired}
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        onChange={onChangeHidePhoneComments}
                        checked={hidePhoneComments}
                        style={style}
                    />
                    <span>Chỉ ẩn những bình luận chứa số điện thoại</span>
                </p>
            </div>
        );
    };

    return <>{renderContent()}</>;
};

export default Comment;
