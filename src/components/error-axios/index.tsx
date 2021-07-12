import axios from 'axios';
import { get, every } from 'lodash';
import React, { useEffect, useState } from 'react';

import ErrorPage from '../../pages/maintained';

const ApiRequests = (Wrapped: any) => {
    function CheckRequests(props: any): JSX.Element {
        const [hasError, setHasError] = useState(false);

        const ignoredEndpoints = ['/users/info', 'validate-token'];

        useEffect(() => {
            axios.interceptors.response.use(
                function (response) {
                    return response;
                },
                function (error) {
                    if (
                        get(error, 'response.config.method') === 'get' &&
                        every(ignoredEndpoints, endpoint => !get(error, 'response.config.url').includes(endpoint))
                    ) {
                        setHasError(true);
                    }
                    return Promise.reject(error);
                }
            );
        });

        return hasError ? <ErrorPage /> : <Wrapped {...props} />;
    }
    return CheckRequests;
};

export default ApiRequests;
