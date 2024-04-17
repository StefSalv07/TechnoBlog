import { useState } from "react";

export default function Login(props) {
    const [isSignUp, setSignUp] = useState(false);

    return (
        <section className="sm:mt-0 lg:mt-7">
            <div className="flex justify-center px-6 py-8 mx-auto md:h-4/5 lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign {isSignUp ? "up" : "in"}
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            {isSignUp ?
                                <div>
                                    <label for="username" className="block mb-2 text-sm font-medium text-gray-900">Your Username</label>
                                    <input type="text" name="username" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="username" required="" />
                                </div>
                                : ""}
                            <div>
                                <label for="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required="" />
                            </div>
                            <div>
                                <label for="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
                            </div>
                            <button type="submit" className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign {isSignUp ? "up" : "in"}</button>
                            <p className="text-sm font-light text-gray-500">
                                {isSignUp ? "Already have an account? " : "Don’t have an account yet? "}
                                <a onClick={() => setSignUp(!isSignUp)} href="#" className="font-medium text-primary-900 hover:underline">Sign {isSignUp ? "in" : "up"}</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}