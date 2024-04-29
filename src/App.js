import './App.css';
import { React, useState, useEffect, useRef } from 'react';
import { Gif } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useAsync } from "react-async-hook";
import AdSense from 'react-adsense';
import ImgurComponent from './Imgur';
import EbayComponent from './Ebay';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";

const EAR_THRESHOLD = 0.30;
let event;
let blinkCount = 0;
let windowtop = 0;

const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'mediapipe', // or 'tfjs'
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
}
// const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
const network = await facemesh.load({
  inputResolution: { width: 720, height: 500 },
  scale: 0.8
});

const keyword_extractor = require("keyword-extractor");


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//Euclidean distance between two 
function getEAR(upper, lower) {
  function getEucledianDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  return (
    (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1])
      + getEucledianDistance(
        upper[3][0],
        upper[3][1],
        lower[2][0],
        lower[2][1],
      ))
    / (2
      * getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
  );
}

async function startPrediciton(video) {
  // console.log("prediction");
  // Sending video to model for prediction
  const predictions = await network.estimateFaces(video);
  //console.log(predictions[0].annotations.noseTip[0][1]);

  //model.estimateFaces({
  //  input: video,
  //});

  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      // Right eye parameters
      const lowerRight = prediction.annotations.rightEyeUpper0;
      const upperRight = prediction.annotations.rightEyeLower0;
      const rightEAR = getEAR(upperRight, lowerRight);
      // Left eye parameters
      const lowerLeft = prediction.annotations.leftEyeUpper0;
      const upperLeft = prediction.annotations.leftEyeLower0;
      const leftEAR = getEAR(upperLeft, lowerLeft);
      // if(leftEAR < 0.3){
      //   console.log(leftEAR);
      // }
      // True if the eye is closed
      const blinked = leftEAR <= EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD;

      // Determine how long you blinked
      if (blinked) {
        //console.log("blinked!!!!");
        event = {
          shortBlink: false,
          longBlink: false,
        };
        blinkCount += 1;
      } else {
        event = {
          shortBlink: blinkCount <= 5 && blinkCount !== 0,
          longBlink: blinkCount > 5,
        };
        blinkCount = 0;
      }
    });
  }
  return event;
}

const keywords = [];

