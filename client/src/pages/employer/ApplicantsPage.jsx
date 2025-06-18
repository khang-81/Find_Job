import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

const ApplicantsPage = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Backend không trả về chi tiết job khi lấy applicants, nên cần 2 API calls
                // Hoặc tối ưu backend để trả về cả 2
                const applicantsRes = await api.get(`/jobs/${jobId}/applicants`);
                setApplicants(applicantsRes.data);

                // Lấy tên job để hiển thị
                const jobRes = await api.get(`/jobs/${jobId}`);
                setJobTitle(jobRes.data.Title);
            } catch (error) { console.error("Lỗi:", error); } 
            finally { setLoading(false); }
        };
        fetchData();
    }, [jobId]);

    if (loading) return <p>Đang tải danh sách ứng viên...</p>;

    return (
        <div className="card">
            <h2>Danh sách ứng viên cho: {jobTitle}</h2>
            {applicants.length > 0 ? (
                <table>
                    <thead><tr><th>Tên Sinh Viên</th><th>Email</th><th>Ngày ứng tuyển</th><th>CV</th></tr></thead>
                    <tbody>
                        {applicants.map(app => (
                            <tr key={app.ApplicationId}>
                                <td>{app.FullName}</td>
                                <td>{app.Email}</td>
                                <td>{new Date(app.ApplicationDate).toLocaleDateString()}</td>
                                <td><a href={app.CvUrlAtTimeOfApply} target="_blank" rel="noopener noreferrer">Xem CV</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>Chưa có ứng viên nào.</p>}
        </div>
    );
};

export default ApplicantsPage;
