import React,{useEffect,useState} from 'react'
import { StyleSheet, Text, View, Image,FlatList ,ActivityIndicator} from 'react-native'
import { Card ,FAB} from 'react-native-paper'

const Home=({navigation})=>{
     const [data,setData] = useState([])
     const [Loading,setLoading] = useState(true)


const fetchData =() =>{
    fetch("https://employeeapp123.herokuapp.com/")
    .then(res => res.json())
    .then(results=>{setData(results)
    setLoading(false)
    }).catch(err=>(
        Alert.alert("something went wrong")
    ))
}

useEffect(() => {
fetchData()
   
},[])
   const renderlist = ((item) =>{
  return(
    <Card style={styles.mycard} 
    onPress={() =>navigation.navigate("Profile",{item})}
    >
    <View style={styles.cardView}>
        <Image 
        style={{width:50,height:50,borderRadius:30}}
        source={{uri:item.picture}}
      
      />
      <View style={{marginLeft:10}}>
<Text style={styles.text}> {item.name}</Text>
  <Text style={styles.text}> {item.position}</Text>
</View>
</View>
   </Card>
  )
    })
    return (
        <View style={{flex:1}}>
          
        <FlatList 
        data={data}
        renderItem={({item}) =>{
        return renderlist(item)
        }}
        
        keyExtractor={ item=>`${item._id}`}
        onRefresh={() =>fetchData()}
        refreshing={Loading}
        />
    
     <FAB onPress={() =>navigation.navigate("Create")}
      style={styles.fab}
      small={false}
      icon="plus"
      theme={{colors:{accent:"#006aff"}}}
     
      />
</View>
    )          
}

const styles = StyleSheet.create({
    mycard:{
        margin:20,
    },
    cardView:{
        flexDirection:"row",
        padding:6
    },
    text:{
        fontSize:18
    },
    fab: {
        position:'absolute',
        margin:15,
        right:0,
        bottom:0,
    }
})
export default Home