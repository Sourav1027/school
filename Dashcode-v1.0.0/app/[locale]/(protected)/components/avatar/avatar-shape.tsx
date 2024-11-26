import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const AvatarShape = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar shape="circle"  color="primary">
        <AvatarImage src="/images/avatar/av-4.jpg" />
        <AvatarFallback> LI </AvatarFallback>
      </Avatar>
      <Avatar shape="square" >
        <AvatarImage src="/images/avatar/av-1.jpg" />
        <AvatarFallback> PR </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarShape;