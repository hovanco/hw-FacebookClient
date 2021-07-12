import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { sendErrorToSlack } from '../../api/slack-api';

interface Props {
    children: ReactNode;
}

class ErrorBoundary extends React.Component<Props, any> {
    constructor(props: any) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: any, errorInfo: any) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        const { propsAll }: any = this.props;

        let message = `${error && error.toString()}`;
        message = message.substring(0, 255);
        if (window.location.href.indexOf('localhost') === -1) {
            sendErrorToSlack({
                data: {
                    message,
                    data: {
                        storeId: get(propsAll, 'store.store._id', ''),
                        userId: get(propsAll, 'auth.user._id', ''),
                        'user-agent': navigator && navigator.userAgent,
                        router: window && window.location.href,
                        error: errorInfo,
                    },
                },
            });
        }
    }

    render() {
        const { errorInfo, error } = this.state;

        if (errorInfo) {
            // Error path
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {error && error.toString()}
                        <br />
                        {errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        // Normally, just render children
        return this.props.children;
    }
}

const mapStateToProps = (state: any) => ({ propsAll: state });

export default connect(mapStateToProps, null)(ErrorBoundary);
