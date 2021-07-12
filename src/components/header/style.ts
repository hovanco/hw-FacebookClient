import styled from 'styled-components';
import theme from '../../theme';

const HeaderWrap = styled.div`
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    min-height: ${theme.size.header}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.size.space - 2}px ${theme.size.space * 2}px;
`;

const MenuLeftStyle = styled.ul`
    padding: 0;
    margin: 0 0 0 50px;
    list-style: none;
    display: flex;

    li {
        margin-right: ${theme.size.space * 2}px;

        a {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            &:hover {
                color: ${theme.color.primary};
            }
        }
    }
`;

const MenuMobileWrap = styled.div`
    position: fixed;
    z-index: 10;
    top: 82px;
    bottom: 0px;
    background: #f3f3f3;
    width: 80%;
    transition: 0.4s all;

    ul {
        padding: 0;
        margin: 0;
        list-style: none;

        li.menu-item {
            border-bottom: 1px solid #ddd;

            a {
                display: block;
                padding: 10px;
            }
        }
    }
`;

export { HeaderWrap, MenuLeftStyle, MenuMobileWrap };
