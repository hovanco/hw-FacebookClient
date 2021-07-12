import { SyncOutlined } from '@ant-design/icons';
import querystring from 'querystring';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ILabel } from '../../../collections/label';
import {
    loadConversations,
    removeConversations,
} from '../../../reducers/fanpageState/fanpageAction';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import FilterDate from './filter-date';
import FilterLabel from './filter-labels';
import FilterIdPost from './filterId-post';
import SidebarItem from './sidebar-item';
import menus, { SidebarItemType } from './sidebar-menu';

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

const Sidebar: FC = () => {
    const labelsSetting = useSelector((state: any) => state.label.labels);
    const [selected, setSelected] = useState<string[]>([]);
    const [postId, setPostId] = useState<string>();
    const [label, setLabel] = useState<string>();
    const [date, setDate] = useState<string>();
    const [labels, setLabels] = useState<ILabel[]>([]);

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const menuParent: string[] = menus.parent.map((item) => item.active);

    const handleFilterConversation = (action: string, active: string) => {
        let newSelected: string[];
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

    const handleFilter = (value: string | number, action: string, active: string) => {
        active === 'post_id' && setPostId(value as string);
        active === 'label' && setLabel(value as string);
        active === 'date' && setDate(value as string);
        handleFilterConversation(action, active);
    };

    const dispatch = useDispatch();

    useEffect(() => {
        setLabels(
            Object.keys(labelsSetting).map((key: string) => ({
                ...labelsSetting[key],
            }))
        );
    }, [labelsSetting]);

    useEffect(() => {
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
                store.queryConversation = undefined;
                dispatch(loadConversations(store.queryConversation, [fbPageId]));
                setSelected([]);
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
    }, [selected]);

    useEffect(() => {
        if (store.queryConversation === null) {
            setSelected(['changePage']);
        }
    }, [store.queryConversation]);

    return (
        <>
            <SidebarItem
                menu={{
                    icon: <SyncOutlined />,
                    title: 'Bỏ lọc',
                    active: 'remove',
                }}
                selected={selected}
                onClick={handleFilterConversation}
            />

            {menus.parent.map((menu: SidebarItemType) => (
                <SidebarItem
                    key={menu.title}
                    menu={menu}
                    selected={selected}
                    onClick={handleFilterConversation}
                />
            ))}

            {menus.chidlren.map((menu) => (
                <SidebarItem
                    menu={menu}
                    key={menu.title}
                    selected={selected}
                    onClick={handleFilterConversation}
                />
            ))}

            <FilterDate selected={selected} onClick={handleFilter} />
            <FilterLabel selected={selected} labels={labels} onClick={handleFilter} />
            <FilterIdPost selected={selected} onClick={handleFilter} />
        </>
    );
};

export default Sidebar;
