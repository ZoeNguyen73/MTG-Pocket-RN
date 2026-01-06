import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { router } from "expo-router";

import { images } from "../../constants";
import { soundManager } from "../../utils/SoundManager";

import CardDisplay from "./CardDisplay";
import Button from "../CustomButton/CustomButton";
import FinishChip from "../FinishChip";

import Sparkles from "../Sparkles";

const PRICE_HIGHLIGHT_THRESHOLD = 5;

const FlipCard = ({ cardIndex, card, width, autoFlip, handleFlip, flippedAll, topCardIndex }) => {
  const isFlipped = useSharedValue(false);
  const scale = useSharedValue(1); // Scale value for hover animation
  const duration = 500;
  const priceHightlight = card.final_price ? parseFloat(card.final_price) >= PRICE_HIGHLIGHT_THRESHOLD : true;
  const isTopCard = cardIndex === topCardIndex;

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

      {/* { flippedAll && isTopCard && (
        <View style={{position: "absolute", zIndex: 50, height: "100%", width: "100%"}}>
          <Sparkles /> 
        </View>
      )} */}

      {/* Card front */}
      <Animated.View 
        style={[
          { width: "100%", height: "100%", zIndex: 2, backfaceVisibility: "hidden" }, 
          frontCardAnimatedStyle
        ]}
      >
        { card.special_foil_finishes.length > 0 && (
          <View 
            className="flex-row w-full"
            style={{zIndex: 3, position: "absolute", bottom:"-5%"}}
          >
            <View 
              className="w-[40%]"
            >
              <FinishChip 
                text={card.special_foil_finishes.length ? card.special_foil_finishes[0] : card.finish}
              />
            </View>
            <View className="flex-1"/>
            <View 
              className={`${priceHightlight ? "bg-light-yellow" : "bg-white/70"} rounded-full w-[50%] py-1 px-2`} 
            >  
              <Text className="text-xs font-sans-semibold text-center">
                {card.final_price ? `$ ${(parseFloat(card.final_price)).toFixed(2)}` : "no market price"}
              </Text>
            </View>
          </View>
        )}
        
        { !card.special_foil_finishes.length && (
          <View 
            className={`${priceHightlight ? "bg-light-yellow" : "bg-white/70"} rounded-full w-[50%] py-1 px-2`} 
            style={{zIndex: 3, position: "absolute", right: "25%", bottom:"-5%"}}>
            <Text className="text-xs font-sans-semibold text-center">
              {card.final_price ? `$ ${(parseFloat(card.final_price)).toFixed(2)}` : "no market price"}
            </Text>
          </View>
        )}
      
        { card.is_new && (
          <View 
            className={`bg-light-blue rounded-full w-[40%] py-1 px-2`} 
            style={{zIndex: 3, position: "absolute", right: "30%", top:"-5%"}}>
            <Text className="text-xs font-sans-semibold text-center text-dark-text">
              New!
            </Text>
          </View>
        )}
        <CardDisplay 
          card={card} 
          maxWidth={width} 
          shadow={false} 
          animateFoil={false} 
          enableFlip={true}
        />
      </Animated.View>
      
      { isFlipped.value && card.final_price && parseFloat(card.final_price) >= PRICE_HIGHLIGHT_THRESHOLD && (
        <View
          style={{
            position: "absolute",
            left: "50%",
            transform: [{ translateX: width * -0.5 }, { translateY: "10%" }], // Center glow
            width: "100%", // Width of the glow
            height: "80%", // Height of the glow
            backgroundColor: "rgba(255, 215, 0, 0.01)", // Semi-transparent yellow
            borderRadius: 70, // Rounded edges for glow
            shadowColor: "yellow",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 40, // Creates the "glow" effect
            elevation: 35, // Android shadow
            zIndex: -1, // Place glow behind the content
          }}
        />
      )}

    </Animated.View>
  );
};

