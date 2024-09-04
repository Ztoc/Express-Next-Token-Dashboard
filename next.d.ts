import type { Router } from "next/dist/client/router";
import type {
  AppPropsType,
  NextComponentType,
  NextPageContext,
} from "next/dist/shared/lib/utils";
import type { ReactElement, ReactNode } from "react";

declare module "next" {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
}

declare module "next/app" {
  export declare type AppProps<P = any> = AppPropsType<Router, P> & {
    Component: NextPage;
  };
}
