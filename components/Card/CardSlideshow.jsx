import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { SvgXml } from "react-native-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import useDeviceLayout from "../../hooks/useDeviceLayout";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import { useAuthContext } from "../../context/AuthProvider";

import CardDisplay from "./CardDisplay";
import SmallCardDisplay from "./SmallCardDisplay";
import FinishChip from "../FinishChip";

const CardSlideshow = ({ card, userCardId, updateFavourite }) => {
  console.log("card passed to CardSlideshow: " + JSON.stringify(card));
  const { isDesktopWeb, width } = useDeviceLayout();
  const { handleError } = useErrorHandler();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();

  const [ iconXml, setIconXml ] = useState("<svg></svg>");
  const [ relatedCards, setRelatedCards ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    const getCardData = async () => {
      try {
        const xml = await ( await fetch(card.set_id.icon_svg_uri)).text();
        const response = await axios.get(`/user-cards/${userCardId}`);
        const cardData = response.data;
        console.log("related cards: " + JSON.stringify(cardData.related_cards));
        setRelatedCards([...cardData.related_cards]);
        setIconXml(xml);
      } catch (error) {
        await handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCardData();
  }, [userCardId]);

  return (
    <View 
      style={{
        width: "90%",
        height: "100%",
        flexDirection: "row",
        padding: 20
      }}    
    >
      <View
        style={{
          width: 400,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardDisplay 
          card={card}
          maxWidth={300}
          shadow={true}
          enableFlip={true}
          animateFoil={true}
        />
      </View>
      
      <View
        style={{
          flexGrow: 1,
          flexDirection: "column",
          // justifyContent: "space-between",
          padding: 20
        }}
      >
        <Text
          className={`${width < 400 ? "text-xl" : "text-3xl"} tracking-wide text-light-yellow font-serif-bold`}
        >
          {card.card_faces[0].name}
        </Text>

        <View className="flex-row gap-1 mt-1 items-center">
          <SvgXml
            xml={iconXml
              .replace(/fill=(["'])(?:(?=(\\?))\2.)*?\1/g, `fill="white"`)}
            width={15}
            height={15}
            fill={"white"}
          />
          <Text
            className="text-xs tracking-wide text-dark-text font-sans-italic border-2 border-transparent"
          >
            {card.set_id.name}
          </Text>
          <FinishChip 
            text={card.special_foil_finish ? card.special_foil_finish : card.finish }
            size="xs"
            shortened={false}
          />
        </View>

        <View className="flex-row items-center gap-2 mt-3">
          <View
            className="rounded-full border-2 border-light-grey1 justify-center items-center"
            style={{
              paddingHorizontal: 10, // px-3
              paddingVertical: 2, // py-1
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.5,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text
              className={`${width < 400 ? "text-xs" : "text-base"} tracking-wide text-dark-text font-sans-italic`}
            >
              {card.rarity}
            </Text>
          </View>
          
          <View
            className="bg-light-yellow"
            style={{
              borderRadius: 999, // rounded-full
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10, // px-3
              paddingVertical: 2, // py-1
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.5,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text
              className={`text-left ${width < 400 ? "text-xs" : "text-base"} tracking-wide text-light-text font-sans-semibold`}
            >
              {card.final_price ? `USD ${card.final_price}` : "no market price"}
            </Text>
          </View>

          {/* Favourite */}
          <TouchableOpacity 
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => updateFavourite(userCardId)}
          >
            { card.is_favourite && (
              <MaterialCommunityIcons name="heart" size={24} color="#dc8a78" />
            )}
            { !card.is_favourite && (
              <MaterialCommunityIcons name="heart" size={24} color="rgba(156, 160, 176, 0.8)" />
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2 mt-5">
          <Text 
            className={`${width < 400 ? "text-sm" : "text-lg"} tracking-wide text-dark-text font-sans-semibold`}
          >
            Quantity Owned:
          </Text>
          <Text 
            className={`${width < 400 ? "text-sm" : "text-lg"} tracking-wide text-dark-text font-sans-semibold`}
          >
            {card.quantity}
          </Text>      
        </View>

        <View className="mt-3">
          <Text
            className={`${width < 400 ? "text-sm" : "text-lg"} tracking-wide text-dark-text font-sans-semibold`}
          >
            Other Variants:
          </Text>
        </View>

        { relatedCards.length === 0 && (
          <View className="mt-2">
            <Text
              className="text-sm tracking-wide text-dark-text font-sans-italic"
            >
              No other variants currently found in database
            </Text>
          </View>
        )}

        { relatedCards.length > 0 && (
          <FlatList 
            data={relatedCards}
            keyExtractor={card => card._id}
            numColumns={3}
            columnWrapperStyle={{
              flex: "row",
              gap: 5,
              justifyContent: "between",
              paddingTop: 5,
            }}
            renderItem={({item}) => {
              return (
                <SmallCardDisplay 
                  key={item._id}
                  card={item}
                  maxWidth={120}
                  isGreyscale={!item.is_owned}
                  label={ item.is_owned ? "owned" : "not owned"}
                />
              )
            }}
          
          />
        )}

      </View>

      
    </View>
  )
};

export default CardSlideshow;