import { Flex, FlexProps } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";

interface ItemSwapProps {
  title?: string;
  content?: React.ReactNode;
}

const ItemSwap: React.FC<ItemSwapProps> = ({ title, content, ...rest }) => {
  return (
    <Flex justifyContent={"space-between"} {...rest}>
      <Typography type="caption1-r" className="text-secondary">
        {title}
      </Typography>
      <Typography type="caption1-r" className="text-primary">
        {content}
      </Typography>
    </Flex>
  );
};

export default ItemSwap;
