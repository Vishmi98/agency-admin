import Image from "next/image";


const Logo = () => {
  return (<Image src="/logo1.png" alt="logo" height={100} width={150} priority />);
};

export default Logo;
