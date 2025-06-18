import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

const StudentProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setProfile(data.profile || {});
            } catch {
                console.error("Lỗi khi tải hồ sơ");
            } finally {
                setLoading(false);
            }
        };
        if(user) fetchProfile();
    }, [user]);

    const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });
    
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await api.put('/users/profile/student', profile);
            alert('Cập nhật hồ sơ thành công!');
        } catch {
            alert('Cập nhật thất bại!');
        }
    };

    if (loading) return <p>Đang tải hồ sơ...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Hồ sơ sinh viên</h2>
            <label>Trường học</label>
            <input name="SchoolName" value={profile.SchoolName || ''} onChange={handleChange} />
            <label>Chuyên ngành</label>
            <input name="Major" value={profile.Major || ''} onChange={handleChange} />
            <label>Năm học</label>
            <input type="number" name="AcademicYear" value={profile.AcademicYear || ''} onChange={handleChange} />
            <label>Link CV (Google Drive, TopCV,...)</label>
            <input name="CvUrl" value={profile.CvUrl || ''} onChange={handleChange} />
            <label>Mô tả kỹ năng</label>
            <textarea name="SkillsDescription" rows="3" value={profile.SkillsDescription || ''} onChange={handleChange}></textarea>
            <label>Kinh nghiệm</label>
            <textarea name="Experience" rows="5" value={profile.Experience || ''} onChange={handleChange}></textarea>
            <button type="submit">Lưu thay đổi</button>
        </form>
    );
};

export default StudentProfilePage;
