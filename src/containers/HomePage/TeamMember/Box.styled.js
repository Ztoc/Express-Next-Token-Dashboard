import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Box = styled.div`
  background-color: tomato !important;
`;

const StyledSlider = styled(Slider)`
  .slick-slide {
    height: auto;
  }
  .slick-slide div {
    outline: none;
    width: 100%;
    margin: 0;
  }
  .slick-track {
    display: flex;
  }
  .slick-track .slick-slide {
    display: flex;
    height: 100%;
  }
`;
export { StyledSlider };
