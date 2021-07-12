import React from 'react';
import './style.less';

import facebook from './facebook.png';
import google from './google.png';
import twitter from './twitter.png';
import zalo from './zalo.png';

function Footer(): JSX.Element {
    return (
        <footer className='footer'>
            <div className='container'>
                <div className='footer-top'>
                    <div className='row'>
                        <div className='footer-col'>
                            <div className='heading'>
                                <h4>DOANH NGHIỆP</h4>
                            </div>

                            <ul>
                                <li>
                                    <a href=''>Về INSA</a>
                                </li>
                                <li>
                                    <a href=''>Khách hàng</a>
                                </li>
                                <li>
                                    <a href=''>Điều khoảng sử dụng</a>
                                </li>
                                <li>
                                    <a href=''>Chính sách bảo mật</a>
                                </li>
                                <li>
                                    <a href=''>Liên hệ</a>
                                </li>
                            </ul>
                        </div>
                        <div className='footer-col'>
                            <div className='heading'>
                                <h4>NGÀNH HÀNG</h4>
                            </div>

                            <ul>
                                <li>
                                    <a href=''>Cửa hàng thời trang</a>
                                </li>
                                <li>
                                    <a href=''>Cửa hàng thực phẩm</a>
                                </li>
                                <li>
                                    <a href=''>Điện thoại & điện máy</a>
                                </li>
                                <li>
                                    <a href=''>Cửa hàng tạp hóa</a>
                                </li>
                                <li>
                                    <a href=''>Cửa hàng mỹ phẩm</a>
                                </li>
                                <li>
                                    <a href=''>Hoa & quà tặng</a>
                                </li>
                                <li>
                                    <a href=''>Siêu thị mini</a>
                                </li>
                                <li>
                                    <a href=''>Cửa hàng mẹ và bé</a>
                                </li>
                                <li>
                                    <a href=''>Cửa hàng đồ chơi</a>
                                </li>
                                <li>
                                    <a href=''>Bar, Café & Nhà hàng Karaoke</a>
                                </li>
                                <li>
                                    <a href=''>Xe, máy móc & linh kiện sửa chửa</a>
                                </li>
                                <li>
                                    <a href=''>Sách & văn phòng phẩm</a>
                                </li>
                                <li>
                                    <a href=''>Vật liệu xây dựng</a>
                                </li>
                                <li>
                                    <a href=''>Nội thất và gia dụng</a>
                                </li>
                                <li>
                                    <a href=''>Ngành hàng khác</a>
                                </li>
                            </ul>
                        </div>

                        <div className='footer-col'>
                            <div className='heading'>
                                <h4>HỖ TRỢ</h4>
                            </div>
                            <ul>
                                <li>
                                    <a href=''>Video hướng dẫn sử dụng</a>
                                </li>
                                <li>
                                    <a href=''>Câu hỏi thường gặp</a>
                                </li>
                                <li>
                                    <a href=''>Wiki Insa</a>
                                </li>
                                <li>
                                    <a href=''>Blog</a>
                                </li>
                                <li>
                                    <a href=''>Hướng dẫn sử dụng</a>
                                </li>
                                <li>
                                    <a href=''>Thông tin cập nhật Insa</a>
                                </li>
                            </ul>
                        </div>
                        {/* <div className='footer-col'>
                            <div className='heading'>
                                <h4>LIÊN HỆ</h4>
                            </div>
                            <ul>
                                <li>Hotline</li>
                                <li>Tư vấn bán hàng:</li>
                                <li className='blue-text'>
                                    <a className='blue-text'>1900 1020</a>
                                </li>
                                <li>Chăm sóc khách hàng:</li>
                                <li className='blue-text'>
                                    <a className='blue-text'>1900 2356</a>
                                </li>
                                <li>
                                    Email:
                                    <a className='blue-text' href='mailto:support@insa.app'>
                                        support@insa.app
                                    </a>
                                </li>
                                <li>MẠNG XÃ HỘI:</li>
                                <li>
                                    <a className='social'>
                                        <img src={facebook} alt='facebook' />
                                    </a>
                                    <a className='social'>
                                        <img src={twitter} alt='twitter' />
                                    </a>
                                    <a className='social'>
                                        <img src={google} alt='google' />
                                    </a>
                                    <a className='social'>
                                        <img src={zalo} alt='zalo' />
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
                <div className='footer-bottom'>
                    <span>© GCO GROUP 2018. All rights reserved</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
