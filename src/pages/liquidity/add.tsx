import { ReactNode } from "react";
import { Layout } from "@src/layouts";
import { Meta } from "@src/containers/Meta";
import AddLiquidity from "@src/containers/Liquidity/AddLiquidity";
import { ComingSoonPage } from "@src/layouts/ComingSoonPage";

const AddLiquidityPage = () => {
  return (
    <div className="h-full">
      <Meta
        title="Liquidity: Enhance trading stability with our liquidity provision mechanism."
        description=""
      />
      <AddLiquidity />
      {/* <ComingSoonPage /> */}
    </div>
  );
};

AddLiquidityPage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export default AddLiquidityPage;
