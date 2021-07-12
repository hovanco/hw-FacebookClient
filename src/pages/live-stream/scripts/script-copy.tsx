import { Form, Input, message, Modal, Select } from 'antd';
import { map } from 'lodash';
import React, { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import livestreamApi from '../../../api/livestream-api';
import useModal from '../../../hooks/use-modal';
import { loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';
import { ILivestreamScript } from '../../../collections/livestream-script';

interface Props {
    script: ILivestreamScript;
    children: ReactElement;
}

const size = 'large';

const ScriptCopy = ({ script, children }: Props) => {
    const dispatch = useDispatch();
    const pages = useSelector((state: any) => state.fanpage.pages);
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState(false);

    const { toggle, visible } = useModal();

    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    setLoading(true);

                    await livestreamApi.copyLivestream({
                        storeId: store._id,
                        fbPageId: values.fbPageId,
                        data: {
                            scriptId: script._id,
                            name: values.name,
                        },
                    });

                    message.success('Sao chép kịch bản thành công!');

                    setLoading(false);
                    toggle();

                    dispatch(loadLivestreams());
                } catch (error) {
                    message.error('Lỗi sao chép kịch bản');
                    setLoading(false);
                }
            })
            .catch((info) => {});
    };

    return (
        <div>
            {React.cloneElement(children, { onClick: toggle })}

            <Modal
                visible={visible}
                onCancel={toggle}
                title='Xác nhận sao chép kịch bản'
                okText='Đồng ý'
                cancelText='Hủy'
                okButtonProps={{
                    loading,
                }}
                onOk={handleOk}
            >
                <Form
                    form={form}
                    layout='vertical'
                    initialValues={{
                        fbPageId: script.fbPageId,
                        name: `Sao chép - ${script.name}`,
                    }}
                >
                    <p>
                        Lựa chọn 1 trang mà bạn muốn sao chép cho kịch bản{' '}
                        <strong>{script.name}</strong>
                    </p>
                    <Form.Item
                        name='fbPageId'
                        label='Chọn trang'
                        rules={[{ required: true, message: 'Chọn 1 trang để sao chép' }]}
                    >
                        <Select style={{ width: '100%' }} size={size}>
                            {map(pages, (page: any) => (
                                <Select.Option key={page.fbObjectId} value={page.fbObjectId}>
                                    {page.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='name'
                        label='Tên kịch bản'
                        rules={[{ required: true, message: 'Điền tên kịch bản' }]}
                    >
                        <Input size={size} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ScriptCopy;
