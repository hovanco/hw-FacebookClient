import moment from 'moment';

type ITypeTime = 'month' | 'day' | 'week' | 'custom';

interface IGetTime {
    type: string;
    date: any;
}

const format_date = 'DD/MM/YYYY';

export function getStartTime({ type, date }: IGetTime): number {
    // day
    if (type === 'day') {
        return moment(date).startOf('day').toDate().getTime();
    }

    // week
    if (type === 'week') {
        const weekStart = moment(date).startOf('week');

        return moment(weekStart).add(0, 'days').startOf('day').valueOf();
    }

    // custom
    if (type === 'custom') {
        return moment(date[0]).startOf('day').valueOf();
    }

    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

    return moment(`1/${month}/${year}`, format_date).startOf('day').valueOf();
}

export function getEndTime({ type, date }: IGetTime): number {
    // day
    if (type === 'day') {
        return moment(date).endOf('day').toDate().getTime();
    }

    // week
    if (type === 'week') {
        const weekStart = moment(date).startOf('week');

        return moment(weekStart).add(6, 'days').endOf('day').valueOf();
    }

    // custom
    if (type === 'custom') {
        return date[1] ? moment(date[1]).endOf('day').valueOf() : moment().endOf('day').valueOf();
    }
    const dateInMonth: number = moment(date).daysInMonth();
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

    return moment(`${dateInMonth}/${month}/${year}`, format_date).endOf('day').valueOf();
}
