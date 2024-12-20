import { Link } from '@/i18n/routing';
import RegForm from "@/components/partials/auth/reg-form";
import Image from "next/image";
import Copyright from "@/components/partials/auth/copyright";
import Logo from "@/components/partials/auth/logo";
const Register = () => {
  return (
    <>
      <div className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full">
        <div className="overflow-y-auto flex flex-wrap w-full h-dvh">
          <div
            className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 
 relative z-[1] bg-default-50"
          >
         <div className="max-w-[520px] pt-0 ps-20 ">
              <Link href="/" className="mt-6 inline-block">
                <Logo />
              </Link>
            </div>
            <div className="absolute left-0 2xl:bottom-[-35px] h-full w-full ">
              <Image
                src="/images/all-img/sg.svg"
                alt=""
                width={400}
                height={400}
                className=" w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1 relative dark:bg-default-100 bg-white ">
            <div className=" h-full flex flex-col">
              <div className="max-w-[524px] md:px-[42px] md:py-[44px] p-7  mx-auto w-full text-2xl text-default-900  mb-3 h-full flex flex-col justify-center">
                <div className="flex justify-center items-center text-center mb-6 lg:hidden ">
                  <Link href="/">
                    <Logo />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-5 mb-5">
                  <h4 className="font-medium">Sign up</h4>
                  <div className="text-default-500  text-base">
                    Create an Account 
                  </div>
                </div>
                <RegForm />
               
                <div className="max-w-[225px] mx-auto font-normal text-default-500  2xl:mt-12 mt-6 uppercase text-sm">
                  Already registered?
                  <Link
                    href="/"
                    className="text-default-900  font-medium hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="text-xs font-normal text-default-500 z-[999] pb-10 text-center">
                <Copyright />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
