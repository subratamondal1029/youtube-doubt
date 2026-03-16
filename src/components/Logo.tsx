import Link from "next/link";
import Image from "next/image";

type LogoType = {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
};

const Logo = ({ href = "/", width = 60, height = 50, className = "" }: LogoType) => {
  return (
    <Link href={href}>
      <Image src="/logo.png" alt="Logo" width={width} height={height} className={className} />
    </Link>
  );
};

export default Logo;
