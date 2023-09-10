import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { IGetMoviesResult, getMovieSearch } from "../api";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import { useState } from "react";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
`;

const Slider = styled.div`
  padding: 100px 0px 30px 60px;
`;

const SliderTitle = styled.h1`
  background-color: transparent;
  border: none;
  font-size: 40px;
  font-weight: 400;
  color: white;
  width: 300px;
  height: 60px;
  padding: 0px 0px 30px 0px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${props => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 180px;
  font-size: 66px;
  border-radius: 3px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.2,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.2,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const keywordMatch = useRouteMatch<{ keyword: string }>("?keyword=:keyword");
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movie"],
    getMovieSearch
  );

  const [index, setIndex] = useState(0);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      <Slider>
        <SliderTitle>Searched</SliderTitle>
        <Row key={index}>
          {data?.results.map(movie => (
            <Box
              layoutId={movie.id + ""}
              key={movie.id}
              whileHover="hover"
              initial="normal"
              variants={boxVariants}
              onClick={() => onBoxClicked(movie.id)}
              transition={{ type: "tween" }}
              bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
            >
              <Info variants={infoVariants}>
                <h4>{movie.title}</h4>
              </Info>
            </Box>
          ))}
        </Row>
      </Slider>
    </Wrapper>
  );
}

export default Search;
