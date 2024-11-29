import { Metadata } from "next";

export const metadata: Metadata = {
  title: "schoolUp",
  description: "schoolUp is a popular School App.",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
    