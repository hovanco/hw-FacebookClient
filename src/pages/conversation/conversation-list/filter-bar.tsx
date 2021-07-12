import { EyeInvisibleOutlined } from '@ant-design/icons';
import { push } from 'connected-react-router';
import { difference, find, intersection } from 'lodash';
import querystring from 'querystring';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BookmarkIcon, PhoneIcon, ReloadIcon, UnPhoneIcon } from '../../../assets/icon';
import { ConversationType } from '../../../collections/facebook-conversation';
import {
    loadConversations,
    removeConversations,
    setCurrentPage,
    setFilterConversation,
} from '../../../reducers/fanpageState/fanpageAction';
import { IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { changePageActive } from '../../../reducers/storeState/storeAction';
import menus from '../sidebar/sidebar-menu';
import FilterBarItem from './filter-bar-item';
import FilterDate from './filter-date';
import FilterLabels from './filter-labels';
import FilterTabs from './filter-tabs';
import FilterIdPost from './filterId-post';

interface Props {
    visible: boolean;
    onChange?: Function;
}

type QueryConversation = {
    type?: number;
    unread?: boolean;
    hasPhoneNo?: boolean;
    label?: string;
    postId?: string;
    startDate?: string;
    endDate?: string;
    fbUserId?: string;
    replied?: boolean;
};

const FilterBar: FC<Props> = ({ visible, onChange }): JSX.Element => {
    const location = useLocation();
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.store.store);
    const pages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.pages);

    const [selected, setSelected] = useState<string[]>([]);
    const [postId, setPostId] = useState<string>();
    const [label, setLabel] = useState<string>();
    const [date, setDate] = useState<string>();

    const menuParent: string[] = menus.parent.map((item) => item.active);

    const handleFilter = (value: string | number, action: string, active: string) => {
        active === 'post_id' && setPostId(value as string);
        active === 'label' && setLabel(value as string);
        active === 'date' && setDate(value as string);
        handleFilterConversation(action, active);
    };

    const handleFilterConversation = (action: string, active: string) => {
        let newSelected: string[];

        dispatch(push('/customer/conversation'));

        if (action === 'delete') {
            newSelected = selected.filter((item) => item !== active);
            if (newSelected.length === 0) {
                newSelected.push('remove');
            }
            setSelected(newSelected);
        } else {
            if (menuParent.includes(active)) {
                newSelected = selected.filter(
                    (item) => !menuParent.filter((menu) => menu !== active).includes(item)
                );
                setSelected([...newSelected, active]);
            } else if (active === 'has_phone' || active === 'not_phone') {
                newSelected = selected.filter((item) => !['has_phone', 'not_phone'].includes(item));
                setSelected([...newSelected, active]);
            } else {
                setSelected([...selected, active]);
            }
        }
    };

    useEffect(() => {
        const query = querystring.parse(location.search.substring(1));

        if (query.pageId) {
            const dataSelected = [...selected];
            switch (parseInt(query.type as string)) {
                case ConversationType.Message:
                    dataSelected.push('message');
                    break;
                case ConversationType.Comment:
                    dataSelected.push('comment');
                    break;
                default:
                    break;
            }

            if (query.postId) {
                dataSelected.push('post_id');
                setPostId(`${query.postId}`);
            }

            setSelected(dataSelected);

            const page = find(pages, (p: any) => p.fbObjectId === `${query.pageId}`);
            dispatch(setCurrentPage(page));
            dispatch(changePageActive(page));
        }
    }, [location]);

    useEffect(() => {
        onChange && onChange(difference(selected, menuParent));

        if (selected.length > 0) {
            dispatch(removeConversations());
            let fbPageId;
            if (store.activePage) {
                fbPageId = store.activePage.fbObjectId;
            }
            if (selected.includes('changePage')) {
                store.queryConversation = undefined;
                dispatch(loadConversations(store.queryConversation, [fbPageId], store.activePage));
                setSelected([]);
                return;
            }
            if (selected.includes('remove')) {
                let selectedTabItem = intersection(selected, menuParent);

                if (selectedTabItem.length > 0) {
                    setSelected(selectedTabItem);
                } else {
                    store.queryConversation = undefined;
                    dispatch(loadConversations(store.queryConversation, [fbPageId]));
                    setSelected([]);
                }
            } else {
                let queryConversation: QueryConversation = {};
                selected.forEach((item) => {
                    if (item === 'comment') {
                        queryConversation.type = 2;
                    }
                    if (item === 'message') {
                        queryConversation.type = 1;
                    }
                    if (item === 'not_read') {
                        queryConversation.unread = true;
                    }
                    if (item === 'has_phone') {
                        queryConversation.hasPhoneNo = true;
                    }
                    if (item === 'not_phone') {
                        queryConversation.hasPhoneNo = false;
                    }
                    if (item === 'not_answer') {
                        queryConversation.replied = false;
                    }
                    if (item === 'post_id') {
                        queryConversation.postId = postId;
                    }
                    if (item === 'label' && label !== '') {
                        queryConversation.label = label;
                    }
                    if (item === 'date') {
                        const arrDate = date ? date.split('-') : [];
                        if (arrDate.length === 2) {
                            queryConversation.startDate = arrDate[0];
                            queryConversation.endDate = arrDate[1];
                        }
                    }
                    if (item === 'user_id') {
                        queryConversation.fbUserId = store.filterUserId;
                    }
                });
                store.queryConversation = querystring.stringify(queryConversation);
                dispatch(loadConversations(store.queryConversation, [fbPageId]));
            }
        }
        dispatch(setFilterConversation(selected));
    }, [selected]);

    useEffect(() => {
        if (store.queryConversation === null) {
            setSelected(['changePage']);
        }
    }, [store.queryConversation]);

    return (
        <>
            {visible && (
                <div className='filter-bar'>
                    <FilterBarItem
                        menu={{ icon: <ReloadIcon />, title: 'Bỏ lọc', active: 'remove' }}
                        selected={selected}
                        onClick={handleFilterConversation}
                    />

                    <FilterBarItem
                        menu={{
                            icon: <EyeInvisibleOutlined />,
                            title: 'Tin chưa đọc',
                            active: 'not_read',
                        }}
                        selected={selected}
                        onClick={handleFilterConversation}
                    />

                    <FilterBarItem
                        menu={{
                            icon: <PhoneIcon />,
                            title: 'Tìm có số điện thoại',
                            active: 'has_phone',
                        }}
                        selected={selected}
                        onClick={handleFilterConversation}
                    />

                    <FilterBarItem
                        menu={{
                            icon: <UnPhoneIcon />,
                            title: 'Tìm không có số điện thoại',
                            active: 'not_phone',
                        }}
                        selected={selected}
                        onClick={handleFilterConversation}
                    />

                    <FilterBarItem
                        menu={{
                            icon: <BookmarkIcon />,
                            title: 'Tìm chưa trả lời',
                            active: 'not_answer',
                        }}
                        selected={selected}
                        onClick={handleFilterConversation}
                    />

                    <FilterDate selected={selected} onClick={handleFilter} />
                    <FilterLabels selected={selected} onClick={handleFilter} />

                    <FilterIdPost selected={selected} onClick={handleFilter} />
                </div>
            )}

            <FilterTabs selected={selected} onClick={handleFilterConversation} />
        </>
    );
};

export default FilterBar;
