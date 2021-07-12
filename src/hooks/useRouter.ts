import { useHistory } from 'react-router-dom';

const useRouter = () => {
    const history = useHistory();

    return {
        push: history.push,
    };
};

export default useRouter;
