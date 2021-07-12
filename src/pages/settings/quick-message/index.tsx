import { InputNumber, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteQuickMessageAction, loadQuickMessageAction } from '../../../actions/setting';
import useModal from '../../../hooks/use-modal';
import { FanpageStateInterface, QuickMessageInterface } from '../../../reducers/setting/interfaces';
import Action from './actions';
import QuickMessageHeader from './header';
import QuickMessageModal from './modal';
import ModalCopyMessage from './modal-copy-message';
import './style.less';

function QuickMessage(): JSX.Element {
    const dispatch = useDispatch();
    const { pages, page } = useSelector((state: any) => state.fanpage);
    const loading = useSelector((state: any) => state.setting.loading);
    const quickMessage = useSelector((state: any) => state.setting.quickMessage);
    const { visible, toggle } = useModal();
    const [isShowModalCopy, setShowModalCopy] = useState(false);
    const [dataSource, setDataSource] = useState<QuickMessageInterface[]>([]);
    const [currentPage, setCurrentPage] = useState<FanpageStateInterface>(() => {
        if (Object.keys(pages).length === 0) return undefined;

        if (page) return page;

        const firstPage = Object.keys(pages)[0];

        return pages[firstPage];
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    const [currentItem, setCurrentItem] = useState<QuickMessageInterface>();
    const quickMessages: QuickMessageInterface[] = Object.values(quickMessage);

    useEffect(() => {
        if (currentPage) {
            dispatch(
                loadQuickMessageAction({
                    pageId: currentPage.fbObjectId,
                    storeId: currentPage.storeId,
                })
            );
        }
    }, [loadQuickMessageAction, currentPage]);

    useEffect(() => {
        setDataSource(quickMessages);
    }, [quickMessage]);

    const handleChangePage = (pageId: string) => {
        setCurrentPage(pages[pageId]);
    };

    const handleDelete = (quickId: string) => {
        dispatch(
            deleteQuickMessageAction({
                quickId,
                pageId: currentPage._id,
                storeId: currentPage.storeId,
            })
        );
    };

    const handleShowModal = (val: any) => {
        setCurrentItem((prevState) => ({ ...prevState, ...val }));
        toggle();
    };

    const handleSearch = (val: string) => {
        const filterTable = quickMessages.filter((o: any) =>
            Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(val.toLowerCase()))
        );

        setDataSource(filterTable);
    };

    const columns: ColumnsType<any> | undefined = [
        {
            title: <span className='th'>Phím tắt</span>,
            dataIndex: 'shortcut',
            key: 'shortcut',
        },
        {
            title: <span className='th'>Tiêu đề</span>,
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record: any) => (
                <Tag style={{ color: record.color }} color={record.backgroundColor}>
                    {title}
                </Tag>
            ),
        },
        {
            title: <span className='th'>Sắp xếp</span>,
            dataIndex: 'order',
            key: 'order',
            render: (order: number) => {
                return <InputNumber defaultValue={order} min={0} />;
            },
        },
        {
            title: <span className='th'>Tin nhắn</span>,
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: '',
            align: 'right',
            key: 'message',
            render: (row: any): ReactNode => (
                <Action
                    onEdit={() => handleShowModal({ ...row, mode: 'update' })}
                    onDelete={() => handleDelete(row._id)}
                />
            ),
        },
    ];

    const onSelectChange = (ids: any) => {
        setSelectedRowKeys(ids);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div>
            <QuickMessageHeader
                defaultPage={currentPage && currentPage._id}
                toggle={() => handleShowModal({ mode: 'create' })}
                toggleModalCopy={() => setShowModalCopy(!isShowModalCopy)}
                onSearch={handleSearch}
                onChangePage={handleChangePage}
            />
            <div style={{ marginTop: 20 }}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowSelection={rowSelection}
                    rowKey='_id'
                    loading={loading}
                />
            </div>

            {currentPage && (
                <>
                    <QuickMessageModal
                        visible={visible}
                        toggle={toggle}
                        data={{
                            ...currentItem,
                            pageId: currentPage.fbObjectId,
                            storeId: currentPage.storeId,
                        }}
                        setCurrentItem={setCurrentItem}
                    />
                    <ModalCopyMessage
                        quickAnswerIds={selectedRowKeys}
                        pageId={currentPage._id}
                        storeId={currentPage.storeId}
                        visible={isShowModalCopy}
                        toggle={() => setShowModalCopy(!isShowModalCopy)}
                    />
                </>
            )}
        </div>
    );
}

export default QuickMessage;
