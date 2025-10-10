"use client";
import { useRouter, usePathname } from "next/navigation";
// import Navbar from './navbar'


export default function UIWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const cardBaseClasses =
    "relative flex flex-col justify-center items-center text-center bg-gray-800 rounded-xl shadow-md cursor-pointer transition-transform duration-200 w-56 h-64 p-4";

  const activeCardClasses = "border-2 border-amber-500 bg-amber-600";

  return (
    <main className="flex flex-col min-h-screen w-full overflow-x-hidden overflow-y-auto bg-black items-center pb-[15vh] text-white">
      {/* <Navbar/> */}
      <div className="flex justify-between items-center w-full max-w-[1200px] px-8 py-4">
        <p className="text-2xl font-bold text-white">Hello, Devs</p>
      </div>

      <div className="flex flex-col items-center w-full max-w-[1200px] px-8 py-8">
        <div className="flex flex-col items-start mb-8 w-full">
          <p className="text-[52px] font-bold m-0">
            <span className="text-blue-400">Let's,</span>{" "}
            <span className="text-pink-500">Build</span>
          </p>
          <p className="text-gray-400 text-[38px] font-bold mt-2 mb-8 text-center w-full">
            Our Own Custom Form
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            <div
              className={`${cardBaseClasses} ${
                pathname === "/form/create" ? activeCardClasses : ""
              }`}
              onClick={() => router.push("/form/create")}
            >
              <p className="mb-10 text-lg font-semibold text-white">Create</p>
            </div>

            <div
              className={`${cardBaseClasses} ${
                pathname === "/form/saved" ? activeCardClasses : ""
              }`}
              onClick={() => router.push("/form/saved")}
            >
              <p className="mb-10 text-lg font-semibold text-white">Saved Form</p>
            </div>
          </div>

          <div className="mt-6 w-full transition-all duration-500">{children}</div>
        </div>
      </div>
    </main>
  );
}
