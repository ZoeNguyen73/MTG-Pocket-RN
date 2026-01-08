import { View, FlatList, Text } from "react-native";

import CardCollectionDisplay from "./CardCollectionDisplay";

import useDeviceLayout from "../../hooks/useDeviceLayout";

const CardCollection = ({ 
  cards, 
  headerHeight, 
  listWidth, 
  updateFavourite, 
  startSlideshowDesktop,
 }) => {

  const { isDesktopWeb, width } = useDeviceLayout();

  const handleStartSlideshow = (index) => {
    startSlideshowDesktop(index);
  };

  if (isDesktopWeb) {
    return (
      <>
        {cards.length > 0 && (
          <FlatList 
            data={cards}
            keyExtractor={card => card._id}
            numColumns={5}
            ListHeaderComponent={
              <View
                style={{
                  height: headerHeight + 10,
                  width: "100%",
                }}
              />
            }
            ListFooterComponent={
              <View
                style={{
                  height: 10,
                  width: "100%",
                }}
              />
            }
            columnWrapperStyle={{
              flex: "row",
              justifyContent: "center",
              paddingTop: 10,
            }}
            renderItem={({item, index}) => {
              return (
                <CardCollectionDisplay 
                  card={item.card_id} 
                  maxWidth={(width * 0.8) / 7}
                  quantity={item.quantity}
                  finish={item.finish}
                  finalPrice={item.final_price}
                  favourite={item.is_favourite}
                  id={item._id}
                  handleFavouriteToggle={() => updateFavourite(item._id)}
                  handleClickDesktop={() => handleStartSlideshow(index)}
                />
              )
            }}

          />
        )}
        {cards.length === 0 && (
          <Text className="text-center font-sans-bold tracking-wider text-dark-text text-xl">
            No cards found
          </Text>
        )}
      </>
        
    )
  }

  return (
    <>
      {cards.length > 0 && (
        <FlatList 
          data={cards}
          keyExtractor={card => card._id}
          numColumns={3}
          ListHeaderComponent={
            <View
              style={{
                height: headerHeight + 10,
              }}
            />
          }
          ListFooterComponent={
            <View
              style={{
                height: 90,
                width: "100%"
              }}
            />
          }
          columnWrapperStyle={{
            flex: "row",
            justifyContent: "space-between",
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 8,
            maxWidth: width,
          }}
          renderItem={({item}) => {
            return (
              <CardCollectionDisplay 
                card={item.card_id} 
                maxWidth={width / 3.3}
                quantity={item.quantity}
                finish={item.finish}
                finalPrice={item.final_price}
                favourite={item.is_favourite}
                id={item._id}
                handleFavouriteToggle={() => handleFavouriteToggle(item._id)}
              />
            )
          }}
        />
      )}

      {cards.length === 0 && (
        <Text className="text-center font-sans-bold tracking-wider text-dark-text text-base">
          No cards found
        </Text>
      )}
    </>
    
  )
};

export default CardCollection;