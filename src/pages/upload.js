import { useEffect, useRef, useState } from 'react';
import NavBar from '@/components/NavBar';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Upload() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [articleData, setArticleData] = useState({
        title: '',
        summary: '',
        content: '',
        authorName: '',
        categories: []
    });
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchReviewers = async () => {
            const response = await fetch('/api/reviewers');
            if (response.ok) {
                const data = await response.json();
                setReviewers(data);
            } else {
                console.error('Failed to fetch reviewers');
            }
        };

        if (status === 'authenticated' && session.user.type === 'editor') {
            fetchReviewers();
        }
    }, [status, session]);

    if (status === 'unauthenticated' || session.user.type !== 'editor') {
        signOut();
        return null;
    }

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const parsedContent = parseEmail(content);
                try {
                    const jsonData = JSON.parse(parsedContent);
                    setArticleData({
                        title: jsonData.title || '',
                        summary: jsonData.summary || '',
                        content: jsonData.content || '',
                        categories: jsonData.categories || [],
                        authorName: jsonData.author || '',
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Failed to parse JSON content.');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedReviewer) {
            alert('Please select a reviewer before submitting.');
            return;
        }
        const reviewerDetails = reviewers.find(reviewer => reviewer._id === selectedReviewer);
        if (!reviewerDetails) {
            alert('Reviewer details not found.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/submitarticle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...articleData,
                    reviewer: reviewerDetails.name, 
                })
            });
            if (response.ok) {
                alert('Article submitted successfully!');
                router.push("/");
            } else {
                alert('Failed to submit article.');
            }
        } catch (error) {
            console.error('Error submitting article:', error);
        }
    };
    const parseEmail = (content) => {
        const boundaryMatch = content.match(/boundary="([^"]+)"/);
        if (!boundaryMatch) {
            return "No boundary found, unable to parse content.";
        }

        const boundary = boundaryMatch[1];
        const parts = content.split(`--${boundary}`);
        let plainTextBody = '';

        parts.forEach(part => {
            if (part.includes('Content-Type: text/plain')) {
                const lines = part.replace(/\r\n/g, '\n').split('\n');
                let headerEnded = false;
                let bodyLines = [];

                lines.forEach(line => {
                    if (headerEnded) {
                        bodyLines.push(line);
                    } else if (line.trim() === '') {
                        headerEnded = true;
                    }
                });

                if (bodyLines.length > 0 && bodyLines[0].startsWith('Content-Type:')) {
                    plainTextBody = bodyLines.slice(1).join('\n').trim();
                } else {
                    plainTextBody = bodyLines.join('\n').trim();
                }
            }
        });

        return plainTextBody;
    };

    return (
        <>
            <NavBar />
            <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black">
                <h3 className="mb-6 text-2xl font-bold">Upload mail file</h3>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".eml,text/*"
                />
                <button onClick={handleUploadClick} type="button" className="mt-2 py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                    Upload File
                </button>
                {articleData.content && (
                    <div className="mt-4 p-4 max-w-screen-xl mx-auto bg-white text-black border border-gray-200 rounded">
                        <h4 className="text-lg font-bold">Parsed Content:</h4>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Title:</label>
                            <input type="text" value={articleData.title} onChange={(e) => setArticleData({ ...articleData, title: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Article Title" />
                            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">Summary:</label>
                            <textarea value={articleData.summary} onChange={(e) => setArticleData({ ...articleData, summary: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Article Summary"></textarea>
                        </div>
                        <pre>{articleData.content}</pre>
                        <label htmlFor="reviewerSelect" className="block mb-2 text-sm font-medium text-gray-900">Select Reviewer:</label>
                        <select
                            id="reviewerSelect"
                            value={selectedReviewer}
                            onChange={(e) => setSelectedReviewer(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="">Select a reviewer</option>
                            {reviewers.map((reviewer) => (
                                <option key={reviewer._id} value={reviewer._id}>{reviewer.name}</option>
                            ))}
                        </select>
                        <button onClick={handleSubmit} className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit Article
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
