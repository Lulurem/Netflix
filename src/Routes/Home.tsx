import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getMoviesNowPlaying,
  getMoviesTopRated,
  getMoviesUpcoming,
} from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 100px;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)),
    url(${props => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
  margin-bottom: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const Button = styled.button`
  width: 180px;
  padding: 15px;
  margin-right: 13px;
  font-size: 30px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

const Slider = styled.div`
  position: relative;
  top: -150px;
`;

const SliderTitle = styled.h1`
  background-color: transparent;
  border: none;
  font-size: 40px;
  font-weight: 400;
  color: white;
  width: 300px;
  height: 60px;
  padding: 0px 0px 30px 60px;
`;

const SliderButton = styled.button`
  position: absolute;
  background-color: transparent;
  border: none;
  font-size: 40px;
  color: white;
  height: 180px;
  display: flex;
  justify-content: end;
  align-items: center;
  cursor: pointer;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 55vw;
  height: 100vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;
  background-color: ${props => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 550px;
`;

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 0px 0px 20px 40px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const OverviewContainer = styled.div`
  display: flex;
`;

const BigOverview = styled.p`
  position: relative;
  width: 70%;
  padding: 40px 20px 20px 40px;
  font-size: 22px;
  color: ${props => props.theme.white.lighter};
  top: -80px;
`;

const BigGenre = styled.h4``;

const rowVariants = {
  hidden: {
    x: window.outerWidth - 35,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 35,
  },
};

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

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  const useMultipleQuery = () => {
    const nowPlaying = useQuery<IGetMoviesResult>(
      ["nowPlaying"],
      getMoviesNowPlaying
    );
    const topRated = useQuery<IGetMoviesResult>(
      ["topRated"],
      getMoviesTopRated
    );

    const upComing = useQuery<IGetMoviesResult>(
      ["upComing"],
      getMoviesUpcoming
    );
    return [nowPlaying, topRated, upComing];
  };

  const [
    { isLoading: loadingNowPlaying, data: nowPlayingData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpcoming, data: upComingData },
  ] = useMultipleQuery();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (nowPlayingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlayingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving(prev => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlayingData?.results.find(
      movie => movie.id === +bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {loadingNowPlaying ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
            <ButtonContainer>
              <Button>▶︎ Play</Button>
              <Button
                style={{
                  width: 240,
                  backgroundColor: "darkgrey",
                  opacity: 0.8,
                  color: "white",
                }}
              >
                ⓘ Infomation
              </Button>
            </ButtonContainer>
          </Banner>

          {/* now playing */}
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderTitle>Now Playing</SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowPlayingData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(movie => (
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
                <SliderButton onClick={increaseIndex}>〈</SliderButton>
                <SliderButton onClick={increaseIndex} style={{ right: 20 }}>
                  〉
                </SliderButton>
              </Row>
            </AnimatePresence>
          </Slider>

          {/* top rated */}
          <Slider style={{ marginTop: 200 }}>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderTitle>Top Rated</SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {topRatedData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(movie => (
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
                <SliderButton onClick={increaseIndex}>〈</SliderButton>
                <SliderButton onClick={increaseIndex} style={{ right: 20 }}>
                  〉
                </SliderButton>
              </Row>
            </AnimatePresence>
          </Slider>

          {/* upComing */}
          <Slider style={{ marginTop: 200 }}>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderTitle>Upcoming</SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {upComingData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(movie => (
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
                <SliderButton onClick={increaseIndex}>〈</SliderButton>
                <SliderButton onClick={increaseIndex} style={{ right: 20 }}>
                  〉
                </SliderButton>
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Big card */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 30 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "original"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <OverviewContainer>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                        <BigGenre>{clickedMovie.genre_ids}</BigGenre>
                      </OverviewContainer>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
