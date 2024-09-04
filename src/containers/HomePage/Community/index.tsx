import React from "react";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import Image from "next/image";
import Link from "next/link";

export const redirect = [
  {
    image: "twitter",
    title: "Twitter",
    link: "https://twitter.com/MikeTokenio",
  },
  { image: "telegram", title: "Telegram", link: "https://t.me/MikeToken" },
  {
    image: "youtobe",
    title: "Youtube",
    link: "https://www.youtube.com/channel/UCmDNLcrEK4p2dv888-HjhKA",
  },
  {
    image: "tiktok",
    title: "Tiktok",
    link: "https://www.tiktok.com/@miketokenofficial",
  },
];

const Community: React.FC = () => {
  return (
    <>
      <section id="social" className="max-w-[1200px] mx-auto py-[112px] max-lg:px-[16px] max-2xl:px-[24px]">
        <div className="flex max-xl:w-full max-xl:flex-col-reverse">
          <Grid
            className="w-full max-xl:w-full xl:w-1/2 max-xl:mt-[32px]"
            templateAreas={{
              base: `"twitter"
          "telegram"
          "youtobe"
          "tiktok"`,
              lg: `"twitter telegram"
          "youtobe tiktok"`,
              xl: `"twitter"
          "telegram"
          "youtobe"
          "tiktok"`,
            }}
            gap={8}
          >
            {redirect.map((e, index) => {
              return (
                <GridItem key={index} area={e.image}>
                  <Flex w={"100%"}>
                    <Link href={e.link} className="w-full" target="_blank">
                      <div className="flex px-6 py-4 w-4/5 max max-xl:w-full rounded-[8px] item-redirect" style={{ wordBreak: "break-word" }}>
                        <div className="max-md:min-w-[64px] min-w-[88px] w-2/12">
                          <Image
                            src={`/assets/images/icons/${e.image}.svg`}
                            width="48"
                            height="48"
                            alt={""}
                          />
                        </div>
                        <div className="w-10/12">
                          <div className="flex items-center mb-4 text-primary">
                            <Typography type="headline4" className="mr-[10px]">
                              {e.title}
                            </Typography>
                            <Image
                              src={`/assets/images/icons/arrow-up-right.svg`}
                              width="18"
                              height="18"
                              alt={""}
                            />
                          </div>
                          <div className="flex w-full">
                            <Typography
                              type="paragraph1"
                              className="text-read w-fit"
                            >
                              {e.link}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Flex>
                </GridItem>
              );
            })}
          </Grid>
          <div className="w-full max-xl:w-full xl:w-1/2 ">
            <Typography type="headline2" className="text-primary mb-6">
              Meet The Worldwide Community!
            </Typography>
            <Typography type="paragraph1" className="text-read">
              Stay connected on social media for updates, announcements, and
              engaging discussions as we revolutionize meme tokens with Mike
              Token! Join our exciting journey!
            </Typography>
          </div>
        </div>
      </section>
    </>
  );
};

export default Community;