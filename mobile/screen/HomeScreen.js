import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { styled } from 'nativewind'; // Import styled from nativewind
import { useNavigation } from '@react-navigation/native'; // For navigation

// Styled components using nativewind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

// Categories data for the carousel
const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
];

// Latest Jobs data (mock data for the sake of this example)
const latestJobs = [
    { _id: '1', title: 'Frontend Developer', company: 'Company A' },
    { _id: '2', title: 'Backend Developer', company: 'Company B' },
    { _id: '3', title: 'Data Scientist', company: 'Company C' },
    { _id: '4', title: 'Graphic Designer', company: 'Company D' },
    { _id: '5', title: 'FullStack Developer', company: 'Company E' },
    { _id: '6', title: 'Software Engineer', company: 'Company F' },
];

const HomeScreen = () => {
    const [query, setQuery] = useState("");
    const navigation = useNavigation();

    const searchJobHandler = (query) => {
        navigation.navigate("Browse", { query }); // Navigate to Browse screen with query
    };

    return (
        <StyledScrollView className="flex-1 bg-white">
            {/* Hero Section */}
            <StyledView className="my-10">
                <StyledText className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
                    No. 1 Job Hunt Website
                </StyledText>
                <StyledText className="text-5xl font-bold text-center mt-5 mb-3">
                    Search, Apply &{"\n"}
                    Get Your <StyledText className="text-[#6A38C2]">Dream Jobs</StyledText>
                </StyledText>
                <StyledText className="text-center mb-5 text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!
                </StyledText>

                {/* Search Field */}
                <StyledView className="flex-row w-[90%] mx-auto mt-5 shadow-lg border border-gray-200 rounded-full items-center">
                <StyledTextInput
                    className="flex-1 outline-none border-none px-4 py-2"
                    placeholder="Find your dream jobs"
                    value={query}
                    onChangeText={setQuery}
                />
                <StyledTouchableOpacity
                    onPress={() => searchJobHandler(query)}
                    className="bg-[#6A38C2] p-3 rounded-r-full"
                >
                    <StyledText className="text-white text-sm">Search</StyledText>
                </StyledTouchableOpacity>
            </StyledView>

            </StyledView>

            {/* Category Carousel */}
            <StyledView className="my-10">
                <StyledText className="text-2xl font-bold text-center mb-5">Browse by Category</StyledText>
                <StyledScrollView
                    horizontal
                    className="w-full max-w-xl mx-auto"
                    showsHorizontalScrollIndicator={false}
                >
                    {categories.map((category, index) => (
                        <StyledView key={index} className="flex-none w-40 mx-2">
                            <StyledTouchableOpacity
                                onPress={() => searchJobHandler(category)}
                                className="rounded-full border border-gray-300 p-3 bg-white shadow-sm"
                            >
                                <StyledText className="text-center text-black">{category}</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    ))}
                </StyledScrollView>
            </StyledView>

            {/* Latest Jobs - Card View */}
            {/* Latest Jobs - Card View */}
            {/* Latest Jobs - Card View */}
            <StyledView className="max-w-7xl mx-auto my-20">
                <StyledText className="text-4xl font-bold mb-5">
                    <StyledText className="text-[#6A38C2]">Latest & Top </StyledText> Job Openings
                </StyledText>
                <FlatList
                    data={latestJobs}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
                    showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
                    ListEmptyComponent={
                        <StyledText className="text-center text-gray-500">No Job Available</StyledText>
                    }
                    contentContainerStyle="gap-6 my-5 px-4" // Padding on left and right
                    numColumns={2} // Display items in 2 columns
                    renderItem={({ item }) => (
                        <StyledView className="w-full p-4 border border-gray-200 rounded-lg bg-white shadow-lg mx-2"> 
                            {/* Added margin on the x-axis (left and right) */}
                            <StyledText className="text-lg font-bold text-[#6A38C2]">{item.title}</StyledText>
                            <StyledText className="text-sm text-gray-500">{item.company}</StyledText>
                            <StyledTouchableOpacity
                                onPress={() => alert(`Applying for ${item.title}`)}
                                className="mt-4 py-2 px-4 bg-[#6A38C2] text-white rounded-lg text-center"
                            >
                                <StyledText className="text-white">Apply Now</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    )}
                />
            </StyledView>



        </StyledScrollView>
    );
};

export default HomeScreen;
