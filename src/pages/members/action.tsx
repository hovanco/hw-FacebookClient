import React from 'react';
import { Menu, Dropdown, Button, Drawer } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import FormEditMember from './form-edit-member';
import { Member } from './types';

interface IProps {
    member: Member;
}

function Action({ member }: IProps): JSX.Element {
    const [visible, setVisible] = React.useState(false);

    const toggle = () => setVisible(!visible);
    const removeMember = () => {};
    const menu = (
        <Menu>
            <Menu.Item key='0' onClick={toggle}>
                Sửa
            </Menu.Item>
            <Menu.Item key='3' onClick={removeMember}>
                Xóa
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button>
                    <EllipsisOutlined />
                </Button>
            </Dropdown>

            <Drawer title='Chỉnh sửa' width={500} onClose={toggle} visible={visible}>
                <FormEditMember member={member} toggle={toggle} />
            </Drawer>
        </>
    );
}

export default Action;
