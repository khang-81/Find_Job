import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const HomePage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            // Lưu ý: Backend cần hỗ trợ query `search`
            const { data } = await api.get('/jobs', { params: { search: searchTerm } });
            setJobs(data);
        } catch (error) {
            console.error("Lỗi khi tải việc làm:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div>
            <h1>Tìm kiếm cơ hội việc làm</h1>
            <div className="search-bar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Nhập kỹ năng, chức danh, công ty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">Tìm kiếm</button>
                </form>
            </div>
            
            {loading ? <p>Đang tải danh sách việc làm...</p> : (
                <div className="job-list">
                    {jobs.length > 0 ? jobs.map(job => (
                        <div key={job.JobId} className="card">
                            <h2><Link to={`/jobs/${job.JobId}`}>{job.Title}</Link></h2>
                            <p><strong>Công ty:</strong> {job.CompanyName}</p>
                            <p><strong>Lương:</strong> {job.SalaryDescription}</p>
                            <p><strong>Địa điểm:</strong> {job.IsRemote ? 'Làm việc từ xa' : job.LocationName || 'Cập nhật sau'}</p>
                        </div>
                    )) : <p>Không tìm thấy tin tuyển dụng nào phù hợp.</p>}
                </div>
            )}
        </div>
    );
};

export default HomePage;
