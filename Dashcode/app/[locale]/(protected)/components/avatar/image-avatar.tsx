import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ImageAvatar = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar>
        <AvatarImage src="/images/avatar/avatar-1.png" />
        <AvatarFallback> PR </AvatarFallback>
      </Avatar>
      <Avatar color="primary">
        <AvatarImage src="/images/avatar/avatar-2.png" />
        <AvatarFallback> LI </AvatarFallback>
      </Avatar>
      <Avatar color="secondary">
        <AvatarImage src="/images/avatar/avatar-3.png" />
        <AvatarFallback> SH </AvatarFallback>
      </Avatar>
      <Avatar color="success">
        <AvatarImage src="/images/avatar/avatar-4.png" />
        <AvatarFallback> SU </AvatarFallback>
      </Avatar>
      <Avatar color="info">
        <AvatarImage src="/images/avatar/avatar-5.png" />
        <AvatarFallback> PR </AvatarFallback>
      </Avatar>
      <Avatar color="warning">
        <AvatarImage src="/images/avatar/avatar-6.png" />
        <AvatarFallback> SR </AvatarFallback>
      </Avatar>
      <Avatar color="destructive">
        <AvatarImage src="/images/avatar/avatar-7.png" />
        <AvatarFallback> AR </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default ImageAvatar;