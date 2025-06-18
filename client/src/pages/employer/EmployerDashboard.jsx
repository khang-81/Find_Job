import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/jobs/my-jobs');
            setJobs(data);
        } catch (error) {
            console.error("Lỗi:", error);  // Log lỗi chi tiết
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);
    
    const handleDelete = async (jobId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tin này?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                alert('Xóa tin thành công!');
                fetchMyJobs(); // Refresh the list
            } catch (error) {
                alert('Xóa tin thất bại!');
                console.error("Error deleting job:", error);  // Log lỗi chi tiết
            }
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div>
            <h1>Dashboard Nhà Tuyển Dụng</h1>
            <Link to="/employer/post-job"><button>Đăng tin mới</button></Link>
            <div className="card" style={{ marginTop: '2rem' }}>
                <h2>Các tin đã đăng</h2>
                {jobs.length > 0 ? (
                    <table>
                        <thead><tr><th>Tiêu đề</th><th>Trạng thái</th><th>Ngày đăng</th><th>Hành động</th></tr></thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.JobId}>
                                    <td>{job.Title}</td>
                                    <td>{job.Status}</td>
                                    <td>{new Date(job.CreatedAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/employer/jobs/${job.JobId}/applicants`}><button className="secondary">Xem CV</button></Link>
                                        <Link to={`/employer/jobs/edit/${job.JobId}`}><button>Sửa</button></Link>
                                        <button className="danger" onClick={() => handleDelete(job.JobId)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>Bạn chưa đăng tin nào.</p>}
            </div>
        </div>
    );
};

export default EmployerDashboard;
