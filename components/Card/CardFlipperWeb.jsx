import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { images } from "../../constants";
import { soundManager } from "../../utils/SoundManager";

import CardDisplay from "./CardDisplay";
import Button from "../CustomButton/CustomButton";

const PRICE_HIGHLIGHT_THRESHOLD = 5;

const FlipCard = ({ cardIndex, card, width, autoFlip, handleFlip }) => {
  const isFlipped = useSharedValue(false);
  const scale = useSharedValue(1); // Scale value for hover animation
  const duration = 500;

  const handleFlipCard = () => {
    console.log("handleFlipCard triggered with cardIndex: " + cardIndex);
    isFlipped.value = true;
    handleFlip(cardIndex);
  };

  const handleMouseEnter = () => {
    scale.value = withTiming(1.1, { duration, easing: Easing.out(Easing.ease) });
  };

  const handleMouseLeave = () => {
    scale.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
  };

  useEffect(() => {
    if (autoFlip) {
      handleFlipCard();
    }
  }, [autoFlip]);

  const zoomAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
  }));

  const backCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration, easing: Easing.inOut(Easing.ease) });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  const frontCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration, duration, easing: Easing.inOut(Easing.ease) });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  return (
    <Animated.View
      style={[{
        position: "relative",
        width,
        aspectRatio: 488 / 680,
        borderRadius: width * 0.05,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      }, zoomAnimatedStyle]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Card back */}
      <Animated.View 
        style={[
          { position: "absolute", width: "100%", height: "100%", zIndex: 1, backfaceVisibility: "hidden" }, 
          backCardAnimatedStyle
        ]}
      >
        <TouchableOpacity
          onPress={handleFlipCard}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: width * 0.05,
          }}
        >
          <Image
            source={images.card_back}
            resizeMode="contain"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: width * 0.05,
            }}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Card front */}
      <Animated.View 
        style={[
          { width: "100%", height: "100%", zIndex: 2, backfaceVisibility: "hidden" }, 
          frontCardAnimatedStyle
        ]}
      >
        <View 
          className="bg-light-yellow rounded-full w-[33%] py-1 px-2 justify-center" 
          style={{zIndex: 3, position: "absolute", right: "33%", bottom:"-5%"}}>
          <Text className="text-xs font-sans-semibold">
            {`$ ${(parseFloat(card.final_price)).toFixed(2)}`}
          </Text>
        </View>
        <CardDisplay card={card} maxWidth={width} shadow={false} />
      </Animated.View>

    </Animated.View>
  );
};

const CardFlipperWeb = ({ cards }) => {
  const [ autoFlipIndex, setAutoFlipIndex ] = useState(-1);
  const [ totalValue, setTotalValue ] = useState(0);
  const [ topCard, setTopCard ] = useState(cards[0]);

  const sounds = {
    bloop: "paper-collect-3",
    highlight: "charming-twinkle",
    summary: "magical-twinkle",
  };

  const flipAllCards = () => {
    cards.forEach((_, index) => {
      setTimeout(() => {
        setAutoFlipIndex(index);
      }, index * 300);
    });
  };

  const handleFlip = (cardIndex) => {
    soundManager.playSfx(sounds.bloop);
    const card = cards[cardIndex];
    const price = card.final_price || 0;

    if (parseFloat(price) > parseFloat(topCard.final_price)) {
      setTopCard(cards[cardIndex]);
    }

    if (parseFloat(price) >= PRICE_HIGHLIGHT_THRESHOLD) {
      soundManager.playSfx(sounds.highlight);
    }

    setTotalValue(prev => (parseFloat(prev) + parseFloat(price)).toFixed(2));
  }

  return (
    <View className="mt-24 h-screen items-center">
      
      <View className="flex-row w-[500px] justify-center items-center">
        <View className="flex-column justify-center items-center gap-2">
          <Text className="text-center font-sans-semibold tracking-wide text-light-text dark:text-dark-text">
            Total Pack Value:
          </Text>
          <Text className="text-center font-sans-bold text-3xl tracking-wider text-light-dark-yellow">
            {`USD ${totalValue}`}
          </Text>
        </View>

        <View className="flex-1"/>

        <View className="flex-column justify-center items-center gap-2">
          <Text className="text-center font-sans-semibold tracking-wide text-light-text dark:text-dark-text">
            Highest Card Value:
          </Text>
          <Text className="text-center font-sans-bold text-3xl tracking-wider text-light-dark-yellow">
            {`USD ${parseFloat(topCard.final_price)}`}
          </Text>
        </View>
      </View>
      
      { Platform.OS === "web" && (
        <View 
          className="items-center justify-center flex-row flex-wrap gap-4 mt-5"
          style={{ marginLeft: 120, marginRight: 120 }}
        >
          {cards.map((card, index) => (
            <FlipCard
              key={index} 
              card={card}
              width={180}
              autoFlip={autoFlipIndex === index}
              handleFlip={handleFlip}
              cardIndex={index}
            />
          ))}
        </View>
      )}

      <View className="justify-center items-center mb-2">
        <Button 
          title="Reveal All Cards"
          handlePress={() => flipAllCards()}
          containerStyles="mt-12 w-fit"
          variant="small-primary"
        />
      </View>

    </View>
  )

};

export default CardFlipperWeb;