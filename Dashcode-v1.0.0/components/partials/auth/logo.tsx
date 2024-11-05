'use client'
import Image from 'next/image';
import { useTheme } from "next-themes";

const Logo = () => {
    const { theme: mode } = useTheme();
  return (
    <div>
      <Image
          src="/images/all-img/ml.png"
        alt=""
        width={200}
        height={200}
        className=" w-36 "
      />
    </div>
  );
}

export default Logo;