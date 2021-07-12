import { Card, message, Modal, Table } from 'antd';
import { get, map } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as settingApi from '../../../api/setting';
import { ILabel } from '../../../collections/label';
import { Loading } from '../../../components';
import useModal from '../../../hooks/use-modal';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';
import { loadLabels, removeLabel } from '../../../reducers/labelState/labelAction';
import Actions from './actions';
import { useContextLabel } from './context';
import EditLabel from './edit-label';
import EditOrderLabel from './edit-label-order';
import EditLabelStatus from './edit-label-status';
import FormAddLabel from './form-add-label';

const LabelTable: FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const pages = useSelector((state: any) => state.fanpage.pages);
    const loading = useSelector((state: any) => state.label.loading);
    const store = useSelector((state: any) => state.store.store);
    const labels = useSelector((state: any) => state.label.labels);

    const { visible, toggle } = useModal();
    const [label, setLabel] = useState<ILabel | undefined>(undefined);

    const { page, setLabelIds } = useContextLabel();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        if (page && Object.keys(pages).length > 0) {
            const page_exist = pages[page];

            if (page_exist) {
                const pageId = get(page_exist, 'fbObjectId');
                dispatch(loadLabels(pageId));
            }
        }

        // eslint-disable-next-line
    }, [page]);

    if (!page)
        return (
            <Card style={{ height: 300 }}>
                <Loading full />
            </Card>
        );

    const handleDelete = async (labelId: string) => {
        const pageId = (pages[page as string] as Page).fbObjectId;
        const storeId = store._id;
        try {
            const data = {
                storeId,
                pageId,
                labelId,
            };
            settingApi.removeLabel(data).then(() => {
                dispatch(removeLabel(labelId));
                message.success('Đã xóa nhãn hội thoại');
            });
        } catch (error) {
            message.error('Lỗi xóa nhãn hội thoại');
        }
    };

    const dataSource = map(labels, (label: ILabel) => ({
        ...label,
        key: label._id,
    }));

    const columns: any = [
        {
            title: <span className='th'>Tên nhãn</span>,
            dataIndex: '',
            render: (label: ILabel) => {
                return <EditLabel label={label} />;
            },
            key: 'name',
        },

        {
            title: <span className='th'>Sắp xếp</span>,
            dataIndex: '',
            key: 'order',
            render: (label: ILabel) => {
                const pageId = (pages[page as string] as Page).fbObjectId;

                const storeId = store._id;
                return <EditOrderLabel label={label} storeId={storeId} pageId={pageId} />;
            },
        },

        {
            title: <span className='th'>Trạng thái</span>,
            dataIndex: '',
            key: 'status',
            render: (label: ILabel) => {
                const pageId = (pages[page as string] as Page).fbObjectId;
                const storeId = store._id;
                return <EditLabelStatus label={label} storeId={storeId} pageId={pageId} />;
            },
        },

        {
            title: '',
            dataIndex: '',
            render: (label: ILabel) => {
                return (
                    <Actions
                        onEdit={() => {
                            toggle();
                            setLabel(label);
                        }}
                        onDelete={() => handleDelete(label._id)}
                    />
                );
            },
            key: 'name',
        },
    ];

    const onSelectChange = (selectedRowKeys: any) => {
        setSelectedRowKeys(selectedRowKeys);
        setLabelIds(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                loading={loading}
                dataSource={dataSource}
            />

            <Modal
                wrapClassName='modal-update-label'
                visible={visible}
                onCancel={toggle}
                title='Sửa nhãn hội thoại'
                footer={null}
                destroyOnClose
            >
                <FormAddLabel toggle={toggle} label={label} />
            </Modal>
        </>
    );
};

export default LabelTable;
