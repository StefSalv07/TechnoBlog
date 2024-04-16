export default function NavBar() {
    return (
        <nav class="bg-white fixed w-full z-20 top-0 start-0 border-b border-black">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <span class="self-center text-2xl font-semibold whitespace-nowrap text-black">TechnoBlog</span>
                </a>
                <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button type="button" class="text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2 text-center">Login</button>
                </div>
                <div class="items-center justify-between w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <a href="#" class="block py-2 px-3 text-black rounded hover:bg-gray-100  md:hover:text-gray-700 md:p-0">Home</a>
                        </li>
                        <li>
                            <a href="#" class="block py-2 px-3 text-black rounded hover:bg-gray-100 md:hover:text-gray-700 md:p-0">Post</a>
                        </li>
                        <li>
                            <a href="#" class="block py-2 px-3 text-black rounded hover:bg-gray-100 md:hover:text-gray-700 md:p-0">About</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}