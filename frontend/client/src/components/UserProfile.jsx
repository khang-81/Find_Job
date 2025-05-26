// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineMail, AiOutlineTags } from 'react-icons/ai';
import { FaBuilding, FaCalendarAlt, FaCommentAlt } from 'react-icons/fa';
import { GiSkills } from 'react-icons/gi';
import { MdDescription } from 'react-icons/md';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiRequest } from '../services';
import {FaLocationDot} from "react-icons/fa6";

const UserProfile = () => {
    const userId = parseInt(useSelector((state) => state.userDetail?.id), 10) || null;
    const userName = useSelector((state) => state.userDetail?.name) || 'N/A';
    const email = useSelector((state) => state.userDetail?.email) || 'N/A';
    const token = useSelector((state) => state.jwtToken) || null;

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);
    useNavigate();
    const [profileData, setProfileData] = useState({
        email: email,
        jobTitle: 'N/A',
        company: 'N/A',
        location: 'N/A',
        about: 'N/A',
        skills: [],
        experiences: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        const updatedExperiences = [...profileData.experiences];
        updatedExperiences[index] = {
            ...updatedExperiences[index],
            [name]: value
        };
        setProfileData({
            ...profileData,
            experiences: updatedExperiences,
        });
    };

    const addExperienceField = () => {
        setProfileData({
            ...profileData,
            experiences: [
                ...profileData.experiences,
                {
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                }
            ]
        });
    };

    const addOrUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const method = hasProfile ? "PUT" : "POST";
            const url = hasProfile ? `/profiles/updateProfile/${userId}` : `/profiles/addProfile/${userId}`;

            const res = await apiRequest({
                url,
                method,
                data: profileData,
                token,
            });

            if (res?.data) {
                toast.success(hasProfile ? "Profile Updated Successfully" : "Profile Added Successfully");
                setProfileData(res.data);
                setHasProfile(true);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Profile operation error:", error);
            toast.error(error.response?.data?.message || "Error in profile operation");
        } finally {
            setIsLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchProfile = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const res = await apiRequest({
                url: `/profiles/${userId}`,
                method: "GET",
                token,
            });

            if (res?.data) {
                setProfileData(res.data);
                setHasProfile(true);
            } else {
                setProfileData({
                    ...profileData,
                    email: email
                });
                setHasProfile(false);
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile, userId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-mine-shaft-800 flex items-center justify-center">
                <div className="text-white text-xl">Loading profile...</div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} />
            <Header />
            <div className="min-h-screen bg-mine-shaft-800 text-white p-4 md:p-8 mx-auto">
                {isEditing ? (
                    <form onSubmit={addOrUpdateProfile} className="max-w-4xl mx-auto space-y-6">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="text-lg mb-4 bg-none border border-cyan-500 hover:bg-cyan-500 text-mine-shaft-100 rounded-md px-6 py-2 hover:text-mine-shaft-900"
                        >
                            Back to View
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold border-b border-cyan-500 pb-2">Personal Information</h2>

                                <div className='w-full'>
                                    <label className='block text-sm font-medium mb-2'>Email</label>
                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <AiOutlineMail className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <label className='block text-sm font-medium mb-2'>Job Title</label>
                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <AiOutlineTags className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            value={profileData.jobTitle}
                                            onChange={handleInputChange}
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <label className='block text-sm font-medium mb-2'>Company</label>
                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <FaBuilding className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="text"
                                            name="company"
                                            value={profileData.company}
                                            onChange={handleInputChange}
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <label className='block text-sm font-medium mb-2'>Location</label>
                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <FaLocationDot className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleInputChange}
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About & Skills Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold border-b border-cyan-500 pb-2">About & Skills</h2>

                                <div className='w-full'>
                                    <label className='block text-sm font-medium mb-2'>About</label>
                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <FaCommentAlt className="text-cyan-500 p-1" size={30} />
                                        <textarea
                                            name="about"
                                            value={profileData.about}
                                            onChange={handleInputChange}
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md h-32"
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <label className='block text-sm font-medium mb-2'>Skills (comma separated)</label>
                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <GiSkills className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="text"
                                            name="skills"
                                            value={profileData.skills.join(', ')}
                                            onChange={(e) => {
                                                const skillsArray = e.target.value.split(',').map(skill => skill.trim());
                                                setProfileData({ ...profileData, skills: skillsArray });
                                            }}
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experiences Section */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold border-b border-cyan-500 pb-2">Experiences</h2>
                            {profileData.experiences?.map((exp, index) => (
                                <div key={index} className="mt-4 border border-cyan-500 rounded-lg p-4 space-y-4">
                                    <h3 className="text-xl font-semibold">Experience #{index + 1}</h3>

                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <AiOutlineTags className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="text"
                                            name="title"
                                            value={exp.title}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            placeholder="Job Title"
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                        />
                                    </div>

                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <FaBuilding className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="text"
                                            name="company"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            placeholder="Company"
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                        />
                                    </div>

                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <FaLocationDot className="text-cyan-500 p-1" size={30} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={exp.location}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            placeholder="Location"
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                            <FaCalendarAlt className="text-cyan-500 p-1" size={30} />
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={exp.startDate}
                                                onChange={(e) => handleExperienceChange(index, e)}
                                                className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                            />
                                        </div>

                                        <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                            <FaCalendarAlt className="text-cyan-500 p-1" size={30} />
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={exp.endDate}
                                                onChange={(e) => handleExperienceChange(index, e)}
                                                className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md"
                                                placeholder="Present"
                                            />
                                        </div>
                                    </div>

                                    <div className='flex items-center border border-mine-shaft-500 rounded-md'>
                                        <MdDescription className="text-cyan-500 p-1" size={30} />
                                        <textarea
                                            name="description"
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            placeholder="Description"
                                            className="w-full bg-mine-shaft-800 text-white p-3 focus:outline-none rounded-r-md h-24"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addExperienceField}
                                className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-mine-shaft-900 font-semibold py-2 px-4 rounded-md"
                            >
                                Add More Experiences
                            </button>
                        </div>

                        <div className="flex justify-end mt-8 space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-mine-shaft-700 hover:bg-mine-shaft-600 text-white font-semibold py-2 px-6 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-cyan-500 hover:bg-cyan-600 text-mine-shaft-900 font-semibold py-2 px-6 rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : hasProfile ? 'Update Profile' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="relative mb-16">
                            <img
                                src="/background.jpg"
                                alt="Profile background"
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => e.target.src = '/default-background.jpg'}
                            />
                            <div className="absolute -bottom-12 left-6">
                                <img
                                    src="/Avatars/Avatar1.jpg"
                                    alt="Profile"
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-mine-shaft-900"
                                    onError={(e) => e.target.src = '/default-avatar.jpg'}
                                />
                            </div>
                        </div>

                        <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">{userName}</h1>
                                <p className="text-xl text-mine-shaft-200">{profileData.jobTitle}</p>
                                <p className="text-lg text-mine-shaft-200">
                                    <span className="font-semibold text-xl text-cyan-500">
                                        {profileData.company}
                                    </span> • {profileData.location}
                                </p>
                                <p className="text-lg text-cyan-500 hover:text-cyan-600 cursor-pointer">
                                    {profileData.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-cyan-500 hover:bg-cyan-600 text-mine-shaft-900 font-semibold py-2 px-6 rounded-md"
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="mt-8 space-y-8">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">About</h2>
                                <p className="text-lg text-mine-shaft-200 whitespace-pre-line">
                                    {profileData.about || 'No information available'}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profileData.skills?.length > 0 ? (
                                        profileData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-mine-shaft-700 px-3 py-1 rounded-full text-cyan-500"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-mine-shaft-400">No skills added yet</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">Experiences</h2>
                                {profileData.experiences?.length > 0 ? (
                                    <div className="space-y-6">
                                        {profileData.experiences.map((exp, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="w-12 h-12 bg-mine-shaft-700 rounded-md flex items-center justify-center flex-shrink-0">
                                                    <img
                                                        src={`/companies/${exp.company?.replace(/\s+/g, '-')}.png`}
                                                        alt={exp.company?.charAt(0) || 'N/A'}
                                                        className="w-8 h-8 object-contain"
                                                        onError={(e) => {
                                                            e.target.src = '/default-company.png';
                                                            e.target.className = 'w-6 h-6 object-contain';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-cyan-500">
                                                        {exp.title}
                                                    </h3>
                                                    <p className="text-lg text-mine-shaft-200">
                                                        <span className="font-medium">{exp.company}</span>
                                                        {exp.location && ` • ${exp.location}`}
                                                    </p>
                                                    <p className="text-md text-mine-shaft-300">
                                                        {exp.startDate} - {exp.endDate || 'Present'}
                                                    </p>
                                                    {exp.description && (
                                                        <p className="mt-2 text-mine-shaft-200 whitespace-pre-line">
                                                            {exp.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-mine-shaft-400">No experiences added yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;