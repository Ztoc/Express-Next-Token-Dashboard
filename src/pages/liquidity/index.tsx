import { ReactNode } from "react";
import { Layout } from "@src/layouts";
import { Meta } from "@src/containers/Meta";
import MyLiquidity from "@src/containers/Liquidity/MyLiquidity";
import { ComingSoonPage } from "@src/layouts/ComingSoonPage";

const Liquidity = () => {
  return (
    <div className="h-full">
      <Meta title="Liquidity: Enhance trading stability with our liquidity provision mechanism." description="" />
      <MyLiquidity />
      {/* <ComingSoonPage /> */}

    </div>
  );
};

Liquidity.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export default Liquidity;
