import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Modal } from 'antd';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import livestreamApi from '../../../api/livestream-api';
import { DownIcon } from '../../../assets/icon';
import { ILivestreamScript } from '../../../collections/livestream-script';
import ScriptCopy from '../scripts/script-copy';

interface Props {
    script: ILivestreamScript;
}

const ScriptAction: FC<Props> = ({ script }) => {
    const history = useHistory();
    const store = useSelector((state: any) => state.store.store);

    const removeScript = () => {
        Modal.confirm({
            title: 'Xóa kịch bản',
            icon: <ExclamationCircleOutlined />,
            content: (
                <span>
                    Bạn chắc chắn muốn xóa kịch bản <strong>{script.name}</strong>
                </span>
            ),
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk() {
                return livestreamApi
                    .deleteScript({
                        storeId: store._id,
                        fbPageId: script.fbPageId,
                        scriptId: script._id,
                    })
                    .then((res) => {
                        history.push('/customer/livestream/scripts');
                        message.success('Xóa kịch bản thành công');
                    })
                    .catch((error) => {
                        message.error('Lỗi xóa kịch bản');
                    });
            },
        });
    };

    const script_copy = {
        ...script,
        keywords: script.keywords.map((keyword: any) => {
            const products = keyword.products.map((product: any) => {
                return {
                    price: product.price,
                    productId: product.productId._id,
                };
            });
            return {
                keyword: keyword.keyword,
                products,
            };
        }),
    };

    const menu = (
        <Menu>
            {script.status === 0 ? (
                <Menu.Item>
                    <Link to={`/customer/livestream/script/${script.fbPageId}/${script._id}/edit`}>
                        Sửa
                    </Link>
                </Menu.Item>
            ) : (
                <></>
            )}
            <Menu.Item>
                <ScriptCopy script={script_copy}>
                    <span>Sao chép</span>
                </ScriptCopy>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={removeScript}>Xóa</Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} arrow trigger={['click']}>
            <Button className='trigger-dropdown-btn'>
                <DownIcon />
            </Button>
        </Dropdown>
    );
};

export default ScriptAction;
