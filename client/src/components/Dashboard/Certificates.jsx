import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '@/context/AuthContext';
import API from '@/api/axios';
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiAward, FiDownload, FiShare2, FiLinkedin, FiTwitter, FiFacebook, FiBookOpen, FiUser } from "react-icons/fi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '@/assets/logo.png'; // Make sure to import your logo

const CertificateModal = ({ enrollment, onClose }) => {
    const certificateRef = useRef();

    const downloadCertificate = (format) => {
        html2canvas(certificateRef.current, { scale: 2 }).then(canvas => {
            if (format === 'jpg') {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg');
                link.download = `SkillSphere_Certificate_${enrollment.course.title}.jpg`;
                link.click();
            } else if (format === 'pdf') {
                const imgData = canvas.toDataURL('image/jpeg');
                const pdf = new jsPDF('l', 'mm', 'a4');
                const width = pdf.internal.pageSize.getWidth();
                const height = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
                pdf.save(`SkillSphere_Certificate_${enrollment.course.title}.pdf`);
            }
        });
    };

    const shareCertificate = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`I just earned a certificate in ${enrollment.course.title} from SkillSphere!`);
        let shareUrl = '';

        switch (platform) {
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=Certificate of Completion&summary=${text}&source=SkillSphere`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            default:
                return;
        }
        window.open(shareUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-4xl border border-gray-700 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl hover:text-red-500 z-10">&times;</button>
                
                {/* Certificate Design */}
                <div ref={certificateRef} className="bg-white text-gray-800 p-10 relative aspect-[1.414] w-full">
                    <div className="absolute inset-0 border-4 border-indigo-300 m-2"></div>
                    <div className="absolute inset-0 border-2 border-indigo-500 m-4"></div>
                    <div className="text-center">
                        <img src={logo} alt="SkillSphere Logo" className="h-16 mx-auto mb-4" />
                        <h1 className="text-5xl font-bold text-indigo-800" style={{ fontFamily: 'serif' }}>Certificate of Completion</h1>
                        <p className="text-lg mt-8">This is to certify that</p>
                        <p className="text-4xl font-semibold my-4 text-gray-900">{enrollment.user.name}</p>
                        <p className="text-lg">has successfully completed the course</p>
                        <p className="text-3xl font-medium my-4 text-indigo-700">{enrollment.course.title}</p>
                        <div className="flex justify-between items-center mt-12 text-sm">
                            <div>
                                <p className="font-semibold border-t-2 border-gray-400 pt-2">Instructor Signature</p>
                            </div>
                            <div>
                                <p className="font-semibold border-t-2 border-gray-400 pt-2">Date Issued</p>
                                <p>{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-center gap-4">
                    <button onClick={() => downloadCertificate('jpg')} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"><FiDownload /> Download JPG</button>
                    <button onClick={() => downloadCertificate('pdf')} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"><FiDownload /> Download PDF</button>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"><FiShare2 /> Share</button>
                        <div className="absolute bottom-full mb-2 w-40 bg-[#2a2a2a] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={() => shareCertificate('linkedin')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"><FiLinkedin /> LinkedIn</button>
                            <button onClick={() => shareCertificate('twitter')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"><FiTwitter /> Twitter</button>
                            <button onClick={() => shareCertificate('facebook')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"><FiFacebook /> Facebook</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Certificates = () => {
    const { user } = useContext(AuthContext);
    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    const studentLinks = [
        { label: "My Learning", path: "/dashboard", icon: <FiBookOpen /> },
        { label: "Browse Courses", path: "/student/courses", icon: <FiBookOpen /> },
        { label: "Certificates", path: "/student/certificates", icon: <FiAward /> },
        { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!user) return;
            try {
                const response = await API.get('/enrollment/my');
                // Filter for completed courses with certificates
                const userEnrollments = response.data.enrollments.map(e => ({
                    ...e,
                    user: { name: user.name } // Add user name to enrollment
                }));
                setEnrollments(userEnrollments.filter(e => e.certificateIssued));
            } catch (error) {
                console.error("Failed to fetch certificates:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCertificates();
    }, [user]);

    return (
        <div className="flex">
            <Sidebar links={studentLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-8 pt-10">My Certificates</h1>
                    {isLoading ? (
                        <p className="text-center">Loading your certificates...</p>
                    ) : enrollments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {enrollments.map(enrollment => (
                                <div key={enrollment._id} className="bg-[#111] border border-gray-800 rounded-lg shadow-lg p-6 text-center">
                                    <FiAward className="text-6xl text-yellow-400 mx-auto mb-4" />
                                    <h2 className="text-xl font-bold text-white mb-2">{enrollment.course.title}</h2>
                                    <p className="text-sm text-gray-400 mb-4">Completed on: {new Date().toLocaleDateString()}</p>
                                    <button onClick={() => setSelectedCert(enrollment)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition">
                                        View Certificate
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">You have not earned any certificates yet.</p>
                    )}
                </main>
                <Footer />
                {selectedCert && <CertificateModal enrollment={selectedCert} onClose={() => setSelectedCert(null)} />}
            </div>
        </div>
    );
};

export default Certificates;
