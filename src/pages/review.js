import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Review(props) {
    const router = useRouter();
    const { blogId } = router.query;
    const { data: session, status } = useSession();
    const [blogData, setBlogData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBlogData() {
            if (router.isReady && blogId) {
                try {
                    const response = await fetch(`/api/articles?blogId=${blogId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch blog data');
                    }
                    const data = await response.json();
                    setBlogData(data);
                } catch (error) {
                    console.error('Fetching blog data error:', error);
                    setError(error.message);
                }
            }
        }

        fetchBlogData();
    }, [router.isReady, blogId, blogData]);

    if (status === 'unauthenticated' || session.user.type === 'author') {
        signOut();
        return null;
    }

    if (!router.isReady || !blogData) {
        return <div></div>;
    }

    return (
        <>
            <NavBar />
            <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black">
                <h3 className="mb-6 text-2xl font-bold">{blogData[0].title}</h3>
                <label htmlFor="blogContent" className="block mb-2 text-sm font-medium text-black">Blog content</label>
                <textarea
                    id="blogContent"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={blogData[0].content || 'Loading content...'}
                    readOnly={true}
                />
            </div>

            <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black">
                <label htmlFor="reviewInput" className="block mb-2 text-sm font-medium text-black">Your review</label>
                <textarea
                    id="reviewInput"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <button onClick={() => null} type="button" className="mt-2 py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                    Submit
                </button>
            </div>
        </>
    );
}
