import React from 'react';
import { WeatherSunny } from '../../../assets/icon';

interface Props {
    title: string;
}

const CardTitle = (props: Props) => {
    return (
        <div>
            <WeatherSunny />

            <span>{props.title}</span>
        </div>
    );
};

export default CardTitle;
