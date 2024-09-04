// import Image from "next/image";
import { Image } from "@chakra-ui/react";

const BackgroundLayout = () => {
  return (
    <>
      <Image
        className="absolute max-xl:hidden max-2xl:right-[0px]"
        bottom={"20px"}
        zIndex={1}
        right={"10%"}
        src={`/assets/images/ImageSocial.svg`}
        alt=""
      />
      <div className="flex justify-end w-full">
        <Image
          className="hidden max-xl:block"
          src={`/assets/images/ImageSociaMobile.svg`}
          alt=""
        />
      </div>
    </>
  );
};

export default BackgroundLayout;
