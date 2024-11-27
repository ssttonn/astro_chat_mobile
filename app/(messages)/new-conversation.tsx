import CircularIcon from "@/components/common/CircularIcon";
import Clickable from "@/components/common/Clickable";
import MainTextField from "@/components/common/MainTextField";
import ConversationRoomLayout from "@/components/conversation/ConversationRoomLayout";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text } from "react-native";

const NewConversationScreen = () => {
  const containerRef = useRef<any>(null);

  const [topPosition, setTopPosition] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useLayoutEffect(() => {
    if (containerRef.current && isSearching) {
      containerRef.current.measure(
        (
          fx: number,
          fy: number,
          width: number,
          height: number,
          px: number,
          py: number,
        ) => {
          const newTopPosition = py + height;

          if (newTopPosition !== topPosition) setTopPosition(newTopPosition);
        },
      );
    }
  }, [isSearching, topPosition]);

  const addNewUserIcon = useMemo(
    () => <MaterialCommunityIcons name="plus" size={24} color="#247cff" />,
    [],
  );

  const backIcon = useMemo(
    () => <Ionicons name="chevron-back" size={24} />,
    [],
  );

  const accountSearchIcon = useMemo(
    () => (
      <MaterialCommunityIcons
        name="account-search"
        size={24}
        className="mr-2"
        color="#247cff"
      />
    ),
    [],
  );

  const onSearchFocus = useCallback(() => {
    setIsSearching(true);
  }, [setIsSearching]);

  const onBlur = useCallback(() => {
    setIsSearching(false);
  }, [setIsSearching]);

  const headerComponent = useMemo(() => {
    console.log("NewConversationScreen rendered");
    return (
      <View>
        <View className="flex flex-row items-center px-4">
          <CircularIcon
            className="bg-whiteGrey-300 rounded-full p-3"
            onPress={router.back}
          >
            {backIcon}
          </CircularIcon>
          <MainTextField
            containerClassName="mx-4 my-2 flex-1"
            placeholder="Search for a user"
            prefix={accountSearchIcon}
            onBlur={onBlur}
            onFocus={onSearchFocus}
            label={"Search"}
            type={"default"}
          />
        </View>

        <View ref={containerRef} className="flex flex-wrap flex-row px-6 mb-2">
          {["user1", "user2", "user3", "user4", "user5", "user6"].map(
            (username) => (
              <View
                key={username}
                className="flex flex-row bg-primary rounded-full pl-3 pr-2 py-1 mr-1 mb-1 items-center"
              >
                <Text className="font-KelsonBold text-md text-white">
                  {username}
                </Text>
                <Clickable>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="white"
                  />
                </Clickable>
              </View>
            ),
          )}
        </View>
      </View>
    );
  }, [accountSearchIcon, backIcon, onBlur, onSearchFocus]);

  return (
    <>
      <ConversationRoomLayout>{headerComponent}</ConversationRoomLayout>
      <View
        className={`absolute right-0 left-0 z-100 bg-white shadow-main mx-4 rounded-xl ${isSearching ? "opacity-1" : "opacity-0"}`}
        style={{
          top: topPosition,
        }}
      >
        {["searchUser1", "searchUser2", "searchUser3", "searchUser4"].map(
          (user) => (
            <View
              key={user}
              className="flex flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            >
              <Text className="text-lg">{user}</Text>
              <CircularIcon
                shouldDismissKeyboardWhenClicked={false}
                onPress={() => {
                  console.log("Add user");
                }}
              >
                {addNewUserIcon}
              </CircularIcon>
            </View>
          ),
        )}
      </View>
    </>
  );
};

export default NewConversationScreen;
