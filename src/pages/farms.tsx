import { ReactNode } from "react";
import { Layout } from "@src/layouts";
import { ComingSoonPage } from "@src/layouts/ComingSoonPage";
import { Meta } from "@src/containers/Meta";
import FarmPage from "@src/containers/FarmPage";
import { Box } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";

const Farms = () => {
  return (
    <>
      <Meta title="Farms: Earn rewards by staking your tokens in our profitable farming pools." description="" />
      <Box minHeight={"100vh"}>
        <FarmPage />
        {/* <ComingSoonPage /> */}
      </Box>
    </>
  );
};

Farms.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export default Farms;
