import type { CreateToastFnReturn, ToastId } from "@chakra-ui/react";
import {
  Box,
  CloseButton,
  Flex,
  HStack,
  Spinner,
  Text,
  useToast as useChakraToast,
  VStack,
} from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import { ChevronRightIcon } from "@chakra-ui/icons";

import Image from "next/image";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import Link from "next/link";
import { SubExplorerPath, useGetExplorer } from "./useGetExplorer";

declare type ToastStatus = "success" | "error" | "warning" | "info" | "loading";

type ToastOptions = {
  status: ToastStatus;
  title: any;
  description?: any;
  id?: ToastId;
  duration?: number;
  txHash?: string;
};

type ToastContainerProps = {
  onClose: () => void;
} & ToastOptions;

const ToastContainer: FC<ToastContainerProps> = ({
  status,
  title,
  description,
  txHash,
  onClose,
}) => {
  let iconUrl: any;
  let wrapBg: any;

  switch (status) {
    case "success":
      iconUrl = "/icons/check-circle-solid.svg";
      wrapBg = "bg.brand";
      break;
    case "error":
      iconUrl = "/icons/error-circle.svg";
      wrapBg = "bg.error";
      break;
    case "loading":
      wrapBg = "text.info";
      break;
    default:
      break;
  }

  const link = useGetExplorer(SubExplorerPath.TX, txHash || "");

  return (
    <Box
      pos="relative"
      w={{
        base: "calc(100vw - 1rem)",
        lg: 324,
        xl: 405,
      }}
      p="1px"
      borderRadius={"8px"}
      bg={wrapBg}
      overflow="hidden"
    >
      <HStack
        align="center"
        gap={4}
        px={4}
        py={4}
        bg="bg.primary"
        borderRadius={"8px"}
      >
        <Flex mb="auto" mt="4px">
          {status !== "loading" ? (
            <Image src={iconUrl} alt={status} width={26} height={26} />
          ) : (
            <Spinner
              thickness="2px"
              speed="0.65s"
              emptyColor="gray.200"
              color="text.info"
              size="md"
            />
          )}
        </Flex>

        <VStack
          flex="1 1 100%"
          maxW="75%"
          align="start"
          justify="center"
          gap="0.375rem"
          m="0 !important" // don't know why there is a shit css to insert x-margin
        >
          <Typography type="headline6" w="100%" color={wrapBg}>
            {title}
          </Typography>

          <Flex mt="-10px">
            {description &&
              (typeof description === "string" ? (
                <Typography w="100%" type="paragraph1" color="text.read">
                  {description}
                </Typography>
              ) : (
                description
              ))}
          </Flex>
          {status === "success" && (
            <Link href={link} target="_blank">
              <Flex mt="12px" align={"center"}>
                <Typography pr="8px" type="paragraph2" color="text.brand">
                  Transaction details
                </Typography>
                <ChevronRightIcon color="text.brand" />
              </Flex>
            </Link>
          )}
        </VStack>

        {/* <CloseButton
          pos="absolute"
          top={2}
          right={2}
          rounded="full"
          onClick={onClose}
        /> */}
      </HStack>
    </Box>
  );
};

export const useToast = () => {
  const toast: CreateToastFnReturn = useChakraToast();

  const showToast = useCallback(
    ({ id, status, duration = 2500, ...args }: ToastOptions) => {
      const onClose = () => toast.close(toastId);

      const toastId = toast({
        id,
        duration,
        position: "top-right",
        status,
        render: () => (
          <ToastContainer status={status} onClose={onClose} {...args} />
        ),
      });

      return toastId;
    },
    [toast]
  );

  return useMemo(() => {
    return {
      toastError: (title: any, description?: any, duration?: number) =>
        showToast({
          status: "error",
          title,
          description,
          duration,
        }),

      toastSuccess: (title: string, txHash: string,description?: any, duration?: number) =>
        showToast({
          status: "success",
          title,
          description,
          duration,
          txHash
        }),

      toastProcessingTx: (id: string, duration?: number) =>
        showToast({
          status: "loading",
          title: "Transaction Processing",
          id,
          duration,
        }),
    };
  }, [toast]);
};
