import { Link } from 'react-router-dom';
const UnauthorizedPage = () => (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h1>403 - Không Có Quyền Truy Cập</h1>
        <p>Bạn không có quyền để xem trang này.</p>
        <Link to="/">Quay về trang chủ</Link>
    </div>
);
export default UnauthorizedPage;
