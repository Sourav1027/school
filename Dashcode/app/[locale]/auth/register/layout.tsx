import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "schoolUp is a popular school app.",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;