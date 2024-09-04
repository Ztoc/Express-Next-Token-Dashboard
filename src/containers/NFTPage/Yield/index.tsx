// import { Button, Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  Switch,
  Button,
  Center,
} from "@chakra-ui/react";
import { AutoSizer } from "react-virtualized";
import { relative } from "path";
const Yield = () => {
const tabSetting = ["Monster Syndicate","Generation Prime"];
const router = useRouter();
const { isOpen, onOpen, onClose } = useDisclosure();
return (
<Flex direction={"column"} position={"relative"} className=" min-h-screen">
  <Typography type="headline1" as="span" lineHeight={"64px"} color="text.success" align={"center"} marginTop={50}>
    Yield Calculator{" "}
  </Typography>
  <Flex>
    <Typography marginX={"auto"} type="body1" as="span" color="text.read" mb="8px" align={"center"} maxW={500} mt={3}>
      Utilize the powerful tools provided to make informed decisions and maximize your financial growth
    </Typography>
  </Flex>
  <Flex w="100%" maxW={"1200px"} mx="auto" justifyContent={"space-between"} 
    className="xs:flex-col sm:flex-col lg:flex-row relative z-1 my-[30px]">
    <Tabs className="mx-auto lg:w-1/2 w-[90%]" variant="soft-rounded">
      <TabList w="100%" className="mx-auto">

        <Tab
        border="1px solid #414E5A" 
        color="#F6F6FF" 
        borderRadius={"6px"} 
        _selected={{                        
          border: "1px solid #1ED760",   
          color: "#1ED760",  
          }} p="12px 12px" w={"inherit"} key={1}>
          Monsters Syndicate
        </Tab>
        <Tab 
        border="1px solid #414E5A" 
        color="#F6F6FF" 
        borderRadius={"6px"} 
        _selected={{                        
          border: "1px solid #1ED760",   
          color: "#1ED760",  
          }} p="12px 12px" w={"inherit"} key={2}>
          Generator Prime
        </Tab>
      </TabList>
    </Tabs>
    </Flex>
  <Flex w="100%" maxW={"1200px"} mx="auto" justifyContent={"space-between"} 
    className="xs:flex-col sm:flex-col lg:flex-row relative z-1">

    <Flex background={
          "radial-gradient(213.29% 109.87% at 8.93% -0.00%, rgba(36, 100, 125, 0.50) 0%, rgba(28, 34, 37, 0.50) 34.76%, rgba(19, 19, 20, 0.50) 63.42%)"
        }
      className=" flex-col bg-divider-active bg-opacity-60 border-solid border-[1px] border-gray-600 rounded-lg px-[30px] m-[20px] lg:max-w-[600px]  lg:max-h-[580px]"
      position={"relative"}
    >
      {/* <Flex
          w="35px"
          h="35px"
          borderTop={"2px"}
          borderLeft={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          left={"-5px"}
          top={"-5px"}
          borderTopLeftRadius={"12px"}
        />
        <Flex
          w="35px"
          h="35px"
          borderLeft={"2px"}
          borderBottom={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          left={"0px"}
          bottom={"0px"}
          borderBottomLeftRadius={"12px"}
        />
        <Flex
          w="35px"
          h="35px"
          borderTop={"2px"}
          borderRight={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          right={"0px"}
          top={"0px"}
          borderTopRightRadius={"12px"}
        />
        <Flex
          w="35px"
          h="35px"
          borderRight={"2px"}
          borderBottom={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          right={"0px"}
          bottom={"0px"}
          borderBottomRightRadius={"12px"}
        /> */}
      <Typography type="headline1" as="span" lineHeight={"64px"} color="text.success" align={"left"} py={5}>
        Yield Calculator{" "}
      </Typography>
      <Typography type="body1" as="span" color="text.success" mb="10px">
        Number of NFTs
      </Typography>
      <InputGroup size="md">
        <Input padding={7} className="text-primary"  _placeholder={{ color: "#555C6D" }}
          placeholder="Input NFT Numbers" borderColor={"#414E5A"} />
        <InputRightElement py={7} width="5rem" className="text-secondary">
          Numbers
        </InputRightElement>
      </InputGroup>
      <Flex py={5}>
        <Flex className=" flex-col mr-[10px]">
          <Typography type="body1" as="span" color="text.success" my="10px">
            Deposite Min Amount
          </Typography>
          <InputGroup size="md">
            <Input padding={7} className="text-primary"  _placeholder={{ color: "#555C6D" }}
              placeholder="e.g. 120USDT" borderColor={"#414E5A"} />
          </InputGroup>
        </Flex>
        <Flex className=" flex-col ml-[10px]">
          <Typography type="body1" as="span" color="text.success" my="10px">
            Deposite Max Amount
          </Typography>
          <InputGroup size="md">
            <Input padding={7} className="text-primary"  _placeholder={{ color: "#555C6D" }}
              placeholder="e.g. 120USDT " borderColor={"#414E5A"} />
          </InputGroup>
        </Flex>
      </Flex>
      <Typography type="body1" as="span" color="text.success" my="10px">
        Yield Period
      </Typography>
      <InputGroup size="md" mb="30px">
        <Input padding={7} className="text-primary" pr="4.5rem" _placeholder={{ color: "#555C6D" }}
          placeholder="Input Number of Month" borderColor={"#414E5A"} />
        <InputRightElement py={7} width="5rem" className="text-secondary">
          Months
        </InputRightElement>
      </InputGroup>
      <Button
        // className={className}
        colorScheme="brand"
        size="md"
        bgColor="bg.brand !important"
        rounded="full"
        px={4}
        py={7}
        onClick={onOpen}
        fontSize="20px"
        color="white"
        borderRadius={"8px"}   
        my="20px" 
      >
          Calculate Now
        </Button>
    </Flex>
    <Flex className="flex-col m-[20px]">
      <Typography type="headline1" as="span" lineHeight={"64px"} color="text.success" align={"center"} py={5}>
        Expected Result{" "}
      </Typography>
      <Flex className=" lg:flex-col flex-col-reverse lg:max-w-[600px]">
        <Flex className="pt-[10px]" mx="auto">
          <Flex className="flex-col w-[160px]" paddingRight={5} >
            <Typography type="body1" as="span" color="text.success">
              Estimated Income      
            </Typography>
            <Typography type="headline2" as="span" color="text.primary" >
            67.9$      
            </Typography>
            
          </Flex>
          
          <Flex className="flex-col" paddingRight={5}>
          <Typography type="body1" as="span" color="text.success">
            Project Yield %     
            </Typography>
            <Typography type="headline2" as="span" color="text.primary" >
            33.78%         
            </Typography>
            
          </Flex>
          <Flex className="flex-col">
            <Typography type="body1" as="span" color="text.success">
              Historical Yield %      
            </Typography>
            <Typography type="headline2" as="span" color="text.primary" >
              74.14%          
            </Typography>
            
          </Flex>
        </Flex>
        <Flex className="min-w-[250px]">
          <Image
            src="/images/income-solution.png"
            width={400}
            height={400}
            
            alt="income-solution"
            style={{
              width: "100%",
              height: "90%",
            }}
            className="mx-auto pl-[0px] rounded-lg"
            priority
          />
        </Flex>
      </Flex>
    </Flex>
  </Flex>
</Flex>
);
};
export default Yield;