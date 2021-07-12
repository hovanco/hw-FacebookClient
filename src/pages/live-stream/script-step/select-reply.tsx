import { CheckCircleOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Input } from 'antd';
import React, { useState } from 'react';
import { isNull } from 'lodash';

interface Props {
    text?: string;
    templates: any;
    changeTemplate: (text: string) => void;
}

const SelectReply = (props: Props) => {
    const [teamplateId, setTemplateId] = useState(props.templates[0].id || '1');

    const handleMenuClick = (menu: any) => {
        setTemplateId(menu.key);

        const template = props.templates.find((template: any) => template.id === menu.key);

        props.changeTemplate(template.text);
    };

    const handleInputChange = (event: any) => {
        props.changeTemplate(event.target.value || undefined);
    };

    const menu = (
        <Menu onClick={handleMenuClick} style={{ width: 500 }}>
            {props.templates.map((template: any) => {
                return (
                    <Menu.Item
                        key={template.id}
                        active={template.id === teamplateId}
                        style={{ whiteSpace: 'normal' }}
                        icon={
                            template.id === teamplateId ? (
                                <CheckCircleOutlined style={{ color: '#1890ff' }} />
                            ) : (
                                isNull
                            )
                        }
                    >
                        {template.text}
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    return (
        <div>
            <p>
                Gợi ý từ thư viện nội dung:
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        icon={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
                        style={{ marginLeft: 5 }}
                    >
                        <span style={{ margin: '0 30px 0 15px' }}>{`Mẫu ${teamplateId}`}</span>{' '}
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </p>

            <Input.TextArea
                rows={5}
                value={props.text}
                onChange={handleInputChange}
            ></Input.TextArea>
        </div>
    );
};

export default SelectReply;
