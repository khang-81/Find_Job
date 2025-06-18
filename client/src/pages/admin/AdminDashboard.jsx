import { useState, useEffect } from 'react';
import api from '../../api/api';
import ManageUsers from '../../pages/admin/ManageUsers';

const PendingJobs = () => {
    const [jobs, setJobs] = useState([]);
    
    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/admin/jobs/pending');
            setJobs(data);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleApproval = async (jobId, approve) => {
        try {
            await api.put(`/admin/jobs/${jobId}/approve`, { approve });
            alert(`Tin đã được ${approve ? 'duyệt' : 'từ chối'}.`);
            fetchJobs(); // Refresh list
        } catch {
            alert("Có lỗi xảy ra");
        }
    };

    return (
        <div className="card">
            <h3>Tin chờ duyệt</h3>
            {jobs.length > 0 ? (
                <table>
                    <thead><tr><th>Tiêu đề</th><th>Hành động</th></tr></thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.JobId}>
                                <td>{job.Title}</td>
                                <td>
                                    <button onClick={() => handleApproval(job.JobId, true)}>Duyệt</button>
                                    <button className="danger" onClick={() => handleApproval(job.JobId, false)}>Từ chối</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>Không có tin nào đang chờ duyệt.</p>}
        </div>
    );
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="tabs">
                <button className={`tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>Duyệt tin</button>
                <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Quản lý Người dùng</button>
            </div>
            {activeTab === 'jobs' && <PendingJobs />}
            {activeTab === 'users' && <ManageUsers />} {/* Đảm bảo đường dẫn tới ManageUsers đúng */}
        </div>
    );
};

export default AdminDashboard;
