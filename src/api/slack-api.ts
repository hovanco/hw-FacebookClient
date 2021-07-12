import axios from 'axios';

const sendErrorToSlack = async ({ data }: { data: { message: any; data: any } }): Promise<any> => {
    const url = `/social-network/v1/logs`;

    const response = await axios({
        url,
        method: 'POST',
        data,
    });

    return response.data;
};

export { sendErrorToSlack };
