import React, { useState, useEffect, useRef, Component } from 'react';
import axios from 'axios';
import ScreenAdmin from '../components/ScreenAdmin';
import { Text, View } from '../components/Themed';
import { Image, StyleSheet, Dimensions, Pressable, TextInput, TouchableWithoutFeedback, Modal, FlatList, TouchableOpacity } from 'react-native';


interface Product {
    id: number;
    name: string;
    info: string;
    price: number;
    availableQuantity: number;
    imageUrl: string;
}

interface State {
    products: Product[];
    hoveredCategory: string | null;
    isModalVisible: boolean;
    selectedImage: File | null;
    imageInfo: string;
    product_id: number;
    images: string[],
}

class DBManager extends Component<{}, State> {

    state: State = {
        products: [],
        images: [],
        hoveredCategory: null,
        isModalVisible: false,
        selectedImage: null,
        imageInfo: '',
        product_id: 0,

    };

    //axios.get(`http://localhost:9191/imageByProductId/${pid}`).data[0].imageUrl
    async getImage(pid) {
        try {
            const response = await axios.get(`http://localhost:9191/imageByProductId/${pid}`);
            return response.data[0].imageUrl;
        } catch (error) {
            console.error('Error fetching products:', error);

        }
        //finally{return null;}
    };

    async fetchImages(response) {
        const imagePromises = response.data.map(async (product) => {
            const imageUrl = await this.getImage(product.id);
            return { [product.id]: imageUrl };
        });

        const resolvedImages = await Promise.all(imagePromises);
        const imagesObject = resolvedImages.reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});

        this.setState({ images: imagesObject });
    };

    componentDidMount() {
        axios
            .get('http://localhost:9191/products')
            .then((response) => {
                this.setState({ products: response.data });
                this.fetchImages(response);

            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });

    }

    handleDelete = (productId: number, item: any) => {
        axios.delete(`http://localhost:9191/deleteProduct/${productId}`);
        const updatedProducts = this.state.products.filter((product) => product.id !== productId);
        this.setState({ products: updatedProducts });
    };

    handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];

        if (selectedFile) {
            this.setState({ selectedImage: selectedFile });
        }
    };

    uploadImage = () => {
        const { selectedImage, imageInfo, product_id } = this.state;

        if (selectedImage) {
            // Create a FormData object to send the image file and info
            const formData = new FormData();
            formData.append('file', selectedImage);
            formData.append('name', imageInfo);
            formData.append('product_id', product_id);


            // Make an Axios request to upload the image and info
            axios
                .post('http://localhost:9191/uploadMoreImages', formData)
                .then((response) => {
                    // Handle the response as needed
                    console.log('Image uploaded successfully', response.data);

                    // Close the modal and reset state
                    this.setState({
                        isModalVisible: false,
                        selectedImage: null,
                        imageInfo: '',
                    });
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                });
        }
    };

    addImages = (productId: number, item: any) => {
        console.log('prod', item);
    };


    handleModify = (productId: number) => {
        console.log('modify')
    };

    handleMouseEnter = (category: string) => {
        this.setState({ hoveredCategory: category });
    };

    handleMouseLeave = () => {
        this.setState({ hoveredCategory: null });
    };

    render() {
        return (
            <View>
                <Modal
                    visible={this.state.isModalVisible}
                    transparent={true}
                    animationType="slide"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(50,200,255,0.2)" }}>
                        <View style={{ backgroundColor: "rgba(200,200,200,0.9)", padding: 20, borderRadius: 10, width: '30%' }}>
                            {this.state.selectedImage && (
                                <Image
                                    source={{ uri: URL.createObjectURL(this.state.selectedImage) }}
                                    style={{ width: 200, height: 200, marginBottom: 10 }}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={this.handleFileChange}
                                style={{ marginBottom: 10, }}
                            />
                            <TextInput
                                placeholder="Enter image info"
                                value={this.state.imageInfo}
                                onChangeText={(text) => this.setState({ imageInfo: text })}
                                style={{ borderBottomWidth: 1, marginBottom: 20, marginTop: 10 }}
                            />
                            <TouchableOpacity
                                onPress={this.uploadImage}
                                style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center', width: '30%', alignSelf: 'center' }}
                            >
                                <Text style={{ color: 'rgba(200,200,200,1)', fontWeight: 'bold' }}>Upload Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.setState({ isModalVisible: false })}
                                style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10, width: '30%', alignSelf: 'center' }}
                            >
                                <Text style={{ color: 'rgba(200,200,200,1)', fontWeight: 'bold' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal >
                <Text style={{ fontSize: 20, textAlign: 'center', marginTop: '3%' }}>
                    Product Explorer
                </Text>
                <View style={{
                    height: 1, width: '90%', alignSelf: 'center', marginBottom: '4%', marginTop: '2%'

                }} lightColor="#eee" darkColor="rgba(255,255,255,0.6)" />
                <FlatList
                    data={this.state.products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: '#ccc',
                                backgroundColor:
                                    this.state.hoveredCategory === item.name ? 'rgba(10, 91, 233, 0.5)' : 'transparent',
                            }} onMouseEnter={() => this.handleMouseEnter(item.name)}
                            onMouseLeave={this.handleMouseLeave}
                        >
                            <View
                                style={{
                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                    paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'transparent',
                                }}
                            >


                                <View style={{
                                    flexDirection: 'row', backgroundColor: 'transparent',
                                    paddingLeft: this.state.hoveredCategory === item.name ? 20 : 0,
                                }}>
                                    <Image source={{ uri: this.state.images[item.id] }} style={{
                                        width: 50, height: 40, marginRight: '20%', marginLeft: '1%',

                                    }} resizeMode='contain'
                                    />

                                    <Text style={{
                                        color: this.state.hoveredCategory === item.name ? 'rgba(255, 192, 14, 0.7)' : 'white',
                                        fontSize: 16, marginRight: '20%',
                                    }}>{item.name}</Text>
                                    <Text style={{
                                        color: this.state.hoveredCategory === item.name ? 'rgba(255, 192, 14, 0.7)' : 'white',
                                        marginRight: '20%',
                                    }}>{item.info}</Text>
                                    <Text style={{
                                        color: this.state.hoveredCategory === item.name ? 'rgba(255, 192, 14, 0.7)' : 'white',
                                        fontWeight: 'bold', marginRight: '20%',
                                    }}>€{item.price}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isModalVisible: true, product_id: Number(item.id) })}
                                    style={{ marginRight: 10, padding: 5, backgroundColor: 'rgba(255, 192, 14, 0.9)' }}
                                >
                                    <Text style={{ color: 'rgba(235, 255, 255, 0.7)', fontWeight: 'bold', fontSize: 16 }}>Add more images</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.handleDelete(item.id, item)}
                                    style={{ marginRight: 10, padding: 5, backgroundColor: 'rgba(255, 0, 0, 0.7)' }}
                                >
                                    <Text style={{ color: 'rgba(200, 255, 255, 0.7)', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.handleModify(item.id)}
                                    style={{ padding: 5, backgroundColor: 'rgba(0, 255, 0, 0.7)' }}
                                >
                                    <Text style={{ color: 'rgba(200, 255, 255, 0.7)', fontWeight: 'bold', fontSize: 16 }}>Modify</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                    }
                />
            </View >
        );
    }
}




export default DBManager;
