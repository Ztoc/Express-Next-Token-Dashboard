import { Box } from "@chakra-ui/react";
import { Meta } from "@src/containers/Meta";
import Pools from "@src/containers/PoolPage";
import { Layout } from "@src/layouts";
import { ReactNode } from "react";

const Pool = () => {
  return (
    <>
      <Meta title="Pools | MikeToken" description="" />
      <Box minHeight={"100vh"}>
        <Pools />
        {/* <div className="flex bg-default h-[100vh] justify-center items-center relative">
          <div className="text-center mb-20">
            <Typography type="headline2" className="text-primary mb-6">
              Coming soon
            </Typography>
            <Typography type="body1-r" className="text-primary mb-2">
              We are currently developing an exciting new feature for you!
            </Typography>
            <Typography type="body1-r" className="text-primary mb-2">
              Please be patient and check back later to discover our new
              feature.
            </Typography>
            <Typography type="body1-r" className="text-primary mb-2">
              Thank you for your continued support!
            </Typography>
          </div>
        </div> */}
      </Box>
    </>
  );
};

Pool.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export default Pool;
