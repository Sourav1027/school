'use client'
import Image from 'next/image';
import { useTheme } from "next-themes";

const Logo = () => {
    const { theme: mode } = useTheme();
  return (
    <div className='flex justify-center items-center gap-2'>
    <Image
      src="/images/logo/su.png"
      alt="Logo"
      width={300}  // The width in pixels as a base size
      height={300}  // The height in pixels
      className="w-10 h-10 bg-black border-r-4 rounded-tl-xl rounded-tr-xl rounded-bl-xl"
    />
    <span className="text-xl font-bold font-libre">SCHOOLUP</span> 
  </div>
  
  );
}

export default Logo;