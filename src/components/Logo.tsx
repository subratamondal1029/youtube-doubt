import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/">
      <Image src="/logo.png" alt="Logo" width={60} height={50} />
    </Link>
  );
};

export default Logo;
