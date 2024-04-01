import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({ src, name }: { src: string; name: string }) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}