const CardFlipperWeb = ({ cards, setCode, packType, packPrice }) => {
  const [ autoFlipIndex, setAutoFlipIndex ] = useState(-1);
  const [ totalValue, setTotalValue ] = useState(0);
  const [ topCardIndex, setTopCardIndex ] = useState(-1);
  const [ flippedAll, setFlippedAll ] = useState(false);
  const [ flipCount, setFlipCount ] = useState(0);
  const [ disableFlipAllButton, setDisableFlipAllButton ] = useState(false);

  const sounds = {
    bloop: "paper-collect-3",
    highlight: "charming-twinkle",
    summary: "magical-twinkle",
  };

  const flipAllCards = () => {
    setDisableFlipAllButton(true);
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

    // if it is the first card that is flipped
    if (topCardIndex === -1) {
      setTopCardIndex(cardIndex);

    // if current card's price is higher than current top card
    } else if (parseFloat(price) > parseFloat(cards[topCardIndex].final_price)) {
      setTopCardIndex(cardIndex);
    }

    if (parseFloat(price) >= PRICE_HIGHLIGHT_THRESHOLD) {
      soundManager.playSfx(sounds.highlight);
    }

    setTotalValue(prev => (parseFloat(prev) + parseFloat(price)).toFixed(2));
    setFlipCount(prev => prev + 1);
    if (flipCount === cards.length - 1) {
      setFlippedAll(true);
      setDisableFlipAllButton(true);
    }
  }

  return (
    <View className="mt-24 h-screen items-center">
      
      <View className="flex-row w-[500px] justify-center items-center">
        <View className="flex-column justify-center items-center gap-2">
          <Text className="text-center font-sans-semibold tracking-wide text-light-text dark:text-dark-text">
            Total Pack Value:
          </Text>
          <View 
            className="mt-1 rounded-full min-h-[45px] min-w-[200px] justify-center items-center"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.6,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View className="justify-center items-center flex-row gap-1">
              <Text className="text-light-yellow font-sans-bold text-2xl tracking-wider">
                {`USD ${totalValue}`}
              </Text>
            </View>
          </View>
          <Text className={`${totalValue-packPrice < 0 ? "text-light-red" : "text-light-green"} font-sans tracking-wider text-sm h-[14px]`}>
            {`${totalValue-packPrice < 0 ? "Loss" : "Profit"}: ${totalValue-packPrice < 0 ? "-" : ""}$${Math.abs(parseFloat(totalValue - packPrice).toFixed(2))} ${totalValue-packPrice < 0 ? "🤡" : "🤑"}`}
          </Text>
        </View>

        <View className="flex-1"/>

        <View className="flex-column justify-center items-center gap-2">
          <Text className="text-center font-sans-semibold tracking-wide text-light-text dark:text-dark-text">
            Highest Card Value:
          </Text>
          <View 
            className="mt-1 rounded-full min-h-[45px] min-w-[200px] justify-center items-center"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.6,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View className="justify-center items-center flex-row gap-1">
              <Text className="text-dark-maroon font-sans-bold text-2xl tracking-wider">
                {topCardIndex === -1 ? `USD 0.00` : `USD ${parseFloat(cards[topCardIndex].final_price)}`}
              </Text>
            </View>
          </View>
          <View className="h-[14px]"/>
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
              width={160}
              autoFlip={autoFlipIndex === index}
              handleFlip={handleFlip}
              cardIndex={index}
              flippedAll={flippedAll}
              topCardIndex={topCardIndex}
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
          isDisabled={disableFlipAllButton}
        />
      </View>

      { flippedAll && (
        <View className="flex-row gap-3 mt-5 mb-5">
          { packType && (
            <Button 
              title="Open Another Pack"
              handlePress={() => router.replace(`/pack/${packType}/${setCode}`)}
              variant="small-primary"
            />
          )}
          
          <Button 
            variant="small-secondary"
            title="Back to Home"
            handlePress={() => router.replace(`/home`)}
          />
        </View>
      )}

    </View>
  )

};

export default CardFlipperWeb;