function App() {
  const [currentData, setCurrentData] = useState(0)
  const [currentDataFive, setCurrentDataFive] = useState(5)
  const [vintedcurrentData, setVintedCurrentData] = useState(0)
  const [data, setData] = useState([]);
  const [vinted, setVinted] = useState([]);
  const [ebaydata, setEbay] = useState([]);
  const [clickedData, setClickedData] = useState([])
  const [clickedDataFive, setClickedDataFive] = useState([])
  const [clickedVintedData, setClickedVintedData] = useState([])
  const [blink, setBlink] = useState("visible")
  const [noblinking, setBlinking] = useState("none")
  const videoRef = useRef(null);
  const webcamReference = useRef(null);
  const canvasReference = useRef(null);


  const apikey = process.env.REACT_APP_GNEWS_KEY;
  const category = 'world';
  const url = 'https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=en&country=us&max=50&apikey=' + apikey;
  useEffect(() => {
   fetch(url).then(result => result.json()).then(alldata => setData(alldata.articles)).catch(error => console.log(error.message))
  }, [])

  const urlvinted = 'https://vinted3.p.rapidapi.com/getSearch?country=us&page=1&order=newest_first';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_VINTED_KEY,
      'X-RapidAPI-Host': 'vinted3.p.rapidapi.com',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  };

  useAsync(async () => {
    try {
      const response = await fetch(urlvinted, options);
      const result = await response.text();
      const jsondata = JSON.parse(result);
      // console.log(jsondata);
      setVinted(jsondata);
    } catch (error) {
      console.error(error);
    }
  }, [])

  // const ebaycategory = "drones"
  // const ebayurl = "https://cors-anywhere.herokuapp.com/https://api.ebay.com/buy/browse/v1/item_summary/search?q=drone&limit=3"
  // useEffect(() => {
  //  fetch(ebayurl).then(result => result.json()).then(alldata => setEbay(alldata)).catch(error => console.log(error.message))
  // }, [])
  // console.log(ebaydata[0]);

  async function nextData() {
    console.log("next data lets go");
    setBlink("hidden");
    setTimeout(() => {
      setBlink("visible");
      setBlinking("block");
      // setBlinkGifUrl("https://external-pages.s3.amazonaws.com/art/blink.gif")
    }, 250);
    setBlinking("none");
    
    const nextIndex = currentData >= data.length - 1 ? 0 : currentData + 1;
    setCurrentData(nextIndex);
    setClickedData([...clickedData, currentData]);
    const nextIndexFive = currentDataFive >= data.length - 1 ? 0 : currentDataFive + 1;
    setCurrentDataFive(nextIndexFive);
    setCurrentDataFive([...clickedDataFive, currentDataFive]);
    const vintedNextIndex = vintedcurrentData >= vinted.length - 1 ? 0 : vintedcurrentData + 1;
    setVintedCurrentData(vintedNextIndex);
    setClickedVintedData([...clickedVintedData, vintedcurrentData]);
  }

  const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY)

  function GifDemo() {
    const [gif, setGif] = useState(null);

    const extraction_result = keyword_extractor.extract(data[currentData].description,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        return_chained_words: true,
        remove_duplicates: true
    });    

    useAsync(async () => {
        
      // console.log(extraction_result[0]);
      // const { data1 } = await giphyFetch.search('cute', {  tag: 'blink', sort: 'relevant', limit: 5, type: 'gifs' })
      const { data1 } = await giphyFetch.search(extraction_result[0], { sort: 'relevant', lang: 'es', limit: 10, type: 'stickers' })
      if(typeof data1 == "undefined"){
        //console.log("here");
        const { data } = await giphyFetch.random({ tag: 'blink', type: 'stickers' });
        setGif(data);
      }    
      else{
        // console.log(data1);
        // console.log("bla");
        setGif(data1[0]);
      }   
      }, []);
    return gif && <Gif gif={gif} width={100} style={{left:getRandomArbitrary(-1, 1)*20 + "%",top:getRandomArbitrary(-1, 1)*35 + "%"}} backgroundColor='transparent' height={100} />;
  }

  const callbackcall = async () => {
    setInterval(() => {
      requestpredict();
    }, 100);
  };

  const requestpredict = async () => {
    //solve this later
    if(document.querySelectorAll('.li').length%12==1){
      windowtop += window.innerHeight/2;
      window.scrollTo({top: windowtop, behavior: 'smooth'});
    }
    if (
      typeof webcamReference.current !== "undefined" &&
      webcamReference.current !== null &&
      webcamReference.current.video.readyState === 4
    ) {
        // Get Video Properties
        const video = webcamReference.current.video;
        const videoWidth = webcamReference.current.video.videoWidth;
        const videoHeight = webcamReference.current.video.videoHeight;
        // Set video width
        webcamReference.current.video.width = videoWidth;
        webcamReference.current.video.height = videoHeight;
        // Make Detections
        // console.log(video);
        const result = await startPrediciton(video);
        // console.log(result);
        if (result) {
         if (result.longBlink) {
            //await nextData();
          } else if (result.shortBlink) {
            //await nextData();
          }
          else{
            return;
          }
        }
      }
  }

  callbackcall();

  return (
    <div className="App">
      <Webcam
        ref={webcamReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500,
          display: "none"
        }}
      />
      <div className="tabloid">
          <div className="blink-button">
            {/* <div className="title">Blink to update: </div> */}
            <button className="blink-img" onClick={() => nextData()}>
              <img className="blink yesblink" src="eyes.gif" alt="Blinking eye jpg"/>
              <img className="blink noblink" style={{ display: noblinking }} src="eyesopen.jpg" alt="Blinking eye gif"/>
            </button>  
            <div className="shimmer-shell"><p className="shimmer">Click...</p></div>
          </div>
            <div style={{ visibility: blink }} className="answers"> 
              {data[currentData] && (
                <div className='li' id={ Math.random()>0.15 ? 'blink' : '' } key={data[currentData].publishedAt}>
                  <h2 className="newstitle">{data[currentData].title}</h2>
                  <p className="newscontent" id={ Math.random()>0.10 ? 'tired' : '' }>{data[currentData].content}</p>
                  <img className="newsimg" id={ Math.random()>0.25 ? 'blink' : '' } style={{left:Math.random()*15 + "%",top:Math.random()*40 + "%"}} src={data[currentData].image}></img>
                  <div className="gif">
                    <GifDemo/>
                    {/* <div className='imgur'><ImgurComponent/></div> */}
                  </div>
                </div>
              )}
              {Math.random() > 0.4 && clickedData.length > 0 && ( 
                <div className="li">
                  <ImgurComponent/>
                </div>
              )}
              {clickedData.length > 0 && clickedData.map((questionIndex, index) => (
                Math.random() > 0.3
                ? (
                <div className="li" id={ Math.random()>0.15 ? 'blink' : '' } key={data[questionIndex].publishedAt}>
                  <h2 className="newstitle">{data[questionIndex].title}</h2>
                  <p className="newscontent" id={ Math.random()>0.10 ? 'tired' : '' }>{data[questionIndex].content}</p>
                  <img className="newsimg" style={{left:Math.random()*15 + "%",top:Math.random()*40 + "%"}} src={data[questionIndex].image}></img>
                  <div className="gif">
                    <GifDemo/>
                    {/* <div className='imgur'><ImgurComponent/></div> */}
                  </div>
                </div>
                )
                : Math.random() >= 0.4
                ? (
                  <div className="li vinteddiv" key={vinted[questionIndex].productId}>
                  {/* <div style={{background: 'white',width:'100%'}}>  */}
                    {/* <div className="imgcontainer"> */}
                    <a href={vinted[questionIndex].url}>
                      <img src={vinted[questionIndex].image} className="vintedimg" href={vinted[questionIndex].url}></img>
                    </a>
                    {/* </div> */}
                    <h3 style={{color:'red', zIndex:'6',marginTop:'-30%'}}>{vinted[questionIndex].title}</h3>
                    <h4 style={{color:'red',textDecoration:'underline',bottom:'0px',marginLeft:'5px', zIndex:'6', marginTop:'20%'}}>{vinted[questionIndex].brand}</h4>
                    <button href={vinted[questionIndex].url} id='blink' style={{
                      position: 'absolute',
                      height:'30%',
                      width:'100%',
                      outline: 'none',
                      borderRadius:'0',
                      borderWidth:'10px',
                      borderTopColor: '#FF4433',
                      borderLeftColor: '#FF4433',
                      borderBottomColor: '#DC143C',
                      borderRightColor: '#DC143C',
                      backgroundColor:'#FF3131',
                      color: 'yellow',
                      bottom:'0',
                      right:'0',
                      left:'0',
                      textAlign:'bottom',
                      cursor: 'pointer'}}>
                      <span className="buttonspan">
                        BUY NOW ON VINTED {vinted[questionIndex].price.amount}{vinted[questionIndex].price.currency}
                      </span>
                    </button>
                    {/* <h4 style={{margin: '5px', backgroundColor: '#017783', color:'white'}}>{vinted[questionIndex].price.amount}{vinted[questionIndex].price.currency}</h4> */}
                  </div>
                )
                : (
                <div className="li">
                   <ImgurComponent/>
                </div>
                )
              ))}
              {Math.random() > 0.4 && clickedData.length > 0 && ( 
                  <div className="li">
                    <ImgurComponent/>
                  </div>
              )}
            </div>
        </div>
    </div>
  );
}

export default App;

