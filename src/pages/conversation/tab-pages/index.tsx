import { PushpinOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Menu } from 'antd';
import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadQuickMessageAction } from '../../../actions/setting';
import { PlusDashedCircle } from '../../../assets/icon';
import HeaderRight from '../../../components/header-customer/header-right';
import {
    removeConversations, setNullForConversation
} from '../../../reducers/fanpageState/fanpageAction';
import { IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { loadLabels } from '../../../reducers/labelState/labelAction';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';
import Pages from './pages';
import './tab-pages.less';

const TabPages: FC = (): JSX.Element => {
    const pages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.pages);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);
    const [pagesShow, setPagesShow] = useState([...Object.keys(pages)]);
    const [pagesHide, setPagesHide] = useState([]);
    const dispatch = useDispatch();

    const arrPage = Object.keys(pages).map((key: string) => pages[key]);
    const [pageActive, setPageActive] = useState<any>({
        _id: arrPage[0]._id,
        fbObjectId: arrPage[0].fbObjectId,
    });
    if (!store.activePage) {
        store.activePage = arrPage[0];
    }

    useEffect(() => {
        function isActive(page: any) {
            return pageActive._id === page
        }
        if (pagesShow.findIndex(item => isActive(item)) < 0) {
            handleSelectPage(pages[pagesShow[0]]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagesShow, pageActive])

    useEffect(() => {
        let fbpageId;
        if (store.activePage) {
            fbpageId = store.activePage.fbObjectId;
            setPageActive(store.activePage);
        } else {
            fbpageId = pageActive.fbObjectId;
        }

        const data = {
            pageId: fbpageId,
            storeId: store._id,
        };

        dispatch(loadQuickMessageAction(data));
        dispatch(loadLabels(fbpageId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.activePage]);

    const pinPage = (page: any) => {

        function isNot(item: string, page: any) {
            return item !== page._id
        }
        setPagesHide(prev => prev.filter(item => isNot(item, page)));
        setPagesShow(prev => [...prev, page._id]);
    }

    const handleSelectPage = (page: any) => {

        if (!pagesShow.includes(page._id)) {
            setPagesHide(prev => prev.filter(item => item !== page._id));
            setPagesShow(prev => [page._id, ...prev]);
        }

        if (page._id === pageActive._id) {
            // setPageActive({ _id: null });
            // store.activePage = null;
            // dispatch(loadConversations(store.queryConversation));
            return;
        } else {
            setPageActive(page);
            store.activePage = page;
            store.queryConversation = null;
            dispatch(removeConversations());
            dispatch(setNullForConversation());
        }
    };

    const menus = (
        <Menu>
            {pagesHide.map((key: string) => (
                <Menu.Item
                    key={key}
                    className={pageActive._id === pages[key]._id ? 'page-active' : ''}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <div onClick={() => handleSelectPage(pages[key])}>
                        <Avatar
                            src={generateUrlImgFb(
                                pages[key].fbObjectId,
                                pages[key].accessToken
                            )}
                            icon={<UserOutlined />}
                            size='small'
                            style={{ marginRight: 10 }}
                        />
                        <Badge className='badge' count={pages[key].countUnread}>
                            <span className='text' style={{ marginRight: 12 }}>
                                {pages[key].name}
                            </span>
                        </Badge>
                    </div>
                    <PushpinOutlined
                        style={{ marginLeft: 20, cursor: 'default' }}
                        onClick={() => pinPage(pages[key])}
                    />
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <HeaderRight>
            <div className='tab-pages'>
                <div className='tab-pages-items'>
                    <span className='title text'>Hộp thoại từ</span>
                    <Pages
                        items={pagesShow}
                        setItems={setPagesShow}
                        pages={pages}
                        pageActive={pageActive}
                        handleSelectPage={handleSelectPage}
                        setPagesHide={setPagesHide}
                    />
                    <Link to='/customer/select-pages' style={{ lineHeight: 1 }}>
                        <PlusDashedCircle style={{ fontSize: 22, marginLeft: 10 }} />
                    </Link>
                </div>
                {pagesHide.length > 0 ?
                    <Dropdown overlay={menus} placement='bottomRight' trigger={['click']}>
                        <div className='btn-page menus'>
                            <span className='text'>
                                <UnorderedListOutlined />
                            </span>
                        </div>
                    </Dropdown> :
                    <></>
                }
            </div>
        </HeaderRight>
    );
};

export default memo(TabPages);
