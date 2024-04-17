import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar(props) {
    const { data: session, status } = useSession();

    const handleLogin = () => {
        if (status == 'unauthenticated')
            signIn();
        else {
            signOut();
        };
    };

    return (
        <nav className="bg-white w-full z-20 border-b border-black">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">TechnoBlog</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button onClick={() => handleLogin()} type="button" className="text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2 text-center">
                        {status == 'authenticated' ? session.user.name : "Login"}
                    </button>
                </div>
                <div className="items-center justify-between w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <a href="/" className="block py-2 px-3 text-black rounded   md:hover:text-gray-700 md:p-0">Home</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-black rounded  md:hover:text-gray-700 md:p-0">Post</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-black rounded  md:hover:text-gray-700 md:p-0">About</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}