import NavBar from '@/components/NavBar';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Review(props) {
    const router = useRouter();
    const { blogId, userId } = router.query;
    const { data: session, status } = useSession();

    // Text to be displayed as default in the textarea
    const defaultReviewText = "Write your thoughts here...";

    if (status === 'unauthenticated' || session.user.type === 'author') {
        signOut();
    }

    if (router.isReady) {
        return (
            <>
                <NavBar />
                <div className="mt-1 p-4 max-w-screen-xl mx-auto bg-white text-black">
                    <label htmlFor="review" className="block mb-2 text-sm font-medium text-black">Your review</label>
                    <textarea
                        id="review"
                        rows="4"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={defaultReviewText}
                    />
                    <button onClick={() => null} type="button" className="mt-2 py-2 px-3 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                        Submit
                    </button>
                </div>
            </>
        );
    }
}
