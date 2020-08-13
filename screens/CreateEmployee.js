import React,{useState} from 'react';
import { StyleSheet, Text, View,Modal,KeyboardAvoidingView, Alert} from 'react-native';
import { TextInput , Button} from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateEmployee = ({navigation,route}) =>{
const getDetails = (type) =>{
  if(route.params){
switch(type){
    case "name":
        return route.params.name
        case "phone":
            return route.params.phone
            case "email":
                return route.params.email
                case "salary":
                    return route.params.salary
                    case "picture":
                        return route.params.picture
                        case "position":
                            return route.params.position    
}
  }
  return ""
}
    if(route.params){
    console.log(route.params)
    }
    const [name,setName] = useState(getDetails("name"))
    const [phone,setPhone] = useState(getDetails("phone"))
    const [email,setEmail] = useState(getDetails("email"))
    const [salary,setSalary] = useState(getDetails("salary"))
    const [position,setPosition] = useState(getDetails("position"))
    const [picture,setPicture] = useState(getDetails("picture"))
    const [modal,setModal] = useState(false)
const [enableshift,setenableShift] = useState(false)

    const submitData = () =>{
                fetch("https://employeeapp123.herokuapp.com/send-data",{
                    method:"post",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        name,
                        email,
                        phone,
                        salary,
                        picture,
                        position
                    })
                })
                .then(res=>res.json())
                .then(data =>{
                Alert.alert(`${data.name} is saved successfully`)
                navigation.navigate("Home")
                }).catch(err=>(
                    Alert.alert("something went wrong")
                ))
    }

const updateDetails =() =>{
    fetch("https://employeeapp123.herokuapp.com/update",{
        method:"post",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            id:route.params._id,
            name,
            email,
            phone,
            salary,
            picture,
            position
        })
    })
    .then(res=>res.json())
    .then(data =>{
    Alert.alert(`${data.name} is updated successfully`)
    navigation.navigate("Home")
    }).catch(err=>(
        Alert.alert("something went wrong")
    ))
}

    const pickFromGallery = async () =>{
       const {granted} =  await Permissions.askAsync(Permissions.CAMERA_ROLL)
       if(granted){
     let data = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.Images,
          allowsEditing:true,
          aspect:[1,1],
          quality:0.5
      })
      if(!data.cancelled){
        let newfile = {uri:data.uri,
            type:`test/${data.uri.split(".")[1]}`,
        name:`test.${data.uri.split(".")[1]}`
    }
    handleupload(newfile)
    }
       }else{
Alert.alert("you need to give up permission to work")
       }
    }
    const pickFromCamera = async () =>{
        const {granted} =  await Permissions.askAsync(Permissions.CAMERA)
        if(granted){
      let data= await ImagePicker.launchCameraAsync({
           mediaTypes:ImagePicker.MediaTypeOptions.Images,
           allowsEditing:true,
           aspect:[1,1],
           quality:0.5
       })
if(!data.cancelled){
    let newfile = {uri:data.uri,
        type:`test/${data.uri.split(".")[1]}`,
    name:`test.${data.uri.split(".")[1]}`
}
handleupload(newfile)
}
        }else{
 Alert.alert("you need to give up permission to work")
        }
     }

const handleupload = (image)=>{
    const data = new FormData()
    data.append('file',image)
    data.append('upload_preset','employeeAppIM')
    data.append("cloud_name","imagehelper")

    fetch("https://api.cloudinary.com/v1_1/imagehelper/image/upload",{
        method:"post",
        body:data
    }).then(res=>res.json()).
    then(data=>{
      //  console.log(data)
        setPicture(data.url)
        setModal(false)
    }).catch(err=>(
        Alert.alert("error while uploading")
    ))
}

    return(
<KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
        < View >
            
                            <TextInput 
            label='Name'
            value={name}
            theme={theme}
            onFocus={() => setenableShift(false)}
            style={styles.inputStyle}
            mode="outlined"
            onChangeText={text => setName(text)}
            />
              <TextInput 
            label='Email'
            value={email}
            theme={theme}
            onFocus={() => setenableShift(false)}
            style={styles.inputStyle}
            mode="outlined"
            onChangeText={text => setEmail(text)}
            />
              <TextInput 
            label='phone'
            value={phone}
            theme={theme}
            onFocus={() => setenableShift(false)}
            keyboardType="number-pad"
            style={styles.inputStyle}
            mode="outlined"
            onChangeText={text => setPhone(text)}
            />
                <TextInput 
            label='salary'
            value={salary}
            theme={theme}
            keyboardType="number-pad"
            onFocus={() => setenableShift(true)}
            style={styles.inputStyle}
            mode="outlined"
            onChangeText={text => setSalary(text)}
            />
                     <TextInput 
            label='position'
            value={position}
            theme={theme}
            onFocus={() => setenableShift(true)}
            style={styles.inputStyle}
            mode="outlined"
            onChangeText={text => setPosition(text)}
            />
            <Button  
            style={styles.inputStyle}
            icon={picture==""?"upload":"check"} 
             theme={theme}
            mode="contained" 
            onPress={() => setModal(true)}>
            Upload Image
            </Button>
            {route.params?
 <Button  
 style={styles.inputStyle}
 icon="content-save" 
  theme={theme}
 mode="contained" 
 onPress={() => updateDetails()}>
 Update Details
 </Button>

:
            <Button  
            style={styles.inputStyle}
            icon="content-save" 
             theme={theme}
            mode="contained" 
            onPress={() => submitData()}>
            Save
            </Button>
}
            <Modal 
            animationType="slide"
            transparent={true}
            visible={modal}
            onRequestClose={() =>{setModal(false)}}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalButtonView}>
                    <Button icon="camera"  theme={theme} mode="contained" onPress={() => pickFromCamera()}>
            camera
            </Button><Button icon="image-area"  theme={theme} mode="contained" onPress={() => pickFromGallery()}>
            Gallery
            </Button>
                    </View>
                <Button   theme={theme} onPress={() => setModal(false)}>
            Cancel
            </Button>
                </View>
            </Modal>
          

        </View>
        </KeyboardAvoidingView>
   
    )
}
const theme ={
    colors:{
        primary:"#006aff"
    }
}
const styles=StyleSheet.create({
    root:{
        flex:10
    },
    inputStyle:{
        margin:5
    },
    modalView:{
        position:"absolute",
        bottom:2,
        width:"100%",
backgroundColor:"#e0e0e0"
    },
    modalButtonView:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:10
    }
})

export default CreateEmployee