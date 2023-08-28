
import {
  ChakraProvider,
  Box,
  Tag,
  Text,
  Link,
  Image,
  Divider,
  HStack,
  VStack,
  Code,
  Grid,
  theme,
  Heading,
  Center,
  Button,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Drawer,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  useDisclosure,
  IconButton,
  Flex, 
  Spacer
} from '@chakra-ui/react';
import React, { Component }  from 'react';
import { FiPlay, FiSearch, FiPause, FiMoreHorizontal } from "react-icons/fi"

import axios from 'axios';
import {useEffect, useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, {textFilter, multiSelectFilter} from 'react-bootstrap-table2-filter';
import ReactAudioPlayer from 'react-audio-player';


function App() {
  const [data,setData]=useState([])
  useEffect(()=>{
    getData() 
  },[]);
  const getData=()=>{
    axios('http://127.0.0.1:5000/sound_info').then(res=>{
      console.log(res.data)
      setData(res.data)
    })
  };

  function nameFormatter(cell, row, rowIndex) {

    console.log(row)
    console.log("Call")
    console.log(rowIndex)

    return (
      <p>{` ${row.name}`} <DrawerExample uuid={row.uuid}/></p>
    );
  }


  function itemFormatter(cell, row, rowIndex) {
    console.log(row)
    return (
      <Flex h='40px'>
        <Center axis='vertical'><Text as='b'>{row.name}</Text></Center>
      </Flex>
    );
  }

  function tagFormatter(cell, row, rowIndex) {
    console.log(row)
    return (
      <Flex h='40px'>
      <Center axis='vertical'><Tag>{cell}</Tag></Center>
      </Flex>
    );
  }

  function audioPlayerFormatter(cell, row, rowIndex) {
    return (
      <HStack>
        <DrawerExample uuid={row.uuid}/>
        <SimpleAudioPlayer src={"http://127.0.0.1:5000/previews/" + cell} />
{/*         <ReactAudioPlayer 
          w='30px' h='20px'
        src={"http://127.0.0.1:5000/previews/" + cell} 
        controlsList='nodownload nomute novolume noplaybackrate' controls
        /> */}
        </HStack>
    );
  }

  const selectOptions = {
    'Native Instruments': 'Native Instruments',
    'Waves': 'Waves',
    'Arturia': 'Arturia'
  };
  const columns = [{dataField:"name",text:"Preset", formatter:itemFormatter, sort:true, filter: textFilter()},
  {text:"Category", },
  {dataField:"bank1", text:"Product", formatter:tagFormatter, sort:true },
  {dataField:"vendor", sort:true, formatter:tagFormatter, 
  filter: multiSelectFilter({
    options: selectOptions
  }) },
  {dataField:"preview", formatter:audioPlayerFormatter} ] 

  return (
    <ChakraProvider>
      <Center><Image width="100%"  src='https://www.native-instruments.com/typo3temp/pics/img-welcome-hero-komplete-14-collectors-edition-product-page-01-welcome-1-a86a09c8259bac123c375a639a08af76-d@2x.jpg' alt='Dan Abramov' /></Center>
      <Center>
      <Box w='1200px'>
      <BootstrapTable keyField='uuid' data={data} 
      columns={columns}
      //condensed
      bordered={ false }
      pagination={paginationFactory()}
      filter={filterFactory()}
      filterPosition="bottom"
      />
      </Box>
      </Center>
    </ChakraProvider>

  );
}
// https://store.native-instruments.com/media/catalog/product/
// https://store.native-instruments.com/media/catalog/product/cache/93de93835928c4668a602c7b4a5731c7/r/o/rounds-shop_3_1_2.png
// https://store.native-instruments.com/media/catalog/product/cache/93de93835928c4668a602c7b4a5731c7/n/o/nocturnal_state_shop_1_1_3.png
// https://store.native-instruments.com/media/catalog/product/cache/93de93835928c4668a602c7b4a5731c7/p/d/pd_massive_sp_4_1_2.png

function DrawerExample(props) {
  const { isOpen, onOpen, onClose } = useDisclosure() 
  const btnRef = React.useRef()

  const [data_sim,setSIMData]=useState([])
  useEffect(()=>{
    getSIMData() 
  },[]);

  const getSIMData=()=>{
    axios('http://127.0.0.1:5000/similarity_search_uuid/'+ props.uuid).then(res=>{
      console.log(res.data)
      setSIMData(res.data)
    })
  };

  if (!data_sim) return "loading";

  return (
    <>
      <IconButton icon={<FiSearch />} variant="text" ref={btnRef} onClick={onOpen}/>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="xl">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Similar Sounds</DrawerHeader>
            <DrawerBody>
            <RecommendedPresets ids={data_sim}/>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

const RecommendedPresets = (props) => (

  props.ids.map( function (x) 
  { 
    return <HStack>
      <Box>{x.name}({(100 - x.score * 100).toFixed(2)}%)</Box>
      <Spacer />
      <ReactAudioPlayer 
      w='100px'
      src={"http://127.0.0.1:5000/previews/" + x.preview} 
      controlsList='nodownload nomute novolume noplaybackrate'
      controls/>
    </HStack>
    
}))

class SimpleAudioPlayer extends Component {
  // Create state
  state = {
  
    // Get audio file in a variable
    audio: new Audio(this.props.src),
  
    // Set initial state of song
    isPlaying: false,
  };
  
  // Main function to handle both play and pause operations
  playPause = () => {
  
    // Get state of song
    let isPlaying = this.state.isPlaying;
  
    if (isPlaying) {
      // Pause the song if it is playing
      this.state.audio.pause();
    } else {
  
      // Play the song if it is paused
      this.state.audio.play();
    }
  
    // Change the state of song
    this.setState({ isPlaying: !isPlaying });
  };
  
  render() {
    return (
      <div>
        {/* Button to call our main function */}
        <IconButton variant="text" icon={this.state.isPlaying ? <FiPause />: <FiPlay />} onClick={this.playPause}/>
      </div>
    );
  }
}


export default App;
