/* eslint-disable import/no-anonymous-default-export */
import { ChainId, multicallAddress } from "@src/configs/web3/chains";

export default {
  multiCall: multicallAddress,
  gloryPool: {
    [ChainId.BSC]: "0xa36c4c19782646d88b9b19c8858f0093461f95c9",
    [ChainId.BSC_TESTNET]: "0xAc577384dd31485a900b44B45F8Edc3D993EbB07",
  },
  usdt: {
    [ChainId.BSC_TESTNET]: "0x8545f2473324124c5371F831075A3163AF22f34F",
    [ChainId.BSC]: "0x55d398326f99059ff775485246999027b3197955",
  },
  mktBNBLP: {
    [ChainId.BSC_TESTNET]: "0x59ac232dfc668bcf34c447649420e14c54fffd3d",
    [ChainId.BSC]: "0x59ac232dfc668bcf34c447649420e14c54fffd3d",
  },
  mkt: {
    [ChainId.BSC_TESTNET]: "0x6C62F8a8deDd262beA9351C9bCAA56ADC558d05D",
    [ChainId.BSC]: "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
  },
  masterChef: {
    [ChainId.BSC]: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
    [ChainId.BSC_TESTNET]: "0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d",
  },
  glory: {
    [ChainId.BSC]: "0x1fc71fE3e333d5262828f3d348C12c7E52306B8A",
    [ChainId.BSC_TESTNET]: "0xcb6CDc9455308D0D80277f4818B699931299132b",
  },
  routerPancake: {
    [ChainId.BSC]: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    [ChainId.BSC_TESTNET]: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
  },
  stakingContract: {
    [ChainId.BSC]: "0xAc577384dd31485a900b44B45F8Edc3D993EbB07",
    [ChainId.BSC_TESTNET]: "0xAc577384dd31485a900b44B45F8Edc3D993EbB07",
  },
  mktUsdtPool: {
    [ChainId.BSC]: "0x1cd6975441c86c6385b7cb47802042aafa57d350",
    [ChainId.BSC_TESTNET]: "0x5da7bf0e8878925c9ee08150915aef5a0f979208",
  },
  farmStakingContract:{
    [ChainId.BSC]: "0xe1113bccd15dc31d2ad711b982a4990f76B1A47c",
    [ChainId.BSC_TESTNET]: "0x5da7bf0e8878925c9ee08150915aef5a0f979208",
  },
  monsterPool:{
    [ChainId.BSC]: "0x690c9a3e20e036d45d41e6d860f5b17a4d51e221",
    [ChainId.BSC_TESTNET]: "0x5da7bf0e8878925c9ee08150915aef5a0f979208",
  }
} as any;
