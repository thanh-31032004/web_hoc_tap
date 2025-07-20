import React from 'react';
import { Layout, Typography, Space } from 'antd';
import {
    GithubOutlined,
    LinkedinOutlined,
    FacebookOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer = () => {
    return (
        <AntFooter style={{
            textAlign: 'center',
            backgroundColor: '#1f1f1f',
            color: 'white',
            padding: '30px 20px',
        }}>
            <Text style={{ color: '#aaa' }}>
                © {new Date().getFullYear()} Học Cùng AI. All rights reserved.
            </Text>

            <div style={{ marginTop: 12 }}>
                <Space size="middle">
                    <Link href="https://github.com/your-github" target="_blank" rel="noopener">
                        <GithubOutlined style={{ fontSize: 24, color: 'white' }} />
                    </Link>
                    <Link href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener">
                        <LinkedinOutlined style={{ fontSize: 24, color: 'white' }} />
                    </Link>
                    <Link href="https://facebook.com/your-facebook" target="_blank" rel="noopener">
                        <FacebookOutlined style={{ fontSize: 24, color: 'white' }} />
                    </Link>
                </Space>
            </div>

            <Text style={{ display: 'block', marginTop: 16, color: '#888' }}>
                Được xây dựng với ❤️ bởi đội ngũ Học Cùng AI
            </Text>
        </AntFooter>
    );
};

export default Footer;
