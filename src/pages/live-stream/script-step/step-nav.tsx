import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { CheckOutlined } from '@ant-design/icons';
import { useNewLiveStream } from './context';

interface Props {}

const steps: any[] = [
    {
        title: 'Thiết lập chung',
        number: 0,
        to: '0',
    },
    {
        title: 'Tạo từ khóa',
        number: 1,
        to: '1',
    },
    {
        title: 'Tạo cú pháp',
        number: 2,
        to: '2',
    },
    {
        title: 'Trả lời tự động',
        number: 3,
        to: '3',
    },
    {
        title: 'Kích hoạt',
        number: 4,
        to: '4',
    },
];

const Step = ({
    done = false,
    step,
    handleSetCurrent,
}: {
    step: { to: string; title: string; number: number };
    done: boolean;
    handleSetCurrent: (number: number) => void;
}) => {
    const { livestream } = useNewLiveStream();

    const active = () => {
        if (step.number == 0) {
            return true;
        }

        if (step.number == 1) {
            if (livestream.keywords.length > 0) return true;
            return false;
        }

        if (step.number == 2) {
            if (livestream.syntax === 1) return true;
            return false;
        }

        if (step.number == 3) {
            if (livestream.autoReplyIfCommentIsCorrect || livestream.autoReplyIfCommentIsIncorrect)
                return true;
            return false;
        }

        return false;
    };

    const className = `step ${done ? 'done' : ''} ${active() ? 'active' : ''}`;

    const onSetActive = (e: any) => {
        const numberScroll: number = parseInt(e);

        handleSetCurrent(numberScroll);
    };

    return (
        <Link
            to={step.to}
            spy={true}
            activeClass='active'
            onSetActive={onSetActive}
            smooth={true}
            duration={500}
            offset={-20}
            containerId='containerElement'
        >
            <div className={className}>
                <span className='title'>{step.title}</span>
                <span className='number'>{active() ? <CheckOutlined /> : step.number + 1}</span>
            </div>
        </Link>
    );
};

const Scroll = (props: Props) => {
    const [current, setCurrent] = useState(0);

    const handleSetCurrent = (number: number) => {
        setCurrent(number);
    };

    return (
        <div className='steps-nav'>
            {steps.map((step: any) => {
                return (
                    <Step
                        key={step.number}
                        handleSetCurrent={handleSetCurrent}
                        done={step.number <= current}
                        step={step}
                    />
                );
            })}

            <div className='progress'>
                <div className='inner' style={{ width: `${current * 25}%` }} />
            </div>
        </div>
    );
};

export default Scroll;
