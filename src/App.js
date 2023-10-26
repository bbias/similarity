
import {
  ChakraProvider,
  Box,
  Tag,
  Text,

  Image,
  HStack,
  Center,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Drawer,
  DrawerHeader,
  DrawerBody,
  Input,
  InputGroup,
  InputRightElement,
  CircularProgress,
  CircularProgressLabel,
 
  useDisclosure,
  IconButton,
  Flex, 
  VStack
} from '@chakra-ui/react';
import React, { Component, useCallback }  from 'react';
import { FiPlay, FiSearch, FiPause } from "react-icons/fi"
import 'react-dropzone-uploader/dist/styles.css'

import axios from 'axios';
import {useEffect, useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import {useDropzone} from 'react-dropzone'

function App() {

  const columns = [{dataField:"name",text:"Preset", formatter:itemFormatter, sort:true, filter: textFilter()},
  {text:"Mode", formatter:modeFormatter },
  {text:"Category", formatter:categoryFormatter },
  {dataField:"product", text:"Product", formatter:productFormatter, sort:true, filter: textFilter() },
  {dataField:"vendor", text:"Vendor", formatter:tagFormatter, sort:true, filter: textFilter() },
  {dataField:"preview", formatter:audioPlayerFormatter} ] 

  const [data,setData]=useState([])
  useEffect(()=>{
    axios('http://127.0.0.1:5000/sound_info').then(res=>{
      console.log("App::useEfect")
      setData(res.data)
    })
  },[]);

  return (
    <ChakraProvider>
      <Center>
      <VStack>
      <Image width="100%"  src='https://www.native-instruments.com/typo3temp/pics/img-welcome-hero-komplete-14-collectors-edition-product-page-01-welcome-1-a86a09c8259bac123c375a639a08af76-d@2x.jpg' alt='Dan Abramov' />
      
      <HStack w='1200px'><DrawerExample2 w='800px'/><DrawerExample3 w='400px'/></HStack>
    
      </VStack>  
      </Center>

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

function DrawerExample(props) {
  const { isOpen, onOpen, onClose } = useDisclosure() 
  const btnRef = React.useRef()

  const [data_sim,setSIMData]=useState([])
  useEffect(()=>{
    getSIMData() 
  },[]);

  const getSIMData=()=>{

    var str
    if (props.hasOwnProperty('uuid'))
    {
      str = 'http://127.0.0.1:5000/similarity_search_uuid/'+ props.uuid
      axios(str).then(res=>{
        console.log(res.data)
        setSIMData(res.data)
      })
    }
  };

   const columns = [
    {text:"", formatter:matchFormatter , width:'40px'},
    {dataField:"name",text:"Preset", formatter:itemFormatter,},
 
  {text:"Mode", formatter:modeFormatter , width:'300px'},
  {text:"Category", formatter:categoryFormatter },
  {dataField:"product", text:"Product", formatter:productFormatter, },
  {dataField:"vendor", text:"Vendor", formatter:tagFormatter, },
  {dataField:"preview", formatter:audioPlayerFormatter} ] 

  if (!data_sim) return "loading";

  return (
    <>
      <IconButton icon={<FiSearch />} variant="text" ref={btnRef} onClick={onOpen}/>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="full">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Similar Sounds</DrawerHeader>
            <DrawerBody>
                 <BootstrapTable keyField='uuid' data={data_sim} 
                    columns={columns}
                    bordered={ false }
                    />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

function DrawerExample2() {
  const { isOpen, onOpen, onClose } = useDisclosure() 
  const btnRef = React.useRef()


  const [inputValue, setInputValue] = useState([])
  const [displayText, setDisplayText] = useState([]);

  const handleOpenDrawer = () => {
    setDisplayText(inputValue);
    onOpen()
  };

  const [data_sim,setSIMData]=useState([])
  useEffect(()=>{
    if (displayText !== "")
      {
        var str = 'http://127.0.0.1:5000/similarity_search_text/'+ displayText
        console.log(str)

        axios(str).then(res=>{
          console.log(res.data)
          setSIMData(res.data)
        })
      } 
  },[displayText]);

   const columns = [
    {text:"", formatter:matchFormatter , width:'40px'},
    {dataField:"name",text:"Preset", formatter:itemFormatter,},
 
  {text:"Mode", formatter:modeFormatter , width:'300px'},
  {text:"Category", formatter:categoryFormatter },
  {dataField:"product", text:"Product", formatter:productFormatter, },
  {dataField:"vendor", text:"Vendor", formatter:tagFormatter, },
  {dataField:"preview", formatter:audioPlayerFormatter} ] 

  if (!data_sim) return "loading";

  return (
    <>
      <InputGroup size='md' w='1200px'>
        <Input
          pr='4.5rem'
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type here to search for sounds..."
          />
      <InputRightElement width='4.5rem'>
      
      <IconButton icon={<FiSearch />} variant="text" ref={btnRef} onClick={handleOpenDrawer}/>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="full">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Similar Sounds</DrawerHeader>
            <DrawerBody>
                 <BootstrapTable keyField='uuid' data={data_sim} 
                    columns={columns}
                    bordered={ false }
                    />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      </InputRightElement>
      </InputGroup>
    </>
  )
}

function DrawerExample3() {
  const { isOpen, onOpen, onClose } = useDisclosure() 
  const btnRef = React.useRef()

  const [data_sim,setSIMData]=useState([])

  function MyDropzone() {
    const onDrop = useCallback(acceptedFiles => {
      uploadFile(acceptedFiles[0])
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
    )
  }

  function uploadFile(file) 
  {
    var formData = new FormData();
    formData.append("file", file);

    axios.postForm('http://127.0.0.1:5000/search_by_sound', {
      'myVar' : 'foo',
      'file[]': [file]
    }).then(res => {
      setSIMData(res.data);
      onOpen();
      console.log('SUCCESS!!');
    })
    .catch(function () {
      console.log('FAILURE!!');
    });
  }

   const columns = [
    {text:"", formatter:matchFormatter , width:'40px'},
    {dataField:"name",text:"Preset", formatter:itemFormatter,},
 
  {text:"Mode", formatter:modeFormatter , width:'300px'},
  {text:"Category", formatter:categoryFormatter },
  {dataField:"product", text:"Product", formatter:productFormatter, },
  {dataField:"vendor", text:"Vendor", formatter:tagFormatter, },
  {dataField:"preview", formatter:audioPlayerFormatter} ] 

  if (!data_sim) return "loading";

  return (
    <>
      <MyDropzone/>
      
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="full">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Similar Sounds</DrawerHeader>
            <DrawerBody>
                 <BootstrapTable keyField='uuid' data={data_sim} 
                    columns={columns}
                    bordered={ false }
                    />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

    </>
  )
}


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

function tagFormatter(cell, row, rowIndex) {
    console.log(row)
    return (
      <Flex h='40px'>
      <Center axis='vertical'>
      { cell ?  <Tag m='2px' size='sm'>{cell}</Tag> : "" } 
      </Center>
      </Flex>
    );
  }

  function productFormatter(cell, row, rowIndex) {
    console.log(row)
    return (
      <Flex h='40px'>
      <Center axis='vertical'>
        <Image loading="eager" boxSize='35px' mr={3} fallbackSrc='https://via.placeholder.com/35' src={"http://127.0.0.1:5000/assets/"+row.upid} />
      { cell ?  <Tag m='2px' size='sm'>{cell}</Tag> : "" } 
      </Center>
      </Flex>
    );
  }

   function modeFormatter(cell, row, rowIndex) {
    
    const modes = row.mode.split(",");

    return (
      <Flex h='40px' >
      <Center axis='vertical'>
        {modes.map( function (x) 
        {
          if (x) {return <Tag m='2px' size='sm'>{x}</Tag>} 
          return ""
        })
        }
        </Center>
      </Flex>
    );
  }

   function categoryFormatter(cell, row, rowIndex) {
    console.log(row)
    return (
      <Flex h='40px'>
      <Center axis='vertical'>
         { row.category ?  <Tag m='2px' size='sm'>{row.category}</Tag> : "" } 
        {  row.subcategory ?  <Tag m='2px' size='sm'>{row.subcategory}</Tag> : "" }
        </Center>
      </Flex>
    );
  }

  function audioPlayerFormatter(cell, row, rowIndex) {
    return (
      <HStack>
        <DrawerExample uuid={row.uuid}/>
        <SimpleAudioPlayer src={"http://127.0.0.1:5000/previews/" + cell} preload="none"/>
        </HStack>
    );
  }

  function itemFormatter(cell, row, rowIndex) {
    return (
      <Flex h='40px'>
        <Center axis='vertical'><Text as='b'>{row.name}</Text></Center>
      </Flex>
    );
  }

  function matchFormatter(cell, row, rowIndex) {

    const score = ((1-row.score)*100 +100)/2;

    return (
      <Flex h='40px'>
        <Center axis='vertical'>
          <CircularProgress colorScheme='green' size='35px' value={score}>
          <CircularProgressLabel>{score.toFixed(1)}</CircularProgressLabel></CircularProgress>
          </Center>
      </Flex>
    );
  }

 



export default App;
