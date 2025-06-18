import { Link } from 'react-router-dom';
const NotFoundPage = () => (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h1>404 - Không Tìm Thấy Trang</h1>
        <p>Trang bạn đang tìm kiếm không tồn tại.</p>
        <Link to="/">Quay về trang chủ</Link>
    </div>
);
export default NotFoundPage;